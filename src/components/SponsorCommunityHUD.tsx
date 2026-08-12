import React from 'react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { soundFx } from '../utils/soundFx';
import {
  ShieldAlert,
  Instagram,
  Github,
  ExternalLink,
  Lock,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

interface SponsorCommunityHUDProps {
  onClose?: () => void;
}

export const SponsorCommunityHUD: React.FC<SponsorCommunityHUDProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0a0c10aa] backdrop-blur-xl rounded-2xl p-6 border-2 border-[#00f3ff55] relative overflow-hidden font-mono shadow-[0_0_40px_rgba(0,243,255,0.2)]">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-radial-dots opacity-20 pointer-events-none" />

      {/* Close Button if opened as modal */}
      {onClose && (
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#000000aa] border border-[#00f3ff44] text-[#00f3ff] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-[#00f3ff11] border border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.4)]">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-widest bg-[#00f3ff11] px-2 py-0.5 border border-[#00f3ff44]">
            OFFICIAL SPONSORSHIP DIRECTIVE
          </span>
          <h2 className="text-2xl font-black font-orbitron text-[#00f3ff] glow-cyan mt-0.5">
            {BRAND_CONFIG.sponsor}
          </h2>
        </div>
      </div>

      {/* Main Sponsorship Text */}
      <div className="p-4 rounded-xl bg-[#00000088] border border-[#00f3ff44] my-4 text-sm text-slate-200 leading-relaxed font-sans">
        <p className="font-semibold text-[#00f3ff]">
          "{BRAND_CONFIG.sponsorshipText}"
        </p>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Product: <strong className="text-white">{BRAND_CONFIG.name}</strong> • Tagline: {BRAND_CONFIG.tagline}
        </p>
      </div>

      {/* Community Links Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
        
        {/* Instagram Link Button */}
        <a
          href={BRAND_CONFIG.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFx.playSuccess()}
          className="p-4 rounded-xl bg-[#000000aa] hover:bg-[#00f3ff11] border border-[#00f3ff44] flex items-center justify-between group transition shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Instagram className="w-6 h-6 text-pink-400 group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold font-orbitron text-white">INSTAGRAM</div>
              <div className="text-[10px] text-slate-300">@agyat.vyuh</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </a>

        {/* GitHub Link Button */}
        <a
          href={BRAND_CONFIG.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFx.playSuccess()}
          className="p-4 rounded-xl bg-[#000000aa] hover:bg-[#00f3ff11] border border-[#00f3ff44] flex items-center justify-between group transition shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 text-white group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold font-orbitron text-white">GITHUB REPO</div>
              <div className="text-[10px] text-slate-300">cmdagyatvyuh-creator</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </a>

      </div>

      {/* Community Access & Perks */}
      <div className="space-y-2 border-t border-[#00f3ff22] pt-4 text-xs">
        <h4 className="font-bold font-orbitron text-[#00f3ff] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          COMMUNITY MEMBER PERKS:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <div className="flex items-center gap-2 bg-[#00000066] p-2 border border-[#ffffff11]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Private Colab GPU API Tunneling</span>
          </div>
          <div className="flex items-center gap-2 bg-[#00000066] p-2 border border-[#ffffff11]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Data Logging & Private Session</span>
          </div>
          <div className="flex items-center gap-2 bg-[#00000066] p-2 border border-[#ffffff11]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tactical Sci-Fi HUD Control Deck</span>
          </div>
          <div className="flex items-center gap-2 bg-[#00000066] p-2 border border-[#ffffff11]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Deep Reasoning & Code Execution</span>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="mt-5 pt-3 border-t border-[#00f3ff22] flex items-center justify-between text-[10px] text-slate-400">
        <span>STATUS: <strong className="text-emerald-400">{BRAND_CONFIG.status}</strong></span>
        <span>VERSION: {BRAND_CONFIG.version}</span>
      </div>

    </div>
  );
};
