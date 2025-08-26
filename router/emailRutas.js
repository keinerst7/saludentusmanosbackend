// Importamos express para poder crear rutas
const express = require('express');

// Creamos una instancia del enrutador de Express
const router = express.Router();

// Importamos el controlador que contiene la lógica para enviar correos
const emailController = require('../controlador/EmailController');

// Definimos la ruta POST '/enviar' que invoca el método del controlador
// Esta ruta se usará cuando el cliente quiera enviar un correo
router.post('/enviar', emailController.controladorEnviarCorreo);

// Exportamos el router para que pueda usarse en el servidor principal
module.exports = router;
