import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const GAME_START_TIME = 0;
const GAME_END_TIME = 108;

const THIEF_OPTIONS = {
  "Pelo": ["Negro", "Rubio", "Pelirrojo", "Castaño"],
  "Ropa": ["Abrigo rojo", "Sombrero negro", "Traje elegante"],
  "Hobby": ["Esgrima", "Pintura", "Surf", "Ajedrez"],
  "Vehículo": ["Moto", "Helicóptero", "Submarino", "Camión"]
};

// 👉 Función para elegir aleatoriamente una característica
const getRandomTraits = () => {
  const traits = {};
  for (const key of Object.keys(THIEF_OPTIONS)) {
    const options = THIEF_OPTIONS[key];
    traits[key] = options[Math.floor(Math.random() * options.length)];
  }
  return traits;
};

const BASE_LOCATIONS = [
  "Hyrule (Zelda)",
  "Raccoon City (Resident Evil)",
  "Mushroom Kingdom (Mario)",
  "Green Hill Zone (Sonic)",
  "Midgar (Final Fantasy VII)",
  "Los Santos (GTA V)",
  "City 17 (Half-Life 2)",
  "Columbia (Bioshock Infinite)",
  "Pelican Town (Stardew Valley)",
  "Yharnam (Bloodborne)"
];

const FAKE_CLUES = [
        'Solo humo y confusión.',
        'Un testigo dijo que no vio nada.',
        'Parecía una ilusión.'
      ];

export default function CarmenSandiegoGame() {

  document.body.style.display = "block";

  const navigate = useNavigate();
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [hoursPassed, setHoursPassed] = useState(0);
  const [thiefInfo, setThiefInfo] = useState({ Pelo: '', Ropa: '', Hobby: '', Vehículo: '' });
  const [warrant, setWarrant] = useState('');
  const [foundClues, setFoundClues] = useState([]);
  const [message, setMessage] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [thiefProfile, setThiefProfile] = useState({});
  const [locations, setLocations] = useState([]);
  const [clueSidebarOpen, setClueSidebarOpen] = useState(false);

  const ngrokUrl = localStorage.getItem("backend-link");

  const scoreInfo = {
    gameWon : false,
    score : 0,
    gameDataID: localStorage.getItem("saveId")
  };

  useEffect(() => {
    const profile = getRandomTraits();
    setThiefProfile(profile);

    const traitsKeys = Object.keys(profile);

    const generatedLocations = BASE_LOCATIONS.map((name, idx) => {
      const traitKey = traitsKeys[idx % traitsKeys.length];
      const traitValue = profile[traitKey];
      const correctClue = `Pista: ${traitKey} del ladrón es ${traitValue}`;

      const clues = [...FAKE_CLUES];
      const correctClueIndex = Math.floor(Math.random() * 3);
      clues[correctClueIndex] = correctClue;

      return {
        name,
        clues,
        correctClueIndex
      };
    });

    setLocations(generatedLocations);
  }, []);

  const currentLocation = locations[currentLocationIndex] || { name: '', clues: [] };

  const advanceTime = (hours) => {
    setHoursPassed((prev) => prev + hours);
    if (hoursPassed > GAME_END_TIME) {
      setGameResult("fail");
    }
  };

  const travelToLocation = (index) => {
    if (index !== currentLocationIndex) {
      advanceTime(5);
      setCurrentLocationIndex(index);
      setMessage('Viajaste a ' + locations[index].name);
    }
  };

  const investigateZone = (zone) => {
    advanceTime(3);
    const isCorrect = zone === currentLocation.correctClueIndex;
    const clue = currentLocation.clues[zone];
    if(!foundClues.includes(clue))
      (!FAKE_CLUES.includes(clue))? setFoundClues([...foundClues, clue]): null;
    setMessage(isCorrect ? '¡Pista encontrada! ' + clue : 'Nada útil: ' + clue);
  };

  const issueWarrant = () => {
    setWarrant(JSON.stringify(thiefInfo));
    setMessage('Orden de búsqueda emitida');
  };

  const attemptArrest = () => {
    const correctWarrant = Object.entries(thiefProfile).every(
      ([key, val]) => thiefInfo[key] === val
    );

    if (correctWarrant) {
      setGameResult("win");
    } else {
      setGameResult("fail");
    }
  };

  const getTimeString = () => {
    const day = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', "Sábado"];
    const hoursTotal = 8 + hoursPassed;
    const currentDayIndex = Math.floor(hoursTotal / 24);
    const hour = hoursTotal % 24;
    return `${day[currentDayIndex]} ${hour}:00`;
  };

  if (gameResult) {

    if(gameResult === "win") {

      scoreInfo.gameWon = true;
      scoreInfo.score = 40000 + (100000 - (hoursPassed * 1000));

    }else {

      scoreInfo.score = (Object.entries(thiefProfile).filter(
        ([key, val]) => thiefInfo[key] === val
      ).length * 10000) + (100000 - (hoursPassed * 1000));

    }

    const response = fetch(`${ngrokUrl}/api/games/score-save`, {method: 'POST',
    //const response = fetch('http://localhost:8000/api/games/score-save', {method: 'POST', 
                                                  headers: {'Content-Type': 'application/json',
                                                            'Accept': 'application/json,text/plain',
                                                            Authorization: "Bearer " + localStorage.getItem("token")
                                                            }, 
                                                  body: JSON.stringify(scoreInfo),
                                                  })

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-6">
        <h1 className="text-4xl font-bold">
          {gameResult === "win" ? "¡Victoria!" : "Fallaste"}
        </h1>
        <p className="text-xl">
          {gameResult === "win"
            ? "Capturaste al ladrón justo a tiempo. ¡Buen trabajo, detective!"
            : "El ladrón escapó... Intenta de nuevo con más pistas y mejores deducciones."}
        </p>
        <button type="button" onClick={() => navigate("/menu")}>Volver al menú</button>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (

    <div className='container-fluid m-lg-0 m-100'>
    <div className='row'>

    <div className='col-lg-9 col-11 py-4'>
    <div className="relative p-4 pr-64 space-y-4">
      {/* Botón volver */}
      <button
        className="absolute top-4 left-4 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-xl text-black z-50"
        onClick={() => {
          const confirmBack = window.confirm("¿Seguro que quieres volver? Perderás tu progreso.");
          if (confirmBack) {
            document.body.style.display = "flex";
            navigate(-1);
          }
        }}
      >
        ← Volver
      </button>

      {/* Botón fijo para abrir/cerrar */}

      <h1 className="text-2xl font-bold">Carmen Sandiego: Videojuegos Edition</h1>
      <p>Hora actual: {getTimeString()}</p>
      <p>Ubicación actual: {currentLocation.name}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {locations.map((loc, i) => (
          <button key={i} onClick={() => travelToLocation(i)} disabled={i === currentLocationIndex}>
            Viajar a {loc.name}
          </button>
        ))}
      </div>

      <h2 className="text-xl">Investigar zonas</h2>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((zone) => (
          <button key={zone} onClick={() => investigateZone(zone)}>
            Zona {zone + 1}
          </button>
        ))}
      </div>

      <h2 className="text-xl">Características del ladrón</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(THIEF_OPTIONS).map(([trait, options]) => (
          <select
            key={trait}
            className="border p-1"
            value={thiefInfo[trait] || ""}
            onChange={(e) => setThiefInfo({ ...thiefInfo, [trait]: e.target.value })}
          >
            <option value="">{trait}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ))}
      </div>

      <button onClick={issueWarrant}>Emitir orden de búsqueda</button>
      <button onClick={attemptArrest} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl">
        Arrestar al ladrón
      </button>

      <div className="rounded-2xl shadow-lg p-4">
        <div className="p-4"><p>{message}</p></div>
      </div>
      </div>
      </div>

{/* Panel lateral */}
<div
  className={`fixed top-0 right-0 h-full w-64 shadow-lg p-4 border-l z-40 transition-transform duration-300 container col-3 sidebar-clues`}
    style={{ transform: clueSidebarOpen ? 'translateX(0)' : 'translateX(90%)' }}
>
  <div className='row'>
  <button
  onClick={() => {setClueSidebarOpen(!clueSidebarOpen); updateSidebarTranslate(clueSidebarOpen);}}
  className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-blue-600 text-white px-2 py-2 rounded-l z-50 col-1"
>
  {clueSidebarOpen ? '←' : '→'}
</button>
<div className='col-11 h-100 min-vh-100'>
  <h2 className="text-lg font-semibold mb-2">Pistas encontradas</h2>
  <ul className="list-unstyled small overflow-auto">
    {foundClues.map((clue, i) => (
      <li key={i}>{clue}</li>
    ))}
  </ul>
  </div>
  </div>
</div>

    </div>
    </div>
  );
}

function updateSidebarTranslate(clueSidebarOpen) {
  const sidebar = document.getElementById('sidebar-clues');
  const width = window.innerWidth;

  if(clueSidebarOpen){

  if (!sidebar) return;

  if (width >= 1200) {
    sidebar.style.transform = 'translateX(90%)';
  } else if (width >= 992) {
    sidebar.style.transform = 'translateX(100%)';
  } else if (width >= 768) {
    sidebar.style.transform = 'translateX(110%)';
  } else {
    sidebar.style.transform = 'translateX(125%)';
  }

} else {
  sidebar.style.transform = 'translateX(0%)';
}
}

window.addEventListener('resize', updateSidebarTranslate);
window.addEventListener('load', updateSidebarTranslate);
