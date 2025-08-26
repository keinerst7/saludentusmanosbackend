const pool = require('./bd/Conexion');

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
      const [result] = await pool.query('INSERT INTO users SET ?', user);
      return { id: result.insertId, ...user };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, user) {
    try {
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