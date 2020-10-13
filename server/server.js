require('./config/config')
const express = require('express');
const mongoose = require('mongoose'); //https://mongoosejs.com/
const app = express();

//BODY PARSER, para poder recoger lo que nos llega por body 
const bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Rutas
app.use(require('./routes/index'));

//Conexion a base de datos (Local o en linea)
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online')
});
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: " + process.env.PORT);
});

