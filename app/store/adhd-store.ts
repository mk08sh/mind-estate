import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  mentalState?: MentalStateSpectrum;
  activity?: string;
  effectiveness?: number;
  notes?: string;
  drawing?: string;
  timePerception?: TimePerception;
}

interface ADHDStore {
  entries: Entry[];
  currentEntry: Partial<Entry>;
  addEntry: (entry: Partial<Omit<Entry, 'id' | 'timestamp'>>) => void;
  updateCurrentEntry: (update: Partial<Entry>) => void;
  resetCurrentEntry: () => void;
  clearEntries: () => void;
}

// Create store with persistence
export const useADHDStore = create<ADHDStore>()(
  persist(
    (set) => ({
      entries: [],
      currentEntry: {},
      addEntry: (entry) => {
        // Only proceed if we're in a browser environment
        if (typeof window === 'undefined') return;

        const newEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        
        // Ensure all optional fields are properly included
        if (entry.mentalState) {
          newEntry.mentalState = { ...entry.mentalState };
        }
        if (entry.timePerception) {
          newEntry.timePerception = { ...entry.timePerception };
        }
        if (entry.activity) {
          newEntry.activity = entry.activity;
        }
        if (entry.effectiveness !== undefined) {
          newEntry.effectiveness = entry.effectiveness;
        }
        if (entry.notes) {
          newEntry.notes = entry.notes;
        }
        if (entry.drawing) {
          newEntry.drawing = entry.drawing;
        }
        
        set((state) => ({
          entries: [newEntry, ...state.entries],
          currentEntry: {}, // Reset current entry after saving
        }));
      },
      updateCurrentEntry: (update) => {
        // Only proceed if we're in a browser environment
        if (typeof window === 'undefined') return;
        
        set((state) => ({
          currentEntry: { ...state.currentEntry, ...update },
        }));
      },
      resetCurrentEntry: () => {
        // Only proceed if we're in a browser environment
        if (typeof window === 'undefined') return;
        
        set(() => ({
          currentEntry: {}
        }));
      },
      clearEntries: () => {
        // Only proceed if we're in a browser environment
        if (typeof window === 'undefined') return;
        
        set({ entries: [] });
      },
    }),
    {
      name: 'adhd-tracker',
      storage: createJSONStorage(() => {
        // Check if window is available
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => Promise.resolve(null),
          setItem: () => Promise.resolve(),
          removeItem: () => Promise.resolve(),
        };
      }),
      skipHydration: true,
      version: 1,
    }
  )
); 