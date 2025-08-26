// Importamos la conexión a la base de datos
const pool = require('./bd/Conexion');

// Importamos bcrypt para manejar el hash (encriptación) de contraseñas
const bcrypt = require('bcrypt');

class UserModel {
  // Obtener todos los usuarios
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM users'); // Consulta todos los registros de la tabla "users"
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Obtener usuario por email (para login principalmente)
  static async getByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]); // Busca en la BD usando el email
    return rows[0]; // Devuelve el primer resultado (ya que el email debe ser único)
  }

  // Obtener usuario por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0]; // Devuelve un solo usuario
    } catch (error) {
      throw error;
    }
  }

  // Obtener usuario por email (para login principalmente)
  static async getByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async create(user) {
    try {
      // Encriptamos la contraseña antes de guardarla en la BD
      const saltRounds = 10; // Complejidad del hash
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Reemplazamos la contraseña en texto plano por la encriptada
      const userWithHashedPassword = {
        ...user,
        password: hashedPassword
      };

      // Insertamos el usuario en la BD
      const [result] = await pool.query('INSERT INTO users SET ?', userWithHashedPassword);

      // Devolvemos el usuario creado con su nuevo id
      return { id: result.insertId, ...userWithHashedPassword };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar usuario
  static async update(id, user) {
    try {
      // Si viene una contraseña nueva en la actualización, la encriptamos
      if (user.password) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }

      // Ejecutamos la actualización
      await pool.query('UPDATE users SET ? WHERE id = ?', [user, id]);

      // Retornamos el usuario actualizado
      return { id, ...user };
    } catch (error) {
      throw error;
    }
  }

  // Eliminar usuario por ID
  static async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

// Exportamos la clase para que pueda ser utilizada en el controlador
module.exports = UserModel;
