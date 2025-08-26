// Importamos la conexión a la base de datos (pool de conexiones MySQL)
const pool = require('./bd/Conexion');

// Definimos la clase modelo que gestiona la tabla `mood_entries`
class MoodModel {

  // Método para obtener todos los registros de estados de ánimo
  static async getAll() {
    try {
      // Ejecutamos una consulta SQL para traer todos los registros
      const [rows] = await pool.query('SELECT * FROM mood_entries');
      return rows; // Retornamos el listado completo
    } catch (error) {
      // Si hay error, lo propagamos para que lo maneje el controlador
      throw error;
    }
  }

  // Método para obtener un registro de estado de ánimo por su ID
  static async getById(id) {
    try {
      // Consulta SQL con parámetro seguro para evitar inyección SQL
      const [rows] = await pool.query(
        'SELECT * FROM mood_entries WHERE id = ?', 
        [id]
      );
      return rows[0]; // Retornamos solo el primer resultado (ID es único)
    } catch (error) {
      throw error;
    }
  }

  // Método para crear un nuevo registro en la tabla
  static async create(entry) {
    try {
      // INSERT con sintaxis `SET ?` permite pasar un objeto directamente
      const [result] = await pool.query(
        'INSERT INTO mood_entries SET ?', 
        entry
      );

      // Retornamos el objeto creado con el nuevo ID generado
      return { id: result.insertId, ...entry };
    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar un registro existente
  static async update(id, entry) {
    try {
      // UPDATE con sintaxis `SET ?` actualiza los campos del objeto
      await pool.query(
        'UPDATE mood_entries SET ? WHERE id = ?', 
        [entry, id]
      );

      // Retornamos el objeto actualizado
      return { id, ...entry };
    } catch (error) {
      throw error;
    }
  }

  // Método para eliminar un registro por su ID
  static async delete(id) {
    try {
      // Ejecutamos DELETE con parámetro seguro
      await pool.query(
        'DELETE FROM mood_entries WHERE id = ?', 
        [id]
      );

      // Retornamos un mensaje de confirmación
      return { message: 'Registro eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

// Exportamos el modelo para que pueda usarse en el controlador
module.exports = MoodModel;
