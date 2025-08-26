const express = require('express');
const router = express.Router();
const MoodController = require('../controlador/moodController');

// Obtener todos los estados de ánimo
router.get('/', MoodController.getAll);

// Obtener un estado de ánimo por ID
router.get('/:id', MoodController.getById);

// Crear un nuevo estado de ánimo
router.post('/', MoodController.create);

// Actualizar un estado de ánimo por ID
router.put('/:id', MoodController.update);

// Eliminar un estado de ánimo por ID
router.delete('/:id', MoodController.delete);

module.exports = router;
