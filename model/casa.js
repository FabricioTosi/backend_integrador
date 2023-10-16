const mysql = require('mysql');
const configuracion = require("coneccion.json");
const bcrypt = require('bcrypt');

const connection = mysql.createConnection(configuracion.database);

const casaDb = {};

casaDb.create = function (casa, funcallback) {
    // Insertar una nueva casa en la base de datos
    const consulta = "INSERT INTO CASA (id_casa, descripccion, precio_compra, superficie, precio_alquiler) VALUES (?,?,?,?,?);";
    const params = [casa.id_casa, casa.descripccion, casa.precio_compra, casa.superficie, casa.precio_alquiler];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funcallback({
                mensajito: "Error al crear la casa",
                detalle: err
            });
        } else {
            funcallback(undefined, {
                mensajito: "Se creó la casa con ID " + casa.id_casa,
                detalle: result
            });
        }
    });
};

casaDb.borrar = function (id_casa, retorno) {
    const consulta = "DELETE FROM CASA WHERE id_casa = ?";
    connection.query(consulta, id_casa, (err, result) => {
        if (err) {
            retorno({
                message: "Error al eliminar la casa",
                detail: err.code
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "No se encontró ninguna casa con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: "La casa ha sido eliminada exitosamente.",
                    detail: result
                });
            }
        }
    });
};

// probar con postman url = http://localhost:8080/casa/:id_casa
casaDb.update = function (id_casa, nuevosDatos, retorno) {
    const consulta = "UPDATE CASA SET descripccion = ?, precio_compra = ?, superficie = ?, precio_alquiler = ? WHERE id_casa = ?";
    const params = [nuevosDatos.descripccion, nuevosDatos.precio_compra, nuevosDatos.superficie, nuevosDatos.precio_alquiler, id_casa];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            retorno({
                message: "Error al actualizar la casa",
                detail: err.code
            }, undefined);
        } else {
            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "No se encontró ninguna casa con el ID proporcionado. Verifique el ID e inténtelo de nuevo.",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: "La casa ha sido actualizada exitosamente.",
                    detail: result
                });
            }
        }
    });
};

casaDb.getAll = function (retorno) {
    const consulta = "SELECT * FROM CASA";
    connection.query(consulta, (err, rows) => {
        if (err) {
            retorno({
                message: "Error al obtener la lista de casas",
                detail: err
            }, undefined);
        } else {
            retorno(undefined, {
                message: "Lista de casas obtenida exitosamente",
                casas: rows
            });
        }
    });
};

module.exports = casaDb;
