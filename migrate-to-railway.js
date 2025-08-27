require('dotenv').config();
const mysql = require('mysql2/promise');

async function addMissingTables() {
  let connection;
  
  try {
    // Configuración para Railway
    connection = await mysql.createConnection({
      host: process.env.DB_HOST_PUBLIC || 'switchyard.proxy.rlwy.net',
      port: parseInt(process.env.DB_PORT_PUBLIC || '44741'),
      user: process.env.DB_USER_PUBLIC || 'root',
      password: process.env.DB_PASSWORD_PUBLIC || 'QodhMHdUPbaJRSsioKtFvKFXzYJAAilD',
      database: process.env.DB_NAME_PUBLIC || 'railway',
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Conectado a MySQL de Railway');

    // Función para verificar si una tabla existe
    async function tableExists(tableName) {
      const [rows] = await connection.execute(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?",
        [process.env.DB_NAME_PUBLIC || 'railway', tableName]
      );
      return rows[0].count > 0;
    }

    // Ver qué tablas ya existen
    const [existingTables] = await connection.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME_PUBLIC || 'railway']
    );
    
    console.log('📋 Tablas existentes:', existingTables.map(t => t.table_name || t.TABLE_NAME));

    // 1. Crear/Recrear tabla roles si no existe o está vacía
    if (!await tableExists('roles')) {
      await connection.execute(`
        CREATE TABLE roles (
          id INT NOT NULL AUTO_INCREMENT,
          nombre VARCHAR(50) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla roles creada');
    }

    // Insertar datos en roles si está vacía
    const [roleCount] = await connection.execute('SELECT COUNT(*) as count FROM roles');
    if (roleCount[0].count === 0) {
      await connection.execute(`
        INSERT INTO roles (id, nombre) VALUES 
        (1, 'Usuario'),
        (2, 'Administrador')
      `);
      console.log('✅ Datos insertados en roles');
    }

    // 2. Crear tabla meditation_sessions si no existe
    if (!await tableExists('meditation_sessions')) {
      await connection.execute(`
        CREATE TABLE meditation_sessions (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          duration INT NOT NULL,
          category VARCHAR(50) DEFAULT NULL,
          description TEXT DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla meditation_sessions creada');
      
      // Insertar datos de meditaciones
      await connection.execute(`
        INSERT INTO meditation_sessions (id, name, duration, category, description) VALUES 
        (1, 'Respiración Consciente', 5, 'Relajación', 'Ejercicio básico de respiración para reducir el estrés'),
        (2, 'Mindfulness Matutino', 7, 'Mindfulness', 'Sesión para comenzar el día con claridad mental'),
        (3, 'Relajación Nocturna', 6, 'Sueño', 'Meditación para preparar el cuerpo para el descanso'),
        (4, 'Gratitud Diaria', 5, 'Positividad', 'Práctica de gratitud para mejorar el bienestar emocional'),
        (5, 'Serenidad Nocturna', 7, 'Sueño', 'Meditación relajante para preparar el descanso'),
        (6, 'Calma Interior', 6, 'Relajación', 'Sesión para encontrar paz en momentos de estrés')
      `);
      console.log('✅ Datos insertados en meditation_sessions');
    }

    // 3. Verificar y ajustar tabla users si le falta id_rol
    const [userColumns] = await connection.execute(
      "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'users'",
      [process.env.DB_NAME_PUBLIC || 'railway']
    );
    
    const hasIdRol = userColumns.some(col => (col.COLUMN_NAME || col.column_name) === 'id_rol');
    
    if (!hasIdRol) {
      console.log('➕ Agregando columna id_rol a users...');
      await connection.execute('ALTER TABLE users ADD COLUMN id_rol INT NOT NULL DEFAULT 1');
      await connection.execute('ALTER TABLE users ADD CONSTRAINT fk_users_roles FOREIGN KEY (id_rol) REFERENCES roles(id)');
      console.log('✅ Columna id_rol agregada a users');
    }

    // 4. Crear tabla mood_entries (compatible con moods existente)
    if (!await tableExists('mood_entries')) {
      await connection.execute(`
        CREATE TABLE mood_entries (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          date DATE NOT NULL,
          mood TINYINT NOT NULL,
          stress TINYINT DEFAULT NULL,
          energy TINYINT DEFAULT NULL,
          note TEXT DEFAULT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY fk_mood_entries_user (user_id),
          KEY idx_mood_entries_user_date (user_id,date),
          CONSTRAINT fk_mood_entries_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT mood_entries_chk_1 CHECK ((mood between 1 and 5)),
          CONSTRAINT mood_entries_chk_2 CHECK ((stress between 1 and 5)),
          CONSTRAINT mood_entries_chk_3 CHECK ((energy between 1 and 5))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla mood_entries creada');
    }

    // 5. Crear tabla mood_triggers si no existe
    if (!await tableExists('mood_triggers')) {
      await connection.execute(`
        CREATE TABLE mood_triggers (
          id INT NOT NULL AUTO_INCREMENT,
          mood_entry_id INT NOT NULL,
          trigger_text VARCHAR(100) NOT NULL,
          PRIMARY KEY (id),
          KEY fk_mood_triggers_entry (mood_entry_id),
          CONSTRAINT fk_mood_triggers_entry FOREIGN KEY (mood_entry_id) REFERENCES mood_entries (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla mood_triggers creada');
    }

    // 6. Crear tabla sleep_entries (compatible con sleep existente)
    if (!await tableExists('sleep_entries')) {
      await connection.execute(`
        CREATE TABLE sleep_entries (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          date DATE NOT NULL,
          hours DECIMAL(4,2) DEFAULT NULL,
          quality TINYINT DEFAULT NULL,
          note TEXT DEFAULT NULL,
          PRIMARY KEY (id),
          KEY fk_sleep_entries_user (user_id),
          KEY idx_sleep_entries_user_date (user_id,date),
          CONSTRAINT fk_sleep_entries_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          CONSTRAINT sleep_entries_chk_1 CHECK ((hours >= 0 and hours <= 24)),
          CONSTRAINT sleep_entries_chk_2 CHECK ((quality between 1 and 5))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla sleep_entries creada');
    }

    // 7. Crear tabla completed_meditations si no existe
    if (!await tableExists('completed_meditations')) {
      await connection.execute(`
        CREATE TABLE completed_meditations (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          duration INT NOT NULL,
          meditation_id INT NOT NULL,
          completed_date DATE NOT NULL,
          completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY fk_completed_meditations_user (user_id),
          KEY fk_completed_meditations_session (meditation_id),
          CONSTRAINT fk_completed_meditations_session FOREIGN KEY (meditation_id) REFERENCES meditation_sessions (id),
          CONSTRAINT fk_completed_meditations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
      console.log('✅ Tabla completed_meditations creada');
    }

    console.log('🎉 ¡Verificación y creación de tablas completada!');
    
    // Mostrar un resumen final de todas las tablas
    const [finalTables] = await connection.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name",
      [process.env.DB_NAME_PUBLIC || 'railway']
    );
    
    console.log('📊 Tablas finales en la base de datos:');
    finalTables.forEach(table => {
      console.log(`   - ${table.table_name || table.TABLE_NAME}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  addMissingTables();
}

module.exports = { addMissingTables };