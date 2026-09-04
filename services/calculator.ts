
import { DAYS_NEPTU, PASARAN_NEPTU } from '../constants.tsx';

/**
 * Simple approximation of Javanese Weton.
 */
export function calculateWeton(date: Date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasarans = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  const diffTime = date.getTime() - new Date('1900-01-01').getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const dayIndex = date.getDay();
  const dayName = days[dayIndex];
  
  const pasaranIndex = (diffDays + 4) % 5;
  const normalizedPasaran = pasaranIndex < 0 ? pasaranIndex + 5 : pasaranIndex;
  const pasaranName = pasarans[normalizedPasaran];

  const neptuDay = DAYS_NEPTU[dayName] || 0;
  const neptuPasaran = PASARAN_NEPTU[pasaranName] || 0;
  const totalNeptu = neptuDay + neptuPasaran;

  return {
    dayName,
    pasaranName,
    totalNeptu,
    javaneseDate: `${dayName} ${pasaranName}`
  };
}

export function getZodiac(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

export function getWatak(neptu: number): string {
  const wataks: Record<number, string> = {
    7: "Pandita Mukti (Suka menyendiri, berilmu)",
    8: "Laku Geni (Emosional namun pemberani)",
    9: "Laku Angin (Lincah, sulit ditebak)",
    10: "Laku Gunung (Tegar, kokoh)",
    11: "Laku Bulan (Menenteramkan, mempesona)",
    12: "Laku Kembang (Harum namanya, dicintai)",
    13: "Laku Lintang (Bercahaya, soliter)",
    14: "Lakuning Rembulan (Mempesona, penuh kasih)",
    15: "Lakuning Srengenge (Pemimpin, berwibawa)",
    16: "Lakuning Bumi (Sabar, pengayom)",
    17: "Lakuning Gunung (Tinggi derajatnya)",
    18: "Paripurna (Sempurna dalam segala hal)"
  };
  return wataks[neptu] || "Watak unik Nusantara";
}

export function calculateHanacarakaName(name: string) {
  if (!name || name.trim() === '') return { total: 0, breakdown: [], meaning: 'Masukkan nama lengkap.' };

  const cleanName = name.toLowerCase().trim();
  const letterMap: Record<string, { aksara: string, val: number }> = {
    'h': { aksara: 'ꦲ', val: 1 },
    'n': { aksara: 'ꦤ', val: 2 },
    'c': { aksara: 'ꦕ', val: 3 },
    'r': { aksara: 'ꦫ', val: 4 },
    'k': { aksara: 'ꦏ', val: 5 },
    'd': { aksara: 'ꦢ', val: 6 },
    't': { aksara: 'ꦠ', val: 7 },
    's': { aksara: 'ꦱ', val: 8 },
    'w': { aksara: 'ꦮ', val: 9 },
    'l': { aksara: 'ꦭ', val: 10 },
    'p': { aksara: 'ꦥ', val: 11 },
    'j': { aksara: 'ꦗ', val: 13 },
    'y': { aksara: 'ꦪ', val: 14 },
    'm': { aksara: 'ꦩ', val: 16 },
    'g': { aksara: 'ꦒ', val: 17 },
    'b': { aksara: 'ꦧ', val: 18 },
    'ng': { aksara: 'ꦔ', val: 20 },
    'ny': { aksara: 'ꦚ', val: 15 },
    'a': { aksara: 'ꦲ', val: 1 },
    'i': { aksara: 'ꦲ', val: 1 },
    'u': { aksara: 'ꦲ', val: 1 },
    'e': { aksara: 'ꦲ', val: 1 },
    'o': { aksara: 'ꦲ', val: 1 },
    'f': { aksara: 'ꦥ', val: 11 },
    'v': { aksara: 'ꦮ', val: 9 },
    'z': { aksara: 'ꦗ', val: 13 },
    'q': { aksara: 'ꦏ', val: 5 },
    'x': { aksara: 'ꦏ', val: 5 }
  };

  let total = 0;
  const breakdown: { char: string, aksara: string, val: number }[] = [];

  for (let i = 0; i < cleanName.length; i++) {
    const ch = cleanName[i];
    if (ch === ' ') continue;
    
    // Check for 2-char combos like ng, ny
    if (i < cleanName.length - 1) {
      const combo = ch + cleanName[i+1];
      if (letterMap[combo]) {
        breakdown.push({ char: combo, aksara: letterMap[combo].aksara, val: letterMap[combo].val });
        total += letterMap[combo].val;
        i++;
        continue;
      }
    }

    if (letterMap[ch]) {
      breakdown.push({ char: ch, aksara: letterMap[ch].aksara, val: letterMap[ch].val });
      total += letterMap[ch].val;
    } else {
      breakdown.push({ char: ch, aksara: 'ꦄ', val: 1 });
      total += 1;
    }
  }

  const remainder = total % 5;
  const meanings: Record<number, { title: string, desc: string }> = {
    1: { title: "SRI", desc: "Melambangkan kelimpahan rezeki, keberuntungan hidup, dan kemuliaan nama baik." },
    2: { title: "LUNGGUH", desc: "Melambangkan kedudukan, jabatan terhormat, dan kewibawaan di tengah masyarakat." },
    3: { title: "DUNYA", desc: "Melambangkan kecukupan harta benda, kemakmuran material, and kestabilan hidup." },
    4: { title: "LARA", desc: "Melambangkan ujian hidup atau keprihatinan batin yang mendewasakan jiwa menuju kebijaksanaan." },
    0: { title: "PATI", desc: "Melambangkan transformasi spiritual yang agung, kematian ego, dan kebangkitan batin luhur." }
  };

  const meaning = meanings[remainder] || { title: "SRI", desc: "Keberkahan dan limpahan rahmat leluhur." };

  return { total, breakdown, meaning };
}

export function calculateMatch(neptu1: number, neptu2: number) {
  const total = neptu1 + neptu2;
  const result = total % 8;
  
  const matchTypes: Record<number, { label: string, desc: string }> = {
    1: { label: "PEGAT", desc: "Berisiko menghadapi masalah sering di kemudian hari, baik ekonomi maupun keharmonisan." },
    2: { label: "RATU", desc: "Jodoh yang sangat dihormati dan disegani, rezeki melimpah dan rumah tangga harmonis." },
    3: { label: "JODOH", desc: "Pasangan yang serasi, saling menerima kekurangan, dan langgeng hingga tua." },
    4: { label: "TOPO", desc: "Sering mengalami kesulitan di awal (ekonomi atau kesehatan), namun akan sukses dan bahagia di hari tua." },
    5: { label: "TINARI", desc: "Mendapat kemudahan rezeki, sering beruntung, dan tidak pernah kekurangan sandang pangan." },
    6: { label: "PADU", desc: "Sering terjadi pertengkaran namun tidak sampai bercerai. Membutuhkan kesabaran ekstra." },
    7: { label: "SUJANAN", desc: "Berisiko adanya perselingkuhan atau gangguan dari pihak ketiga. Perlu saling menjaga kepercayaan." },
    0: { label: "PESTHI", desc: "Rumah tangga akan rukun, adem ayem, dan tentram selamanya. Jodoh terbaik." },
  };

  return matchTypes[result] || { label: "TITIS", desc: "Hubungan yang membutuhkan olah rasa dan kedewasaan spiritual." };
}


