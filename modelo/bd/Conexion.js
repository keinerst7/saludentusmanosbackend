const mysql = require('mysql2');
const dbConfig = require('./config');

class Conexion {
  constructor() {
    this.pool = mysql.createPool(dbConfig);

    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
      } else {
        console.log('✅ Conectado a la base de datos');
        connection.release();
      }
    });
  }

  // Método para ejecutar consultas
  query(queryString, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(queryString, params, (err, results, fields) => {
        if (err) reject(err);
        else resolve([results, fields]);
      });
    });
  }

  // Método para cerrar el pool de conexiones
  cerrar() {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Conexion();