const request = require('supertest');
const app = require('../app');

// Mock del modelo para no tocar la BD real
jest.mock('../modelo/usersModel');
const UserModel = require('../modelo/usersModel');

describe('Users API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/users debe devolver todos los usuarios', async () => {
    const fakeUsers = [
      { id: 1, name: 'Keiner', email: 'keiner@test.com' },
      { id: 2, name: 'Ana', email: 'ana@test.com' }
    ];

    UserModel.getAll.mockResolvedValue(fakeUsers);

    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeUsers);
  });

  test('GET /api/users/:id devuelve un usuario existente', async () => {
    const fakeUser = { id: 1, name: 'Keiner', email: 'keiner@test.com' };

    UserModel.getById.mockResolvedValue(fakeUser);

    const res = await request(app).get('/api/users/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeUser);
  });

  test('GET /api/users/:id devuelve 404 si no existe', async () => {
    UserModel.getById.mockResolvedValue(null);

    const res = await request(app).get('/api/users/99');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Usuario no encontrado' });
  });

  test('GET /api/users/email/:email devuelve usuario por email', async () => {
    const fakeUser = { id: 1, name: 'Keiner', email: 'keiner@test.com' };

    UserModel.getByEmail.mockResolvedValue(fakeUser);

    const res = await request(app).get('/api/users/email/keiner@test.com');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeUser);
  });

  test('POST /api/users crea un usuario nuevo', async () => {
    const newUser = { name: 'Nuevo', email: 'nuevo@test.com', password: '1234' };
    const createdUser = { id: 10, ...newUser };

    UserModel.create.mockResolvedValue(createdUser);

    const res = await request(app).post('/api/users').send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(createdUser);
  });

  test('PUT /api/users/:id actualiza un usuario', async () => {
    const updatedUser = { id: 1, name: 'Keiner Update', email: 'keiner@test.com' };

    UserModel.update.mockResolvedValue(updatedUser);

    const res = await request(app).put('/api/users/1').send({ name: 'Keiner Update' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedUser);
  });

  test('DELETE /api/users/:id elimina un usuario', async () => {
    const msg = { message: 'Usuario eliminado correctamente' };

    UserModel.delete.mockResolvedValue(msg);

    const res = await request(app).delete('/api/users/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(msg);
  });

  describe('POST /api/users/login', () => {
    test('login exitoso con credenciales correctas', async () => {
      const fakeUser = {
        id: 1,
        name: 'Keiner',
        email: 'keiner@test.com',
        password: await require('bcryptjs').hash('1234', 10),

      };

      UserModel.getByEmail.mockResolvedValue(fakeUser);

      const res = await request(app).post('/api/users/login').send({
        email: 'keiner@test.com',
        password: '1234'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login exitoso');
      expect(res.body.user).toEqual({
        id: fakeUser.id,
        name: fakeUser.name,
        email: fakeUser.email
      });
    });

    test('login falla con email inexistente', async () => {
      UserModel.getByEmail.mockResolvedValue(null);

      const res = await request(app).post('/api/users/login').send({
        email: 'noexiste@test.com',
        password: '1234'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Usuario o contraseña incorrectos' });
    });

    test('login falla con contraseña incorrecta', async () => {
      const fakeUser = {
        id: 1,
        name: 'Keiner',
        email: 'keiner@test.com',
        password: await require('bcryptjs').hash('1234', 10),
      };

      UserModel.getByEmail.mockResolvedValue(fakeUser);

      const res = await request(app).post('/api/users/login').send({
        email: 'keiner@test.com',
        password: 'wrongpass'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Usuario o contraseña incorrectos' });
    });

    test('login falla si faltan campos', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'keiner@test.com'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Email y contraseña son obligatorios' });
    });
  });
});