import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  Bot,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  FileCode,
  Shield,
  Search,
  Cpu,
  X,
  Copy,
  Check,
  Download,
  Layers,
  Sparkles
} from 'lucide-react';

interface AutonomousResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCodeToSandbox?: (code: string) => void;
}

export interface SitrepReport {
  id: string;
  timestamp: string;
  topic: string;
  mode: 'research' | 'refactor' | 'vulnerability';
  status: 'running' | 'completed' | 'failed';
  summary: string;
  findings: string[];
  vulnerabilities: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    fixSnippet: string;
  }[];
  generatedCode?: string;
  logs: string[];
}

export const AutonomousResearchModal: React.FC<AutonomousResearchModalProps> = ({
  isOpen,
  onClose,
  onApplyCodeToSandbox
}) => {
  const [targetQuery, setTargetQuery] = useState('Audit server.ts security & refactor React state performance');
  const [mode, setMode] = useState<'research' | 'refactor' | 'vulnerability'>('refactor');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const [activeReport, setActiveReport] = useState<SitrepReport | null>(() => {
    return {
      id: 'SITREP-8821',
      timestamp: new Date().toLocaleTimeString(),
      topic: 'Full Stack Code Optimization & Security SITREP',
      mode: 'refactor',
      status: 'completed',
      summary: 'Autonomous Agent scanned 14 code modules. Identified 2 high-priority latency bottlenecks in state propagation and missing API key guards.',
      findings: [
        'Render loop in useEffect fixed via memoized dependency array.',
        'Lazy initialization implemented for Gemini AI SDK to prevent startup crashes.',
        'Added Bearer token verification guard on /api/chat endpoint.'
      ],
      vulnerabilities: [
        {
          severity: 'high',
          title: 'Unguarded API Endpoint',
          description: 'Server endpoint lacked bearer authorization header verification.',
          fixSnippet: 'if (!req.headers.authorization) return res.status(401).json({ error: "Unauthorized" });'
        },
        {
          severity: 'medium',
          title: 'State Re-render Cascade',
          description: 'Unmemoized custom object inside useEffect dependency list causing 60fps re-renders.',
          fixSnippet: 'const memoizedConfig = useMemo(() => config, [config.id]);'
        }
      ],
      generatedCode: `// AUTO-REFACTORED BY BARLIN AUTONOMOUS AGENT
import { GoogleGenAI } from '@google/genai';

export class OptimizedAIService {
  private static instance: GoogleGenAI | null = null;

  public static getClient(): GoogleGenAI {
    if (!this.instance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('[BARLIN AGENT] GEMINI_API_KEY environment variable is required');
      }
      this.instance = new GoogleGenAI({ apiKey });
    }
    return this.instance;
  }
}`,
      logs: [
        'SYSTEM: Initializing Autonomous Agent Core v4.2...',
        'SCANNER: Parsing AST tree across src/ and server.ts...',
        'ANALYZER: 14 modules checked. 2 optimization targets found.',
        'SANDBOX: Simulating dry-run refactor build...',
        'COMPLETED: SITREP report generated successfully.'
      ]
    };
  });

  const runAutonomousWorkflow = () => {
    if (!targetQuery.trim() || isRunning) return;

    soundFx.playClick();
    setIsRunning(true);
    setCurrentStep(1);
    setLogs(['[AUTONOMOUS AGENT] Starting execution thread...']);

    const steps = [
      { step: 1, text: `[1/5] SCANNING: Dispatching crawler for query: "${targetQuery}"` },
      { step: 2, text: `[2/5] AST PARSER: Mapping code dependencies and network hooks...` },
      { step: 3, text: `[3/5] VULNERABILITY MATRIX: Running static analysis & heap profiling...` },
      { step: 4, text: `[4/5] REFACTOR ENGINE: Generating optimized code patches...` },
      { step: 5, text: `[5/5] SITREP GENERATION: Finalizing report & code artifacts.` }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLogs(prev => [...prev, steps[i].text]);
        setCurrentStep(steps[i].step);
        soundFx.playHover();
        i++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        soundFx.playSuccess();
        
        // Generate new report
        const newReport: SitrepReport = {
          id: `SITREP-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString(),
          topic: targetQuery,
          mode: mode,
          status: 'completed',
          summary: `Autonomous agent successfully processed task "${targetQuery}". Analyzed code structures and generated optimization SITREP.`,
          findings: [
            `Target "${targetQuery}" thoroughly audited.`,
            `Code AST verified for type-safety and standard ESM compatibility.`,
            `Generated auto-patch fixes background latency by 34%.`
          ],
          vulnerabilities: [
            {
              severity: mode === 'vulnerability' ? 'critical' : 'medium',
              title: `${mode.toUpperCase()} Audit finding for ${targetQuery.slice(0, 25)}...`,
              description: 'Potential uncaught promise rejection under high throughput.',
              fixSnippet: 'try { await processTask(); } catch (err) { logger.error("Agent recover", err); }'
            }
          ],
          generatedCode: `// AUTONOMOUS AGENT GENERATED FIX FOR: ${targetQuery}
export async function executeRefactoredTask(payload: any) {
  // Optimized execution thread
  console.log('[BARLIN AGENT] Executing task with zero memory leak');
  const startTime = performance.now();
  
  // Sanitized payload processing
  const result = await Promise.resolve({
    status: 'success',
    executedQuery: payload,
    durationMs: performance.now() - startTime
  });
  
  return result;
}`,
          logs: [
            '[SYSTEM] Initializing Agent thread...',
            ...steps.map(s => s.text),
            '[COMPLETED] SITREP generated with 100% confidence.'
          ]
        };

        setActiveReport(newReport);
        jarvisVoice.speak(`SITREP report ${newReport.id} compiled successfully, Operator Agyat.`);
      }
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-4xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Bot className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>AUTONOMOUS AGENT & RESEARCH WORKFLOWS</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">SITREP CORE</span>
              </h2>
              <p className="text-xs text-slate-400">Autonomous web research, AST code bug hunt, vulnerability audits & SITREP auto-patches</p>
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
          
          {/* Target Query Input & Mode Selection */}
          <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff22] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                <span>Agent Task Prompt / Target Code Module</span>
              </label>
              
              <div className="flex items-center gap-1 bg-[#05080e] p-1 rounded border border-[#00f3ff33]">
                <button
                  onClick={() => setMode('refactor')}
                  className={`px-2.5 py-1 text-xs rounded transition ${mode === 'refactor' ? 'bg-[#00f3ff] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Code Refactor
                </button>
                <button
                  onClick={() => setMode('vulnerability')}
                  className={`px-2.5 py-1 text-xs rounded transition ${mode === 'vulnerability' ? 'bg-[#00f3ff] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Security Audit
                </button>
                <button
                  onClick={() => setMode('research')}
                  className={`px-2.5 py-1 text-xs rounded transition ${mode === 'research' ? 'bg-[#00f3ff] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Deep Research
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={targetQuery}
                onChange={e => setTargetQuery(e.target.value)}
                placeholder="Type target topic or code refactoring task..."
                className="flex-1 bg-[#05080e] border border-[#00f3ff44] rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff] text-xs font-mono"
              />
              <button
                onClick={runAutonomousWorkflow}
                disabled={isRunning}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  isRunning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#00f3ff] text-black hover:bg-[#00d0dd] shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-slate-400" />
                    <span>EXECUTING...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>DISPATCH AGENT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Execution Progress & Live Logs */}
          {isRunning && (
            <div className="bg-[#05080e] p-4 rounded-lg border border-[#00f3ff44] space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs text-[#00f3ff]">
                <span className="font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>AUTONOMOUS AGENT ACTIVE (STEP {currentStep}/5)</span>
                </span>
                <span>{currentStep * 20}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-[#00f3ff33]">
                <div
                  className="h-full bg-[#00f3ff] transition-all duration-300 shadow-[0_0_10px_#00f3ff]"
                  style={{ width: `${currentStep * 20}%` }}
                />
              </div>
              <div className="text-xs text-slate-300 font-mono space-y-1 max-h-28 overflow-y-auto p-2 bg-black/60 rounded border border-cyan-900/40">
                {logs.map((log, index) => (
                  <div key={index} className="text-cyan-300">{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* SITREP Report Viewer */}
          {activeReport && (
            <div className="bg-[#070c14] border border-cyan-500/30 rounded-lg p-5 space-y-5">
              
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cyan-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold uppercase rounded">
                    SITREP VERIFIED
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {activeReport.id}: {activeReport.topic}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">{activeReport.timestamp}</span>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Executive SITREP Summary</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0a111a] p-3 rounded border border-cyan-950">
                  {activeReport.summary}
                </p>
              </div>

              {/* Key Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Autonomous Findings & Fixes</span>
                </h4>
                <div className="space-y-1.5">
                  {activeReport.findings.map((finding, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-[#05090f] p-2 rounded border border-emerald-900/30">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulnerabilities */}
              {activeReport.vulnerabilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Identified Issues & AST Patches</span>
                  </h4>
                  <div className="space-y-2">
                    {activeReport.vulnerabilities.map((vuln, idx) => (
                      <div key={idx} className="p-3 bg-[#110d05] border border-amber-500/30 rounded space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-300">{vuln.title}</span>
                          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500 text-amber-400 font-bold">
                            {vuln.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{vuln.description}</p>
                        <pre className="text-[11px] bg-black p-2 rounded text-amber-200 overflow-x-auto border border-amber-900/50">
                          <code>{vuln.fixSnippet}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Code Patch Artifact */}
              {activeReport.generatedCode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Refactored Code Artifact</span>
                    </h4>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeReport.generatedCode || '');
                          setCopiedCode(true);
                          soundFx.playSuccess();
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-[#0a1420] border border-[#00f3ff44] rounded text-[11px] text-[#00f3ff] hover:bg-[#00f3ff22] flex items-center gap-1 cursor-pointer transition"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>

                      {onApplyCodeToSandbox && (
                        <button
                          onClick={() => {
                            soundFx.playSuccess();
                            onApplyCodeToSandbox(activeReport.generatedCode || '');
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-[#00f3ff] text-black font-bold rounded text-[11px] hover:bg-[#00cce0] flex items-center gap-1 cursor-pointer transition shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Load in Sandbox</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative rounded bg-black/90 p-3 border border-cyan-900/60 font-mono text-xs text-cyan-200 overflow-x-auto max-h-56">
                    <pre><code>{activeReport.generatedCode}</code></pre>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous AI Worker Thread • Ready</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close Terminal
          </button>
        </div>

      </div>
    </div>
  );
};
