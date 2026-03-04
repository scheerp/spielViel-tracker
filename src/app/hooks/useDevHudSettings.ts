'use client';

import { useCallback, useEffect, useState } from 'react';

export type DevHudSettingKey = 'timeHud' | 'screenHud';

type DevHudSettings = Partial<Record<DevHudSettingKey, boolean>>;

const STORAGE_KEY = 'devHudSettings';
const SETTINGS_CHANGED_EVENT = 'dev-hud-settings-changed';

const getDefaultHudVisibility = (): boolean =>
  process.env.NODE_ENV !== 'production';

const readSettingsFromStorage = (): DevHudSettings => {
  if (typeof window === 'undefined') return {};

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) return {};

  try {
    const parsed = JSON.parse(rawValue) as DevHudSettings;
    return parsed ?? {};
  } catch {
    return {};
  }
};

const getSettingValue = (key: DevHudSettingKey): boolean => {
  const storedValue = readSettingsFromStorage()[key];

  if (typeof storedValue === 'boolean') {
    return storedValue;
  }

  return getDefaultHudVisibility();
};

const writeSettingValue = (key: DevHudSettingKey, value: boolean) => {
  if (typeof window === 'undefined') return;

  const nextSettings: DevHudSettings = {
    ...readSettingsFromStorage(),
    [key]: value,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
};

export const useDevHudSetting = (
  key: DevHudSettingKey,
): [boolean, (nextValue: boolean) => void] => {
  const [enabled, setEnabled] = useState<boolean>(getDefaultHudVisibility());

  useEffect(() => {
    const updateSetting = () => {
      setEnabled(getSettingValue(key));
    };

    updateSetting();

    window.addEventListener(SETTINGS_CHANGED_EVENT, updateSetting);
    window.addEventListener('storage', updateSetting);

    return () => {
      window.removeEventListener(SETTINGS_CHANGED_EVENT, updateSetting);
      window.removeEventListener('storage', updateSetting);
    };
  }, [key]);

  const setSetting = useCallback(
    (nextValue: boolean) => {
      setEnabled(nextValue);
      writeSettingValue(key, nextValue);
    },
    [key],
  );

  return [enabled, setSetting];
};
