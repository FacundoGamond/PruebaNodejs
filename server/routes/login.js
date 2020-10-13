//Modelos
const Usuario = require('../models/usuario');

//Imports
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

//Encriptador
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt


app.post('/login', (req, res) => {
    let body = req.body;

    //Verificar mail y contraseña
    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                error: err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                status: "error",
                message: "(Usuario) o contraseña incorrectos"
            });
        }

        //verificamos que la contraseña haga match con la de la base de datos
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(404).json({
                status: "error",
                message: "Usuario o (contraseña) incorrectos"
            });
        }

        //Crear token
        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //primer parametro lo que se envia, segundo la semilla, tecero cuando expira

        return res.status(200).json({
            status: "success",
            user: userDB,
            token
        });

    })

});

module.exports = app;