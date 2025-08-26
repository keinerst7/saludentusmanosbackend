// Importamos la conexión a la base de datos (pool de conexiones)
const pool = require('./bd/Conexion');

// Definimos la clase del modelo que maneja la tabla `completed_meditations`
class CompletedMeditationsModel {

  // Método para obtener todas las meditaciones completadas
  static async getAll() {
    // Consulta SQL con INNER JOIN para traer información adicional
    // de la tabla `meditation_sessions` (nombre y descripción de la meditación)
    const [rows] = await pool.query(
      'SELECT c.*, m.name, c.completed_date as completedDate, m.description \
       FROM completed_meditations c \
       INNER JOIN meditation_sessions m ON c.meditation_id = m.id'
    );

    // Retornamos todas las filas obtenidas
    return rows;
  }

  // Método para obtener una meditación completada por su ID
  static async getById(id) {
    // Consulta SQL con parámetro seguro (evita inyección SQL)
    const [rows] = await pool.query(
      'SELECT * FROM completed_meditations WHERE id = ?', 
      [id]
    );

    // Retornamos el primer resultado (ya que el ID es único)
    return rows[0];
  }

  // Método para crear un nuevo registro de meditación completada
  static async create(data) {
    // Extraemos los campos esperados del objeto recibido
    const { user_id, meditation_id, completed_date, duration } = data;

    // Ejecutamos la inserción en la tabla con valores dinámicos
    const [result] = await pool.query(
      'INSERT INTO completed_meditations (user_id, meditation_id, completed_date, duration) VALUES (?, ?, ?, ?)',
      [user_id, meditation_id, completed_date, duration]
    );

    // Retornamos el nuevo objeto, incluyendo el ID generado automáticamente
    return { id: result.insertId, ...data };
  }

  // Método para actualizar un registro existente
  static async update(id, data) {
    const { user_id, meditation_id, completed_date } = data;

    // Actualizamos los campos según el ID
    await pool.query(
      'UPDATE completed_meditations SET user_id = ?, meditation_id = ?, completed_date = ? WHERE id = ?',
      [user_id, meditation_id, completed_date, id]
    );

    // Retornamos el objeto actualizado (con el mismo ID)
    return { id, ...data };
  }

  // Método para eliminar un registro de la tabla por ID
  static async delete(id) {
    await pool.query(
      'DELETE FROM completed_meditations WHERE id = ?', 
      [id]
    );

    // Retornamos un mensaje de confirmación
    return { message: 'Deleted successfully' };
  }
}

// Exportamos el modelo para que pueda usarse en el controlador
module.exports = CompletedMeditationsModel;