'use client';
import { useState, useRef } from 'react';
import { CorpusService, DictionaryEntry } from '@/lib/CorpusService';
import { toPng } from 'html-to-image';

export default function Translator({ onTranslate }: { onTranslate?: (text: string) => void }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [foundWords, setFoundWords] = useState<DictionaryEntry[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleTranslate = async (text: string) => {
    setInputText(text);
    
    if (!text.trim()) {
      setTranslatedText("");
      setFoundWords([]);
      onTranslate?.("");
      return;
    }

    try {
      const result = await CorpusService.translateAsync(text);
      setTranslatedText(result.translated_text);
      setFoundWords(result.found_words);
      onTranslate?.(result.translated_text);
    } catch (error) {
      console.error("Çeviri sırasında hata oluştu", error);
    }
  };

  const handleExport = async () => {
    if (exportRef.current) {
      try {
        const dataUrl = await toPng(exportRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = 'gokturk_ceviri.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Export failed', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-amber-500">Ruhunu Yaz (Çeviri Modülü)</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Günümüz Türkçesi:</label>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => handleTranslate(e.target.value)}
          placeholder="Örn: Tanrı Türk Bilge..."
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Göktürkçe Çeviri (RTL):</label>
        
        {/* Export edilecek alan - Taş deseni verilmiş arka plan */}
        <div 
          ref={exportRef}
          className="w-full p-8 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl relative overflow-hidden"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}
        >
          <div dir="rtl" className="font-gokturk text-4xl md:text-5xl text-amber-500 leading-relaxed text-right min-h-[80px] break-words">
            {translatedText || "..."}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleExport}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors font-medium shadow-lg"
        >
          Resim Olarak İndir
        </button>
      </div>

      {foundWords.length > 0 && (
        <div className="mt-6 p-5 bg-amber-950/30 border border-amber-800/50 rounded-xl shadow-inner">
          <h3 className="text-amber-500 font-bold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Sözlükteki Kelimelerin Anlamları
          </h3>
          <ul className="text-sm flex flex-col gap-3">
            {foundWords.map((word, idx) => (
              <li key={idx} className="text-gray-300 bg-black/40 p-3 rounded-lg border border-gray-800 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base capitalize">{word.modern_word}</span>
                  <span className="text-amber-500 text-xl font-gokturk">{word.old_turkic_runes}</span>
                  <span className="text-xs text-gray-400 italic px-2 py-0.5 bg-gray-800 rounded-full">{word.type}</span>
                </div>
                <p className="text-amber-200/80 mt-1">
                  <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Anlamı:</span> {word.meaning}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
