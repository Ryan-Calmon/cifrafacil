// src/pages/Listas.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adicionarLista, editarLista, deletarLista } from "../redux/listasSlice";
import "../styles/Listas.css";

function Listas() {
  const listas = useSelector((state) => state.listas.listas); // Corrigido aqui para acessar o array
  const favoritos = useSelector((state) => state.favoritos.lista);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [novaLista, setNovaLista] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [toast, setToast] = useState("");

  const mostrarToast = (mensagem) => {
    setToast(mensagem);
    setTimeout(() => setToast(""), 2500);
  };

  const salvarLista = () => {
    const nomeTrim = novaLista.trim();
    if (!nomeTrim) return mostrarToast("O nome da lista não pode ser vazio.");

    const nomeDuplicado = listas.some(
      (l, i) => l.nome.toLowerCase() === nomeTrim.toLowerCase() && i !== editandoIndex
    );

    if (nomeDuplicado) {
      return mostrarToast("Já existe uma lista com esse nome.");
    }

    if (editandoIndex !== null) {
      dispatch(editarLista({ index: editandoIndex, novoNome: nomeTrim }));
      mostrarToast("Lista editada com sucesso!");
      setEditandoIndex(null);
    } else {
      dispatch(adicionarLista(nomeTrim));
      mostrarToast("Lista criada com sucesso!");
    }

    setNovaLista("");
    setShowModal(false);
  };

  return (
    <div className="listas-page">
      <h2 className="titulo">Suas Listas</h2>

      <div className="listas-container">
        {/* Lista automática de favoritos */}
        {favoritos.length > 0 && (
          <div className="lista-item">
            <h4>Favoritos</h4>
            <ul>
              {favoritos.map((musica, idx) => (
                <li key={idx}>
                  <Link to={`/artista/${musica.artistaId}/musica/${musica.musicaId}`}>
                    {musica.artistaId} - {musica.musicaId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {listas.length === 0 && favoritos.length === 0 && (
          <p>Nenhuma lista ou favorito encontrado.</p>
        )}

        {listas.map((lista, index) => (
          <div key={index} className="lista-item">
            <h4>{lista.nome}</h4>
            {lista.musicas.length > 0 && (
              <ul>
                {lista.musicas.map((musica, idx) => (
                  <li key={idx}>
                    <Link to={`/artista/${musica.artistaId}/musica/${musica.musicaId}`}>
                      {musica.artistaId} - {musica.musicaId}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="acoes">
              <button
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja deletar esta lista?")) {
                    dispatch(deletarLista(index));
                  }
                }}
              >
                🗑️
              </button>
              <button
                onClick={() => {
                  setNovaLista(lista.nome);
                  setEditandoIndex(index);
                  setShowModal(true);
                }}
              >
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="botao-adicionar"
        onClick={() => {
          setNovaLista("");
          setEditandoIndex(null);
          setShowModal(true);
        }}
      >
        +
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-fechar" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>{editandoIndex !== null ? "Editar Lista" : "Adicionar Nova Lista"}</h3>
            <input
              type="text"
              value={novaLista}
              onChange={(e) => setNovaLista(e.target.value)}
              placeholder="Nome da lista"
              autoFocus
            />
            <button className="botao-salvar" onClick={salvarLista}>
              {editandoIndex !== null ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      {toast && <div className="custom-toast show">{toast}</div>}
    </div>
  );
}

export default Listas;
