require('./config/config')
const express = require('express');
const app = express();

//BODY PARSER, para poder recoger lo que nos llega por body 
const bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//Tipos de peticiones
app.get('/usuario', function (req, res) {
    res.json('get usuario')
})

app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            status: "error",
            message: "El nombre no fue introducido"
        });
    } else {
        res.status(200).json({
            status: "success",
            persona: body
        });
    }


})

app.put('/usuario/:id', function (req, res) {
    //Recoger parametros de la url
    let id = req.params.id;
    res.json('put usuario con id: ' + id);
})

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: " + process.env.PORT);
});