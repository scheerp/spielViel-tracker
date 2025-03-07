import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const messages = [
  'Sortiere noch schnell die Karten – gleich geht’s los!',
  'Die Würfel wärmen sich schon mal auf...',
  'Ein Meeple hat sich verlaufen, wir suchen ihn gerade...',
  'Noch einen Moment, das Spielbrett entfaltet sich...',
  'Die Figuren stehen bereit – also fast...',
  'Einmal tief durchatmen, gleich geht’s los!',
  'Die Startspieler-Frage wird noch geklärt...',
  'Noch ein paar Sekunden – wir mischen noch mal nach!',
  'Das Brettspielabenteuer beginnt in Kürze...',
  'Wir suchen noch das letzte fehlende Plättchen...',
  'Gleich sind alle Karten aufgedeckt!',
  'Ein kurzer Regelstreit wird noch geschlichtet...',
  'Das Spielfeld nimmt Gestalt an...',
  'Jemand hat den Startspielermarker verloren... Moment!',
  'Der Server zählt noch seine Siegpunkte...',
  'Ein Moment, die Meeples trinken noch ihren Kaffee...',
  'Der Server überlegt noch seinen nächsten Zug...',
  'Noch ein bisschen Geduld – das Spielfeld muss noch ausbalanciert werden...',
  'Die Ereigniskarte wurde gezogen: "Bitte warten!"...',
  'Ein letzter Würfelwurf... und dann geht’s los!',
  'Das Regelbuch wird noch einmal durchgeblättert...',
  'Die Spielfiguren machen noch eine Taktikbesprechung...',
  'Der Server sucht noch das letzte fehlende Teil...',
  'Jemand hat aus Versehen alle Karten aufgedeckt – wir fangen nochmal an...',
  'Die Würfel rollen... nur leider in Zeitlupe...',
  'Der Server hat sich gerade selbst ins Knie geschossen – Neustart läuft...',
  'Noch einen Moment, der Server wartet auf seinen Zug...',
  'Der Timer läuft, aber keiner weiß genau, wofür...',
  'Die Meeples stehen noch im Stau...',
  'Der Server wurde gerade geblitzt – zu schnell gibt’s hier nicht!',
  'Der Sanduhr fehlt noch ein bisschen Sand...',
  'Die Spielfiguren sind noch mit Smalltalk beschäftigt...',
  'Das Spielfeld wird noch strategisch analysiert...',
  'Der Server entscheidet noch, ob er passt oder setzt...',
  'Die Spieler diskutieren noch über Hausregeln...',
  'Ein Pöppel ist umgekippt – wir richten ihn wieder auf...',
  'Noch ein bisschen Geduld – wir verhandeln noch über eine Allianz...',
  'Ein Meeple hat sich verirrt, wir schicken eine Suchtruppe los...',
  'Das letzte Plättchen muss noch gelegt werden...',
  'Der Server sucht noch nach einer Abkürzung zum Sieg...',
  'Die Würfel sind gefallen - also fast...',
];

const MESSAGE_INTERVAL = 7000;

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
