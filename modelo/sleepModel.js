// Importa la conexión a la base de datos desde el archivo Conexion.js
const pool = require('./bd/Conexion');

// Definición de la clase SleepModel que maneja las operaciones con la tabla "sleep_entries"
class SleepModel {
  
  // Método para obtener todos los registros de sueño
  static async getAll() {
    try {
      // Consulta todos los registros de la tabla
      const [rows] = await pool.query('SELECT * FROM sleep_entries');
      return rows; // Devuelve todos los registros
    } catch (error) {
      throw error; // Lanza el error en caso de fallo
    }
  }

  // Método para obtener un registro de sueño específico por su ID
  static async getById(id) {
    try {
      // Consulta el registro cuyo id coincida
      const [rows] = await pool.query('SELECT * FROM sleep_entries WHERE id = ?', [id]);
      return rows[0]; // Devuelve el primer resultado encontrado
    } catch (error) {
      throw error;
    }
  }

  // Método para crear un nuevo registro de sueño
  static async create(entry) {
    try {
      // Inserta un nuevo registro en la tabla usando los datos de "entry"
      const [result] = await pool.query('INSERT INTO sleep_entries SET ?', entry);
      // Devuelve el objeto creado con el id generado automáticamente
      return { id: result.insertId, ...entry };
    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar un registro de sueño existente
  static async update(id, entry) {
    try {
      // Actualiza los campos del registro que coincida con el id
      await pool.query('UPDATE sleep_entries SET ? WHERE id = ?', [entry, id]);
      // Devuelve el objeto actualizado
      return { id, ...entry };
    } catch (error) {
      throw error;
    }
  }

  // Método para eliminar un registro de sueño
  static async delete(id) {
    try {
      // Elimina el registro de la tabla según el id
      await pool.query('DELETE FROM sleep_entries WHERE id = ?', [id]);
      return { message: 'Registro de sueño eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

// Exporta la clase para que pueda ser usada en otras partes del proyecto
module.exports = SleepModel;
