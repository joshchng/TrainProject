import { useQuery } from '@tanstack/react-query';
import {
  getStations,
  getETD,
  getAllETDs,
  getRoutes,
  getAdvisories,
  getTrainCount,
  getElevatorStatus,
} from './bart-client';

export function useStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: getStations,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useAllDepartures() {
  return useQuery({
    queryKey: ['etd', 'ALL'],
    queryFn: getAllETDs,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useDepartures(station: string | null) {
  return useQuery({
    queryKey: ['etd', station],
    queryFn: () => getETD(station!),
    enabled: !!station,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useAdvisories() {
  return useQuery({
    queryKey: ['advisories'],
    queryFn: getAdvisories,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useTrainCount() {
  return useQuery({
    queryKey: ['trainCount'],
    queryFn: getTrainCount,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useElevatorStatus() {
  return useQuery({
    queryKey: ['elevatorStatus'],
    queryFn: getElevatorStatus,
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
}
