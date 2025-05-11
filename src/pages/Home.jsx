import React, { useState, useRef, useEffect } from "react";
import "../styles/Home.css";
import BarraDeBusca from "../components/BarradeBusca";
import ArtistaCard from "../components/ArtistaCard";
import { Link } from "react-router-dom";

function Home() {
  const [termoBusca, setTermoBusca] = useState("");
  const [artistas, setArtistas] = useState([]); // Para armazenar os artistas do backend
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("MPB");
  const resultadosRef = useRef(null);

  // Carrega os artistas do backend (db.json)
  useEffect(() => {
    fetch("http://localhost:3001/artistas") // Ajuste a URL de acordo com a sua configuração do backend
      .then((response) => response.json())
      .then((data) => {
        setArtistas(data);
      })
      .catch((error) => console.error("Erro ao carregar os artistas:", error));
  }, []);

  const artistasFiltradosPorBusca = artistas.filter((artista) =>
    artista.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const artistasFiltradosPorCategoria = artistasFiltradosPorBusca.filter(
    (artista) => artista.categoria === categoriaSelecionada
  );

  // Ordenar os artistas pelo número de fãs (do maior para o menor)
  const artistasOrdenadosPorFas = artistasFiltradosPorCategoria.sort(
    (a, b) => b.numeroDeFas - a.numeroDeFas
  );

  // Atribuir a posição dos artistas de acordo com a ordem (1º, 2º, 3º...)
  const artistasComPosicao = artistasOrdenadosPorFas.map((artista, index) => ({
    ...artista,
    posicao: index + 1, // A posição será o índice + 1 (1º, 2º, 3º...)
  }));

  const handleCategoriaChange = (e) => {
    setCategoriaSelecionada(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultadosRef.current && !resultadosRef.current.contains(event.target)) {
        setTermoBusca("");
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setTermoBusca("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="page-content">
      <div className="logo-container">
        <img src="./Images/logocifra.png" alt="Logo" className="logo logo-centro" />
      </div>

      <div className="buscar-container">
        <BarraDeBusca />
      </div>

      <div className="container-artistas">
        <h2 className="em-alta">Em Alta</h2>

        {/* Menu de seleção de categorias */}
        <select onChange={handleCategoriaChange} value={categoriaSelecionada}>
          <option value="MPB">MPB</option>
          <option value="Rock">Rock</option>
          <option value="Samba">Samba</option>
          <option value="Bossa Nova">Bossa Nova</option>
        </select>

        {/* Resultados filtrados de artistas */}
        <div className="artista-grid">
          {artistasComPosicao.map((artista, index) => (
            <div key={index} className="artista-grid-item">
              <ArtistaCard
                imagem={artista.imagem}
                nome={artista.nome}
                posicao={artista.posicao}
                numeroDeFas={artista.numeroDeFas}  // Adicionando o número de fãs
                id={artista.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
