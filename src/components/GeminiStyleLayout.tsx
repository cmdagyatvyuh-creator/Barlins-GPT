import React, { useState } from 'react';
import { Message, ColabConfig } from '../types';
import { UserProfile } from './UserProfileAuthModal';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Sparkles,
  Plus,
  Search,
  Image as ImageIcon,
  Video,
  Library,
  Pin,
  Settings,
  Palette,
  Mic,
  MicOff,
  Send,
  Paperclip,
  Code,
  Terminal,
  Cpu,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Volume2,
  Copy,
  Check,
  User,
  Zap,
  Globe,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface GeminiStyleLayoutProps {
  messages: Message[];
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSendMessage: (text?: string) => void;
  isGenerating: boolean;
  isListening: boolean;
  onToggleVoiceInput: () => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  colabConfig: ColabConfig;
  userProfile: UserProfile | null;
  onOpenThemeModal: () => void;
  onOpenAuthModal: () => void;
  onClearChat: () => void;
  onOpenCodeSandbox: () => void;
  onOpenColabGuide: () => void;
  onOpenWorldMonitor: () => void;
  onReplayPortalStartup?: () => void;
}

export const GeminiStyleLayout: React.FC<GeminiStyleLayoutProps> = ({
  messages,
  inputPrompt,
  setInputPrompt,
  onSendMessage,
  isGenerating,
  isListening,
  onToggleVoiceInput,
  selectedModel,
  setSelectedModel,
  colabConfig,
  userProfile,
  onOpenThemeModal,
  onOpenAuthModal,
  onClearChat,
  onOpenCodeSandbox,
  onOpenColabGuide,
  onOpenWorldMonitor,
  onReplayPortalStartup
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState<'chat' | 'spark'>('chat');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const userName = userProfile?.name?.trim() || 'Agyat';
  const hasUserMessages = messages.some(m => m.sender === 'user');

  // Sample recent chats matching user screenshot
  const [recentChats] = useState([
    { id: 'rc1', title: 'Do not tuch it', pinned: true },
    { id: 'rc2', title: 'Single File Movie Web App', pinned: false },
    { id: 'rc3', title: 'netlify', pinned: false },
    { id: 'rc4', title: 'Unfiltered Endpoint Ka Kaam Kaise Karega', pinned: false },
    { id: 'rc5', title: 'Uncensored API Banane Ka Tarika', pinned: false },
    { id: 'rc6', title: 'Firebase Auth Aur Firestore Debugging', pinned: false },
    { id: 'rc7', title: 'Meta API Free Access Aur Integration', pinned: false },
    { id: 'rc8', title: 'Realtime Database Rules Unlock Karna', pinned: false },
    { id: 'rc9', title: 'Firebase Social Login Implementation', pinned: false }
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputPrompt.trim() && !isGenerating) {
        onSendMessage();
      }
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    soundFx.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickPrompt = (promptText: string) => {
    soundFx.playClick();
    setInputPrompt(promptText);
    setTimeout(() => {
      onSendMessage(promptText);
    }, 100);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0e0e11] text-[#e3e3e3] font-sans overflow-hidden select-none">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`bg-[#131314] flex flex-col border-r border-[#1e1f20] transition-all duration-300 z-30 shrink-0 ${
          sidebarOpen ? 'w-[260px]' : 'w-0 sm:w-[68px] overflow-hidden'
        }`}
      >
        {/* Top Header Row */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.4)] shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-base text-white tracking-tight truncate">
                Barlin's GPT
              </span>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-full hover:bg-[#282a2d] text-gray-400 hover:text-white transition shrink-0"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>
        </div>

        {/* Chat / Spark Navigation Pill */}
        {sidebarOpen && (
          <div className="mx-3 my-1 p-1 bg-[#1e1f20] rounded-full flex items-center text-xs font-medium text-gray-400">
            <button
              onClick={() => setActiveNavTab('chat')}
              className={`flex-1 py-1.5 rounded-full text-center transition ${
                activeNavTab === 'chat' ? 'bg-[#282a2d] text-white shadow-xs' : 'hover:text-gray-200'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveNavTab('spark')}
              className={`flex-1 py-1.5 rounded-full text-center transition flex items-center justify-center gap-1 ${
                activeNavTab === 'spark' ? 'bg-[#282a2d] text-white shadow-xs' : 'hover:text-gray-200'
              }`}
            >
              <span>Spark</span>
              <span className="text-[9px] uppercase px-1 rounded bg-purple-500/30 text-purple-300 font-bold">BETA</span>
            </button>
          </div>
        )}

        {/* + New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onClearChat();
            }}
            className={`w-full py-2.5 px-3.5 rounded-full bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs font-medium text-white flex items-center gap-2.5 transition shadow-xs ${
              !sidebarOpen && 'justify-center px-0'
            }`}
          >
            <Plus className="w-4 h-4 text-sky-400 shrink-0" />
            {sidebarOpen && <span>New chat</span>}
          </button>
        </div>

        {/* Navigation Tools List */}
        <div className="px-2 py-1 space-y-0.5 text-xs text-gray-300 font-medium">
          <button className={`w-full py-2 px-3 rounded-full hover:bg-[#282a2d] flex items-center gap-3 transition ${!sidebarOpen && 'justify-center px-0'}`}>
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            {sidebarOpen && <span>Search chats</span>}
          </button>
          <button className={`w-full py-2 px-3 rounded-full hover:bg-[#282a2d] flex items-center gap-3 transition ${!sidebarOpen && 'justify-center px-0'}`}>
            <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
            {sidebarOpen && <span>Images</span>}
          </button>
          <button className={`w-full py-2 px-3 rounded-full hover:bg-[#282a2d] flex items-center gap-3 transition ${!sidebarOpen && 'justify-center px-0'}`}>
            <Video className="w-4 h-4 text-gray-400 shrink-0" />
            {sidebarOpen && <span>Videos</span>}
          </button>
          <button className={`w-full py-2 px-3 rounded-full hover:bg-[#282a2d] flex items-center gap-3 transition ${!sidebarOpen && 'justify-center px-0'}`}>
            <Library className="w-4 h-4 text-gray-400 shrink-0" />
            {sidebarOpen && <span>Library</span>}
          </button>
        </div>

        {/* Divider & Notebooks */}
        {sidebarOpen && (
          <div className="px-3 pt-3 pb-1 border-t border-[#1e1f20] mt-2">
            <div className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">Notebooks</div>
            <button className="w-full py-1.5 px-2 text-xs text-gray-300 hover:bg-[#282a2d] rounded-lg flex items-center gap-2 transition">
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <span>New notebook</span>
            </button>
          </div>
        )}

        {/* Recent Chats Section */}
        {sidebarOpen && (
          <div className="px-3 pt-2 flex-1 overflow-y-auto space-y-1">
            <div className="text-[11px] font-medium text-gray-400 mb-1 px-1">Recent</div>
            {recentChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  soundFx.playClick();
                  setInputPrompt(`Load: ${chat.title}`);
                }}
                className="py-1.5 px-2.5 rounded-lg hover:bg-[#282a2d] text-xs text-gray-300 flex items-center justify-between cursor-pointer transition group"
              >
                <span className="truncate pr-1 text-gray-300 group-hover:text-white">{chat.title}</span>
                {chat.pinned ? (
                  <Pin className="w-3 h-3 text-sky-400 shrink-0 rotate-45" />
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-500">•••</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Profile & Theme Control Footer */}
        <div className="p-3 border-t border-[#1e1f20] bg-[#131314] mt-auto">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div
                onClick={onOpenAuthModal}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-[#282a2d] p-1.5 rounded-lg transition"
              >
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-white truncate">{userName}</div>
                  <div className="text-[10px] text-sky-400 font-semibold">Pro Member</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Theme Store Button */}
                <button
                  onClick={() => { soundFx.playClick(); onOpenThemeModal(); }}
                  className="p-1.5 rounded-lg hover:bg-[#282a2d] text-sky-400 hover:text-white transition"
                  title="Theme Gallery / Change Theme"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="p-1.5 rounded-lg hover:bg-[#282a2d] text-gray-400 hover:text-white transition"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => { soundFx.playClick(); onOpenThemeModal(); }}
                className="p-2 rounded-full hover:bg-[#282a2d] text-sky-400"
                title="Theme Store"
              >
                <Palette className="w-5 h-5" />
              </button>
              <div
                onClick={onOpenAuthModal}
                className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col h-full bg-[#0e0e11] relative overflow-hidden">
        
        {/* Top Floating Control Bar */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-[#1b1c1e] bg-[#0e0e11]/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-[#282a2d] text-gray-300 transition"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}

            {/* Active Model Selector Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="px-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs font-semibold text-gray-200 flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Barlin GPT (Flash Core)</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showModelDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1b1e] border border-[#2d2f31] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                  <div
                    onClick={() => { setSelectedModel('gemini-3.6-flash'); setShowModelDropdown(false); }}
                    className="p-2 rounded-lg hover:bg-[#282a2d] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">Barlin Flash Core</div>
                      <div className="text-[10px] text-gray-400">Fast & High Intelligence</div>
                    </div>
                    {selectedModel === 'gemini-3.6-flash' && <Check className="w-4 h-4 text-sky-400" />}
                  </div>
                  <div
                    onClick={() => { setSelectedModel('wolf-5gb-brain'); setShowModelDropdown(false); }}
                    className="p-2 rounded-lg hover:bg-[#30050a] cursor-pointer flex items-center justify-between border border-red-500/30 my-1"
                  >
                    <div>
                      <div className="font-bold text-red-400 flex items-center gap-1">
                        <span>🐺 WOLF 5GB BRAIN</span>
                      </div>
                      <div className="text-[10px] text-red-300/80">Devil Red Unrestricted Core</div>
                    </div>
                    {selectedModel === 'wolf-5gb-brain' && <Check className="w-4 h-4 text-red-500" />}
                  </div>
                  <div
                    onClick={() => { setSelectedModel('colab-gpu'); setShowModelDropdown(false); }}
                    className="p-2 rounded-lg hover:bg-[#282a2d] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-emerald-400">Google Colab GPU</div>
                      <div className="text-[10px] text-gray-400">Private T4/A100 Backend</div>
                    </div>
                    {selectedModel === 'colab-gpu' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Colab Status Badge */}
            <button
              onClick={onOpenColabGuide}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition ${
                colabConfig.status === 'online'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-[#1e1f20] border-[#2d2f31] text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">COLAB GPU:</span>
              <span className="uppercase">{colabConfig.status}</span>
            </button>

            {/* Code Sandbox Toggle */}
            <button
              onClick={onOpenCodeSandbox}
              className="px-2.5 py-1 rounded-full bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition"
              title="Code Sandbox"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Code Sandbox</span>
            </button>

            {/* PORTAL INTRO BOOT REPLAY BUTTON */}
            {onReplayPortalStartup && (
              <button
                onClick={() => { soundFx.playClick(); onReplayPortalStartup(); }}
                className="px-2.5 py-1 rounded-full bg-[#1e1f20] hover:bg-[#282a2d] border border-sky-400/50 text-xs font-semibold text-sky-300 flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(56,189,248,0.2)] cursor-pointer"
                title="Replay Portal Startup Animation & Voice Greeting"
              >
                <Zap className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="hidden sm:inline">Portal Boot</span>
              </button>
            )}

            {/* THEME STORE SWITCHER BUTTON (Allows changing back anytime) */}
            <button
              onClick={() => { soundFx.playClick(); onOpenThemeModal(); }}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 hover:from-sky-500/30 hover:to-pink-500/30 border border-sky-400/40 text-xs font-bold text-sky-300 flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            >
              <Palette className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>THEME GALLERY</span>
            </button>
          </div>
        </header>

        {/* Center Main Stage */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between p-4 sm:p-8 relative">
          
          {/* Subtle Background Glow Effect */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-sky-600/20 via-purple-600/10 to-transparent blur-3xl" />
          </div>

          {!hasUserMessages ? (
            /* HERO / NEW CHAT GEMINI LANDING SCREEN */
            <div className="max-w-3xl w-full mx-auto my-auto flex flex-col items-center justify-center text-center space-y-8 z-10">
              
              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-white font-sans">
                  Hi {userName}, what's the plan?
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-normal max-w-lg mx-auto">
                  Ask Barlin's GPT anything, write code, run deep reasoning, or connect your Google Colab GPU.
                </p>
              </div>

              {/* Main Central Prompt Input Box */}
              <div className="w-full bg-[#1e1f20] hover:bg-[#232427] border border-[#2d2f31] rounded-3xl p-3 shadow-2xl transition-all focus-within:border-sky-500/60 focus-within:ring-2 focus-within:ring-sky-500/20">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Barlin's GPT"
                  rows={2}
                  className="w-full bg-transparent text-white placeholder-gray-500 text-base resize-none focus:outline-none px-3 pt-1 font-sans"
                />

                <div className="flex items-center justify-between pt-2 border-t border-[#2a2c2e] mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-[#2e3033] text-gray-400 hover:text-white transition"
                      title="Attach file / image"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    {/* Model Selector Pill inside input */}
                    <div className="px-2.5 py-1 rounded-full bg-[#282a2d] text-xs font-medium text-gray-300 flex items-center gap-1.5 border border-[#35373a]">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>Flash-Lite</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onToggleVoiceInput}
                      className={`p-2.5 rounded-full transition ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                          : 'hover:bg-[#2e3033] text-gray-400 hover:text-white'
                      }`}
                      title={isListening ? "Listening..." : "Voice input"}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => inputPrompt.trim() && !isGenerating && onSendMessage()}
                      disabled={!inputPrompt.trim() || isGenerating}
                      className={`p-2.5 rounded-full transition ${
                        inputPrompt.trim() && !isGenerating
                          ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-md'
                          : 'bg-[#2a2c2e] text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => handleQuickPrompt("Write a single file React movie web app with clean UI")}
                  className="px-3.5 py-2 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs text-gray-300 transition hover:text-white"
                >
                  🎬 Movie Web App Code
                </button>
                <button
                  onClick={() => handleQuickPrompt("Explain how to setup Firebase Auth with Firestore rules")}
                  className="px-3.5 py-2 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs text-gray-300 transition hover:text-white"
                >
                  🔥 Firebase Auth Guide
                </button>
                <button
                  onClick={() => handleQuickPrompt("How do I connect my Google Colab T4 GPU to Barlin's GPT?")}
                  className="px-3.5 py-2 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2d] border border-[#2d2f31] text-xs text-gray-300 transition hover:text-white"
                >
                  ⚡ Connect Colab GPU
                </button>
              </div>

            </div>
          ) : (
            /* ACTIVE CHAT CONVERSATION STREAM VIEW */
            <div className="max-w-3xl w-full mx-auto space-y-6 pb-24 z-10">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#282a2d] text-white rounded-tr-xs'
                        : 'bg-[#18191b] border border-[#27292c] text-gray-200 rounded-tl-xs shadow-md'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="text-[11px] font-semibold text-sky-400 mb-1 flex items-center justify-between">
                        <span>Barlin's GPT</span>
                        {msg.executionTimeMs && (
                          <span className="text-[10px] text-gray-500">{msg.executionTimeMs}ms</span>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Action Bar for Assistant Messages */}
                    {msg.sender === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-[#25272a] flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copyToClipboard(msg.content, index)}
                            className="hover:text-white flex items-center gap-1 transition"
                          >
                            {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => jarvisVoice.speak(msg.content)}
                            className="hover:text-white flex items-center gap-1 transition"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{msg.modelUsed || 'Barlin Flash'}</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-3 text-sky-400 text-xs font-medium animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <span>Barlin's GPT is processing your prompt...</span>
                </div>
              )}
            </div>
          )}

          {/* FLOATING BOTTOM PROMPT BAR (when messages exist) */}
          {hasUserMessages && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-[#1e1f20] border border-[#2d2f31] rounded-3xl p-2.5 shadow-2xl z-30">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-[#2e3033] text-gray-400 hover:text-white transition">
                  <Plus className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isGenerating && onSendMessage()}
                  placeholder="Ask Barlin's GPT..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none px-2 font-sans"
                />

                <button
                  onClick={onToggleVoiceInput}
                  className={`p-2 rounded-full transition ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-[#2e3033] text-gray-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => inputPrompt.trim() && !isGenerating && onSendMessage()}
                  disabled={!inputPrompt.trim() || isGenerating}
                  className={`p-2 rounded-full transition ${
                    inputPrompt.trim() && !isGenerating ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#2a2c2e] text-gray-600'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
