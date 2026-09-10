/**
 * Helper for Zustand stores that persist to AsyncStorage.
 * Usage:
 *   type TallyState = { count: number; add: () => void };
 *   export const useTally = createPersistedStore<TallyState>('tally', (set) => ({
 *     count: 0,
 *     add: () => set((s) => ({ count: s.count + 1 })),
 *   }));
 * The store renders its cached state instantly; `hydrated` flips to true once storage has been read,
 * so screens can show a skeleton only on the true first load.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Hydrated = { hydrated: boolean };

export function createPersistedStore<T extends object>(name: string, init: StateCreator<T & Hydrated, [], []>) {
  const store = create<T & Hydrated>()(
    persist(
      (set, get, api) => ({ ...(init(set, get, api) as T), hydrated: false }),
      {
        name,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => {
          const { hydrated: _hydrated, ...rest } = state;
          return rest as T & Hydrated;
        },
        onRehydrateStorage: () => () => {
          store.setState({ hydrated: true } as Partial<T & Hydrated>);
        },
      },
    ),
  );
  return store;
}
