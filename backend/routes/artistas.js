const express = require("express");
const router = express.Router();
const { lerDB } = require("../dbUtils");

console.log("routes/artistas.js carregado");

router.get("/", (req, res) => {
  const db = lerDB();
  res.json(db.artistas || []);
});

router.get("/:id", (req, res) => {
  console.log("GET /artistas/:id chamado com id =", req.params.id);
  const db = lerDB();
  const { id } = req.params;
  const artista = db.artistas.find(a => a.id === id);
  if (!artista) {
    console.log("Artista não encontrado:", id);
    return res.status(404).json({ error: "Artista não encontrado" });
  }
  res.json(artista);
});

module.exports = router;
