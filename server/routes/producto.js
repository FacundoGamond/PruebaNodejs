//Express
const express = require('express');
let app = express();

//Tokens
let { verificaToken } = require('../middlewares/autenticacion');
const { findByIdAndUpdate } = require('../models/producto');

//Models
let Producto = require('../models/producto');

//Rutas

//Obtener productos
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; //para obtener parametros opcionales
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    let filtroBusqueda = {
        disponible: true,
        usuario: req.usuario._id
    }

    Producto.find(filtroBusqueda) //de esa manera solo nos devuelve el lo que le pedimos
        .skip(desde) //salta x cantidad de registros
        .limit(limite) //Obtiene x registros
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al obtener los productos",
                    error: err
                });
            }

            Producto.count(filtroBusqueda, (err, conteo) => { //asi podemso saber cuantos registros hay
                return res.status(200).json({
                    status: "success",
                    productos,
                    conteo
                });
            })

        })
});

//Obtener un producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    let productoId = req.params.id;

    Producto.findById(productoId)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al obtener el producto",
                    error: err
                });
            }

            if (!producto) {
                return res.status(404).json({
                    status: "error",
                    message: "El producto que ingreso no existe"
                })
            }

            return res.status(200).json({
                status: "success",
                producto
            })
        })
});

//Buscar producto
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //creo una expresion regular y la i es para q no iportent may o min.
    let regex = new RegExp(termino, 'i')

    //De esta manera busca todo lo q sea simil a lo q viene por termino
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    status: "error",
                    error: err
                });
            }


            return res.status(200).json({
                status: "success",
                productos
            })
        })
});

//Crear producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productodb) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: "Error al guardar",
                error: err
            });
        }

        return res.status(201).json({
            status: "success",
            usuario: productodb
        });
    });

});

//Actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {
    //Recoger parametros de la url
    let productoId = req.params.id;

    //Recogemos el request
    let body = req.body;

    Producto.findByIdAndUpdate(productoId, body, { new: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productodb) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al actualizar",
                    error: err
                });
            }

            if (!productodb) {
                return res.status(404).json({
                    status: "error",
                    message: "No existe el producto que quiere actualizar"
                });
            }

            return res.status(200).json({
                status: "success",
                producto: productodb
            });

        })
});

//Borrar producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    let productoId = req.params.id;

    Producto.findByIdAndUpdate(productoId, { disponible: false }, { new: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productodb) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al actualizar",
                    error: err
                });
            }

            if (!productodb) {
                return res.status(404).json({
                    status: "error",
                    message: "No existe el producto que quiere actualizar"
                });
            }

            return res.status(200).json({
                status: "success",
                producto: productodb
            });

        })
});


module.exports = app