import React from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-home-page">
      <h1>Administração</h1>
   <div className="botoes-filtros">
      <button className="botao"
        onClick={() => navigate("/GerenciarCifras")}
    
      >
        Gerenciar Cifras
      </button>
    <button className="botao"
        onClick={() => navigate("/GerenciarArtistas")}
      >
        Gerenciar Artistas
      </button>
      <button className="botao"
        onClick={() => navigate("/solicitacoes")}
      >
        Ver Solicitações
      </button>

      </div>
    </div>
  );
}

export default Admin;
