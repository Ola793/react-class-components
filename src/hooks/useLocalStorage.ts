import { useCallback, useState } from 'react';

export function useLocalStorage(key: string, defaultValue = '') {
  const [storedValue, setStoredValue] = useState(() => {
    return localStorage.getItem(key) ?? defaultValue;
  });

  const updateStoredValue = useCallback(
    (value: string) => {
      localStorage.setItem(key, value);
      setStoredValue(value);
    },
    [key]
  );

  return {
    storedValue,
    updateStoredValue,
  };
}