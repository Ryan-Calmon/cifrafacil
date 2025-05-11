// src/redux/listasSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("listas")) || [];

const listasSlice = createSlice({
  name: "listas",
  initialState,
  reducers: {
    adicionarLista: (state, action) => {
      state.push({ nome: action.payload, musicas: [] });
      localStorage.setItem("listas", JSON.stringify(state));
    },
    editarLista: (state, action) => {
      const { index, novoNome } = action.payload;
      state[index].nome = novoNome;
      localStorage.setItem("listas", JSON.stringify(state));
    },
    deletarLista: (state, action) => {
      state.splice(action.payload, 1);
      localStorage.setItem("listas", JSON.stringify(state));
    },
    carregarListas: (state, action) => {
      return action.payload;
    }
  }
});

export const { adicionarLista, editarLista, deletarLista, carregarListas } = listasSlice.actions;
export default listasSlice.reducer;
