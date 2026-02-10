/**
 * Interpolate missing (null) values in weather data
 * This algorithm matches the Blazor implementation exactly
 * Reference: Weather.razor lines 702-775
 */
export function interpolateData(data: (number | null)[]): number[] {
  const processedData: number[] = [];

  // Find first non-null value for beginning values
  const firstNonNullValue = data.find(d => d !== null) ?? 0;

  // Find last non-null value for ending values
  const lastNonNullValue = [...data].reverse().find(d => d !== null) ?? 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] !== null) {
      processedData.push(data[i]!);
      continue;
    }

    // Handle null values at the beginning
    if (i < data.length / 2) {
      processedData.push(firstNonNullValue);
      continue;
    }

    // Handle null values at the end
    if (i >= data.length / 2) {
      processedData.push(lastNonNullValue);
      continue;
    }

    // Find the next non-null value before
    let prevValue: number | null = null;
    for (let j = i - 1; j >= 0; j--) {
      if (data[j] !== null) {
        prevValue = data[j];
        break;
      }
    }

    // Find the next non-null value after
    let nextValue: number | null = null;
    for (let j = i + 1; j < data.length; j++) {
      if (data[j] !== null) {
        nextValue = data[j];
        break;
      }
    }

    // Interpolate or use nearest value
    if (prevValue !== null && nextValue !== null) {
      processedData.push((prevValue + nextValue) / 2.0);
    } else if (prevValue !== null) {
      processedData.push(prevValue);
    } else if (nextValue !== null) {
      processedData.push(nextValue);
    } else {
      processedData.push(0.0);
    }
  }

  return processedData;
}
