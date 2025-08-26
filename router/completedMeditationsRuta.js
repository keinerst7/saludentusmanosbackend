// Importamos express para manejar las rutas
const express = require('express');

// Creamos un enrutador con express.Router()
const router = express.Router();

// Importamos el controlador que contiene la lógica de negocio
const CompletedMeditationsController = require('../controlador/completedMeditationsController');

// Definimos las rutas y las asociamos con los métodos del controlador:

// GET / -> Obtiene todas las meditaciones completadas
router.get('/', CompletedMeditationsController.getAll);

// GET /:id -> Obtiene una meditación completada específica por su ID
router.get('/:id', CompletedMeditationsController.getById);

// POST / -> Crea una nueva meditación completada
router.post('/', CompletedMeditationsController.create);

// PUT /:id -> Actualiza una meditación completada por su ID
router.put('/:id', CompletedMeditationsController.update);

// DELETE /:id -> Elimina una meditación completada por su ID
router.delete('/:id', CompletedMeditationsController.delete);

// Exportamos el router para usarlo en el servidor principal
module.exports = router;
