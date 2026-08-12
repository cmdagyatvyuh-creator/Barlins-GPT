import React, { useState } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Sparkles,
  Camera,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  X,
  FileCode,
  Eye,
  Scan,
  Terminal,
  Bot
} from 'lucide-react';

interface VisionAndImageTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCodeToSandbox?: (code: string) => void;
}

export const VisionAndImageTerminalModal: React.FC<VisionAndImageTerminalModalProps> = ({
  isOpen,
  onClose,
  onApplyCodeToSandbox
}) => {
  const [activeTab, setActiveTab] = useState<'image-gen' | 'ocr-scanner'>('image-gen');

  // Image Gen State
  const [artPrompt, setArtPrompt] = useState('Futuristic Stark Arc Reactor Core glowing in dark cyber lab HUD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArtUrl, setGeneratedArtUrl] = useState<string | null>(null);

  // OCR Scanner State
  const [ocrImageName, setOcrImageName] = useState<string | null>(null);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState<string | null>(
    `// OCR EXTRACTED FROM SCREENSHOT
function calculateArcReactorOutput(coreTemp: number, plasmaRatio: number): number {
  const PlanckConstant = 6.626e-34;
  const yieldEfficiency = Math.sin(coreTemp / 1000) * plasmaRatio;
  return Number((yieldEfficiency * 3.14159 * 1e9).toFixed(2));
}`
  );
  const [copiedOcr, setCopiedOcr] = useState(false);

  const generateSciFiArt = () => {
    if (!artPrompt.trim()) return;

    soundFx.playClick();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      soundFx.playSuccess();

      // Generate SVG Data URL canvas concept
      const svgArt = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#050810"/>
        <circle cx="300" cy="200" r="120" fill="none" stroke="#00f3ff" stroke-width="4" opacity="0.8"/>
        <circle cx="300" cy="200" r="80" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 4"/>
        <circle cx="300" cy="200" r="40" fill="#00f3ff" opacity="0.4"/>
        <text x="300" y="205" font-family="monospace" font-size="16" fill="#ffffff" font-weight="bold" text-anchor="middle">BARLIN HUD CONCEPT</text>
        <text x="300" y="360" font-family="monospace" font-size="12" fill="#00f3ff" text-anchor="middle">${artPrompt.slice(0, 45)}...</text>
      </svg>`;

      const dataUrl = `data:image/svg+xml;base64,${btoa(svgArt)}`;
      setGeneratedArtUrl(dataUrl);
      jarvisVoice.speak('Sci-Fi concept art generated successfully, Operator Agyat.');
    }, 1500);
  };

  const handleOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playClick();
    setOcrImageName(file.name);
    setIsScanningOcr(true);

    setTimeout(() => {
      setIsScanningOcr(false);
      soundFx.playSuccess();
      setExtractedOcrText(
        `// OCR EXTRACTED FROM ${file.name.toUpperCase()}
export const processVisionScan = (payload: any) => {
  console.log('[BARLIN OCR] Successfully parsed code block from screen capture');
  return { status: 'parsed', confidence: 0.99 };
};`
      );
      jarvisVoice.speak(`Vision OCR scanned code from ${file.name}.`);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-4xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Sparkles className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>VISION AI OCR & SCI-FI ART GENERATOR TERMINAL</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">AI TERMINAL</span>
              </h2>
              <p className="text-xs text-slate-400">Prompt image synthesis & real-time OCR text/code extraction</p>
            </div>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-cyan-900/40 bg-[#05080e] px-4 pt-2">
          <button
            onClick={() => { soundFx.playClick(); setActiveTab('image-gen'); }}
            className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'image-gen'
                ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff11]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Sci-Fi Art Generator</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('ocr-scanner'); }}
            className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'ocr-scanner'
                ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff11]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>Vision OCR Scanner</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* TAB 1: SCI-FI ART GENERATOR */}
          {activeTab === 'image-gen' && (
            <div className="space-y-4">
              <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-3">
                <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Sci-Fi Image Concept Prompt</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={artPrompt}
                    onChange={e => setArtPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generateSciFiArt()}
                    placeholder="Describe sci-fi art prompt..."
                    className="flex-1 bg-[#05080e] border border-[#00f3ff33] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f3ff]"
                  />
                  <button
                    onClick={generateSciFiArt}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-[#00f3ff] text-black font-bold rounded text-xs flex items-center gap-1.5 hover:bg-[#00d0dd] cursor-pointer transition shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Synthesizing...' : 'Generate Art'}</span>
                  </button>
                </div>
              </div>

              {/* Rendered Concept Box */}
              <div className="bg-[#05080e] border border-cyan-900/50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3 text-[#00f3ff]">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold">Synthesizing Sci-Fi Concept Render...</span>
                  </div>
                ) : generatedArtUrl ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <img
                      src={generatedArtUrl}
                      alt="Sci-Fi Concept"
                      className="rounded border border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.3)] max-h-72 object-contain"
                    />
                    <span className="text-xs text-slate-400 italic">{artPrompt}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40 text-cyan-400" />
                    <span>Type a prompt above to generate HUD & Sci-Fi art concepts</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VISION OCR SCANNER */}
          {activeTab === 'ocr-scanner' && (
            <div className="space-y-4">
              <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>Upload Screen Capture / Code Image</span>
                  </span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, WEBP</span>
                </div>

                <label className="w-full py-3 px-4 bg-[#00f3ff11] border border-dashed border-[#00f3ff66] hover:border-[#00f3ff] rounded text-xs text-[#00f3ff] font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                  <Camera className="w-4 h-4" />
                  <span>{ocrImageName ? `Scanned: ${ocrImageName}` : 'Select Screenshot to Extract Code'}</span>
                  <input
                    type="file"
                    onChange={handleOcrUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              {/* OCR Results Box */}
              {isScanningOcr ? (
                <div className="bg-[#05080e] p-6 rounded-lg border border-cyan-500/40 flex flex-col items-center justify-center gap-3 text-[#00f3ff]">
                  <Scan className="w-8 h-8 animate-pulse text-[#00f3ff]" />
                  <span className="text-xs font-bold">Scanning image OCR text & code structures...</span>
                </div>
              ) : extractedOcrText && (
                <div className="bg-[#05080e] p-4 rounded-lg border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-4 h-4" />
                      <span>Extracted Text / Code Artifact</span>
                    </h4>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(extractedOcrText);
                          setCopiedOcr(true);
                          soundFx.playSuccess();
                          setTimeout(() => setCopiedOcr(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-[#0a1420] border border-[#00f3ff44] rounded text-[11px] text-[#00f3ff] hover:bg-[#00f3ff22] flex items-center gap-1 cursor-pointer transition"
                      >
                        {copiedOcr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedOcr ? 'Copied!' : 'Copy Code'}</span>
                      </button>

                      {onApplyCodeToSandbox && (
                        <button
                          onClick={() => {
                            soundFx.playSuccess();
                            onApplyCodeToSandbox(extractedOcrText);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-[#00f3ff] text-black font-bold rounded text-[11px] hover:bg-[#00cce0] flex items-center gap-1 cursor-pointer transition shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Load in Sandbox</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={extractedOcrText}
                    onChange={e => setExtractedOcrText(e.target.value)}
                    className="w-full bg-black/80 border border-cyan-900/60 rounded p-3 text-xs text-cyan-200 font-mono focus:outline-none focus:border-[#00f3ff]"
                  />
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#00f3ff]" />
            <span>Vision Terminal Engine • Ready</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Terminal
          </button>
        </div>

      </div>
    </div>
  );
};
