const request = require('supertest');
const app = require('../app');

// Mock de la BD
jest.mock('../modelo/meditationModel');
const MeditationModel = require('../modelo/meditationModel');

describe('Meditation API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/meditations debe devolver todas las sesiones', async () => {
    // Datos simulados
    const fakeSessions = [
      { id: 1, title: 'Meditación 1', duration: 10 },
      { id: 2, title: 'Meditación 2', duration: 15 },
    ];

    // Simulamos que el modelo retorna esos datos
    MeditationModel.getAll.mockResolvedValue(fakeSessions);

    const res = await request(app).get('/api/meditations');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeSessions);
    expect(MeditationModel.getAll).toHaveBeenCalledTimes(1);
  });

  test('GET /api/meditations/:id debe devolver una sesión por ID', async () => {
    const fakeSession = { id: 1, title: 'Meditación 1', duration: 10 };

    MeditationModel.getById.mockResolvedValue(fakeSession);

    const res = await request(app).get('/api/meditations/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeSession);
    expect(MeditationModel.getById).toHaveBeenCalledWith("1");
  });

  test('GET /api/meditations/:id debe devolver 404 si no existe la sesión', async () => {
    MeditationModel.getById.mockResolvedValue(null);

    const res = await request(app).get('/api/meditations/99');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Sesión de meditación no encontrada' });
  });

  test('GET /api/meditations debe manejar error interno del servidor', async () => {
    MeditationModel.getAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/meditations');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB error');
  });
});