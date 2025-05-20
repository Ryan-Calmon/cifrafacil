const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../dbUtils");

router.get("/:musicaId", (req, res) => {
  const { musicaId } = req.params;
  const db = lerDB();
  if (!db.comentarios) db.comentarios = [];

  const comentariosMusica = db.comentarios.filter(c => c.musicaId === musicaId);
  res.json(comentariosMusica);
});

router.post("/", (req, res) => {
  const { musicaId, autor, texto } = req.body;
  if (!musicaId || !autor || !texto) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const db = lerDB();
  if (!db.comentarios) db.comentarios = [];

  const novoComentario = {
    id: Date.now().toString(),
    musicaId,
    autor,
    texto,
    data: new Date().toISOString(),
  };

  db.comentarios.push(novoComentario);
  salvarDB(db);

  res.status(201).json(novoComentario);
});

module.exports = router;
