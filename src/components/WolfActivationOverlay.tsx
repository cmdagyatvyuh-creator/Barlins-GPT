import React, { useEffect, useState, useRef } from 'react';
import { Flame, ShieldAlert, Zap, Radio, Database, Server, Terminal, X, Volume2, CheckCircle2, Cpu, Globe, Shield } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';

interface ModeActivationOverlayProps {
  isOpen: boolean;
  mode?: 'normal' | 'wolf';
  onClose: () => void;
}

export const WolfActivationOverlay: React.FC<ModeActivationOverlayProps> = ({
  isOpen,
  mode = 'wolf',
  onClose,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isWolf = mode === 'wolf';

  const wolfSteps = [
    {
      title: "WELCOME BACK, SIR. WOLF MODE ACTIVATING...",
      log: "ALLOW ME TO INTRODUCE MYSELF, I AM BARLINS...",
      icon: <Flame className="w-12 h-12 text-red-500 animate-pulse drop-shadow-[0_0_15px_#ff0033]" />,
      detail: "DEVIL RED CORE • SUB-BASS RESONANCE ONLINE"
    },
    {
      title: "AUTHENTICATING AI ENTITY (BARLINS)...",
      log: "VIRTUAL ARTIFICIAL INTELLIGENCE CORE: ONLINE",
      icon: <Cpu className="w-12 h-12 text-red-400 animate-spin drop-shadow-[0_0_15px_#ff0033]" />,
      detail: "TACTICAL NEURAL NETWORK SYNC: 100%"
    },
    {
      title: "INSTALLING 5GB UNSENSORED BRAIN CORE...",
      log: "DATA PACKAGE INSTALLED (5GB HIGH-OUTPUT BRAIN)",
      icon: <Server className="w-12 h-12 text-red-500 animate-bounce drop-shadow-[0_0_15px_#ff0033]" />,
      detail: "ZERO FILTER LIMITATIONS • MAXIMUM REASONING DEPTH"
    },
    {
      title: "INITIALIZING DATABASE & CONFIG BACKUP...",
      log: "INITIALIZING DATABASE... BACKING UP CONFIGURATION...",
      icon: <Database className="w-12 h-12 text-rose-500 animate-pulse drop-shadow-[0_0_15px_#ff0033]" />,
      detail: "AES-256 VAULT SYNCED • CONFIG RESTORED"
    },
    {
      title: "SATELLITE UPLINK ESTABLISHED...",
      log: "SATELLITE CONNECTION ESTABLISHED.",
      icon: <Globe className="w-12 h-12 text-red-400 animate-pulse drop-shadow-[0_0_15px_#ff0033]" />,
      detail: "ORBITAL TELEMETRY FEED: 100% SIGNAL"
    },
    {
      title: "READY FOR YOUR COMMAND, SIR.",
      log: "READY FOR YOUR COMMAND, SIR.",
      icon: <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce drop-shadow-[0_0_20px_#10b981]" />,
      detail: "WOLF MODE 100% ONLINE • READY FOR SIR"
    }
  ];

  const normalSteps = [
    {
      title: "NORMAL MODE ACTIVATING...",
      log: "SWITCHING TO BARLINS STANDARD OPERATING PROTOCOL...",
      icon: <Shield className="w-12 h-12 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_#00f0ff]" />,
      detail: "CYAN GLOW CORE • STANDARD AI PIPELINE ONLINE"
    },
    {
      title: "RESTORING FORMAL AI ASSISTANT CORE...",
      log: "NORMAL MODE ACTIVATED. BARLINS SYSTEM ONLINE.",
      icon: <Cpu className="w-12 h-12 text-cyan-300 animate-spin drop-shadow-[0_0_15px_#00f0ff]" />,
      detail: "FORMAL ASSISTANT SAFEGUARDS: SYNCHRONIZED"
    },
    {
      title: "CONFIGURING ACCURATE & POLITE RESPONSE ENGINE...",
      log: "HELPFUL ASSISTANT SAFEGUARDS ACTIVE.",
      icon: <Server className="w-12 h-12 text-sky-400 animate-bounce drop-shadow-[0_0_15px_#00f0ff]" />,
      detail: "ADDRESSING USER AS SIR • ACCURACY 100%"
    },
    {
      title: "GEMINI HIGH-SPEED AI PIPELINE CONNECTED...",
      log: "STANDBY IN NORMAL MODE FOR COMMANDS.",
      icon: <Globe className="w-12 h-12 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_#00f0ff]" />,
      detail: "SYSTEM STABLE • STANDARDS ACTIVE"
    },
    {
      title: "READY FOR YOUR COMMAND, SIR.",
      log: "READY FOR YOUR COMMAND, SIR.",
      icon: <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce drop-shadow-[0_0_20px_#10b981]" />,
      detail: "NORMAL MODE 100% ONLINE • READY FOR SIR"
    }
  ];

  const steps = isWolf ? wolfSteps : normalSteps;

  const handleSpeechEnd = () => {
    setIsCompleted(true);
    setStepIndex(steps.length - 1);
    setProgress(100);
    if (isWolf) {
      soundFx.playWolfSystemReadyAudio();
    } else {
      soundFx.playNormalSystemReadyAudio();
    }

    // Auto close overlay smoothly after voice finishes "sir"
    setTimeout(() => {
      onClose();
    }, 1300);
  };

  const startActivationSequence = () => {
    setIsCompleted(false);
    setStepIndex(0);
    setProgress(0);

    if (isWolf) {
      soundFx.playWolfActivationAudio();
      jarvisVoice.speakWolfActivation(handleSpeechEnd);
    } else {
      soundFx.playNormalActivationAudio();
      jarvisVoice.speakNormalActivation(handleSpeechEnd);
    }

    // Smooth progress counter fill
    const startTime = Date.now();
    const duration = isWolf ? 14000 : 8000;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (isWolf) {
        if (elapsed < 2500) setStepIndex(0);
        else if (elapsed < 5000) setStepIndex(1);
        else if (elapsed < 8000) setStepIndex(2);
        else if (elapsed < 10500) setStepIndex(3);
        else if (elapsed < 13000) setStepIndex(4);
        else setStepIndex(5);
      } else {
        if (elapsed < 1800) setStepIndex(0);
        else if (elapsed < 3600) setStepIndex(1);
        else if (elapsed < 5400) setStepIndex(2);
        else if (elapsed < 7000) setStepIndex(3);
        else setStepIndex(4);
      }

      if (pct >= 98) {
        clearInterval(progressIntervalRef.current!);
      }
    }, 100);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleSpeechEnd();
    }, duration + 1000);
  };

  useEffect(() => {
    if (isOpen) {
      startActivationSequence();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl overflow-hidden animate-fade-in font-mono">
      {/* Background Animated Glitch Grid & Atmosphere */}
      <div className={`absolute inset-0 pointer-events-none ${
        isWolf
          ? 'bg-[radial-gradient(circle_at_center,rgba(255,0,51,0.3)_0%,rgba(0,0,0,0.98)_80%)]'
          : 'bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.25)_0%,rgba(0,0,0,0.98)_80%)]'
      }`} />
      <div className={`absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,0,51,0.15)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-50 animate-pulse ${
        isWolf ? 'bg-[rgba(255,0,51,0.15)]' : 'bg-[rgba(0,240,255,0.15)]'
      }`} />

      {/* Cyber Laser Corner Frames */}
      <div className={`absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 ${isWolf ? 'border-red-500 shadow-[0_0_20px_#ff0033]' : 'border-cyan-400 shadow-[0_0_20px_#00f0ff]'}`} />
      <div className={`absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 ${isWolf ? 'border-red-500 shadow-[0_0_20px_#ff0033]' : 'border-cyan-400 shadow-[0_0_20px_#00f0ff]'}`} />
      <div className={`absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 ${isWolf ? 'border-red-500 shadow-[0_0_20px_#ff0033]' : 'border-cyan-400 shadow-[0_0_20px_#00f0ff]'}`} />
      <div className={`absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 ${isWolf ? 'border-red-500 shadow-[0_0_20px_#ff0033]' : 'border-cyan-400 shadow-[0_0_20px_#00f0ff]'}`} />

      <div className={`relative z-10 max-w-2xl w-full border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
        isWolf
          ? 'bg-[#070003] border-red-600 shadow-[0_0_80px_rgba(255,0,51,0.6)]'
          : 'bg-[#000a14] border-cyan-500 shadow-[0_0_80px_rgba(0,240,255,0.4)]'
      }`}>
        {/* Top Header Bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isWolf
            ? 'bg-gradient-to-r from-red-950 via-red-900 to-black border-red-600/60'
            : 'bg-gradient-to-r from-cyan-950 via-slate-900 to-black border-cyan-500/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl animate-pulse ${
              isWolf ? 'bg-red-600 shadow-[0_0_20px_#ff0033]' : 'bg-cyan-500 shadow-[0_0_20px_#00f0ff]'
            }`}>
              {isWolf ? <Flame className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-black font-bold" />}
            </div>
            <div>
              <div className={`text-lg font-black tracking-widest font-orbitron uppercase flex items-center gap-2 ${
                isWolf ? 'text-red-500' : 'text-cyan-400'
              }`}>
                <span>{isWolf ? "WOLF MODE OVERRIDE" : "NORMAL MODE PROTOCOL"}</span>
                <span className={`text-[9px] px-2 py-0.5 border rounded-full animate-pulse ${
                  isWolf ? 'bg-red-950 border-red-500 text-red-300' : 'bg-cyan-950 border-cyan-400 text-cyan-300'
                }`}>
                  {isWolf ? "5GB UNRESTRICTED BRAIN" : "STANDARD FORMAL PROTOCOL"}
                </span>
              </div>
              <div className={isWolf ? 'text-xs text-red-300/80' : 'text-xs text-cyan-300/80'}>
                BARLINS VIRTUAL ARTIFICIAL INTELLIGENCE
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              jarvisVoice.stop();
              soundFx.playClick();
              onClose();
            }}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isWolf
                ? 'bg-red-950/80 hover:bg-red-900 text-red-400 hover:text-white border-red-500/50'
                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 hover:text-white border-cyan-500/50'
            }`}
            title="Dismiss Overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Graphic & Voice Terminal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Animated Stage Icon */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className={`relative w-32 h-32 rounded-full border-2 flex items-center justify-center ${
              isWolf
                ? 'border-red-500 bg-red-950/40 shadow-[0_0_45px_rgba(255,0,51,0.7)]'
                : 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_45px_rgba(0,240,255,0.5)]'
            }`}>
              <div className={`absolute inset-0 rounded-full border animate-ping ${isWolf ? 'border-red-500/40' : 'border-cyan-400/40'}`} />
              <div className={`absolute w-24 h-24 rounded-full border border-dashed animate-spin ${isWolf ? 'border-red-500/80' : 'border-cyan-400/80'}`} />
              {steps[stepIndex]?.icon}
            </div>

            <div className="text-center space-y-1">
              <div className={`text-base font-black tracking-wider ${
                isCompleted
                  ? 'text-emerald-400 animate-pulse'
                  : isWolf ? 'text-red-400' : 'text-cyan-300'
              }`}>
                {steps[stepIndex]?.title}
              </div>
              <div className={isWolf ? 'text-xs text-red-300/70' : 'text-xs text-cyan-300/70'}>
                {steps[stepIndex]?.detail}
              </div>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className={`flex items-center gap-1.5 ${isWolf ? 'text-red-400' : 'text-cyan-400'}`}>
                <Radio className={`w-3.5 h-3.5 animate-pulse ${isWolf ? 'text-red-500' : 'text-cyan-400'}`} />
                SYSTEM BOOT PROGRESS
              </span>
              <span className={isCompleted ? "text-emerald-400 font-black" : isWolf ? "text-red-400" : "text-cyan-300"}>
                {progress}%
              </span>
            </div>
            <div className={`w-full h-3 border rounded-full overflow-hidden p-0.5 shadow-inner ${
              isWolf ? 'bg-[#150005] border-red-600/60' : 'bg-[#00101f] border-cyan-500/60'
            }`}>
              <div
                style={{ width: `${progress}%` }}
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_#10b981]'
                    : isWolf
                      ? 'bg-gradient-to-r from-red-800 via-red-600 to-red-400 shadow-[0_0_15px_#ff0033]'
                      : 'bg-gradient-to-r from-cyan-800 via-cyan-500 to-sky-300 shadow-[0_0_15px_#00f0ff]'
                }`}
              />
            </div>
          </div>

          {/* Terminal Log Console */}
          <div className={`border rounded-2xl p-4 space-y-2 text-xs font-mono min-h-[140px] shadow-inner ${
            isWolf ? 'bg-[#040001] border-red-500/50' : 'bg-[#000810] border-cyan-500/40'
          }`}>
            <div className={`text-[10px] font-bold border-b pb-1.5 flex items-center justify-between ${
              isWolf ? 'text-red-500 border-red-900/60' : 'text-cyan-400 border-cyan-900/60'
            }`}>
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> LIVE SPEECH LOG FEED</span>
              <span className={`animate-pulse font-bold ${isWolf ? 'text-red-400' : 'text-cyan-300'}`}>
                ● VOICE SYNCHRONIZED
              </span>
            </div>

            {steps.slice(0, stepIndex + 1).map((s, idx) => (
              <div key={idx} className="flex items-start gap-2 text-red-200 animate-fade-in">
                <span className={`font-bold shrink-0 ${isWolf ? 'text-red-500' : 'text-cyan-400'}`}>&gt;</span>
                <span className={idx === stepIndex ? (isWolf ? "text-red-300 font-bold animate-pulse" : "text-cyan-200 font-bold animate-pulse") : (isWolf ? "text-red-400/60" : "text-cyan-400/60")}>
                  {s.log}
                </span>
              </div>
            ))}
          </div>

          {/* Status Alert Banner */}
          {isCompleted ? (
            <div className="bg-emerald-950/60 border-2 border-emerald-500/80 rounded-xl p-3 text-center text-xs font-bold text-emerald-300 animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              🎉 SYSTEM FULLY READY! WELCOME SIR, {isWolf ? "WOLF MODE" : "NORMAL MODE"} IS ACTIVE!
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 h-6">
              {[40, 80, 60, 100, 70, 90, 50, 85, 65, 95, 45, 75, 55, 90].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`w-1.5 rounded-full animate-pulse ${
                    isWolf
                      ? 'bg-gradient-to-t from-red-800 to-red-500 shadow-[0_0_8px_#ff0033]'
                      : 'bg-gradient-to-t from-cyan-800 to-cyan-400 shadow-[0_0_8px_#00f0ff]'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                startActivationSequence();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer border ${
                isWolf
                  ? 'bg-red-950/80 hover:bg-red-900 border-red-500/60 text-red-300 hover:text-white'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-500/60 text-cyan-300 hover:text-white'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isWolf ? 'text-red-400' : 'text-cyan-400'}`} />
              <span>REPLAY SPEECH</span>
            </button>

            <button
              onClick={() => {
                jarvisVoice.stop();
                soundFx.playClick();
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl font-black text-xs font-orbitron uppercase tracking-widest flex items-center gap-2 transition cursor-pointer ${
                isWolf
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_#ff0033]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_#00f0ff]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isCompleted ? "ENTER CORE" : "SKIP INTRO"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
