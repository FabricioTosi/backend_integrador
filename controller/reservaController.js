const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reservaDb = require('model/reserva'); // Asegúrate de que la ruta del archivo sea correcta.

// Rutas de escucha (endpoints) disponibles para reservas
app.get('/', getAllReservas);
app.post('/', createReserva);
app.put('/:id_reserva', updateReserva);
app.delete('/:id_reserva', deleteReserva);

// Funciones utilizadas en los endpoints
function getAllReservas(req, res) {
    reservaDb.getAll((error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(result);
        }
    });
}

function createReserva(req, res) {
    const reserva = req.body;
    reservaDb.create(reserva, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateReserva(req, res) {
    const nuevosDatos = req.body;
    const id_reserva = req.params.id_reserva;
    reservaDb.update(id_reserva, nuevosDatos, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteReserva(req, res) {
    const id_reserva = req.params.id_reserva;
    reservaDb.borrar(id_reserva, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result_model.message);
        }
    });
}


module.exports = app;
