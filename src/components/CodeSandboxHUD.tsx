import React, { useState } from 'react';
import { SandboxResult } from '../types';
import { soundFx } from '../utils/soundFx';
import {
  Play,
  Terminal,
  Code2,
  Trash2,
  Copy,
  Check,
  Zap,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface CodeSandboxHUDProps {
  initialCode?: string;
  initialLanguage?: string;
}

const PRESET_SNIPPETS = [
  {
    name: "Neural Matrix Benchmark",
    language: "javascript",
    code: `// Tactical Neural Matrix Multiplication Benchmark
const N = 500;
console.log(\`[BENCHMARK]: Generating \${N}x\${N} Matrix...\`);

const start = Date.now();
let sum = 0;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    sum += Math.sin(i) * Math.cos(j);
  }
}

const duration = Date.now() - start;
console.log(\`✅ Execution Complete in \${duration}ms\`);
console.log(\`📊 Calculated Matrix Sum: \${sum.toFixed(4)}\`);
`
  },
  {
    name: "Colab Telemetry Health Check",
    language: "javascript",
    code: `// Fetch Barlin's GPT Server Health Telemetry
console.log("[SYSTEM]: Querying Barlin's GPT Core status...");

const time = new Date().toISOString();
console.log(\`Timestamp: \${time}\`);
console.log("Memory Allocation: OK");
console.log("Sponsor: AGYAT VYUH COMMUNITY");
console.log("Status: 100% OPERATIONAL");
`
  },
  {
    name: "Python Tensor Simulation",
    language: "python",
    code: `# Python GPU PyTorch Tensor Benchmark
import torch
print("⚡ Checking CUDA GPU Device...")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device Active: {device}")

x = torch.randn(1000, 1000)
y = torch.matmul(x, x)
print("Matrix product computed successfully!")
`
  }
];

export const CodeSandboxHUD: React.FC<CodeSandboxHUDProps> = ({
  initialCode = PRESET_SNIPPETS[0].code,
  initialLanguage = "javascript",
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunCode = async () => {
    soundFx.playClick();
    setIsRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      soundFx.playSuccess();
      setResult(data);
    } catch (err: any) {
      soundFx.playAlert();
      setResult({
        stdout: "",
        stderr: `Failed to execute code: ${err.message}`,
        exitCode: 1,
        durationMs: 0,
        language
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    soundFx.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 font-mono">
      
      {/* Sandbox Header Bar */}
      <div className="bg-[#0a0c10aa] backdrop-blur-xl rounded-xl p-3 border border-[#00f3ff33] flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00f3ff]" />
          <h2 className="text-base font-bold font-orbitron text-[#00f3ff] glow-cyan">
            TACTICAL CODE SANDBOX
          </h2>
          <span className="text-[10px] text-[#00f3ff] bg-[#00f3ff11] border border-[#00f3ff44] px-2 py-0.5 rounded">
            ISOLATED ENV
          </span>
        </div>

        {/* Preset Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">PRESETS:</span>
          {PRESET_SNIPPETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(preset.code);
                setLanguage(preset.language);
                soundFx.playClick();
              }}
              className="px-2 py-1 bg-[#00000088] hover:bg-[#00f3ff11] border border-[#ffffff22] hover:border-[#00f3ff] text-[11px] text-slate-300 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>

      </div>

      {/* Main Split View: Code Editor (Left) & Console Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        
        {/* Left Column: Code Editor */}
        <div className="bg-[#0a0c10aa] backdrop-blur-xl rounded-xl border border-[#00f3ff33] flex flex-col overflow-hidden">
          
          <div className="bg-[#00f3ff11] border-b border-[#00f3ff22] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00f3ff]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#00000088] border border-[#00f3ff44] text-[#00f3ff] text-xs px-2 py-0.5 font-bold uppercase focus:outline-none"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3 (GPU Sim)</option>
                <option value="shell">Bash / Shell</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Copy Editor Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setCode(""); soundFx.playClick(); }}
                className="p-1 text-slate-400 hover:text-red-400 transition"
                title="Clear Code"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Enter JavaScript/Python code here..."
            className="flex-1 w-full bg-[#050608] p-4 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            rows={14}
            spellCheck={false}
          />

          <div className="p-3 bg-[#00f3ff05] border-t border-[#00f3ff22] flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Lines: {code.split('\n').length} | Chars: {code.length}
            </span>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-5 py-2 bg-[#00f3ff] text-black font-black font-orbitron text-xs tracking-wider uppercase shadow-[0_0_15px_#00f3ff88] hover:bg-cyan-300 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'EXECUTING...' : 'RUN CODE'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Tactical Console Output */}
        <div className="bg-[#0a0c10aa] backdrop-blur-xl rounded-xl border border-[#00f3ff33] flex flex-col overflow-hidden">
          
          <div className="bg-[#000000aa] border-b border-[#00f3ff22] px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-[#00f3ff] font-bold flex items-center gap-1.5 font-orbitron">
              <Zap className="w-4 h-4 text-amber-400" />
              CONSOLE OUTPUT LOGS
            </span>

            {result && (
              <span className={`text-[10px] px-2 py-0.5 border ${
                result.exitCode === 0 ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-red-950 text-red-400 border-red-500/40'
              }`}>
                EXIT CODE: {result.exitCode} ({result.durationMs}ms)
              </span>
            )}
          </div>

          <div className="flex-1 bg-[#050608] p-4 overflow-y-auto text-xs font-mono space-y-2">
            {!result && !isRunning && (
              <div className="h-full flex items-center justify-center text-slate-600 text-center p-8">
                Press "RUN CODE" to execute the script in the isolated sandbox.
              </div>
            )}

            {isRunning && (
              <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Executing script in tactical sandbox container...</span>
              </div>
            )}

            {result && (
              <>
                {result.stdout && (
                  <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                    {result.stdout}
                  </div>
                )}
                {result.stderr && (
                  <div className="text-red-400 whitespace-pre-wrap leading-relaxed border-l-2 border-red-500 pl-2 my-2">
                    <div className="flex items-center gap-1 font-bold text-red-500 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>STDERR DIAGNOSTIC:</span>
                    </div>
                    {result.stderr}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
