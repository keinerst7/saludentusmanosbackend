// routes/moodRoutes.js (Ejemplo de cómo podría lucir)
const express = require("express");
const router = express.Router();
const MoodModel = require("../modelo/moodModel");

// GET /moods
router.get("/", async (req, res) => {
  try {
    const moods = await MoodModel.getAll();
    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las entradas." });
  }
});

// GET /moods/:id
router.get("/:id", async (req, res) => {
  try {
    const mood = await MoodModel.getById(req.params.id);
    if (mood) {
      res.status(200).json(mood);
    } else {
      res.status(404).json({ message: "Entrada no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la entrada." });
  }
});

// POST /moods
router.post("/", async (req, res) => {
  try {
    const newMood = await MoodModel.create(req.body);
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la entrada." });
  }
});

// PUT /moods/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedMood = await MoodModel.update(req.params.id, req.body);
    if (updatedMood) {
      res.status(200).json(updatedMood);
    } else {
      res.status(404).json({ message: "Entrada no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la entrada." });
  }
});

// DELETE /moods/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await MoodModel.delete(req.params.id);
    if (result) {
      res.status(200).json({ message: "Registro eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Entrada no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la entrada." });
  }
});

module.exports = router;