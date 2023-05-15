import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from '../helpers/generarid.js'


const veterinarioSchema = mongoose.Schema({
    nombre: {
        //Tipo de dato
        type:String,
        //validacion
        required: true,
        //Quitar o elimina Espacios
        trim: true
    },
    password:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        //Unico
        unique:true,
        trim:true,
    },
    telefono:{
        type: String,
        //No es obligatorio
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null
    },
    token:{
        type:String,
        default:generarId()
    },
    confirmado:{
        type: Boolean,
        default:false
    }
})
//PRE antes de
veterinarioSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }

    //Hasear password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})
//compare sirve para comprobar si es el mismo o no 
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    //Toma password del formulario yel ingresado
    return await bcrypt.compare(passwordFormulario,this.password)
}

//Modelo interectuar con Mongo
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;