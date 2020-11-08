//Express
const express = require('express');
let app = express();

//Tokens
let { verificaToken, verificarRole } = require('../middlewares/autenticacion');

//Models
let Categoria = require('../models/categorias');

//Rutas
app.get('/categorias', verificaToken, (req, res) => { //mostrar todas las categorias
    Categoria.find({})
        .sort('nombre') //Para ordenar como devuelve la info
        .populate('usuario', 'nombre email') //De esta manera traigo el usuario con los datos nombre y email, vinculado a su id
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al obtener las categorias",
                    error: err
                });
            }

            Categoria.countDocuments((err, conteo) => { //asi podemso saber cuantos registros hay
                return res.status(200).json({
                    status: "success",
                    categorias,
                    conteo
                });
            })
        })
});

app.get('/categoria/:id', verificaToken, (req, res) => { //mostrar categorias por id usuario
    let categoriaId = req.params.id;
    Categoria.findById(categoriaId, (err, categoriadb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al obtener las categoria",
                error: err
            });
        }

        if (!categoriadb) {
            return res.status(404).json({
                status: "error",
                message: "No existe la caractegoria solicitada",
            });
        }

        return res.status(200).json({
            status: "success",
            categoria: categoriadb
        });
    });
});

app.post('/categoria', verificaToken, (req, res) => { //crear nueva categoria
    //regresa la nueva categoria
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Error al guardar",
                error: err
            });
        }

        if (!categoriadb) {
            return res.status(400).json({
                status: "error",
                message: "Error al guardar",
                error: err
            });
        }

        return res.status(200).json({
            status: "success",
            categoria: categoriadb
        });
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => { //Actualizar la categoria
    let categoriaId = req.params.id;
    let body = req.body
    Categoria.findByIdAndUpdate(categoriaId, { nombre: body.nombre }, { new: true }, (err, categoriadb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar",
                error: err
            });
        }

        if (!categoriadb) {
            return res.status(404).json({
                status: "error",
                message: "No existe la caractegoria solicitada, imposible actualizar",
            });
        }

        return res.status(200).json({
            status: "success",
            categoria: categoriadb
        });

    })
});

app.delete('/categoria/:id', [verificaToken, verificarRole], (req, res) => { //borra categoria
    let categoriaId = req.params.id;
    Categoria.findByIdAndRemove(categoriaId, (err, categoriaDeleted) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al borrar",
                error: err
            });
        }

        if (!categoriaDeleted) {
            return res.status(404).json({
                status: "error",
                message: "No existe la categoria que quiere borrar"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Categoria borrado",
            categoria: categoriaDeleted
        });

    })
});


module.exports = app