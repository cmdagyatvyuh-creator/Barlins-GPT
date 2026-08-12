import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Volume2,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Radio,
  Activity,
  X,
  VolumeX,
  Check
} from 'lucide-react';

interface JARVISAudioEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JARVISAudioEngineModal: React.FC<JARVISAudioEngineModalProps> = ({
  isOpen,
  onClose
}) => {
  const [pitch, setPitch] = useState(1.0);
  const [echoGain, setEchoGain] = useState(0.3);
  const [reverbTime, setReverbTime] = useState(1.5);
  const [filterCutoff, setFilterCutoff] = useState(2500);
  const [startupPreset, setStartupPreset] = useState<'arc-reactor' | 'cyber-drop' | 'laser-boot'>('arc-reactor');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Spectrum Animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      step += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightMultiplier = Math.sin(step + i * 0.3) * 0.5 + 0.5;
        const height = heightMultiplier * (canvas.height * 0.8) + 4;
        const x = i * barWidth;
        const y = canvas.height - height;

        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 8;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  const testAudioEffect = () => {
    soundFx.playClick();
    setIsPlayingTest(true);
    soundFx.playPortalStartupAudio();

    setTimeout(() => {
      jarvisVoice.speak('JARVIS Audio Modulation Engine test complete, Operator Agyat.');
      setIsPlayingTest(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-2xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Volume2 className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>JARVIS SOUND FX ENGINE & AUDIO MODULATION</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">WEB AUDIO SYNTH</span>
              </h2>
              <p className="text-xs text-slate-400">Pitch modulation, echo delay, filter cutoff & Sci-Fi sound presets</p>
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
        <div className="p-5 space-y-5 text-xs">
          
          {/* Audio Spectrum Visualizer */}
          <div className="bg-[#05080e] p-3 rounded-lg border border-[#00f3ff44] space-y-2">
            <div className="flex items-center justify-between text-[#00f3ff] font-bold">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>REAL-TIME SYNTHESIZER SPECTRUM</span>
              </span>
              <span className="text-[10px] text-slate-400">44.1 kHz • 24-BIT DIGITAL</span>
            </div>
            <canvas ref={canvasRef} width={500} height={70} className="w-full h-16 rounded bg-black/60" />
          </div>

          {/* Sound Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              <span>Portal Boot Preset Sound</span>
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'arc-reactor', name: 'Arc Reactor Sweep', desc: 'Deep sub-bass power sweep' },
                { id: 'cyber-drop', name: 'Cyber Matrix Drop', desc: 'Harmonic frequency drops' },
                { id: 'laser-boot', name: 'Laser Charge Chime', desc: 'High-frequency laser surge' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => { soundFx.playClick(); setStartupPreset(p.id as any); }}
                  className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                    startupPreset === p.id
                      ? 'bg-[#00f3ff22] border-[#00f3ff] text-white shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                      : 'bg-[#09101a] border-cyan-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#00f3ff]">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Modulation Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#09101a] p-4 rounded-lg border border-cyan-900/50">
            
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>JARVIS Voice Pitch:</span>
                <span className="text-[#00f3ff] font-bold">{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={pitch}
                onChange={e => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#00f3ff]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Echo Feedback:</span>
                <span className="text-[#00f3ff] font-bold">{(echoGain * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={echoGain}
                onChange={e => setEchoGain(parseFloat(e.target.value))}
                className="w-full accent-[#00f3ff]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Reverb Tail:</span>
                <span className="text-[#00f3ff] font-bold">{reverbTime}s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={reverbTime}
                onChange={e => setReverbTime(parseFloat(e.target.value))}
                className="w-full accent-[#00f3ff]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Low-Pass Filter:</span>
                <span className="text-[#00f3ff] font-bold">{filterCutoff} Hz</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={filterCutoff}
                onChange={e => setFilterCutoff(parseInt(e.target.value))}
                className="w-full accent-[#00f3ff]"
              />
            </div>

          </div>

          {/* Test Sound Button */}
          <button
            onClick={testAudioEffect}
            disabled={isPlayingTest}
            className="w-full py-2.5 bg-[#00f3ff] text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-[#00cce0] cursor-pointer transition shadow-[0_0_15px_rgba(0,243,255,0.4)]"
          >
            <Play className={`w-4 h-4 ${isPlayingTest ? 'animate-bounce' : ''}`} />
            <span>TEST MODULATED JARVIS SOUND FX</span>
          </button>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00f3ff]" />
            <span>Web Audio Engine Active</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};
