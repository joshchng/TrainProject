export interface LineInfo {
  name: string;
  color: string;
  hexcolor: string;
}

export const LINES: Record<string, LineInfo> = {
  YELLOW: { name: 'Yellow', color: 'YELLOW', hexcolor: '#FFE800' },
  BLUE: { name: 'Blue', color: 'BLUE', hexcolor: '#0099D8' },
  ORANGE: { name: 'Orange', color: 'ORANGE', hexcolor: '#F58220' },
  GREEN: { name: 'Green', color: 'GREEN', hexcolor: '#4DB848' },
  RED: { name: 'Red', color: 'RED', hexcolor: '#ED1C24' },
};

export const LINE_KEYS = Object.keys(LINES);
