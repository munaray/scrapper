import { format, formatDistanceToNow } from 'date-fns';

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Recently';
  }

  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatSalary(
  min?: number,
  max?: number,
  currency: string = 'USD',
  period: string = 'year'
): string | null {
  if (!min && !max) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency;
  const periodMap: Record<string, string> = {
    year: '/yr',
    month: '/mo',
    hour: '/hr',
    day: '/day',
  };
  const periodSuffix = periodMap[period.toLowerCase()] || '';

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toLocaleString();
  };

  if (min && max) {
    return `${currencySymbol}${formatAmount(min)} - ${currencySymbol}${formatAmount(max)}${periodSuffix}`;
  }

  if (min) {
    return `${currencySymbol}${formatAmount(min)}+${periodSuffix}`;
  }

  if (max) {
    return `Up to ${currencySymbol}${formatAmount(max)}${periodSuffix}`;
  }

  return null;
}
