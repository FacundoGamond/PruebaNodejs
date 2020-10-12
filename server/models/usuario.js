const mongoose = require('mongoose'); //https://mongoosejs.com/
const uniqueValidator = require('mongoose-unique-validator'); //https://www.npmjs.com/package/mongoose-unique-validator
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true, //Para que sea unico
        required: [true, "El correo es necesario"] //Para que sea requerido
    },
    password: {
        type: String,
        required: [true, "La contraseña es necesaria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE', //Valor por defecto
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Para que no se imprima la contraseña en pantalla cuando hacemos la llamada
UsuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;

    return userObjet;
}

UsuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} ya existe'
})

module.exports = mongoose.model('Usuario', UsuarioSchema);