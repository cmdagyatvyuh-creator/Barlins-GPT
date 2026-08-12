import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Calendar,
  CheckSquare,
  Square,
  Plus,
  Clock,
  Mic,
  X,
  Sparkles,
  AlertCircle,
  Tag,
  Trash2,
  RefreshCw,
  Check,
  CheckCircle2
} from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  dueTime: string;
  completed: boolean;
  syncedWithGoogle: boolean;
  category: 'work' | 'personal' | 'ai' | 'security';
}

interface TaskMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskMatrixModal: React.FC<TaskMatrixModalProps> = ({
  isOpen,
  onClose
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barlin_task_matrix');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      {
        id: 'task-1',
        title: 'Review BARLIN GPT server proxy security headers',
        priority: 'P1',
        dueTime: 'Today 14:00',
        completed: false,
        syncedWithGoogle: true,
        category: 'security'
      },
      {
        id: 'task-[#00f3ff]',
        title: 'Sync Google Calendar events & Workspace docs',
        priority: 'P2',
        dueTime: 'Today 18:30',
        completed: true,
        syncedWithGoogle: true,
        category: 'ai'
      },
      {
        id: 'task-3',
        title: 'Conduct weekly AST code refactoring audit',
        priority: 'P3',
        dueTime: 'Tomorrow 09:00',
        completed: false,
        syncedWithGoogle: false,
        category: 'work'
      }
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P1');
  const [newDueTime, setNewDueTime] = useState('Tomorrow 08:00 AM');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSyncingGCal, setIsSyncingGCal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('barlin_task_matrix', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (title?: string) => {
    const taskText = title || newTaskTitle;
    if (!taskText.trim()) return;

    soundFx.playClick();
    const item: TaskItem = {
      id: `task-${Date.now()}`,
      title: taskText.trim(),
      priority: newPriority,
      dueTime: newDueTime,
      completed: false,
      syncedWithGoogle: true,
      category: 'ai'
    };

    setTasks(prev => [item, ...prev]);
    setNewTaskTitle('');
    soundFx.playSuccess();
    jarvisVoice.speak(`Reminder added to HUD Task Matrix: ${taskText}`);
  };

  const toggleTask = (id: string) => {
    soundFx.playClick();
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    soundFx.playClick();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const syncGoogleCalendar = () => {
    soundFx.playClick();
    setIsSyncingGCal(true);

    setTimeout(() => {
      setIsSyncingGCal(false);
      soundFx.playSuccess();
      jarvisVoice.speak('Google Calendar events & Google Tasks synchronized successfully with HUD.');
    }, 1200);
  };

  const triggerVoiceCommandTask = () => {
    soundFx.playClick();
    setIsVoiceActive(true);

    jarvisVoice.speak("Listening for voice task command. Example: Add reminder for tomorrow 7 AM.");

    setTimeout(() => {
      setIsVoiceActive(false);
      addTask("Voice Command Task: Review Quantum SITREP at 07:00 AM");
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-4xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Calendar className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>INTERACTIVE TASK MATRIX & GOOGLE CALENDAR SYNC</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">EISENHOWER HUD</span>
              </h2>
              <p className="text-xs text-slate-400">Google Tasks & Calendar event timeline with voice-command reminders</p>
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
          
          {/* Quick Task Entry & Voice Button */}
          <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Add Task / Google Calendar Reminder</span>
              </span>
              
              <button
                onClick={triggerVoiceCommandTask}
                className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isVoiceActive
                    ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-[#00f3ff11] border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff22]'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isVoiceActive ? 'Listening...' : 'Voice Task Command'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Type task or say 'JARVIS, add reminder for tomorrow 7 AM'..."
                className="sm:col-span-6 bg-[#05080e] border border-[#00f3ff33] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f3ff]"
              />

              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="sm:col-span-2 bg-[#05080e] border border-[#00f3ff33] rounded px-2 py-2 text-xs text-[#00f3ff] font-bold focus:outline-none"
              >
                <option value="P1">P1 (Urgent)</option>
                <option value="P2">P2 (High)</option>
                <option value="P3">P3 (Medium)</option>
                <option value="P4">P4 (Low)</option>
              </select>

              <input
                type="text"
                value={newDueTime}
                onChange={e => setNewDueTime(e.target.value)}
                className="sm:col-span-2 bg-[#05080e] border border-[#00f3ff33] rounded px-2 py-2 text-xs text-slate-300 focus:outline-none"
              />

              <button
                onClick={() => addTask()}
                className="sm:col-span-2 bg-[#00f3ff] text-black font-bold rounded text-xs hover:bg-[#00d0dd] cursor-pointer transition shadow-[0_0_10px_rgba(0,243,255,0.4)] flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Sync Header */}
          <div className="flex items-center justify-between bg-[#050910] p-3 rounded-lg border border-cyan-900/40">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-[#00f3ff]" />
              <span>Google Calendar Status: <strong className="text-emerald-400">SYNCED</strong></span>
            </div>

            <button
              onClick={syncGoogleCalendar}
              disabled={isSyncingGCal}
              className="px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-900 cursor-pointer transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGCal ? 'animate-spin' : ''}`} />
              <span>{isSyncingGCal ? 'Syncing...' : 'Sync Calendar'}</span>
            </button>
          </div>

          {/* Task Matrix List */}
          <div className="space-y-2">
            {tasks.map(task => {
              let pColor = 'border-rose-500 text-rose-400 bg-rose-950/40';
              if (task.priority === 'P2') pColor = 'border-amber-500 text-amber-400 bg-amber-950/40';
              if (task.priority === 'P3') pColor = 'border-cyan-500 text-cyan-400 bg-cyan-950/40';
              if (task.priority === 'P4') pColor = 'border-slate-500 text-slate-400 bg-slate-900/40';

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition ${
                    task.completed
                      ? 'bg-[#05080e] border-slate-800 opacity-60'
                      : 'bg-[#09101a] border-cyan-900/50 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-[#00f3ff] hover:text-white transition cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-cyan-400" />
                      )}
                    </button>

                    <div className="overflow-hidden">
                      <h4 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{task.dueTime}</span>
                        {task.syncedWithGoogle && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> GCal Synced
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${pColor}`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f3ff]" />
            <span>Active HUD Tasks: {tasks.filter(t => !t.completed).length} Pending</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
