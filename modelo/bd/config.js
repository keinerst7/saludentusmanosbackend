require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST_PUBLIC || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT_PUBLIC || process.env.DB_PORT || 3306),
  user: process.env.DB_USER_PUBLIC || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD_PUBLIC || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME_PUBLIC || process.env.DB_NAME || 'saludentusmanos',
  connectTimeout: 60000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

module.exports = dbConfig;