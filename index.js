const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const { leerUsuarios, guardarUsuarios } = require('./src/usersManager.js');

const PORT = process.env.PORT || 4063;

let DB = [];

//Midlewares
// Analizar req.body json
app.use(express.json());
// Leer datos antes de cada solicitud
app.use((req, res, next) => {
    DB = leerUsuarios();
    next();
});

//Endpoints
// GET 
app.get('/', (req, res) => {
    res.json(DB);
});

// GET X ID
app.get('/id/:id', (req, res) => {
    const idUser = parseInt(req.params.id);

    let resultado = DB.find(user => user.id === idUser);
    resultado ? res.json(resultado) : res.status(404).json({ Error: `Usuario id: ${idUser} no encontrado` });
});

// POST nuevo usuario
app.post('/', (req, res) => {
    const nuevoUser = req.body;
    DB.push(nuevoUser);
    guardarUsuarios(DB);
    res.status(201).json({ Nuevo: `Usuario creado` });
});

// PUT modificar un usuario
app.put('/id/:id', (req, res) => {
    const idUser = parseInt(req.params.id);
    const editUser = req.body;

    const index = DB.findIndex(user => user.id === idUser);
    if (index !== -1) {
        DB[index] = editUser;
        guardarUsuarios(DB);
        res.status(201).json({ Editado: `Usuario id: ${idUser} editado` });
    } else {
        res.status(404).json({ Error: `Usuario id: ${idUser} no encontrado` });
    }
});

// DELETE eliminar un usuario
app.delete('/id/:id', (req, res) => {
    const idUser = parseInt(req.params.id);
    const index = DB.findIndex(user => user.id === idUser);

    if (index !== -1) {
        DB.splice(index, 1);
        guardarUsuarios(DB);
        console.log({ Eliminado: `Usuario id: ${idUser} eliminado` });
        res.status(204).send();
    } else {
        res.status(404).json({ Erro: `Usuario id: ${idUser} no encontrado` });
    }
});

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ Error: 'Ruta no encontrada' });
});

// Servidor escuchando peticiones
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});