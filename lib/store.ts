/**
 * Helper for Zustand stores that persist to AsyncStorage.
 * Usage:
 *   type TallyState = { count: number; add: () => void };
 *   export const useTally = createPersistedStore<TallyState>('tally', (set) => ({
 *     count: 0,
 *     add: () => set((s) => ({ count: s.count + 1 })),
 *   }));
 * You write only your own fields; `hydrated` is added for you. The first render shows the initial
 * values, and `hydrated` flips to true once the saved values have been read from disk (a few
 * milliseconds), so a screen can show a skeleton until then instead of a flash of empty.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Hydrated = { hydrated: boolean };

export function createPersistedStore<T extends object>(
  name: string,
  // `set` and `get` see the whole store (your fields + hydrated); the function returns just your fields.
  init: StateCreator<T & Hydrated, [], [], T>,
) {
  const store = create<T & Hydrated>()(
    persist(
      (set, get, api) => ({ ...init(set, get, api), hydrated: false }),
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
