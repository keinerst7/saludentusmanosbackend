require('dotenv').config();

// Debug temporal - para ver qué variables se están leyendo
console.log('🔍 Variables de entorno:');
console.log('MYSQL_URL:', process.env.MYSQL_URL ? 'Definida (URL interna)' : 'No definida');
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
console.log('DATABASE_USER:', process.env.DATABASE_USER);
console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('NODE_ENV:', process.env.NODE_ENV);

let dbConfig;

// Usar siempre la configuración manual con los datos públicos de Railway
dbConfig = {
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || 3306),
  user: process.env.DATABASE_USER || process.env.DB_USER || 'root',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'saludentusmanos',
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