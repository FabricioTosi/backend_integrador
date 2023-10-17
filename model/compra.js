const mysql = require('mysql');
const configuracion = require('conexion.json'); 
const bcrypt = require('bcrypt');

const connection = mysql.createConnection(configuracion.database);

const compraDb = {};

compraDb.create = function (compra, funcallback) {
    // Insertar una nueva compra en la base de datos
    const consulta = "INSERT INTO COMPRA (id_compra, fecha_compra, usuario_id_usuario, usuario_rol_id_rol, casa_id_casa) VALUES (?,?,?,?,?);";
    const params = [compra.id_compra, compra.fecha_compra, compra.usuario_id_usuario, compra.usuario_rol_id_rol, compra.casa_id_casa];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funcallback({
                mensaje: "Error al crear la compra",
                detalle: {
                    error: err.message,
                    consulta: consulta,
                    parametros: params
                }
            });
        } else {
            funcallback(undefined, {
                mensaje: "Se creó la compra con ID " + result.insertId,
                detalle: result
            });
        }
    });
};

compraDb.borrar = function (id_compra, retorno) {
    // Consulta SQL para eliminar una compra por su ID
    const consulta = "DELETE FROM COMPRA WHERE id_compra = ?";
    
    // Ejecuta la consulta en la base de datos
    connection.query(consulta, id_compra, (err, result) => {
        if (err) {
            // Si se produce un error al ejecutar la consulta
            retorno({
                mensaje: "Error al eliminar la compra",
                detalle: err.message // Usa el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            // Si se eliminó exitosamente una compra
            retorno(undefined, {
                mensaje: "La compra ha sido eliminada exitosamente.",
                detalle: result
            });
        }
    });
};

compraDb.update = function (id_compra, nuevosDatos, retorno) {
    const consulta = "UPDATE COMPRA SET fecha_compra = ?, usuario_id_usuario = ?, usuario_rol_id_rol = ?, casa_id_casa = ? WHERE id_compra = ?";
    const params = [nuevosDatos.fecha_compra, nuevosDatos.usuario_id_usuario, nuevosDatos.usuario_rol_id_rol, nuevosDatos.casa_id_casa, id_compra];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            retorno({
                mensaje: "Error al actualizar la compra",
                detalle: err.message // Usar el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    mensaje: "No se encontró ninguna compra con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detalle: result
                });
            } else {
                retorno(undefined, {
                    mensaje: "La compra ha sido actualizada exitosamente.",
                    detalle: result
                });
            }
        }
    });
};

compraDb.getAll = function (retorno) {
    const consulta = "SELECT * FROM COMPRA";
    connection.query(consulta, (err, rows) => {
        if (err) {
            retorno({
                mensaje: "Error al obtener la lista de compras",
                detalle: err.message // Usar el mensaje de error proporcionado por la base de datos
            }, undefined);
        } else {
            retorno(undefined, {
                mensaje: "Lista de compras obtenida exitosamente",
                compras: rows
            });
        }
    });
};

module.exports = compraDb;
