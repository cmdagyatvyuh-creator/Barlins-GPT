import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { soundFx } from '../utils/soundFx';
import { Cpu, Zap, Activity, Flame, ShieldCheck } from 'lucide-react';

interface ReactorCoreHUDProps {
  isGenerating?: boolean;
  colabStatus?: 'online' | 'disconnected' | 'connecting' | 'error';
  modelName?: string;
  isLiveVoiceMode?: boolean;
  onToggleLiveVoiceMode?: () => void;
}

export const ReactorCoreHUD: React.FC<ReactorCoreHUDProps> = ({
  isGenerating = false,
  colabStatus = 'disconnected',
  modelName = "BARLIN FLASH CORE",
  isLiveVoiceMode = false,
  onToggleLiveVoiceMode,
}) => {
  const [cpuLoad, setCpuLoad] = useState(18);
  const [vramUsed, setVramUsed] = useState(2.8);
  const [temp, setTemp] = useState(42);

  // Dynamic telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      const baseCpu = isGenerating ? 72 : isLiveVoiceMode ? 65 : 18;
      setCpuLoad(Math.min(99, Math.max(8, baseCpu + Math.floor(Math.random() * 12 - 6))));
      
      const baseVram = colabStatus === 'online' ? 6.4 : 2.8;
      setVramUsed(Number((baseVram + (isGenerating ? 1.8 : 0) + (Math.random() * 0.3 - 0.15)).toFixed(1)));
      
      const baseTemp = isGenerating ? 64 : isLiveVoiceMode ? 52 : 42;
      setTemp(Math.min(88, Math.max(35, baseTemp + Math.floor(Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating, colabStatus, isLiveVoiceMode]);

  const handleCoreClick = () => {
    if (onToggleLiveVoiceMode) {
      onToggleLiveVoiceMode();
    }
  };

  return (
    <div className="w-full bg-[#0a0c10aa] backdrop-blur-xl rounded-xl p-4 border border-[#00f3ff33] relative overflow-hidden tactical-corner shadow-[0_0_25px_rgba(0,243,255,0.1)] font-mono">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-radial-dots opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Reactor Core Central Aperture Visualizer */}
        <div className="flex items-center gap-6">
          <div
            onClick={handleCoreClick}
            className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center cursor-pointer group select-none shrink-0"
            title="Click to Toggle Hands-Free Google Assistant Mode (Listening)"
          >
            {/* Outer Rotating Arc Ring 1 */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-colors duration-300 ${
              isLiveVoiceMode ? 'border-yellow-400 animate-spin-slow shadow-[0_0_20px_#facc15]' : 'border-[#00f3ff] animate-spin-slow'
            }`} />

            {/* Inner Rotating Ring 2 (Reverse) */}
            <div className={`absolute inset-2 rounded-full border border-t-amber-400 border-r-transparent animate-spin-reverse ${
              isLiveVoiceMode ? 'border-yellow-400/50' : 'border-[#00f3ff44] border-t-[#00f3ff]'
            }`} />

            {/* Glowing Aperture Blades */}
            <div className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiveVoiceMode
                ? 'bg-yellow-500/20 border-2 border-yellow-400 shadow-[inset_0_0_25px_rgba(250,204,21,0.6)]'
                : 'bg-[#00f3ff11] border border-[#00f3ff88] shadow-[inset_0_0_20px_rgba(0,243,255,0.4)]'
            }`}>
              <svg className="w-full h-full p-2 opacity-80 animate-pulse-glow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke={isLiveVoiceMode ? "rgba(250, 204, 21, 0.8)" : "rgba(0, 243, 255, 0.6)"} strokeWidth="1" fill="none" />
                <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" stroke={isLiveVoiceMode ? "rgba(250, 204, 21, 0.4)" : "rgba(0, 243, 255, 0.3)"} strokeWidth="1" />
              </svg>

              {/* Central Core Eyeball Glow */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-orbitron font-black text-xs transition-all duration-300 ${
                isGenerating
                  ? 'bg-[#00f3ff] text-black shadow-[0_0_30px_rgba(0,243,255,1)] scale-110 animate-ping'
                  : isLiveVoiceMode
                  ? 'bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,1)] scale-110 animate-pulse'
                  : 'bg-[#0a0c10] text-[#00f3ff] border border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.6)] group-hover:scale-105'
              }`}>
                <span>GPT</span>
              </div>
            </div>

            {/* Status Ping Marker */}
            <div className={`absolute -bottom-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 border shadow transition-colors ${
              isLiveVoiceMode
                ? 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_10px_#facc15]'
                : isGenerating
                ? 'bg-[#00f3ff] text-black border-[#00f3ff]'
                : 'bg-[#050608] text-[#00f3ff] border-[#00f3ff44]'
            }`}>
              {isLiveVoiceMode ? '🎙️ LIVE ASSISTANT' : isGenerating ? 'PROCESSING' : 'CORE READY'}
            </div>
          </div>

          {/* Reactor Title & Sponsor Specs */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping" />
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">SYSTEM DIAGNOSTICS MATRIX</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-orbitron text-[#00f3ff] glow-cyan tracking-wide mt-0.5">
              {BRAND_CONFIG.name} CORE
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
              <span className="text-[#00f3ff] font-bold">ACTIVE MODEL:</span>
              <span className="px-2 py-0.5 bg-[#00f3ff11] border border-[#00f3ff44] text-white">
                {modelName}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPONSORED BY <strong className="text-white underline decoration-[#00f3ff]">{BRAND_CONFIG.sponsor}</strong></span>
            </div>
          </div>
        </div>

        {/* Telemetry Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          
          {/* CPU Usage Gauge */}
          <div className="p-2.5 bg-[#00000088] border border-[#ffffff11] flex flex-col items-center min-w-[95px]">
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              <Cpu className="w-3 h-3 text-[#00f3ff]" />
              <span>NEURAL LOAD</span>
            </div>
            <span className="text-base font-bold font-orbitron text-[#00f3ff] mt-0.5">
              {cpuLoad}%
            </span>
            <div className="w-full bg-[#ffffff11] h-1 mt-1 overflow-hidden">
              <div className="bg-[#00f3ff] h-full shadow-[0_0_8px_#00f3ff] transition-all duration-500" style={{ width: `${cpuLoad}%` }} />
            </div>
          </div>

          {/* VRAM Meter */}
          <div className="p-2.5 bg-[#00000088] border border-[#ffffff11] flex flex-col items-center min-w-[95px]">
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>GPU CACHE</span>
            </div>
            <span className="text-base font-bold font-orbitron text-cyan-400 mt-0.5">
              {vramUsed} GB
            </span>
            <div className="w-full bg-[#ffffff11] h-1 mt-1 overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${(vramUsed / 16) * 100}%` }} />
            </div>
          </div>

          {/* Core Temperature */}
          <div className="p-2.5 bg-[#00000088] border border-[#ffffff11] flex flex-col items-center min-w-[95px]">
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>LATENCY</span>
            </div>
            <span className={`text-base font-bold font-orbitron mt-0.5 ${temp > 75 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {temp}ms
            </span>
            <div className="w-full bg-[#ffffff11] h-1 mt-1 overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${(temp / 100) * 100}%` }} />
            </div>
          </div>

          {/* Network Health */}
          <div className="p-2.5 bg-[#00000088] border border-[#ffffff11] flex flex-col items-center min-w-[95px]">
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>COLAB UPLINK</span>
            </div>
            <span className={`text-[10px] font-bold font-orbitron uppercase mt-1 px-1.5 py-0.5 ${
              colabStatus === 'online' ? 'bg-[#00f3ff11] text-[#00f3ff] border border-[#00f3ff44]' : 'bg-[#ffffff05] text-slate-400 border border-[#ffffff11]'
            }`}>
              {colabStatus === 'online' ? 'SECURE_TUNNEL' : 'STANDBY'}
            </span>
          </div>

        </div>

      </div>

      {/* Animated Waveform Equalizer Bar when AI is generating */}
      {isGenerating && (
        <div className="mt-3 pt-2 border-t border-[#00f3ff33] flex items-center justify-between gap-1 h-6 px-2">
          <span className="text-[10px] font-mono text-[#00f3ff] uppercase animate-pulse">PROCESSING QUERY VIA AGYAT VYUH CLUSTERS...</span>
          <div className="flex items-end gap-1 h-full">
            {[40, 80, 20, 90, 60, 30, 100, 45, 75, 25, 85, 50, 95, 30, 70, 40].map((height, idx) => (
              <div
                key={idx}
                className="w-1 bg-[#00f3ff] rounded-t animate-bounce shadow-[0_0_6px_#00f3ff]"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.4 + (idx % 5) * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
