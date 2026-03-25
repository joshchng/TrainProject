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
 * Station x,y are pixel coordinates in the SVG viewBox coordinate space
 * (1024x928). Hand-tuned to the official BART schematic layout.
 */

export const MAP_VIEWBOX = { width: 1024, height: 928 } as const;

export const STATIONS: MapStation[] = [
  // Richmond branch → MacArthur (~36px apart)
  { abbr: 'RICH', name: 'Richmond', x: 278, y: 68 },
  { abbr: 'DELN', name: 'El Cerrito del Norte', x: 278, y: 104 },
  { abbr: 'PLZA', name: 'El Cerrito Plaza', x: 278, y: 140 },
  { abbr: 'NBRK', name: 'North Berkeley', x: 280, y: 176 },
  { abbr: 'DBRK', name: 'Downtown Berkeley', x: 286, y: 212 },
  { abbr: 'ASHB', name: 'Ashby', x: 296, y: 248 },

  // Antioch branch → Rockridge → MacArthur (compressed so ORIN–ROCK is ~110px, not ~280px)
  { abbr: 'ANTC', name: 'Antioch', x: 866, y: 44 },
  { abbr: 'PCTR', name: 'Pittsburg Center', x: 830, y: 70 },
  { abbr: 'PITT', name: 'Pittsburg/Bay Point', x: 794, y: 96 },
  { abbr: 'NCON', name: 'North Concord/Martinez', x: 758, y: 122 },
  { abbr: 'CONC', name: 'Concord', x: 722, y: 148 },
  { abbr: 'PHIL', name: 'Pleasant Hill', x: 686, y: 174 },
  { abbr: 'WCRK', name: 'Walnut Creek', x: 650, y: 200 },
  { abbr: 'LAFY', name: 'Lafayette', x: 614, y: 224 },
  { abbr: 'ORIN', name: 'Orinda', x: 540, y: 246 },
  { abbr: 'ROCK', name: 'Rockridge', x: 434, y: 264 },

  // Oakland spine (~44px apart)
  { abbr: 'MCAR', name: 'MacArthur', x: 368, y: 280 },
  { abbr: '19TH', name: '19th St Oakland', x: 394, y: 316 },
  { abbr: '12TH', name: '12th St Oakland City Center', x: 420, y: 352 },

  // 12th St wye / Transbay level
  { abbr: 'WOAK', name: 'West Oakland', x: 306, y: 396 },
  { abbr: 'LAKE', name: 'Lake Merritt', x: 524, y: 396 },

  // San Francisco Market / Mission trunk (~44px apart, was ~33px)
  { abbr: 'EMBR', name: 'Embarcadero', x: 186, y: 420 },
  { abbr: 'MONT', name: 'Montgomery St', x: 168, y: 460 },
  { abbr: 'POWL', name: 'Powell St', x: 150, y: 500 },
  { abbr: 'CIVC', name: 'Civic Center/UN Plaza', x: 132, y: 540 },
  { abbr: '16TH', name: '16th St Mission', x: 114, y: 580 },
  { abbr: '24TH', name: '24th St Mission', x: 96, y: 620 },
  { abbr: 'GLEN', name: 'Glen Park', x: 78, y: 660 },
  { abbr: 'BALB', name: 'Balboa Park', x: 60, y: 700 },
  { abbr: 'DALY', name: 'Daly City', x: 42, y: 740 },

  // Peninsula / SFO / Millbrae (shifted down to match wider SF trunk)
  { abbr: 'COLM', name: 'Colma', x: 58, y: 778 },
  { abbr: 'SSAN', name: 'South San Francisco', x: 78, y: 812 },
  { abbr: 'SBRN', name: 'San Bruno', x: 102, y: 846 },
  { abbr: 'SFIA', name: 'San Francisco Airport', x: 172, y: 826 },
  { abbr: 'MLBR', name: 'Millbrae', x: 172, y: 870 },

  // East Bay south (Lake Merritt → Bay Fair, ~50px apart)
  { abbr: 'FTVL', name: 'Fruitvale', x: 558, y: 436 },
  { abbr: 'COLS', name: 'Coliseum', x: 594, y: 476 },
  { abbr: 'OAKL', name: 'Oakland Airport', x: 652, y: 462 },
  { abbr: 'SANL', name: 'San Leandro', x: 628, y: 518 },
  { abbr: 'BAYF', name: 'Bay Fair', x: 660, y: 562 },

  // Dublin / Pleasanton
  { abbr: 'CAST', name: 'Castro Valley', x: 724, y: 548 },
  { abbr: 'WDUB', name: 'West Dublin/Pleasanton', x: 790, y: 520 },
  { abbr: 'DUBL', name: 'Dublin/Pleasanton', x: 856, y: 490 },

  // Berryessa (~48px apart)
  { abbr: 'HAYW', name: 'Hayward', x: 692, y: 612 },
  { abbr: 'SHAY', name: 'South Hayward', x: 720, y: 650 },
  { abbr: 'UCTY', name: 'Union City', x: 748, y: 688 },
  { abbr: 'FRMT', name: 'Fremont', x: 776, y: 726 },
  { abbr: 'WARM', name: 'Warm Springs/South Fremont', x: 802, y: 764 },
  { abbr: 'MLPT', name: 'Milpitas', x: 828, y: 800 },
  { abbr: 'BERY', name: 'Berryessa/North San Jose', x: 854, y: 836 },
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

/** Lines (colors) that serve this station abbreviation — for UI chips. */
export function getLinesForStation(abbr: string): Pick<MapLine, 'name' | 'color' | 'hexcolor'>[] {
  return LINES.filter((line) => line.stations.includes(abbr)).map(({ name, color, hexcolor }) => ({
    name,
    color,
    hexcolor,
  }));
}

// ---------------------------------------------------------------------------
// Segment offset computation — fans overlapping lines apart on shared track
// ---------------------------------------------------------------------------

const OFFSET_PX = 14;

function segmentKey(a: string, b: string): string {
  return a < b ? `${a}::${b}` : `${b}::${a}`;
}

function buildSegmentLineMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const line of LINES) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const key = segmentKey(line.stations[i], line.stations[i + 1]);
      let colors = map.get(key);
      if (!colors) {
        colors = [];
        map.set(key, colors);
      }
      if (!colors.includes(line.color)) {
        colors.push(line.color);
      }
    }
  }
  return map;
}

const SEGMENT_LINES = buildSegmentLineMap();

/** First line in this order that uses an edge defines tangent direction → stable normals along corridors. */
const EDGE_TANGENT_PRIORITY = ['YELLOW', 'BLUE', 'ORANGE', 'GREEN', 'RED'] as const;

function tangentForEdge(abbrLo: string, abbrHi: string): { dx: number; dy: number } {
  const key = segmentKey(abbrLo, abbrHi);
  const colorsOn = SEGMENT_LINES.get(key);
  const fallback = (): { dx: number; dy: number } => {
    const a = STATION_MAP.get(abbrLo)!;
    const b = STATION_MAP.get(abbrHi)!;
    return { dx: b.x - a.x, dy: b.y - a.y };
  };
  if (!colorsOn?.length) return fallback();

  for (const color of EDGE_TANGENT_PRIORITY) {
    if (!colorsOn.includes(color)) continue;
    const line = LINES.find((l) => l.color === color)!;
    for (let i = 0; i < line.stations.length - 1; i++) {
      const u = line.stations[i];
      const v = line.stations[i + 1];
      if ((u === abbrLo && v === abbrHi) || (u === abbrHi && v === abbrLo)) {
        const from = STATION_MAP.get(u)!;
        const to = STATION_MAP.get(v)!;
        return { dx: to.x - from.x, dy: to.y - from.y };
      }
    }
  }
  return fallback();
}

export interface OffsetSegment {
  fromAbbr: string;
  toAbbr: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lineColor: string;
  hexcolor: string;
}

export function computeAllLineSegments(): OffsetSegment[] {
  const segments: OffsetSegment[] = [];

  for (const line of LINES) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const stA = STATION_MAP.get(line.stations[i]);
      const stB = STATION_MAP.get(line.stations[i + 1]);
      if (!stA || !stB) continue;

      const key = segmentKey(line.stations[i], line.stations[i + 1]);
      const linesOnSegment = SEGMENT_LINES.get(key) ?? [line.color];
      const count = linesOnSegment.length;
      const idx = linesOnSegment.indexOf(line.color);

      const abbrA = line.stations[i];
      const abbrB = line.stations[i + 1];
      const { dx, dy } = tangentForEdge(abbrA, abbrB);
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;

      const nx = -dy / len;
      const ny = dx / len;

      const offsetAmount = (idx - (count - 1) / 2) * OFFSET_PX;
      const ox = nx * offsetAmount;
      const oy = ny * offsetAmount;

      segments.push({
        fromAbbr: line.stations[i],
        toAbbr: line.stations[i + 1],
        x1: stA.x + ox,
        y1: stA.y + oy,
        x2: stB.x + ox,
        y2: stB.y + oy,
        lineColor: line.color,
        hexcolor: line.hexcolor,
      });
    }
  }

  return segments;
}
