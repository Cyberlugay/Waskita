
import React, { useState, useMemo } from 'react';
import { calculateWeton, getWatak, getZodiac, calculateHanacarakaName } from '../services/calculator.ts';
import { getCulturalSynthesis, translateTextToIndonesian } from '../services/gemini.ts';
import { getCardByNeptu, generateWaskitaPrompt, WaskitaCard } from '../services/waskitaCards.ts';
import { generateIsimZimatVisual } from '../services/aiService.ts';
import { 
  Calendar, Search, Sparkles, Loader2, User, Compass, BookOpen, ScrollText, Waves, Flame, Mountain, Wind, Info, Zap, Star, Home
} from 'lucide-react';
import ShareResult from '../components/ShareResult.tsx';
import { AppView } from '../types.ts';

const CharacterConstellation = ({ data }: { data: { subject: string, value: number }[] }) => {
  const points = data.length;
  const radius = 38;
  const center = 50;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * (360 / points) - 90) * (Math.PI / 180);
    const x = center + radius * (value / 100) * Math.cos(angle);
    const y = center + radius * (value / 100) * Math.sin(angle);
    return { x, y };
  };

  const polygonPath = data.map((item, i) => {
    const coords = getCoordinates(i, item.value);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="w-full aspect-square max-w-[450px] mx-auto relative group select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.1),transparent_70%)] animate-pulse" />
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
        {[20, 40, 60, 80, 100].map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke="rgba(217, 119, 6, 0.1)"
            strokeWidth="0.2"
            strokeDasharray={level === 100 ? "none" : "1, 2"}
          />
        ))}
        {data.map((_, i) => {
          const coords = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(217, 119, 6, 0.05)"
              strokeWidth="0.1"
            />
          );
        })}
        <polygon
          points={polygonPath}
          fill="rgba(217, 119, 6, 0.15)"
          stroke="#d97706"
          strokeWidth="0.6"
          className="transition-all duration-[2000ms] ease-out"
        />
        {data.map((item, i) => {
          const coords = getCoordinates(i, item.value);
          return (
            <circle key={i} cx={coords.x} cy={coords.y} r="1.5" fill="#f59e0b" className="shadow-amber-500 shadow-lg" />
          );
        })}
      </svg>
      {data.map((item, i) => {
        const angle = (i * (360 / points) - 90);
        const rad = angle * (Math.PI / 180);
        const dist = 56; 
        const lx = center + dist * Math.cos(rad);
        const ly = center + dist * Math.sin(rad);
        return (
          <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${lx}%`, top: `${ly}%` }}>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[7px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800 shadow-xl">
                {item.subject}
              </span>
              <span className="text-[9px] font-heritage font-bold text-stone-100">{item.value}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CalculatorView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [userName, setUserName] = useState('');
  const [birthDate, setBirthDate] = useState(''); 
  const [gender, setGender] = useState<'Pria' | 'Wanita'>('Pria');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const handleTranslate = async () => {
    if (!aiInsight) return;
    setTranslating(true);
    const translated = await translateTextToIndonesian(aiInsight);
    setAiInsight(translated);
    setTranslating(false);
  };

  const parseManualDate = (dateStr: string) => {
    if (!dateStr || dateStr.trim() === '') return new Date(1990, 4, 12);
    const trimmed = dateStr.trim();
    const parts = trimmed.split(/[-/.]/);
    if (parts.length === 3) {
      let day, month, year;
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date(1990, 4, 12);
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? new Date(1990, 4, 12) : date;
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? new Date(1990, 4, 12) : d;
  };

  const getElementInfo = (pasaran: string) => {
    switch(pasaran) {
      case 'Legi': return { name: 'Air', icon: <Waves size={24} />, color: 'from-blue-900/40 to-stone-950', border: 'border-blue-900/50', text: 'text-blue-400', desc: 'Adaptabilitas batin.' };
      case 'Pahing': return { name: 'Api', icon: <Flame size={24} />, color: 'from-red-900/40 to-stone-950', border: 'border-red-900/50', text: 'text-red-400', desc: 'Gairah transformasi.' };
      case 'Pon': return { name: 'Tanah', icon: <Mountain size={24} />, color: 'from-amber-900/40 to-stone-950', border: 'border-amber-900/50', text: 'text-amber-400', desc: 'Stabilitas keteguhan.' };
      case 'Wage': return { name: 'Udara', icon: <Wind size={24} />, color: 'from-stone-800 to-stone-950', border: 'border-stone-700', text: 'text-stone-300', desc: 'Kecerdasan dinamika.' };
      case 'Kliwon': return { name: 'Aether', icon: <Sparkles size={24} />, color: 'from-amber-600/20 to-stone-950', border: 'border-amber-600/30', text: 'text-amber-500', desc: 'Keseimbangan spiritual.' };
      default: return { name: 'Unsur', icon: <Sparkles size={24} />, color: 'from-stone-900 to-stone-950', border: 'border-stone-800', text: 'text-stone-400', desc: 'Energi murni.' };
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null); 
    setAiInsight('');
    setAiImageUrl(null);
    const date = parseManualDate(birthDate || '17-08-1945');
    const weton = calculateWeton(date);
    const zodiac = getZodiac(date);
    const watakText = getWatak(weton.totalNeptu);
    const element = getElementInfo(weton.pasaranName);
    const card = getCardByNeptu(weton.totalNeptu);
    const calcResult = { ...weton, zodiac, watak: watakText, elementInfo: element, gender, card };
    const prompt = generateWaskitaPrompt(card, userName, gender, weton.javaneseDate, weton.totalNeptu, zodiac);
    
    setImageLoading(true);
    const [insight, imageUrl] = await Promise.all([
      getCulturalSynthesis(prompt),
      generateIsimZimatVisual(
        `Kartu Waskita #${card.number}: ${card.name} (${card.archetype})`,
        `Simbol Utama: ${card.symbol}, Unsur: ${card.element}, Simbol Keberuntungan: ${card.luckySymbol.symbol}, Warna: ${card.luckySymbol.color}, Kata Kunci: ${card.luckySymbol.keywords.join(', ')}, Weton: ${weton.javaneseDate}, Neptu: ${weton.totalNeptu}`
      )
    ]);

    setAiInsight(insight);
    setAiImageUrl(imageUrl);
    setResult(calcResult);
    setLoading(false);
    setImageLoading(false);
  };

  const handleRegenerateImage = async () => {
    if (!result) return;
    setImageLoading(true);
    const card = result.card || { name: 'Galura Kancana', number: 1, archetype: 'Keteguhan', symbol: 'Kujang', element: 'Api', luckySymbol: { symbol: 'Kujang', color: 'Emas', keywords: ['Teguh'] } };
    const salt = Math.floor(Math.random() * 999999);
    const imageUrl = await generateIsimZimatVisual(
      `Kartu Waskita #${card.number}: ${card.name} (${card.archetype}) [Variasi ${salt}]`,
      `Simbol: ${card.symbol}, Unsur: ${card.element}, Warna: ${card.luckySymbol.color}, Kata Kunci: ${card.luckySymbol.keywords.join(', ')}, Weton: ${result.javaneseDate}, Neptu: ${result.totalNeptu}`
    );
    if (imageUrl) setAiImageUrl(imageUrl);
    setImageLoading(false);
  };

  const characterData = useMemo(() => {
    if (!result) return [];
    const n = Number(result.totalNeptu);
    const safeNum = (v: number) => Math.max(25, Math.min(98, Math.floor(v)));
    return [
      { subject: 'AKHLAK', value: safeNum((n / 18) * 80 + 15) },
      { subject: 'REJEKI', value: safeNum(((n + 4) / 22) * 85 + 10) },
      { subject: 'BATIN', value: safeNum(((19 - n) / 12) * 65 + 30) },
      { subject: 'WIBAWA', value: safeNum((n / 18) * 75 + 20) },
      { subject: 'SABAR', value: safeNum((n % 6) * 12 + 40) },
      { subject: 'ALAM', value: safeNum((result.totalNeptu * 5) % 100 + 30) },
    ];
  }, [result]);

  const hanacarakaRes = useMemo(() => {
    return calculateHanacarakaName(userName || 'Waskita');
  }, [userName]);

  return (
    <div className="space-y-8 pb-20 px-0 md:px-10 py-8 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <header className="space-y-4 px-4 md:px-0">
        <button onClick={() => onNavigate(AppView.HOME)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--pasundan-green)] transition-colors mb-6 group"><div className="p-2 rounded-full group-hover:bg-[var(--pasundan-green-light)] transition-colors"><Home size={18} /></div><span className="font-bold uppercase tracking-widest text-[10px]">Beranda</span></button>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--pasundan-green)] shadow-sm"><BookOpen size={32} /></div>
          <div>
            <h2 className="text-3xl md:text-5xl font-heritage font-bold text-[var(--text-primary)] tracking-tight uppercase leading-none">Paririmbon</h2>
            <p className="text-[var(--pasundan-green)] uppercase text-[10px] tracking-[0.4em] font-black mt-1">Algoritma Kosmologis Nusantara</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-0">
        <div className="xl:col-span-4 px-4 md:px-0">
          <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[40px] space-y-8 shadow-sm">
            <h3 className="text-2xl font-heritage font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-4">Inisiasi Data</h3>
            <div className="space-y-6">
              <div className="space-y-2"><label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Nama Lengkap</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ahmad Satria..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] focus:border-[var(--pasundan-green)] outline-none shadow-inner" /></div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('Pria')}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold border transition-all ${gender === 'Pria' ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-stone-700'}`}
                  >
                    Pria
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Wanita')}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold border transition-all ${gender === 'Wanita' ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-stone-700'}`}
                  >
                    Wanita
                  </button>
                </div>
              </div>

              <div className="space-y-2"><label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Tanggal Lahir (HH-BB-TTTT)</label><input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="17-08-1945" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] focus:border-[var(--pasundan-green)] outline-none shadow-inner" /></div>
              <button onClick={handleCalculate} disabled={loading} className="w-full py-5 bg-[var(--pasundan-green)] hover:bg-[var(--pasundan-green-dark)] text-white font-black rounded-2xl shadow-sm uppercase tracking-widest text-[11px] cursor-pointer">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'SINGKAP TAKDIR'}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-8 px-0">
          {loading && (
            <div className="h-96 bg-stone-900/30 md:rounded-[48px] border-y md:border border-stone-800 flex flex-col items-center justify-center space-y-6">
               <Loader2 className="animate-spin text-amber-600" size={48} />
               <p className="text-amber-500 font-heritage italic text-xl animate-pulse">Membaca denyut semesta...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-8 animate-in fade-in duration-1000 px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
                <div className="p-8 md:p-12 bg-stone-900/40 rounded-[40px] border border-stone-800 shadow-inner backdrop-blur-md">
                  <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-4">Hari & Pasaran</p>
                  <h3 className="text-4xl md:text-6xl font-heritage font-bold text-white mb-6 text-glow-amber">{result.javaneseDate}</h3>
                  <span className="px-6 py-2.5 bg-amber-600 text-stone-950 rounded-xl text-xl font-black tracking-widest shadow-xl">NEPTU {result.totalNeptu}</span>
                </div>
                <div className={`p-8 md:p-12 rounded-[40px] border ${result.elementInfo?.border} bg-gradient-to-br ${result.elementInfo?.color} shadow-inner backdrop-blur-md`}>
                   <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-4">Elemen Batin</p>
                   <h3 className={`text-4xl md:text-6xl font-heritage font-bold ${result.elementInfo?.text} mb-4`}>{result.elementInfo?.name}</h3>
                   <p className="text-stone-400 text-sm italic">"{result.elementInfo?.desc}"</p>
                </div>
              </div>

              {/* Hanacaraka Name Calculation Card */}
              <div className="p-8 md:p-12 bg-stone-900/60 rounded-[40px] border border-amber-500/30 shadow-2xl mx-4 md:mx-0 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div>
                    <h4 className="text-xl md:text-2xl font-heritage font-bold text-amber-400">Kalkulasi Aksara Hanacaraka & Bobot Nama</h4>
                    <p className="text-stone-400 text-xs mt-1">Analisis Karakter Nama Berdasarkan Sanad Carakan Nusantara</p>
                  </div>
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-2xl font-black text-sm border border-amber-500/40">TOTAL BOBOT: {hanacarakaRes.total}</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Transliterasi Aksara:</p>
                  <div className="flex flex-wrap gap-3">
                    {hanacarakaRes.breakdown.map((item, idx) => (
                      <div key={idx} className="px-4 py-3 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col items-center">
                        <span className="text-2xl font-heritage text-amber-400">{item.aksara}</span>
                        <span className="text-[10px] text-stone-400 uppercase font-bold mt-1">{item.char} ({item.val})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-stone-950/80 rounded-3xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    <span className="text-amber-400 font-bold uppercase text-sm tracking-wider">Takdir Nama ({hanacarakaRes.meaning.title})</span>
                  </div>
                  <p className="text-stone-300 text-sm md:text-base leading-relaxed italic">{hanacarakaRes.meaning.desc}</p>
                </div>
              </div>

              <div className="p-6 md:p-20 bg-stone-900/20 md:rounded-[60px] border-y md:border border-stone-800 shadow-2xl mx-0">
                <CharacterConstellation data={characterData} />
              </div>

              <div className="p-0 md:p-16 bg-stone-900/50 md:rounded-[60px] border-y md:border border-stone-800 shadow-inner relative space-y-12">
                {/* Kartu Waskita Summary Card */}
                {result.card && (
                  <div className="max-w-md mx-auto p-6 bg-stone-900/90 rounded-[32px] border border-amber-500/40 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">KARTU WASKITA #{result.card.number}</span>
                      <span className="text-[10px] font-bold text-stone-400">{result.card.element}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-heritage font-bold text-white text-glow-amber">{result.card.name}</h3>
                      <p className="text-xs text-amber-300 font-medium mt-1">{result.card.archetype} • Simbol: {result.card.symbol}</p>
                    </div>
                    <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
                      <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Simbol Keberuntungan (Refleksi Budaya):</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                        <div>Simbol: <span className="text-white font-bold">{result.card.luckySymbol.symbol}</span></div>
                        <div>Unsur: <span className="text-white font-bold">{result.card.luckySymbol.element}</span></div>
                        <div>Warna: <span className="text-white font-bold">{result.card.luckySymbol.color}</span></div>
                        <div>Angka: <span className="text-white font-bold">{result.card.luckySymbol.number}</span></div>
                      </div>
                      <div className="pt-2 border-t border-stone-900 text-[11px] text-amber-200 italic font-medium">
                        Kata Kunci: {result.card.luckySymbol.keywords.join(' • ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* 9:16 AI Mystical Illustration */}
                <div className="max-w-md mx-auto aspect-[9/16] rounded-[40px] overflow-hidden border border-amber-500/30 bg-stone-950 shadow-2xl relative flex flex-col items-center justify-center">
                  {imageLoading ? (
                    <div className="flex flex-col items-center gap-4 text-amber-500 p-8 text-center">
                      <Loader2 className="animate-spin" size={48} />
                      <p className="font-heritage italic text-lg animate-pulse">Menenun visual kosmik Paririmbon (Nano Banana)...</p>
                    </div>
                  ) : aiImageUrl ? (
                    <img src={aiImageUrl} alt="Ilustrasi Paririmbon Kosmik" className="w-full h-full object-cover brightness-90" />
                  ) : (
                    <div className="text-stone-500 font-heritage italic text-sm">Visual kosmik tidak tersedia</div>
                  )}
                  <div className="absolute bottom-6 left-6 right-6 text-center z-20 bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30">
                    <h4 className="text-xl font-heritage font-bold text-amber-400">Kartu Waskita: {result.card?.name || 'Galura Kancana'}</h4>
                    <p className="text-[10px] text-stone-300 uppercase tracking-widest mt-1">Weton: {result.javaneseDate} (Neptu {result.totalNeptu})</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="max-w-md mx-auto px-4">
                  <button
                    onClick={handleRegenerateImage}
                    disabled={imageLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 text-amber-300 rounded-2xl text-xs font-bold border border-amber-500/50 shadow-lg transition-all disabled:opacity-50"
                  >
                    {imageLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {imageLoading ? 'Menenun Sesuai Risalah...' : 'Tenun Ulang Gambar AI Sesuai Risalah, Watak & Rezeki (Nano Banana)'}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-amber-500 mb-10 border-b border-stone-800 pb-8 px-6 pt-8 md:pt-0 md:px-0 relative z-10">
                  <div className="flex items-center gap-3">
                    <ScrollText size={32} />
                    <h3 className="font-heritage text-2xl md:text-3xl font-bold uppercase tracking-wider">Risalah Waskita</h3>
                  </div>
                  <button 
                    onClick={handleTranslate} 
                    disabled={translating}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-2xl text-xs font-bold border border-amber-500/40 transition-colors self-start md:self-auto"
                  >
                    {translating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {translating ? 'Menerjemahkan...' : 'Terjemahkan ke Bahasa Indonesia'}
                  </button>
                </div>
                <div className="text-stone-100 text-lg md:text-4xl leading-relaxed italic text-justify whitespace-pre-wrap font-medium p-5 md:p-20 bg-stone-950/50 md:rounded-[40px] border-y md:border border-stone-800 shadow-inner w-full relative z-10">
                  {aiInsight}
                </div>
                <div className="px-6 md:px-0 pb-10 mt-10 space-y-6">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-stone-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all active:scale-95"
                  >
                    <Sparkles size={20} /> BAGIKAN KARTU WASKITA (9:16)
                  </button>
                  <ShareResult title="Risalah Paririmbon Nusantara" text={aiInsight} context={`Weton: ${result.javaneseDate}, Neptu: ${result.totalNeptu}`} />
                </div>
              </div>
            </div>
          )}

          {/* 9:16 Waskita Pasundan Share Card Modal */}
          {showShareModal && result && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="max-w-md w-full bg-stone-900 rounded-[40px] border border-amber-500/50 p-6 md:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
                
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Koleksi Budaya Digital</span>
                  <h3 className="font-heritage text-2xl font-bold text-white">Kartu Waskita Pasundan</h3>
                </div>

                {/* 9:16 Render Preview Card */}
                <div className="aspect-[9/16] w-full max-w-[300px] mx-auto rounded-[32px] overflow-hidden border-2 border-amber-500/60 bg-stone-950 shadow-2xl relative flex flex-col justify-between p-5 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-stone-950/90 pointer-events-none" />
                  
                  {/* Header */}
                  <div className="relative z-10 space-y-0.5">
                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-[0.25em]">GALURA LUGAY KANCANA</span>
                    <h4 className="text-[10px] font-heritage font-bold text-white tracking-widest uppercase">WASKITA PASUNDAN • KARTU #{result.card?.number}</h4>
                  </div>

                  {/* Center Illustration */}
                  <div className="relative z-10 my-2 w-28 h-36 mx-auto rounded-xl overflow-hidden border border-amber-500/40 shadow-inner bg-stone-900">
                    {aiImageUrl ? (
                      <img src={aiImageUrl} alt="Kartu Waskita" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-amber-500">Isim Zimat</div>
                    )}
                  </div>

                  {/* Card Details & Attributes */}
                  <div className="relative z-10 space-y-1.5 text-left bg-stone-900/90 p-3 rounded-2xl border border-amber-500/30">
                    <div className="flex justify-between items-center border-b border-stone-800 pb-1">
                      <span className="text-xs font-heritage font-bold text-amber-300">{result.card?.name}</span>
                      <span className="text-[9px] text-amber-400 font-bold">{result.card?.element}</span>
                    </div>
                    <div className="text-[9px] text-stone-300 space-y-0.5">
                      <div><strong className="text-amber-400">Arketipe:</strong> {result.card?.archetype}</div>
                      <div><strong className="text-amber-400">Simbol Utama:</strong> {result.card?.symbol}</div>
                      <div><strong className="text-amber-400">Keberuntungan:</strong> {result.card?.luckySymbol.symbol} ({result.card?.luckySymbol.color}, #{result.card?.luckySymbol.number})</div>
                      <div><strong className="text-amber-400">Kata Kunci:</strong> {result.card?.luckySymbol.keywords.join(' • ')}</div>
                    </div>
                  </div>

                  {/* Inscription & Footer */}
                  <div className="relative z-10 space-y-1">
                    <div className="p-1.5 bg-stone-950/80 rounded-xl border border-amber-500/30 text-[8px] text-stone-200 font-mono italic">
                      "{result.card?.defaultMessage || 'Jalan anu kabuka henteu salawasna jalan anu panggancangna.'}"
                    </div>
                    <div className="text-[7px] text-amber-400 uppercase tracking-widest font-bold">
                      Subjek: {result.gender} • Neptu {result.totalNeptu} ({result.javaneseDate})
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      const shareText = `[KARTU WASKITA #${result.card?.number}: ${result.card?.name}]\nArketipe: ${result.card?.archetype}\nSimbol Utama: ${result.card?.symbol}\nUnsur: ${result.card?.element}\n\nSimbol Keberuntungan:\n- Simbol: ${result.card?.luckySymbol.symbol}\n- Unsur: ${result.card?.luckySymbol.element}\n- Warna: ${result.card?.luckySymbol.color}\n- Angka: ${result.card?.luckySymbol.number}\n- Kata Kunci: ${result.card?.luckySymbol.keywords.join(' • ')}\n\nPesan Waskita:\n"${result.card?.defaultMessage}"\n\nSubjek: Weton ${result.javaneseDate} (Neptu ${result.totalNeptu})\n\n-- Galura Lugay Kancana • Waskita Pasundan --`;
                      navigator.clipboard.writeText(shareText);
                      alert("Semua keterangan Kartu Waskita berhasil disalin untuk dibagikan!");
                    }}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs"
                  >
                    Salin Semua Keterangan Kartu Waskita
                  </button>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-2xl transition-all text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorView;
