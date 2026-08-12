import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { CyberTheme } from '../types';
import { soundFx } from '../utils/soundFx';
import {
  ShieldAlert,
  Shield,
  Volume2,
  VolumeX,
  ExternalLink,
  Instagram,
  Github,
  Radio,
  User,
  Monitor,
  Camera,
  PhoneCall,
  Heart,
  Cloud,
  Globe,
  Sun,
  Moon,
  Eye,
  Zap,
  Flame,
  Palette
} from 'lucide-react';
import { UserProfile } from './UserProfileAuthModal';

interface HeaderHUDProps {
  theme: CyberTheme;
  setTheme: (t: CyberTheme) => void;
  audioEnabled: boolean;
  setAudioEnabled: (a: boolean) => void;
  onOpenSponsorModal: () => void;
  onOpenAuthModal: () => void;
  onOpenWeatherModal?: () => void;
  onOpenWorldMonitorModal?: () => void;
  onOpenScreenShareModal?: () => void;
  onOpenCameraVisionModal?: () => void;
  onOpenVoiceCallModal?: () => void;
  onOpenLifePlannerModal?: () => void;
  onOpenThemeModal?: () => void;
  onReplayPortalStartup?: () => void;
  onOpenAutonomousResearchModal?: () => void;
  onOpenRAGModal?: () => void;
  onOpenPersonaStudioModal?: () => void;
  onOpenJARVISAudioModal?: () => void;
  onOpenTaskMatrixModal?: () => void;
  onOpenVisionTerminalModal?: () => void;
  onOpenAnalyticsModal?: () => void;
  onOpenGestureControlModal?: () => void;
  onOpenBiometricVaultModal?: () => void;
  onTriggerWolfMode?: () => void;
  onTriggerNormalMode?: () => void;
  userProfile: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  theme,
  setTheme,
  audioEnabled,
  setAudioEnabled,
  onOpenSponsorModal,
  onOpenAuthModal,
  onOpenWeatherModal,
  onOpenWorldMonitorModal,
  onOpenScreenShareModal,
  onOpenCameraVisionModal,
  onOpenVoiceCallModal,
  onOpenLifePlannerModal,
  onOpenThemeModal,
  onReplayPortalStartup,
  onOpenAutonomousResearchModal,
  onOpenRAGModal,
  onOpenPersonaStudioModal,
  onOpenJARVISAudioModal,
  onOpenTaskMatrixModal,
  onOpenVisionTerminalModal,
  onOpenAnalyticsModal,
  onOpenGestureControlModal,
  onOpenBiometricVaultModal,
  onTriggerWolfMode,
  onTriggerNormalMode,
  userProfile,
  activeTab,
  setActiveTab,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC' + (now.getTimezoneOffset() > 0 ? '-' : '+') + Math.abs(now.getTimezoneOffset()/60));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#0a0c10cc] backdrop-blur-md border-b border-[#00f3ff22] px-3 md:px-6 py-2.5 relative z-30 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Product Name & BARLIN GPT Hero Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 border border-[#00f3ff] bg-[#00f3ff11] shadow-[0_0_12px_rgba(0,243,255,0.3)]">
              <div className="w-5 h-5 border-2 border-[#00f3ff] rotate-45" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#00f3ff] font-orbitron glow-cyan">
                  {BRAND_CONFIG.name}
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#00f3ff44] bg-[#00f3ff11] text-[#00f3ff]">
                  v{BRAND_CONFIG.version}
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] font-mono text-slate-400 tracking-[0.2em] uppercase flex items-center gap-1.5 mt-0.5">
                <Radio className="w-3 h-3 text-[#00f3ff] animate-pulse" />
                <span>PRIMARY HERO: BARLIN GPT CORE</span>
              </p>
            </div>
          </div>

          {/* Sponsor Tag Mobile Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenSponsorModal();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="md:hidden text-[10px] font-mono px-2 py-1 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] flex items-center gap-1 animate-pulse"
          >
            <ShieldAlert className="w-3 h-3 text-[#00f3ff]" />
            <span>AGYAT VYUH</span>
          </button>
        </div>

        {/* Middle: Official Sponsor Banner Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-[#0a0c10aa] border border-[#ffffff11] text-xs font-mono">
          <ShieldAlert className="w-4 h-4 text-[#00f3ff] animate-bounce" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">SPONSORED BY</span>
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenSponsorModal();
              }}
              className="text-white font-bold tracking-wider hover:text-[#00f3ff] underline decoration-[#00f3ff] underline-offset-4 flex items-center gap-1 text-left"
            >
              <span>{BRAND_CONFIG.sponsor}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="h-6 w-px bg-[#ffffff11] mx-1" />

          <div className="flex items-center gap-2">
            <a
              href={BRAND_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#00000088] border border-[#ffffff22] text-cyan-400 hover:text-white hover:border-[#00f3ff] transition"
              title="Instagram: @agyat.vyuh"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={BRAND_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#00000088] border border-[#ffffff22] text-cyan-400 hover:text-white hover:border-[#00f3ff] transition"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Controls, System Clock, Day/Night/EyeCare Themes & Feature Modals */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          
          {/* Live System Diagnostics Status */}
          <div className="hidden xl:flex items-center gap-4 text-[11px] font-bold">
            <div className="flex flex-col items-end">
              <span className="opacity-40 uppercase text-[9px]">SYSTEM STATUS</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                BARLIN ONLINE
              </span>
            </div>
          </div>

          {/* Eye Mode / Night Mode / Day Mode / Cyber Theme & Color Palette Customizer */}
          <div className="flex items-center gap-1 bg-[#000000aa] border border-[#ffffff22] p-1 rounded-lg">
            {/* Day Mode */}
            <button
              onClick={() => { setTheme('day'); soundFx.playClick(); }}
              className={`p-1 rounded transition text-xs flex items-center gap-1 ${
                theme === 'day' ? 'bg-amber-400 text-slate-900 font-bold shadow-[0_0_8px_#f59e0b]' : 'text-gray-400 hover:text-white'
              }`}
              title="Day Mode (Normal Light Theme)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            {/* Night Mode */}
            <button
              onClick={() => { setTheme('night'); soundFx.playClick(); }}
              className={`p-1 rounded transition text-xs flex items-center gap-1 ${
                theme === 'night' ? 'bg-indigo-600 text-white font-bold shadow-[0_0_8px_#4f46e5]' : 'text-gray-400 hover:text-white'
              }`}
              title="Night Mode (Stealth Dark)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>

            {/* Eye Care Protection Mode */}
            <button
              onClick={() => { setTheme('eyecare'); soundFx.playClick(); }}
              className={`p-1 rounded transition text-xs flex items-center gap-1 ${
                theme === 'eyecare' ? 'bg-amber-500 text-black font-bold shadow-[0_0_8px_#f59e0b]' : 'text-gray-400 hover:text-white'
              }`}
              title="Eye Care Protection Mode (Blue-Light Filter)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Normal Mode Switcher */}
            <button
              onClick={() => {
                if (onTriggerNormalMode) onTriggerNormalMode();
                else setTheme('cyan');
                soundFx.playClick();
              }}
              className={`px-2 py-0.5 rounded transition text-xs font-bold flex items-center gap-1 ${
                theme !== 'wolf'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_#00f0ff]'
                  : 'bg-cyan-950/60 text-cyan-400 hover:bg-cyan-900/80 border border-cyan-500/50'
              }`}
              title="Switch to NORMAL MODE (Standard Protocol & Formal Assistant)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">NORMAL</span>
            </button>

            {/* Wolf Mode Switcher */}
            <button
              onClick={() => {
                if (onTriggerWolfMode) onTriggerWolfMode();
                else setTheme('wolf');
                soundFx.playClick();
              }}
              className={`px-2 py-0.5 rounded transition text-xs font-bold flex items-center gap-1 ${
                theme === 'wolf'
                  ? 'bg-red-600 text-white shadow-[0_0_12px_#ff0033] animate-pulse'
                  : 'bg-red-950/60 text-red-400 hover:bg-red-900/80 border border-red-500/50'
              }`}
              title="Switch to WOLF MODE (Devil Red Theme & Unfiltered Brain Core)"
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden md:inline">WOLF</span>
            </button>

            <div className="w-px h-4 bg-white/20 mx-0.5" />

            {/* Full Theme & Custom Color Studio Opener */}
            {onOpenThemeModal && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenThemeModal();
                }}
                className="px-1.5 py-1 rounded bg-[#00f3ff22] hover:bg-[#00f3ff44] text-[#00f3ff] border border-[#00f3ff55] font-bold text-xs flex items-center gap-1 transition shadow-[0_0_8px_rgba(0,243,255,0.2)]"
                title="UI Theme & Custom Color Studio (थीम / रंग बदलें)"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px]">THEMES</span>
              </button>
            )}
          </div>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              soundFx.enabled = next;
              if (next) {
                soundFx.playToggle(true);
              }
            }}
            className={`px-2 py-1 border rounded transition text-xs font-mono flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-[#00f3ff22] border-[#00f3ff] text-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.3)] font-bold'
                : 'bg-red-500/10 border-red-500/40 text-red-400 opacity-80'
            }`}
            title={audioEnabled ? "Tactical Audio FX: ON (साउंड चालू है)" : "Tactical Audio FX: OFF (साउंड बंद है)"}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#00f3ff] animate-pulse" />
                <span className="hidden md:inline text-[10px] font-black tracking-wider">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden md:inline text-[10px] font-bold tracking-wider">MUTED</span>
              </>
            )}
          </button>

          {/* Replay Portal Boot Animation & Voice Greeting Button */}
          {onReplayPortalStartup && (
            <button
              onClick={() => {
                soundFx.playClick();
                onReplayPortalStartup();
              }}
              className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 rounded text-xs font-mono flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(0,243,255,0.25)] cursor-pointer"
              title="Replay Portal Startup Animation & Voice Greeting (पोर्टल इंट्रो एनिमेसन दोबारा चालू करें)"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline text-[10px] font-bold tracking-wider">PORTAL BOOT</span>
            </button>
          )}

          {/* Weather Feature Modal Button */}
          {onOpenWeatherModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenWeatherModal();
              }}
              className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/50 text-sky-300 rounded transition flex items-center gap-1 text-xs"
              title="Weather Radar & Climate HUD"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span className="hidden lg:inline font-bold">WEATHER</span>
            </button>
          )}

          {/* World Monitor Setup Modal Button */}
          {onOpenWorldMonitorModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenWorldMonitorModal();
              }}
              className="p-1.5 bg-[#00f3ff1a] hover:bg-[#00f3ff33] border border-[#00f3ff66] text-[#00f3ff] rounded transition flex items-center gap-1 text-xs font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)]"
              title="World Monitor Setup HUD"
            >
              <Globe className="w-4 h-4 text-[#00f3ff] animate-spin-slow" />
              <span className="hidden sm:inline">WORLD MONITOR</span>
            </button>
          )}

          {/* Screen Share Quick Button */}
          {onOpenScreenShareModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenScreenShareModal();
              }}
              className="p-1.5 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff55] text-[#00f3ff] rounded transition"
              title="Screen Share & Recording HUD"
            >
              <Monitor className="w-4 h-4" />
            </button>
          )}

          {/* Camera Vision Quick Button */}
          {onOpenCameraVisionModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenCameraVisionModal();
              }}
              className="p-1.5 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff55] text-[#00f3ff] rounded transition"
              title="Camera Optical Vision Sensor"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Voice Calls Quick Button */}
          {onOpenVoiceCallModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenVoiceCallModal();
              }}
              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded transition"
              title="HUD Voice Dialer & Contacts"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          )}

          {/* AI Best Friend & Planner Quick Button */}
          {onOpenLifePlannerModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenLifePlannerModal();
              }}
              className="p-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded transition"
              title="AI Best Friend & Life Planner"
            >
              <Heart className="w-4 h-4 animate-pulse" />
            </button>
          )}

          {/* Autonomous AI Workflows */}
          {onOpenAutonomousResearchModal && (
            <button
              onClick={() => { soundFx.playClick(); onOpenAutonomousResearchModal(); }}
              className="p-1.5 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff55] text-[#00f3ff] rounded transition"
              title="Autonomous AI SITREP & Code Refactor Agent"
            >
              <Zap className="w-4 h-4 text-[#00f3ff]" />
            </button>
          )}

          {/* RAG Workspace */}
          {onOpenRAGModal && (
            <button
              onClick={() => { soundFx.playClick(); onOpenRAGModal(); }}
              className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded transition"
              title="RAG PDF / Doc / Google Drive Intelligence"
            >
              <Radio className="w-4 h-4" />
            </button>
          )}

          {/* Persona Studio */}
          {onOpenPersonaStudioModal && (
            <button
              onClick={() => { soundFx.playClick(); onOpenPersonaStudioModal(); }}
              className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded transition"
              title="Custom AI Persona & System Prompt Studio"
            >
              <User className="w-4 h-4 text-purple-400" />
            </button>
          )}

          {/* Biometric Vault */}
          {onOpenBiometricVaultModal && (
            <button
              onClick={() => { soundFx.playClick(); onOpenBiometricVaultModal(); }}
              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded transition"
              title="Biometric HUD Security Lock & Encrypted Vault"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* User Account / Profile Modal Opener Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAuthModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff55] text-[#00f3ff] text-xs font-mono font-bold rounded transition shadow-[0_0_8px_rgba(0,243,255,0.2)]"
            title="User Account & Profile"
          >
            <User className="w-3.5 h-3.5 text-[#00f3ff]" />
            <span className="truncate max-w-[80px] sm:max-w-[110px]">
              {userProfile?.isLoggedIn ? userProfile.name : 'PROFILE'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

