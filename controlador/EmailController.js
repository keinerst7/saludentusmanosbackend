// 1. Importamos el servicio que acabamos de crear
const emailService = require('../modelo/emailModel');

// Controlador para manejar la petición de envío de correo
async function controladorEnviarCorreo(req, res) {
  // 2. Extraemos los datos del cuerpo de la petición
  const { destinatario, asunto, cuerpo } = req.body;

  // 3. Validación básica de los datos de entrada
  if (!destinatario || !asunto || !cuerpo) {
    return res.status(400).json({ message: 'Faltan datos requeridos (destinatario, asunto, cuerpo).' });
  }

  try {
    // 4. Llamamos a la función del servicio para enviar el correo
    await emailService.enviarCorreo(destinatario, asunto, cuerpo);
    
    // 5. Enviamos una respuesta exitosa
    res.status(200).json({ message: 'Correo enviado exitosamente.' });

  } catch (error) {
    // 6. Si el servicio lanza un error, lo capturamos y enviamos una respuesta de error
    console.error('Error en el controlador al enviar correo:', error);
    res.status(500).json({ message: 'Error interno del servidor al enviar el correo.' });
  }
}

// Exportamos el controlador
module.exports = {
  controladorEnviarCorreo,
};