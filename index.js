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

const configuracion = require("coneccion.json");

const usuarioController = require("controller/usuarioController.js");

const securityController = require("controller/securityController.js");
app.use('/security', securityController.app);

app.use('/api/usuario', usuarioController);

app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("sevidor escuchando en el puerto " + configuracion.server.port);
    }
});
