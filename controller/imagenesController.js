const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var imagenesDb = require("model/imagenes.js");
const securityController = require("controller/securityController.js");

// Rutas de escucha (endpoints) disponibles para imageness
app.get('/', getAllimageness);
app.post('/', createimagenes);
app.put('/:id_imagenes', updateimagenes);
app.delete('/:id_imagenes', deleteimagenes);

// Funciones utilizadas en los endpoints
function getAllimageness(req, res) {
    imagenesDb.getAll((error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    });
}

function createimagenes(req, res) {
    let imagenes = req.body;
    imagenesDb.create(imagenes, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateimagenes(req, res) {
    let datosimagenes = req.body;
    let idimagenes = req.params.id_imagenes;
    imagenesDb.update(idimagenes, datosimagenes, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteimagenes(req, res) {
    imagenesDb.borrar(req.params.id_imagenes, (err, result_model) => {
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
