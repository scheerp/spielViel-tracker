'use client';

import { useState } from 'react';
import { useNotification } from '@context/NotificationContext';
import Image from 'next/image';
import { useModal } from '@context/ModalContext';
import { AppError } from '../types/ApiError';
import CustomSlider from './CustomSlider';
import LocationPickerWithZoom from './LocationPickerWithZoom';
import { PlayerSearchGameSummary } from './PlayerSearchTable';
import { useFeedback } from '@context/FeedbackContext';
import PrimaryButton from './PrimaryButton';
import { PlayerSearch } from '@context/PlayerSearchContext';

type EditablePlayerSearchType = {
  game: PlayerSearchGameSummary;
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
  const { addInteraction } = useFeedback();
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
                src={
                  game.thumbnail_url ? game.thumbnail_url : '/placeholder.png'
                }
                alt={game.name}
                priority
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="ml-4">
              {mode === 'create'
                ? `Spieler*innensuche für ${game.name} erfolgreich erstellt!`
                : `Spieler*innensuche für ${game.name} erfolgreich bearbeitet!`}
            </span>
          </div>
        ),
        type: 'success',
        duration: 2500,
      });
      addInteraction(3);
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
      setError(error.detail.message);
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
      <div className="mt-6 flex w-full flex-col lg:flex-row lg:items-start lg:gap-8">
        <div className="flex w-full flex-col lg:flex-row-reverse lg:gap-8">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col lg:w-1/2"
          >
            <h2 className="mb-4 mt-4 self-start text-xl font-semibold lg:mb-4">
              {mode === 'create' && 'Neue Mitspieler*innensuche erstellen'}
              {mode === 'edit' && 'Mitspieler*innensuche bearbeiten'}
              {mode === 'view' && 'Mitspieler*innensuche'}
            </h2>

            <input
              data-search="true"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={mode === 'view'}
              required
              placeholder="Name"
              className="rounded-full border bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary lg:mb-4"
            />

            <CustomSlider
              className="mt-4 lg:mb-4"
              value={formData.players_needed || 1}
              minValue={1}
              disabled={mode === 'view'}
              maxValue={game.max_players > 10 ? 10 : game.max_players}
              updateFunction={handlePlayersNeededSliderChange}
              labelText={(value) =>
                `Ich suche: ${value} ${value > 1 ? 'Mitspieler*innen' : 'Mitspieler*in'}`
              }
            />

            <div className="mt-4 block lg:hidden">
              <label className="mb-3 block font-medium">
                Raumplan (Ort auswählen)
              </label>
              <LocationPickerWithZoom
                initialLocation={formData.location}
                onLocationChange={(location) =>
                  setFormData((prev) => ({ ...prev, location }))
                }
                isEditable={mode === 'view' ? false : true}
                imageUrl={'/floorplan.jpeg'}
              />
            </div>

            <input
              data-search="true"
              id="details"
              name="details"
              value={formData.details || ''}
              onChange={handleChange}
              disabled={mode === 'view'}
              placeholder="Details (optional)"
              className="mt-4 rounded-full border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary lg:mb-4"
            />

            {mode !== 'view' && (
              <PrimaryButton
                type="submit"
                disabled={!formData.location || isLoading || !formData.name}
              >
                {isLoading
                  ? 'Speichern...'
                  : mode === 'create'
                    ? 'Mitspieler*innensuche erstellen!'
                    : 'Änderungen speichern!'}
              </PrimaryButton>
            )}
          </form>

          <div className="mt-6 hidden w-full lg:block">
            <label className="mb-3 block font-medium">
              Raumplan (Ort auswählen)
            </label>
            <div>
              <LocationPickerWithZoom
                initialLocation={formData.location}
                onLocationChange={(location) =>
                  setFormData((prev) => ({ ...prev, location }))
                }
                isEditable={mode === 'view' ? false : true}
                imageUrl={'/floorplan.jpeg'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditablePlayerSearch;
