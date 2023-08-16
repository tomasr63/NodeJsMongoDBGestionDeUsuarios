const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

function guardarUsuarios(usuarios) {
    const datos = JSON.stringify(usuarios);
    fs.writeFileSync(__dirname + process.env.DATABASE_PATH, datos);
}

function leerUsuarios() {
    const usuariosString = fs.readFileSync(__dirname + process.env.DATABASE_PATH, "utf8");
    const usuarios = JSON.parse(usuariosString);
    return usuarios;
}

module.exports = {
    leerUsuarios,
    guardarUsuarios
}