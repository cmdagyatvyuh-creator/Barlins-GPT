import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Sparkles, X, Eye, Zap, ShieldAlert } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface CameraVisionHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCameraSnapshotToChat?: (base64Image: string, promptText: string) => void;
}

export const CameraVisionHUD: React.FC<CameraVisionHUDProps> = ({
  isOpen,
  onClose,
  onSendCameraSnapshotToChat,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [statusText, setStatusText] = useState<string>('OPTICAL CAMERA SENSOR STANDBY');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    try {
      soundFx.playSuccess();
      setStatusText('INITIALIZING OPTICAL SENSORS...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setStatusText('OPTICAL FEED LIVE // QUANTUM VISION RETICLE ACTIVE');
    } catch (err: any) {
      console.error('Camera access error:', err);
      soundFx.playError();
      setStatusText(`CAMERA ACCESS DENIED: ${err.message || 'Permission required'}`);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen && !isCameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const toggleFacingMode = () => {
    soundFx.playClick();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhotoAndAnalyze = () => {
    if (!videoRef.current || !isCameraActive) return;

    try {
      soundFx.playSuccess();
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.9);
        if (onSendCameraSnapshotToChat) {
          onSendCameraSnapshotToChat(
            base64Data,
            'I am sharing a camera vision snapshot with you, BARLIN. Please examine what is visible in front of the camera, describe objects/people/text, and give me your insights.'
          );
          stopCamera();
          onClose();
        }
      }
    } catch (e: any) {
      console.error('Capture camera error:', e);
      soundFx.playError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-mono">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#07090d] border-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.3)] flex flex-col overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#00f3ff08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00f3ff11] border border-[#00f3ff66] text-[#00f3ff] shadow-[0_0_15px_#00f3ff]">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-orbitron text-[#00f3ff] tracking-wider uppercase">
                  BARLIN OPTICAL VISION SENSOR
                </h2>
                <span className="px-2 py-0.5 bg-[#00f3ff22] text-[#00f3ff] font-bold text-[10px] rounded-sm uppercase border border-[#00f3ff44]">
                  LIVE CAM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                REAL-TIME OBJECT & ENVIRONMENT RECOGNITION VIA GEMINI VISION
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              stopCamera();
              onClose();
            }}
            className="p-1.5 bg-[#00f3ff11] hover:bg-red-950/80 border border-[#00f3ff33] hover:border-red-500 text-slate-300 hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className="px-4 py-2 bg-[#0a0d14] border-b border-[#00f3ff22] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
            <span className="text-slate-300 font-bold">{statusText}</span>
          </div>

          <button
            onClick={toggleFacingMode}
            className="px-2.5 py-1 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff44] text-[#00f3ff] text-[10px] font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>FLIP ({facingMode.toUpperCase()})</span>
          </button>
        </div>

        {/* Camera Feed Container */}
        <div className="p-4 bg-[#030406] flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full max-h-[52vh] object-cover border-2 border-[#00f3ff44] bg-black ${
              isCameraActive ? 'block' : 'hidden'
            }`}
          />

          {/* HUD Overlay Reticle */}
          {isCameraActive && (
            <div className="absolute inset-8 pointer-events-none flex flex-col justify-between border border-[#00f3ff22] p-4">
              <div className="flex justify-between text-[10px] text-[#00f3ff] font-orbitron">
                <span>[CAM-01 ACTIVE]</span>
                <span>FACING: {facingMode.toUpperCase()}</span>
              </div>

              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#00f3ff88] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-ping" />
              </div>

              <div className="flex justify-between text-[10px] text-[#00f3ff] font-orbitron">
                <span>OPTICAL ZOOM 1.0X</span>
                <span>BARLIN VISION READY</span>
              </div>
            </div>
          )}

          {!isCameraActive && (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3">
              <ShieldAlert className="w-14 h-14 text-yellow-400/60 animate-bounce" />
              <p className="text-sm text-slate-300 font-orbitron">
                CAMERA FEED INACTIVE OR PERMISSION REQUIRED
              </p>
              <button
                onClick={startCamera}
                className="px-5 py-2 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition shadow-[0_0_15px_#00f3ff] flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>ENABLE CAMERA FEED</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#07090d] border-t border-[#00f3ff33] flex items-center justify-between gap-3">
          {isCameraActive ? (
            <button
              onClick={capturePhotoAndAnalyze}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold font-orbitron text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.5)] uppercase"
            >
              <Sparkles className="w-4 h-4" />
              <span>CAPTURE SNAPSHOT & SEND TO BARLIN</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-[#00f3ff11] hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff66] text-xs font-bold font-orbitron transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>START CAMERA</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition text-xs shrink-0"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
