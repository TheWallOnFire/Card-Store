const LinePattern = /^[a-zA-Z0-9]+_[a-fA-F0-9-]+_-?\d+$/;

interface IParsedItem {
  gameId: string;
  cardId: string;
  count: number;
}

export function parseBulkLines(rawText: string): { items: IParsedItem[], errors: string[] } {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const items: IParsedItem[] = [];
  const errors: string[] = [];

  for (const [idx, line] of lines.entries()) {
    if (!LinePattern.test(line)) {
      errors.push(`Line ${idx + 1}: Invalid format (expected gameid_cardid_count)`);
      continue;
    }
    const [gameId, cardId, countStr] = line.split('_');
    const count = parseInt(countStr, 10);
    if (count <= 0) {
      errors.push(`Line ${idx + 1}: Quantity must be positive`);
      continue;
    }
    items.push({ gameId, cardId, count });
  }
  return { items, errors };
}
