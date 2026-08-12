import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Sliders, Languages, User, Command } from 'lucide-react';
import { jarvisVoice } from '../utils/jarvisVoice';
import { soundFx } from '../utils/soundFx';

interface JarvisVoiceControlHUDProps {
  isListening: boolean;
  toggleVoiceInput: (lang?: string) => void;
  sttLang: string;
  setSttLang: (lang: string) => void;
  onOpenMegaVoiceModal?: () => void;
}

export const JarvisVoiceControlHUD: React.FC<JarvisVoiceControlHUDProps> = ({
  isListening,
  sttLang,
  setSttLang,
  onOpenMegaVoiceModal,
}) => {
  const [autoRead, setAutoRead] = useState<boolean>(jarvisVoice.config.autoRead);
  const [voiceMode, setVoiceMode] = useState<'jarvis-male' | 'hindi-female' | 'custom'>(jarvisVoice.config.voiceMode);
  const [rate, setRate] = useState<number>(jarvisVoice.config.rate);
  const [pitch, setPitch] = useState<number>(jarvisVoice.config.pitch);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(jarvisVoice.isSpeaking);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');

  useEffect(() => {
    jarvisVoice.setSpeakingCallback((speaking) => {
      setIsSpeaking(speaking);
    });

    const voices = jarvisVoice.getVoicesList();
    setAvailableVoices(voices);
  }, []);

  const handleToggleAutoRead = () => {
    const next = !autoRead;
    setAutoRead(next);
    jarvisVoice.config.autoRead = next;
    soundFx.playClick();
  };

  const handleVoiceModeChange = (mode: 'jarvis-male' | 'hindi-female') => {
    setVoiceMode(mode);
    jarvisVoice.config.voiceMode = mode;
    if (mode === 'hindi-female') {
      jarvisVoice.config.pitch = 1.0;
      setPitch(1.0);
    } else {
      jarvisVoice.config.pitch = 0.85;
      setPitch(0.85);
    }
    soundFx.playClick();
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    jarvisVoice.config.rate = newRate;
  };

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    jarvisVoice.config.pitch = newPitch;
  };

  return (
    <div className="w-full bg-[#0a0c10cc] backdrop-blur-md border-b border-[#00f3ff33] px-3 py-2 font-mono text-xs text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: JARVIS Audio Status Indicator & Waveform */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#00f3ff11] border border-[#00f3ff44] px-2.5 py-1">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#00f3ff] animate-ping' : isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-bold font-orbitron text-[#00f3ff] text-[11px] uppercase tracking-wider">
              {isSpeaking ? 'JARVIS SPEAKING...' : isListening ? 'LISTENING (MIC)...' : 'JARVIS VOICE CORE'}
            </span>
          </div>

          {/* Audio Visualizer Wavebar */}
          <div className="hidden sm:flex items-center gap-0.5 h-4 px-1">
            {[30, 80, 40, 100, 60, 20, 90, 50, 70, 30].map((h, i) => (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-[#00f3ff] shadow-[0_0_5px_#00f3ff] animate-pulse'
                    : isListening
                    ? 'bg-red-500 shadow-[0_0_5px_#ef4444] animate-bounce'
                    : 'bg-slate-700'
                }`}
                style={{
                  height: isSpeaking || isListening ? `${h}%` : '20%',
                  animationDelay: `${i * 0.08}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Center: Simplified Clean Voice Selector */}
        <div className="flex items-center gap-1 bg-[#00000088] p-1 border border-[#ffffff11]">
          <span className="text-[10px] text-slate-400 hidden md:inline ml-1">VOICE TYPE:</span>
          
          <button
            onClick={() => handleVoiceModeChange('jarvis-male')}
            className={`px-2.5 py-1 text-[10px] font-bold transition flex items-center gap-1 ${
              voiceMode === 'jarvis-male'
                ? 'bg-[#00f3ff] text-black shadow-[0_0_8px_#00f3ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎙️ Heavy Male JARVIS</span>
          </button>

          <button
            onClick={() => handleVoiceModeChange('hindi-female')}
            className={`px-2.5 py-1 text-[10px] font-bold transition flex items-center gap-1 ${
              voiceMode === 'hindi-female'
                ? 'bg-[#00f3ff] text-black shadow-[0_0_8px_#00f3ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👩 Smooth Hindi Female</span>
          </button>
        </div>

        {/* Right: Mute & Controls */}
        <div className="flex items-center gap-2">
          
          {/* L.I.N.K. Mark 2/3 Voice Command Matrix Button */}
          {onOpenMegaVoiceModal && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenMegaVoiceModal();
              }}
              className="px-2.5 py-1 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/60 text-yellow-300 hover:text-yellow-200 text-[10px] font-bold font-orbitron flex items-center gap-1.5 transition shadow-[0_0_10px_rgba(250,204,21,0.2)]"
              title="L.I.N.K. Mark-2/3 Mega Voice Command Matrix"
            >
              <Command className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span className="hidden sm:inline">L.I.N.K. MARK-3 COMMANDS</span>
              <span className="sm:hidden">MARK-3</span>
            </button>
          )}

          {/* Stop Speech */}
          {isSpeaking && (
            <button
              onClick={() => jarvisVoice.stop()}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center gap-1 transition animate-pulse"
              title="Stop Speech"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>STOP</span>
            </button>
          )}

          {/* Mute/Unmute */}
          <button
            onClick={handleToggleAutoRead}
            className={`p-1 border transition ${
              autoRead
                ? 'bg-[#00f3ff22] border-[#00f3ff] text-[#00f3ff]'
                : 'bg-[#00000088] border-[#ffffff22] text-slate-500'
            }`}
            title={autoRead ? "Auto-Read Responses ON" : "Auto-Read Responses OFF"}
          >
            {autoRead ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              soundFx.playClick();
            }}
            className="p-1 bg-[#00000088] border border-[#ffffff22] text-slate-300 hover:text-[#00f3ff] transition"
            title="Voice Parameters"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Clean Drawer with Pitch, Speed, & System Voice Picker */}
      {showSettings && (
        <div className="mt-2 pt-2 border-t border-[#00f3ff22] grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#000000aa] p-3">
          
          {/* Rate/Speed Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>SPEED (RATE):</span>
              <span className="text-[#00f3ff] font-bold">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="accent-[#00f3ff] h-1.5 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Pitch Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>PITCH (TONE):</span>
              <span className="text-[#00f3ff] font-bold">{pitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.20"
              step="0.05"
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="accent-[#00f3ff] h-1.5 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* System Voice Dropdown */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>SYSTEM VOICE:</span>
              <span className="text-[#00f3ff] font-bold">{sttLang}</span>
            </div>
            <select
              value={selectedVoiceUri}
              onChange={(e) => {
                const uri = e.target.value;
                setSelectedVoiceUri(uri);
                jarvisVoice.config.selectedVoiceURI = uri;
                soundFx.playClick();
              }}
              className="bg-[#00000088] border border-[#00f3ff44] text-[#00f3ff] text-xs px-2 py-1 font-mono focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#050608] text-white">⚡ Auto Heavy Male JARVIS (Default)</option>
              {availableVoices.map((v, i) => (
                <option key={i} value={v.voiceURI} className="bg-[#050608] text-white">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

        </div>
      )}
    </div>
  );
};
