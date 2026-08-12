import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Activity,
  Cpu,
  Zap,
  Radio,
  Server,
  RefreshCw,
  X,
  Gauge,
  Flame,
  Shield,
  Layers
} from 'lucide-react';

interface SystemAnalyticsHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemAnalyticsHUD: React.FC<SystemAnalyticsHUDProps> = ({
  isOpen,
  onClose
}) => {
  const [metrics, setMetrics] = useState({
    cpuLoad: 28,
    ramUsedGb: 6.4,
    ramTotalGb: 16.0,
    gpuUsage: 42,
    vramUsedGb: 3.8,
    vramTotalGb: 8.0,
    latencyMs: 14,
    fps: 60,
    apiTokensToday: 14280,
    tempCelsius: 48
  });

  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuLoad: Math.min(100, Math.max(10, prev.cpuLoad + (Math.random() * 8 - 4))),
        gpuUsage: Math.min(100, Math.max(15, prev.gpuUsage + (Math.random() * 10 - 5))),
        latencyMs: Math.min(60, Math.max(8, Math.floor(prev.latencyMs + (Math.random() * 4 - 2)))),
        tempCelsius: Math.min(85, Math.max(38, Math.floor(prev.tempCelsius + (Math.random() * 2 - 1))))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const purgeCache = () => {
    soundFx.playClick();
    setIsPurging(true);

    setTimeout(() => {
      setIsPurging(false);
      soundFx.playSuccess();
      setMetrics(prev => ({
        ...prev,
        ramUsedGb: 3.2,
        vramUsedGb: 1.9,
        cpuLoad: 14
      }));
      jarvisVoice.speak('System memory purge executed. VRAM and heap cleared.');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-4xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Gauge className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>HOLOGRAPHIC SYSTEM PERFORMANCE ANALYTICS</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">LIVE TELEMETRY</span>
              </h2>
              <p className="text-xs text-slate-400">RAM, CPU, GPU VRAM, network latency & token usage gauges</p>
            </div>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Top Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* CPU Load Gauge */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#00f3ff]" /> CPU LOAD
                </span>
                <span className="text-[#00f3ff] font-bold">{metrics.cpuLoad.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-[#00f3ff33]">
                <div
                  className="h-full bg-[#00f3ff] transition-all duration-300"
                  style={{ width: `${metrics.cpuLoad}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">8 Core Octa-Thread Active</span>
            </div>

            {/* RAM Usage Gauge */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-[#00f3ff]" /> RAM HEAP
                </span>
                <span className="text-[#00f3ff] font-bold">{metrics.ramUsedGb.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-[#00f3ff33]">
                <div
                  className="h-full bg-[#00f3ff] transition-all duration-300"
                  style={{ width: `${(metrics.ramUsedGb / metrics.ramTotalGb) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Total {metrics.ramTotalGb} GB</span>
            </div>

            {/* GPU VRAM Gauge */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#00f3ff]" /> GPU VRAM
                </span>
                <span className="text-[#00f3ff] font-bold">{metrics.vramUsedGb.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-[#00f3ff33]">
                <div
                  className="h-full bg-[#00f3ff] transition-all duration-300"
                  style={{ width: `${(metrics.vramUsedGb / metrics.vramTotalGb) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Total {metrics.vramTotalGb} GB</span>
            </div>

            {/* Network Latency Gauge */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" /> LATENCY
                </span>
                <span className="text-emerald-400 font-bold">{metrics.latencyMs} ms</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-emerald-900">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${(metrics.latencyMs / 100) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Cloud Run Ingress</span>
            </div>

          </div>

          {/* Secondary Stats & Cache Purge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#05080e] p-4 rounded-lg border border-cyan-900/50">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">CORE TEMP</span>
                <span className="text-sm font-bold text-white">{metrics.tempCelsius}°C</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">RENDER FPS</span>
                <span className="text-sm font-bold text-white">{metrics.fps} FPS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#00f3ff] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">API TOKENS TODAY</span>
                <span className="text-sm font-bold text-[#00f3ff]">{metrics.apiTokensToday.toLocaleString()} Tokens</span>
              </div>
            </div>
          </div>

          {/* Purge Heap Memory Button */}
          <button
            onClick={purgeCache}
            disabled={isPurging}
            className="w-full py-2.5 bg-[#00f3ff11] border border-[#00f3ff] hover:bg-[#00f3ff22] text-[#00f3ff] font-bold rounded flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            <RefreshCw className={`w-4 h-4 ${isPurging ? 'animate-spin' : ''}`} />
            <span>{isPurging ? 'PURGING MEMORY HEAP...' : 'PURGE VRAM & MEMORY HEAP'}</span>
          </button>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Status: OPTIMAL</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
};
