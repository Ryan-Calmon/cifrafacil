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
import AdminSolicitacoes from "./pages/AdminSolicitacoes";
import GerenciarCifras from './pages/GerenciarCifras';
import Admin from './pages/Admin';
import GerenciarArtistas from './pages/GerenciarArtistas';


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
        <Route path="/solicitacoes" element={<AdminSolicitacoes />} />
        <Route path="/GerenciarCifras" element={<GerenciarCifras />} />
        <Route path="/GerenciarArtistas" element={<GerenciarArtistas />} />
        <Route path="/Admin" element={<Admin />} />
        </Routes>
      <Footer/>
      </BrowserRouter>
     
  );
}

export default App;