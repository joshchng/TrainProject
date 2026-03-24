export function formatMinutes(minutes: number | 'Leaving'): string {
  if (minutes === 'Leaving') return 'Leaving';
  if (minutes === 0) return 'Leaving';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
}

export function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}
