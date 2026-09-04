const sanitizeText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/__/g, '')
    .replace(/- /g, '')
    .trim();
};

export async function getCulturalSynthesis(prompt: string) {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt + " (Sampaikan dalam gaya puitis Sunda Buhun, penuhi lebar layar secara horizontal maksimal, jangan ramping)." })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) {
    return "Jagat Sagala sedang mengalami gangguan frekuensi batin.";
  }
}

export async function getLocationChronicle(locationName: string, coords: string) {
  try {
    const prompt = `Berikan risalah sejarah resmi, histori peristiwa penting, and legenda yang berkaitan dengan lokasi '${locationName}' di koordinat '${coords}'. Gunakan data akurat dari internet. Sampaikan dalam narasi puitis Waskita Pasundan yang sangat megah, penuhi lebar layar.`;
    const res = await fetch('/api/gemini/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return { text: sanitizeText(data.text || ''), sources: data.sources || [] };
  } catch (error) {
    return { text: "Gagal menelusuri kronik jagat raya.", sources: [] };
  }
}

export async function getMantraContext(prompt: string) {
  return getCulturalSynthesis(prompt);
}

export async function analyzePalmistry(base64Image: string) {
  try {
    const response = await fetch('/api/gemini/palmistry-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image })
    });
    const data = await response.json();
    return sanitizeText(data.result || 'Gagal merajut makna rajah batin.');
  } catch (error) {
    return "Sinyal batin terputus dalam kabut Parahyangan.";
  }
}

export async function analyzeFaceReading(base64Image: string, name: string, birthDate: string, motherName: string) {
  try {
    const prompt = `Lakukan analisis fisiognomi (Firasat Paras) mendalam pada wajah ini untuk subjek bernama ${name}, lahir ${birthDate}, putra/putri dari ${motherName}. Identifikasi: 1) Karakter dasar and integritas batiniah, 2) Pancaran aura and raksa batin, 3) Potensi kejayaan and karsa takdir berdasarkan tradisi Nyungsi Rasa Pasundan. Sampaikan dalam narasi puitis yang sangat agung, luas, and penuhi SELURUH LEBAR layar secara horizontal maksimal.`;
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) {
    return "Gagal membaca paras batin.";
  }
}

export async function getDreamInterpretation(dream: string) {
  return getCulturalSynthesis(`Nyungsi hartos impian: ${dream}. Berikan tafsir puitis Sunda Buhun yang mendalam, penuhi lebar layar secara horizontal maksimal.`);
}

export async function generateAmalan(category: string, hajat: string) {
  return getCulturalSynthesis(`Susunlah amalan batin kategori ${category} untuk hajat: ${hajat}. Gunakan bahasa puitis Sunda Buhun yang sakral, penuhi lebar layar secara horizontal maksimal.`);
}

export async function analyzeAura(base64Image: string, name: string) {
  const prompt = `Pindai pancaran aura batin atas nama ${name}. Sampaikan gradasi warna and maknanya dalam kacamata Waskita Sunda Buhun. Penuhi lebar layar secara horizontal maksimal.`;
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) { return "Gagal memindai aura."; }
}

export async function generateHealingProtocol(name: string, condition: string, type: string) {
  return getCulturalSynthesis(`Ramulah risalah Usada (Penyembuhan) Pasundan untuk ${name} dengan keluhan ${condition} (Kategori: ${type}). Sertakan mantra penawar and laku batin. Gaya Sunda Buhun, penuhi lebar layar secara horizontal maksimal.`);
}

export async function analyzeHandwriting(base64Image: string) {
  const prompt = "Lakukan analisis mendalam (Graphology Waskita) pada goresan tangan ini. Identifikasi: 1) Karakter dasar batiniah, 2) Kecenderungan emosional (raksa), and 3) Potensi takdir (karsa) dalam kerangka filosofi Sunda Buhun. Sampaikan secara sangat puitis, agung, and penuhi SELURUH LEBAR layar secara horizontal maksimal.";
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) { return "Gagal membaca serat batin."; }
}

export async function analyzeKhodam(base64Image: string, name: string, birthDate: string, motherName: string) {
  const prompt = `Singkap tabir Khodam pendamping untuk ${name}, lahir ${birthDate}, anak dari ${motherName}. Pindai aura pada citra and hubungkan dengan sanad leluhur. Penuhi lebar layar secara horizontal maksimal.`;
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) { return "Gagal menyingkap khodam."; }
}

export async function analyzePortalEnergy(base64Image: string, locationType: string, resonanceLevel: number) {
  const prompt = `Lakukan analisis spectral portal pada lokasi ${locationType} dengan level resonansi ${resonanceLevel}. Identifikasi entitas yang mencoba bermanifestasi. Penuhi lebar layar secara horizontal maksimal.`;
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (error) { return "Portal tertutup rapat."; }
}

import { generateSundaneseMysticalVisual, generateCardVisual as nanoCardVisual, generateKhodamEntityVisual, generateRajahTalismanVisual } from './nanoBananaImage';

export async function generateCardVisual(cardName: string) {
  return nanoCardVisual(cardName);
}

export async function analyzeFengShui(base64Image: string) {
  const prompt = "Lakukan analisis Tata Ruang (Feng Shui/Paririmbon) pada citra ini. Identifikasi zona-zona energi and berikan penjelasan mendalam.";
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return { analysisText: sanitizeText(data.result || ''), zones: [] };
  } catch (e) { return { analysisText: 'Gagal menganalisis tata ruang.', zones: [] }; }
}

export async function detectMysticalEnergy(base64Image: string, extraPrompt: string) {
  const prompt = "Lakukan deteksi energi ghaib and anomali pada citra ini. " + extraPrompt;
  try {
    const res = await fetch('/api/gemini/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    const data = await res.json();
    return sanitizeText(data.result || '');
  } catch (e) { return 'Gagal memindai dimensi.'; }
}

export async function generateMysticalVisual(base64Image: string, textResult: string) {
  return generateSundaneseMysticalVisual("Analisis Aura & Kosmologi", textResult);
}

export async function getMysticalProtection(name: string, condition: string) {
  return getCulturalSynthesis(`Berikan risalah perlindungan ghaib and pagar batin untuk ${name} yang menghadapi ${condition}.`);
}

export async function searchCultureDiscovery(query: string) {
  try {
    const res = await fetch('/api/gemini/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query })
    });
    const data = await res.json();
    return { text: sanitizeText(data.text || ''), sources: data.sources || [] };
  } catch (e) { return { text: 'Gagal menelusuri khazanah.', sources: [] }; }
}

export async function generateResultIllustration(text: string, title: string) {
  return generateSundaneseMysticalVisual(title, text);
}

export async function generateAksaraArt(aksaraType: string, text: string) {
  return generateSundaneseMysticalVisual(`Kaligrafi Aksara ${aksaraType}`, text);
}

export async function generateKhodamVisual(base64Image: string, analysis: string) {
  return generateKhodamEntityVisual("Khodam Pendamping Pasundan", analysis);
}

export async function generateAncientRitual(category: string, name: string, targetName: string, targetBirthDate: string, targetParent: string, notes: string, base64Image: string) {
  const analysisText = await getCulturalSynthesis(`Susunlah risalah ritual kuno kategori ${category} untuk ${name} yang ditujukan kepada ${targetName} (lahir ${targetBirthDate}, anak dari ${targetParent}). Catatan: ${notes}.`);
  const visualUrl = await generateSundaneseMysticalVisual(`Ritual Kuno ${category}`, analysisText);
  return { analysisText, visualUrl };
}

export async function visualizePortalEntity(base64Image: string, analysis: string) {
  return generateSundaneseMysticalVisual("Portal Dimensi & Entitas", analysis);
}

export async function generateBalaRitual(analysis: string) {
  const prompt = `Berdasarkan analisis energi portal: ${analysis}, rumuskan satu bait doa atau amalan singkat sebagai Benteng Batin.`;
  return getCulturalSynthesis(prompt);
}

export async function generateRajahVisual(ritualText: string) {
  return generateRajahTalismanVisual("Rajah Isim Kasepuhan", ritualText);
}

export async function communicateWithEntity(context: string, message: string) {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `Berperanlah sebagai entitas ghaib yang terdeteksi: ${context}. Balaslah pesan ini dengan gaya misterius and waskita: "${message}". Singkat saja.` })
    });
    const data = await res.json();
    return sanitizeText(data.result || '...suara statis...');
  } catch (e) { return '...suara statis...'; }
}

export async function translateTextToIndonesian(text: string) {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `Terjemahkan teks Sunda Buhun / klasik berikut ke dalam Bahasa Indonesia yang baku dan mudah dipahami, pertahankan makna spiritualnya: "${text}"` })
    });
    const data = await res.json();
    return sanitizeText(data.result || text);
  } catch (e) {
    return text;
  }
}
