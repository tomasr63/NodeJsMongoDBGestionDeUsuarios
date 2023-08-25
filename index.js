import express from 'express';
import { usersRoute } from './routes/usuarios.js';
const app = express();
const PORT = process.env.PORT || 4063;

//Midlewares
// Analizar req.body json
app.use(express.json());
//Ruta usuarios
app.use("/usuarios", usersRoute);

// Servidor escuchando peticiones
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});