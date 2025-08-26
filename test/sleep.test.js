const request = require("supertest");
const app = require("../app");
const SleepModel = require("../modelo/sleepModel");

// ✅ Mock del modelo
jest.mock("../modelo/sleepModel");

describe("CRUD Sleep API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 GET ALL
  it("GET /api/sleep debe devolver todas las entradas", async () => {
    const mockData = [
      { id: 1, hours: 8, quality: 4 },
      { id: 2, hours: 6, quality: 3 },
    ];
    SleepModel.getAll.mockResolvedValue(mockData);

    const res = await request(app).get("/api/sleep");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(SleepModel.getAll).toHaveBeenCalled();
  });

  // 🔹 GET BY ID
  it("GET /api/sleep/:id debe devolver una entrada", async () => {
    const mockEntry = { id: 1, hours: 7, quality: 5 };
    SleepModel.getById.mockResolvedValue(mockEntry);

    const res = await request(app).get("/api/sleep/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEntry);
    expect(SleepModel.getById).toHaveBeenCalledWith("1");
  });

  // 🔹 GET BY ID (no existe)
  it("GET /api/sleep/:id debe devolver 404 si no existe", async () => {
    SleepModel.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/sleep/99");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Entrada de sueño no encontrada" });
  });

  // 🔹 POST válido
  it("POST /api/sleep debe crear una nueva entrada", async () => {
    const newEntry = { id: 3, hours: 8, quality: 5 };
    SleepModel.create.mockResolvedValue(newEntry);

    const res = await request(app).post("/api/sleep").send({ hours: 8, quality: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(newEntry);
    expect(SleepModel.create).toHaveBeenCalledWith({ hours: 8, quality: 5 });
  });

  // 🔹 POST inválido (horas fuera de rango)
  it("POST /api/sleep debe devolver 400 si las horas son inválidas", async () => {
    const res = await request(app).post("/api/sleep").send({ hours: 30, quality: 4 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Las horas deben estar entre 0 y 24" });
  });

  // 🔹 PUT válido
  it("PUT /api/sleep/:id debe actualizar una entrada", async () => {
    const updatedEntry = { id: 1, hours: 9, quality: 4 };
    SleepModel.update.mockResolvedValue(updatedEntry);

    const res = await request(app).put("/api/sleep/1").send({ hours: 9, quality: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedEntry);
    expect(SleepModel.update).toHaveBeenCalledWith("1", { hours: 9, quality: 4 });
  });

  // 🔹 DELETE
  it("DELETE /api/sleep/:id debe eliminar una entrada", async () => {
    const deleteResult = { message: "Registro de sueño eliminado correctamente" };
    SleepModel.delete.mockResolvedValue(deleteResult);

    const res = await request(app).delete("/api/sleep/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(deleteResult);
    expect(SleepModel.delete).toHaveBeenCalledWith("1");
  });
});
