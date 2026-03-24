export interface Station {
  name: string;
  abbr: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  county: string;
  state: string;
  zipcode: string;
}

export interface Estimate {
  minutes: number | 'Leaving';
  platform: number;
  direction: 'North' | 'South';
  length: number;
  color: string;
  hexcolor: string;
  bikeflag: boolean;
  delay: number;
  cancelflag: boolean;
}

export interface ETDDestination {
  destination: string;
  abbreviation: string;
  estimates: Estimate[];
}

export interface ETDResponse {
  stationName: string;
  stationAbbr: string;
  destinations: ETDDestination[];
}

export interface RouteStation {
  abbr: string;
}

export interface Route {
  name: string;
  abbr: string;
  routeID: string;
  number: number;
  color: string;
  hexcolor: string;
  stations: string[];
}

export interface Advisory {
  id: string;
  station: string;
  type: string;
  description: string;
  posted: string;
  expires: string;
}

export interface TrainCountResponse {
  count: number;
}

export interface ElevatorStatus {
  station: string;
  description: string;
  type: string;
  posted: string;
  expires: string;
}

// Raw BART API response wrappers — these match the nested JSON structure

export interface RawStationResponse {
  root: {
    stations: {
      station: RawStation | RawStation[];
    };
  };
}

export interface RawStation {
  name: string;
  abbr: string;
  gtfs_latitude: string;
  gtfs_longitude: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zipcode: string;
}

export interface RawETDResponse {
  root: {
    station: Array<{
      name: string;
      abbr: string;
      etd: Array<{
        destination: string;
        abbreviation: string;
        estimate: Array<{
          minutes: string;
          platform: string;
          direction: string;
          length: string;
          color: string;
          hexcolor: string;
          bikeflag: string;
          delay: string;
          cancelflag: string;
        }>;
      }>;
    }>;
  };
}

export interface RawRouteResponse {
  root: {
    routes: {
      route: Array<{
        name: string;
        abbr: string;
        routeID: string;
        number: string;
        color: string;
        hexcolor: string;
      }>;
    };
  };
}

export interface RawRouteDetailResponse {
  root: {
    routes: {
      route:
        | {
            name: string;
            abbr: string;
            routeID: string;
            number: string;
            color: string;
            hexcolor: string;
            config?: {
              station: string | string[];
            };
          }
        | Array<{
            name: string;
            abbr: string;
            routeID: string;
            number: string;
            color: string;
            hexcolor: string;
            config?: {
              station: string | string[];
            };
          }>;
    };
  };
}

export interface RawAdvisoryResponse {
  root: {
    bsa: Array<{
      id: string;
      station: string;
      type: string;
      description: { '#cdata-section': string } | string;
      posted: string;
      expires: string;
    }>;
  };
}

export interface RawTrainCountResponse {
  root: {
    traincount: string;
  };
}

export interface RawElevatorResponse {
  root: {
    bsa: Array<{
      station: string;
      description: { '#cdata-section': string } | string;
      type: string;
      posted: string;
      expires: string;
    }>;
  };
}
