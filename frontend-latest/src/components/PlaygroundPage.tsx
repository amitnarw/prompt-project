'use client';

import React, { useState, useEffect } from 'react';
import { Play, Edit, Terminal, Copy, Cpu, Plus, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { PromptProtocol } from '../types';
import { api, ApiError } from '../lib/api';
import { motion } from 'motion/react';

interface PlaygroundPageProps {
  initialPrompt: PromptProtocol | null;
}

interface PlaygroundResult {
  success: boolean;
  prompt: string;
  response: string;
  executedAt: string;
  mock: boolean;
  usage?: {
    limit: number;
    used: number;
    remaining: number;
    resetsAt: string;
  };
}

interface Session {
  user: { id: string; name?: string | null; email: string; image?: string | null };
  session: { id: string; expiresAt: string };
}

export const PlaygroundPage: React.FC<PlaygroundPageProps> = ({ initialPrompt }) => {
  const [systemPrompt, setSystemPrompt] = useState(initialPrompt?.systemPrompt || '');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load current session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await api.get<Session | null>('/api/auth/get-session');
        setSession(data);
      } catch {
        setSession(null);
      } finally {
        setSessionLoading(false);
      }
    };
    loadSession();
  }, []);

  // Update systemPrompt when initialPrompt changes
  useEffect(() => {
    if (initialPrompt?.systemPrompt) {
      setSystemPrompt(initialPrompt.systemPrompt);
      setOutput('');
      setResult(null);
      setError(null);
    }
  }, [initialPrompt]);

  const executePrompt = async () => {
    if (!systemPrompt.trim()) return;

    if (!session) {
      setError('Authentication required. Please sign in to use the Playground.');
      return;
    }

    setIsExecuting(true);
    setOutput('');
    setError(null);
    const startTime = Date.now();

    try {
      const data = await api.post<{ success: boolean; data: PlaygroundResult }>('/api/playground/run', {
        prompt: systemPrompt,
      });

      const playResult = data.data;
      setResult(playResult);
      setOutput(playResult.response);
      setLatency(Date.now() - startTime);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Session expired. Please sign in again.');
        } else if (err.status === 429) {
          setError(`Daily limit reached. ${err.message}`);
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to execute prompt. Check backend connection.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const copyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const usageInfo = result?.usage;

  return (
    <main className="flex-grow pt-16 flex overflow-hidden h-[calc(100vh-64px)]">
      {/* Left Sidebar: History + Usage */}
      <aside className="w-64 bg-surface-container-low flex flex-col border-r border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Session History</span>
        </div>
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-1">
          <div className="group p-3 bg-surface-container-high border-l-2 border-tertiary-container/40 cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <span className="font-label text-[9px] text-tertiary">ACTIVE STREAM</span>
              <span className="font-label text-[9px] text-on-surface-variant">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs font-medium truncate opacity-90">{initialPrompt?.title || 'New Session'}</p>
          </div>
        </div>

        {/* Usage Stats */}
        {usageInfo && (
          <div className="m-4 p-4 bg-surface-container border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} className="text-tertiary" />
              <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">Usage Today</span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-headline font-bold text-lg">
                {usageInfo.used}
                <span className="text-on-surface-variant font-normal text-sm">/{usageInfo.limit === -1 ? '∞' : usageInfo.limit}</span>
              </span>
              {usageInfo.remaining !== -1 && (
                <span className="font-label text-[10px] text-on-surface-variant">{usageInfo.remaining} left</span>
              )}
            </div>
            {usageInfo.limit !== -1 && (
              <div className="h-1 bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-tertiary transition-all"
                  style={{ width: `${Math.min(100, (usageInfo.used / usageInfo.limit) * 100)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {!sessionLoading && session && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-3 bg-surface-container/60 border border-outline-variant/10">
              {session.user.image ? (
                <img src={session.user.image} alt="Avatar" className="w-6 h-6 object-cover" />
              ) : (
                <div className="w-6 h-6 bg-tertiary/20 flex items-center justify-center text-[10px] font-bold text-tertiary">
                  {(session.user.name || session.user.email)[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface truncate">
                  {session.user.name || session.user.email.split('@')[0]}
                </p>
                <p className="font-label text-[9px] text-on-surface-variant">Authenticated</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-surface-container border-t border-outline-variant/10">
          <button
            onClick={() => { setOutput(''); setResult(null); setError(null); setSystemPrompt(''); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-surface-bright text-xs font-label font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            <Plus size={14} />
            New Session
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col bg-surface relative">
        <div className="glow-overlay absolute inset-0 pointer-events-none"></div>

        {/* Toolbar */}
        <div className="h-14 bg-surface-container flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant/30">
              <Cpu size={14} className="text-tertiary-container" />
              <select className="bg-transparent border-none text-[11px] font-label font-bold uppercase tracking-widest focus:ring-0 cursor-pointer text-on-surface">
                <option>GPT-4_TURBO</option>
                <option>CLAUDE_3_OPUS</option>
                <option>LLAMA_3_70B</option>
                <option>GEMINI_2.0</option>
              </select>
            </div>
            <div className="h-4 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Temp:</span>
                <span className="font-label text-[11px] text-on-surface">0.7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">Tokens:</span>
                <span className="font-label text-[11px] text-on-surface">2048</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!session && !sessionLoading && (
              <span className="font-label text-[10px] uppercase tracking-widest text-amber-400">Sign in required</span>
            )}
            <button
              onClick={executePrompt}
              disabled={isExecuting || !systemPrompt.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-on-surface text-background text-xs font-label font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Play size={14} fill="currentColor" />
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </div>

        {/* No-auth warning */}
        {!session && !sessionLoading && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 flex items-center gap-3 p-4 bg-amber-500/5 border-l-2 border-amber-500/40"
          >
            <AlertCircle size={16} className="text-amber-400" />
            <p className="font-label text-[10px] uppercase tracking-widest text-amber-400">
              Sign in from the navbar to run prompts. The prompt editor is still available.
            </p>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 flex items-center gap-3 p-4 bg-red-500/5 border-l-2 border-red-500/40"
          >
            <AlertCircle size={16} className="text-red-400" />
            <p className="font-label text-[10px] uppercase tracking-widest text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-on-surface-variant hover:text-white transition-colors text-xs">✕</button>
          </motion.div>
        )}

        {/* Split Editor */}
        <div className="flex-grow flex overflow-hidden">
          {/* Input Panel */}
          <div className="flex-1 flex flex-col border-r border-outline-variant/10">
            <div className="p-3 bg-surface-container-low flex justify-between items-center">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">System Prompt.txt</span>
              <Edit size={12} className="opacity-40 cursor-pointer" />
            </div>
            <textarea
              className="flex-grow bg-surface-container-lowest p-8 font-mono text-sm leading-relaxed overflow-y-auto outline-none resize-none text-on-surface"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              spellCheck={false}
              placeholder="Paste or type your system prompt here..."
            />
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col bg-surface-container-low">
            <div className="p-3 bg-surface-container flex justify-between items-center">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Response Stream [RAW]
              </span>
              <div className="flex gap-3 items-center">
                <span className={`w-2 h-2 ${isExecuting ? 'bg-tertiary animate-pulse' : output ? 'bg-tertiary/60' : 'bg-tertiary/20'}`}></span>
                <button onClick={copyOutput} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  {copied ? <CheckCircle2 size={12} className="text-tertiary" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <div className="flex-grow p-8 overflow-y-auto">
              <div className="max-w-none font-mono text-sm text-on-surface/90">
                {output ? (
                  <>
                    <div className="p-4 bg-surface-container-highest/30 border border-outline-variant/20 mb-6">
                      <div className="flex items-center gap-2 mb-3 text-tertiary">
                        <Terminal size={14} />
                        <span className="text-[10px] font-label uppercase tracking-widest">Inference Engine v4</span>
                        {result?.mock && (
                          <span className="ml-auto text-[9px] text-on-surface-variant uppercase tracking-widest px-2 py-0.5 bg-surface-container-highest">
                            Mock Response
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{output}</p>
                    </div>
                    {latency && (
                      <div className="p-4 border-l-2 border-outline-variant/30 flex justify-between">
                        <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                          Latency: {latency}ms
                        </span>
                        <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                          {result?.executedAt ? new Date(result.executedAt).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-on-surface-variant/30 italic">
                    {isExecuting ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-tertiary animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-label uppercase tracking-widest">Processing...</span>
                      </div>
                    ) : (
                      'Waiting for execution...'
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
