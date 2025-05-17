// backend/routes/solicitacoes.js
const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../dbUtils");

// Listar solicitações
router.get("/", (req, res) => {
  const db = lerDB();
  res.json(db.solicitacoes || []);
});

// Atualizar status da solicitação
router.patch("/:id", (req, res) => {
  const db = lerDB();
  const solicitacao = db.solicitacoes.find(s => s.id === req.params.id);
  if (!solicitacao) return res.status(404).json({ error: "Não encontrado" });

  Object.assign(solicitacao, req.body);
  salvarDB(db);
  res.json(solicitacao);
});

module.exports = router;
