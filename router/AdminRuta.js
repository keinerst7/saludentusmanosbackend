const express = require('express');
const ARutas = require('../controlador/AdminController');
const router = express.Router();

router.post('/admin', ARutas.crearUsuario);

module.exports = router; 