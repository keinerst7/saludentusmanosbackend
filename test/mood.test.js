const request = require('supertest');
const app = require('../app');

// Mock del modelo para no tocar la BD real
jest.mock('../modelo/moodModel');
const MoodModel = require('../modelo/moodModel');

describe('Mood API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/moods debe devolver todas las entradas', async () => {
    const fakeMoods = [
      { id: 1, mood: 'happy', intensity: 8, notes: 'Buen día' },
      { id: 2, mood: 'sad', intensity: 3, notes: 'Día difícil' }
    ];

    MoodModel.getAll.mockResolvedValue(fakeMoods);

    const res = await request(app).get('/api/moods');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeMoods);
  });

  test('GET /api/moods/:id devuelve una entrada existente', async () => {
    const fakeMood = { id: 1, mood: 'happy', intensity: 8, notes: 'Buen día' };

    MoodModel.getById.mockResolvedValue(fakeMood);

    const res = await request(app).get('/api/moods/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeMood);
  });

  test('GET /api/moods/:id devuelve 404 si no existe', async () => {
    MoodModel.getById.mockResolvedValue(null);

    const res = await request(app).get('/api/moods/99');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Entrada no encontrada' });
  });

  test('POST /api/moods crea una entrada nueva', async () => {
    const newMood = { mood: 'excited', intensity: 9, notes: 'Gran noticia' };
    const createdMood = { id: 10, ...newMood };

    MoodModel.create.mockResolvedValue(createdMood);

    const res = await request(app).post('/api/moods').send(newMood);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(createdMood);
  });

  test('PUT /api/moods/:id actualiza una entrada', async () => {
    const updatedMood = { id: 1, mood: 'calm', intensity: 7, notes: 'Día relajado' };

    MoodModel.update.mockResolvedValue(updatedMood);

    const res = await request(app).put('/api/moods/1').send({ mood: 'calm', intensity: 7 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedMood);
  });

  test('DELETE /api/moods/:id elimina una entrada', async () => {
    const msg = { message: 'Registro eliminado correctamente' };

    MoodModel.delete.mockResolvedValue(msg);

    const res = await request(app).delete('/api/moods/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(msg);
  });

  test('GET /api/moods maneja error interno del servidor', async () => {
    MoodModel.getAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/moods');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB error');
  });
});