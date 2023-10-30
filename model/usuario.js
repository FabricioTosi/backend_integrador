require('rootpath')();
const mysql = require('mysql');
const configuracion = require("config/conexion.json");
const bcrypt = require('bcrypt');

var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

var usuario_db = {};

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
             let claveCifrada = bcrypt.hashSync(usuario.password, 10);

            // Si el usuario no existe, realizar la inserción
            const insertConsulta = "INSERT INTO USUARIO (id_usuario, nickname, password, email, telefono, rol_id_rol) VALUES (?,?,?,?,?,?);";
            const insertParams = [usuario.id_usuario, usuario.nickname, claveCifrada, usuario.email, usuario.telefono, usuario.rol_id_rol];

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

usuario_db.update = function (id_usuario, nuevosDatos, retorno) {
    if (!nuevosDatos.password) {
        // Handle the case where the password is missing or empty
        retorno({
            message: "Password is missing or empty",
            detail: "Password is required for the update."
        }, undefined);
        return;
    }

    let claveCifrada = bcrypt.hashSync(nuevosDatos.password, 10);
    const consulta = "UPDATE USUARIO SET nickname = ?, password = ?, email = ?, telefono = ?, rol_id_rol = ? WHERE id = ?";
    const params = [nuevosDatos.nickname, claveCifrada, nuevosDatos.email, nuevosDatos.telefono, nuevosDatos.rol_id_rol, id_usuario];

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

// GET ALL
usuario_db.getAll = function (retorno) {
    const consulta = "SELECT * FROM USUARIO";
    connection.query(consulta, (err, rows) => {
        if (err) {
            retorno({
                message: "Error al obtener la lista de usuarios",
                detail: err
            }, undefined);
        } else {
            retorno(undefined, {
                message: "Lista de usuarios obtenida exitosamente",
                usuarios: rows
            });
        }
    });
};

// -----------------------------------------------------------------------------

//securityController --> app.post('/login', login);
usuario_db.findByNickname = function (nickname, funCallback) {
    //var consulta = 'SELECT * FROM usuario WHERE nickname = ?';   
    var consulta = 'SELECT usuario.*, rol.nombre_rol FROM usuario INNER JOIN rol ON usuario.rol_id_rol = rol.id_rol WHERE usuario.nickname = (?) LIMIT 0, 1000';
   connection.query(consulta, nickname, function (err, result) {
       if (err) {
           funCallback(err);
           return;
       } else {

           if (result.length > 0) {
               funCallback(undefined, {
                   message: `Usuario encontrado`,
                   detail: result[0]
               });
           } else {
               funCallback({
                   message: "No existe un usuario que coincida con el criterio de busqueda",
                   detail: result
               });
           }
       }
   });
}

module.exports = usuario_db;