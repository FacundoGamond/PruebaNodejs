const mongoose = require('mongoose'); //https://mongoosejs.com/
const uniqueValidator = require('mongoose-unique-validator'); //https://www.npmjs.com/package/mongoose-unique-validator
let Schema = mongoose.Schema;
let Usuario = require('./usuario')

let CategoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true, //Para que sea unico
        required: [true, "El nombre es necesario"] //Para que sea requerido
    },
    usuario: {
        type: String,
        required: [true, "El usuario es necesario"],
        ref: Usuario
    },
});


CategoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} ya existe'
})

module.exports = mongoose.model('Categoria', CategoriaSchema);