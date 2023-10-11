require('rootpath')();
const mysql = require('mysql');
const configuracion = require("coneccion.json");

var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

var usuario_db = {};

/*
usuario_db : es un objeto que sera invocado desde los endpoint del controlador. Aquí en el MODEL, dicho objeto posee las funcionalidades que permiten la interaccion con la base de datos como getAll, update, etc. Entonces desde usuarioController puedo invocar a usuario_db.update(); o usuario_db.borrar();

funCallback: en una funcion que la enviamos desde el endpoint del controlador, es mediante esta funcion que le damos una respuesta desde el MODEL hacia el CONTROLLER, aquí lo que enviamos como error o detalles con mensajes, es lo que recibira usuarioController para seguir su proceso de respuesta hacia el forontend
*/


// C = CREATE
// usuarioController --> app.post('/', createUser);
usuario_db.create = function (usuario, funcallback) {
    // Verificar si el usuario ya existe
    const consulta = "SELECT id_usuario FROM USUARIO WHERE nickname = ?;";
    const params = [usuario.nickname];

    connection.query(consulta, params, (err, rows) => {
        if (err) {
            funcallback({
                mensajito: "error diferente",
                detalle: err
            });
        } else if (rows.length > 0) {
            funcallback({
                mensajito: "El usuario ya fue registrado",
                detalle: rows
            });
        } else {
            // Si el usuario no existe, realizar la inserción
            const insertConsulta = "INSERT INTO USUARIO (nickname, password, email, telefono, rol_id_rol) VALUES (?,?,?,?,?);";
            const insertParams = [usuario.nickname, usuario.password, usuario.email, usuario.telefono, usuario.rol_id_rol];

            connection.query(insertConsulta, insertParams, (insertErr, detail_bd) => {
                if (insertErr) {
                    funcallback({
                        mensajito: "Error al crear el usuario",
                        detalle: insertErr
                    });
                } else {
                    funcallback(undefined, {
                        mensajito: "Se creó el usuario " + usuario.nickname,
                        detalle: detail_bd
                    });
                }
            });
        }
    });
};


// D = DELETE
// usuarioController --> app.delete('/:id_usuario', deleteUser);
usuario_db.borrar = function (id_usuario, retorno) {
    const consulta = "DELETE FROM USUARIO WHERE id_usuario = ?";
    connection.query(consulta, id_usuario, (err, result) => {
        if (err) {
            retorno({
                message: "Error al eliminar el usuario",
                detail: err.code
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "No se encontró ningún usuario con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: "El usuario ha sido eliminado exitosamente.",
                    detail: result
                });
            }
        }
    });
};


usuario_db.actualizar = function (id_usuario, nuevosDatos, retorno) {
    const consulta = "UPDATE USUARIO SET nickname = ?, password = ?, email = ?, telefono = ?, rol_id_rol = ? WHERE id = ?";
    const params = [nuevosDatos.nickname, nuevosDatos.password, nuevosDatos.email, nuevosDatos.telefono, nuevosDatos.rol_id_rol, id_usuario];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            retorno({
                message: "Error al actualizar el usuario",
                detail: err.code
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "No se encontró ningún usuario con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: "El usuario ha sido actualizado exitosamente.",
                    detail: result
                });
            }
        }
    });
};


module.exports = usuario_db;