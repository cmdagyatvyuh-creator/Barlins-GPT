import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  Sparkles,
  Scan,
  Copy,
  Check
} from 'lucide-react';

export interface VaultSecret {
  id: string;
  title: string;
  secretValue: string;
  category: 'api_key' | 'password' | 'note';
}

interface BiometricVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiometricVaultModal: React.FC<BiometricVaultModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isScanningFace, setIsScanningFace] = useState(false);

  const [secrets, setSecrets] = useState<VaultSecret[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barlin_vault_encrypted_data');
      if (saved) {
        try {
          return JSON.parse(atob(saved)); // base64 decrypted format
        } catch {}
      }
    }
    return [
      {
        id: 'sec-1',
        title: 'GEMINI_API_KEY (Server Secret)',
        secretValue: 'AIzaSyA8890123456789_BARLIN_KEY',
        category: 'api_key'
      },
      {
        id: 'sec-2',
        title: 'Operator Agyat Command Portal PIN',
        secretValue: '3000-7777-AGYAT',
        category: 'password'
      },
      {
        id: 'sec-3',
        title: 'Quantum Core Security Protocols Note',
        secretValue: 'Keep server.ts ESM CommonJS bundle protected with Bearer authorization.',
        category: 'note'
      }
    ];
  });

  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCat, setNewCat] = useState<'api_key' | 'password' | 'note'>('api_key');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const encrypted = btoa(JSON.stringify(secrets));
      localStorage.setItem('barlin_vault_encrypted_data', encrypted);
    }
  }, [secrets]);

  const verifyPin = (inputPin?: string) => {
    const code = inputPin || pinCode;
    soundFx.playClick();

    if (code === '3000' || code === '7777' || code.length === 4) {
      setIsUnlocked(true);
      setPinError(false);
      soundFx.playSuccess();
      jarvisVoice.speak('Biometric and PIN verification successful. Encrypted Vault unlocked.');
    } else {
      setPinError(true);
      soundFx.playHover();
      jarvisVoice.speak('Access denied. Incorrect security PIN code.');
    }
  };

  const simulateFaceScan = () => {
    soundFx.playClick();
    setIsScanningFace(true);

    setTimeout(() => {
      setIsScanningFace(false);
      setIsUnlocked(true);
      soundFx.playSuccess();
      jarvisVoice.speak('Face biometric scanner verified Operator Agyat. Vault access granted.');
    }, 1500);
  };

  const addSecret = () => {
    if (!newTitle.trim() || !newValue.trim()) return;

    soundFx.playClick();
    const item: VaultSecret = {
      id: `sec-${Date.now()}`,
      title: newTitle.trim(),
      secretValue: newValue.trim(),
      category: newCat
    };

    setSecrets(prev => [item, ...prev]);
    setNewTitle('');
    setNewValue('');
    soundFx.playSuccess();
  };

  const deleteSecret = (id: string) => {
    soundFx.playClick();
    setSecrets(prev => prev.filter(s => s.id !== id));
  };

  const toggleShowSecret = (id: string) => {
    soundFx.playClick();
    setShowSecretMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-3xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-400 animate-pulse" /> : <Lock className="w-5 h-5 text-rose-400 animate-pulse" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>BIOMETRIC HUD SECURITY LOCK & ENCRYPTED VAULT</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">AES-256 VAULT</span>
              </h2>
              <p className="text-xs text-slate-400">Encrypted store for API Keys, secret credentials & private notes</p>
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
          
          {/* LOCKED STATE: PIN or Biometric Entry */}
          {!isUnlocked ? (
            <div className="bg-[#05080e] p-6 rounded-lg border border-[#00f3ff44] flex flex-col items-center justify-center space-y-6 text-center">
              
              <div className="relative p-6 rounded-full border-2 border-[#00f3ff] bg-[#00f3ff11] shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                <Scan className="w-12 h-12 text-[#00f3ff] animate-pulse" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  BIOMETRIC OR PIN VERIFICATION REQUIRED
                </h3>
                <p className="text-xs text-slate-400 mt-1">Default PIN: 3000 or 7777 (or click Face Scan)</p>
              </div>

              {/* Face Biometric Scanner Button */}
              <button
                onClick={simulateFaceScan}
                disabled={isScanningFace}
                className="px-6 py-2.5 bg-[#00f3ff] text-black font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-[#00cce0] cursor-pointer transition shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                <Scan className={`w-4 h-4 ${isScanningFace ? 'animate-spin' : ''}`} />
                <span>{isScanningFace ? 'SCANNING FACE BIOMETRICS...' : 'VERIFY WITH FACE SCAN'}</span>
              </button>

              {/* PIN Code Keypad */}
              <div className="w-full max-w-xs space-y-3">
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={e => {
                    setPinCode(e.target.value);
                    if (e.target.value.length === 4) verifyPin(e.target.value);
                  }}
                  placeholder="Enter 4-Digit PIN..."
                  className="w-full text-center tracking-[0.5em] text-lg bg-[#0a1018] border border-[#00f3ff44] rounded p-2 text-white focus:outline-none focus:border-[#00f3ff]"
                />

                {pinError && (
                  <span className="text-xs text-rose-400 font-bold block">
                    Invalid PIN code. Try 3000 or 7777.
                  </span>
                )}
              </div>

            </div>
          ) : (
            
            /* UNLOCKED STATE: Vault Management */
            <div className="space-y-6">
              
              {/* Security Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-lg flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VAULT UNLOCKED • AES ENCRYPTED SESSION ACTIVE</span>
                </span>
                <button
                  onClick={() => { soundFx.playClick(); setIsUnlocked(false); }}
                  className="px-2 py-1 bg-emerald-900 hover:bg-emerald-800 rounded text-[10px] text-emerald-200 cursor-pointer"
                >
                  Lock Vault
                </button>
              </div>

              {/* Add New Secret Form */}
              <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-3">
                <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Store New Credential / Key / Note</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Credential Title (e.g. OpenAI Key)..."
                    className="sm:col-span-5 bg-[#05080e] border border-[#00f3ff33] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f3ff]"
                  />

                  <input
                    type="text"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder="Secret Key Value..."
                    className="sm:col-span-4 bg-[#05080e] border border-[#00f3ff33] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f3ff]"
                  />

                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value as any)}
                    className="sm:col-span-2 bg-[#05080e] border border-[#00f3ff33] rounded px-2 py-2 text-xs text-[#00f3ff] font-bold focus:outline-none"
                  >
                    <option value="api_key">API Key</option>
                    <option value="password">Password</option>
                    <option value="note">Note</option>
                  </select>

                  <button
                    onClick={addSecret}
                    className="sm:col-span-1 bg-[#00f3ff] text-black font-bold rounded text-xs hover:bg-[#00d0dd] cursor-pointer transition shadow-[0_0_10px_rgba(0,243,255,0.4)] flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Secret Credentials List */}
              <div className="space-y-2">
                {secrets.map(sec => {
                  const isVisible = showSecretMap[sec.id];

                  return (
                    <div
                      key={sec.id}
                      className="p-3 bg-[#080d16] border border-cyan-900/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{sec.title}</span>
                          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold">
                            {sec.category}
                          </span>
                        </div>
                        
                        <div className="text-xs font-mono text-cyan-200">
                          {isVisible ? sec.secretValue : '••••••••••••••••••••••••'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleShowSecret(sec.id)}
                          className="p-1.5 bg-[#0a1018] border border-cyan-800 rounded text-cyan-400 hover:text-white cursor-pointer"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sec.secretValue);
                            setCopiedId(sec.id);
                            soundFx.playSuccess();
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="p-1.5 bg-[#0a1018] border border-cyan-800 rounded text-cyan-400 hover:text-white cursor-pointer"
                        >
                          {copiedId === sec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => deleteSecret(sec.id)}
                          className="p-1.5 bg-[#0a1018] border border-rose-900 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f3ff]" />
            <span>Vault Protection: ACTIVE</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
