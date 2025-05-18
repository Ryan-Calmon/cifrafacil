import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchArtistas } from "../redux/artistasSlice";
import "../styles/Header.css";
import FirstLetter from "./Primeiraletra";
import BarradeBusca from "../components/BarradeBusca";

function Header({ username }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [termoBusca, setTermoBusca] = useState("");
  const resultadosRef = useRef(null);
  const isHomePage = location.pathname === "/";

  const { lista: artistas, status } = useSelector((state) => state.artistas);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArtistas());
    }
  }, [status, dispatch]);

  const artistasFiltrados = artistas.filter((artista) =>
    artista.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

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
    <header>
      <div className="container">
        <div className="row header-row">
          <div className="col-8 col-md-3 col-lg-2 col-xl-2">
            <div className="logo">
              <Link to="/">
              <img src="./Images/logocifra.png" alt="Cifra Fácil Logo" />
              </Link>
            </div>
          </div>

         {/* Barra de busca visível nas outras páginas (não na Home) */}
  {!isHomePage && (
    <div className="col-8 col-lg-4 col-xl-4 d-lg-block d-none d-xl-block">
    <BarradeBusca />  {/* Componente BarraDeBusca */}
  </div>
    )}

          <div className="col-md-6 col-lg-4 col-xl-4 d-none d-md-block d-lg-block d-xl-block">
            <nav className="navegacao-topo">
              <Link className="menuzin-header" to="/Listas">Suas Listas</Link>
              <Link className="menuzin-header" to="/SolicitarCifras">Enviar Cifras</Link>
              <Link className="menuzin-header">Olá, {username}</Link>
              <Link className="menuzin-header"to="/Admin">Admin</Link>
            </nav>
          </div>

          <div className="col col-md-1 col-lg-1 col-xl-1">
            <div className="username-topo">
              <div className="username">
                <FirstLetter name={username} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
