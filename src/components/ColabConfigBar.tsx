import React, { useState } from 'react';
import { ColabConfig, ModelOption } from '../types';
import { soundFx } from '../utils/soundFx';
import {
  Link,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Settings2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap
} from 'lucide-react';

interface ColabConfigBarProps {
  colabConfig: ColabConfig;
  setColabConfig: React.Dispatch<React.SetStateAction<ColabConfig>>;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  systemInstruction: string;
  setSystemInstruction: (s: string) => void;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: "BARLIN GPT - FLASH CORE",
    provider: 'Gemini',
    description: "Ultra-fast neural response with 1M context window.",
    badge: "3.6-FLASH"
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: "BARLIN GPT - PRO REASONER",
    provider: 'Gemini',
    description: "Advanced deep reasoning & complex code synthesis.",
    badge: "3.1-PRO"
  },
  {
    id: 'my-custom-gpt',
    name: "MY CUSTOM GPT PERSONA",
    provider: 'Custom',
    description: "Chat with your tailored GPT prompt persona.",
    badge: "CUSTOM GPT"
  },
  {
    id: 'colab-custom-gpu',
    name: "MY COLAB GPU GPT",
    provider: 'Colab GPU',
    description: "Private GPU inferencing node via Google Colab URL.",
    badge: "COLAB GPU"
  }
];

export const ColabConfigBar: React.FC<ColabConfigBarProps> = ({
  colabConfig,
  setColabConfig,
  selectedModel,
  setSelectedModel,
  temperature,
  setTemperature,
  systemInstruction,
  setSystemInstruction,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pingResultMsg, setPingResultMsg] = useState<string | null>(null);

  const handlePingColab = async () => {
    if (!colabConfig.endpointUrl) {
      setPingResultMsg("Please enter a Google Colab Public URL (e.g., ngrok/localtunnel).");
      return;
    }

    soundFx.playClick();
    setIsTesting(true);
    setPingResultMsg("Testing connection to Colab GPU node...");

    try {
      const res = await fetch("/api/colab/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpointUrl: colabConfig.endpointUrl }),
      });
      const data = await res.json();

      if (data.status === "online") {
        soundFx.playSuccess();
        setColabConfig({
          endpointUrl: data.cleanUrl,
          status: 'online',
          lastPingTime: new Date().toLocaleTimeString(),
          latencyMs: data.latencyMs,
          gpuName: data.gpuName,
          vramUsedGb: data.vramUsedGb,
          vramTotalGb: data.vramTotalGb
        });
        setPingResultMsg(`✅ Connected! GPU: ${data.gpuName} (${data.latencyMs}ms)`);
      } else {
        soundFx.playAlert();
        setColabConfig(prev => ({ ...prev, status: 'error' }));
        setPingResultMsg(`❌ Connection Failed: ${data.message || 'Unable to reach Colab server'}`);
      }
    } catch (err: any) {
      soundFx.playAlert();
      setColabConfig(prev => ({ ...prev, status: 'error' }));
      setPingResultMsg(`❌ Network Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0c10aa] backdrop-blur-xl rounded-xl p-3 md:p-4 border border-[#00f3ff33] font-mono text-xs">
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left: Google Colab GPU URL Input */}
        <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-[#00f3ff] font-bold font-orbitron shrink-0">
            <Link className="w-4 h-4 text-[#00f3ff]" />
            <span>COLAB GPU ENDPOINT:</span>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={colabConfig.endpointUrl}
              onChange={(e) => setColabConfig(prev => ({ ...prev, endpointUrl: e.target.value }))}
              placeholder="https://xxxx.ngrok-free.app (Google Colab URL)"
              className="w-full bg-[#00000088] border border-[#ffffff22] rounded px-3 py-1.5 text-gray-200 placeholder-slate-600 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] font-mono text-xs"
            />
            {colabConfig.status === 'online' && (
              <span className="absolute right-2 top-1.5 text-[10px] text-emerald-400 flex items-center gap-1 bg-[#00f3ff11] px-1.5 py-0.5 border border-[#00f3ff44]">
                <CheckCircle2 className="w-3 h-3" />
                <span>ONLINE</span>
              </span>
            )}
          </div>

          <button
            onClick={handlePingColab}
            disabled={isTesting}
            className="px-3 py-1.5 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff44] text-[#00f3ff] font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-amber-400' : 'text-[#00f3ff]'}`} />
            <span>{isTesting ? 'CONNECTING...' : 'PING GPU'}</span>
          </button>
        </div>

        {/* Right: AI Model Selector & Advanced Settings Toggle */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-[#ffffff11]">
          
          {/* Model Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#00f3ff]" />
              <span className="hidden sm:inline">AI CORE:</span>
            </span>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                soundFx.playClick();
              }}
              className="bg-[#00000088] border border-[#00f3ff44] rounded px-2.5 py-1.5 text-[#00f3ff] font-orbitron text-xs focus:outline-none focus:border-[#00f3ff] cursor-pointer"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-[#050608] text-gray-200">
                  {m.name} ({m.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Controls Toggle */}
          <button
            onClick={() => {
              setShowAdvanced(!showAdvanced);
              soundFx.playClick();
            }}
            className="px-2.5 py-1.5 bg-[#00000088] hover:bg-[#00f3ff11] border border-[#ffffff22] text-slate-300 rounded flex items-center gap-1 transition"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#00f3ff]" />
            <span className="hidden sm:inline">PARAMS</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Ping Notification Banner */}
      {pingResultMsg && (
        <div className="mt-2 p-1.5 rounded bg-[#000000aa] border border-[#00f3ff33] text-[11px] text-gray-300 flex items-center justify-between">
          <span>{pingResultMsg}</span>
          <button onClick={() => setPingResultMsg(null)} className="text-gray-500 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Expandable Parameters Drawer */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-[#00f3ff22] grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#00000066] p-3 rounded">
          
          {/* Temperature Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                TEMPERATURE (CREATIVITY):
              </span>
              <span className="text-amber-400 font-bold">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="accent-[#00f3ff] h-1.5 bg-gray-800 rounded cursor-pointer"
            />
          </div>

          {/* System Instruction Override */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00f3ff]" />
              SYSTEM INSTRUCTION OVERRIDE:
            </span>
            <input
              type="text"
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="System prompt instructions..."
              className="bg-[#00000088] border border-[#00f3ff33] rounded px-2 py-1 text-gray-300 text-[11px] focus:outline-none focus:border-[#00f3ff]"
            />
          </div>

        </div>
      )}

    </div>
  );
};
