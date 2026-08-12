import React, { useState } from 'react';
import { CyberTheme, CustomThemeConfig } from '../types';
import { soundFx } from '../utils/soundFx';
import {
  Palette,
  X,
  Check,
  Sun,
  Moon,
  Eye,
  Zap,
  Flame,
  Sparkles,
  Shield,
  Sliders,
  RotateCcw,
  Layout,
  SlidersHorizontal,
  Bot,
  Copy,
  Download,
  Upload,
  Cpu,
  Layers,
  Wand2,
  Lock,
  Terminal,
  Activity
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: CyberTheme;
  setTheme: (theme: CyberTheme) => void;
  customThemeConfig: CustomThemeConfig;
  setCustomThemeConfig: (config: CustomThemeConfig) => void;
}

export interface GalleryThemeItem {
  id: CyberTheme;
  name: string;
  tag: string;
  primaryColor: string;
  secondaryColor: string;
  bgTone: string;
  cardBg: string;
  previewGraphic: React.ReactNode;
  category: 'standard' | 'jarvis' | 'utility';
  isLight?: boolean;
}

export const GALLERY_THEMES: GalleryThemeItem[] = [
  {
    id: 'gemini-ui',
    name: "Barlin's GPT Gemini UI",
    tag: "GEMINI AI MODERN FULL UI",
    primaryColor: '#38bdf8',
    secondaryColor: '#818cf8',
    bgTone: '#0e0e11',
    cardBg: 'rgba(19, 19, 24, 0.95)',
    category: 'standard',
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-[#0e0e11] border border-sky-400/80 flex flex-col justify-between p-1.5 select-none overflow-hidden shadow-[0_0_12px_rgba(56,189,248,0.3)]">
        <div className="flex items-center gap-1 border-b border-gray-800 pb-0.5">
          <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
          <span className="text-[7px] font-bold text-white tracking-tighter">Barlin GPT</span>
        </div>
        <div className="text-[6px] text-sky-200/70 text-center font-sans">Hi Agyat, plan?</div>
        <div className="w-full h-2 rounded-full bg-gray-800 border border-sky-400/50 flex items-center justify-between px-1">
          <span className="text-[5px] text-gray-400">+</span>
          <div className="w-1 h-1 rounded-full bg-sky-400 animate-ping" />
        </div>
      </div>
    )
  },
  {
    id: 'cyan',
    name: 'Default Teal',
    tag: 'TEAL CORE',
    primaryColor: '#00f3ff',
    secondaryColor: '#0284c7',
    bgTone: '#050608',
    cardBg: 'rgba(10, 18, 28, 0.85)',
    category: 'standard',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border-2 border-[#00f3ff] flex items-center justify-center bg-[#00f3ff11] shadow-[0_0_12px_#00f3ff66]">
        <div className="w-6 h-6 rounded-full border border-[#00f3ff] border-dashed animate-spin-slow" />
        <div className="absolute w-2 h-2 rounded-full bg-[#00f3ff] animate-ping" />
      </div>
    )
  },
  {
    id: 'emerald',
    name: 'Matrix Green',
    tag: 'MATRIX EMERALD',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    bgTone: '#030a06',
    cardBg: 'rgba(6, 20, 12, 0.88)',
    category: 'standard',
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-[#030a06] border border-[#10b981] p-1 overflow-hidden font-mono text-[8px] text-[#10b981] leading-tight select-none opacity-90">
        0101010<br />1100101<br />0011010<br />1010101
      </div>
    )
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    tag: 'AMBER SOLAR',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    bgTone: '#0a0803',
    cardBg: 'rgba(24, 18, 10, 0.85)',
    category: 'standard',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border border-amber-500/60 flex items-center justify-center bg-amber-500/10">
        <div className="w-5 h-5 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]" />
        <div className="absolute w-10 h-10 rounded-full border border-amber-400/40 animate-ping" />
      </div>
    )
  },
  {
    id: 'violet',
    name: 'Nebula Violet',
    tag: 'NEBULA VIOLET',
    primaryColor: '#a855f7',
    secondaryColor: '#7e22ce',
    bgTone: '#08030c',
    cardBg: 'rgba(16, 8, 24, 0.88)',
    category: 'standard',
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 border border-purple-500 flex items-center justify-center shadow-[0_0_12px_#a855f766]">
        <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
      </div>
    )
  },
  {
    id: 'synthwave',
    name: 'Synthwave Pink',
    tag: 'SYNTHWAVE PINK',
    primaryColor: '#ec4899',
    secondaryColor: '#8b5cf6',
    bgTone: '#0d0614',
    cardBg: 'rgba(22, 10, 32, 0.88)',
    category: 'standard',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-lg bg-[#0d0614] border border-pink-500 overflow-hidden flex flex-col justify-end items-center p-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-t from-pink-500 to-amber-400 mb-0.5 shadow-[0_0_10px_#ec4899]" />
        <div className="w-full h-2 border-t border-pink-400/50 bg-pink-500/10" />
      </div>
    )
  },
  {
    id: 'wolf',
    name: 'WOLF MODE (DEVIL RED)',
    tag: 'UNSANSORED RED CORE',
    primaryColor: '#ff0033',
    secondaryColor: '#990000',
    bgTone: '#050002',
    cardBg: 'rgba(25, 0, 5, 0.95)',
    category: 'jarvis',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-lg border-2 border-red-600 flex flex-col items-center justify-center bg-red-950/80 shadow-[0_0_20px_rgba(255,0,51,0.6)]">
        <Flame className="w-6 h-6 text-red-500 animate-pulse" />
        <span className="text-[6px] font-black text-red-400 tracking-tighter uppercase mt-0.5">WOLF</span>
      </div>
    )
  },
  {
    id: 'jarvis',
    name: 'JARVIS STARK CORE',
    tag: 'ARC REACTOR CORE',
    primaryColor: '#00f3ff',
    secondaryColor: '#0284c7',
    bgTone: '#030812',
    cardBg: 'rgba(6, 16, 28, 0.92)',
    category: 'jarvis',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border-2 border-[#00f3ff] flex items-center justify-center bg-cyan-950/60 shadow-[0_0_20px_#00f3ff88]">
        <div className="w-8 h-8 rounded-full border border-cyan-300 border-dashed animate-spin-slow" />
        <Zap className="absolute w-5 h-5 text-[#00f3ff] animate-pulse" />
      </div>
    )
  },
  {
    id: 'jarvis-amber',
    name: 'Stark Core (Amber)',
    tag: 'LEGACY JARVIS',
    primaryColor: '#f59e0b',
    secondaryColor: '#ef4444',
    bgTone: '#0b0702',
    cardBg: 'rgba(24, 16, 6, 0.9)',
    category: 'jarvis',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center bg-amber-500/20 shadow-[0_0_16px_#f59e0b88]">
        <div className="w-8 h-8 rounded-full border border-amber-300 border-dotted animate-spin-slow" />
        <Flame className="absolute w-5 h-5 text-amber-400" />
      </div>
    )
  },
  {
    id: 'jarvis-blue',
    name: 'Reactor Optic (Blue)',
    tag: 'ARC REACTOR',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    bgTone: '#030812',
    cardBg: 'rgba(6, 16, 30, 0.9)',
    category: 'jarvis',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border-2 border-sky-400 flex items-center justify-center bg-sky-500/20 shadow-[0_0_16px_#0ea5e988]">
        <div className="w-8 h-8 rounded-full border border-sky-300 border-dashed animate-spin-reverse" />
        <Zap className="absolute w-5 h-5 text-sky-300" />
      </div>
    )
  },
  {
    id: 'jarvis-uv',
    name: 'Quantum Pulse (UV)',
    tag: 'QUANTUM UV',
    primaryColor: '#c026d3',
    secondaryColor: '#9333ea',
    bgTone: '#090214',
    cardBg: 'rgba(18, 6, 32, 0.9)',
    category: 'jarvis',
    previewGraphic: (
      <div className="relative w-12 h-12 rounded-full border-2 border-fuchsia-500 flex items-center justify-center bg-fuchsia-500/20 shadow-[0_0_16px_#c026d388]">
        <Cpu className="w-6 h-6 text-fuchsia-300 animate-pulse" />
      </div>
    )
  },
  {
    id: 'day',
    name: 'Normal Light Theme',
    tag: 'DAYLIGHT MODE',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    bgTone: '#f8fafc',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    category: 'utility',
    isLight: true,
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-blue-400 flex items-center justify-center">
        <Sun className="w-6 h-6 text-amber-500" />
      </div>
    )
  },
  {
    id: 'night',
    name: 'Midnight Stealth',
    tag: 'STEALTH OLED',
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    bgTone: '#020305',
    cardBg: 'rgba(10, 12, 18, 0.95)',
    category: 'utility',
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-black border border-indigo-500 flex items-center justify-center">
        <Moon className="w-6 h-6 text-indigo-400" />
      </div>
    )
  },
  {
    id: 'eyecare',
    name: 'Eye Care Filter',
    tag: 'WARM FILTER',
    primaryColor: '#d97706',
    secondaryColor: '#b45309',
    bgTone: '#1a140e',
    cardBg: 'rgba(28, 20, 14, 0.92)',
    category: 'utility',
    previewGraphic: (
      <div className="w-12 h-12 rounded-lg bg-[#1a140e] border border-amber-600 flex items-center justify-center">
        <Eye className="w-6 h-6 text-amber-500" />
      </div>
    )
  }
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  setTheme,
  customThemeConfig,
  setCustomThemeConfig
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio' | 'prompt'>('gallery');
  
  // Custom Color State
  const [tempConfig, setTempConfig] = useState<CustomThemeConfig>(customThemeConfig);
  const [promptInput, setPromptInput] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: CyberTheme) => {
    soundFx.playSuccess();
    setTheme(themeId);
  };

  const handleApplyCustomConfig = () => {
    soundFx.playSuccess();
    setCustomThemeConfig(tempConfig);
    setTheme('custom');
    setSaveSuccessMsg('Custom theme config applied successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleResetCustom = () => {
    soundFx.playClick();
    const defaultConfig: CustomThemeConfig = {
      themeName: 'My Custom Cyber Core',
      primaryColor: '#00f3ff',
      secondaryColor: '#0284c7',
      bgColor: '#050608',
      cardBg: 'rgba(10, 12, 16, 0.88)',
      textColor: '#cbd5e1',
      accentGlow: 'rgba(0, 243, 255, 0.4)',
      glowIntensity: 80,
      texture: 'glass',
      fontStyle: 'orbitron'
    };
    setTempConfig(defaultConfig);
    setCustomThemeConfig(defaultConfig);
    setTheme('cyan');
  };

  const handleAiPromptTheme = () => {
    if (!promptInput.trim()) return;
    soundFx.playClick();
    setIsGeneratingPrompt(true);

    setTimeout(() => {
      const query = promptInput.toLowerCase();
      let newPrimary = '#00f3ff';
      let newBg = '#050608';
      let name = 'AI Prompt Theme';

      if (query.includes('red') || query.includes('fire') || query.includes('crimson') || query.includes('blood')) {
        newPrimary = '#ef4444';
        newBg = '#0a0405';
        name = 'AI Crimson Fire';
      } else if (query.includes('gold') || query.includes('amber') || query.includes('yellow') || query.includes('sun')) {
        newPrimary = '#f59e0b';
        newBg = '#0a0803';
        name = 'AI Solar Gold';
      } else if (query.includes('green') || query.includes('matrix') || query.includes('hacker') || query.includes('lime')) {
        newPrimary = '#10b981';
        newBg = '#030a06';
        name = 'AI Matrix Lime';
      } else if (query.includes('purple') || query.includes('violet') || query.includes('galaxy') || query.includes('cosmic')) {
        newPrimary = '#a855f7';
        newBg = '#08030c';
        name = 'AI Cosmic Violet';
      } else if (query.includes('pink') || query.includes('neon') || query.includes('synthwave') || query.includes('cyber')) {
        newPrimary = '#ec4899';
        newBg = '#0d0614';
        name = 'AI Neon Synthwave';
      } else if (query.includes('light') || query.includes('white') || query.includes('clean')) {
        newPrimary = '#2563eb';
        newBg = '#f8fafc';
        name = 'AI Clean Light';
      }

      const generatedConfig: CustomThemeConfig = {
        themeName: name,
        primaryColor: newPrimary,
        bgColor: newBg,
        cardBg: 'rgba(12, 16, 24, 0.9)',
        textColor: newBg === '#f8fafc' ? '#0f172a' : '#e2e8f0',
        accentGlow: newPrimary + '66',
        glowIntensity: 90,
        texture: 'glass',
        fontStyle: 'orbitron'
      };

      setTempConfig(generatedConfig);
      setCustomThemeConfig(generatedConfig);
      setTheme('custom');
      setIsGeneratingPrompt(false);
      soundFx.playSuccess();
      setSaveSuccessMsg(`AI generated "${name}" and applied to workspace!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }, 1000);
  };

  const activeThemeItem = GALLERY_THEMES.find(t => t.id === currentTheme) || GALLERY_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn font-mono">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => { soundFx.playClick(); onClose(); }} />

      {/* Right Drawer Panel */}
      <div className="relative w-full sm:w-[380px] md:w-[400px] h-full bg-[#060a12]/95 border-l border-[#00f3ff44] shadow-[-20px_0_60px_rgba(0,0,0,0.92)] flex flex-col z-10 overflow-hidden">
        
        {/* Header HUD Bar */}
        <div className="px-4 py-3 bg-[#0b0f19] border-b border-[#1b2538] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00f3ff1a] border border-[#00f3ff55] text-[#00f3ff] shadow-[0_0_12px_#00f3ff44]">
              <Palette className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-widest text-white font-orbitron uppercase">
                THEME GALLERY & APPLICATOR
              </h2>
              <p className="text-[10px] text-gray-400">Dynamic UI Theme Engine • JARVIS Arc Reactor</p>
            </div>
          </div>

          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-[#121826] hover:bg-red-500/20 border border-[#1e293b] hover:border-red-500/50 text-gray-400 hover:text-red-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-3 pt-2.5 bg-[#080c14] border-b border-[#182234] flex items-center justify-between gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { soundFx.playClick(); setActiveTab('gallery'); }}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-t border-t border-x flex items-center gap-1.5 transition ${
                activeTab === 'gallery'
                  ? 'bg-[#121826] text-[#00f3ff] border-[#00f3ff55] shadow-[0_-4px_12px_rgba(0,243,255,0.1)]'
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>GALLERY</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('studio'); }}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-t border-t border-x flex items-center gap-1.5 transition ${
                activeTab === 'studio'
                  ? 'bg-[#121826] text-[#00f3ff] border-[#00f3ff55] shadow-[0_-4px_12px_rgba(0,243,255,0.1)]'
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>CUSTOM</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('prompt'); }}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-t border-t border-x flex items-center gap-1.5 transition ${
                activeTab === 'prompt'
                  ? 'bg-[#121826] text-pink-400 border-pink-500/50 shadow-[0_-4px_12px_rgba(236,72,153,0.1)]'
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-pink-400">AI PROMPT</span>
            </button>
          </div>

          <div className="text-[10px] text-[#00f3ff] font-bold pb-1 truncate max-w-[100px]">
            {currentTheme === 'custom' ? (customThemeConfig.themeName || 'CUSTOM') : activeThemeItem.name.toUpperCase()}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 overflow-y-auto flex-1 space-y-4">

          {saveSuccessMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* ==================== TAB 1: THEME GALLERY ==================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-3.5">
              
              {/* Stack of Theme Cards */}
              <div className="space-y-2.5">
                {GALLERY_THEMES.filter(t => t.id !== 'jarvis').map(item => {
                  const isSelected = currentTheme === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectTheme(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#0f1826] border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.35)] scale-[1.01]'
                          : 'bg-[#0a0d16] border-[#182234] hover:border-[#00f3ff66] hover:bg-[#0e1422]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.previewGraphic}
                        <div>
                          <div className="font-bold text-xs text-white">{item.name}</div>
                          <div className="text-[10px] font-bold text-[#00f3ff] mt-0.5">{item.tag}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-2 py-1 rounded bg-[#00f3ff22] border border-[#00f3ff66] text-[#00f3ff] text-[9px] font-black uppercase tracking-wider">
                          APPLIED
                        </span>
                      ) : (
                        <button className="px-2.5 py-1 rounded bg-[#121826] group-hover:bg-[#00f3ff22] border border-[#1b2538] group-hover:border-[#00f3ff55] text-gray-400 group-hover:text-white text-[10px] font-bold transition">
                          SELECT
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SPECIAL FEATURED JARVIS ARC REACTOR CARD (As seen in screenshot) */}
              <div 
                onClick={() => handleSelectTheme('jarvis')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center text-center group ${
                  currentTheme === 'jarvis'
                    ? 'bg-gradient-to-b from-[#061e30] via-[#031322] to-[#020914] border-[#00f3ff] shadow-[0_0_35px_rgba(0,243,255,0.7)] scale-[1.01]'
                    : 'bg-gradient-to-b from-[#041220] to-[#020914] border-[#00f3ff66] hover:border-[#00f3ff] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)]'
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff66] rounded text-[9px] font-black text-[#00f3ff] tracking-widest uppercase">
                  STARK CORE
                </div>

                {/* Arc Reactor Centerpiece Graphic */}
                <div className="relative w-20 h-20 rounded-full border-2 border-[#00f3ff] flex items-center justify-center bg-[#00f3ff11] shadow-[0_0_30px_#00f3ffaa] my-2 group-hover:scale-105 transition-transform">
                  <div className="absolute inset-1 rounded-full border border-cyan-300/80 border-dashed animate-spin-slow" />
                  <div className="w-14 h-14 rounded-full border-2 border-[#00f3ff] flex items-center justify-center bg-cyan-950/80 shadow-[inset_0_0_15px_#00f3ff]">
                    <Zap className="w-7 h-7 text-[#00f3ff] animate-pulse filter drop-shadow-[0_0_10px_#00f3ff]" />
                  </div>
                </div>

                <div className="font-orbitron font-black text-base text-[#00f3ff] tracking-[0.2em] uppercase">
                  JARVIS
                </div>
                <div className="text-[10px] text-cyan-200/80 font-mono mt-0.5">
                  STARK INDUSTRIES ARC REACTOR HUD COMMAND THEME
                </div>

                {currentTheme === 'jarvis' ? (
                  <div className="mt-3 text-[10px] text-[#00f3ff] font-black tracking-widest uppercase px-3 py-1 rounded bg-[#00f3ff22] border border-[#00f3ff88] shadow-[0_0_15px_rgba(0,243,255,0.5)] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>CURRENTLY APPLIED: JARVIS THEME</span>
                  </div>
                ) : (
                  <button className="mt-3 px-4 py-1.5 rounded bg-[#00f3ff] text-black border border-[#00f3ff] text-[10px] font-black tracking-widest uppercase hover:bg-white transition shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                    APPLY JARVIS THEME
                  </button>
                )}
              </div>

              {/* Day & Night Utility Modes */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  UTILITY MODES
                </div>

                <div className="space-y-2">
                  {GALLERY_THEMES.filter(t => t.category === 'utility').map(item => {
                    const isSelected = currentTheme === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectTheme(item.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#101726] border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                            : 'bg-[#0a0d16] border-[#182234] hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.previewGraphic}
                          <div>
                            <div className="font-bold text-xs text-white">{item.name}</div>
                            <div className="text-[9px] text-gray-400">{item.tag}</div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-[#00f3ff]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: CUSTOM STUDIO ==================== */}
          {activeTab === 'studio' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-xl bg-[#0a0d16] border border-[#182234] space-y-4">
                <div className="font-black text-xs text-[#00f3ff] tracking-widest uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>CREATE & CUSTOMIZE THEME (कस्टम थीम निर्माता)</span>
                </div>

                {/* Theme Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300">THEME NAME (थीम का नाम)</label>
                  <input
                    type="text"
                    value={tempConfig.themeName || ''}
                    onChange={(e) => setTempConfig({ ...tempConfig, themeName: e.target.value })}
                    placeholder="e.g. My Personal Cyber Core"
                    className="w-full px-3 py-2 rounded-lg bg-[#050608] border border-[#1c273c] text-white text-xs font-mono focus:border-[#00f3ff] focus:outline-none"
                  />
                </div>

                {/* Color Pickers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Primary Color */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-[#05080f] border border-[#182234]">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span>PRIMARY GLOW COLOR</span>
                      <span className="font-mono text-[#00f3ff]">{tempConfig.primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempConfig.primaryColor}
                        onChange={(e) => setTempConfig({ ...tempConfig, primaryColor: e.target.value })}
                        className="w-9 h-9 rounded cursor-pointer border border-white/20 bg-transparent"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto">
                        {['#00f3ff', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#3b82f6'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setTempConfig({ ...tempConfig, primaryColor: c })}
                            className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Canvas Background */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-[#05080f] border border-[#182234]">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span>BACKGROUND CANVAS TONE</span>
                      <span className="font-mono text-[#00f3ff]">{tempConfig.bgColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tempConfig.bgColor}
                        onChange={(e) => setTempConfig({ ...tempConfig, bgColor: e.target.value })}
                        className="w-9 h-9 rounded cursor-pointer border border-white/20 bg-transparent"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto">
                        {['#050608', '#020305', '#0f172a', '#181008', '#040d12', '#f8fafc'].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => setTempConfig({ ...tempConfig, bgColor: bg })}
                            className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition"
                            style={{ backgroundColor: bg }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Glow & Texture Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Glow Intensity Slider */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-[#05080f] border border-[#182234]">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                      <span>GLOW INTENSITY</span>
                      <span className="text-xs font-mono text-[#00f3ff]">{tempConfig.glowIntensity || 80}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={tempConfig.glowIntensity || 80}
                      onChange={(e) => setTempConfig({ ...tempConfig, glowIntensity: Number(e.target.value) })}
                      className="w-full accent-[#00f3ff] cursor-pointer"
                    />
                  </div>

                  {/* Interface Texture */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-[#05080f] border border-[#182234]">
                    <div className="text-xs font-bold text-gray-300">INTERFACE TEXTURE</div>
                    <select
                      value={tempConfig.texture || 'glass'}
                      onChange={(e) => setTempConfig({ ...tempConfig, texture: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded bg-[#0b0f19] border border-[#182234] text-xs text-white font-mono"
                    >
                      <option value="glass">Translucent Cyber Glass</option>
                      <option value="metal">Brushed Titanium Metal</option>
                      <option value="carbon">Carbon Fiber Mesh</option>
                      <option value="grid">Dot Matrix Grid</option>
                      <option value="none">Flat Solid Clean</option>
                    </select>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#182234] flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={handleResetCustom}
                    className="px-3.5 py-2 bg-[#121826] hover:bg-gray-800 border border-[#1e293b] text-gray-300 text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET TO DEFAULT</span>
                  </button>

                  <button
                    onClick={handleApplyCustomConfig}
                    className="px-5 py-2 bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-black text-xs font-black rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>APPLY & SAVE THEME (थीम लागू करें)</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 3: PROMPT STUDIO ==================== */}
          {activeTab === 'prompt' && (
            <div className="p-4 rounded-xl bg-[#0a0d16] border border-[#182234] space-y-4">
              <div className="font-black text-xs text-pink-400 tracking-widest uppercase flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span>AI PROMPT THEME GENERATOR (प्रॉम्प्ट लिखकर थीम बनाएं)</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Describe any visual aesthetic in natural language (e.g., <span className="text-pink-300 italic">"Cyberpunk Tokyo Red Fire"</span>, <span className="text-amber-300 italic">"Warm Golden Sun"</span>, or <span className="text-emerald-300 italic">"Matrix Emerald Terminal"</span>) and the AI engine will construct matching CSS color variables automatically.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiPromptTheme()}
                  placeholder="e.g., High-tech Neon Pink and Purple Sci-Fi Grid"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[#050608] border border-[#1c273c] text-white text-xs font-mono focus:border-pink-500 focus:outline-none"
                />

                <button
                  onClick={handleAiPromptTheme}
                  disabled={isGeneratingPrompt || !promptInput.trim()}
                  className="px-4 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGeneratingPrompt ? 'GENERATING...' : 'GENERATE THEME'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#05080f] border border-[#182234] text-[11px] text-gray-400">
                <span className="text-[#00f3ff] font-bold">Quick Examples: </span>
                <span className="cursor-pointer underline mr-2" onClick={() => setPromptInput('Iron Man Stark Crimson Red')}>Stark Crimson</span>
                <span className="cursor-pointer underline mr-2" onClick={() => setPromptInput('Matrix Green Hacker Code')}>Matrix Hacker</span>
                <span className="cursor-pointer underline" onClick={() => setPromptInput('Cosmic Purple Galaxy')}>Cosmic Violet</span>
              </div>
            </div>
          )}

          {/* Interactive Live Preview Box */}
          <div className="p-4 rounded-xl bg-[#05080f] border border-[#182234] space-y-3">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
              <span>LIVE COMMAND CENTER PREVIEW (लाइव थीम का पूर्वावलोकन)</span>
              <span className="text-[10px] text-[#00f3ff] flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> LIVE REALTIME
              </span>
            </div>

            <div
              className="p-4 rounded-xl border transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: currentTheme === 'custom' ? tempConfig.bgColor : undefined,
                borderColor: currentTheme === 'custom' ? tempConfig.primaryColor : undefined
              }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#00f3ff]" />
                  <span className="font-black text-sm text-white font-orbitron">BARLIN'S GPT COMMAND CORE</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#00f3ff22] text-[#00f3ff] border border-[#00f3ff44]">
                  SYSTEM READY
                </span>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-200 mb-3 leading-relaxed">
                <span className="font-bold text-[#00f3ff]">Diagnostic Log:</span> "Current active theme is fully synchronized across system matrices, HUD indicators, and Colab GPU endpoints."
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3.5 py-1.5 rounded font-black text-xs text-black transition shadow-[0_0_12px_rgba(0,243,255,0.3)]"
                  style={{ backgroundColor: currentTheme === 'custom' ? tempConfig.primaryColor : '#00f3ff' }}
                >
                  ACTIVE ACTION
                </button>
                <button className="px-3 py-1.5 rounded font-bold text-xs text-white bg-white/10 border border-white/20">
                  SYSTEM STATUS
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#0b0f19] border-t border-[#182234] flex items-center justify-between text-xs text-gray-400">
          <span>Theme selection persists automatically</span>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-5 py-1.5 bg-[#121826] hover:bg-gray-800 border border-[#1e293b] text-white font-bold rounded-lg transition"
          >
            CLOSE STUDIO (संपन्न)
          </button>
        </div>

      </div>
    </div>
  );
};
