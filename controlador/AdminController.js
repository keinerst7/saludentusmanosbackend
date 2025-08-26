const pool = require('./bd/Conexion');
const bcrypt = require('bcrypt');

class UserModel {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(user) {
    try {
      // Encriptar la contraseña antes de guardar
      const saltRounds = 10; // Nivel de complejidad
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Reemplazamos la contraseña original por la encriptada
      const userWithHashedPassword = {
        ...user,
        password: hashedPassword
      };

      const [result] = await pool.query('INSERT INTO users SET ?', userWithHashedPassword);
      return { id: result.insertId, ...userWithHashedPassword };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, user) {
    try {
      // Si en el update viene una contraseña, la encriptamos también
      if (user.password) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }

      await pool.query('UPDATE users SET ? WHERE id = ?', [user, id]);
      return { id, ...user };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;