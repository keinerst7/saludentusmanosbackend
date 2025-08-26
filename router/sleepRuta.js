// Importamos el módulo express para poder usar su router
const express = require('express');

// Creamos una instancia del router de express
const router = express.Router();

// Importamos el controlador que maneja la lógica de "sueño"
const SleepController = require('../controlador/sleepController');

// Ruta GET '/' → Obtiene todos los registros de sueño
router.get('/', SleepController.getAll);

// Ruta GET '/:id' → Obtiene un registro de sueño específico por su ID
router.get('/:id', SleepController.getById);

// Ruta POST '/' → Crea un nuevo registro de sueño
router.post('/', SleepController.create);

// Ruta PUT '/:id' → Actualiza un registro de sueño existente según su ID
router.put('/:id', SleepController.update);

// Ruta DELETE '/:id' → Elimina un registro de sueño existente por su ID
router.delete('/:id', SleepController.delete);

// Exportamos el router para poder usarlo en otras partes de la aplicación
module.exports = router;
