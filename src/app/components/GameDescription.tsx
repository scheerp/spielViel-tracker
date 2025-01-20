import he from 'he';
import CustomModal from './CustomModal';
import { useEffect, useRef, useState } from 'react';
import { Game } from '@context/GamesContext';

const GameDescription = ({ game }: { game: Game }): JSX.Element => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [formattedDescription, setFormattedDescription] =
    useState<JSX.Element | null>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (game.german_description || game.description) {
      const decodedText = he.decode(
        game.german_description || game.description,
      );
      const lines = decodedText.split('\n');

      setFormattedDescription(
        <>
          {lines.map((paragraph, index) => (
            <span key={index}>
              {paragraph}
              {index < lines.length - 2 && <br />}
            </span>
          ))}
        </>,
      );
    } else {
      <>keine Beschreibung verfügbar</>;
    }
  }, [game.german_description, game.description]);

  useEffect(() => {
    const container = textContainerRef.current;

    if (container) {
      setIsOverflowing(container.scrollHeight > container.clientHeight);
    }
  }, [formattedDescription]);

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden">
        <div ref={textContainerRef} className="relative z-10 max-h-60">
          {formattedDescription}
          {isOverflowing && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
              style={{
                background: `linear-gradient(to top, var(--background), transparent)`,
              }}
            />
          )}
        </div>
      </div>

      {isOverflowing && (
        <CustomModal
          trigger={
            <span className="mt-2 block cursor-pointer font-bold text-neutral-400 underline">
              ...mehr
            </span>
          }
        >
          <h1 className="mb-4 mt-6 text-xl font-bold md:text-4xl">
            {game.name}
          </h1>
          <p>{formattedDescription}</p>
        </CustomModal>
      )}
    </div>
  );
};

export default GameDescription;
