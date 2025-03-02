'use client';

import { Game } from '@context/GamesContext';
import { useState } from 'react';

type PlayerSearchCreate = {
  game_id: number;
  current_players: number;
  name: string;
  players_needed: number;
  location: string;
  details?: string;
};

type CreatePlayerSearchResponse = {
  id: number;
  game_id: number;
  current_players: number;
  players_needed: number;
  location: string;
  details: string | null;
  expires_at: string;
  edit_token: string;
};

const CreatePlayerSearch = ({ game }: { game: Game }) => {
  const [formData, setFormData] = useState<PlayerSearchCreate>({
    game_id: game.id,
    current_players: 1,
    name: '',
    players_needed: 0,
    location: '',
    details: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/player_search/player_search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Fehler beim Erstellen des Gesuchs');
        setSuccessMessage(null);
      } else {
        const responseData: CreatePlayerSearchResponse = await response.json();
        setSuccessMessage(
          `Gesuch erfolgreich erstellt! Edit Token: ${responseData.edit_token}`,
        );
        setError(null);
      }
    } catch (error) {
      setError('Fehler bei der Verbindung zum Server');
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>Erstelle ein neues Mitspieler-Gesuch</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="current_players">Aktuelle Spieler</label>
          <input
            type="number"
            id="current_players"
            name="current_players"
            value={formData.current_players}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="players_needed">Benötigte Spieler</label>
          <input
            type="number"
            id="players_needed"
            name="players_needed"
            value={formData.players_needed}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Ort</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="details">Details</label>
          <textarea
            id="details"
            name="details"
            value={formData.details || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Gesuch erstellen</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CreatePlayerSearch;
