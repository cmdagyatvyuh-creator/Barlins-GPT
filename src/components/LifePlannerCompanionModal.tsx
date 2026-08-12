import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, CheckSquare, Plus, Trash2, Calendar, Target, BookOpen, Smile, Frown, Flame, Zap, X, Send } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

export interface PlannerTask {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  category: 'ROUTINE' | 'STUDY' | 'GOAL' | 'FITNESS';
}

interface LifePlannerCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onTriggerMoodChat: (promptText: string) => void;
}

export const LifePlannerCompanionModal: React.FC<LifePlannerCompanionModalProps> = ({
  isOpen,
  onClose,
  userName = 'Dost',
  onTriggerMoodChat,
}) => {
  const [activeTab, setActiveTab] = useState<'MOOD' | 'ROUTINE' | 'ROADMAP'>('MOOD');
  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barlin_planner_tasks');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: 't1', time: '07:00 AM', title: 'Morning Workout & Hydration', completed: true, category: 'FITNESS' },
      { id: 't2', time: '09:00 AM', title: 'Full Stack Coding & Project Build', completed: false, category: 'STUDY' },
      { id: 't3', time: '02:00 PM', title: 'AI Research & Colab Testing', completed: false, category: 'GOAL' },
      { id: 't4', time: '09:00 PM', title: 'Evening Reflection & Meditation', completed: false, category: 'ROUTINE' },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskTime, setNewTaskTime] = useState<string>('10:00 AM');
  const [customGoalPrompt, setCustomGoalPrompt] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('barlin_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  if (!isOpen) return null;

  const handleMoodSelect = (moodType: string, label: string) => {
    soundFx.playSuccess();
    let text = '';
    if (moodType === 'SAD') {
      text = `Hi BARLIN, main thoda sad aur low feel kar raha hu. Ek sachhe dost ke jese baat karo, pucho kya hua aur mujhe guide karo please.`;
    } else if (moodType === 'STRESSED') {
      text = `BARLIN, bohot jyada stress aur pressure hai. Meri help karo mind relax karne me aur step-by-step plan banane me.`;
    } else if (moodType === 'MOTIVATED') {
      text = `BARLIN, aaj full energy aur motivation me hu! Chalo milkar mere big career aur coding goals ka master plan banate hain!`;
    } else if (moodType === 'TIRED') {
      text = `Mera mind tired hai, BARLIN. Kuch relaxing thoughts aur light routine advise karo.`;
    } else {
      text = `Main aaj bohot happy hu, BARLIN! Aao mere future plans par discussion karein.`;
    }

    onTriggerMoodChat(text);
    onClose();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const t: PlannerTask = {
      id: `task-${Date.now()}`,
      time: newTaskTime || '12:00 PM',
      title: newTaskTitle.trim(),
      completed: false,
      category: 'GOAL',
    };

    setTasks((prev) => [...prev, t]);
    setNewTaskTitle('');
    soundFx.playSuccess();
  };

  const toggleTask = (id: string) => {
    soundFx.playClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    soundFx.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleGeneratePlanWithAI = (goalType: string) => {
    soundFx.playSuccess();
    const prompt = `Hey BARLIN! As my AI best friend, please generate a detailed step-by-step 7-day action roadmap for my goal: "${goalType}". Give me practical daily habits, study hours, and clear milestones in natural Hindi/English.`;
    onTriggerMoodChat(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-mono">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#07090d] border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.3)] flex flex-col overflow-hidden">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-pink-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-pink-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-500/30 bg-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-500/20 border border-pink-500/60 text-pink-400 shadow-[0_0_15px_#ec4899]">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-orbitron text-pink-400 tracking-wider uppercase">
                  AI BEST FRIEND & LIFE PLANNER
                </h2>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 font-bold text-[10px] rounded-sm uppercase border border-pink-500/40">
                  COMPANION MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                MOOD CHECK-IN • DAILY ROUTINE TASK MANAGER • CAREER & LIFE ROADMAPS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-pink-500/10 hover:bg-red-950/80 border border-pink-500/30 hover:border-red-500 text-slate-300 hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-pink-500/20 bg-[#0a0d14]">
          <button
            onClick={() => {
              setActiveTab('MOOD');
              soundFx.playClick();
            }}
            className={`flex-1 py-2.5 text-xs font-bold font-orbitron transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'MOOD'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>MOOD CHECK & CHAT</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ROUTINE');
              soundFx.playClick();
            }}
            className={`flex-1 py-2.5 text-xs font-bold font-orbitron transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'ROUTINE'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>DAILY ROUTINE ({tasks.filter((t) => t.completed).length}/{tasks.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ROADMAP');
              soundFx.playClick();
            }}
            className={`flex-1 py-2.5 text-xs font-bold font-orbitron transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'ROADMAP'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>GOAL ROADMAPS</span>
          </button>
        </div>

        {/* TAB 1: MOOD CHECK */}
        {activeTab === 'MOOD' && (
          <div className="p-6 bg-[#04060a] flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
            <h3 className="text-lg font-bold font-orbitron text-pink-400">
              KAISE HO AAJ, {userName.toUpperCase()}?
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              BARLIN is here for you as your loyal AI best friend. Select how you feel right now to start a warm, supportive conversation:
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              <button
                onClick={() => handleMoodSelect('SAD', 'Sad / Dukhi')}
                className="p-4 bg-[#0e111a] border border-blue-500/40 hover:border-blue-400 rounded transition flex flex-col items-center gap-2 group hover:bg-blue-950/30"
              >
                <Frown className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-blue-300">😔 SAD / DUKHI</span>
                <span className="text-[10px] text-slate-400">Feeling low or upset</span>
              </button>

              <button
                onClick={() => handleMoodSelect('STRESSED', 'Stressed')}
                className="p-4 bg-[#0e111a] border border-yellow-500/40 hover:border-yellow-400 rounded transition flex flex-col items-center gap-2 group hover:bg-yellow-950/30"
              >
                <Flame className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-yellow-300">😤 STRESSED</span>
                <span className="text-[10px] text-slate-400">Too much pressure</span>
              </button>

              <button
                onClick={() => handleMoodSelect('MOTIVATED', 'Motivated')}
                className="p-4 bg-[#0e111a] border border-emerald-500/40 hover:border-emerald-400 rounded transition flex flex-col items-center gap-2 group hover:bg-emerald-950/30"
              >
                <Zap className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-emerald-300">🚀 MOTIVATED</span>
                <span className="text-[10px] text-slate-400">Ready to conquer</span>
              </button>

              <button
                onClick={() => handleMoodSelect('TIRED', 'Tired')}
                className="p-4 bg-[#0e111a] border border-purple-500/40 hover:border-purple-400 rounded transition flex flex-col items-center gap-2 group hover:bg-purple-950/30"
              >
                <BookOpen className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-purple-300">😴 TIRED</span>
                <span className="text-[10px] text-slate-400">Need relaxation</span>
              </button>

              <button
                onClick={() => handleMoodSelect('HAPPY', 'Happy')}
                className="p-4 bg-[#0e111a] border border-pink-500/40 hover:border-pink-400 rounded transition flex flex-col items-center gap-2 group hover:bg-pink-950/30 col-span-2 sm:col-span-1"
              >
                <Smile className="w-8 h-8 text-pink-400 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-pink-300">😊 HAPPY</span>
                <span className="text-[10px] text-slate-400">Feeling great</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROUTINE PLANNER */}
        {activeTab === 'ROUTINE' && (
          <div className="p-4 bg-[#04060a] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 bg-[#0b0e17] p-3 border border-pink-500/30">
              <input
                type="text"
                placeholder="Time (e.g. 08:00 AM)"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-full sm:w-32 bg-black border border-pink-500/30 text-pink-300 px-3 py-1.5 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="Task description (e.g. Study React & Solve 3 LeetCode problems)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-black border border-pink-500/30 text-pink-300 px-3 py-1.5 text-xs focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-pink-500 text-black font-bold text-xs font-orbitron hover:bg-pink-400 transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> ADD
              </button>
            </form>

            {/* Tasks List */}
            <div className="flex flex-col gap-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 border transition flex items-center justify-between ${
                    t.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                      : 'bg-[#0c0f17] border-pink-500/30 hover:border-pink-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      className="w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-[10px] text-pink-400 font-bold px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/30 mr-2">
                        {t.time}
                      </span>
                      <span className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GOAL ROADMAPS */}
        {activeTab === 'ROADMAP' && (
          <div className="p-4 bg-[#04060a] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
            <p className="text-xs text-slate-300">
              Select a goal template or type your custom goal below. BARLIN will build a step-by-step roadmap for you:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Full-Stack Developer Roadmap', desc: '7-Day coding & project building guide' },
                { title: 'AI & Machine Learning Mastery', desc: 'Python, Gemini SDK, & Colab roadmap' },
                { title: 'Fitness & Healthy Habits', desc: 'Workout, diet, & sleep routine planner' },
                { title: 'Exam / Interview Preparation', desc: 'Structured study schedule & practice' },
              ].map((g, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#0b0e17] border border-pink-500/30 hover:border-pink-500 transition flex flex-col justify-between gap-2"
                >
                  <div>
                    <h4 className="text-xs font-bold font-orbitron text-pink-400">{g.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{g.desc}</p>
                  </div>
                  <button
                    onClick={() => handleGeneratePlanWithAI(g.title)}
                    className="w-full py-1.5 bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-black border border-pink-500/50 text-[11px] font-bold font-orbitron transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> BUILD ROADMAP
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Goal Input */}
            <div className="mt-2 p-3 bg-[#0c0e17] border border-pink-500/40 flex flex-col gap-2">
              <label className="text-xs font-bold text-pink-400 font-orbitron">
                OR TYPE YOUR CUSTOM GOAL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Learn React Native in 14 days, Build a YouTube Channel..."
                  value={customGoalPrompt}
                  onChange={(e) => setCustomGoalPrompt(e.target.value)}
                  className="w-full bg-black border border-pink-500/30 text-pink-300 px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customGoalPrompt.trim()) {
                      handleGeneratePlanWithAI(customGoalPrompt.trim());
                    }
                  }}
                  className="px-4 py-1.5 bg-pink-500 text-black font-bold text-xs font-orbitron hover:bg-pink-400 transition flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> GENERATE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-[#07090d] border-t border-pink-500/30 flex items-center justify-between text-xs text-slate-400">
          <span>❤️ BARLIN is always here to listen, support, and plan with you like a real friend.</span>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1 bg-pink-500 text-black font-bold font-orbitron hover:bg-pink-400 transition"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
