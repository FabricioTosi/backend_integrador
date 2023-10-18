require('rootpath')();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

const configuracion = require("config/conexion.json"); // Asegúrate de utilizar comillas dobles para la ruta.

const imagenesController = require("controller/imagenesController.js");
const casaController = require("controller/casaController.js");
const usuarioController = require("controller/usuarioController.js");
const compraController = require("controller/compraController.js");
const reservaController = require("controller/reservaController.js");
const securityController = require("controller/securityController.js");
const auth = require("config/auth.js");
const { verificarToken } = require('./config/auth');
app.use('/security', auth.app);
app.use('/security', securityController.app);
app.use('/casa',verificarToken , casaController);
app.use('/api/usuario', usuarioController);
app.use('/api/imagenes',verificarToken , imagenesController);
app.use('/reserva',verificarToken , reservaController);
app.use('/compra',verificarToken , compraController);

// Corrige la definición de la ruta de login
app.post('/login', securityController.login);


app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Servidor escuchando en el puerto " + configuracion.server.port);
    }
});
