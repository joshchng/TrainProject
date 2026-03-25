import { create } from 'zustand';

const ALL_LINES = new Set(['YELLOW', 'BLUE', 'ORANGE', 'GREEN', 'RED']);

export const DEPARTURE_WINDOW_OPTIONS = [5, 10, 15, 20, 25, 30] as const;
export type DepartureWindowMinutes = (typeof DEPARTURE_WINDOW_OPTIONS)[number];

export type DirectionFilter = 'all' | 'North' | 'South';

interface AppState {
  selectedStation: string | null;
  /** When true, the departures panel lists all departures (every station; map selection cleared). */
  viewAllDepartures: boolean;
  activeLines: Set<string>;
  directionFilter: DirectionFilter;
  /** Departures and map badges count trains due within this many minutes (includes “Leaving”). */
  departureWindowMinutes: DepartureWindowMinutes;

  selectStation: (abbr: string | null) => void;
  showAllStationsDepartures: () => void;
  toggleLine: (line: string) => void;
  setAllLines: (active: boolean) => void;
  setDirection: (dir: DirectionFilter) => void;
  setDepartureWindowMinutes: (minutes: DepartureWindowMinutes) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStation: null,
  viewAllDepartures: false,
  activeLines: new Set(ALL_LINES),
  directionFilter: 'all',
  departureWindowMinutes: 10,

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

  setDepartureWindowMinutes: (minutes) => set({ departureWindowMinutes: minutes }),
}));
