import Veterinario from "../models/Veterinario.js"
import generarJWT  from "../helpers/generarJWT.js"
import generarId from "../helpers/generarid.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidaPassword.js"

const registrar = async (req,res)=>{
    //Extrayendo email y password de Req Body
    const {email,nombre} = req.body

    //Prevenir si un usuario esta duplicado
    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
        const error = new Error ('Usuario registrado');
        return res.status(400).json({msg: error.message});
    }

    try{
        //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save()

        //Enviar el email 
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);
    }catch(error){
        console.log(error)
    }


    
}


const perfil = (req,res) => {
    const {veterinario} = req;
    res.json(veterinario);
};



const confirmar = async (req,res)=>{
    const {token} = req.params

    //consultar base de datos por el token
    const usuarioConfirmar = await Veterinario.findOne({token})

    //se revisa si el token es real
    if(!usuarioConfirmar){
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message})
    }
    //modificamos el token
    try{
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        //se guarda
        await usuarioConfirmar.save()
        
        res.json({msg:'usuario confirmado correctamente'})

    }catch(error){
        console.log(error)
    }
    
}

const autenticar = async (req,res) =>{
    const{email,password} = req.body
    
    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('Usuario no Existe')
        return res.status(404).json({msg: error.message})
        
    }

    //Comprobar si el usuario esta confirmado o no 
   if(!usuario.confirmado){
    
    const error = new Error('tu cuenta no ha sido confirmada')
    return res.status(403).json({msg: error.message})
   }

   //Revisar el password
   if(await usuario.comprobarPassword(password)){

    //autenticar con JWT
    res.json({
        _id:usuario.id,
        nombre:usuario.nombre,
        email:usuario.email,
        token: generarJWT(usuario.id),
    });

   }else{
    const error = new Error('Password Incorrecta')
    return res.status(403).json({msg: error.message})
   }
    
}

const olvidePassword = async (req,res)=>{
    const {email} = req.body;
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('el usuario no existe');
        return res.status(400).json({msg: error.message })
    }

    try{
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })

        res.json({msg: 'hems enviado un email con las instrucciones'})
    }catch(error){
        console.log(error)
    }
}

const comprobarToke = async(req,res)=>{
    const {token} = req.params //de la url
    
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        //El token es valido el usuario existe
        res.json({msg:'Token valido y existe'})
    }else{
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }

}
const nuevoPassword = async(req,res)=>{
    const {token} = req.params
    const {password} = req.body;
    
    const veterinario =  await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo error')
        return res.status(400).json({msg: error.message})
    }

    try{
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg: 'password modificado correctamente'})
    }catch(error){
        console.log(error)
    }
}

const actualizarPerfil = async (req,res)=>{
   const veterinario = await Veterinario.findById(req.params.id);
   if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg:error.message});
   }
   const {email} = req.body
   if(veterinario.email !== req.body.email){
    const existeEmail = await Veterinario.findOne({email})
    if(existeEmail){
        const error = new Error('Ese email ya esta en uso');
        return res.status(400).json({msg:error.message});
    }
   }

   try{
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web ;
    veterinario.telefono = req.body.telefono ;

    const veterinarioActualizado = await veterinario.save()
    res.json(veterinarioActualizado);

   }catch(error){
    console.log(error)
   }
}

const actualizarPassword = async(req,res) =>{
   //Leer datos
    const {id} = req.veterinario
    const{pwd_actual, pwd_nuevo} = req.body

   //Comprobar que el veterinario existe
   const veterinario = await Veterinario.findById(id);
   if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg:error.message});
   }


   //comprobar password
   if(await veterinario.comprobarPassword(pwd_actual)){
    //almacenar nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save()
    res.json({msg:'Password almacenado Correctamente'})
   }else{
    const error = new Error('El password Actual es Incorrecto')
    return res.status(400).json({msg:error.message});
   }



   //almacenar nuevo password
}


export {
    registrar,perfil, confirmar,autenticar,olvidePassword,comprobarToke,nuevoPassword,actualizarPerfil,actualizarPassword
}