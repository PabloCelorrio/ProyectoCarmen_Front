import React, { useState, useEffect } from 'react';
//import { Button } from './components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

const GAME_START_TIME = 0; // Monday 8am = 0 hours
const GAME_END_TIME = 108; // Friday 8pm = 108 hours

const LOCATIONS = [
  {
    name: 'Hyrule (Zelda)',
    clues: ['El ladrón llevaba una espada rota.', 'Hablaba de un reino lejano.', 'Nada interesante aquí.'],
    correctClueIndex: 1
  },
  {
    name: 'Raccoon City (Resident Evil)',
    clues: ['Alguien vio una silueta sospechosa.', 'Había una risa siniestra.', 'Nada útil aquí.'],
    correctClueIndex: 0
  },
  {
    name: 'Mushroom Kingdom (Mario)',
    clues: ['El ladrón pidió champiñones.', 'Saltaba muy alto.', 'Nada raro por aquí.'],
    correctClueIndex: 2
  }
];

const THIEF_TRAITS = ['Pelo', 'Ropa', 'Hobby', 'Vehículo'];

export default function CarmenSandiegoGame() {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [hoursPassed, setHoursPassed] = useState(0);
  const [thiefInfo, setThiefInfo] = useState({ Pelo: '', Ropa: '', Hobby: '', Vehículo: '' });
  const [warrant, setWarrant] = useState('');
  const [foundClues, setFoundClues] = useState([]);
  const [message, setMessage] = useState('');

  const currentLocation = LOCATIONS[currentLocationIndex];

  const advanceTime = (hours) => {
    setHoursPassed((prev) => prev + hours);
  };

  const travelToLocation = (index) => {
    if (index !== currentLocationIndex) {
      advanceTime(5);
      setCurrentLocationIndex(index);
      setMessage('Viajaste a ' + LOCATIONS[index].name);
    }
  };

  const investigateZone = (zone) => {
    advanceTime(3);
    const isCorrect = zone === currentLocation.correctClueIndex;
    const clue = currentLocation.clues[zone];
    setFoundClues([...foundClues, clue]);
    setMessage(isCorrect ? '¡Pista encontrada! ' + clue : 'Nada útil: ' + clue);
  };

  const issueWarrant = () => {
    setWarrant(JSON.stringify(thiefInfo));
    setMessage('Orden de búsqueda emitida');
  };

  const attemptArrest = () => {
    const finalLocation = LOCATIONS[LOCATIONS.length - 1];
    const isAtFinal = currentLocationIndex === LOCATIONS.length - 1;
    const correctWarrant = thiefInfo.Pelo && thiefInfo.Ropa && thiefInfo.Hobby && thiefInfo.Vehículo;

    if (hoursPassed > GAME_END_TIME) {
      setMessage('¡Tiempo agotado! El ladrón escapó.');
    } else if (isAtFinal && correctWarrant) {
      setMessage('¡Capturaste al ladrón!');
    } else {
      setMessage('Fallaste. El ladrón escapó.');
    }
  };

  const getTimeString = () => {
    const day = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const hoursTotal = 8 + hoursPassed;
    const currentDayIndex = Math.floor(hoursTotal / 24);
    const hour = hoursTotal % 24;
    return `${day[currentDayIndex]} ${hour}:00`;
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Carmen Sandiego: Videojuegos Edition</h1>
      <p>Hora actual: {getTimeString()}</p>
      <p>Ubicación actual: {currentLocation.name}</p>

      <div className="grid grid-cols-3 gap-4">
        {LOCATIONS.map((loc, i) => (
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
        {THIEF_TRAITS.map((trait) => (
          <input
            key={trait}
            placeholder={trait}
            className="border p-1"
            value={thiefInfo[trait]}
            onChange={(e) => setThiefInfo({ ...thiefInfo, [trait]: e.target.value })}
          />
        ))}
      </div>
      <button onClick={issueWarrant}>Emitir orden de búsqueda</button>
      <button onClick={attemptArrest} className="bg-red-500 hover:bg-red-600">Arrestar al ladrón</button>

      <div className="rounded-2xl shadow-lg p-4 bg-white">
        <div className="p-4"><p>{message}</p></div>
      </div>

      <h2 className="text-xl">Pistas encontradas:</h2>
      <ul className="list-disc ml-5">
        {foundClues.map((clue, i) => (
          <li key={i}>{clue}</li>
        ))}
      </ul>
    </div>
  );
}
