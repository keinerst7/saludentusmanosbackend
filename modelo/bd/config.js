require('dotenv').config();

const dbConfig = {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
    port: process.env.DATABASE_PORT || process.env.DB_PORT || 3306,
    user: process.env.DATABASE_USER || process.env.DB_USER || 'root',
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.DATABASE_NAME || process.env.DB_NAME || 'saludentusmanos',
    // Configuraciones adicionales para Railway
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

module.exports = dbConfig;