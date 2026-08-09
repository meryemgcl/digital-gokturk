const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, '../src/data/dictionary.json');
let dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));

// Tarihi metinlerden seçilmiş çok temel ve yaygın Göktürkçe kelimeler
const newWords = [
  { modern_word: "bodun", old_turkic_runes: "𐰉𐰆𐰑𐰣", transliteration: "bodun", meaning: "Millet, boylar birliği, halk", type: "isim" },
  { modern_word: "yir", old_turkic_runes: "𐰘𐰃𐰼", transliteration: "yir", meaning: "Yer, yeryüzü, toprak", type: "isim" },
  { modern_word: "sub", old_turkic_runes: "𐰽𐰆𐰉", transliteration: "sub", meaning: "Su, nehir", type: "isim" },
  { modern_word: "hatun", old_turkic_runes: "𐰴𐱃𐰆𐰣", transliteration: "qatun", meaning: "Hatun, kağanın eşi", type: "isim" },
  { modern_word: "sü", old_turkic_runes: "𐰾𐰇", transliteration: "sü", meaning: "Ordu, asker", type: "isim" },
  { modern_word: "er", old_turkic_runes: "𐰼", transliteration: "är", meaning: "Erkek, asker, yiğit", type: "isim" },
  { modern_word: "alp", old_turkic_runes: "𐰞𐰯", transliteration: "alp", meaning: "Cesur, kahraman, yiğit", type: "sıfat" },
  { modern_word: "kün", old_turkic_runes: "𐰚𐰇𐰤", transliteration: "kün", meaning: "Gün, güneş", type: "isim" },
  { modern_word: "ay", old_turkic_runes: "𐰖", transliteration: "ay", meaning: "Ay", type: "isim" },
  { modern_word: "tün", old_turkic_runes: "𐱅𐰇𐰤", transliteration: "tün", meaning: "Gece", type: "isim" },
  { modern_word: "öd", old_turkic_runes: "𐰇𐰑", transliteration: "öd", meaning: "Zaman, vakit", type: "isim" },
  { modern_word: "sab", old_turkic_runes: "𐰽𐰉", transliteration: "sab", meaning: "Söz, kelam, haber", type: "isim" },
  { modern_word: "bitig", old_turkic_runes: "𐰋𐰃𐱅𐰃𐰏", transliteration: "bitig", meaning: "Yazı, kitap, yazıt", type: "isim" },
  { modern_word: "taş", old_turkic_runes: "𐱃𐰸", transliteration: "taş", meaning: "Taş, kaya", type: "isim" },
  { modern_word: "altun", old_turkic_runes: "𐰞𐱃𐰆𐰣", transliteration: "altun", meaning: "Altın", type: "isim" },
  { modern_word: "kümüş", old_turkic_runes: "𐰚𐰇𐰢𐰇𐰾", transliteration: "kümüş", meaning: "Gümüş", type: "isim" },
  { modern_word: "temir", old_turkic_runes: "𐱅𐰢𐰼", transliteration: "tämür", meaning: "Demir", type: "isim" },
  { modern_word: "at", old_turkic_runes: "𐱃", transliteration: "at", meaning: "At (hayvan) veya isim", type: "isim" },
  { modern_word: "it", old_turkic_runes: "𐰃𐱅", transliteration: "it", meaning: "Köpek", type: "isim" },
  { modern_word: "börü", old_turkic_runes: "𐰋𐰇𐰼𐰇", transliteration: "börü", meaning: "Kurt", type: "isim" },
  { modern_word: "kuş", old_turkic_runes: "𐰴𐰆𐰸", transliteration: "quş", meaning: "Kuş", type: "isim" },
  { modern_word: "kel", old_turkic_runes: "𐰚𐰠", transliteration: "käl-", meaning: "Gelmek", type: "fiil" },
  { modern_word: "bar", old_turkic_runes: "𐰉𐰺", transliteration: "bar-", meaning: "Varmak, gitmek, var olmak", type: "fiil" },
  { modern_word: "kör", old_turkic_runes: "𐰚𐰇𐰼", transliteration: "kör-", meaning: "Görmek, bakmak", type: "fiil" },
  { modern_word: "eşit", old_turkic_runes: "𐰾𐰃𐱅", transliteration: "äşit-", meaning: "İşitmek, duymak", type: "fiil" },
  { modern_word: "bil", old_turkic_runes: "𐰋𐰃𐰠", transliteration: "bil-", meaning: "Bilmek", type: "fiil" },
  { modern_word: "kıl", old_turkic_runes: "𐰴𐰃𐰞", transliteration: "qıl-", meaning: "Kılmak, yapmak", type: "fiil" },
  { modern_word: "bol", old_turkic_runes: "𐰉𐰆𐰞", transliteration: "bol-", meaning: "Olmak", type: "fiil" },
  { modern_word: "öl", old_turkic_runes: "𐰇𐰠", transliteration: "öl-", meaning: "Ölmek", type: "fiil" },
  { modern_word: "tirig", old_turkic_runes: "𐱅𐰃𐰼𐰃𐰏", transliteration: "tirig", meaning: "Diri, canlı", type: "sıfat" },
  { modern_word: "yagı", old_turkic_runes: "𐰖𐰍𐰃", transliteration: "yağı", meaning: "Düşman", type: "isim" },
  { modern_word: "törü", old_turkic_runes: "𐱅𐰇𐰼𐰇", transliteration: "törü", meaning: "Töre, yasa, nizam", type: "isim" },
  { modern_word: "yok", old_turkic_runes: "𐰖𐰸", transliteration: "yoq", meaning: "Yok, bulunmayan", type: "sıfat" },
  { modern_word: "ol", old_turkic_runes: "𐰆𐰞", transliteration: "ol", meaning: "O (işaret zamiri)", type: "zamir" },
  { modern_word: "ben", old_turkic_runes: "𐰋𐰤", transliteration: "bän", meaning: "Ben (kişi zamiri)", type: "zamir" },
  { modern_word: "sen", old_turkic_runes: "𐰾𐰤", transliteration: "sän", meaning: "Sen (kişi zamiri)", type: "zamir" }
];

let addedCount = 0;
for (const word of newWords) {
  // Eğer kelime zaten yoksa ekle
  if (!dictionary.some(w => w.modern_word.toLowerCase() === word.modern_word.toLowerCase())) {
    dictionary.push({
      id: "word_" + (dictionary.length + 1).toString().padStart(3, '0'),
      ...word,
      occurrences: []
    });
    addedCount++;
  }
}

fs.writeFileSync(dictPath, JSON.stringify(dictionary, null, 2), 'utf-8');
console.log(`Veritabanı güncellendi! ${addedCount} yeni Eski Türkçe kelime eklendi. Toplam kelime sayısı: ${dictionary.length}`);
