import { expect, test, describe } from 'vitest';
import { CorpusService } from './CorpusService';

describe('CorpusService Tests', () => {
  test('Monuments should load correctly', () => {
    const monuments = CorpusService.getMonuments();
    expect(monuments.length).toBeGreaterThan(0);
    expect(monuments[0].id).toBe('kul_tigin');
  });

  test('Should transliterate unknown words character by character', () => {
    // "kalem" kelimesinde ince ünlü "e" var, k ince (𐰚), l ince (𐰠), m (𐰢)
    const result = CorpusService.translate('kelime'); 
    // k(𐰚) e(𐰀) l(𐰠) i(𐰃) m(𐰢) e(𐰀) -> 𐰚𐰀𐰠𐰃𐰢𐰀
    expect(result).toBe('𐰚𐰀𐰠𐰃𐰢𐰀'); 
    
    // "baba" kelimesi kalın (a)
    // b(𐰉) a(𐰀) b(𐰉) a(𐰀) -> 𐰉𐰀𐰉𐰀
    const resultThick = CorpusService.translate('baba');
    expect(resultThick).toBe('𐰉𐰀𐰉𐰀');
  });

  test('Should search dictionary case-insensitively', () => {
    const result = CorpusService.searchDictionary('TÜRK');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].modern_word).toBe('türk');
    expect(result[0].old_turkic_runes).toBe('𐱅𐰇𐰼𐰰');
  });

  test('Should translate multiple words', () => {
    const result = CorpusService.translate('tanrı türk');
    expect(result).toBe('𐱅𐰭𐰼𐰃 𐱅𐰇𐰼𐰰');
  });
});
