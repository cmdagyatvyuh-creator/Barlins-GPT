import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, PhoneCall, Mic, MicOff, Volume2, UserPlus, Trash2, X, Activity, User, ShieldCheck, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
}

const DEFAULT_CONTACTS: ContactItem[] = [
  { id: 'c1', name: 'Agyat (Community Admin)', phone: '+91 98765 43210', relation: 'AGYAT VYUH HQ', avatar: '🛡️' },
  { id: 'c2', name: 'BARLIN GPT Core', phone: '000-BARLIN-AI', relation: 'AI Command Assistant', avatar: '🤖' },
  { id: 'c3', name: 'Mom / Mummy', phone: '+91 91234 56789', relation: 'Family', avatar: '❤️' },
  { id: 'c4', name: 'Best Friend', phone: '+91 99887 76655', relation: 'Buddy', avatar: '⭐' },
  { id: 'c5', name: 'JARVIS Hotlline', phone: '108-JARVIS', relation: 'Tactical Support', avatar: '⚡' },
];

interface VoiceCallDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContactName?: string | null;
  userName?: string;
  onSendCallSummaryToChat?: (summaryText: string) => void;
}

export const VoiceCallDialerModal: React.FC<VoiceCallDialerModalProps> = ({
  isOpen,
  onClose,
  targetContactName = null,
  userName = 'Sir',
  onSendCallSummaryToChat,
}) => {
  const [contacts, setContacts] = useState<ContactItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barlin_contacts');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_CONTACTS;
  });

  const [activeCall, setActiveCall] = useState<{
    contact: ContactItem;
    status: 'RINGING' | 'CONNECTED' | 'ENDED';
  } | null>(null);

  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRelation, setNewContactRelation] = useState<string>('');
  const [showAddContact, setShowAddContact] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('barlin_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Handle auto-trigger if targetContactName prop is passed
  useEffect(() => {
    if (isOpen && targetContactName) {
      const found = contacts.find((c) =>
        c.name.toLowerCase().includes(targetContactName.toLowerCase()) ||
        c.relation.toLowerCase().includes(targetContactName.toLowerCase())
      ) || {
        id: `c-temp-${Date.now()}`,
        name: targetContactName,
        phone: '+91 ENCRYPTED LINK',
        relation: 'Contact Link',
        avatar: '📞',
      };

      startCall(found);
    }
  }, [isOpen, targetContactName]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const startCall = (contact: ContactItem) => {
    soundFx.playSuccess();
    setActiveCall({ contact, status: 'RINGING' });
    setCallDuration(0);

    jarvisVoice.speak(`Initiating secure call frequency to ${contact.name}...`);

    setTimeout(() => {
      setActiveCall({ contact, status: 'CONNECTED' });
      soundFx.playSuccess();
      jarvisVoice.speak(`Call connected with ${contact.name}. ${userName}, you are now on encrypted audio link.`);

      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 3000);
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundFx.playClick();

    if (activeCall) {
      const summary = `📞 **VOICE CALL SUMMARY**: Completed encrypted voice call with **${activeCall.contact.name}** (${activeCall.contact.phone}). Duration: **${formatTime(callDuration)}**.`;
      if (onSendCallSummaryToChat) {
        onSendCallSummaryToChat(summary);
      }
      jarvisVoice.speak(`Call ended with ${activeCall.contact.name}.`);
    }

    setActiveCall(null);
    setCallDuration(0);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const newC: ContactItem = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim() || '+91 99000 00000',
      relation: newContactRelation.trim() || 'Contact',
      avatar: '👤',
    };

    setContacts((prev) => [...prev, newC]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setShowAddContact(false);
    soundFx.playSuccess();
  };

  const handleDeleteContact = (id: string) => {
    soundFx.playClick();
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-mono">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#07090d] border-2 border-[#00f3ff] shadow-[0_0_40px_rgba(0,243,255,0.3)] flex flex-col overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#00f3ff08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00f3ff11] border border-[#00f3ff66] text-[#00f3ff] shadow-[0_0_15px_#00f3ff]">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-orbitron text-[#00f3ff] tracking-wider uppercase">
                  CONTACTS & HUD VOICE DIALER
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-sm uppercase border border-emerald-500/40">
                  ENCRYPTED LINK
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                VOICE CALL SIMULATOR • CONTACTS BOOK • SECURE TACTICAL FREQUENCY
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeCall) endCall();
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-[#00f3ff11] hover:bg-red-950/80 border border-[#00f3ff33] hover:border-red-500 text-slate-300 hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIVE CALL VIEW SCREEN */}
        {activeCall ? (
          <div className="p-6 bg-[#030508] flex-1 flex flex-col items-center justify-center text-center relative">
            <div className="w-24 h-24 rounded-full bg-[#00f3ff11] border-2 border-[#00f3ff] flex items-center justify-center text-4xl shadow-[0_0_30px_#00f3ff] mb-4 animate-pulse">
              {activeCall.contact.avatar}
            </div>

            <h3 className="text-xl font-bold font-orbitron text-[#00f3ff] tracking-wide">
              {activeCall.contact.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">{activeCall.contact.phone}</p>
            <span className="px-2.5 py-0.5 mt-2 bg-[#00f3ff11] border border-[#00f3ff44] text-[10px] text-[#00f3ff] uppercase font-bold">
              {activeCall.contact.relation}
            </span>

            {/* Status & Timer */}
            <div className="mt-6 flex flex-col items-center gap-2">
              {activeCall.status === 'RINGING' ? (
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm animate-pulse font-orbitron">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>ESTABLISHING FREQUENCY...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-emerald-400 font-bold text-lg font-orbitron tracking-widest bg-emerald-950/40 px-4 py-1 border border-emerald-500/40 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {formatTime(callDuration)}
                  </div>

                  {/* Audio Waveform Animation */}
                  <div className="flex items-center gap-1 h-8 mt-2">
                    {[16, 28, 12, 32, 20, 36, 18, 24, 30, 14, 26].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-[#00f3ff] rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="mt-8 flex items-center gap-6">
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  soundFx.playClick();
                }}
                className={`p-4 rounded-full border transition ${
                  isMuted
                    ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_#ef4444]'
                    : 'bg-[#00f3ff11] text-[#00f3ff] border-[#00f3ff44] hover:bg-[#00f3ff22]'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={endCall}
                className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white border-2 border-red-400 shadow-[0_0_25px_#ef4444] animate-bounce transition"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        ) : (
          /* CONTACTS LIST & DIALER SCREEN */
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-[#05070a]">
            {/* Top Bar Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-orbitron text-[#00f3ff] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> RECENT CONTACTS ({contacts.length})
              </h3>

              <button
                onClick={() => {
                  setShowAddContact(!showAddContact);
                  soundFx.playClick();
                }}
                className="px-3 py-1 bg-[#00f3ff11] hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff44] text-xs font-bold font-orbitron transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showAddContact ? 'CANCEL' : 'ADD CONTACT'}</span>
              </button>
            </div>

            {/* Add Contact Form */}
            {showAddContact && (
              <form
                onSubmit={handleAddContact}
                className="p-3 bg-[#0a0d14] border border-[#00f3ff44] flex flex-col sm:flex-row gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Contact Name *"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full bg-[#000000aa] border border-[#00f3ff33] text-[#00f3ff] px-2.5 py-1 text-xs focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone / Link"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full bg-[#000000aa] border border-[#00f3ff33] text-[#00f3ff] px-2.5 py-1 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Relation / Notes"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full bg-[#000000aa] border border-[#00f3ff33] text-[#00f3ff] px-2.5 py-1 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#00f3ff] text-black font-bold text-xs font-orbitron shrink-0"
                >
                  SAVE
                </button>
              </form>
            )}

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-[#0c0f17] border border-[#00f3ff22] hover:border-[#00f3ff] transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00f3ff11] border border-[#00f3ff44] flex items-center justify-center text-xl shrink-0">
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#00f3ff] font-orbitron truncate max-w-[140px]">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                      <span className="text-[9px] text-slate-500 uppercase">{c.relation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startCall(c)}
                      className="p-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 rounded transition"
                      title={`Call ${c.name}`}
                    >
                      <Phone className="w-4 h-4 fill-current" />
                    </button>
                    {c.id !== 'c2' && (
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-2 bg-red-950/40 hover:bg-red-600 text-slate-400 hover:text-white border border-red-500/30 rounded transition"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-[#07090d] border-t border-[#00f3ff33] flex items-center justify-between text-xs text-slate-400">
          <span>💡 Speak "Call [Name]" in Live Assistant mode to dial automatically.</span>
          <button
            onClick={() => {
              if (activeCall) endCall();
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1 bg-[#00f3ff] text-black font-bold font-orbitron hover:bg-[#66f8ff] transition"
          >
            CLOSE DIALER
          </button>
        </div>

      </div>
    </div>
  );
};
