import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { soundFx } from '../utils/soundFx';
import {
  Server,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Zap,
  Play,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface ColabGuideHUDProps {
  onConnectEndpoint: (url: string) => void;
}

export const ColabGuideHUD: React.FC<ColabGuideHUDProps> = ({ onConnectEndpoint }) => {
  const [script, setScript] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');

  useEffect(() => {
    fetch("/api/colab/notebook-script")
      .then(r => r.json())
      .then(d => setScript(d.script))
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    soundFx.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 font-mono text-xs text-gray-200">
      
      {/* Colab Header Banner */}
      <div className="bg-[#0a0c10aa] backdrop-blur-xl rounded-xl p-5 border border-[#00f3ff33] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-6 h-6 text-[#00f3ff] animate-pulse" />
              <h2 className="text-xl font-bold font-orbitron text-[#00f3ff] glow-cyan">
                GOOGLE COLAB GPU INTEGRATION GUIDE
              </h2>
            </div>
            <p className="text-slate-300 mt-1 max-w-2xl text-xs leading-relaxed">
              Connect your own high-performance Google Colab GPU (NVIDIA T4 / A100) to stream private LLM inference directly to <strong className="text-[#00f3ff]">{BRAND_CONFIG.name}</strong>. Sponsored by <strong className="text-white underline decoration-[#00f3ff]">{BRAND_CONFIG.sponsor}</strong>.
            </p>
          </div>

          <a
            href="https://colab.research.google.com/#create=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#00f3ff] text-black font-black font-orbitron rounded shadow-[0_0_15px_#00f3ff88] hover:bg-cyan-300 flex items-center gap-2 transition shrink-0 uppercase tracking-wider"
          >
            <span>OPEN GOOGLE COLAB</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 3 Step Deployment Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#0a0c10aa] backdrop-blur-xl p-4 rounded-xl border border-[#00f3ff33] flex flex-col gap-2">
          <div className="flex items-center gap-2 font-orbitron font-bold text-[#00f3ff] text-sm">
            <span className="w-6 h-6 rounded bg-[#00f3ff22] border border-[#00f3ff] flex items-center justify-center text-xs">1</span>
            <span>CREATE COLAB NOTEBOOK</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Open Google Colab, create a new Notebook, and go to <strong>Runtime &gt; Change runtime type</strong> and select <strong>T4 GPU</strong> (or A100).
          </p>
        </div>

        <div className="bg-[#0a0c10aa] backdrop-blur-xl p-4 rounded-xl border border-[#00f3ff33] flex flex-col gap-2">
          <div className="flex items-center gap-2 font-orbitron font-bold text-[#00f3ff] text-sm">
            <span className="w-6 h-6 rounded bg-[#00f3ff22] border border-[#00f3ff] flex items-center justify-center text-xs">2</span>
            <span>PASTE & RUN PYTHON SERVER</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Copy the Python server script below, paste it into your Colab code cell, and click <strong>Run Cell (Play)</strong>.
          </p>
        </div>

        <div className="bg-[#0a0c10aa] backdrop-blur-xl p-4 rounded-xl border border-[#00f3ff33] flex flex-col gap-2">
          <div className="flex items-center gap-2 font-orbitron font-bold text-[#00f3ff] text-sm">
            <span className="w-6 h-6 rounded bg-[#00f3ff22] border border-[#00f3ff] flex items-center justify-center text-xs">3</span>
            <span>COPY NGROK PUBLIC URL</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Colab will output a public URL (e.g. <code>https://xxxx.ngrok-free.app</code>). Paste it into the connect bar below!
          </p>
        </div>

      </div>

      {/* Copyable Python Server Script Box */}
      <div className="bg-[#0a0c10aa] backdrop-blur-xl rounded-xl border border-[#00f3ff33] overflow-hidden">
        <div className="bg-[#00f3ff11] border-b border-[#00f3ff22] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f3ff]" />
            <span className="font-bold text-[#00f3ff] font-orbitron">
              GOOGLE COLAB PYTHON BACKEND SCRIPT
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-[#00f3ff] text-black font-bold rounded text-xs flex items-center gap-1.5 transition shadow hover:bg-cyan-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY PYTHON SCRIPT'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#050608] text-slate-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-80">
          <code>{script || `# Loading Python Colab script...`}</code>
        </pre>
      </div>

      {/* Direct Connect Quick Box */}
      <div className="bg-[#0a0c10aa] backdrop-blur-xl p-4 rounded-xl border border-[#00f3ff33] flex flex-col sm:flex-row items-center gap-3">
        <span className="font-bold font-orbitron text-[#00f3ff] shrink-0">
          CONNECT COLAB URL:
        </span>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://xxxx.ngrok-free.app"
          className="flex-1 w-full bg-[#00000088] border border-[#ffffff22] rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f3ff] text-xs font-mono"
        />
        <button
          onClick={() => {
            if (inputUrl) {
              soundFx.playSuccess();
              onConnectEndpoint(inputUrl);
            }
          }}
          className="w-full sm:w-auto px-5 py-2 bg-[#00f3ff] text-black font-black font-orbitron rounded shadow flex items-center justify-center gap-2 transition hover:bg-cyan-300 uppercase tracking-wider"
        >
          <Zap className="w-4 h-4" />
          <span>CONNECT GPU NODE</span>
        </button>
      </div>

    </div>
  );
};
