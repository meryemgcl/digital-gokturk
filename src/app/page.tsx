'use client';
import { useState } from 'react';
import Translator from '@/components/Translator';
import Museum3D from '@/components/Museum3D';

export default function Home() {
  const [customMonumentText, setCustomMonumentText] = useState('');

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700">
            Dijital Göktürk
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Orhun Yazıtları'nın tarihi dokusunu modern teknolojiyle keşfedin. Kendi kelimelerinizi tarihe kazıyın.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
          {/* Sol taraf: Çeviri Modülü */}
          <section className="bg-gray-900/40 rounded-3xl border border-gray-800/60 backdrop-blur-md shadow-2xl overflow-hidden">
            <Translator onTranslate={(text) => setCustomMonumentText(text)} />
          </section>

          {/* Sağ taraf: 3D Müze Modülü */}
          <section className="bg-gray-900/40 rounded-3xl border border-gray-800/60 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <Museum3D customText={customMonumentText} />
          </section>
        </div>
      </div>
    </main>
  );
}
