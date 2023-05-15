import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) =>{

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
        subject:'Restablece tu Password',
        text:'Restablece tu Password',
        html:`<p>Hola: ${nombre}, Has Solicitado restablecer tu password</p>
        <p>Sigue el siguiente enlace para recuperar password
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">restablecer password</a></p>
        
        <p>Si tu no creaste esta cuenta,Puedes ignorar el mensaje</p>
        
        
        
        `
      })

      console.log('Mensaje Enviado: %s', info.messageId)
}


export default emailOlvidePassword