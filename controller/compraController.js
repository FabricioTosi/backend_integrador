const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const compraDb = require('model/compra'); // Asegúrate de que la ruta del archivo sea correcta.

// Rutas de escucha (endpoints) disponibles para compras
app.get('/', getAllCompras);
app.post('/', createCompra);
app.put('/:id_compra', updateCompra);
app.delete('/:id_compra', deleteCompra);

// Funciones utilizadas en los endpoints
function getAllCompras(req, res) {
    compraDb.getAll((error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    });
}

function createCompra(req, res) {
    const compra = req.body;
    compraDb.create(compra, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateCompra(req, res) {
    const nuevosDatos = req.body;
    const id_compra = req.params.id_compra;
    compraDb.update(id_compra, nuevosDatos, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


function deleteCompra(req, res) {
    const id_compra = req.params.id_compra;
    compraDb.borrar(id_compra, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result_model.message);
        }
    });
}


module.exports = app;
