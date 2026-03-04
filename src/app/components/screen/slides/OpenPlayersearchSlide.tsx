'use client';

import RotatedTitle from '@components/RotatedTitle';
import { FlatPlayerSearchWithGame } from '@context/PlayerSearchContext';
import Image from 'next/image';
import OpenplayerSearchCard from '@components/OpenplayerSearchCard';
import LocationPinIcon from '@icons/LocationPinIcon';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SEARCH_COLOR_VARIANTS = [
  {
    markerClassName: 'bg-primary',
    pinColorClassName: 'text-primary',
    badgeClassName: 'bg-primary',
    cardBorderClassName: 'border-l-primary',
  },
  {
    markerClassName: 'bg-secondary',
    pinColorClassName: 'text-secondary',
    badgeClassName: 'bg-secondary',
    cardBorderClassName: 'border-l-secondary',
  },
  {
    markerClassName: 'bg-tertiary',
    pinColorClassName: 'text-tertiary',
    badgeClassName: 'bg-tertiary',
    cardBorderClassName: 'border-l-tertiary',
  },
  {
    markerClassName: 'bg-status',
    pinColorClassName: 'text-status',
    badgeClassName: 'bg-status',
    cardBorderClassName: 'border-l-status',
  },
  {
    markerClassName: 'bg-quinary',
    pinColorClassName: 'text-quinary',
    badgeClassName: 'bg-quinary',
    cardBorderClassName: 'border-l-quinary',
  },
  {
    markerClassName: 'bg-error',
    pinColorClassName: 'text-error',
    badgeClassName: 'bg-error',
    cardBorderClassName: 'border-l-error',
  },
  {
    markerClassName: 'bg-quaternary',
    pinColorClassName: 'text-quaternary',
    badgeClassName: 'bg-quaternary',
    cardBorderClassName: 'border-l-quaternary',
  },
] as const;

const parseLocation = (location?: string) => {
  if (!location) return null;

  const [xRaw, yRaw] = location.split(',');
  const x = Number(xRaw);
  const y = Number(yRaw);

  if (Number.isNaN(x) || Number.isNaN(y)) {
    return null;
  }

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
};

type ImageBounds = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

const getContainedImageBounds = (
  containerWidth: number,
  containerHeight: number,
  imageAspectRatio: number,
): ImageBounds => {
  const containerRatio = containerWidth / containerHeight;

  if (containerRatio > imageAspectRatio) {
    const height = containerHeight;
    const width = height * imageAspectRatio;
    return {
      offsetX: (containerWidth - width) / 2,
      offsetY: 0,
      width,
      height,
    };
  }

  const width = containerWidth;
  const height = width / imageAspectRatio;
  return {
    offsetX: 0,
    offsetY: (containerHeight - height) / 2,
    width,
    height,
  };
};

const OpenPlayersearchSlide = ({
  data,
}: {
  data: FlatPlayerSearchWithGame[];
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const updateContainerSize = () => {
      if (!mapContainerRef.current) return;

      setContainerSize({
        width: mapContainerRef.current.clientWidth,
        height: mapContainerRef.current.clientHeight,
      });
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  const sortedSearches = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(b.player_search.created_at).getTime() -
          new Date(a.player_search.created_at).getTime(),
      ),
    [data],
  );

  const visibleSearches = useMemo(
    () => sortedSearches.slice(0, 5),
    [sortedSearches],
  );

  const imageBounds = useMemo(() => {
    if (
      !imageAspectRatio ||
      containerSize.width === 0 ||
      containerSize.height === 0
    ) {
      return null;
    }

    return getContainedImageBounds(
      containerSize.width,
      containerSize.height,
      imageAspectRatio,
    );
  }, [containerSize.height, containerSize.width, imageAspectRatio]);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden px-16 py-8">
      <RotatedTitle
        text="Partiesuche"
        tailwindBgColor="bg-tertiary"
        className="mb-16"
      />
      <span className="mb-14 text-xl font-semibold">
        Hier findest du Leute, die bereits nach Mitspieler*innen suchen
      </span>

      <div className="mb-10 grid h-full min-h-0 w-full max-w-[1800px] grid-cols-[0.72fr_1.28fr] gap-8">
        <div className="min-h-0 p-1">
          <div className="flex h-full flex-col gap-3">
            {visibleSearches.map(
              (search: FlatPlayerSearchWithGame, index: number) => {
                const colorVariant =
                  SEARCH_COLOR_VARIANTS[index % SEARCH_COLOR_VARIANTS.length];

                return (
                  <motion.div
                    key={search.game.id + '-' + search.player_search.id}
                    className="h-[calc((100%-3rem)/5)] max-h-[170px]"
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 240,
                      damping: 22,
                    }}
                  >
                    <OpenplayerSearchCard
                      search={search}
                      index={index}
                      markerClassName={colorVariant.markerClassName}
                      cardBorderClassName={colorVariant.cardBorderClassName}
                    />
                  </motion.div>
                );
              },
            )}
          </div>
        </div>

        <div
          ref={mapContainerRef}
          className="relative h-full min-h-[520px] overflow-hidden rounded-3xl bg-background"
        >
          <Image
            src="/floorplan.jpeg"
            alt="Floorplan"
            fill
            priority
            sizes="55vw"
            className="object-contain"
            onLoad={(event) => {
              const target = event.target as HTMLImageElement;
              if (!target.naturalWidth || !target.naturalHeight) return;

              setImageAspectRatio(target.naturalWidth / target.naturalHeight);
            }}
          />

          {visibleSearches.map(
            (search: FlatPlayerSearchWithGame, index: number) => {
              if (!imageBounds) {
                return null;
              }

              const parsedLocation = parseLocation(
                search.player_search.location,
              );

              if (!parsedLocation) {
                return null;
              }

              const colorVariant =
                SEARCH_COLOR_VARIANTS[index % SEARCH_COLOR_VARIANTS.length];

              return (
                <motion.div
                  key={`marker-${search.game.id}-${search.player_search.id}`}
                  className="pointer-events-none absolute h-0 w-0"
                  style={{
                    left: `${imageBounds.offsetX + (parsedLocation.x / 100) * imageBounds.width}px`,
                    top: `${imageBounds.offsetY + (parsedLocation.y / 100) * imageBounds.height}px`,
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{
                    scale: [1, 1.04, 1],
                    y: [0, -2, 0],
                    opacity: 1,
                  }}
                  transition={{
                    opacity: {
                      delay: index * 0.1,
                      duration: 0.2,
                    },
                    scale: {
                      delay: index * 0.1,
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    y: {
                      delay: index * 0.1,
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <div className="absolute bottom-0 left-0 -translate-x-1/2">
                    <div className="relative h-12 w-12">
                      <LocationPinIcon
                        tailwindColor={colorVariant.pinColorClassName}
                        className="h-12 w-12 drop-shadow-[0_3px_0_var(--foreground)]"
                      />
                      <span className="text-shadow-drop-shadow text-shadow-outline-dark absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-lg font-black text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};
export default OpenPlayersearchSlide;
