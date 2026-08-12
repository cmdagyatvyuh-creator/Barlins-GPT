import React, { useState } from 'react';
import { soundFx } from '../utils/soundFx';
import { jarvisVoice } from '../utils/jarvisVoice';
import {
  FileText,
  Upload,
  Search,
  Database,
  Cloud,
  CheckCircle2,
  X,
  File,
  Layers,
  Sparkles,
  Bot,
  HardDrive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface RAGWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocumentContext?: (text: string, title: string) => void;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'txt' | 'csv' | 'drive';
  chunks: number;
  status: 'indexed' | 'indexing' | 'error';
  contentSnippet: string;
}

export const RAGWorkspaceModal: React.FC<RAGWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSelectDocumentContext
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'BARLIN_AI_Architecture_Whitepaper.pdf',
      size: '1.8 MB',
      type: 'pdf',
      chunks: 34,
      status: 'indexed',
      contentSnippet: 'BARLIN GPT Core utilizes full-stack server proxying for Gemini AI models and local storage state persistence for high security...'
    },
    {
      id: 'doc-2',
      name: 'System_Vulnerability_Audit_2026.csv',
      size: '420 KB',
      type: 'csv',
      chunks: 12,
      status: 'indexed',
      contentSnippet: 'Module, Risk_Level, Fixed_Date\nserver.ts, Medium, 2026-08-10\nApp.tsx, Low, 2026-08-11'
    },
    {
      id: 'doc-3',
      name: 'Google_Drive_Synced_Project_Notes.docx',
      size: '890 KB',
      type: 'drive',
      chunks: 18,
      status: 'indexed',
      contentSnippet: 'Project milestone: Integrate 10 sci-fi HUD features into BARLIN GPT Command Center for Operator Agyat.'
    }
  ]);

  const [ragQuery, setRagQuery] = useState('');
  const [queryResults, setQueryResults] = useState<{ docName: string; score: number; snippet: string }[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDriveSyncing, setIsDriveSyncing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playClick();
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.csv') ? 'csv' : 'txt',
      chunks: Math.floor(Math.random() * 20) + 5,
      status: 'indexing',
      contentSnippet: `Uploaded document file "${file.name}". Parsing AST text chunks into vector store...`
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Simulate indexing
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(d => (d.id === newDoc.id ? { ...d, status: 'indexed' as const } : d))
      );
      soundFx.playSuccess();
      jarvisVoice.speak(`Document ${file.name} indexed into RAG workspace, Operator Agyat.`);
    }, 1200);
  };

  const handleDriveSync = () => {
    soundFx.playClick();
    setIsDriveSyncing(true);

    setTimeout(() => {
      setIsDriveSyncing(false);
      soundFx.playSuccess();
      const driveDoc: DocumentItem = {
        id: `drive-${Date.now()}`,
        name: 'Google_Drive_Live_Workspace_Sync.gdoc',
        size: '1.2 MB',
        type: 'drive',
        chunks: 28,
        status: 'indexed',
        contentSnippet: 'Synced latest Google Workspace files from Google Drive cloud storage.'
      };
      setDocuments(prev => [driveDoc, ...prev]);
      jarvisVoice.speak('Google Drive Workspace synchronized successfully.');
    }, 1500);
  };

  const executeRAGQuery = () => {
    if (!ragQuery.trim()) return;

    soundFx.playClick();
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      soundFx.playSuccess();

      const results = documents.map(doc => ({
        docName: doc.name,
        score: Math.floor(82 + Math.random() * 17),
        snippet: `[Vector Match] "...Relevant context found in ${doc.name} matching query '${ragQuery}': ${doc.contentSnippet.slice(0, 110)}..."`
      }));

      setQueryResults(results);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-4xl bg-[#080d14] border border-[#00f3ff55] rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f3ff33] bg-[#050a10]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f3ff11] border border-[#00f3ff44]">
              <Database className="w-5 h-5 text-[#00f3ff] animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#00f3ff] tracking-wider uppercase flex items-center gap-2">
                <span>RAG DOCUMENT & WORKSPACE INTELLIGENCE</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00f3ff22] border border-[#00f3ff] text-[#00f3ff] rounded-full">VECTOR SEARCH</span>
              </h2>
              <p className="text-xs text-slate-400">PDF, Docs, CSV, TXT & Google Drive RAG vector index query</p>
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
          
          {/* Top Controls: File Upload & Drive Sync */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Local File Upload Box */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>Upload Local PDF / Doc / CSV</span>
                </span>
                <span className="text-[10px] text-slate-500">MAX 50MB</span>
              </div>
              <p className="text-xs text-slate-400">Drag & drop or select documents to parse and embed into RAG memory</p>
              
              <label className="w-full py-2.5 px-4 bg-[#00f3ff11] border border-dashed border-[#00f3ff66] hover:border-[#00f3ff] rounded text-xs text-[#00f3ff] font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                <FileText className="w-4 h-4" />
                <span>Select File to Index</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  className="hidden"
                />
              </label>
            </div>

            {/* Google Drive Workspace Sync Box */}
            <div className="bg-[#0c131d] p-4 rounded-lg border border-[#00f3ff33] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Cloud className="w-4 h-4" />
                  <span>Google Drive Sync</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/40">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">Connect Google Workspace Docs & Sheets directly to vector memory</p>

              <button
                onClick={handleDriveSync}
                disabled={isDriveSyncing}
                className="w-full py-2.5 px-4 bg-[#00f3ff] text-black font-bold rounded text-xs flex items-center justify-center gap-2 hover:bg-[#00cce0] cursor-pointer transition shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                <RefreshCw className={`w-4 h-4 ${isDriveSyncing ? 'animate-spin' : ''}`} />
                <span>{isDriveSyncing ? 'Syncing Drive Docs...' : 'Sync Google Drive Workspace'}</span>
              </button>
            </div>

          </div>

          {/* RAG Vector Search Bar */}
          <div className="bg-[#05090f] p-4 rounded-lg border border-[#00f3ff44] space-y-3">
            <label className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Query RAG Vector Store</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={e => setRagQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && executeRAGQuery()}
                placeholder="Ask anything about your uploaded documents or Drive files..."
                className="flex-1 bg-[#09101a] border border-[#00f3ff33] rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff]"
              />
              <button
                onClick={executeRAGQuery}
                disabled={isSearching}
                className="px-4 py-2 bg-[#00f3ff] text-black font-bold rounded text-xs flex items-center gap-1.5 hover:bg-[#00d0dd] cursor-pointer transition shadow-[0_0_12px_rgba(0,243,255,0.4)]"
              >
                <Search className="w-4 h-4" />
                <span>RAG Search</span>
              </button>
            </div>
          </div>

          {/* RAG Query Results */}
          {queryResults && (
            <div className="bg-[#0a121d] border border-cyan-500/40 p-4 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>RAG Similarity Vector Matches ({queryResults.length})</span>
              </h4>
              
              <div className="space-y-2">
                {queryResults.map((res, i) => (
                  <div key={i} className="p-3 bg-[#05080e] rounded border border-cyan-900/50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{res.docName}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold text-[10px]">
                        Match: {res.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">{res.snippet}</p>
                    {onSelectDocumentContext && (
                      <button
                        onClick={() => {
                          soundFx.playSuccess();
                          onSelectDocumentContext(res.snippet, res.docName);
                          onClose();
                        }}
                        className="mt-2 text-[11px] text-[#00f3ff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Inject into Chat Assistant</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indexed Documents Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00f3ff]" />
              <span>Indexed Workspace Memory ({documents.length})</span>
            </h4>

            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="p-3 bg-[#0a1018] rounded-lg border border-cyan-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 shrink-0">
                      {doc.type === 'drive' ? <Cloud className="w-4 h-4 text-cyan-400" /> : <FileText className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white truncate">{doc.name}</h5>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.chunks} Embed Vector Chunks</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'indexing' ? (
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-500 text-[10px] rounded font-bold animate-pulse">
                        INDEXING...
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500 text-[10px] rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>INDEXED</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff33] bg-[#050a10] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00f3ff]" />
            <span>Vector Store Capacity: 3/100 Documents</span>
          </div>
          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-[#00f3ff11] border border-[#00f3ff44] text-[#00f3ff] hover:bg-[#00f3ff22] rounded transition cursor-pointer"
          >
            Close RAG Hub
          </button>
        </div>

      </div>
    </div>
  );
};
