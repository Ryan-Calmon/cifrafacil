import { configureStore } from '@reduxjs/toolkit';
import favoritosReducer from './favoritosSlice';
import listasReducer from './listasSlice';
import artistasReducer from './artistasSlice';

export const store = configureStore({
  reducer: {
    favoritos: favoritosReducer,
    listas: listasReducer,
    artistas: artistasReducer,
  }
});
