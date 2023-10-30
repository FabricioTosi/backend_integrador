require('rootpath')();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("config/conexion.json");
var usuarioDb = require("model/usuario.js");


//controller: gestionaba peticiones y respuestas 
//model: donde tengo las querys a la BD


// -------------------------------------------------------- 
// ---- POST Login: en el body llegan las credeciales ----- 
// -------------------------------------------------------- 
app.post('/login', login);

function login(req, res) {


    const { nickname, clave } = req.body;

    usuarioDb.findByNickname(nickname, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
           
            const iguales = bcrypt.compareSync(clave, result.detail.clave);
           
            if (iguales) {
                let user = {
                    nickname: result.detail.nickname,
                    mail: result.detail.mail,
                    rol: result.detail.nombre,
                    rol_id: result.detail.rol_id
                }
               
                jwt.sign(user, config.auth.accesKey, { expiresIn: '3600s' }, (err, token) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                    } else {
                        res.json({
                            datos: user,
                            token: token
                        });
                    }
                })
            } else {
                res.status(401).send({
                    message: 'Contraseña Incorrecta'
                });
            }
        }
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


module.exports = { app, verificarToken };