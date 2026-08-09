# Katkıda Bulunma Rehberi (Contributing)

Öncelikle Digital Göktürk projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu proje topluluğun desteğiyle büyümektedir.

## Nasıl Katkıda Bulunabilirsiniz?

### 1. Sözlüğü (Corpus) Büyütmek
Projemizin kalbi `/src/data/dictionary.json` dosyasındadır. Buraya yeni Eski Türkçe kelimeler ekleyebilirsiniz. Eklerken şu JSON formatına dikkat etmelisiniz:

```json
{
  "id": "word_benzersiz_id",
  "modern_word": "günümüz_türkçesi_karşılığı",
  "old_turkic_runes": "göktürk_harfleri",
  "transliteration": "latin_harfleriyle_okunuşu",
  "meaning": "sözlük_anlamı",
  "type": "isim/sıfat/fiil",
  "occurrences": []
}
```

### 2. Yazıt Metinleri Eklemek
`/src/data/inscriptions.json` içerisine Orhun Yazıtları'ndan, Yenisey veya Uygur dönemi metinlerinden yeni satırlar ekleyebilirsiniz.

### 3. Pull Request (PR) Açmak
1. Repoyu fork'layın.
2. Yeni bir dal (branch) oluşturun (`git checkout -b ozellik/yeni-kelimeler`).
3. Değişikliklerinizi yapın ve test edin (`npm run test`).
4. Commit'leyin (`git commit -m "feat: 50 yeni Eski Türkçe kelime eklendi"`).
5. Branch'inizi push'layın (`git push origin ozellik/yeni-kelimeler`).
6. GitHub üzerinden bir Pull Request açın!

Tarihimize yaptığınız bu dijital katkı için teşekkürler!
