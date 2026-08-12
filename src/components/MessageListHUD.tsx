import React, { useState } from 'react';
import { Message } from '../types';
import { BRAND_CONFIG } from '../config/brandConfig';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Bot,
  User,
  Copy,
  Check,
  Play,
  Volume2,
  Terminal,
  Clock,
  Sparkles,
  Code
} from 'lucide-react';

interface MessageListHUDProps {
  messages: Message[];
  isGenerating: boolean;
  onRunCodeInSandbox: (code: string, language: string) => void;
}

export const MessageListHUD: React.FC<MessageListHUDProps> = ({
  messages,
  isGenerating,
  onRunCodeInSandbox,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    soundFx.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id && jarvisVoice.isSpeaking) {
      jarvisVoice.stop();
      setSpeakingId(null);
      return;
    }

    soundFx.playClick();
    setSpeakingId(id);
    
    jarvisVoice.setSpeakingCallback((speaking) => {
      if (!speaking) setSpeakingId(null);
    });

    jarvisVoice.speak(text);
  };

  // Helper to extract code blocks from raw AI message text
  const renderMessageContent = (msg: Message) => {
    const contentText = (msg && typeof msg.content === 'string') ? msg.content : '';
    const parts = contentText.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-3 font-sans text-sm text-gray-200 leading-relaxed">
        {parts.map((part, idx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const firstLine = lines[0].trim();
            let language = 'javascript';
            let code = lines.join('\n');

            if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
              language = firstLine;
              code = lines.slice(1).join('\n');
            }

            const codeId = `${msg.id}-code-${idx}`;

            return (
              <div
                key={idx}
                className="my-3 rounded bg-[#000000aa] border border-[#00f3ff33] overflow-hidden font-mono text-xs shadow-lg"
              >
                {/* Code Block Header */}
                <div className="bg-[#00f3ff11] border-b border-[#00f3ff22] px-3 py-1.5 flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-[#00f3ff] uppercase text-[11px] font-bold">
                    <Code className="w-3.5 h-3.5 text-[#00f3ff]" />
                    {language || 'CODE'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Run in Sandbox Button */}
                    <button
                      onClick={() => {
                        soundFx.playSuccess();
                        onRunCodeInSandbox(code, language);
                      }}
                      className="px-2 py-0.5 bg-[#00f3ff11] hover:bg-[#00f3ff22] border border-[#00f3ff44] text-[#00f3ff] text-[10px] flex items-center gap-1 transition"
                      title="Run code in Tactical Sandbox"
                    >
                      <Play className="w-3 h-3 text-[#00f3ff] fill-current" />
                      <span>RUN IN SANDBOX</span>
                    </button>

                    {/* Copy Code Button */}
                    <button
                      onClick={() => copyToClipboard(code, codeId)}
                      className="p-1 text-slate-400 hover:text-white transition"
                      title="Copy Code"
                    >
                      {copiedId === codeId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono text-xs">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Plain text line break handling
          return (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed">
              {part}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 font-sans">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 font-mono">
          <div className="w-16 h-16 rounded border-2 border-dashed border-[#00f3ff] flex items-center justify-center bg-[#00f3ff11] text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-pulse">
            <Bot className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black font-orbitron text-[#00f3ff] tracking-wider glow-cyan">
              CHAT WITH YOUR GPT IS READY
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Private AI Chat Command Center powered by <strong>{BRAND_CONFIG.name}</strong> & sponsored by <strong className="text-white underline decoration-[#00f3ff]">{BRAND_CONFIG.sponsor}</strong>.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 max-w-sm bg-[#00000088] p-3 border border-[#00f3ff33]">
            Type any question below to chat directly with your GPT model, or switch to your private <strong>Google Colab GPU</strong> node in parameters!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded flex items-center justify-center shrink-0 font-orbitron font-bold text-xs border ${
                  isUser
                    ? 'bg-[#00f3ff11] border-[#00f3ff] text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.4)]'
                    : 'bg-[#00f3ff22] border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-[#00f3ff]" />}
              </div>

              {/* Message Glass Card */}
              <div
                className={`relative flex-1 p-4 rounded border font-mono text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#000000aa] border-[#00f3ff44] text-white'
                    : 'bg-[#00f3ff05] border-[#00f3ff33] text-slate-200 backdrop-blur-sm'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-[#ffffff11] pb-2 mb-2 font-mono text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold font-orbitron ${isUser ? 'text-[#00f3ff]' : 'text-[#00f3ff]'}`}>
                      {isUser ? 'OPERATOR' : BRAND_CONFIG.name}
                    </span>
                    {msg.modelUsed && (
                      <span className="px-1.5 py-0.5 bg-[#00f3ff11] border border-[#00f3ff33] text-[9px] text-[#00f3ff]">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.executionTimeMs && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {msg.executionTimeMs}ms
                      </span>
                    )}

                    {/* Audio Voice Synthesizer Button */}
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className={`p-1 rounded hover:bg-red-950/50 transition ${
                          speakingId === msg.id ? 'text-amber-400 animate-pulse' : 'text-gray-400 hover:text-white'
                        }`}
                        title="Voice Audio Synthesis"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Copy entire message */}
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-1 text-gray-400 hover:text-white transition"
                      title="Copy Message"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                {renderMessageContent(msg)}
              </div>
            </div>
          );
        })
      )}

      {/* Typing / Generating Matrix Indicator */}
      {isGenerating && (
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="w-9 h-9 rounded-lg bg-red-950/90 border border-red-500/80 text-red-400 flex items-center justify-center font-orbitron font-bold text-xs animate-bounce">
            <Bot className="w-5 h-5" />
          </div>

          <div className="cyber-glass p-3 rounded-xl rounded-tl-none border border-red-500/40 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping delay-100" />
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping delay-200" />
            </div>
            <span className="text-xs font-mono text-red-300 tracking-wider">
              {BRAND_CONFIG.name} NEURAL CORE SYNTHESIZING...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
