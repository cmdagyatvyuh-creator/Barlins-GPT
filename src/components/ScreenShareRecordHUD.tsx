import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Video, VideoOff, Disc, Square, Download, Eye, Sparkles, X, RefreshCw, Play } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface ScreenShareRecordHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSnapshotToChat?: (base64Image: string, promptText: string) => void;
}

export const ScreenShareRecordHUD: React.FC<ScreenShareRecordHUDProps> = ({
  isOpen,
  onClose,
  onSendSnapshotToChat,
}) => {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('SCREEN MATRIX STANDBY');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
    soundFx.playClick();
  };

  const stopScreenShare = () => {
    if (isRecording) {
      stopRecording();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsSharing(false);
    setStatusMessage('SCREEN SHARE DISCONNECTED');
  };

  const startScreenShare = async () => {
    try {
      soundFx.playSuccess();
      setStatusMessage('REQUESTING SCREEN SHARE ACCESS...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as any,
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsSharing(true);
      setStatusMessage('SCREEN SHARE LIVE // ENCRYPTED UPLINK');

      // Listen for when user stops screen share from browser bar
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err: any) {
      console.error('Screen share error:', err);
      soundFx.playError();
      setStatusMessage(`SCREEN SHARE CANCELLED OR DENIED: ${err.message || 'Permission denied'}`);
      setIsSharing(false);
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) {
      startScreenShare();
      return;
    }

    try {
      soundFx.playSuccess();
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setStatusMessage('RECORDING COMPLETE // READY FOR DOWNLOAD');
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      setStatusMessage('SCREEN RECORDING IN PROGRESS...');
    } catch (e: any) {
      console.error('Recording error:', e);
      soundFx.playError();
      setStatusMessage('RECORDING FAILED: ' + e.message);
    }
  };

  useEffect(() => {
    return () => {
      stopScreenShare();
    };
  }, []);

  if (!isOpen) return null;

  const captureFrameAndAnalyze = () => {
    if (!videoRef.current || !isSharing) return;

    try {
      soundFx.playSuccess();
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/png');
        if (onSendSnapshotToChat) {
          onSendSnapshotToChat(
            base64Data,
            'I am sharing my current screen snapshot with you, BARLIN. Please analyze this screen content, identify what is shown, summarize key details, and give me recommendations.'
          );
          onClose();
        }
      }
    } catch (e: any) {
      console.error('Capture error:', e);
      soundFx.playError();
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-mono">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#07090d] border-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.3)] flex flex-col overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#00f3ff08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00f3ff11] border border-[#00f3ff66] text-[#00f3ff] shadow-[0_0_15px_#00f3ff]">
              <Monitor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-orbitron text-[#00f3ff] tracking-wider uppercase">
                  SCREEN SHARE & RECORDING HUD
                </h2>
                <span className="px-2 py-0.5 bg-[#00f3ff22] text-[#00f3ff] font-bold text-[10px] rounded-sm uppercase border border-[#00f3ff44]">
                  LIVE VISION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                SHARE SCREEN WITH BARLIN AI • RECORD SESSION DEMOS • SNAPSHOT ANALYSIS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-[#00f3ff11] hover:bg-red-950/80 border border-[#00f3ff33] hover:border-red-500 text-slate-300 hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-[#0a0d14] border-b border-[#00f3ff22] flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSharing ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-slate-300 font-bold tracking-wide">
              {statusMessage}
            </span>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 px-2.5 py-0.5 bg-red-950/80 border border-red-500 text-red-400 font-bold rounded">
              <Disc className="w-4 h-4 animate-spin text-red-500" />
              <span>REC {formatTime(recordingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Main Display Container */}
        <div className="p-4 bg-[#030406] flex-1 flex flex-col items-center justify-center relative min-h-[280px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full max-h-[50vh] object-contain border border-[#00f3ff33] bg-black ${
              isSharing ? 'block' : 'hidden'
            }`}
          />

          {!isSharing && !recordedVideoUrl && (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3">
              <Monitor className="w-16 h-16 text-[#00f3ff33] animate-pulse" />
              <p className="text-sm text-slate-400 font-orbitron">
                NO SCREEN SHARE FEED ACTIVE
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Click "START SCREEN SHARE" to select a window, tab, or entire display. BARLIN AI can inspect your screen via snapshots and help debug code or explain workflow.
              </p>
              <button
                onClick={startScreenShare}
                className="mt-2 px-5 py-2 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition shadow-[0_0_15px_#00f3ff] flex items-center gap-2 uppercase"
              >
                <Monitor className="w-4 h-4" />
                <span>START SCREEN SHARE</span>
              </button>
            </div>
          )}

          {/* Recorded Video Playback Preview */}
          {recordedVideoUrl && !isSharing && (
            <div className="w-full flex flex-col items-center gap-3">
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                <Play className="w-4 h-4" /> RECORDED SCREEN DEMO READY:
              </p>
              <video
                src={recordedVideoUrl}
                controls
                className="w-full max-h-[45vh] border border-emerald-500/50 bg-black"
              />
              <a
                href={recordedVideoUrl}
                download={`BARLIN_ScreenRecording_${Date.now()}.webm`}
                className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs font-orbitron flex items-center gap-2 hover:bg-emerald-400 transition"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD WEBM RECORDING</span>
              </a>
            </div>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 bg-[#07090d] border-t border-[#00f3ff33] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {!isSharing ? (
              <button
                onClick={startScreenShare}
                className="px-4 py-2 bg-[#00f3ff11] hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff66] text-xs font-bold font-orbitron transition flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>SHARE SCREEN</span>
              </button>
            ) : (
              <button
                onClick={stopScreenShare}
                className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 text-xs font-bold font-orbitron transition flex items-center gap-2"
              >
                <VideoOff className="w-4 h-4" />
                <span>STOP SHARE</span>
              </button>
            )}

            {isSharing && !isRecording && (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500 text-xs font-bold font-orbitron transition flex items-center gap-2"
              >
                <Disc className="w-4 h-4" />
                <span>START RECORDING</span>
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600 text-white border border-red-400 text-xs font-bold font-orbitron transition flex items-center gap-2 animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP RECORDING</span>
              </button>
            )}

            {isSharing && onSendSnapshotToChat && (
              <button
                onClick={captureFrameAndAnalyze}
                className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400 text-yellow-300 hover:text-black border border-yellow-400 text-xs font-bold font-orbitron transition flex items-center gap-2 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>ANALYZE SNAPSHOT WITH BARLIN</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition text-xs"
          >
            CLOSE HUD
          </button>
        </div>

      </div>
    </div>
  );
};
