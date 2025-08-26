require('dotenv').config();

const dbConfig = {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
    port: process.env.DATABASE_PORT || process.env.DB_PORT || 3306,
    user: process.env.DATABASE_USER || process.env.DB_USER || 'root',
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.DATABASE_NAME || process.env.DB_NAME || 'saludentusmanos',
    // Configuraciones válidas para mysql2
    connectTimeout: 60000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

module.exports = dbConfig;