
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Radio, Sparkles, Loader2, Skull, ShieldAlert, Zap, Flame, Ghost, SwitchCamera, Home, Volume2, Waves, Activity, RotateCcw, Download, Mic, Power, Info, MapPin, Globe, History, Book, PowerOff, Target, Scan, Hexagon, CircleDashed, Eye, EyeOff, Moon, Sun, Layers, Contrast, Maximize2, Minimize2, Disc, Play, Square, Pause } from 'lucide-react';
import { analyzePortalEnergy, visualizePortalEntity, generateBalaRitual, generateRajahVisual, communicateWithEntity, getLocationChronicle } from '../services/gemini.ts';
import ShareResult from '../components/ShareResult.tsx';
import { AppView } from '../types.ts';

type CameraFilter = 'normal' | 'negative' | 'wulung' | 'infrared' | 'nightvision';

interface EnergyNode {
  x: number;
  y: number;
  intensity: number;
  phase: number;
}

const GhostPortalView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [manifestation, setManifestation] = useState<string | null>(null);
  const [rajahVisual, setRajahVisual] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [protection, setProtection] = useState('');
  const [activeFilter, setActiveFilter] = useState<CameraFilter>('normal');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [emfLevel, setEmfLevel] = useState(1.2);
  const [locationType, setLocationType] = useState('Tempat Angker');
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [peakFreq, setPeakFreq] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'entity', text: string }[]>([]);
  const [isCommunicating, setIsCommunicating] = useState(false);
  const [radioPower, setRadioPower] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // EVP Recording States
  const [isRecordingEVP, setIsRecordingEVP] = useState(false);
  const [evpAudioUrl, setEvpAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlayingEVP, setIsPlayingEVP] = useState(false);
  
  const [slsActive, setSlsActive] = useState(false);
  const [skeletonNodes, setSkeletonNodes] = useState<{x: number, y: number}[]>([]);
  const [energyGrid, setEnergyGrid] = useState<EnergyNode[]>([]);
  const [orbs, setOrbs] = useState<{id: number, x: number, y: number, size: number, vx: number, vy: number, opacity: number}[]>([]);
  const [radioFreq, setRadioFreq] = useState(76.0);
  const [signalStrength, setSignalStrength] = useState(0);
  const [tempCelsius, setTempCelsius] = useState(24.5);
  const [isColdSpot, setIsColdSpot] = useState(false);

  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = useState('Area Terdeteksi');
  const [chronicle, setChronicle] = useState('');
  const [loadingChronicle, setLoadingChronicle] = useState(false);
  const [loadingProtection, setLoadingProtection] = useState(false);
  const [spectralMorph, setSpectralMorph] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const radioWaveCanvasRef = useRef<HTMLCanvasElement>(null);
  const waterfallCanvasRef = useRef<HTMLCanvasElement>(null);
  const portalContainerRef = useRef<HTMLDivElement>(null);
  
  // Audio Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const evpAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const filterStyles: Record<CameraFilter, string> = {
    normal: '',
    negative: 'invert(1) contrast(1.2)',
    wulung: 'grayscale(1) contrast(1.4) brightness(0.9)',
    infrared: 'sepia(1) hue-rotate(280deg) saturate(4) brightness(0.7) contrast(1.3)',
    nightvision: 'sepia(1) hue-rotate(70deg) saturate(2.5) brightness(1.3) contrast(1.1) opacity(0.9)'
  };

  const getEmfColor = (level: number) => {
    if (level < 3) return '#10b981';
    if (level < 7) return '#f59e0b';
    return '#ef4444';
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      stopAudioEngine();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!portalContainerRef.current) return;
    if (!document.fullscreenElement) {
      portalContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const updateSpectralMorph = useCallback(() => {
    if (!slsActive) {
      setSpectralMorph('');
      return;
    }
    const center = skeletonNodes[0] || { x: 50, y: 50 };
    const points = 8;
    const radius = 15 + Math.random() * 10 * (emfLevel / 5);
    let d = `M ${center.x + radius},${center.y} `;
    for (let i = 1; i <= points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const r = radius + (Math.random() - 0.5) * 10;
      const x = center.x + r * Math.cos(angle);
      const y = center.y + r * Math.sin(angle);
      d += `L ${x},${y} `;
    }
    d += 'Z';
    setSpectralMorph(d);
  }, [slsActive, skeletonNodes, emfLevel]);

  const updateEnergyGrid = useCallback(() => {
    const grid: EnergyNode[] = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const baseIntensity = (Math.random() * 0.3) + (emfLevel / 15);
        grid.push({
          x: i * 20,
          y: j * 20,
          intensity: Math.min(1, baseIntensity),
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    setEnergyGrid(grid);
  }, [emfLevel]);

  const updateSLS = useCallback(() => {
    const threshold = 0.92 - (emfLevel / 40);
    if (Math.random() > threshold) {
      setSlsActive(true);
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;
      setSkeletonNodes([
        { x: centerX, y: centerY },
        { x: centerX, y: centerY + 15 },
        { x: centerX - 10, y: centerY + 10 },
        { x: centerX + 10, y: centerY + 10 },
        { x: centerX - 8, y: centerY + 30 },
        { x: centerX + 8, y: centerY + 30 }
      ]);
      setIsColdSpot(true);
    } else {
      setSlsActive(false);
      setIsColdSpot(false);
    }
  }, [emfLevel]);

  const updateOrbs = useCallback(() => {
    const speedFactor = 0.2 + (emfLevel / 10);
    const spawnRate = 0.9 + (emfLevel / 100);

    setOrbs(prev => {
      const moved = prev.map(o => ({
        ...o,
        x: o.x + o.vx * speedFactor,
        y: o.y + o.vy * speedFactor,
        opacity: o.opacity - 0.005
      })).filter(o => o.opacity > 0 && o.x > -5 && o.x < 105 && o.y > -5 && o.y < 105);

      if (Math.random() < spawnRate && moved.length < 15) {
        return [...moved, {
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 1 + Math.random() * (2 + emfLevel / 2),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          opacity: 0.4 + (emfLevel / 20)
        }];
      }
      return moved;
    });
  }, [emfLevel]);

  const startAudioEngine = async () => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      
      if (streamRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const renderLoop = () => {
        if (!analyserRef.current) return;
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        let maxVal = 0;
        let peakIdx = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
          if (dataArray[i] > maxVal) {
            maxVal = dataArray[i];
            peakIdx = i;
          }
        }
        const avg = sum / bufferLength;
        setResonanceLevel(avg / 2);
        setPeakFreq(peakIdx * (audioCtxRef.current?.sampleRate || 44100) / (bufferLength * 2));

        if (visualizerCanvasRef.current) {
          const canvas = visualizerCanvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height;
              const hue = (i / bufferLength) * 160 + 20; 
              ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.7)`;
              ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
            }
          }
        }

        if (radioWaveCanvasRef.current && radioPower) {
          const canvas = radioWaveCanvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = (isListening || isRecordingEVP) ? '#ef4444' : '#fbbf24';
            ctx.beginPath();
            const sliceWidth = canvas.width / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
              const v = dataArray[i] / 128.0;
              const y = (v * canvas.height) / 3 + (canvas.height / 3);
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
              x += sliceWidth;
            }
            ctx.stroke();
          }
        }

        if (waterfallCanvasRef.current && radioPower) {
          const canvas = waterfallCanvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             const tempImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
             ctx.putImageData(tempImg, 0, 1);
             for (let i = 0; i < bufferLength; i++) {
               const val = dataArray[i];
               ctx.fillStyle = val > 140 ? `rgba(251, 191, 36, ${val/255})` : `rgba(30, 27, 24, ${val/255})`;
               ctx.fillRect((i * canvas.width) / bufferLength, 0, canvas.width / bufferLength, 1);
             }
          }
        }
      };
      renderLoop();
    } catch (err) {
      console.warn("Mikrofon ditolak atau tidak tersedia.");
    }
  };

  const stopAudioEngine = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const startStaticNoise = () => {
    if (!audioCtxRef.current) return;
    const bufferSize = 2 * audioCtxRef.current.sampleRate;
    const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const whiteNoise = audioCtxRef.current.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1;

    const gain = audioCtxRef.current.createGain();
    gain.gain.value = 0.04;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    whiteNoise.start();
    noiseNodeRef.current = whiteNoise;
    filterNodeRef.current = filter;
    gainNodeRef.current = gain;
  };

  const stopStaticNoise = () => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch (e) {}
      noiseNodeRef.current = null;
    }
  };

  const toggleRadioPower = async () => {
    if (!radioPower) {
      if (!audioCtxRef.current) await startAudioEngine();
      startStaticNoise();
      setRadioPower(true);
    } else {
      stopStaticNoise();
      if (isRecordingEVP) handleToggleEVP();
      setRadioPower(false);
    }
  };

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    try {
      setIsCameraActive(true);
      await startAudioEngine(); 
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1440 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { 
      setIsCameraActive(false); 
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEmfLevel(prev => {
        const jitter = (Math.random() - 0.5) * 0.8;
        const next = Math.min(9.9, Math.max(0.1, prev + jitter));
        setSignalStrength(Math.min(100, Math.floor((next / 10) * 100)));
        return next;
      });
      setTempCelsius(prev => prev + (Math.random() - 0.5) * 0.15);
      
      if (radioPower) {
        setRadioFreq(prev => {
          const next = prev + (Math.random() * 0.15);
          return next > 108.0 ? 76.0 : next;
        });
      }
      
      if (isCameraActive) {
        updateEnergyGrid();
        updateSLS();
        updateOrbs();
        updateSpectralMorph();
      }
    }, 150);
    return () => clearInterval(interval);
  }, [isCameraActive, radioPower, updateEnergyGrid, updateSLS, updateOrbs, updateSpectralMorph]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      setImage(canvasRef.current.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const handleRescan = () => {
    setImage(null); setManifestation(null); setRajahVisual(null); setAnalysis(''); setProtection(''); setChatHistory([]);
    setChronicle(''); setLocationName('Area Terdeteksi');
    startCamera();
  };

  const handleSummon = async () => {
    if (!image) return;
    setLoading(true); setAnalysis(''); setProtection(''); setManifestation(null);
    setLoadingChronicle(true);
    try {
      const b64 = image.split(',')[1];
      const res = await analyzePortalEnergy(b64, locationType, resonanceLevel);
      setAnalysis(res);
      
      const visual = await visualizePortalEntity(b64, res);
      setManifestation(visual);

      const detectedLoc = locationType + " " + (coords ? `${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}` : "");
      setLocationName(detectedLoc);

      const coordString = coords ? `${coords.lat}, ${coords.lng}` : "Unknown Coords";
      const chronicRes = await getLocationChronicle(locationType, coordString);
      setChronicle(chronicRes.text);
    } catch (err) { alert("Gerbang tertutup."); } finally { setLoading(false); setLoadingChronicle(false); }
  };

  const handleDownloadManifestation = () => {
    if (!manifestation) return;
    const link = document.createElement('a');
    link.href = manifestation;
    link.download = `Visi_Portal_${locationType.replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
    link.click();
  };

  const handleStartListening = () => {
    if (!radioPower) { alert("Aktifkan Spirit Box terlebih dahulu."); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Browser tidak mendukung pengenalan suara."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const speech = event.results[0][0].transcript;
      setChatHistory(prev => [...prev, { sender: 'user', text: speech }]);
      setIsCommunicating(true);
      try {
        const reply = await communicateWithEntity(analysis || "Spirit", speech);
        setChatHistory(prev => [...prev, { sender: 'entity', text: reply }]);
      } catch (err) { setChatHistory(prev => [...prev, { sender: 'entity', text: "...suara statis..." }]); }
      finally { setIsCommunicating(false); }
    };
    recognition.start();
  };

  const handleToggleEVP = async () => {
    if (isRecordingEVP) {
       mediaRecorderRef.current?.stop();
       setIsRecordingEVP(false);
       if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    } else {
       if (!streamRef.current) await startAudioEngine();
       if (!streamRef.current) return;
       
       const mediaRecorder = new MediaRecorder(streamRef.current);
       audioChunksRef.current = [];
       
       mediaRecorder.ondataavailable = (event) => {
         if (event.data.size > 0) {
           audioChunksRef.current.push(event.data);
         }
       };
       
       mediaRecorder.onstop = () => {
         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
         const audioUrl = URL.createObjectURL(audioBlob);
         setEvpAudioUrl(audioUrl);
       };
       
       mediaRecorder.start();
       setIsRecordingEVP(true);
       setRecordingDuration(0);
       recordingTimerRef.current = window.setInterval(() => {
          setRecordingDuration(prev => prev + 1);
       }, 1000);
       mediaRecorderRef.current = mediaRecorder;
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePlayEVP = () => {
    if (evpAudioRef.current) {
      if (isPlayingEVP) {
        evpAudioRef.current.pause();
        setIsPlayingEVP(false);
      } else {
        evpAudioRef.current.play().catch(e => console.error("Playback failed", e));
        setIsPlayingEVP(true);
      }
    }
  };

  const handleDownloadEVP = () => {
    if (!evpAudioUrl) return;
    const link = document.createElement('a');
    link.href = evpAudioUrl;
    link.download = `EVP_Session_${new Date().getTime()}.webm`;
    link.click();
  };

  const handleProtect = async () => {
    if (!analysis) return;
    setLoadingProtection(true);
    try {
      const prayer = await generateBalaRitual(analysis);
      setProtection(prayer);
      const isim = await generateRajahVisual(prayer);
      setRajahVisual(isim);
    } catch (err) { alert("Gagal meramu batin."); } finally { setLoadingProtection(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 px-0 md:px-6 pt-6 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] overflow-hidden">
      <style>{`
        @keyframes energyPulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        @keyframes spectralMorph {
          0% { filter: blur(4px) brightness(1); opacity: 0.4; }
          50% { filter: blur(8px) brightness(1.5); opacity: 0.8; }
          100% { filter: blur(4px) brightness(1); opacity: 0.4; }
        }
        @keyframes floatSpirit {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .energy-dot {
          animation: energyPulse 2s ease-in-out infinite;
        }
        .spectral-aura {
          animation: spectralMorph 3s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .spirit-path {
          transition: d 1s cubic-bezier(0.4, 0, 0.2, 1);
          animation: floatSpirit 4s ease-in-out infinite;
        }
        .glitch-overlay {
          pointer-events: none;
          mix-blend-mode: color-dodge;
          opacity: ${emfLevel > 7 ? '0.15' : '0.05'};
          background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px);
        }
        .chromatic-aberration {
          filter: ${emfLevel > 8 ? 'contrast(1.2) brightness(1.1) drop-shadow(2px 0px 0px rgba(255,0,0,0.5)) drop-shadow(-2px 0px 0px rgba(0,0,255,0.5))' : 'none'};
        }
        :fullscreen video {
          object-fit: contain !important;
          background: black;
        }
      `}</style>

      <header className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--title-primary)] shadow-sm animate-pulse">
            <Radio size={20} />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-heritage font-bold text-[var(--title-primary)] tracking-tight uppercase leading-none">Portal Ghaib</h2>
            <p className="text-[var(--title-primary)] uppercase text-[8px] md:text-[9px] tracking-[0.3em] font-black mt-1">Multi-Spectral Anomaly Tracker</p>
          </div>
        </div>
        <button onClick={() => onNavigate(AppView.HOME)} className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--title-primary)] hover:bg-[var(--pasundan-green-light)] rounded-xl transition-all">
          <Home size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col items-center gap-4 px-4 md:px-0">
          <div ref={portalContainerRef} className={`relative w-full max-w-[480px] aspect-[3/4] bg-stone-950 rounded-[40px] overflow-hidden border border-stone-800/40 shadow-2xl group ${isFullscreen ? 'max-w-none w-screen h-screen rounded-none border-none' : ''}`}>
             
             <div className="absolute inset-0 z-20 pointer-events-none p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="bg-black/30 p-2.5 rounded-2xl backdrop-blur-md border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[7px] font-black text-amber-500 uppercase tracking-widest">
                        <Scan size={10} /> UNIT-ALPHA::ACTIVE
                      </div>
                      <div className="flex items-center gap-1.5 text-[6px] font-black text-blue-400">
                        <MapPin size={8} /> {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'GPS-SYNC...'}
                        {coords && (
                          <a 
                            href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ml-1 text-blue-500 hover:text-blue-300 pointer-events-auto"
                          >
                            <Globe size={8} />
                          </a>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        <span className={`text-[6px] font-black ${isColdSpot ? 'text-blue-400 animate-pulse' : 'text-stone-500'}`}>TEMP: {tempCelsius.toFixed(1)}°C</span>
                        <span className={`text-[6px] font-black ${slsActive ? 'text-green-500' : 'text-stone-500'}`}>SLS: {slsActive ? 'LOCK' : 'SCN'}</span>
                      </div>
                   </div>
                   
                   <div className="flex flex-col items-end gap-2">
                      <div className="relative w-2 h-20 bg-black/40 border border-white/10 rounded-full overflow-hidden flex flex-col-reverse p-0.5">
                         <div className="w-full transition-all duration-300 rounded-full" style={{ height: `${emfLevel * 10}%`, background: `linear-gradient(to top, #10b981 0%, #f59e0b 50%, #ef4444 100%)` }} />
                      </div>
                      <span className={`text-[9px] font-mono font-bold ${emfLevel > 7 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>{emfLevel.toFixed(1)} mG</span>
                   </div>
                </div>

                {/* LEFT SIDE CAMERA CONTROLS */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col gap-2 p-1.5 rounded-full bg-black/10 backdrop-blur-sm border border-white/5">
                  <button onClick={() => setActiveFilter('nightvision')} className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${activeFilter === 'nightvision' ? 'bg-green-600/70 border-green-400 text-white scale-110 shadow-lg' : 'bg-black/30 border-white/10 text-stone-500 hover:bg-black/50'}`} title="Night Vision"><Moon size={12} /></button>
                  <button onClick={() => setActiveFilter('negative')} className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${activeFilter === 'negative' ? 'bg-orange-600/70 border-orange-400 text-white scale-110 shadow-lg' : 'bg-black/30 border-white/10 text-stone-500 hover:bg-black/50'}`} title="Negative Mode"><Contrast size={12} /></button>
                  <button onClick={() => setActiveFilter('wulung')} className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${activeFilter === 'wulung' ? 'bg-stone-600/70 border-stone-400 text-white scale-110 shadow-lg' : 'bg-black/30 border-white/10 text-stone-500 hover:bg-black/50'}`} title="Wulung (B&W)"><Layers size={12} /></button>
                  <button onClick={() => setActiveFilter('normal')} className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${activeFilter === 'normal' ? 'bg-blue-600/70 border-blue-400 text-white scale-110 shadow-lg' : 'bg-black/30 border-white/10 text-stone-500 hover:bg-black/50'}`} title="Normal Spectral"><Sun size={12} /></button>
                  <button onClick={toggleFullscreen} className={`p-1.5 rounded-full backdrop-blur-md border transition-all bg-black/30 border-white/10 text-stone-500 hover:bg-amber-600/50 hover:text-white mt-1`} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>{isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}</button>
                </div>

                {isCameraActive && !manifestation && (
                  <div className="absolute inset-0 pointer-events-none">
                    {slsActive && (
                      <svg className="absolute inset-0 w-full h-full spectral-aura" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <radialGradient id="spectralGradient">
                            <stop offset="0%" stopColor={getEmfColor(emfLevel)} stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                          </radialGradient>
                          <filter id="spectralGlow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <path d={spectralMorph} fill="url(#spectralGradient)" className="spirit-path" filter="url(#spectralGlow)" />
                      </svg>
                    )}

                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-40">
                      {energyGrid.map((node, i) => (
                        <div key={i} className="border border-white/5 flex items-center justify-center relative">
                          <div className="energy-dot rounded-full transition-all duration-500" style={{ width: `${node.intensity * 24}px`, height: `${node.intensity * 24}px`, backgroundColor: getEmfColor(emfLevel), boxShadow: `0 0 ${node.intensity * 15}px ${getEmfColor(emfLevel)}`, opacity: node.intensity }} />
                        </div>
                      ))}
                    </div>

                    {orbs.map(orb => (
                       <div key={orb.id} className="absolute rounded-full blur-[2px] transition-opacity" style={{ left: `${orb.x}%`, top: `${orb.y}%`, width: `${orb.size}px`, height: `${orb.size}px`, backgroundColor: getEmfColor(emfLevel), boxShadow: `0 0 ${orb.size * 2}px ${getEmfColor(emfLevel)}`, opacity: orb.opacity }} />
                    ))}
                  </div>
                )}

                <div className="absolute inset-0 glitch-overlay z-15" />

                {isCameraActive && slsActive && (
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-60">
                    <svg className="w-full h-full">
                      <g className="animate-pulse">
                        {skeletonNodes.map((node, i) => <circle key={i} cx={`${node.x}%`} cy={`${node.y}%`} r="3" fill="#22c55e" />)}
                        <line x1={`${skeletonNodes[0]?.x}%`} y1={`${skeletonNodes[0]?.y}%`} x2={`${skeletonNodes[1]?.x}%`} y2={`${skeletonNodes[1]?.y}%`} stroke="#22c55e" strokeWidth="1.5" />
                        <line x1={`${skeletonNodes[1]?.x}%`} y1={`${skeletonNodes[1]?.y}%`} x2={`${skeletonNodes[2]?.x}%`} y2={`${skeletonNodes[2]?.y}%`} stroke="#22c55e" strokeWidth="1.5" />
                        <line x1={`${skeletonNodes[1]?.x}%`} y1={`${skeletonNodes[1]?.y}%`} x2={`${skeletonNodes[3]?.x}%`} y2={`${skeletonNodes[3]?.y}%`} stroke="#22c55e" strokeWidth="1.5" />
                        <line x1={`${skeletonNodes[1]?.x}%`} y1={`${skeletonNodes[1]?.y}%`} x2={`${skeletonNodes[4]?.x}%`} y2={`${skeletonNodes[4]?.y}%`} stroke="#22c55e" strokeWidth="1.5" />
                        <line x1={`${skeletonNodes[1]?.x}%`} y1={`${skeletonNodes[1]?.y}%`} x2={`${skeletonNodes[5]?.x}%`} y2={`${skeletonNodes[5]?.y}%`} stroke="#22c55e" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>
                )}

                <div className="mt-auto flex justify-center items-center gap-5 py-2 pointer-events-auto">
                   {isCameraActive && (
                     <>
                        <button onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')} className="p-2.5 bg-black/40 backdrop-blur rounded-full text-stone-400 border border-white/5 active:scale-90"><SwitchCamera size={14} /></button>
                        <button onClick={capturePhoto} className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-stone-950 shadow-xl active:scale-90 transition-all border-4 border-black/40"><Camera size={22} /></button>
                        <button onClick={stopCamera} className="p-2.5 bg-black/40 backdrop-blur rounded-full text-stone-400 border border-white/5 active:scale-90"><RefreshCw size={14} /></button>
                     </>
                   )}
                </div>
             </div>

             <div className="absolute inset-0 z-10 chromatic-aberration">
                {!image && !isCameraActive && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 bg-stone-900/95">
                    <Ghost size={40} className="text-stone-800 animate-bounce" />
                    <button onClick={() => startCamera()} className="px-10 py-4 bg-amber-600 text-stone-950 font-black rounded-full shadow-2xl active:scale-95 transition-all text-[9px] uppercase tracking-widest">AKTIFKAN SISTEM ALPHA</button>
                  </div>
                )}
                {isCameraActive && (
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transition-all" style={{ filter: filterStyles[activeFilter] }} />
                )}
                {image && (
                   <div className="relative h-full overflow-hidden animate-in zoom-in duration-300">
                      <img src={manifestation || image} className={`w-full h-full object-cover transition-all duration-1000 ${manifestation ? 'scale-105 saturate-150 contrast-125' : filterStyles[activeFilter]}`} alt="Portal" />
                      <div className="absolute top-6 right-6 z-30 flex gap-2">
                        {manifestation && <button onClick={handleDownloadManifestation} className="p-3 bg-amber-600 rounded-full text-stone-950 border border-amber-400 shadow-xl active:scale-90 transition-all"><Download size={18} /></button>}
                        <button onClick={handleRescan} className="p-3 bg-black/60 rounded-full text-white border border-white/5 active:scale-90"><RotateCcw size={18} /></button>
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div className="w-full max-w-[480px] bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] p-5 space-y-4 shadow-sm">
             <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--title-primary)] animate-pulse" />
                      <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest">LIVE SPECTRAL PEAK ANALYSIS</span>
                   </div>
                   <div className="flex gap-3">
                      <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase tracking-tight">PEAK: {peakFreq.toFixed(0)} Hz</span>
                      <span className={`text-[10px] font-mono font-bold ${resonanceLevel > 15 ? 'text-red-600 animate-pulse' : 'text-[var(--title-primary)]'}`}>{resonanceLevel.toFixed(1)} AVG</span>
                   </div>
                </div>
                <div className="h-10 w-full bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-inner">
                   <canvas ref={visualizerCanvasRef} width="400" height="40" className="w-full h-full opacity-90" />
                </div>
             </div>

             <div className="flex gap-2 relative z-10">
                <div className="flex-[1.2] relative">
                   <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 text-[9px] font-bold text-[var(--text-primary)] outline-none focus:border-[var(--title-primary)] appearance-none cursor-pointer">
                      <option>Tempat Angker</option>
                      <option>Gedung Bangunan</option>
                      <option>Tempat Usaha</option>
                      <option>Tempat Umum</option>
                      <option>Rumah</option>
                      <option>Ruang Kamar</option>
                      <option>Hutan</option>
                      <option>Lapangan</option>
                      <option>Situs Kuno</option>
                      <option>Lain-lain</option>
                   </select>
                   <Target size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                </div>
                
                <button onClick={handleSummon} disabled={!image || loading} className="flex-[2] py-4 bg-[var(--title-primary)] hover:bg-[var(--title-dark)] text-white font-black rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-[9px] uppercase tracking-widest overflow-hidden group">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="text-white group-hover:scale-125 transition-transform" />} 
                  <span>{loading ? 'ANALISIS...' : 'SINGKAP VISI'}</span>
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 pb-10 flex flex-col h-full">
          <div className="glass-panel rounded-[40px] border border-[var(--border-color)] bg-[var(--bg-card)] min-h-[500px] flex flex-col shadow-sm relative overflow-hidden flex-1">
             
             <div className="flex items-center justify-between border-b border-[var(--border-color)] p-7 relative z-20">
                <div className="flex items-center gap-3 text-[var(--title-primary)]">
                   <Radio size={22} className={radioPower ? "animate-pulse" : "opacity-40"} />
                   <h3 className="font-heritage text-lg font-bold uppercase tracking-wider leading-none">Waskita Intel</h3>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={toggleRadioPower} className={`p-2.5 rounded-xl transition-all border ${radioPower ? 'bg-[var(--title-primary)] border-[var(--title-primary)] text-white shadow-sm' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                     {radioPower ? <Power size={18} /> : <PowerOff size={18} />}
                   </button>
                </div>
             </div>

             <div className="flex-1 px-6 overflow-y-auto max-h-[1000px] scrollbar-hide space-y-8 pb-10 relative z-20">
                
                {coords && (
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--title-primary)]/10 rounded-lg text-[var(--title-primary)]"><MapPin size={16} /></div>
                      <div>
                        <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest">COORDINATE LOCK</p>
                        <p className="text-[10px] font-mono font-bold text-[var(--title-primary)]">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                      </div>
                    </div>
                    <a href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--title-primary)] transition-all border border-[var(--border-color)]"><Globe size={14} /></a>
                  </div>
                )}

                {(chronicle || loadingChronicle) && (
                  <div className="p-6 bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border-color)] shadow-sm relative overflow-hidden animate-in fade-in duration-700">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--title-primary)]" />
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[9px] font-black text-[var(--title-primary)] uppercase tracking-widest flex items-center gap-2"><History size={14} /> KRONIK LOKASI: {locationName}</h4>
                      {loadingChronicle && <Loader2 size={12} className="animate-spin text-[var(--title-primary)]" />}
                    </div>
                    {loadingChronicle ? (
                      <div className="space-y-2 py-4">
                        <div className="h-2 w-full bg-[var(--border-color)] rounded-full animate-pulse" />
                        <div className="h-2 w-3/4 bg-[var(--border-color)] rounded-full animate-pulse" />
                        <div className="h-2 w-5/6 bg-[var(--border-color)] rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="text-[var(--text-primary)] text-xs leading-relaxed italic text-justify whitespace-pre-wrap font-medium">{chronicle}</div>
                    )}
                  </div>
                )}

                {loading && (
                   <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in fade-in">
                      <div className="relative">
                         <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[var(--title-primary)] rounded-full animate-spin" />
                         <Zap className="absolute inset-0 m-auto text-[var(--title-primary)]" size={24} />
                      </div>
                      <p className="text-[var(--title-primary)] font-heritage italic text-lg animate-pulse">Menyelaraskan frekuensi jagat raya...</p>
                   </div>
                )}

                {!analysis && !loading && !radioPower && (
                   <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-5 py-24 opacity-40">
                      <CircleDashed size={60} className="animate-[spin_10s_linear_infinite]" />
                      <p className="font-heritage text-sm italic uppercase tracking-widest text-center leading-relaxed">Harap inisiasi visi portal.<br/>Koordinat jagat raya sedang diselaraskan.</p>
                   </div>
                )}

                {radioPower && (
                   <div className="space-y-6 animate-in fade-in duration-700">
                      <div className="p-6 bg-black/95 rounded-[32px] border border-indigo-900/20 shadow-xl relative overflow-hidden group">
                         <canvas ref={waterfallCanvasRef} width="400" height="200" className="absolute inset-0 w-full h-full opacity-15 mix-blend-screen pointer-events-none" />
                         
                         <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                              <h4 className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mb-1">EVP BANDWIDTH</h4>
                              <span className="text-xl font-mono font-bold text-white tracking-widest">{radioFreq.toFixed(1)} <span className="text-[8px] text-stone-600 uppercase">MHz</span></span>
                            </div>
                            <div className="text-right">
                               <p className="text-[7px] font-black text-stone-500 uppercase tracking-widest mb-0.5">SIGNAL Q</p>
                               <p className={`text-xs font-mono font-bold ${signalStrength > 70 ? 'text-red-500' : 'text-indigo-400'}`}>{signalStrength}%</p>
                            </div>
                         </div>
                         
                         <canvas ref={radioWaveCanvasRef} width="400" height="80" className="w-full h-16 relative z-10 mb-6 border-y border-white/5 bg-black/40" />

                         <div className="h-48 overflow-y-auto bg-stone-950/80 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-inner custom-scrollbar relative z-10">
                            {chatHistory.length === 0 && (
                              <div className="h-full flex flex-col items-center justify-center opacity-30 text-[9px] text-stone-500 italic text-center uppercase tracking-widest space-y-3">
                                <Hexagon size={24} className="text-indigo-500 animate-pulse" />
                                <p>Komunikasi trans-dimensi aktif.<br/>Silakan menyapa entitas.</p>
                              </div>
                            )}
                            {chatHistory.map((chat, i) => (
                               <div key={i} className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-1 duration-300`}>
                                  <span className="text-[6px] font-black uppercase text-stone-700 mb-1 px-2 tracking-widest">{chat.sender === 'user' ? 'SADHAKA' : 'MANIFESTASI'}</span>
                                  <div className={`max-w-[92%] p-3 rounded-xl text-xs leading-relaxed shadow-lg ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-stone-900 text-stone-300 rounded-tl-none border border-indigo-950/40 italic'}`}>
                                     {chat.text}
                                  </div>
                               </div>
                            ))}
                            {isCommunicating && <div className="flex gap-2 items-center text-indigo-400 animate-pulse text-[8px] font-black uppercase tracking-widest px-2"><Waves size={10} /> RECEIVING SIGNAL...</div>}
                         </div>

                         {/* CONTROLS AREA: EVP & SPEECH RECOGNITION */}
                         <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                            {/* SPEECH RECOGNITION BTN */}
                            <div className="flex flex-col items-center gap-2">
                                <button onClick={handleStartListening} disabled={isCommunicating} className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 border border-white/10 ${isListening ? 'bg-red-600 scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-stone-900 hover:bg-stone-800'}`}>
                                   {isListening ? <Mic size={20} className="text-white animate-pulse" /> : <Mic size={20} className="text-stone-400" />}
                                </button>
                                <p className="text-[7px] font-black uppercase tracking-widest text-stone-500">VOICE CMD</p>
                            </div>

                            {/* EVP RECORD BTN */}
                            <div className="flex flex-col items-center gap-2">
                                <button onClick={handleToggleEVP} className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 border border-white/10 ${isRecordingEVP ? 'bg-red-900/50 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-stone-900 hover:bg-stone-800'}`}>
                                   {isRecordingEVP ? <Square size={18} className="text-red-500 fill-red-500 animate-pulse" /> : <Disc size={20} className="text-stone-400" />}
                                </button>
                                <p className="text-[7px] font-black uppercase tracking-widest text-stone-500">{isRecordingEVP ? formatDuration(recordingDuration) : 'EVP REC'}</p>
                            </div>
                         </div>
                         
                         {/* EVP PLAYER ARTEFACT */}
                         {evpAudioUrl && !isRecordingEVP && (
                           <div className="mt-4 p-4 bg-stone-950/80 border border-amber-900/30 rounded-2xl relative z-10 animate-in slide-in-from-bottom-4">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 text-amber-600">
                                   <Disc size={12} className="animate-spin-slow" />
                                   <span className="text-[8px] font-black uppercase tracking-widest">ARTEFAK AUDIO EVP</span>
                                </div>
                                <button onClick={handleDownloadEVP} className="text-stone-500 hover:text-amber-500 transition-colors"><Download size={14} /></button>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button onClick={handlePlayEVP} className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-stone-950 hover:bg-amber-500 transition-colors shadow-lg">
                                    {isPlayingEVP ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                                 </button>
                                 <div className="flex-1 h-8 bg-stone-900 rounded-lg overflow-hidden flex items-center px-2 border border-stone-800">
                                     <div className="w-full flex items-center gap-0.5 h-4">
                                        {Array.from({length: 20}).map((_, i) => (
                                           <div key={i} className="flex-1 bg-amber-900/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                                        ))}
                                     </div>
                                 </div>
                              </div>
                              <audio ref={evpAudioRef} src={evpAudioUrl} onEnded={() => setIsPlayingEVP(false)} className="hidden" />
                           </div>
                         )}
                      </div>
                   </div>
                )}

                {analysis && (
                   <div className="space-y-6 animate-in fade-in duration-700">
                      <div className="p-7 bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border-color)] shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--title-primary)]" />
                         <h4 className="text-[9px] font-black text-[var(--title-primary)] uppercase tracking-widest mb-5 flex items-center gap-2"><Ghost size={14} /> SPECTRAL ANALYTICS</h4>
                         <div className="text-[var(--text-primary)] text-sm md:text-xl leading-relaxed italic text-justify whitespace-pre-wrap font-medium">{analysis}</div>
                      </div>

                      <div className="p-8 md:p-10 bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] shadow-sm space-y-8 mb-10">
                         <div className="flex items-center gap-4 text-[var(--title-primary)] border-b border-[var(--border-color)] pb-5">
                            <ShieldAlert size={28} className="animate-pulse" />
                            <h4 className="font-heritage text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">Benteng Batin</h4>
                         </div>
                         
                         {!protection && !loadingProtection && (
                            <button onClick={handleProtect} disabled={loading || !analysis} className="w-full py-5 bg-[var(--title-primary)] hover:bg-[var(--title-dark)] text-white font-black rounded-[24px] shadow-sm flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-30">INISIASI AMALAN PELINDUNG</button>
                         )}

                         {(protection || loadingProtection) && (
                            <div className="space-y-8 animate-in fade-in duration-700">
                               {loadingProtection ? (
                                 <div className="py-16 flex flex-col items-center justify-center gap-6">
                                    <div className="relative">
                                      <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[var(--title-primary)] rounded-full animate-spin" />
                                      <Book className="absolute inset-0 m-auto text-[var(--title-primary)]" size={24} />
                                    </div>
                                    <p className="text-[var(--title-primary)] font-heritage italic text-xl animate-pulse">Menghimpun Kalimah Thoyyibah...</p>
                                 </div>
                               ) : (
                                 <>
                                   <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-inner relative group overflow-hidden">
                                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Skull size={40} className="text-[var(--title-primary)]" />
                                      </div>
                                      <div className="text-[var(--text-primary)] text-lg md:text-2xl leading-relaxed italic text-center font-medium">
                                        {protection}
                                      </div>
                                   </div>

                                   {rajahVisual && (
                                     <div className="p-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-sm flex flex-col group transition-all duration-700">
                                        <img src={rajahVisual} alt="Isim Protection" className="w-full aspect-[3/4] object-cover brightness-100 group-hover:brightness-100 transition-all duration-1000" />
                                        <div className="p-6 bg-[var(--bg-secondary)] flex justify-between items-center border-t border-[var(--border-color)]">
                                           <div className="text-left">
                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--title-primary)]">ISIM WASKITA AI</p>
                                             <p className="text-[8px] text-[var(--text-muted)] italic">Calligraphy Amulet Manifestation</p>
                                           </div>
                                           <button onClick={() => { const a = document.createElement('a'); a.href = rajahVisual!; a.download = 'isim_waskita_benteng.png'; a.click(); }} className="p-3 bg-[var(--title-primary)] hover:bg-[var(--title-dark)] text-white rounded-xl shadow-sm active:scale-90 transition-transform"><Download size={18} /></button>
                                        </div>
                                     </div>
                                   )}
                                   <ShareResult title="Risalah Benteng Batin" text={protection} context="Amalan Tolak Bala & Pengusir Jin" />
                                 </>
                               )}
                            </div>
                         )}
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default GhostPortalView;
