'use client';

import { Game, PlayerSearch } from '@context/GamesContext';
import { useState } from 'react';
import LocationPicker from './LocationPicker';
import { useNotification } from '@context/NotificationContext';
import Image from 'next/image';
import { useModal } from '@context/ModalContext';
import { AppError } from '../types/ApiError';
import CustomSlider from './CustomSlider';

type EditablePlayerSearchType = {
  game: Game;
  playerSearch?: PlayerSearch;
  mode?: 'edit' | 'create' | 'view';
  onSuccess?: (updatedPlayerSearch: PlayerSearch) => void;
};

const EditablePlayerSearch = ({
  game,
  playerSearch,
  mode,
  onSuccess,
}: EditablePlayerSearchType) => {
  const [error, setError] = useState<string | null>(null);
  const { closeModal } = useModal();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PlayerSearch>>(
    playerSearch || {
      game_id: game.id,
      current_players: 1,
      name: '',
      players_needed: 1,
      location: '',
      details: undefined,
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlayersNeededSliderChange = (value: number) => {
    setFormData((prev) => ({ ...prev, players_needed: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = '';
      let options: RequestInit = {};

      switch (mode) {
        case 'edit':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/player_search/update/${playerSearch?.id}`;
          options = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              edit_token: playerSearch?.edit_token,
            }),
          };
          break;
        case 'create':
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/player_search/create`;
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          };
          break;
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const errorData: AppError = await response.json();
        throw errorData;
      }

      const responseData = await response.json();

      showNotification({
        message: (
          <div className="flex items-center">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden truncate">
              <Image
                src={game.thumbnail_url ? game.thumbnail_url : '/noImage.jpg'}
                alt={game.name}
                priority
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="ml-4">
              {mode === 'create'
                ? `Spielersuche für ${game.name} erfolgreich erstellt!`
                : `Spielersuche für ${game.name} erfolgreich bearbeitet!`}
            </span>
          </div>
        ),
        type: 'success',
        duration: 2500,
      });

      setError(null);
      closeModal();

      if (onSuccess) {
        onSuccess(responseData);
      }

      const storedTokens = JSON.parse(
        localStorage.getItem('edit_tokens') || '[]',
      );
      storedTokens.push(responseData.edit_token);
      localStorage.setItem('edit_tokens', JSON.stringify(storedTokens));
    } catch (err) {
      const error = err as AppError;
      showNotification({
        message: `Fehler: ${error.detail.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-10 flex w-full flex-col items-center">
        <h2 className="self-start text-xl font-semibold">
          {mode === 'create'
            ? 'Neue Mitspielersuche erstellen'
            : 'Mitspielersuche bearbeiten'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex w-full flex-col gap-4"
        >
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            placeholder="Name"
            className="max-w-80 rounded-full border-2 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="max-w-80">
            <CustomSlider
              value={formData.players_needed || 1}
              minValue={1}
              disabled={mode === 'view'}
              maxValue={game.max_players > 10 ? 10 : game.max_players}
              updateFunction={handlePlayersNeededSliderChange}
              labelText={(value) => `Ich suche: ${value} Mitspieler`}
            />
          </div>
          <div className="mt-4 w-full">
            <label className="mb-3 block font-medium">
              Raumplan (Ort auswählen)
            </label>
            <LocationPicker
              initialLocation={formData.location}
              onLocationChange={(location) =>
                setFormData((prev) => ({ ...prev, location }))
              }
              isEditable={mode === 'view' ? false : true}
              imageUrl={'/EG.png'}
            />
          </div>
          <textarea
            id="details"
            name="details"
            value={formData.details || ''}
            onChange={handleChange}
            disabled={mode === 'view'}
            placeholder="Details (optional)"
            className="mt-4 max-w-80 rounded-xl border-2 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
          />

          {mode !== 'view' && (
            <button
              type="submit"
              disabled={!formData.location || isLoading || !formData.name}
              className={`btn mt-4 rounded-full bg-primary py-2.5 font-bold text-white shadow-sm ${
                !formData.location || isLoading || !formData.name
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              {isLoading
                ? 'Speichern...'
                : mode === 'create'
                  ? 'Mitspielersuche erstellen!'
                  : 'Änderungen speichern!'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditablePlayerSearch;
