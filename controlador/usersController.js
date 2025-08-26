// Importamos el modelo de usuarios, encargado de interactuar con la base de datos
const UserModel = require('../modelo/usersModel');

// Importamos bcrypt para manejar el hash y comparación de contraseñas
const bcrypt = require('bcrypt');

class UserController {
  // Obtener todos los usuarios
  static async getAll(req, res) {
    try {
      const users = await UserModel.getAll(); // Llama al modelo para traer todos los usuarios
      res.json(users); // Devuelve los usuarios en formato JSON
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores
    }
  }

  // Método para login de usuario
  static async login(req, res) {
    try {
      const { email, password } = req.body; // Extraemos email y contraseña del body

      // Validamos que se envíen ambos campos
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
      }

      // Buscamos al usuario por email
      const user = await UserModel.getByEmail(email);

      // Si no existe el usuario, devolvemos error de autenticación
      if (!user) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      // Comparamos la contraseña ingresada con la almacenada (encriptada) en la BD
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch); // Solo para debug (no recomendable en producción)

      if (!isMatch) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      // Si todo es correcto, devolvemos un mensaje de éxito y datos del usuario
      res.status(200).json({
        message: "Login exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message }); // Manejo de errores
    }
  }

  // Obtener usuario por ID
  static async getById(req, res) {
    try {
      const user = await UserModel.getById(req.params.id); // Busca en BD por ID
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener usuario por Email
  static async getByEmail(req, res) {
    const { email } = req.params;
    console.log("Buscando usuario por email:", email); // Log para depuración
    try {
      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear un nuevo usuario
  static async create(req, res) {
    try {
      const newUser = await UserModel.create(req.body); // Inserta usuario en la BD
      res.status(201).json(newUser); // Devuelve el usuario creado con status 201
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar un usuario existente
  static async update(req, res) {
    try {
      const updatedUser = await UserModel.update(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar un usuario por ID
  static async delete(req, res) {
    try {
      const result = await UserModel.delete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Exportamos la clase para poder usarla en las rutas
module.exports = UserController;
