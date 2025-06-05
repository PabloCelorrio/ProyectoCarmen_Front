import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PassChange from './PassChange';


export function GameMenu({ userId }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/games/${userId}`)
      .then(res => setGames(res.data))
      .catch(err => console.error("Error al obtener partidas:", err));
  }, [userId]);

  const handleSelect = (index) => {
    const selectedGame = games[index];
    alert(`Cargando partida con ID: ${selectedGame.gameDataID}`);
    // Aquí iría la lógica para cargar y navegar
  };

  const handleCreate = () => {
    axios.post(`http://localhost:8000/api/games/${userId}`)
      .then(res => {
        alert("Nueva partida creada");
        window.location.reload();
      })
      .catch(err => console.error("Error al crear partida:", err));
  };

  return (
    <div>
      <h2>Selecciona una partida</h2>
      {[0, 1, 2].map(index => (
        <button key={index} onClick={() => games[index] ? handleSelect(index) : handleCreate()}>
          Partida {index + 1} {games[index] ? "(Guardada)" : "(Vacía)"}
        </button>
      ))}
    </div>
  );
}

export default function Menu() {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-purple-700 text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center drop-shadow-lg">
          ¿Dónde está Carmen Sandiego?
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={() => navigate("/juego")}
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-2xl shadow-lg transition-all duration-300 text-xl"
          >
            Iniciar Juego
          </button>
          <button
            onClick={() => navigate("/ajustes")}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 text-xl"
          >
            Ajustes
          </button>
        </div>
      </div>
    );
}