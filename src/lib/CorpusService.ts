import monumentsData from '../data/monuments.json';
import inscriptionsData from '../data/inscriptions.json';
import dictionaryData from '../data/dictionary.json';

export interface Monument {
  id: string;
  name: string;
  discovery_year: number;
  location: string;
  model_3d_url: string;
  faces: string[];
}

export interface Inscription {
  id: string;
  monument_id: string;
  face: string;
  line_number: number;
  original_runes: string;
  transliteration: string;
  modern_turkish: string;
  coordinates_3d: { x: number; y: number; z: number };
}

export interface DictionaryEntry {
  id: string;
  modern_word: string;
  old_turkic_runes: string;
  transliteration: string;
  meaning: string;
  type: string;
  occurrences: { inscription_id: string; word_index: number }[];
}

export class CorpusService {
  static getMonuments(): Monument[] {
    return monumentsData as Monument[];
  }

  static getMonumentById(id: string): Monument | undefined {
    return this.getMonuments().find(m => m.id === id);
  }

  static getInscriptionsByMonument(monumentId: string): Inscription[] {
    return (inscriptionsData as Inscription[]).filter(i => i.monument_id === monumentId);
  }

  static getInscriptionById(id: string): Inscription | undefined {
    return (inscriptionsData as Inscription[]).find(i => i.id === id);
  }

  static getRandomInscription(): Inscription {
    const all = inscriptionsData as Inscription[];
    return all[Math.floor(Math.random() * all.length)];
  }

  static searchDictionary(modernWord: string): DictionaryEntry[] {
    const searchWord = modernWord.toLowerCase().trim();
    return (dictionaryData as DictionaryEntry[]).filter(
      entry => entry.modern_word.toLowerCase() === searchWord
    );
  }

  static transliterateWord(word: string): string {
    const lowerWord = word.toLowerCase();
    
    // Kalın ünlü harfler (a, ı, o, u) var mı diye kontrol et. Varsa kalın ünsüzler, yoksa ince ünsüzler kullanılır.
    const hasThickVowels = /[aıou]/.test(lowerWord);

    // Göktürk Harf Haritası (Basitleştirilmiş)
    const map: Record<string, string> = hasThickVowels ? {
      'a': '𐰀', 'ı': '𐰃', 'o': '𐰆', 'u': '𐰆', 'e': '𐰀', 'i': '𐰃', 'ö': '𐰇', 'ü': '𐰇',
      'b': '𐰉', 'd': '𐰑', 'g': '𐰍', 'ğ': '𐰍', 'k': '𐰴', 'q': '𐰴', 'l': '𐰞', 'n': '𐰣', 'r': '𐰺', 's': '𐰽', 't': '𐱃', 'y': '𐰖',
      'c': '𐰲', 'ç': '𐰲', 'm': '𐰢', 'p': '𐰯', 'ş': '𐰾', 'z': '𐰕', 'v': '𐰉', 'h': '𐰴', 'f': '𐰯', 'j': '𐰲'
    } : {
      'a': '𐰀', 'ı': '𐰃', 'o': '𐰆', 'u': '𐰆', 'e': '𐰀', 'i': '𐰃', 'ö': '𐰇', 'ü': '𐰇',
      'b': '𐰋', 'd': '𐰓', 'g': '𐰏', 'ğ': '𐰏', 'k': '𐰚', 'q': '𐰚', 'l': '𐰠', 'n': '𐰤', 'r': '𐰼', 's': 'ﺱ', 't': '𐱅', 'y': '𐰘',
      'c': '𐰲', 'ç': '𐰲', 'm': '𐰢', 'p': '𐰯', 'ş': '𐰾', 'z': '𐰕', 'v': '𐰋', 'h': '𐰚', 'f': '𐰯', 'j': '𐰲'
    };

    let result = '';
    for (let char of lowerWord) {
      result += map[char] || char; // Eşleşmeyen karakterleri aynen bırak (örn. noktalama işaretleri)
    }
    return result;
  }

  static translate(text: string): string {
    const words = text.split(/\s+/);
    return words.map(word => {
      // Noktalama işaretlerini ayırmak için (Basit bir temizlik)
      const cleanWord = word.replace(/[.,!?]/g, '');
      const punctuation = word.slice(cleanWord.length); // kelime sonundaki noktalama
      
      const entries = this.searchDictionary(cleanWord);
      if (entries.length > 0) {
        return entries[0].old_turkic_runes + punctuation;
      }
      
      // Sözlükte yoksa harf harf çevir
      return this.transliterateWord(cleanWord) + punctuation;
    }).join(' ');
  }
}
