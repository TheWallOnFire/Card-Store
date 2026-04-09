import { describe, it, expect } from 'vitest';
import { parseBulkLines } from '../lib/parsers';

describe('Bulk Importer Parser (parseBulkLines)', () => {
    
    it('successfully parses valid [gameid]_[uuid]_[count] strings', () => {
        const input = 'ygo_7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8e_3';
        const { items, errors } = parseBulkLines(input);
        
        expect(errors).toHaveLength(0);
        expect(items).toHaveLength(1);
        expect(items[0]).toEqual({
            gameId: 'ygo',
            cardId: '7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8e',
            count: 3
        });
    });

    it('rejects malformed strings with missing components', () => {
        const input = 'ygo__3\n_card_1\nygo_7f8a7e32_';
        const { items, errors } = parseBulkLines(input);
        
        expect(items).toHaveLength(0);
        expect(errors).toHaveLength(3);
        expect(errors[0]).toContain('Invalid format');
    });

    it('rejects alpha counts or negative quantities', () => {
        const input = 'ygo_001_abc\npkm_002_-5\nmtg_003_0';
        const { items, errors } = parseBulkLines(input);
        
        expect(items).toHaveLength(0);
        expect(errors).toHaveLength(3);
        expect(errors[0]).toContain('Invalid format');
        expect(errors[1]).toContain('Quantity must be positive');
    });

    it('handles extreme counts and large numbers', () => {
        const input = 'ygo_001_999999';
        const { items, errors } = parseBulkLines(input);
        
        expect(errors).toHaveLength(0);
        expect(items[0].count).toBe(999999);
    });

    it('successfully trims leading/trailing whitespace', () => {
        const input = '  ygo_001_3  \n\n  pkm_002_5  ';
        const { items, errors } = parseBulkLines(input);
        
        expect(errors).toHaveLength(0);
        expect(items).toHaveLength(2);
        expect(items[0].cardId).toBe('001');
        expect(items[1].gameId).toBe('pkm');
    });

    it('handles multiple lines with mixed validity', () => {
        const input = 'ygo_001_3\nbad_line\npkm_002_1';
        const { items, errors } = parseBulkLines(input);
        
        expect(items).toHaveLength(2);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('Line 2');
    });
});
