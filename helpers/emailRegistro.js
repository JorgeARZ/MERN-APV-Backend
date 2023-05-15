import nodemailer from "nodemailer";

const emailRegistro = async (datos) =>{

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS
        }
      });
      
      const {email,nombre,token} = datos;
      //enviar el email

      const info = await transport.sendMail({
        from: "APV- Administrador de pacientes de veterinaria",
        to:email,
        subject:'Comprueba tu Cuenta en APV',
        text:'Comprueba tu Cuenta en APV',
        html:`<p>Hola: ${nombre}, comprueba tu cuenta en APV</p>
        <p>Tu Cuenta esta elista, solo debes comprobarla en el siguiente link
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
        
        <p>Si tu no creaste esta cuenta,Puedes ignorar el mensaje</p>
        
        
        
        `
      })

      console.log('Mensaje Enviado: %s', info.messageId)
}


export default emailRegistro