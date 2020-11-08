//Modelos
const Usuario = require('../models/usuario');

//Imports
const express = require('express');
const jwt = require('jsonwebtoken');

//Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
            usuario: userDB,
            token
        });

    })

});

/* ********************************** LOGIN Y SING IN CON GOOGLE ******************************  */
//https://developers.google.com/identity/sign-in/web/backend-auth
//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



//LOGIN Y SING IN CON GOOGLE
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                status: "error",
                error: err
            })
        });

    //Verificar mail y contraseña
    Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                error: err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    status: "error",
                    message: "Ya fue registrado sin google, ingrese con sus datos."
                });
            } else {
                let tokenn = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //primer parametro lo que se envia, segundo la semilla, tecero cuando expira

                return res.status(200).json({
                    status: "success",
                    user: userDB,
                    token: tokenn
                })
            }
        } else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; //no importa la contraseña en este caso, google hace la verificacion

            usuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(500).json({
                        status: "error",
                        error: err
                    });
                }

                let tokenn = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //primer parametro lo que se envia, segundo la semilla, tecero cuando expira

                return res.status(200).json({
                    status: "success",
                    user: usuarioDB,
                    token: tokenn
                });
            })
        }
    });
});

module.exports = app;