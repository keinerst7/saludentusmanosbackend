// Importamos el modelo que maneja la lógica de acceso a la BD para los registros de sueño
const SleepModel = require('../modelo/sleepModel');

class SleepController {
  
  // Obtener todos los registros de sueño
  static async getAll(req, res) {
    try {
      const entries = await SleepModel.getAll(); // Llamada al modelo
      res.json(entries); // Respuesta en formato JSON
    } catch (error) {
      res.status(500).json({ error: error.message }); // Error interno
    }
  }

  // Obtener un registro específico de sueño por su ID
  static async getById(req, res) {
    try {
      const entry = await SleepModel.getById(req.params.id); // Buscamos en la BD
      if (!entry) {
        // Si no existe, devolvemos error 404
        return res.status(404).json({ message: 'Entrada de sueño no encontrada' });
      }
      res.json(entry); // Si existe, se devuelve en JSON
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear un nuevo registro de sueño
  static async create(req, res) {
    try {
      const { hours, quality } = req.body;

      // Validación de horas: deben estar entre 0 y 24
      if (hours < 0 || hours > 24) {
        return res.status(400).json({ message: 'Las horas deben estar entre 0 y 24' });
      }

      // Validación de calidad: debe estar entre 1 y 5 (si viene en el body)
      if (quality && (quality < 1 || quality > 5)) {
        return res.status(400).json({ message: 'La calidad debe estar entre 1 y 5' });
      }

      // Si pasa validación, se crea el nuevo registro
      const newEntry = await SleepModel.create(req.body);
      res.status(201).json(newEntry); // Respuesta 201 (creado)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  // tomar pantallazo para QA
  // Actualizar un registro existente de sueño
  static async update(req, res) {
    try {
      const { hours, quality } = req.body;

      // Validación similar a create(), pero solo si los campos vienen en la petición
      if (hours && (hours < 0 || hours > 24)) {
        return res.status(400).json({ message: 'Las horas deben estar entre 0 y 24' });
      }
      if (quality && (quality < 1 || quality > 5)) {
        return res.status(400).json({ message: 'La calidad debe estar entre 1 y 5' });
      }

      // Actualizamos el registro en la BD
      const updatedEntry = await SleepModel.update(req.params.id, req.body);
      res.json(updatedEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar un registro de sueño por ID
  static async delete(req, res) {
    try {
      const result = await SleepModel.delete(req.params.id); // Llamada al modelo
      res.json(result); // Devolvemos mensaje de éxito
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportamos el controlador para que lo use el router
module.exports = SleepController;
