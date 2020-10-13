const jwt = require('jsonwebtoken');

//Verificar token
let verificaToken = (req, res, next) => {
    //Recibo el token
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
};

//Verificar rol usuario
let verificarRole = (req, res, next) => {
    //recibo parametros
    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            status: "error",
            message: "No tienes permisos de administrador"
        });
    }

    next();
}



module.exports = { verificaToken, verificarRole };