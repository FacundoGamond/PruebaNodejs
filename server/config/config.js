//PUERTO
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//Vencimiento del token
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//Seed del toqken (semilla)
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || "649848998321-923sadnqoq15qf8gdccaku17ojskv23q.apps.googleusercontent.com";