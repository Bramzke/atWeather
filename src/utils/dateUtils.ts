import { parse, format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Parse a German date string (dd.MM.yyyy HH:mm) to a Date object
 */
export function parseGermanDate(dateString: string): Date {
  try {
    return parse(dateString, 'dd.MM.yyyy HH:mm', new Date());
  } catch {
    // Fallback to current date if parsing fails
    return roundToTenMinutes(new Date());
  }
}

/**
 * Format a Date object to German format (dd.MM.yyyy HH:mm)
 */
export function formatGermanDate(date: Date): string {
  return format(date, 'dd.MM.yyyy HH:mm');
}

/**
 * Round a date to the nearest 10-minute interval (floor)
 */
export function roundToTenMinutes(date: Date): Date {
  const minutes = Math.floor(date.getMinutes() / 10) * 10;
  const result = new Date(date);
  result.setMinutes(minutes, 0, 0);
  return result;
}

/**
 * Format a timestamp for chart labels (e.g., "Mo 08.02 14:20")
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const dayAbbr = format(date, 'EEEEEE', { locale: de }); // Mo, Di, Mi...
  return `${dayAbbr} ${format(date, 'dd.MM HH:mm')}`;
}
