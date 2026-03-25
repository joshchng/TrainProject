import { create } from 'zustand';

const ALL_LINES = new Set(['YELLOW', 'BLUE', 'ORANGE', 'GREEN', 'RED']);

export type DirectionFilter = 'all' | 'North' | 'South';

interface AppState {
  selectedStation: string | null;
  /** When true, the departures panel lists all departures (every station; map selection cleared). */
  viewAllDepartures: boolean;
  activeLines: Set<string>;
  directionFilter: DirectionFilter;

  selectStation: (abbr: string | null) => void;
  showAllStationsDepartures: () => void;
  toggleLine: (line: string) => void;
  setAllLines: (active: boolean) => void;
  setDirection: (dir: DirectionFilter) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStation: null,
  viewAllDepartures: false,
  activeLines: new Set(ALL_LINES),
  directionFilter: 'all',

  selectStation: (abbr) => set({ selectedStation: abbr, viewAllDepartures: false }),

  showAllStationsDepartures: () => set({ selectedStation: null, viewAllDepartures: true }),

  toggleLine: (line) =>
    set((state) => {
      const next = new Set(state.activeLines);
      if (next.has(line)) {
        next.delete(line);
      } else {
        next.add(line);
      }
      return { activeLines: next };
    }),

  setAllLines: (active) =>
    set({ activeLines: active ? new Set(ALL_LINES) : new Set() }),

  setDirection: (dir) => set({ directionFilter: dir }),
}));
