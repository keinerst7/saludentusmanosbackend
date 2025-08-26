// Importamos el modelo que maneja la lógica de acceso a la base de datos
const MoodModel = require('../modelo/moodModel');

// Definimos la clase controlador que gestiona las solicitudes HTTP
class MoodController {

  // Método para obtener todos los registros de estados de ánimo
  static async getAll(req, res) {
    try {
      // Llamamos al modelo para traer todas las entradas de estados de ánimo
      const entries = await MoodModel.getAll();

      // Respondemos con los datos en formato JSON
      res.json(entries);
    } catch (error) {
      // En caso de error, respondemos con estado 500 (error del servidor)
      res.status(500).json({ error: error.message });
    }
  }

  // Método para obtener un estado de ánimo específico por ID
  static async getById(req, res) {
    try {
      // Obtenemos el ID desde los parámetros de la URL
      const entry = await MoodModel.getById(req.params.id);

      // Si no se encuentra, devolvemos un error 404 (no encontrado)
      if (!entry) {
        return res.status(404).json({ message: 'Entrada no encontrada' });
      }

      // Si existe, respondemos con la entrada en formato JSON
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para crear un nuevo registro de estado de ánimo
  static async create(req, res) {
    try {
      // Usamos los datos enviados en el cuerpo de la petición
      const newEntry = await MoodModel.create(req.body);

      // Respondemos con estado 201 (creado) y la nueva entrada
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para actualizar un registro existente
  static async update(req, res) {
    try {
      // Actualizamos la entrada usando el ID de la URL y los nuevos datos del body
      const updatedEntry = await MoodModel.update(req.params.id, req.body);

      // Respondemos con la entrada actualizada
      res.json(updatedEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para eliminar un estado de ánimo
  static async delete(req, res) {
    try {
      // Eliminamos la entrada por su ID
      const result = await MoodModel.delete(req.params.id);

      // Respondemos con un mensaje de confirmación
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportamos el controlador para que pueda usarse en las rutas
module.exports = MoodController;
