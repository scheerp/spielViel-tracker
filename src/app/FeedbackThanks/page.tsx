'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useFeedback } from '@context/FeedbackContext';
import Link from 'next/link';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';

const FeedbackThanks: React.FC = () => {
  const { closeBannerPermanently } = useFeedback();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fireworksRef = useRef(null);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    closeBannerPermanently();
    const getColor = (varName: string) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    setColors([
      getColor('--primary'),
      getColor('--primary'),
      getColor('--primary'),
      getColor('--secondary'),
      getColor('--tertiary'),
      getColor('--quinary'),
      getColor('--status'),
      getColor('--error'),
    ]);
  }, []);

  useEffect(() => {
    if (colors.length === 0) return;

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    intervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return stopEffects();
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 350);

    return stopEffects;
  }, [colors]);

  const stopEffects = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fireworksRef.current) {
      // @ts-expect-error: ignore type
      fireworksRef.current.reset();
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <h1 className="mx-8 -mt-44 text-center text-xl font-semibold">
          Danke für dein Feedback! ❤️
          <br />
          <Link href="/" className="underline">
            Hier
          </Link>{' '}
          gehts zurück zu den Spielen!
        </h1>
      </div>
      {/* @ts-expect-error: ignore type */}
      <Fireworks ref={fireworksRef} className="absolute h-full w-full" />
    </>
  );
};

export default FeedbackThanks;
