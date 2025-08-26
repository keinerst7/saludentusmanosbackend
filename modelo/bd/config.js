require('dotenv').config();

// Debug temporal - para ver qué variables se están leyendo
console.log('🔍 Variables de entorno:');
console.log('MYSQL_URL:', process.env.MYSQL_URL ? 'Definida (URL interna)' : 'No definida');
console.log('DB_HOST_PUBLIC:', process.env.DB_HOST_PUBLIC);
console.log('DB_PORT_PUBLIC:', process.env.DB_PORT_PUBLIC);
console.log('DB_USER_PUBLIC:', process.env.DB_USER_PUBLIC);
console.log('DB_NAME_PUBLIC:', process.env.DB_NAME_PUBLIC);
console.log('NODE_ENV:', process.env.NODE_ENV);

let dbConfig;

// Usar variables con nombres únicos para evitar conflictos con Railway
dbConfig = {
  host: process.env.DB_HOST_PUBLIC || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT_PUBLIC || process.env.DB_PORT || 3306),
  user: process.env.DB_USER_PUBLIC || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD_PUBLIC || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME_PUBLIC || process.env.DB_NAME || 'saludentusmanos',
  connectTimeout: 60000,
  // SSL requerido para conexiones públicas de Railway
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

console.log('🔍 Configuración final de DB:');
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('User:', dbConfig.user);
console.log('Database:', dbConfig.database);
console.log('SSL:', dbConfig.ssl ? 'Habilitado' : 'Deshabilitado');

module.exports = dbConfig;