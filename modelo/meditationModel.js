// Importamos la conexión a la base de datos desde el archivo de configuración
const pool = require('./bd/Conexion');

// Definimos la clase modelo que maneja la tabla `meditation_sessions`
class MeditationModel {

  // Método para obtener todas las sesiones de meditación
  static async getAll() {
    try {
      // Consulta SQL para traer todas las filas de la tabla
      const [rows] = await pool.query('SELECT * FROM meditation_sessions');
      return rows; // Retornamos el listado completo
    } catch (error) {
      // Si ocurre un error en la consulta, lo lanzamos para que lo maneje el controlador
      throw error;
    }
  }

  // Método para obtener una sesión de meditación específica por su ID
  static async getById(id) {
    try {
      // Consulta SQL con parámetro seguro para evitar inyección SQL
      const [rows] = await pool.query(
        'SELECT * FROM meditation_sessions WHERE id = ?', 
        [id]
      );

      // Retornamos solo la primera coincidencia (ya que el ID es único)
      return rows[0];
    } catch (error) {
      // Si ocurre un error, lo lanzamos al controlador
      throw error;
    }
  }
}

// Exportamos el modelo para que pueda ser usado en los controladores
module.exports = MeditationModel;
