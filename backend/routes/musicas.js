const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../dbUtils");

// Helper para normalizar título para id
function normalizarTitulo(titulo) {
  return titulo.toLowerCase().replace(/\s+/g, "");
}

// Listar todas as músicas de todos os artistas
router.get("/", (req, res) => {
  const db = lerDB();
  let todasMusicas = [];
  db.artistas.forEach((artista) => {
    artista.musicas.forEach((musica) => {
      todasMusicas.push({
        id: `${artista.id}-${normalizarTitulo(musica.titulo)}`,
        artistaId: artista.id,
        artistaNome: artista.nome,
        musicaTitulo: musica.titulo,
        instrumentos: musica.instrumentos || [],
        conteudoUrl: musica.conteudoUrl || "",
        youtubeId: musica.youtubeId || "",
        tom: musica.tom || "",
        cifraTexto: musica.cifraTexto || "",  // Campo cifraTexto adicionado
      });
    });
  });
  res.json(todasMusicas);
});

// Adicionar nova música
router.post("/", (req, res) => {
  const { artistaNome, musicaTitulo, youtubeId, conteudoUrl, cifraTexto } = req.body;
  if (!artistaNome || !musicaTitulo || !cifraTexto) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const db = lerDB();

  // Busca artista pelo nome (case insensitive)
  let artista = db.artistas.find((a) => a.nome.toLowerCase() === artistaNome.toLowerCase());

  // Se artista não existir, cria um novo artista simples
  if (!artista) {
    artista = {
      id: artistaNome.toLowerCase().replace(/\s+/g, ""),
      nome: artistaNome,
      imagem: "",
      categoria: "",
      numeroDeFas: 0,
      usuariosFas: [],
      musicas: [],
    };
    db.artistas.push(artista);
  }

  // Verifica se a música já existe para o artista
  const musicaExistente = artista.musicas.find(
    (m) => m.titulo.toLowerCase() === musicaTitulo.toLowerCase()
  );
  if (musicaExistente) {
    return res.status(400).json({ error: "Música já existe para este artista" });
  }

  // Adiciona a música com campo cifraTexto
  artista.musicas.push({
    titulo: musicaTitulo,
    instrumentos: [],
    conteudoUrl: conteudoUrl || "",
    youtubeId: youtubeId || "",
    tom: "",
    cifraTexto,
  });

  salvarDB(db);
  res.status(201).json({ sucesso: true, musica: artista.musicas[artista.musicas.length - 1] });
});

// Atualizar música
router.patch("/:id", (req, res) => {
  const db = lerDB();
  const { id } = req.params;
  const { musicaTitulo, instrumentos, conteudoUrl, youtubeId, tom, cifraTexto } = req.body;

  const [artistaId, ...tituloParts] = id.split("-");
  const musicaId = tituloParts.join("-");

  const artista = db.artistas.find((a) => a.id === artistaId);
  if (!artista) return res.status(404).json({ error: "Artista não encontrado" });

  const musicaObj = artista.musicas.find(
    (m) => normalizarTitulo(m.titulo) === musicaId
  );
  if (!musicaObj) return res.status(404).json({ error: "Música não encontrada" });

  if (musicaTitulo) musicaObj.titulo = musicaTitulo;
  if (instrumentos) musicaObj.instrumentos = instrumentos;
  if (conteudoUrl) musicaObj.conteudoUrl = conteudoUrl;
  if (youtubeId) musicaObj.youtubeId = youtubeId;
  if (tom) musicaObj.tom = tom;
  if (cifraTexto) musicaObj.cifraTexto = cifraTexto;

  salvarDB(db);
  res.json({ sucesso: true, musica: musicaObj });
});

// Deletar música
router.delete("/:id", (req, res) => {
  const db = lerDB();
  const { id } = req.params;

  const [artistaId, ...tituloParts] = id.split("-");
  const musicaId = tituloParts.join("-");

  const artista = db.artistas.find((a) => a.id === artistaId);
  if (!artista) return res.status(404).json({ error: "Artista não encontrado" });

  const index = artista.musicas.findIndex(
    (m) => normalizarTitulo(m.titulo) === musicaId
  );
  if (index === -1) return res.status(404).json({ error: "Música não encontrada" });

  artista.musicas.splice(index, 1);
  salvarDB(db);
  res.json({ sucesso: true });
});

module.exports = router;
