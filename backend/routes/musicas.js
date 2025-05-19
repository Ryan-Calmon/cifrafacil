""// backend/routes/musicas.js
const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../dbUtils");
const fs = require("fs");
const path = require("path");

function normalizarTitulo(titulo) {
  return titulo.toLowerCase().replace(/\s+/g, "");
}

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
        cifraTexto: musica.cifraTexto || "",
      });
    });
  });
  res.json(todasMusicas);
});

router.post("/", (req, res) => {
  const { artistaNome, musicaTitulo, youtubeId, cifraTexto } = req.body;
  if (!artistaNome || !musicaTitulo || !cifraTexto) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const db = lerDB();
  let artista = db.artistas.find(
    (a) => a.nome.toLowerCase() === artistaNome.toLowerCase()
  );

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

  const musicaExistente = artista.musicas.find(
    (m) => m.titulo.toLowerCase() === musicaTitulo.toLowerCase()
  );
  if (musicaExistente) {
    return res.status(400).json({ error: "Música já existe para este artista" });
  }

  const nomeArquivo = musicaTitulo.toLowerCase().replace(/\s+/g, "") + ".html";
  const baseDir = path.resolve(__dirname, "..", "..", "public", "letras");
  const arquivoPath = path.join(baseDir, nomeArquivo);

  try {
    fs.mkdirSync(baseDir, { recursive: true });
    fs.writeFileSync(arquivoPath, cifraTexto, "utf8");
  } catch (err) {
    console.error("Erro ao salvar arquivo cifra:", err);
    return res.status(500).json({ error: "Erro ao salvar arquivo cifra" });
  }

  const novaMusica = {
    titulo: musicaTitulo,
    instrumentos: [],
    conteudoUrl: `/letras/${nomeArquivo}`,
    youtubeId: youtubeId || "",
    tom: tom || "",
  };

  artista.musicas.push(novaMusica);
  salvarDB(db);

  res.status(201).json({ sucesso: true, musica: novaMusica });
});

router.patch("/:id", (req, res) => {
  const db = lerDB();
  const { id } = req.params;
  const { musicaTitulo, instrumentos, youtubeId, tom, cifraTexto } = req.body;

  const [artistaId, ...tituloParts] = id.split("-");
  const musicaId = tituloParts.join("-");

  const artista = db.artistas.find((a) => a.id === artistaId);
  if (!artista) return res.status(404).json({ error: "Artista não encontrado" });

  const musicaObj = artista.musicas.find(
    (m) => normalizarTitulo(m.titulo) === musicaId
  );
  if (!musicaObj) return res.status(404).json({ error: "Música não encontrada" });

  let nomeArquivo = musicaObj.conteudoUrl.split("/").pop();
  if (musicaTitulo) {
    nomeArquivo = musicaTitulo.toLowerCase().replace(/\s+/g, "") + ".html";
    musicaObj.titulo = musicaTitulo;
    musicaObj.conteudoUrl = `/letras/${nomeArquivo}`;
  }

  try {
    const baseDir = path.resolve(__dirname, "..", "..", "public", "letras");
    const arquivoPath = path.join(baseDir, nomeArquivo);
    fs.mkdirSync(baseDir, { recursive: true });
    fs.writeFileSync(arquivoPath, cifraTexto || "", "utf8");
  } catch (err) {
    console.error("Erro ao salvar arquivo cifra:", err);
    return res.status(500).json({ error: "Erro ao salvar arquivo cifra" });
  }

  if (instrumentos) musicaObj.instrumentos = instrumentos;
  if (youtubeId) musicaObj.youtubeId = youtubeId;
  if (tom) musicaObj.tom = tom;

  salvarDB(db);
  res.json({ sucesso: true, musica: musicaObj });
});

router.post("/salvarArquivo", (req, res) => {
  const { conteudoUrl, cifraTexto } = req.body;

  if (!conteudoUrl || !cifraTexto) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const nomeArquivo = path.basename(conteudoUrl);
  const baseDir = path.resolve(__dirname, "..", "..", "public", "letras");
  const arquivoPath = path.join(baseDir, nomeArquivo);

  if (!arquivoPath.startsWith(baseDir)) {
    return res.status(400).json({ error: "Caminho inválido" });
  }

  fs.mkdir(baseDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Erro ao criar diretório:", err);
      return res.status(500).json({ error: "Erro ao criar pasta de letras" });
    }

    fs.writeFile(arquivoPath, cifraTexto, "utf8", (err) => {
      if (err) {
        console.error("Erro ao salvar cifra:", err);
        return res.status(500).json({ error: "Erro ao salvar cifra" });
      }
      res.json({ sucesso: true });
    });
  });
});

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