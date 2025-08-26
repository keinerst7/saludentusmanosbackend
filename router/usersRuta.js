// Importamos el módulo Express
const express = require('express');

// Creamos una instancia del enrutador de Express
const router = express.Router();

// Importamos el controlador de usuarios, que contiene la lógica de negocio
const UserController = require('../controlador/usersController');

// -------------------- Rutas CRUD y específicas de usuarios --------------------

// Ruta GET '/' → Obtiene todos los usuarios
router.get('/', UserController.getAll);

// Ruta GET '/:id' → Obtiene un usuario por su ID
router.get('/:id', UserController.getById);

// Ruta GET '/email/:email' → Obtiene un usuario por su correo electrónico
router.get('/email/:email', UserController.getByEmail);

// Ruta POST '/login' → Inicia sesión de un usuario
router.post('/login', UserController.login);

// Ruta POST '/' → Crea un nuevo usuario
router.post('/', UserController.create);

// Ruta PUT '/:id' → Actualiza un usuario existente por su ID
router.put('/:id', UserController.update);

// Ruta DELETE '/:id' → Elimina un usuario por su ID
router.delete('/:id', UserController.delete);

// Exportamos el enrutador para que pueda ser usado en la app principal
module.exports = router;
