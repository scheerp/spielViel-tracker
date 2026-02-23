import { useEffect, useState } from 'react';
import { AppError } from '../types/ApiError';

type UseSlideDataOptions<T> = {
  fetcher: () => Promise<T>;
  onReady?: () => void;
};

export function useSlideData<T>({ fetcher, onReady }: UseSlideDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (!cancelled) setData(result);
        onReady?.(); // Slide signalisiert ScreenRotator, dass es ready ist
      } catch (err) {
        const error = err as AppError;
        console.error(err);
        if (!cancelled) setError(error.detail?.message || 'Fehler beim Laden');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [fetcher, onReady]);

  return { data, loading, error };
}
