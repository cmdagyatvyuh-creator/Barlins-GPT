export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  executionTimeMs?: number;
  tokensUsed?: number;
  isStreaming?: boolean;
  codeBlocks?: {
    language: string;
    code: string;
  }[];
}

export interface ColabConfig {
  endpointUrl: string;
  apiKey?: string;
  status: 'disconnected' | 'connecting' | 'online' | 'error';
  lastPingTime?: string;
  latencyMs?: number;
  gpuName?: string;
  vramUsedGb?: number;
  vramTotalGb?: number;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'Gemini' | 'Colab GPU' | 'Custom';
  description: string;
  badge?: string;
}

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  language: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  vramUsage: number;
  latencyMs: number;
  activeConnections: number;
  temperature: number;
  fps: number;
}

export type CyberTheme = 
  | 'cyan' 
  | 'gemini-ui'
  | 'jarvis'
  | 'emerald' 
  | 'amber' 
  | 'violet' 
  | 'synthwave'
  | 'jarvis-amber'
  | 'jarvis-blue'
  | 'jarvis-uv'
  | 'crimson' 
  | 'wolf'
  | 'day' 
  | 'night' 
  | 'eyecare' 
  | 'custom';

export interface CustomThemeConfig {
  themeName?: string;
  primaryColor: string;
  secondaryColor?: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  accentGlow: string;
  glowIntensity?: number; // 0 to 100
  texture?: 'none' | 'metal' | 'carbon' | 'grid' | 'glass';
  fontStyle?: 'orbitron' | 'mono' | 'sans';
}
