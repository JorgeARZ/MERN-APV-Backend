import express from "express";
const router = express.Router();
import {registrar,perfil,confirmar,autenticar,olvidePassword,comprobarToke,nuevoPassword,actualizarPerfil,actualizarPassword} from '../controllers/veterinarioController.js'
import checkAuth from "../middleware/authMiddleware.js";


//area publica
//Manda registrar
router.post('/',registrar)
//confirmar  token, parametro dinamico 
router.get('/confirmar/:token',confirmar)
//Autenticar
router.post('/login',autenticar)
//Olvide Password
router.post('/olvide-password',olvidePassword)
router.get('/olvide-password/:token', comprobarToke)
router.post('/olvide-password/:token', nuevoPassword)



//area privada
router.get('/perfil',checkAuth,perfil)
router.put('/perfil/:id',checkAuth,actualizarPerfil)
router.put('/actualizar-password',checkAuth,actualizarPassword)

export default router;