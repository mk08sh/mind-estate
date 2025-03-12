import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeTestType = 'drawing' | 'counting' | 'meditation' | 'tapping';

export interface MentalStateSpectrum {
  focus: number; // 0 = scattered, 100 = hyperfocused
  energy: number; // 0 = exhausted, 100 = hyperactive
  mood: number; // 0 = overwhelmed, 100 = calm
  curiosity: number; // 0 = disinterested, 100 = extremely curious
}

export interface TimePerception {
  actual: number;
  perceived: number;
  testType: TimeTestType;
  accuracy: number;
}

export interface Entry {
  id: string;
  timestamp: string;
  mentalState: MentalStateSpectrum;
  activity: string;
  effectiveness: number;
  notes: string;
  drawing?: string;
  timePerception?: TimePerception;
}

interface ADHDStore {
  entries: Entry[];
  currentEntry: Partial<Entry>;
  addEntry: (entry: Omit<Entry, 'id' | 'timestamp'>) => void;
  updateCurrentEntry: (update: Partial<Entry>) => void;
  resetCurrentEntry: () => void;
  clearEntries: () => void;
}

export const useADHDStore = create<ADHDStore>()(
  persist(
    (set) => ({
      entries: [],
      currentEntry: {
        mentalState: {
          focus: 50,
          energy: 50,
          mood: 50,
          curiosity: 50,
        },
      },
      addEntry: (entry) => 
        set((state) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
      updateCurrentEntry: (update) =>
        set((state) => ({
          currentEntry: { ...state.currentEntry, ...update },
        })),
      resetCurrentEntry: () =>
        set(() => ({
          currentEntry: {
            mentalState: {
              focus: 50,
              energy: 50,
              mood: 50,
              curiosity: 50,
            },
          },
        })),
      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: 'adhd-tracker',
    }
  )
); 