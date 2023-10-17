require('rootpath')();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("config/conexion.json");
const usuarioDb = require("model/usuario");

app.use(express.json()); 
app.post('/login', login);

function login(req, res) {
    const { nickname, password } = req.body;

    // Buscar al usuario por su nickname.
    usuarioDb.findByNickname(nickname, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (!result) {
            return res.status(401).send({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña utilizando bcrypt.
        const isPasswordValid = bcrypt.compareSync(password, result.detail.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Contraseña incorrecta' });
        }

        // Crear un objeto de usuario para incluir en el token.
        const user = {

            nickname: result.detail.nickname,
            email: result.detail.email,
            rol: result.detail.nombre,
            rol_id: result.detail.rol_id
        };

        // Generar un token JWT.
        jwt.sign(user, config.auth.accesKey, { expiresIn: '600s' }, (err, token) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            // Enviar el token como respuesta.
            res.json({ datos: user, token: token });
        });
    });
}

function verificarToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No posee token de autorización" });
    }

    try {
        // Verificar el token utilizando la password configurada en "config.auth.accesKey".
        const verified = jwt.verify(token, config.auth.accesKey);

        if (verified) {
            next(); // Continuar con la siguiente función de middleware.
        } else {
            res.status(403).send({ message: "Token inválido, permiso denegado" });
        }
    } catch (error) {
        res.status(403).send({ message: "Acceso denegado" });
    }
}
module.exports = { app, login };

