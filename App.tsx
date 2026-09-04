
import React, { useState, useEffect, useMemo } from 'react';
import { AppView } from './types.ts';
import { NAV_GROUPS, PATTERNS } from './constants.tsx';
import HomeView from './views/Home.tsx';
import LibraryView from './views/Library.tsx';
import CultureTreasuryView from './views/CultureTreasury.tsx';
import CalculatorView from './views/Calculator.tsx';
import OralTraditionView from './views/OralTradition.tsx';
import PalmistryView from './views/Palmistry.tsx';
import SilatView from './views/Silat.tsx';
import DreamInterpretationView from './views/DreamInterpretation.tsx';
import MatchmakingView from './views/Matchmaking.tsx';
import CardReadingView from './views/CardReading.tsx';
import AmalanView from './views/Amalan.tsx';
import FaceReadingView from './views/FaceReading.tsx';
import FengShuiView from './views/FengShui.tsx';
import MysticalDetectionView from './views/MysticalDetection.tsx';
import HealingView from './views/Healing.tsx';
import HandwritingReadingView from './views/HandwritingReading.tsx';
import AksaraWaskitaView from './views/AksaraWaskita.tsx';
import KhodamCheckView from './views/KhodamCheck.tsx';
import AncientKnowledgeView from './views/AncientKnowledge.tsx';
import GhostPortalView from './views/GhostPortal.tsx';
import ProfileView from './views/Profile.tsx';
import { Menu, X, Home } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mainContent = document.getElementById('main-scroll-area');
    if (mainContent) mainContent.scrollTop = 0;
  }, [activeView]);

  const CurrentView = useMemo(() => {
    switch (activeView) {
      case AppView.HOME: return <HomeView onNavigate={setActiveView} />;
      case AppView.LIBRARY: return <LibraryView onNavigate={setActiveView} />;
      case AppView.CULTURE_TREASURY: return <CultureTreasuryView onNavigate={setActiveView} />;
      case AppView.CALCULATOR: return <CalculatorView onNavigate={setActiveView} />;
      case AppView.ORAL_TRADITION: return <OralTraditionView onNavigate={setActiveView} />;
      case AppView.PALMISTRY: return <PalmistryView onNavigate={setActiveView} />;
      case AppView.SILAT: return <SilatView onNavigate={setActiveView} />;
      case AppView.DREAM: return <DreamInterpretationView onNavigate={setActiveView} />;
      case AppView.MATCHMAKING: return <MatchmakingView onNavigate={setActiveView} />;
      case AppView.CARD_READING: return <CardReadingView onNavigate={setActiveView} />;
      case AppView.AMALAN: return <AmalanView onNavigate={setActiveView} />;
      case AppView.FACE_READING: return <FaceReadingView onNavigate={setActiveView} />;
      case AppView.FENG_SHUI: return <FengShuiView onNavigate={setActiveView} />;
      case AppView.MYSTICAL_DETECTION: return <MysticalDetectionView onNavigate={setActiveView} />;
      case AppView.HEALING: return <HealingView onNavigate={setActiveView} />;
      case AppView.HANDWRITING_READING: return <HandwritingReadingView onNavigate={setActiveView} />;
      case AppView.AKSARA_WASKITA: return <AksaraWaskitaView onNavigate={setActiveView} />;
      case AppView.KHODAM_CHECK: return <KhodamCheckView onNavigate={setActiveView} />;
      case AppView.ANCIENT_KNOWLEDGE: return <AncientKnowledgeView onNavigate={setActiveView} />;
      case AppView.GHOST_PORTAL: return <GhostPortalView onNavigate={setActiveView} />;
      case AppView.PROFILE: return <ProfileView onNavigate={setActiveView} />;
      default: return <HomeView onNavigate={setActiveView} />;
    }
  }, [activeView]);

  return (
    <div className="group/app h-screen w-full flex flex-col md:flex-row relative bg-stone-50 overflow-hidden text-stone-900">
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url("${PATTERNS.megaMendung}")`,
          backgroundSize: '400px auto',
          backgroundRepeat: 'repeat',
        }}
      />
      
      <header className={`
        md:hidden flex items-center justify-between p-4 sticky top-0 z-[60] shrink-0 transition-all duration-300
        ${isSidebarOpen 
          ? 'bg-white border-b border-stone-200' 
          : 'bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm'}
      `}>
        <button 
          onClick={() => setActiveView(AppView.HOME)}
          className="flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center font-bold text-white shadow-md">G</div>
          <div>
            <span className="font-heritage text-sm font-bold tracking-tight text-stone-900 block leading-none text-left">GALURA LUGAY KANCANA</span>
            <span className="text-[7px] uppercase tracking-[0.4em] font-black text-emerald-800 mt-1 block">Waskita Pasundan</span>
          </div>
        </button>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2.5 rounded-full transition-all duration-300 ${isSidebarOpen ? 'bg-emerald-800 text-white' : 'text-stone-900 hover:bg-stone-100'}`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <nav className={`
        fixed md:relative z-[55] h-full w-72 bg-white/70 backdrop-blur-xl border-r border-stone-200 transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-8 hidden md:block shrink-0">
          <button 
            onClick={() => setActiveView(AppView.HOME)}
            className="flex items-center gap-4 mb-2 hover:opacity-80 transition-opacity text-left"
          >
            <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-md">G</div>
            <div>
              <h1 className="font-heritage text-sm font-bold text-stone-900 tracking-tight leading-tight">GALURA LUGAY KANCANA</h1>
              <p className="text-[8px] uppercase tracking-[0.4em] font-black text-emerald-800">Waskita Pasundan</p>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100 pb-1.5 mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as AppView);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                      ${activeView === item.id 
                        ? 'bg-[var(--pasundan-green)] text-white shadow-sm' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-transparent'}
                    `}
                  >
                    <div className={activeView === item.id ? 'text-white' : 'opacity-60 transition-opacity group-hover:opacity-100'}>{item.icon}</div>
                    <span className="font-bold text-xs tracking-wide">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 shrink-0">
          <div className="p-5 rounded-2xl bg-stone-100/50 border border-stone-200 text-[9px] text-stone-500 leading-relaxed italic shadow-inner">
            &copy; 2026 GALURA LUGAY KANCANA / Kang Dodi Lugay
          </div>
        </div>
      </nav>

      <main 
        id="main-scroll-area"
        className="flex-1 overflow-y-auto relative z-10 bg-stone-50 scroll-smooth"
      >
        <div className="w-full mx-auto min-h-full px-0">
           <div key={activeView} className="view-transition">
              {CurrentView}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
