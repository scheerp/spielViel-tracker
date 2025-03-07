import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const messages = [
  'Der Server sortiert noch die Spielkarten...',
  'Die Würfel werden gerade poliert...',
  'Die Spielfiguren rücken in Position...',
  'Der Server bereitet das Spielfeld vor...',
  'Bitte einen Moment Geduld, bis alle Meeples wach sind...',
  'Der Server mischt noch das Kartendeck...',
  'Ein Moment, das Spielbrett wird noch entstaubt...',
  'Die Würfel fallen gleich – gib dem Server einen Moment...',
  'Der Dungeon wird noch generiert, bitte warte kurz...',
  'Der Server zählt noch die Siegpunkte aus...',
  'Die Meeples trinken noch ihren Morgenkaffee...',
  'Ein Moment, die Spielfiguren diskutieren noch die Regeln...',
  'Das Regelwerk wird noch einmal nachgeschlagen...',
  'Der Timer läuft – noch ein paar Sekunden Geduld...',
  'Der Server steckt im Würfelturm fest...',
  'Die Spielfiguren warten noch auf ihren Zug...',
  'Die Kartenhand wird noch gezogen...',
  'Der Server überlegt seinen nächsten Spielzug...',
  'Noch einen Moment – die Ressourcen werden noch verteilt...',
  'Das Abenteuer beginnt gleich, der Server sammelt noch Erfahrungspunkte...',
  'Die Würfel sind gefallen – also fast...',
  'Der Server sucht noch das letzte Puzzlestück...',
  'Ein Moment, die Schachtel wird noch ausgepackt...',
  'Der Server nimmt noch an einer hitzigen Debatte über Hausregeln teil...',
  'Das Spielfeld wird noch ausbalanciert...',
  'Der Server hat eine Ereigniskarte gezogen: "Bitte warten!"...',
  'Der Server berechnet noch die optimale Strategie...',
  'Noch einen Augenblick, der letzte Zug wird noch analysiert...',
];

const MESSAGE_INTERVAL = 5000;

const FancyLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, MESSAGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-12 md:mt-40">
      <Loading />
      <div
        key={currentMessageIndex}
        className="animate-fadeIn -mt-24 max-w-md px-4 text-center text-2xl text-gray-700 md:mt-8"
      >
        {messages[currentMessageIndex]}
      </div>

      <div className="max-w-md px-4 pt-8 text-center text-sm text-gray-500">
        Der Server braucht manchmal eine Minute, um aufzuwachen.
      </div>
    </div>
  );
};

export default FancyLoading;
