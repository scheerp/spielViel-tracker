import { parseStringPromise } from 'xml2js';

export interface BoardGame {
  id: string;
  name: string;
  yearPublished: string;
  description: string;
  imageUrl: string;
  maxPlayers: string;
  minPlayers: string;
  minAge: string;
}

const BGG_API_URL = 'https://boardgamegeek.com/xmlapi2/thing?id=';

export const fetchGameData = async (
  gameId: string,
): Promise<BoardGame | null> => {
  try {
    const res = await fetch(`${BGG_API_URL}${gameId}`);
    const xmlData = await res.text();

    // Parsen des XML-Datenformats
    const parsedData = await parseStringPromise(xmlData);

    // Extrahieren der relevanten Spielinformationen
    const game = parsedData.items.item[0];
    const boardGame: BoardGame = {
      id: game.$.id,
      name: game.name[0].$.value,
      yearPublished: game.yearpublished[0],
      description: game.description[0],
      imageUrl: game.image[0],
      maxPlayers: game.maxplayers[0].$.value,
      minPlayers: game.minplayers[0].$.value,
      minAge: game.minage[0].$.value,
    };

    return boardGame;
  } catch (error) {
    console.error('Fehler beim Abrufen des Spiels:', error);
    return null;
  }
};
