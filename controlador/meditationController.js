// Importamos el modelo que maneja la lógica de acceso a la base de datos
const MeditationModel = require('../modelo/meditationModel');

// Definimos la clase controlador que gestiona las solicitudes HTTP
class MeditationController {

  // Método para obtener todas las sesiones de meditación
  static async getAll(req, res) {
    try {
      // Llamamos al modelo para traer todas las sesiones
      const sessions = await MeditationModel.getAll();

      // Respondemos con las sesiones en formato JSON
      res.json(sessions);
    } catch (error) {
      // Si ocurre un error en la consulta, respondemos con estado 500
      res.status(500).json({ error: error.message });
    }
  }

  // Método para obtener una sesión de meditación por su ID
  static async getById(req, res) {
    try {
      // Obtenemos el ID de los parámetros de la URL
      const session = await MeditationModel.getById(req.params.id);

      // Si no se encuentra la sesión, devolvemos un estado 404 (no encontrado)
      if (!session) {
        return res.status(404).json({ message: 'Sesión de meditación no encontrada' });
      }

      // Si existe, respondemos con la sesión en formato JSON
      res.json(session);
    } catch (error) {
      // En caso de error, respondemos con estado 500
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportamos el controlador para que pueda usarse en el router
module.exports = MeditationController;
