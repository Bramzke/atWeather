import { parse, format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Wandelt einen deutschen Datumsstring (dd.MM.yyyy HH:mm) in ein Date-Objekt um.
 * Bei ungültigem Format wird das aktuelle Datum (auf 10 Minuten gerundet) zurückgegeben.
 *
 * @param dateString - Datumsstring im deutschen Format
 * @returns Geparster oder aktueller Date
 */
export function parseGermanDate(dateString: string): Date {
  try {
    return parse(dateString, 'dd.MM.yyyy HH:mm', new Date());
  } catch {
    // Fallback: aktuelles Datum wenn Parsing fehlschlägt
    return roundToTenMinutes(new Date());
  }
}

/**
 * Formatiert ein Date-Objekt in das deutsche Datumsformat (dd.MM.yyyy HH:mm).
 *
 * @param date - Zu formatierendes Datum
 * @returns Formatierter Datumsstring
 */
export function formatGermanDate(date: Date): string {
  return format(date, 'dd.MM.yyyy HH:mm');
}

/**
 * Rundet ein Datum auf das nächste untere 10-Minuten-Intervall.
 *
 * Notwendig da die GeoSphere API Daten im 10-Minuten-Raster liefert.
 * Sekunden und Millisekunden werden auf 0 gesetzt.
 *
 * Beispiele: 14:23 → 14:20, 09:58 → 09:50
 *
 * @param date - Zu rundendes Datum
 * @returns Gerundetes Datum
 */
export function roundToTenMinutes(date: Date): Date {
  const minutes = Math.floor(date.getMinutes() / 10) * 10;
  const result = new Date(date);
  result.setMinutes(minutes, 0, 0);
  return result;
}

/**
 * Formatiert einen ISO-Zeitstempel für die X-Achsenbeschriftung im Diagramm.
 * Gibt einen kompakten deutschen Wochentag mit Datum und Uhrzeit zurück.
 *
 * Beispiel: "2024-02-05T14:20:00Z" → "Mo 05.02 14:20"
 *
 * @param timestamp - ISO 8601 Zeitstempel (UTC)
 * @returns Formatierter Beschriftungsstring
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const dayAbbr = format(date, 'EEEEEE', { locale: de }); // Mo, Di, Mi, Do, Fr, Sa, So
  return `${dayAbbr} ${format(date, 'dd.MM HH:mm')}`;
}
