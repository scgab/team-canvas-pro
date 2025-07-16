import { useState, useEffect } from 'react';

interface StorageManager {
  get: <T>(key: string, defaultValue?: T) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const createStorageManager = (): StorageManager => {
  return {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          // Handle Date objects
          if (parsed && typeof parsed === 'object') {
            return JSON.parse(item, (key, value) => {
              if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                return new Date(value);
              }
              return value;
            });
          }
          return parsed;
        }
        return defaultValue || null;
      } catch (error) {
        console.error(`Error retrieving ${key} from storage:`, error);
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error storing ${key} in storage:`, error);
      }
    },

    remove: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing ${key} from storage:`, error);
      }
    },

    clear: (): void => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  };
};

export const usePersistedState = <T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const storage = createStorageManager();
  
  const [state, setState] = useState<T>(() => {
    const stored = storage.get<T>(key);
    return stored !== null ? stored : defaultValue;
  });

  const setPersistedState = (value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      storage.set(key, newValue);
      return newValue;
    });
  };

  return [state, setPersistedState];
};

export const storage = createStorageManager();