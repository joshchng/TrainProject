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
 * Station x,y live in content space roughly 0..1024 × 0..928. The exported
 * viewBox adds padding so labels (especially SF trunk, text-anchor end west of dots)
 * are not clipped at the SVG edges.
 */
const MAP_PAD = { left: 72, right: 28, top: 12, bottom: 16 } as const;

export const MAP_VIEWBOX = {
  minX: -MAP_PAD.left,
  minY: -MAP_PAD.top,
  width: 1024 + MAP_PAD.left + MAP_PAD.right,
  height: 928 + MAP_PAD.top + MAP_PAD.bottom,
} as const;

/**
 * Abbrev label is placed west of the dot on the SF trunk / far-east map margin;
 * trains should fan out from the opposite side so markers don't cover text.
 * East cutoff750 pulls Concord-line stations (e.g. NCON at 758) left of their dots.
 */
export function stationLabelAnchoredLeft(cx: number): boolean {
  return cx < 200 || cx > 750;
}

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

export type MapNavDirection = 'left' | 'right' | 'up' | 'down';

const NAV_DIR_UNIT: Record<MapNavDirection, { x: number; y: number }> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

/** Average of station map coordinates; virtual start when nothing is selected (+y is south on the diagram). */
export function getStationNavigationOrigin(): { x: number; y: number } {
  let sx = 0;
  let sy = 0;
  for (const s of STATIONS) {
    sx += s.x;
    sy += s.y;
  }
  const n = STATIONS.length;
  return { x: sx / n, y: sy / n };
}

/**
 * Station abbreviation most aligned with `direction` from (fromX, fromY), among stops
 * strictly in that half-plane. Tie-break: closer Euclidean distance.
 */
export function pickStationInDirection(
  fromX: number,
  fromY: number,
  direction: MapNavDirection,
): string | null {
  const d = NAV_DIR_UNIT[direction];
  const eps = 4;
  let best: { abbr: string; score: number; dist2: number } | null = null;

  for (const st of STATIONS) {
    const vx = st.x - fromX;
    const vy = st.y - fromY;
    const dot = vx * d.x + vy * d.y;
    if (dot <= eps) continue;
    const dist2 = vx * vx + vy * vy;
    const dist = Math.sqrt(dist2);
    const score = dot / dist;
    if (
      !best ||
      score > best.score + 1e-6 ||
      (Math.abs(score - best.score) <= 1e-6 && dist2 < best.dist2)
    ) {
      best = { abbr: st.abbr, score, dist2 };
    }
  }

  return best?.abbr ?? null;
}

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

/** Undirected rail graph: consecutive stops on each line (shared track = one edge). */
function buildStationAdjacency(): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };
  for (const line of LINES) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      link(line.stations[i], line.stations[i + 1]);
    }
  }
  return adj;
}

const STATION_ADJACENCY = buildStationAdjacency();

/**
 * Among stations adjacent to `currentAbbr` on the map graph, choose the neighbor that best
 * matches `direction` on the schematic (+y is south). No match if no neighbor lies in that half-plane.
 */
export function pickAdjacentStationInDirection(
  currentAbbr: string,
  direction: MapNavDirection,
): string | null {
  const current = STATION_MAP.get(currentAbbr);
  if (!current) return null;
  const neighbors = STATION_ADJACENCY.get(currentAbbr);
  if (!neighbors?.size) return null;

  const d = NAV_DIR_UNIT[direction];
  const eps = 4;
  let best: { abbr: string; score: number; dist2: number } | null = null;

  for (const nb of neighbors) {
    const st = STATION_MAP.get(nb);
    if (!st) continue;
    const vx = st.x - current.x;
    const vy = st.y - current.y;
    const dot = vx * d.x + vy * d.y;
    if (dot <= eps) continue;
    const dist2 = vx * vx + vy * vy;
    const dist = Math.sqrt(dist2);
    const score = dot / dist;
    if (
      !best ||
      score > best.score + 1e-6 ||
      (Math.abs(score - best.score) <= 1e-6 && dist2 < best.dist2)
    ) {
      best = { abbr: nb, score, dist2 };
    }
  }
  return best?.abbr ?? null;
}

/** With a selected station: move to an adjacent stop along the graph. With none: spatial pick from centroid to start. */
export function pickNextStationForArrowKey(
  currentAbbr: string | null,
  direction: MapNavDirection,
): string | null {
  if (!currentAbbr) {
    const o = getStationNavigationOrigin();
    return pickStationInDirection(o.x, o.y, direction);
  }
  return pickAdjacentStationInDirection(currentAbbr, direction);
}

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

const OFFSET_PX = 6;

const COLOR_PRIORITY = ['YELLOW', 'BLUE', 'ORANGE', 'GREEN', 'RED'] as const;

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
  for (const colors of map.values()) {
    colors.sort(
      (a, b) => COLOR_PRIORITY.indexOf(a as typeof COLOR_PRIORITY[number])
             - COLOR_PRIORITY.indexOf(b as typeof COLOR_PRIORITY[number]),
    );
  }
  return map;
}

const SEGMENT_LINES = buildSegmentLineMap();

/** First line in priority order that uses an edge defines tangent direction → stable normals. */
function tangentForEdge(abbrA: string, abbrB: string): { dx: number; dy: number } {
  const key = segmentKey(abbrA, abbrB);
  const colorsOn = SEGMENT_LINES.get(key);
  const fallback = (): { dx: number; dy: number } => {
    const a = STATION_MAP.get(abbrA)!;
    const b = STATION_MAP.get(abbrB)!;
    return { dx: b.x - a.x, dy: b.y - a.y };
  };
  if (!colorsOn?.length) return fallback();

  for (const color of COLOR_PRIORITY) {
    if (!colorsOn.includes(color)) continue;
    const pLine = LINES.find((l) => l.color === color)!;
    for (let i = 0; i < pLine.stations.length - 1; i++) {
      const u = pLine.stations[i];
      const v = pLine.stations[i + 1];
      if ((u === abbrA && v === abbrB) || (u === abbrB && v === abbrA)) {
        const from = STATION_MAP.get(u)!;
        const to = STATION_MAP.get(v)!;
        return { dx: to.x - from.x, dy: to.y - from.y };
      }
    }
  }
  return fallback();
}

export function edgeNormal(abbrA: string, abbrB: string): { nx: number; ny: number } {
  const { dx, dy } = tangentForEdge(abbrA, abbrB);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { nx: 0, ny: 0 };
  return { nx: -dy / len, ny: dx / len };
}

export function edgeOffset(lineColor: string, abbrA: string, abbrB: string): number {
  const key = segmentKey(abbrA, abbrB);
  const linesOn = SEGMENT_LINES.get(key) ?? [lineColor];
  const count = linesOn.length;
  const idx = linesOn.indexOf(lineColor);
  return (idx - (count - 1) / 2) * OFFSET_PX;
}

// ---------------------------------------------------------------------------
// Continuous line paths — one <path> per BART line with smooth junction joins
// ---------------------------------------------------------------------------

export interface LinePath {
  lineColor: string;
  hexcolor: string;
  d: string;
}

export function computeLinePaths(): LinePath[] {
  const paths: LinePath[] = [];

  for (const line of LINES) {
    const pts: [number, number][] = [];

    const addPt = (x: number, y: number) => {
      const last = pts[pts.length - 1];
      if (last && Math.abs(last[0] - x) < 0.5 && Math.abs(last[1] - y) < 0.5) return;
      pts.push([x, y]);
    };

    for (let i = 0; i < line.stations.length; i++) {
      const st = STATION_MAP.get(line.stations[i]);
      if (!st) continue;

      if (i > 0) {
        const prev = line.stations[i - 1];
        const curr = line.stations[i];
        const n = edgeNormal(prev, curr);
        const off = edgeOffset(line.color, prev, curr);
        addPt(st.x + n.nx * off, st.y + n.ny * off);
      }

      if (i < line.stations.length - 1) {
        const curr = line.stations[i];
        const next = line.stations[i + 1];
        const n = edgeNormal(curr, next);
        const off = edgeOffset(line.color, curr, next);
        addPt(st.x + n.nx * off, st.y + n.ny * off);
      }
    }

    const d = pts
      .map(([x, y], j) => `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');

    paths.push({ lineColor: line.color, hexcolor: line.hexcolor, d });
  }

  return paths;
}
