
import React, { useState } from 'react';
import { Moon, Sparkles, Loader2, Send, Info, Star, CloudMoon, Home } from 'lucide-react';
import { getDreamInterpretation } from '../services/gemini.ts';
import ShareResult from '../components/ShareResult.tsx';
import { AppView } from '../types.ts';

const DreamInterpretationView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (!dreamText.trim()) return;
    setLoading(true);
    setInterpretation('');
    
    const result = await getDreamInterpretation(dreamText);
    setInterpretation(result);
    setLoading(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-4 md:px-10 pt-8 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <header className="space-y-4">
        <button 
          onClick={() => onNavigate(AppView.HOME)}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--pasundan-green)] transition-colors mb-6 group"
        >
          <div className="p-2 rounded-full group-hover:bg-[var(--pasundan-green-light)] transition-colors">
            <Home size={18} />
          </div>
          <span className="font-bold uppercase tracking-widest text-[10px]">Beranda</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--pasundan-green)] shadow-sm">
            <Moon size={32} />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-heritage font-bold text-[var(--text-primary)] tracking-tight uppercase">Tafsir Mimpi</h2>
            <p className="text-[var(--text-secondary)] uppercase text-[10px] tracking-[0.3em] font-black mt-1">Membuka Tabir Alam Bawah Sadar</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <div className="space-y-6">
          <div className="p-6 md:p-8 bg-[var(--bg-card)] rounded-[32px] md:rounded-[40px] border border-[var(--border-color)] space-y-6 relative overflow-hidden group shadow-sm">
            <label className="block text-[10px] font-black text-[var(--pasundan-green)] uppercase tracking-widest flex items-center gap-2">
              <Star size={12} className="animate-pulse" /> Deskripsi Mimpi
            </label>
            
            <textarea 
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Ceritakan mimpi Anda... (misal: melihat macan putih)"
              className="w-full h-48 md:h-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 text-[var(--text-primary)] focus:outline-none focus:border-[var(--pasundan-green)] transition-all resize-none italic placeholder:text-[var(--text-muted)] leading-relaxed text-sm md:text-base shadow-inner"
            />
            
            <button 
              onClick={handleInterpret}
              disabled={loading || !dreamText.trim()}
              className="w-full py-5 bg-[var(--pasundan-green)] hover:bg-[var(--pasundan-green-dark)] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm uppercase tracking-widest text-[10px]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              SINGKAP MAKNA
            </button>
          </div>

          <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl flex gap-4 shadow-sm">
            <Info className="text-[var(--pasundan-green)] shrink-0" size={20} />
            <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
              "Mimpi dudu mung kembang turu, nanging pralampita kang nyata." 
              <span className="block mt-1 text-[var(--text-muted)]">(Mimpi bukan sekadar bunga tidur, melainkan pertanda nyata.)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 md:p-12 glass-panel rounded-[32px] md:rounded-[40px] border border-[var(--border-color)] bg-[var(--bg-card)] h-full min-h-[400px] md:min-h-[500px] relative overflow-hidden flex flex-col shadow-sm">
            <div className="flex items-center gap-3 text-[var(--pasundan-green)] mb-8 border-b border-[var(--border-color)] pb-6">
              <Sparkles size={24} className="animate-pulse" />
              <h3 className="font-heritage text-xl md:text-2xl font-bold uppercase tracking-wider">Tafsir Waskita</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {!interpretation && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-6 opacity-30 italic py-20">
                  <CloudMoon size={80} />
                  <p className="text-center font-heritage text-xl">Menanti bayangan dari alam mimpi...</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                  <Loader2 className="animate-spin text-[var(--pasundan-green)]" size={40} />
                  <p className="text-[var(--pasundan-green)] font-heritage italic text-xl animate-pulse text-center">Menghubungkan sanubari...</p>
                </div>
              )}

              {interpretation && (
                <div className="space-y-10 animate-in fade-in duration-1000">
                  <div className="text-stone-100 leading-relaxed whitespace-pre-wrap italic text-justify text-lg md:text-3xl font-medium">
                    {interpretation}
                  </div>
                  <ShareResult 
                    title="Tafsir Mimpi Nusantara" 
                    text={interpretation} 
                    context={`Mimpi: ${dreamText.slice(0, 50)}...`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamInterpretationView;
