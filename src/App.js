import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listas from './pages/Listas';
import SolicitarCifras from './pages/SolicitarCifras';
import Buscarcifra from './pages/Buscarcifra';
import ArtistaPage from "./pages/ArtistaPage";
import MusicaPage from "./pages/MusicaPage";



function App() {
  const username = "Gustavo";
  return (
   
    <BrowserRouter>
      <Header username={username}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Listas" element={<Listas />} />
        <Route path="/SolicitarCifras" element={<SolicitarCifras />} />
        <Route path="/Buscarcifra" element={<Buscarcifra />} />
        <Route path="/artista/:id" element={<ArtistaPage />} />
        <Route path="/artista/:id/musica/:musicaId" element={<MusicaPage />} />
        </Routes>
      <Footer/>
      </BrowserRouter>
     
  );
}

export default App;