import React, { useState } from 'react';
import { Sparkles, Bot, Key, Send, X, Cpu, RefreshCw, Layers } from 'lucide-react';
import { anthropicAIService, AnthropicAIResponse } from '../../services/AnthropicAIService';

interface AnthropicAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnthropicAIAssistantModal: React.FC<AnthropicAIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(anthropicAIService.getSavedApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnthropicAIResponse | null>(null);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    anthropicAIService.saveApiKey(apiKey);
    setShowKeyInput(false);
  };

  const handleQuery = async (queryText?: string) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    try {
      const res = await anthropicAIService.queryAnthropicAI({
        prompt: textToSubmit,
        apiKey: apiKey
      });
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🍳 Zero-Waste Surplus Recipes (Claude 3.5)",
    "📊 ML Model & Dataset Architecture",
    "📈 Predict Weekend LH1-LH5 Attendance",
    "🥗 Mess Nutrition & Feedback Sentiment"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-[#121016] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-[#C86D44] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#181420] rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-purple-100">Anthropic AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold uppercase tracking-wider border border-purple-500/30">
                  CLAUDE 3.5 SONNET
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Anthropic ML Model & Intelligent Operations Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Configure Anthropic API Key"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Configuration Drawer */}
        {showKeyInput && (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Anthropic API Key (Optional)</span>
              </label>
              <a 
                href="https://console.anthropic.com/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-purple-400 underline font-mono hover:text-purple-300"
              >
                Get Anthropic Key →
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="flex-1 bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Note: If no API key is provided, the assistant uses our built-in Anthropic Claude reasoning engine.
            </p>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(qp);
                handleQuery(qp);
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-xs font-mono text-slate-300 hover:text-purple-200 transition-all cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Response Box */}
        <div className="min-h-[140px] max-h-[260px] overflow-y-auto p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 font-sans text-xs sm:text-sm leading-relaxed text-slate-200">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-purple-300 gap-2 font-mono text-xs animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Querying Anthropic Claude 3.5 Sonnet Model...</span>
            </div>
          ) : response ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-300/90 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Source: {response.source}</span>
                </span>
                <span>{response.timestamp}</span>
              </div>
              <div className="whitespace-pre-line text-slate-100">{response.answer}</div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 font-mono text-xs space-y-1">
              <Bot className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
              <p>Ask Anthropic Claude 3.5 Sonnet about ML model architecture, dataset specs, or zero-waste recipes!</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Anthropic Claude (e.g. Explain our ML model architecture and dataset)..."
            className="flex-1 bg-black/60 border border-purple-500/30 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#C86D44] hover:from-purple-500 hover:to-[#B35C33] text-white font-bold text-xs font-mono tracking-wider shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Ask Claude</span>
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
