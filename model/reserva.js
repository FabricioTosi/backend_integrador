const mysql = require('mysql');
const configuracion = require('config/conexion.json'); // Corrige el nombre del archivo y usa una ruta relativa
const bcrypt = require('bcrypt');

const connection = mysql.createConnection(configuracion.database);

const reservaDb = {};

reservaDb.create = function (reserva, funcallback) {
    // Insertar una nueva reserva en la base de datos
    const consulta = "INSERT INTO RESERVA (id_reserva, fecha_reserva, fecha_inicio, fecha_fin, usuario_id_usuario, casa_id_casa, usuario_rol_id_rol) VALUES (?,?,?,?,?,?,2);";
    const params = [reserva.id_reserva, reserva.fecha_reserva, reserva.fecha_inicio, reserva.fecha_fin, reserva.usuario_id_usuario,  reserva.casa_id_casa, reserva.usuario_rol_id_rol];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funcallback({
                mensaje: "Error al crear la reserva",
                detalle: {
                    error: err.message,
                    consulta: consulta,
                    parametros: params
                }
            });
        } else {
            funcallback(undefined, {
                mensaje: "Se creó la reserva con ID " + result.insertId,
                detalle: result
            });
        }
    });
};

reservaDb.borrar = function (id_reserva, retorno) {
    // Consulta SQL para eliminar una reserva por su ID
    const consulta = "DELETE FROM reserva WHERE id_reserva = ?";
    
    // Ejecuta la consulta en la base de datos
    connection.query(consulta, id_reserva, (err, result) => {
        if (err) {
            // Si se produce un error al ejecutar la consulta
            retorno({
                mensaje: "Error al eliminar la reserva",
                detalle: err.message // Usa el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            // Si se eliminó exitosamente una reserva
            retorno(undefined, {
                mensaje: "La reserva ha sido eliminada exitosamente.",
                detalle: result
            });
        }
    });
};

reservaDb.update = function (id_reserva, nuevosDatos, retorno) {
    const consulta = "UPDATE RESERVA SET fecha_reserva = ?, fecha_inicio = ?, fecha_fin = ?, usuario_id_usuario = ?, usuario_rol_id_rol = ?, casa_id_casa = ? WHERE id_reserva = ?";
    const params = [nuevosDatos.fecha_reserva, nuevosDatos.fecha_inicio, nuevosDatos.fecha_fin, nuevosDatos.usuario_id_usuario, nuevosDatos.usuario_rol_id_rol, nuevosDatos.casa_id_casa, id_reserva];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            retorno({
                mensaje: "Error al actualizar la reserva",
                detalle: err.message // Usar el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    mensaje: "No se encontró ninguna reserva con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detalle: result
                });
            } else {
                retorno(undefined, {
                    mensaje: "La reserva ha sido actualizada exitosamente.",
                    detalle: result
                });
            }
        }
    });
};

reservaDb.getAll = function (retorno) {
    const consulta = "SELECT * FROM RESERVA";
    connection.query(consulta, (err, rows) => {
        if (err) {
            retorno({
                mensaje: "Error al obtener la lista de reservas",
                detalle: err.message // Usar el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            retorno(undefined, {
                mensaje: "Lista de reservas obtenida exitosamente",
                reservas: rows
            });
        }
    });
};

module.exports = reservaDb;
