import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listas: JSON.parse(localStorage.getItem("listas")) || []
};

const listasSlice = createSlice({
  name: "listas",
  initialState,
  reducers: {
    adicionarLista: (state, action) => {
      const nome = action.payload.trim();
      if (!state.listas.find(l => l.nome.toLowerCase() === nome.toLowerCase())) {
        state.listas.push({ nome, musicas: [] });
        localStorage.setItem("listas", JSON.stringify(state.listas));
      }
    },
    adicionarMusicaEmLista: (state, action) => {
      const { nomeLista, artistaId, musicaId } = action.payload;
      const nome = nomeLista.trim();
      let lista = state.listas.find(l => l.nome.toLowerCase() === nome.toLowerCase());

      if (!lista) {
        // Cria a lista se não existir
        lista = { nome, musicas: [] };
        state.listas.push(lista);
      }

      // Verifica se a música já está na lista
      const existeMusica = lista.musicas.some(
        (m) => m.artistaId === artistaId && m.musicaId === musicaId
      );

      if (!existeMusica) {
        lista.musicas.push({ artistaId, musicaId });
      }

      localStorage.setItem("listas", JSON.stringify(state.listas));
    },
    editarLista: (state, action) => {
      const { index, novoNome } = action.payload;
      state.listas[index].nome = novoNome;
      localStorage.setItem("listas", JSON.stringify(state.listas));
    },
    deletarLista: (state, action) => {
      state.listas.splice(action.payload, 1);
      localStorage.setItem("listas", JSON.stringify(state.listas));
    },
    carregarListas: (state, action) => {
      state.listas = action.payload;
    },
  },
});

export const {
  adicionarLista,
  adicionarMusicaEmLista,
  editarLista,
  deletarLista,
  carregarListas,
} = listasSlice.actions;

export default listasSlice.reducer;
