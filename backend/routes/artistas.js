// backend/routes/artistas.js
const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../dbUtils");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({
  dest: path.resolve(__dirname, "..", "..", "public", "uploads"),
});

function normalizarId(nome) {
  return nome.toLowerCase().replace(/\s+/g, "");
}

// Listar todos os artistas
router.get("/", (req, res) => {
  const db = lerDB();
  res.json(db.artistas || []);
});

// Adicionar novo artista
router.post("/", (req, res) => {
  const { nome, imagem, categoria } = req.body;
  if (!nome || !categoria) {
    return res.status(400).json({ error: "Nome e categoria são obrigatórios" });
  }

  const db = lerDB();
  const jaExiste = db.artistas.find((a) => normalizarId(a.nome) === normalizarId(nome));
  if (jaExiste) {
    return res.status(400).json({ error: "Artista já existe" });
  }

  const novoArtista = {
    id: normalizarId(nome),
    nome,
    imagem: imagem || "",
    categoria,
    numeroDeFas: 0,
    usuariosFas: [],
    musicas: [],
  };

  db.artistas.push(novoArtista);
  salvarDB(db);
  res.status(201).json({ sucesso: true, artista: novoArtista });
});

// Atualizar artista com possível mudança de ID
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, imagem, categoria } = req.body;

  const db = lerDB();
  const artistaIndex = db.artistas.findIndex((a) => a.id === id);
  if (artistaIndex === -1) {
    return res.status(404).json({ error: "Artista não encontrado" });
  }

  const artista = db.artistas[artistaIndex];
  let novoId = artista.id;

  if (nome) {
    const novoIdCalculado = normalizarId(nome);
    if (novoIdCalculado !== artista.id) {
      const existente = db.artistas.find((a) => a.id === novoIdCalculado);
      if (existente) {
        return res.status(400).json({ error: "Já existe um artista com esse nome" });
      }

      artista.nome = nome;
      artista.id = novoIdCalculado;
      novoId = novoIdCalculado;
    }
  }

  if (imagem) artista.imagem = imagem;
  if (categoria) artista.categoria = categoria;

  db.artistas[artistaIndex] = artista;
  salvarDB(db);
  res.json({ sucesso: true, artista });
});

// Deletar artista
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const db = lerDB();
  const index = db.artistas.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Artista não encontrado" });
  }

  db.artistas.splice(index, 1);
  salvarDB(db);
  res.json({ sucesso: true });
});

// Upload de imagem
router.post("/upload-imagem", upload.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }
  const fileName = req.file.filename;
  res.status(201).json({ sucesso: true, caminho: `/uploads/${fileName}` });
});

// Obter artista por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const db = lerDB();
  const artista = db.artistas.find((a) => a.id === id);
  if (!artista) {
    return res.status(404).json({ error: "Artista não encontrado" });
  }
  res.json(artista);
});

module.exports = router;