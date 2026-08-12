import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import { BRAND_CONFIG } from '../config/brandConfig';
import { Sparkles, Zap, Shield, Cpu, Play, CheckCircle2, Volume2, Power, Upload, Music, RefreshCw, X } from 'lucide-react';

interface PortalStartupOverlayProps {
  userName?: string;
  onComplete: () => void;
  autoStart?: boolean;
}

const CUSTOM_AUDIO_STORAGE_KEY = 'barlin_portal_custom_audio_data';
const CUSTOM_AUDIO_NAME_KEY = 'barlin_portal_custom_audio_name';

export const PortalStartupOverlay: React.FC<PortalStartupOverlayProps> = ({
  userName = 'Agyat',
  onComplete,
  autoStart = true
}) => {
  const [bootStep, setBootStep] = useState<'ready' | 'booting' | 'finished'>('ready');
  const [progress, setProgress] = useState(0);
  const [currentStatusLog, setCurrentStatusLog] = useState('SYSTEM STANDBY');
  const [customAudioName, setCustomAudioName] = useState<string | null>(() => localStorage.getItem(CUSTOM_AUDIO_NAME_KEY));
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(() => localStorage.getItem(CUSTOM_AUDIO_STORAGE_KEY));
  const [isUploading, setIsUploading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          localStorage.setItem(CUSTOM_AUDIO_STORAGE_KEY, dataUrl);
          localStorage.setItem(CUSTOM_AUDIO_NAME_KEY, file.name);
          setCustomAudioUrl(dataUrl);
          setCustomAudioName(file.name);
          soundFx.playSuccess();
        } catch (err) {
          console.warn('File size too large for localStorage, using runtime memory URL', err);
          const objectUrl = URL.createObjectURL(file);
          setCustomAudioUrl(objectUrl);
          setCustomAudioName(file.name);
          soundFx.playSuccess();
        }
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearCustomAudio = () => {
    localStorage.removeItem(CUSTOM_AUDIO_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_AUDIO_NAME_KEY);
    setCustomAudioUrl(null);
    setCustomAudioName(null);
    soundFx.playClick();
  };

  const startBootSequence = () => {
    setBootStep('booting');
    setProgress(0);

    let audioDuration = 3.5; // default fallback duration in seconds

    if (customAudioUrl) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(customAudioUrl);
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            audioDuration = Math.min(Math.max(audio.duration, 2), 12); // clamp between 2 to 12s for crisp boot
          }
        };

        audio.play().catch(() => {
          // If autoplay blocked, fall back to synthesized audio
          soundFx.playPortalStartupAudio();
        });
      } catch {
        soundFx.playPortalStartupAudio();
      }
    } else {
      // Play default Sci-Fi Synthesizer Power-Up Chime
      soundFx.playPortalStartupAudio();
    }

    const logs = [
      { p: 15, log: "INITIALIZING QUANTUM CORE..." },
      { p: 35, log: "CHARGING STARK ARC REACTOR..." },
      { p: 55, log: "SYNCHRONIZING NEURAL MATRIX..." },
      { p: 78, log: "ESTABLISHING SECURE PROTOCOLS..." },
      { p: 95, log: "BARLIN'S GPT ONLINE 100%..." },
      { p: 100, log: "PORTAL ACCESS GRANTED." }
    ];

    let currentLogIndex = 0;
    const totalIntervalMs = (audioDuration * 1000) / 100;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (logs[currentLogIndex] && next >= logs[currentLogIndex].p) {
          setCurrentStatusLog(logs[currentLogIndex].log);
          currentLogIndex++;
        }
        if (next >= 100) {
          clearInterval(interval);
          finishBoot();
          return 100;
        }
        return next;
      });
    }, totalIntervalMs);
  };

  const finishBoot = () => {
    setTimeout(() => {
      setBootStep('finished');
      
      // Speak Personalized Time Greeting AFTER Sound & Animation
      const greeting = getTimeGreeting();
      const nameText = userName.trim() || 'Agyat';
      const welcomeSpeech = `${greeting}, ${nameText}! Welcome to Barlin's GPT Command Portal. All tactical systems are online and operational.`;
      
      jarvisVoice.speak(welcomeSpeech);

      // Transition to portal
      setTimeout(() => {
        onComplete();
      }, 1200);

    }, 300);
  };

  useEffect(() => {
    if (autoStart) {
      const t = setTimeout(() => {
        startBootSequence();
      }, 300);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#02050a] flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden animate-fadeIn">
      
      {/* Background Cyber Glow Grid & Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f3ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff08_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Center Interactive Arc Reactor Holographic Core */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center space-y-5">
        
        {/* Arc Reactor Graphic with Dynamic Equalizer */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center my-2">
          
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full border-2 border-[#00f3ff22] shadow-[0_0_60px_rgba(0,243,255,0.3)] animate-pulse" />
          
          {/* Outer Rotating Ring */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/50 border-dashed animate-spin-slow" />
          
          {/* Reverse Inner Ring */}
          <div className="absolute inset-5 rounded-full border-2 border-dashed border-[#00f3ff88] animate-spin-reverse" />
          
          {/* Core Energy Center */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#00f3ff] bg-cyan-950/80 shadow-[inset_0_0_25px_#00f3ff,0_0_30px_#00f3ff] flex flex-col items-center justify-center">
            <Zap className="w-7 h-7 text-[#00f3ff] animate-pulse filter drop-shadow-[0_0_12px_#00f3ff]" />
            <span className="text-[10px] font-black text-[#00f3ff] tracking-widest mt-1">
              {progress}%
            </span>
          </div>
        </div>

        {/* Portal Name & Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f3ff1a] border border-[#00f3ff44] text-[10px] text-[#00f3ff] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>PORTAL INITIALIZATION PROTOCOL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-white font-orbitron uppercase filter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            BARLIN'S GPT PORTAL
          </h1>
          <p className="text-xs text-cyan-200/80 font-mono">
            COMMAND CENTER • SPONSORED BY AGYAT VYUH COMMUNITY
          </p>
        </div>

        {/* Dynamic Waveform Equalizer Display */}
        <div className="flex items-center justify-center gap-1.5 h-6 my-1">
          {[40, 75, 100, 60, 90, 45, 80, 100, 65, 35, 85, 50].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-[#00f3ff] rounded-full transition-all duration-150 shadow-[0_0_8px_#00f3ff]"
              style={{
                height: bootStep === 'booting' ? `${Math.max(15, (h * (progress % 20 + 5)) / 25)}%` : '20%',
                opacity: bootStep === 'booting' ? 0.9 : 0.3
              }}
            />
          ))}
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-md space-y-2.5 bg-[#050b14] p-4 rounded-xl border border-[#00f3ff33] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span className="text-[#00f3ff] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{currentStatusLog}</span>
            </span>
            <span className="text-cyan-300 font-mono">{progress}%</span>
          </div>

          {/* Progress Fill Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#0a1526] border border-[#00f3ff44] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-[#00f3ff] shadow-[0_0_15px_#00f3ff] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Active Audio File Status & Custom Upload Control */}
          <div className="pt-2 border-t border-cyan-900/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate font-semibold">
                  AUDIO: <strong className="text-cyan-200">{customAudioName || "Synthesizer Power-Up"}</strong>
                </span>
              </div>

              {customAudioName ? (
                <button
                  onClick={clearCustomAudio}
                  className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1 underline cursor-pointer"
                  title="Reset to default audio"
                >
                  <X className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-0.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 rounded text-[10px] text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Custom MP3</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            {/* Operator Info */}
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>OPERATOR: <strong className="text-white uppercase">{userName}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>VOICE & MUSIC ACTIVE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Manual Boot or Skip Button */}
        {bootStep === 'ready' && (
          <button
            onClick={startBootSequence}
            className="px-6 py-3 rounded-xl bg-[#00f3ff] hover:bg-white text-black font-black text-xs tracking-widest uppercase transition flex items-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.6)] cursor-pointer"
          >
            <Power className="w-4 h-4" />
            <span>START PORTAL BOOT SEQUENCE</span>
          </button>
        )}

        {bootStep === 'booting' && (
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              soundFx.playSuccess();
              onComplete();
            }}
            className="text-xs text-gray-400 hover:text-[#00f3ff] underline cursor-pointer transition pt-1"
          >
            [ Skip Startup Animation & Sound ]
          </button>
        )}

        {bootStep === 'finished' && (
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PORTAL READY • LAUNCHING COMMAND CENTER...</span>
          </div>
        )}

      </div>

    </div>
  );
};
