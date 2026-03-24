export interface MapStation {
  abbr: string;
  name: string;
  x: number;
  y: number;
}

export interface MapLine {
  name: string;
  color: string;
  hexcolor: string;
  stations: string[];
}

/*
 * Topological coordinates modeled on the official BART schematic
 * (vertical / horizontal / 45° only). ViewBox 800×620.
 *
 * Richmond (NW) + Antioch (NE) → Oakland spine → 12th wye
 * (45° to West Oakland / Lake Merritt) → horizontal Transbay
 * → vertical downtown SF → 45° southwest toward Daly / Peninsula.
 */

/** Per-line nudge so parallel strokes on shared corridors read like the official map. */
export const LINE_PATH_NUDGE: Record<string, [number, number]> = {
  YELLOW: [0, -3.5],
  RED: [-3, -1],
  ORANGE: [3.5, 0],
  GREEN: [0, 3.5],
  BLUE: [-3.5, 1],
};

export const STATIONS: MapStation[] = [
  // Richmond branch (northwest column → MacArthur)
  { abbr: 'RICH', name: 'Richmond', x: 338, y: 30 },
  { abbr: 'DELN', name: 'El Cerrito del Norte', x: 338, y: 52 },
  { abbr: 'PLZA', name: 'El Cerrito Plaza', x: 338, y: 74 },
  { abbr: 'NBRK', name: 'North Berkeley', x: 338, y: 96 },
  { abbr: 'DBRK', name: 'Downtown Berkeley', x: 338, y: 118 },
  { abbr: 'ASHB', name: 'Ashby', x: 338, y: 142 },

  // Antioch branch (northeast → Rockridge → MacArthur)
  { abbr: 'ANTC', name: 'Antioch', x: 712, y: 32 },
  { abbr: 'PCTR', name: 'Pittsburg Center', x: 678, y: 50 },
  { abbr: 'PITT', name: 'Pittsburg/Bay Point', x: 645, y: 68 },
  { abbr: 'NCON', name: 'North Concord/Martinez', x: 612, y: 88 },
  { abbr: 'CONC', name: 'Concord', x: 578, y: 108 },
  { abbr: 'PHIL', name: 'Pleasant Hill', x: 548, y: 126 },
  { abbr: 'WCRK', name: 'Walnut Creek', x: 518, y: 144 },
  { abbr: 'LAFY', name: 'Lafayette', x: 492, y: 158 },
  { abbr: 'ORIN', name: 'Orinda', x: 468, y: 172 },
  { abbr: 'ROCK', name: 'Rockridge', x: 498, y: 188 },

  // Oakland spine (shared vertical)
  { abbr: 'MCAR', name: 'MacArthur', x: 410, y: 188 },
  { abbr: '19TH', name: '19th St Oakland', x: 410, y: 218 },
  { abbr: '12TH', name: '12th St Oakland City Center', x: 410, y: 248 },

  // 12th wye (45°) + transbay band (y = 333)
  { abbr: 'WOAK', name: 'West Oakland', x: 325, y: 333 },
  { abbr: 'LAKE', name: 'Lake Merritt', x: 495, y: 333 },

  // San Francisco + transbay west end
  { abbr: 'EMBR', name: 'Embarcadero', x: 185, y: 333 },
  { abbr: 'MONT', name: 'Montgomery St', x: 185, y: 354 },
  { abbr: 'POWL', name: 'Powell St', x: 185, y: 375 },
  { abbr: 'CIVC', name: 'Civic Center/UN Plaza', x: 185, y: 396 },
  { abbr: '16TH', name: '16th St Mission', x: 185, y: 417 },
  { abbr: '24TH', name: '24th St Mission', x: 185, y: 438 },

  // 45° southwest (Mission–Daly on the official map)
  { abbr: 'GLEN', name: 'Glen Park', x: 161, y: 462 },
  { abbr: 'BALB', name: 'Balboa Park', x: 137, y: 486 },
  { abbr: 'DALY', name: 'Daly City', x: 113, y: 510 },

  // Peninsula + SFO / Millbrae fork
  { abbr: 'COLM', name: 'Colma', x: 91, y: 532 },
  { abbr: 'SSAN', name: 'South San Francisco', x: 69, y: 554 },
  { abbr: 'SBRN', name: 'San Bruno', x: 47, y: 576 },
  { abbr: 'SFIA', name: 'San Francisco Airport', x: 28, y: 558 },
  { abbr: 'MLBR', name: 'Millbrae', x: 52, y: 598 },

  // East Bay corridor (south from Lake Merritt)
  { abbr: 'FTVL', name: 'Fruitvale', x: 495, y: 356 },
  { abbr: 'COLS', name: 'Coliseum', x: 495, y: 379 },
  { abbr: 'OAKL', name: 'Oakland Airport', x: 540, y: 388 },
  { abbr: 'SANL', name: 'San Leandro', x: 495, y: 402 },
  { abbr: 'BAYF', name: 'Bay Fair', x: 495, y: 425 },

  // Dublin/Pleasanton (northeast from Bay Fair)
  { abbr: 'CAST', name: 'Castro Valley', x: 532, y: 438 },
  { abbr: 'WDUB', name: 'West Dublin/Pleasanton', x: 572, y: 448 },
  { abbr: 'DUBL', name: 'Dublin/Pleasanton', x: 612, y: 458 },

  // Berryessa / San José
  { abbr: 'HAYW', name: 'Hayward', x: 495, y: 448 },
  { abbr: 'SHAY', name: 'South Hayward', x: 495, y: 472 },
  { abbr: 'UCTY', name: 'Union City', x: 495, y: 496 },
  { abbr: 'FRMT', name: 'Fremont', x: 495, y: 520 },
  { abbr: 'WARM', name: 'Warm Springs/South Fremont', x: 495, y: 544 },
  { abbr: 'MLPT', name: 'Milpitas', x: 495, y: 568 },
  { abbr: 'BERY', name: 'Berryessa/North San Jose', x: 495, y: 592 },
];

export const STATION_MAP = new Map(STATIONS.map((s) => [s.abbr, s]));

export const LINES: MapLine[] = [
  {
    name: 'Yellow',
    color: 'YELLOW',
    hexcolor: '#FFE800',
    stations: [
      'ANTC', 'PCTR', 'PITT', 'NCON', 'CONC', 'PHIL', 'WCRK', 'LAFY', 'ORIN', 'ROCK',
      'MCAR', '19TH', '12TH', 'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC', '16TH', '24TH',
      'GLEN', 'BALB', 'DALY', 'COLM', 'SSAN', 'SBRN', 'SFIA',
    ],
  },
  {
    name: 'Blue',
    color: 'BLUE',
    hexcolor: '#0099D8',
    stations: [
      'DUBL', 'WDUB', 'CAST', 'BAYF', 'SANL', 'COLS', 'FTVL', 'LAKE',
      'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC', '16TH', '24TH',
      'GLEN', 'BALB', 'DALY',
    ],
  },
  {
    name: 'Orange',
    color: 'ORANGE',
    hexcolor: '#F58220',
    stations: [
      'RICH', 'DELN', 'PLZA', 'NBRK', 'DBRK', 'ASHB', 'MCAR', '19TH', '12TH',
      'LAKE', 'FTVL', 'COLS', 'SANL', 'BAYF', 'HAYW', 'SHAY', 'UCTY', 'FRMT',
      'WARM', 'MLPT', 'BERY',
    ],
  },
  {
    name: 'Green',
    color: 'GREEN',
    hexcolor: '#4DB848',
    stations: [
      'BERY', 'MLPT', 'WARM', 'FRMT', 'UCTY', 'SHAY', 'HAYW', 'BAYF',
      'SANL', 'COLS', 'FTVL', 'LAKE', 'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC',
      '16TH', '24TH', 'GLEN', 'BALB', 'DALY',
    ],
  },
  {
    name: 'Red',
    color: 'RED',
    hexcolor: '#ED1C24',
    stations: [
      'RICH', 'DELN', 'PLZA', 'NBRK', 'DBRK', 'ASHB', 'MCAR', '19TH', '12TH',
      'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC', '16TH', '24TH', 'GLEN', 'BALB',
      'DALY', 'COLM', 'SSAN', 'SBRN', 'MLBR',
    ],
  },
];

/* Oakland Airport connector (not a full "line" but a shuttle) */
export const OAK_CONNECTOR = {
  from: 'COLS',
  to: 'OAKL',
  color: '#888888',
};

export function getLinePointsString(line: MapLine): string {
  return line.stations
    .map((abbr) => {
      const station = STATION_MAP.get(abbr);
      if (!station) return null;
      return `${station.x},${station.y}`;
    })
    .filter(Boolean)
    .join(' ');
}

/** Lines (colors) that serve this station abbreviation — for UI chips. */
export function getLinesForStation(abbr: string): Pick<MapLine, 'name' | 'color' | 'hexcolor'>[] {
  return LINES.filter((line) => line.stations.includes(abbr)).map(({ name, color, hexcolor }) => ({
    name,
    color,
    hexcolor,
  }));
}
