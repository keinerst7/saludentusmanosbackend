// Importamos express para poder crear rutas
const express = require('express');

// Creamos una instancia del enrutador de Express
const router = express.Router();

// Importamos el controlador que contiene la lógica de negocio
const MeditationController = require('../controlador/meditationController');

// Definimos las rutas y las asociamos con los métodos del controlador:

// GET / -> Obtiene todas las sesiones de meditación
router.get('/', MeditationController.getAll);

// GET /:id -> Obtiene una sesión de meditación específica por su ID
router.get('/:id', MeditationController.getById);

// Exportamos el router para que pueda usarse en el servidor principal
module.exports = router;
