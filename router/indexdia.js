const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
res.send("Trabajo por keiner");
});


router.get('/lunes', (req, res) => {
res.send("Ingles");
});
        
router.get('/Martes', (req, res) => {
res.send("Front-end");
});
        
router.get('/Miercoles', (req, res) => {
res.send("Base de datos");
});
        
router.get('/Jueves', (req, res) => {
res.send("Matematicas");
});

router.get('/viernes', (req, res) => {
res.send("Cultura fisica");
});

// Rutas de Requerimientos
router.get('/registroactividadesfisicas', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'public', 'registroactividadesfisicas.html');
    res.sendFile(indexPath);
});

router.get('/registrousuarios', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'public', 'registrousuarios.html');
    res.sendFile(indexPath);
});


router.get('/perfilusuarios', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'public', 'perfilusuario.html');
    res.sendFile(indexPath);
});




        
module.exports = router;