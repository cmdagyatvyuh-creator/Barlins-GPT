import React, { useState } from 'react';
import {
  Mic,
  Zap,
  Radio,
  Terminal,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  X,
  Play,
  Cpu,
  CheckCircle2,
  Command,
  Activity,
  Maximize2
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';

export interface VoiceCommandDefinition {
  id: string;
  category: 'NAVIGATION' | 'CORE' | 'AUDIO' | 'HINDI' | 'TACTICAL';
  phrase: string;
  aliases: string[];
  description: string;
  actionKey: string;
  markVersion: 'MARK-2' | 'MARK-3';
}

export const VOICE_COMMANDS_REGISTRY: VoiceCommandDefinition[] = [
  // CORE & TACTICAL
  {
    id: 'cmd-live-assistant',
    category: 'CORE',
    phrase: 'Live Assistant Mode',
    aliases: ['Live Assistant', 'Google Assistant', 'Toggle Live Mode', 'Activate Assistant'],
    description: 'Enables continuous hands-free voice conversation loop (Google Assistant style).',
    actionKey: 'TOGGLE_LIVE_VOICE',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-overclock',
    category: 'CORE',
    phrase: 'Overclock Core',
    aliases: ['Overclock', 'Enable Overclock', 'Overclock Mode'],
    description: 'Powers up neural processor visualizer and enables maximum speed mode.',
    actionKey: 'OVERCLOCK_CORE',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-clear-chat',
    category: 'TACTICAL',
    phrase: 'Clear Screen',
    aliases: ['Clear Chat', 'Purge History', 'Delete Chat', 'Reset Chat'],
    description: 'Purges conversation log with tactical sound confirmation.',
    actionKey: 'CLEAR_CHAT',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-status-report',
    category: 'TACTICAL',
    phrase: 'Status Report',
    aliases: ['System Diagnostics', 'System Status', 'Diagnostics Report'],
    description: 'Generates and speaks full system, Colab GPU, and memory telemetry.',
    actionKey: 'STATUS_REPORT',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-security-audit',
    category: 'TACTICAL',
    phrase: 'Security Audit',
    aliases: ['Run Audit', 'Code Audit', 'Quantum Security'],
    description: 'Triggers instant automated security and vulnerability analysis query.',
    actionKey: 'SECURITY_AUDIT',
    markVersion: 'MARK-3',
  },

  // NAVIGATION
  {
    id: 'cmd-nav-sandbox',
    category: 'NAVIGATION',
    phrase: 'Open Sandbox',
    aliases: ['Code Sandbox', 'Open Code Editor', 'Show Sandbox'],
    description: 'Switches layout tab directly to full-screen Code Sandbox IDE.',
    actionKey: 'NAV_SANDBOX',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-nav-chat',
    category: 'NAVIGATION',
    phrase: 'Open Chat',
    aliases: ['Show Chat', 'Command Chat', 'Back to Chat'],
    description: 'Switches view to the primary Command Chat interface.',
    actionKey: 'NAV_CHAT',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-nav-colab',
    category: 'NAVIGATION',
    phrase: 'Open Colab',
    aliases: ['Colab Setup', 'GPU Setup', 'Show Colab'],
    description: 'Switches tab to Google Colab GPU endpoint configuration.',
    actionKey: 'NAV_COLAB',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-nav-sponsor',
    category: 'NAVIGATION',
    phrase: 'Sponsor Matrix',
    aliases: ['Open Sponsor', 'Community Sponsor', 'Show Sponsor'],
    description: 'Opens AGYAT VYUH Community Sponsor modal portal.',
    actionKey: 'NAV_SPONSOR',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-nav-profile',
    category: 'NAVIGATION',
    phrase: 'User Profile',
    aliases: ['Edit Profile', 'Login Profile', 'Account Settings'],
    description: 'Opens User Profile & Callsign Registration Modal.',
    actionKey: 'NAV_PROFILE',
    markVersion: 'MARK-3',
  },

  // MEDIA & MEDIA CONTROLS
  {
    id: 'cmd-screen-share',
    category: 'CORE',
    phrase: 'Share Screen',
    aliases: ['Screen Share', 'Record Screen', 'Screen Recording', 'Capture Screen'],
    description: 'Launches Screen Share & WebM Recording HUD with snapshot AI analysis.',
    actionKey: 'SCREEN_SHARE',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-camera-vision',
    category: 'CORE',
    phrase: 'Open Camera',
    aliases: ['Camera Feed', 'Camera Vision', 'Optical Sensor', 'Optical Camera'],
    description: 'Opens live optical camera feed with reticle overlay for visual AI inspection.',
    actionKey: 'CAMERA_VISION',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-voice-call',
    category: 'CORE',
    phrase: 'Voice Call',
    aliases: ['Make Call', 'Call Contact', 'Open Dialer', 'Phone Call', 'Contacts Book'],
    description: 'Launches encrypted HUD Phone Dialer and Contacts voice call link.',
    actionKey: 'VOICE_CALL',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-life-planner',
    category: 'CORE',
    phrase: 'AI Friend Companion',
    aliases: ['Life Planner', 'Mood Check', 'Friend Mode', 'Daily Routine', 'Goal Planner'],
    description: 'Opens AI Best Friend companion modal for mood check-in and goal roadmaps.',
    actionKey: 'LIFE_PLANNER',
    markVersion: 'MARK-3',
  },

  // AUDIO & VOICE
  {
    id: 'cmd-voice-jarvis',
    category: 'AUDIO',
    phrase: 'Jarvis Voice Mode',
    aliases: ['Switch Jarvis', 'Male Voice', 'Heavy Jarvis'],
    description: 'Switches TTS synthesizer to heavy tactical male JARVIS tone.',
    actionKey: 'VOICE_JARVIS',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-voice-hindi',
    category: 'AUDIO',
    phrase: 'Hindi Voice Mode',
    aliases: ['Switch Hindi', 'Female Voice', 'Hindi Female'],
    description: 'Switches TTS synthesizer to smooth Hindi female pitch.',
    actionKey: 'VOICE_HINDI',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-voice-mute',
    category: 'AUDIO',
    phrase: 'Mute Voice',
    aliases: ['Silence Voice', 'Disable Speech', 'Mute Audio'],
    description: 'Silences automated speech synthesis output.',
    actionKey: 'VOICE_MUTE',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-voice-unmute',
    category: 'AUDIO',
    phrase: 'Unmute Voice',
    aliases: ['Enable Speech', 'Unmute Audio', 'Voice On'],
    description: 'Enables real-time automated voice response reading.',
    actionKey: 'VOICE_UNMUTE',
    markVersion: 'MARK-2',
  },
  {
    id: 'cmd-time-check',
    category: 'AUDIO',
    phrase: 'Time Check',
    aliases: ['What time is it', 'Tell me time', 'Current Time'],
    description: 'JARVIS speaks the current local time with personalized user addressing.',
    actionKey: 'TIME_CHECK',
    markVersion: 'MARK-3',
  },

  // BILINGUAL HINDI COMMANDS
  {
    id: 'cmd-hi-clear',
    category: 'HINDI',
    phrase: 'चैट साफ़ करो',
    aliases: ['स्क्रीन साफ़ करो', 'मेसेज डिलीट करो'],
    description: 'चैट हिस्ट्री को तुरंत मिटा देता है।',
    actionKey: 'CLEAR_CHAT',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-hi-time',
    category: 'HINDI',
    phrase: 'समय बताओ',
    aliases: ['कितने बजे हैं', 'टाइम बताओ'],
    description: 'जार्विस बोलकर वर्तमान समय बताएगा।',
    actionKey: 'TIME_CHECK',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-hi-sandbox',
    category: 'HINDI',
    phrase: 'कोड सैंडबॉक्स खोलो',
    aliases: ['सैंडबॉक्स खोलो', 'एडिटर खोलो'],
    description: 'कोड एडिटर सैंडबॉक्स टैब पर स्विच करता है।',
    actionKey: 'NAV_SANDBOX',
    markVersion: 'MARK-3',
  },
  {
    id: 'cmd-hi-status',
    category: 'HINDI',
    phrase: 'स्टेटस रिपोर्ट दो',
    aliases: ['हालचाल बताओ', 'सिस्टम का हाल बताओ'],
    description: 'सिस्टम और जीपीयू का पूरा रिपोर्ट जार्विस बोलेगा।',
    actionKey: 'STATUS_REPORT',
    markVersion: 'MARK-3',
  }
];

interface MegaVoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (actionKey: string, payload?: any) => void;
  isLiveVoiceMode: boolean;
  userName?: string;
}

export const MegaVoiceCommandModal: React.FC<MegaVoiceCommandModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  isLiveVoiceMode,
  userName = 'Sir',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastExecutedLog, setLastExecutedLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['ALL', 'CORE', 'TACTICAL', 'NAVIGATION', 'AUDIO', 'HINDI'];

  const filteredCommands = VOICE_COMMANDS_REGISTRY.filter((cmd) => {
    const matchesCategory = selectedCategory === 'ALL' || cmd.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      cmd.phrase.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.aliases.some((a) => a.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleTestTrigger = (cmd: VoiceCommandDefinition) => {
    soundFx.playSuccess();
    setLastExecutedLog(`[EXECUTED] Command: "${cmd.phrase}" (Protocol ${cmd.markVersion})`);
    onExecuteCommand(cmd.actionKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-mono">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#07090d] border-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.25)] flex flex-col overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#00f3ff08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00f3ff11] border border-[#00f3ff66] text-[#00f3ff] shadow-[0_0_15px_#00f3ff]">
              <Command className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-orbitron text-[#00f3ff] tracking-wider uppercase">
                  L.I.N.K. MARK-2 / MARK-3 MEGA VOICE COMMAND MATRIX
                </h2>
                <span className="px-2 py-0.5 bg-yellow-400 text-black font-bold text-[10px] rounded-sm uppercase">
                  TACTICAL VOICE SUITE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                BARLIN'S GPT SPEECH RECOGNITION & HANDS-FREE DIRECTIVES • USER: <span className="text-[#00f3ff] font-bold">{userName}</span>
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

        {/* Live Audio Status Banner */}
        <div className="px-4 py-2 bg-[#000000aa] border-b border-[#00f3ff22] flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveVoiceMode ? 'bg-yellow-400 animate-ping shadow-[0_0_8px_#facc15]' : 'bg-emerald-400'}`} />
            <span className="text-slate-300">
              STATUS:{' '}
              <span className={`font-bold ${isLiveVoiceMode ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {isLiveVoiceMode ? '🎙️ LIVE ASSISTANT ACTIVE (Hands-Free Listening)' : '⚡ VOICE RECOGNITION READY'}
              </span>
            </span>
          </div>

          {lastExecutedLog && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#00f3ff] bg-[#00f3ff11] px-2.5 py-0.5 border border-[#00f3ff33] truncate max-w-[320px]">
              <Activity className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
              <span className="truncate">{lastExecutedLog}</span>
            </div>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-[#00f3ff22] flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0a0d14]">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  soundFx.playClick();
                }}
                className={`px-3 py-1 text-[11px] font-bold transition border ${
                  selectedCategory === cat
                    ? 'bg-[#00f3ff] text-black border-[#00f3ff] shadow-[0_0_10px_#00f3ff]'
                    : 'bg-[#00000088] text-slate-400 border-[#ffffff22] hover:text-white hover:border-[#00f3ff44]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search triggers (e.g. Sandbox, Clear, Hindi)..."
            className="w-full sm:w-64 bg-[#000000aa] border border-[#00f3ff44] text-[#00f3ff] placeholder:text-slate-600 px-3 py-1.5 text-xs focus:outline-none focus:border-[#00f3ff]"
          />
        </div>

        {/* Commands Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar bg-[#05070a]">
          {filteredCommands.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs">
              NO MATCHING VOICE DIRECTIVES FOUND IN MARK-2 / MARK-3 MATRIX.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                className="bg-[#0c0f17] border border-[#00f3ff33] hover:border-[#00f3ff] p-3.5 flex flex-col justify-between gap-2.5 transition group relative overflow-hidden"
              >
                {/* Subtle Version Tag */}
                <div className="flex items-center justify-between border-b border-[#ffffff11] pb-2">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#00f3ff] group-hover:animate-pulse" />
                    <span className="font-bold text-sm text-[#00f3ff] tracking-wide font-orbitron">
                      "{cmd.phrase}"
                    </span>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                    cmd.markVersion === 'MARK-3'
                      ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50'
                      : 'bg-[#00f3ff11] text-[#00f3ff] border-[#00f3ff44]'
                  }`}>
                    {cmd.markVersion}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cmd.description}
                </p>

                {/* Trigger Aliases */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-slate-500">ALIASES:</span>
                  {cmd.aliases.map((alias, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-[#00000088] border border-[#ffffff11] text-[10px] text-slate-400"
                    >
                      "{alias}"
                    </span>
                  ))}
                </div>

                {/* Test Action Trigger Button */}
                <button
                  onClick={() => handleTestTrigger(cmd)}
                  className="w-full mt-1 py-1.5 bg-[#00f3ff11] hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff44] text-[11px] font-bold transition flex items-center justify-center gap-1.5 uppercase font-orbitron"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>TEST TRIGGER NOW</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#07090d] border-t border-[#00f3ff33] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            💡 TIP: Speak clearly into your microphone when Live Assistant or Mic is active.
          </span>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition"
          >
            CLOSE MATRIX
          </button>
        </div>

      </div>
    </div>
  );
};
