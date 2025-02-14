import { useEffect, useRef, useState } from 'react';
import { Game } from '@context/GamesContext';
import { useModal } from '@context/ModalContext';

const GameDescription = ({ game }: { game: Game }): JSX.Element => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const { openModal } = useModal();

  useEffect(() => {
    const container = textContainerRef.current;

    if (container) {
      setIsOverflowing(container.scrollHeight > container.clientHeight);
    }
  }, [game.german_description, game.description]);

  return (
    <div className="mb-6 mt-6">
      <div className="relative overflow-hidden">
        <div
          ref={textContainerRef}
          className="relative z-10 max-h-60 whitespace-pre-line"
        >
          {game.german_description || game.description}
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
        <button
          onClick={() =>
            openModal(
              <>
                <h1 className="mb-4 mt-6 text-xl font-bold md:text-4xl">
                  {game.name}
                </h1>
                <p className="whitespace-pre-line">
                  {game.german_description || game.description}
                </p>
              </>,
            )
          }
          className="mt-0 block cursor-pointer font-bold text-neutral-400 underline"
        >
          ...mehr
        </button>
      )}
    </div>
  );
};

export default GameDescription;
