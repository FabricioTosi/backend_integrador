const mysql = require('mysql');
const configuracion = require('coneccion.json');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection(configuracion.database);

const imagenesDb = {};
// probar en postman con esta url = http://localhost:8080/imagenes
imagenesDb.create = function (imagenes, funcallback) {
    // Insertar una nueva imagen en la base de datos
    const consulta = "INSERT INTO imagenes (url, id_imagenes, casa_id_casa) VALUES (?, ?, ?);";
    
    const params = [imagenes.url, imagenes.id_imagenes, imagenes.casa_id_casa];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funcallback({
                mensaje: "Error al crear la imagen en la tabla de imagenes",
                detalle: err.message 
            });
        } else {
            if (result.affectedRows > 0) {
                funcallback(undefined, {
                    mensaje: "Se creó la imagen en la tabla de imagenes con ID " + result.insertId,
                    detalle: result
                });
            } else {
                funcallback({
                    mensaje: "No se creó la imagen en la tabla de imagenes",
                    detalle: "No se realizó ninguna inserción en la base de datos."
                });
            }
        }
    });
};


imagenesDb.borrar = function (id_imagenes, retorno) {
    const consulta = "DELETE FROM imagenes WHERE id_imagenes = ?";
    connection.query(consulta, id_imagenes, (err, result) => {
        if (err) {
            retorno({
                mensaje: "Error al eliminar la imagen en la tabla de imagenes",
                detalle: err.message
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno({
                    mensaje: "No se encontró ninguna imagen en la tabla de imagenes con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detalle: result
                });
            } else if (result.affectedRows > 0) {
                retorno(undefined, {
                    mensaje: "La imagen en la tabla de imagenes ha sido eliminada exitosamente.",
                    detalle: result
                });
            } else {
                retorno({
                    mensaje: "Error desconocido al eliminar la imagen en la tabla de imagenes",
                    detalle: "No se pudo determinar el resultado de la operación."
                });
            }
        }
    });
};


imagenesDb.update = function (id_imagenes, nuevosDatos, retorno) {
    const consulta = "UPDATE imagenes SET url = ? WHERE id_imagenes = ?";
    const params = [nuevosDatos.url,id_imagenes];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code === "ER_BAD_FIELD_ERROR") {
                retorno({
                    message: "Error al actualizar la imagen de la imagenes",
                    detail: "Uno o más campos en la consulta son incorrectos."
                }, undefined);
            } else if (err.code === "ER_DUP_ENTRY") {
                retorno({
                    message: "Error al actualizar la imagen de la imagenes",
                    detail: "Violación de una restricción única. Asegúrese de que los datos sean únicos."
                }, undefined);
            } else {
                retorno({
                    message: "Error al actualizar la imagen de la imagenes",
                    detail: err.message
                }, undefined);
            }
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "No se encontró ninguna imagen de imagenes con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detail: result
                });
            } else if (result.changedRows === 0) {
                retorno(undefined, {
                    message: "La imagen de la imagenes no se ha modificado. Compruebe si los nuevos datos son iguales a los existentes.",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: "La imagen de la imagenes ha sido actualizada exitosamente.",
                    detail: result
                });
            }
        }
    });
};
imagenesDb.getAll = function (retorno) {
    const consulta = "SELECT * FROM imagenes";
    connection.query(consulta, (err, rows) => {
        if (err) {
            retorno({
                mensaje: "Error al obtener la lista de imágenes de imageness",
                detalle: err.message 
            }, undefined);
        } else {
            if (Array.isArray(rows) && rows.length > 0) {
                retorno(undefined, {
                    mensaje: "Lista de imágenes de imageness obtenida exitosamente",
                    imagenes: rows
                });
            } else {
                retorno({
                    mensaje: "No se encontraron imágenes de imageness en la base de datos.",
                    detalle: "La consulta no devolvió resultados."
                }, undefined);
            }
        }
    });
};

module.exports = imagenesDb;
