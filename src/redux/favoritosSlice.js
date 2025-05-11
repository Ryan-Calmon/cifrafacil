import { createSlice } from "@reduxjs/toolkit";

const favoritosSlice = createSlice({
  name: "favoritos",
  initialState: {
    lista: JSON.parse(localStorage.getItem("favoritos")) || [],
  },
  reducers: {
    adicionarFavorito: (state, action) => {
      const { artistaId, musicaId } = action.payload;
      const existe = state.lista.some(fav => fav.artistaId === artistaId && fav.musicaId === musicaId);
      if (!existe) {
        state.lista.push({ artistaId, musicaId });
        localStorage.setItem("favoritos", JSON.stringify(state.lista));
      }
    },
    removerFavorito: (state, action) => {
      const { artistaId, musicaId } = action.payload;
      state.lista = state.lista.filter(fav => !(fav.artistaId === artistaId && fav.musicaId === musicaId));
      localStorage.setItem("favoritos", JSON.stringify(state.lista));
    }
  }
});

export const { adicionarFavorito, removerFavorito } = favoritosSlice.actions;
export default favoritosSlice.reducer;
