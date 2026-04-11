/**
 * Market Analytics Utility
 * Implements robust statistical processing for TCG price data.
 */

/**
 * Calculates a trimmed mean of prices to handle outliers.
 * Outliers are defined as values significantly higher or lower than the median.
 * Example Scenario: $5, $10, $100 -> The $100 is an outlier.
 */
export function calculateMarketPrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  if (prices.length <= 2) {
    return Number((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2));
  }

  // Sort prices ascending
  const sorted = [...prices].sort((a, b) => a - b);
  
  // Simple Outlier Filtering: IQR (Interquartile Range) Method
  const q1 = sorted[Math.floor(sorted.length / 4)];
  const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const filtered = sorted.filter(p => p >= lowerBound && p <= upperBound);

  // If filtering removes everything (extreme skew), fallback to median
  if (filtered.length === 0) {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  const sum = filtered.reduce((a, b) => a + b, 0);
  return Number((sum / filtered.length).toFixed(2));
}

/**
 * Validates the bulk import parser input.
 * Pattern: [gameid]_[cardid]_[count]
 */
export function validateBulkInputLine(line: string): { success: boolean; error?: string } {
  const trimmed = line.trim();
  if (!trimmed) return { success: false, error: 'Empty string' };

  const parts = trimmed.split('_');
  if (parts.length !== 3) {
    return { success: false, error: 'Malformed format (expected gameid_cardid_count)' };
  }

  const [gameId, cardId, countStr] = parts;
  
  if (!gameId) return { success: false, error: 'Missing Game ID' };
  if (!cardId) return { success: false, error: 'Missing Card ID' };
  
  const count = Number(countStr);
  if (isNaN(count)) return { success: false, error: 'Count must be a number' };
  if (!Number.isInteger(count)) return { success: false, error: 'Count must be an integer' };
  if (count <= 0) return { success: false, error: 'Count must be positive' };
  if (count > 1000000) return { success: false, error: 'Count exceeded safety limit' }; // Overflow integer check

  // Unicode check for gameId/cardId (alphanumeric + common separators only)
  const safeRegex = /^[a-zA-Z0-9-]+$/;
  if (!safeRegex.test(gameId) || !safeRegex.test(cardId)) {
    return { success: false, error: 'IDs contain invalid characters (unicode unsupported)' };
  }

  return { success: true };
}
