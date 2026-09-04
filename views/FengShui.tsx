
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Camera, Upload, Loader2, Sparkles, RefreshCw, Layout, Home as HomeIcon, Store, Info, Zap, Eye, EyeOff, Wind, HelpCircle, X, ArrowUpRight, SwitchCamera, Home } from 'lucide-react';
import { analyzeFengShui } from '../services/gemini.ts';
import ShareResult from '../components/ShareResult.tsx';
import { AppView } from '../types.ts';

interface FengShuiZone {
  box_2d: number[];
  label: string;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
}

const FengShuiView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [zones, setZones] = useState<FengShuiZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<FengShuiZone | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [showQiFlow, setShowQiFlow] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { setIsCameraActive(false); alert("Gagal kamera."); }
  };

  const stopCamera = () => { if (videoRef.current?.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); videoRef.current.srcObject = null; } setIsCameraActive(false); };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth; canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0); setImage(canvasRef.current.toDataURL('image/jpeg')); stopCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!image) return; setLoading(true); setAnalysisText(''); setZones([]); setSelectedZone(null);
    try {
      const res = await analyzeFengShui(image.split(',')[1]);
      setAnalysisText(res.analysisText); setZones(res.zones || []);
    } catch (err) { alert("Gagal."); } finally { setLoading(false); }
  };

  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-0 md:px-10 pt-8 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <header className="px-4">
        <button onClick={() => onNavigate(AppView.HOME)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--pasundan-green)] transition-colors mb-6 group">
          <div className="p-2 rounded-full group-hover:bg-[var(--pasundan-green-light)] transition-colors"><Home size={18} /></div>
          <span className="font-bold uppercase tracking-widest text-[10px]">Beranda</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--pasundan-green)] shadow-sm"><Layout size={32} /></div>
          <div>
            <h2 className="text-3xl md:text-5xl font-heritage font-bold text-[var(--text-primary)] tracking-tight uppercase">Tata Ruang</h2>
            <p className="text-[var(--text-secondary)] uppercase text-[10px] tracking-[0.4em] font-black mt-1">Harmonisasi Energi Bangunan</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 md:px-0">
        <div className="space-y-8">
          <div className="aspect-[3/4] bg-[var(--bg-card)] rounded-[40px] border-2 border-dashed border-[var(--border-color)] overflow-hidden relative shadow-sm backdrop-blur-md group">
            {!image && !isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-8">
                <Layout size={80} className="text-[var(--border-color)]" />
                <div className="space-y-2"><p className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs">Pindai Lokasi</p><p className="text-[var(--text-muted)] text-xs italic">Ambil foto ruangan atau denah.</p></div>
                <div className="flex gap-4 w-full max-w-xs"><button onClick={() => startCamera()} className="flex-1 py-4 bg-[var(--pasundan-green)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">KAMERA</button><button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-[var(--bg-surface-soft)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] text-[10px] font-black shadow-sm uppercase tracking-widest">UNGGAH</button></div>
              </div>
            )}
            {isCameraActive && (
              <div className="absolute inset-0">
                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover grayscale brightness-50`} />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 z-20">
                  <button onClick={capturePhoto} className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-stone-950 shadow-lg active:scale-90 transition-transform"><Camera size={28} /></button>
                  <button onClick={stopCamera} className="p-4 bg-[var(--bg-secondary)]/40 backdrop-blur rounded-full text-[var(--text-secondary)] border border-[var(--border-color)] transition-all hover:bg-[var(--bg-soft)]"><RefreshCw size={24} /></button>
                </div>
              </div>
            )}
            {image && (
              <div className="absolute inset-0">
                <img src={image} alt="Location" className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'blur-md grayscale opacity-30' : 'grayscale opacity-40'}`} />
                {zones.map((zone, idx) => {
                  const [ymin, xmin, ymax, xmax] = zone.box_2d;
                  return (
                    <div key={idx} onClick={() => setSelectedZone(zone)} className={`absolute border-2 transition-all ${zone.type === 'positive' ? 'border-[var(--pasundan-green)] bg-[var(--pasundan-green)]/10' : 'border-rose-500 bg-rose-500/10'}`} style={{ top: `${ymin/10}%`, left: `${xmin/10}%`, height: `${(ymax-ymin)/10}%`, width: `${(xmax-xmin)/10}%` }} />
                  );
                })}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); stopCamera(); } }} />
          </div>
          <button onClick={handleAnalyze} disabled={!image || loading} className="w-full py-6 bg-[var(--bg-card)] hover:bg-[var(--bg-soft)] text-[var(--text-primary)] border border-[var(--border-color)] font-black rounded-2xl shadow-sm uppercase tracking-widest text-[11px]">{loading ? <Loader2 className="animate-spin mx-auto" /> : "SINGKAP TATA RUANG"}</button>
        </div>

        <div className="space-y-6 pb-10">
          <div className="p-6 md:p-12 glass-panel md:rounded-[60px] border border-[var(--border-color)] bg-[var(--bg-card)] h-full min-h-[500px] flex flex-col shadow-sm relative">
            <div className="flex items-center gap-4 text-[var(--pasundan-green)] mb-8 border-b border-[var(--border-color)] pb-6">
               <Sparkles size={28} className="animate-pulse" /><h3 className="font-heritage text-2xl md:text-5xl font-bold uppercase tracking-wider">Risalah Ruang</h3>
            </div>
            <div className="flex-1 w-full">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                  <Loader2 className="animate-spin text-[var(--pasundan-green)]" size={48} /><p className="text-[var(--pasundan-green)] font-heritage italic text-2xl animate-pulse">Memetakan aliran prana...</p>
                </div>
              ) : selectedZone ? (
                <div className="animate-in fade-in duration-300 space-y-8">
                   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedZone.type === 'positive' ? 'bg-[var(--pasundan-green-light)] text-[var(--pasundan-green)] border border-[var(--pasundan-green)]' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>{selectedZone.label}</span>
                   <p className="text-[var(--text-primary)] text-lg md:text-3xl italic leading-relaxed text-justify font-medium">{selectedZone.description}</p>
                   <button onClick={() => setSelectedZone(null)} className="text-[var(--pasundan-green)] hover:text-[var(--pasundan-green-dark)] font-black text-[10px] uppercase tracking-widest">Lihat Semua</button>
                </div>
              ) : analysisText ? (
                <div className="space-y-12 animate-in fade-in duration-1000">
                  <div className="text-[var(--text-primary)] text-lg md:text-4xl italic leading-relaxed text-justify font-medium whitespace-pre-wrap bg-[var(--bg-secondary)] p-6 md:p-20 md:rounded-[40px] border-y md:border border-[var(--border-color)] shadow-inner">{analysisText}</div>
                  <ShareResult title="Risalah Tata Ruang" text={analysisText} />
                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-6 opacity-30 py-20"><Wind size={80} /><p className="font-heritage text-2xl italic text-center">Menanti pemetaan dimensi...</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FengShuiView;
