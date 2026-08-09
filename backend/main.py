import json
import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Digital Göktürk API", version="1.0.0")

# Frontend (Next.js) uygulamasının istek yapabilmesi için CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında her yerden gelen isteklere izin veriyoruz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veritabanı yolları (Next.js tarafındaki data klasöründen ortak okuyoruz)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICTIONARY_PATH = os.path.join(BASE_DIR, 'src', 'data', 'dictionary.json')
INSCRIPTIONS_PATH = os.path.join(BASE_DIR, 'src', 'data', 'inscriptions.json')

def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Veri yüklenemedi: {filepath} - Hata: {e}")
        return []

DICTIONARY = load_json(DICTIONARY_PATH)
INSCRIPTIONS = load_json(INSCRIPTIONS_PATH)

# Çeviri Haritası
CHAR_MAP_THICK = {
    'a': '𐰀', 'ı': '𐰃', 'o': '𐰆', 'u': '𐰆',
    'b': '𐰉', 'd': '𐰑', 'g': '𐰍', 'k': '𐰴', 'l': '𐰞',
    'n': '𐰣', 'r': '𐰺', 's': '𐰽', 't': '𐱃', 'y': '𐰖',
    'ç': '𐰲', 'm': '𐰢', 'p': '𐰯', 'ş': '𐰸', 'z': '𐰕', 'v': '𐰉'
}

CHAR_MAP_THIN = {
    'e': '𐰀', 'i': '𐰃', 'ö': '𐰇', 'ü': '𐰇',
    'b': '𐰋', 'd': '𐰓', 'g': '𐰏', 'k': '𐰚', 'l': '𐰠',
    'n': '𐰤', 'r': '𐰼', 's': '𐰾', 't': '𐱅', 'y': '𐰘',
    'ç': '𐰲', 'm': '𐰢', 'p': '𐰯', 'ş': '𐰸', 'z': '𐰕', 'v': '𐰋'
}

def is_thick_word(word: str) -> bool:
    return bool(re.search(r'[aıou]', word, re.IGNORECASE))

def transliterate_word(word: str) -> str:
    word_lower = word.lower()
    is_thick = is_thick_word(word_lower)
    char_map = CHAR_MAP_THICK if is_thick else CHAR_MAP_THIN
    
    result = ""
    for char in word_lower:
        if char in char_map:
            result += char_map[char]
    return result

class TranslateRequest(BaseModel):
    text: str

@app.post("/api/translate")
def translate_text(request: TranslateRequest):
    words = request.text.split()
    translated_words = []
    found_words = []
    
    for word in words:
        clean_word = re.sub(r'[^a-zA-ZçğıöşüÇĞIÖŞÜ]', '', word).lower()
        if not clean_word:
            continue
            
        dict_entry = next((w for w in DICTIONARY if w.get('modern_word', '').lower() == clean_word), None)
        
        if dict_entry:
            translated_words.append(dict_entry['old_turkic_runes'])
            found_words.append(dict_entry)
        else:
            translated_words.append(transliterate_word(clean_word))
            
    return {
        "translated_text": " ".join(translated_words),
        "found_words": found_words
    }

@app.get("/api/inscriptions/random")
def get_random_inscription():
    import random
    if not INSCRIPTIONS:
        return {"error": "Veri bulunamadı"}
    return random.choice(INSCRIPTIONS)

@app.get("/")
def read_root():
    return {"message": "Digital Göktürk Python Backend Çalışıyor!"}
