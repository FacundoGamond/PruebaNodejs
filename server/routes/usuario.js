//Modelos
const Usuario = require('../models/usuario');

//Middlewares
const { verificaToken, verificarRole } = require('../middlewares/autenticacion')

//Imports
const express = require('express');
const app = express();

//Encriptador
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt

//Filtro de variables
const _ = require('underscore');

//RUTAS
app.get('/usuario', verificaToken, (req, res) => {

    /* ASI PUEDO OBTENER LOS DATOS QUE VIENEN DEL TOKEN
    return res.json({
        usuario: req.usuario,
        email:req.usuario.email
    })
    */

    let desde = req.query.desde || 0; //para obtener parametros opcionales
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    let filtroBusqueda = {
        estado: true
    }

    Usuario.find(filtroBusqueda, 'nombre email role estado google img') //de esa manera solo nos devuelve el lo que le pedimos
        .skip(desde) //salta x cantidad de registros
        .limit(limite) //Obtiene x registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al obtener usuarios",
                    error: err
                });
            }

            Usuario.count(filtroBusqueda, (err, conteo) => { //asi podemso saber cuantos registros hay
                return res.status(200).json({
                    status: "success",
                    usuarios,
                    conteo
                });
            })


        })
})

app.post('/usuario', [verificaToken, verificarRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al guardar",
                error: err
            });
        }

        return res.status(200).json({
            status: "success",
            usuario: usuariodb
        });
    });

})

app.put('/usuario/:id', [verificaToken, verificarRole], (req, res) => {
    //Recoger parametros de la url
    let id = req.params.id;

    //Recogemos el request
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar",
                error: err
            });
        }

        return res.status(200).json({
            status: "success",
            usuario: usuariodb
        });

    })
})

app.delete('/usuario/:id', [verificaToken, verificarRole], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar",
                error: err
            });
        }

        if (!usuarioborrado) {
            return res.status(404).json({
                status: "error",
                message: "No existe el usuario que quiere borrar"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario borrado",
            usuario: usuarioborrado
        });

    })
})

app.delete('/usuario-estado/:id', [verificaToken, verificarRole], (req, res) => {
    //Recoger parametros de la url
    let id = req.params.id;

    //Recogemos el request
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar",
                error: err
            });
        }

        return res.status(200).json({
            status: "success",
            usuario: usuariodb
        });

    })
})

module.exports = app;