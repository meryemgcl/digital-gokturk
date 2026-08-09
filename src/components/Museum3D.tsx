'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { CorpusService, Inscription } from '@/lib/CorpusService';

export default function Museum3D({ customText }: { customText?: string }) {
  const [activeFace, setActiveFace] = useState<string | null>(null);
  const [randomInscription, setRandomInscription] = useState<Inscription | null>(null);
  
  useEffect(() => {
    // Sayfa yüklendiğinde rastgele bir yazıt seç
    setRandomInscription(CorpusService.getRandomInscription());
  }, []);
  
  // Kullanıcı bir şey çevirdiyse onu, yoksa rastgele seçilen yazıtı göster.
  const displayText = customText || randomInscription?.original_runes || '...';

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <OrbitControls enableZoom={true} autoRotate={!activeFace} autoRotateSpeed={1} />

        {/* Temsili Anıt (Dikilitaş) */}
        <group 
          onClick={() => {
            setActiveFace(activeFace ? null : 'dogu');
            if (!customText) {
              setRandomInscription(CorpusService.getRandomInscription()); // Tıklanınca yeni söze geç
            }
          }} 
          cursor="pointer"
        >
          <Box args={[1.5, 4, 1.5]} castShadow receiveShadow>
            <meshStandardMaterial color={activeFace === 'dogu' ? '#5a4f40' : '#3d3730'} roughness={0.9} />
          </Box>
          
          {/* Doğu Yüzü Temsili Metni */}
          <Text
            position={[0, 1.5, 0.76]}
            fontSize={0.2}
            color="#d97706"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
            textAlign="center"
          >
            {displayText}
          </Text>
        </group>
      </Canvas>

      {/* Arayüz Katmanı (UI Overlay) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 w-11/12 max-w-md text-center transition-all duration-300">
        {activeFace ? (
          <div>
            <h4 className="text-amber-500 font-bold mb-1">{customText ? 'Senin Yazıtın' : `Kül Tigin - ${randomInscription?.face === 'dogu' ? 'Doğu' : 'Kuzey'} Yüzü ${randomInscription?.line_number}. Satır`}</h4>
            <p className="font-gokturk text-2xl md:text-3xl text-amber-400 mb-2 break-words leading-relaxed" dir="rtl">{displayText}</p>
            {!customText && (
              <>
                <p className="text-sm text-gray-400 italic mb-1">{randomInscription?.transliteration}</p>
                <p className="text-md text-white font-medium">{randomInscription?.modern_turkish}</p>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Anıtı döndürün ve okumak için üzerine tıklayın.</p>
        )}
      </div>
    </div>
  );
}
