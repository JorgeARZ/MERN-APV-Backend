//importar Express
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRouter.js'


//LLamar express
const app = express();

//decirle que le enviaremos datos JSON
app.use(express.json())

//Leer ARchivo ENV
dotenv.config();

//Conectar DB
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // El origen del request esta permitido
            callback(null, true);
        }else{
            callback(new Error('No esta permitido por CORS'))
        }
    }
}
// configuracion de CORS
app.use(cors({ origin: '*' }))




// use forma es la forma que interactua entre rutas
app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)

//Variables de Entorno
const PORT = process.env.PORT || 4000;

//aplicar el puerto 
app.listen(PORT,()=>{
    console.log(`Servidor Funcionando en el Puerto ${PORT}`)
})