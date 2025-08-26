const nodemailer = require('nodemailer');
require('dotenv').config();

// 1. Configuración del transporter de Nodemailer
// Se usa la misma configuración que antes, pero ahora está aislada en este servicio.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "keinerarenas77@gmail.com", // Tu correo desde .env
    pass: "qpon ustp igay pxsv", // Tu contraseña de aplicación desde .env
  },
});

/**
 * Función para enviar un correo electrónico.
 * @param {string} destinatario - El correo del destinatario.
 * @param {string} asunto - El asunto del correo.
 * @param {string} cuerpo - El cuerpo del correo en texto plano.
 */
async function enviarCorreo(destinatario, asunto, cuerpo) {
  try {
    // 2. Configuración de las opciones del correo
    const mailOptions = {
      from: `"Tu App Express" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      text: cuerpo,
    };
    console.log('Preparando para enviar correo a:', process.env.EMAIL_USER);

    // 3. Envío del correo y retorno del resultado
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo desde el servicio:', error);
    // Lanzamos el error para que el controlador lo pueda capturar
    throw new Error('Error al enviar el correo.');
  }
}

// 4. Exportamos la función para que pueda ser usada en otros archivos
module.exports = {
  enviarCorreo,
};