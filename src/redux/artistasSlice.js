// src/redux/artistasSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:3001";

export const fetchArtistas = createAsyncThunk(
  "artistas/fetchArtistas",
  async () => {
    const res = await fetch(`${API_BASE}/artistas`);
    if (!res.ok) throw new Error("Erro ao carregar artistas");
    return await res.json();
  }
);

export const fetchArtistaPorId = createAsyncThunk(
  "artistas/fetchArtistaPorId",
  async (id) => {
    const res = await fetch(`${API_BASE}/artistas/${id}`);
    if (!res.ok) throw new Error("Artista não encontrado");
    return await res.json();
  }
);

const artistasSlice = createSlice({
  name: "artistas",
  initialState: {
    lista: [],
    artistaSelecionado: null,
    status: "idle",
    error: null,
  },
  reducers: {
    limparArtistaSelecionado(state) {
      state.artistaSelecionado = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtistas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArtistas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lista = action.payload;
      })
      .addCase(fetchArtistas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchArtistaPorId.pending, (state) => {
        state.status = "loading";
        state.artistaSelecionado = null;
      })
      .addCase(fetchArtistaPorId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artistaSelecionado = action.payload;
      })
      .addCase(fetchArtistaPorId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { limparArtistaSelecionado } = artistasSlice.actions;

export default artistasSlice.reducer;
