import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GuardadoList = ({ slotId }) => {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const ngrokUrl = localStorage.getItem("backend-link");

  useEffect(() => {
    const fetchPartidas = async () => {
  try {
    const response = await fetch(`${ngrokUrl}/api/games/saved-games/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameDataID: localStorage.getItem("saveId") }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }

    const data = await response.json();
    setPartidas(data);
  } catch (error) {
    console.error("Error cargando partidas:", error);
  } finally {
    setLoading(false);
  }
};

    fetchPartidas();
  }, [slotId]);

  if (loading) return <p>Cargando partidas...</p>;

  return (
    <div className="card mt-3">
      <div className="card-header">Partidas del Slot {slotId}</div>
      <ul className="list-group list-group-flush">
        {partidas.length === 0 ? (
          <li className="list-group-item">No hay partidas guardadas.</li>
        ) : (
          partidas.map((partida) => (
            <li key={partida.id} className="list-group-item">
              <strong>Rango:</strong> {partida.playerRank}<br />
              <strong>Partidas ganadas:</strong> {partida.wins}<br />
              <strong>Partidas perdidas:</strong> {partida.loses}<br />
              <strong>Puntuación:</strong> {partida.score}<br />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GuardadoList;