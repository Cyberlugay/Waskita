
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, Home, SwitchCamera, RefreshCw, Hand } from 'lucide-react';
import { analyzePalmistry } from '../services/gemini.ts';
import { generateSundaneseMysticalVisual } from '../services/nanoBananaImage.ts';
import ShareResult from '../components/ShareResult.tsx';
import { AppView } from '../types.ts';

const PalmistryView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    try {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera Error:", err);
      // Fallback if 'environment' not available
      if (mode === 'environment') return startCamera('user');
      setIsCameraActive(false);
      alert("Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (isCameraActive) {
      stopCamera();
      await startCamera(newMode);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setAnalysis('');
    setAiImageUrl(null);
    setImageLoading(true);
    
    try {
      const base64Data = image.split(',')[1];
      const [result, imageUrl] = await Promise.all([
        analyzePalmistry(base64Data),
        generateSundaneseMysticalVisual("Analisis Rajah Leungeun", "Garis tangan takdir dan raksa batin manusia")
      ]);
      setAnalysis(result);
      setAiImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setAnalysis("Maaf, waskita batin sedang terhalang kabut ghaib. Sila coba kembali beberapa saat lagi.");
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 px-0 md:px-6 pt-8 bg-stone-50 min-h-screen text-stone-900">
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to bottom, transparent, #d97706, transparent);
          box-shadow: 0 0 15px 2px rgba(217, 119, 6, 0.4);
          animation: scan 3s ease-in-out infinite;
          z-index: 25;
        }
      `}</style>
      
      <header className="space-y-4 px-4">
        <button 
          onClick={() => { stopCamera(); onNavigate(AppView.HOME); }}
          className="flex items-center gap-2 text-stone-500 hover:text-emerald-800 transition-colors mb-6 group"
        >
          <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
            <Home size={18} />
          </div>
          <span className="font-bold uppercase tracking-widest text-[10px]">Beranda</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white border border-stone-200 rounded-2xl text-emerald-800 shadow-sm">
            <Hand size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-heritage font-bold text-stone-900 tracking-tight uppercase">Rajah Leungeun</h2>
            <p className="text-stone-500 uppercase text-[10px] tracking-[0.3em] font-black mt-1">Nyungsi Karsa Batin Melalui Garis Tangan.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-0">
        <div className="xl:col-span-4 space-y-8 px-4">
          <div 
            className={`
              aspect-[3/4] rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative bg-white/50 backdrop-blur-md
              ${image || isCameraActive ? 'border-emerald-600/30' : 'border-stone-200'}
            `}
          >
            {loading && <div className="scan-line" />}
            
            {!image && !isCameraActive && (
              <div className="text-center p-8 md:p-12 space-y-6">
                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-600 mx-auto shadow-inner border border-stone-200">
                  <Camera size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-stone-900 font-bold uppercase tracking-widest text-xs">Pindai Telapak Tangan</p>
                  <p className="text-stone-600 text-xs italic">Arahkan pada cahaya yang benderang agar rajah terlihat nyata.</p>
                </div>
                <div className="flex gap-4 w-full max-w-xs mx-auto">
                  <button onClick={() => startCamera()} className="flex-1 py-4 bg-emerald-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">KAMERA</button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-white border border-stone-200 rounded-xl text-stone-900 text-[10px] font-black uppercase">UNGGAH</button>
                </div>
              </div>
            )}

            {isCameraActive && (
              <div className="absolute inset-0">
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                {/* Guide Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] h-[60%] border-4 border-emerald-600/50 rounded-3xl flex items-center justify-center">
                    <span className="text-emerald-600/50 font-bold uppercase tracking-widest text-xs">Posisi Tangan</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 z-20">
                  <button onClick={toggleCamera} className="p-4 bg-white/80 backdrop-blur rounded-full text-stone-900 border border-stone-200 transition-all hover:bg-white"><SwitchCamera size={24} /></button>
                  <button onClick={capturePhoto} className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 border-4 border-white"><Camera size={28} /></button>
                  <button onClick={stopCamera} className="p-4 bg-white/80 backdrop-blur rounded-full text-stone-900 border border-stone-200 transition-all hover:bg-rose-100"><RefreshCw size={24} /></button>
                </div>
              </div>
            )}

            {image && (
              <div className="absolute inset-0 group">
                <img src={image} alt="Palm" className="w-full h-full object-cover" />
                <button onClick={() => { setImage(null); setAnalysis(''); startCamera(); }} className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur rounded-full text-stone-900 shadow-sm opacity-0 group-hover:opacity-100"><RefreshCw size={20} /></button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="flex gap-4">
            <button onClick={() => { setImage(null); setAnalysis(''); stopCamera(); }} className="flex-1 py-4 border border-stone-200 bg-white rounded-2xl text-stone-600 font-bold hover:text-stone-900 transition-all uppercase tracking-widest text-[10px]">RESET</button>
            <button onClick={handleAnalyze} disabled={!image || loading} className="flex-[2] py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-widest text-[10px]">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="text-white" />} {loading ? 'NYUNGSI...' : 'BEDAH RAJAH'}
            </button>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6 px-0">
          <div className="p-0 md:p-12 glass-panel md:rounded-[60px] border-y md:border border-[var(--border-color)] bg-[var(--bg-card)] h-full min-h-[500px] flex flex-col shadow-sm relative">
            <div className="flex items-center gap-2 text-[var(--pasundan-green)] mb-8 border-b border-[var(--border-color)] pb-6 pt-8 px-6 md:pt-0 md:px-0 relative z-10">
              <Sparkles size={24} className="animate-pulse" />
              <h3 className="font-heritage text-2xl md:text-3xl font-bold uppercase tracking-wider">Risalah Waskita</h3>
            </div>
            
            <div className="flex-1 overflow-visible relative z-10 w-full">
              {!analysis && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4 opacity-40 italic py-20">
                  <Hand size={48} className="animate-bounce" />
                  <p className="font-heritage text-lg text-center">Menanti pantulan rajah dari telaga batin...</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                  <Loader2 className="animate-spin text-[var(--pasundan-green)]" size={40} />
                  <p className="text-[var(--pasundan-green)] font-heritage italic text-xl animate-pulse text-center">Menyingkap suratan batin...</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-12 animate-in fade-in duration-1000 w-full">
                  {/* 9:16 AI Mystical Illustration */}
                  <div className="max-w-md mx-auto aspect-[9/16] rounded-[40px] overflow-hidden border border-amber-500/30 bg-stone-950 shadow-2xl relative flex flex-col items-center justify-center">
                    {imageLoading ? (
                      <div className="flex flex-col items-center gap-4 text-amber-500 p-8 text-center">
                        <Loader2 className="animate-spin" size={48} />
                        <p className="font-heritage italic text-lg animate-pulse">Menenun visual kosmik Rajah Leungeun (Nano Banana)...</p>
                      </div>
                    ) : aiImageUrl ? (
                      <img src={aiImageUrl} alt="Ilustrasi Rajah Kosmik" className="w-full h-full object-cover brightness-90" />
                    ) : (
                      <div className="text-stone-500 font-heritage italic text-sm">Visual kosmik tidak tersedia</div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6 text-center z-20 bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30">
                      <h4 className="text-xl font-heritage font-bold text-amber-400">Ilustrasi Rajah Leungeun</h4>
                      <p className="text-[10px] text-stone-300 uppercase tracking-widest mt-1">Kosmologi & Raksa Batin Pasundan</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="text-[var(--text-primary)] text-lg md:text-4xl leading-relaxed italic text-justify whitespace-pre-wrap font-medium p-5 md:p-20 bg-[var(--bg-secondary)] md:rounded-[40px] border-y md:border border-[var(--border-color)] shadow-sm w-full">
                    {analysis}
                  </div>
                  <div className="px-6 md:px-0 pb-10">
                    <ShareResult title="Risalah Rajah Lengeun Waskita" text={analysis} generatedImageUrl={aiImageUrl || undefined} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalmistryView;
