import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function GameMenu({ userId }) {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  const ngrokUrl = localStorage.getItem("backend-link");

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const now = Math.floor(Date.now() / 1000);
        if (!decodedPayload.exp || decodedPayload.exp < now) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkToken();

    axios
      .get(`${ngrokUrl}/api/games/saved-games`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => setGames(res.data))
      .catch(err => console.error("Error al obtener partidas:", err));
  }, [userId]);

  const handleSelect = (index) => {
    const selectedGame = games[index];
    alert(`Cargando partida con ID: ${selectedGame.gameDataID}`);
    localStorage.setItem("saveId", selectedGame.gameDataID);
    navigate("/partida");
  };

  const handleCreate = () => {
    axios
      .post(`${ngrokUrl}/api/games/saved-games`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => {
        alert("Nueva partida creada");
        localStorage.setItem("saveId", res.data[0].game.gameDataID);
        navigate("/partida");
      })
      .catch(err => console.error("Error al crear partida:", err));
  };

  // Nueva función: mostrar lista de partidas de cada slot
  const handleShowSlotList = (slotIndex) => {
    const selectedGame = games[slotIndex];
    localStorage.setItem("saveId", selectedGame.gameDataID);
    navigate("/lista");
  };

  return (
    <div>
      <h2>Selecciona una partida</h2>

      {/* Botones de selección o creación */}
      {[0, 1, 2].map(index => (
        <div key={index}>
          <button onClick={() => games[index] ? handleSelect(index) : handleCreate()}>
            Partida {index + 1} {games[index] ? "(Guardada)" : "(Vacía)"}
          </button>
        </div>
      ))}

      <br />

      {/* Nuevos botones para mostrar lista por slot */}
      {[0, 1, 2].map(index => (
        <div key={`slot-list-${index}`}>
          <button onClick={() => handleShowSlotList(index)}>
            Ver lista de partidas en Slot {index + 1}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
    const navigate = useNavigate();

    useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token"); // o el nombre que uses
      if (!token) {
        setPassOk(false);
        return;
      }

      try {
        // Suponiendo que el token es un JWT
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

        if (!decodedPayload.exp || decodedPayload.exp < now) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (e) {
        localStorage.removeItem("token");
          navigate("/");
      }
    };

    checkToken();
  }, []);

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