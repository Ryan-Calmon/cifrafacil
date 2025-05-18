// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

// Importar rotas
const solicitacoesRoutes = require("./routes/solicitacoes");
const artistasRoutes = require("./routes/artistas");
const musicasRoutes = require("./routes/musicas");


// Usar rotas
app.use("/solicitacoes", solicitacoesRoutes);
app.use("/artistas", artistasRoutes);
app.use("/musicas", musicasRoutes);

// Config multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Endpoint para upload de arquivo + criar solicitação
const { lerDB, salvarDB } = require("./dbUtils");

app.post("/upload", upload.single("arquivo"), (req, res) => {
  const { musica, artista, youtube, data } = req.body;
  const nomeArquivo = req.file?.originalname || "";

  const db = lerDB();

  const nova = {
    id: Math.random().toString(16).slice(2, 6),
    musica,
    artista,
    youtube,
    nomeArquivo,
    data,
  };

  if (!db.solicitacoes) db.solicitacoes = [];
  db.solicitacoes.push(nova);
  salvarDB(db);

  res.status(201).json({ sucesso: true, solicitacao: nova });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
// Ajuste o caminho conforme a localização do seu arquivo principal
const musicasArquivosRouter = require("./routes/musicas");


app.use("/musicas", musicasArquivosRouter);
