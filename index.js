require('rootpath')();
const express = require('express');
const morgan = require('morgan');
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

const configuracion = require("conexion.json");

const imagenesController = require("controller/imagenesController.js");

const casaController = require("controller/casaController.js");

const usuarioController = require("controller/usuarioController.js");

const compraController = require("controller/compraController.js");

const reservaController = require("controller/reservaController.js");

const securityController = require("controller/securityController.js");

app.use('/security', securityController.app);
app.use('/casa', casaController);
app.use('/api/usuario', usuarioController);
app.use('/api/imagenes', imagenesController);
app.use('/reserva', reservaController);
app.use('/compra', compraController);


app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("sevidor escuchando en el puerto " + configuracion.server.port);
    }
});
