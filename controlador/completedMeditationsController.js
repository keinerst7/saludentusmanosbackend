// Importamos el modelo que maneja la lógica de base de datos
const CompletedMeditationsModel = require('../modelo/completedMeditationsModel');

// Definimos la clase controlador que gestiona las solicitudes relacionadas
// con las meditaciones completadas
class CompletedMeditationsController {

  // Método para obtener todas las meditaciones completadas
  static async getAll(req, res) {
    try {
      // Llamamos al modelo para traer todos los registros
      const data = await CompletedMeditationsModel.getAll();
      // Enviamos la respuesta en formato JSON
      res.json(data);
    } catch (error) {
      // En caso de error, devolvemos un estado 500 con el mensaje del error
      res.status(500).json({ error: error.message });
    }
  }

  // Método para obtener una meditación completada por su ID
  static async getById(req, res) {
    try {
      // Tomamos el id de los parámetros de la URL
      const id = req.params.id;
      // Buscamos en la base de datos ese registro
      const data = await CompletedMeditationsModel.getById(id);

      // Si no existe, respondemos con estado 404 (no encontrado)
      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      // Si existe, lo devolvemos como JSON
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para crear una nueva meditación completada
  static async create(req, res) {
    try {
      // Usamos el cuerpo de la petición (req.body) como los datos a guardar
      const created = await CompletedMeditationsModel.create(req.body);
      // Devolvemos estado 201 (creado) con el objeto creado
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para actualizar una meditación completada existente
  static async update(req, res) {
    try {
      const id = req.params.id; // Obtenemos el ID de la URL
      // Actualizamos los datos con lo recibido en el body
      const updated = await CompletedMeditationsModel.update(id, req.body);
      res.json(updated); // Devolvemos el registro actualizado
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Método para eliminar una meditación completada
  static async delete(req, res) {
    try {
      const id = req.params.id; // Obtenemos el ID de la URL
      // Llamamos al modelo para borrar el registro
      const deleted = await CompletedMeditationsModel.delete(id);
      res.json(deleted); // Respondemos con el resultado
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportamos el controlador para poder usarlo en las rutas
module.exports = CompletedMeditationsController;
