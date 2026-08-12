import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Camera,
  Hand,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';

interface GestureControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextTheme?: () => void;
  onPrevTheme?: () => void;
  onToggleMute?: () => void;
}

export const GestureControlModal: React.FC<GestureControlModalProps> = ({
  isOpen,
  onClose,
  onNextTheme,
  onPrevTheme,
  onToggleMute
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string | null>('👋 OPEN PALM (PAUSE/RESUME)');
  const [sensitivity, setSensitivity] = useState<'high' | 'medium' | 'low'>('high');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startWebcam = async () => {
    soundFx.playClick();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        soundFx.playSuccess();
        jarvisVoice.speak('Gesture control camera feed initialized.');
      }
    } catch {
      setCameraActive(false);
      jarvisVoice.speak('Webcam access unavailable. Simulating gesture control feed.');
    }
  };

  const simulateGestureTrigger = (gestureName: string, actionFn?: () => void) => {
    soundFx.playClick();
    setDetectedGesture(gestureName);
    soundFx.playSuccess();
    if (actionFn) actionFn();
    jarvisVoice.speak(`Gesture detected: ${gestureName}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-3xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Hand className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>WEBCAM GESTURE CONTROL & HAND TRACKING</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">CAMERA AI</span>
              </h2>
              <p className="text-xs text-slate-400">Hands-free navigation: Palm, Fist, Swipe Left/Right & Peace gesture</p>
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
          
          {/* Camera View / Video Overlay Box */}
          <div className="relative bg-[#05080e] border border-[#00f3ff44] rounded-lg overflow-hidden min-h-[220px] flex items-center justify-center">
            
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center text-slate-400">
                <Camera className="w-10 h-10 text-[#00f3ff] animate-pulse" />
                <span className="text-xs font-bold text-white">Gesture Control Camera Inactive</span>
                <button
                  onClick={startWebcam}
                  className="px-4 py-2 bg-[#00f3ff] text-black font-bold text-xs rounded hover:bg-[#00cce0] cursor-pointer transition shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                >
                  Enable Webcam Feed
                </button>
              </div>
            )}

            {/* HUD Skeletal Overlay Box */}
            <div className="absolute inset-4 border border-[#00f3ff66] pointer-events-none rounded flex flex-col justify-between p-2">
              <div className="flex justify-between text-[10px] text-[#00f3ff] font-bold">
                <span>HAND_TRACKING: ACTIVE</span>
                <span>FPS: 30</span>
              </div>
              
              {detectedGesture && (
                <div className="self-center bg-black/80 px-3 py-1 rounded border border-[#00f3ff] text-[#00f3ff] text-xs font-bold animate-bounce">
                  {detectedGesture}
                </div>
              )}

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>X: 240 Y: 180</span>
                <span>CONFIDENCE: 98%</span>
              </div>
            </div>

          </div>

          {/* Interactive Gesture Simulator Controls */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider block">
              Gesture Command Registry (Test Trigger)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              
              <button
                onClick={() => simulateGestureTrigger('👋 OPEN PALM (PAUSE/RESUME)')}
                className="p-3 bg-[#0a1018] border border-cyan-900/50 hover:border-[#00f3ff] rounded text-left cursor-pointer transition"
              >
                <div className="font-bold text-white text-xs">👋 Open Palm</div>
                <div className="text-[10px] text-slate-400 mt-1">Pause / Resume AI</div>
              </button>

              <button
                onClick={() => simulateGestureTrigger('✊ FIST (MUTE/UNMUTE)', onToggleMute)}
                className="p-3 bg-[#0a1018] border border-cyan-900/50 hover:border-[#00f3ff] rounded text-left cursor-pointer transition"
              >
                <div className="font-bold text-white text-xs">✊ Fist</div>
                <div className="text-[10px] text-slate-400 mt-1">Mute / Unmute Audio</div>
              </button>

              <button
                onClick={() => simulateGestureTrigger('👈 SWIPE LEFT (PREV THEME)', onPrevTheme)}
                className="p-3 bg-[#0a1018] border border-cyan-900/50 hover:border-[#00f3ff] rounded text-left cursor-pointer transition"
              >
                <div className="font-bold text-white text-xs">👈 Swipe Left</div>
                <div className="text-[10px] text-slate-400 mt-1">Previous Theme</div>
              </button>

              <button
                onClick={() => simulateGestureTrigger('👉 SWIPE RIGHT (NEXT THEME)', onNextTheme)}
                className="p-3 bg-[#0a1018] border border-cyan-900/50 hover:border-[#00f3ff] rounded text-left cursor-pointer transition"
              >
                <div className="font-bold text-white text-xs">👉 Swipe Right</div>
                <div className="text-[10px] text-slate-400 mt-1">Next Theme</div>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f3ff]" />
            <span>Gesture Tracking Ready</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Gesture HUD
          </button>
        </div>

      </div>
    </div>
  );
};
