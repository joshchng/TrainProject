import { useMemo } from 'react';
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
import { getBayAreaNews } from './news-client';
import { useAppStore } from '@/store/app-store';
import { approximateNorthSouthFleet } from '@/utils/fleet-breakdown';

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

/**
 * Single fleet number for UI: official BART total when direction is “all”, otherwise an
 * approximate north/south share derived from system ETD mix (see fleet-breakdown).
 */
export function useTrainsInServiceDisplay(): string {
  const directionFilter = useAppStore((s) => s.directionFilter);
  const windowMinutes = useAppStore((s) => s.departureWindowMinutes);
  const countQ = useTrainCount();
  const etdQ = useAllDepartures();

  const all = countQ.data;
  const dirPending = etdQ.isLoading && !etdQ.data;

  let north: number | null = null;
  let south: number | null = null;
  if (all != null && etdQ.data) {
    const split = approximateNorthSouthFleet(etdQ.data, all, windowMinutes);
    if (split) {
      north = split.north;
      south = split.south;
    }
  }

  return useMemo(() => {
    if (countQ.isLoading) return '…';
    if (countQ.isError || all == null) return '—';
    if (directionFilter === 'all') return String(all);
    if (dirPending) return '…';
    if (directionFilter === 'North') return north == null ? '—' : String(north);
    return south == null ? '—' : String(south);
  }, [
    all,
    countQ.isError,
    countQ.isLoading,
    directionFilter,
    dirPending,
    north,
    south,
  ]);
}

export function useElevatorStatus() {
  return useQuery({
    queryKey: ['elevatorStatus'],
    queryFn: getElevatorStatus,
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
}

export function useBayAreaNews() {
  return useQuery({
    queryKey: ['bayAreaNews'],
    queryFn: getBayAreaNews,
    staleTime: 4 * 60_000,
    /** Aligns with the worker’s ~5 minute RSS cache so users pick up new headlines periodically. */
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}
