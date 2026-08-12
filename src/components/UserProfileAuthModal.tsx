import React, { useState } from 'react';
import { User, Lock, Mail, Sparkles, CheckCircle2, ShieldCheck, LogOut, Edit3 } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

export interface UserProfile {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

interface UserProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const UserProfileAuthModal: React.FC<UserProfileAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onLogout,
}) => {
  const [step, setStep] = useState<'auth' | 'name'>(userProfile?.isLoggedIn ? 'name' : 'auth');
  const [email, setEmail] = useState<string>(userProfile?.email || '');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>(userProfile?.name || '');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    soundFx.playClick();
    // Move to step 2 (Ask Name)
    setStep('name');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundFx.playClick();

    const updatedProfile: UserProfile = {
      email: email || 'user@barlingpt.ai',
      name: name.trim(),
      isLoggedIn: true,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-md bg-[#0a0c10] border-2 border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.3)] p-6 overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#00f3ff33]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-orbitron text-[#00f3ff] tracking-wider uppercase">
                {userProfile?.isLoggedIn ? 'EDIT PROFILE' : mode === 'login' ? 'USER LOGIN' : 'CREATE ACCOUNT'}
              </h3>
              <p className="text-[10px] text-slate-400">BARLIN'S GPT SECURITY CLEARANCE</p>
            </div>
          </div>

          {userProfile?.isLoggedIn && (
            <button
              onClick={() => {
                soundFx.playClick();
                onLogout();
                setStep('auth');
              }}
              className="px-2 py-1 bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-400 text-xs flex items-center gap-1 transition"
            >
              <LogOut className="w-3 h-3" />
              <span>LOGOUT</span>
            </button>
          )}
        </div>

        {/* STEP 1: Authentication Form */}
        {step === 'auth' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00f3ff]" />
                <span>EMAIL ADDRESS (जीमेल / ईमेल):</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ashutosh@gmail.com"
                className="w-full bg-[#00000088] border border-[#00f3ff44] text-[#00f3ff] placeholder:text-slate-600 px-3 py-2 text-xs focus:outline-none focus:border-[#00f3ff]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00f3ff]" />
                <span>PASSWORD (पासवर्ड):</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#00000088] border border-[#00f3ff44] text-[#00f3ff] placeholder:text-slate-600 px-3 py-2 text-xs focus:outline-none focus:border-[#00f3ff]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00f3ff] text-black font-bold font-orbitron text-xs tracking-widest hover:bg-[#66f8ff] transition shadow-[0_0_15px_#00f3ff]"
            >
              {mode === 'login' ? 'LOGIN & NEXT ➔' : 'REGISTER & NEXT ➔'}
            </button>

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-[#ffffff11]">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[#00f3ff] underline hover:text-white"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already registered? Login'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Enter Callsign / Name */}
        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="p-3 bg-[#00f3ff11] border border-[#00f3ff33] text-xs text-slate-300 space-y-1">
              <p className="font-bold text-[#00f3ff] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00f3ff]" />
                WELCOME! (अपना नाम दर्ज करें)
              </p>
              <p className="text-[11px] text-slate-400">
                BARLIN'S GPT आपको आपके नाम से संबोधित करेगा (जैसे: Ashutosh, Aman, Suman, Anita)।
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00f3ff]" />
                <span>YOUR NAME (आपका नाम):</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ashutosh, Aman, Suman, Anita"
                className="w-full bg-[#00000088] border-2 border-[#00f3ff] text-[#00f3ff] placeholder:text-slate-600 px-3 py-2 text-sm font-bold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00f3ff] text-black font-bold font-orbitron text-xs tracking-widest hover:bg-[#66f8ff] transition shadow-[0_0_15px_#00f3ff] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ACCESS COMMAND PORTAL</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
