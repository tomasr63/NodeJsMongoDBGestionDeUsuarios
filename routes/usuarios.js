import express from 'express';
import { connectToMongoDB, disconnectFromMongoDB } from '../src/mongodb.js';

const usersRoute = express.Router();

//GET ALL
usersRoute.get('/', async (req, res) => {
    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }

        const db = client.db('productos_db');
        const collection = await db.collection('usuarios').find().toArray();

        res.send(collection);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos de la base de datos");

    } finally {
        await disconnectFromMongoDB();
    }
});

// GET X ID
usersRoute.get('/id/:id', async (req, res) => {
    const idUser = parseInt(req.params.id);

    if (!idUser) {
        return res.status(400).send('Formato de datos erróneo o inválido.');
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }

        const db = client.db('productos_db');
        const collection = await db.collection('usuarios').find().toArray();
        const resp = collection.find(user => user.id === idUser);

        resp ? res.json(resp) : res.status(404).send(`User id: ${idUser} no encontrado.`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos de la base de datos");
    } finally {
        await disconnectFromMongoDB();
    }

});

// POST / NEW USER
usersRoute.post('/', async (req, res) => {
    const newUser = req.body;

    if (Object.keys(newUser).length === 0) {
        res.status(400).send("datos invalidos.");
        return;
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectarse a mongo db");
            return;
        }

        const db = client.db('productos_db');
        const collection = db.collection('usuarios');

        await collection.insertOne(newUser);

        res.status(201).send("Usuario creado.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectarse a mongo db.");
    } finally {
        await disconnectFromMongoDB();
    }
});

// PUT / MODIFY USER
usersRoute.put('/id/:id', async (req, res) => {
    const idUser = parseInt(req.params.id);
    const editUser = req.body;

    if (!idUser) {
        res.status(400).send("datos invalidos");
        return;
    };

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectar con mongo db");
            return;
        }

        const db = client.db('productos_db');
        const collection = db.collection('usuarios');

        await collection.updateOne({ id: idUser }, { $set: editUser });

        res.status(201).send("Usuario actualizado");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectarse a mongo db.");
    } finally {
        await disconnectFromMongoDB();
    }
});

// DELETE USER
usersRoute.delete('/id/:id', async (req, res) => {
    const idUser = parseInt(req.params.id);

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectar con mongo db");
            return;
        }

        const db = client.db('productos_db');
        const collection = db.collection('usuarios');

        const resultado = await collection.deleteOne({id: idUser});

        if (resultado.deletedCount === 1) {
            console.log(`usuario id: ${idUser} eliminado.`);
            res.status(204).send();
        } else {
            res.status(404).send("El documento no fue encontrado o no se elimino.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectarse a mongo db.");
    } finally {
        await disconnectFromMongoDB();
    }
});

// Manejo de rutas inexistentes
usersRoute.use((req, res) => {
    res.status(404).json({ Error: 'Ruta no encontrada' });
});

export { usersRoute };