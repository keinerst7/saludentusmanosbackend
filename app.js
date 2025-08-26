// app.js

// -------------------- Importaciones --------------------
const express = require('express');        // Framework para construir la API
const bodyParser = require('body-parser'); // Middleware para parsear JSON
const cors = require('cors');              // Middleware para habilitar CORS
const path = require('path');              // Módulo para manejar rutas de archivos
const app = express();                     // Inicializamos la aplicación de Express

// Importación de rutas personalizadas
const indexDia = require('./router/indexdia');
const userRoutes = require('./router/usersRuta');
const moodRoutes = require('./router/moodRuta');
const sleepRoutes = require('./router/sleepRuta');
const emailRoutes = require('./router/emailRutas');
const meditationRoutes = require('./router/meditationRuta');
const completedMeditationsRoutes = require('./router/completedMeditationsRuta');


// -------------------- Middleware --------------------

// Configuración de CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: '*', // Permite todas las conexiones (en producción conviene limitar a dominios específicos)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true // Permite el envío de cookies/autenticación si es necesario
}));

// Middleware para procesar solicitudes entrantes
app.use(bodyParser.json());                          // Convierte el body en JSON
app.use(express.urlencoded({ extended: true }));     // Permite leer datos de formularios

// Servir archivos estáticos (comentado por ahora)
// app.use(express.static(path.join(__dirname, 'public')));


// -------------------- Rutas --------------------

// Definimos los prefijos y sus respectivos enrutadores
app.use('/', indexDia);                              // Ruta principal
app.use('/api/users', userRoutes);                   // Rutas de usuarios
app.use('/api/moods', moodRoutes);                   // Rutas de moods (versión con /api)
app.use('/api/sleep', sleepRoutes);                  // Rutas de sueño
app.use('/api/meditations', meditationRoutes);       // Rutas de meditaciones
app.use('/api/completed-meditations', completedMeditationsRoutes); // Rutas de meditaciones completadas
app.use('/api/correo', emailRoutes);                 // Rutas para enviar correos


// -------------------- Servidor --------------------

// Puerto de ejecución - ACTUALIZADO PARA RAILWAY
const PORT = process.env.PORT || 3030;

// Si el archivo es ejecutado directamente (no importado como módulo), iniciamos el servidor
if (require.main === module) {
  // ACTUALIZADO: Bind a 0.0.0.0 para Railway
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

// Exportamos app (útil para testing con herramientas como Jest o Supertest)
module.exports = app;