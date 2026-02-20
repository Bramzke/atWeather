/**
 * Füllt fehlende (null) Messwerte in Wetterdaten durch Interpolation auf.
 *
 * Die GeoSphere API liefert bei Messausfällen null-Werte.
 * Dieser Algorithmus ersetzt diese durch plausible Schätzwerte:
 *
 * - Fehlende Werte am Anfang (erste Hälfte): erster bekannter Wert wird übernommen
 * - Fehlende Werte am Ende (zweite Hälfte): letzter bekannter Wert wird übernommen
 * - Fehlende Werte in der Mitte: Durchschnitt aus vorherigem und nächstem Messwert
 *
 * Der Algorithmus entspricht der ursprünglichen Blazor-Implementierung
 * (Weather.razor Zeilen 702-775).
 *
 * @param data - Rohe Messwerte mit möglichen null-Lücken
 * @returns Vollständiges Zahlen-Array ohne null-Werte
 */
export function interpolateData(data: (number | null)[]): number[] {
  const processedData: number[] = [];

  // Ersten und letzten bekannten Wert für Randbehandlung vorberechnen
  const firstNonNullValue = data.find(d => d !== null) ?? 0;
  const lastNonNullValue = [...data].reverse().find(d => d !== null) ?? 0;

  for (let i = 0; i < data.length; i++) {
    // Gültiger Messwert: direkt übernehmen
    if (data[i] !== null) {
      processedData.push(data[i]!);
      continue;
    }

    // Fehlender Wert in der ersten Hälfte: ersten bekannten Wert verwenden
    if (i < data.length / 2) {
      processedData.push(firstNonNullValue);
      continue;
    }

    // Fehlender Wert in der zweiten Hälfte: letzten bekannten Wert verwenden
    if (i >= data.length / 2) {
      processedData.push(lastNonNullValue);
      continue;
    }

    // Fehlender Wert in der Mitte: nächsten bekannten Wert vor und nach der Lücke suchen
    let prevValue: number | null = null;
    for (let j = i - 1; j >= 0; j--) {
      if (data[j] !== null) {
        prevValue = data[j];
        break;
      }
    }

    let nextValue: number | null = null;
    for (let j = i + 1; j < data.length; j++) {
      if (data[j] !== null) {
        nextValue = data[j];
        break;
      }
    }

    // Interpolieren oder nächstmöglichen bekannten Wert verwenden
    if (prevValue !== null && nextValue !== null) {
      processedData.push((prevValue + nextValue) / 2.0); // Linearer Mittelwert
    } else if (prevValue !== null) {
      processedData.push(prevValue);
    } else if (nextValue !== null) {
      processedData.push(nextValue);
    } else {
      processedData.push(0.0); // Letzter Fallback: 0
    }
  }

  return processedData;
}
