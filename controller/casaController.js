require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var casaDb = require("model/casa.js");
const securityController = require("controller/securityController.js");

// Rutas de escucha (endpoints) disponibles para casas
app.get('/', getAllCasas);
app.post('/', createCasa);
app.put('/:id_casa', updateCasa);
app.delete('/:id_casa', deleteCasa);

// Funciones utilizadas en los endpoints

function getAllCasas(req, res) {
    casaDb.getAll((error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    });
}

function createCasa(req, res) {
    let casa = req.body;
    casaDb.create(casa, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateCasa(req, res) {
    let nuevosDatos = req.body;
    let id_casa = req.params.id_casa;
    casaDb.update(id_casa, nuevosDatos, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteCasa(req, res) {
    casaDb.borrar(req.params.id_casa, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    });
}

module.exports = app;
