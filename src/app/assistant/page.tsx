'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  MapPin, 
  ShieldCheck, 
  Info, 
  RefreshCw, 
  Lightbulb, 
  Leaf, 
  Activity,
  User,
  Bot,
  Copy,
  Check
} from 'lucide-react';
import { DEFAULT_LOCATION } from '@/lib/air-quality';
import { LocationData, AirQualityResponse } from '@/types/air-quality';
import { ChatMessage } from '@/types/assistant';
import { LocalStorageStore } from '@/lib/supabase';

const SAMPLE_PROMPTS = [
  'Is it safe to go jogging today in Bengaluru?',
  'Is it safe for my children to play outside this afternoon?',
  'How do I protect my elderly parents from severe winter smog?',
  'How do I improve my bedroom air quality without an expensive purifier?',
  'Should I use an air purifier right now with our current PM2.5?',
  'Which transportation option is better and cleaner for an 18km commute?',
  'What should I do today based on my local AQI?',
  'How can our household reduce our contribution to urban air pollution?',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [aqiData, setAqiData] = useState<AirQualityResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync location
  useEffect(() => {
    const saved = localStorage.getItem('breathewise_current_location');
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch {}
    }

    // Load chat history from local store
    const storedHistory = LocalStorageStore.getChatHistory();
    if (storedHistory && storedHistory.length > 0) {
      setMessages(storedHistory);
    } else {
      // Welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `### Welcome to BreatheWise AI

I am your personal environmental and clean-living intelligence assistant. I analyze real-time atmospheric data for **${location.city}** and help you protect your family while adopting sustainable daily habits.

Feel free to ask me anything about:
* **Outdoor safety:** Jogging, cycling, or children\'s school recess.
* **Family health:** Safeguards for elderly parents, infants, or asthmatics.
* **Indoor air optimization:** True HEPA filtration, smart window timing, and cooking ventilation.
* **Green mobility:** Lower-emission transit alternatives and carbon reduction.

*How can I assist you today?*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [location.city]);

  // Load current AQI context for the AI
  useEffect(() => {
    async function loadAqi() {
      try {
        const res = await fetch(
          `/api/air-quality?lat=${location.latitude}&lon=${location.longitude}&city=${encodeURIComponent(location.city)}`
        );
        if (res.ok) {
          const data = await res.json();
          setAqiData(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadAqi();
  }, [location.latitude, location.longitude, location.city]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText: string) => {
    const query = messageText.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            city: location?.city || 'Bengaluru',
            usAqi: aqiData?.current?.usAqi ?? 75,
            category: aqiData?.current?.category || 'Moderate',
            pm25: aqiData?.current?.pollutants?.pm25?.value ?? 25,
            pm10: aqiData?.current?.pollutants?.pm10?.value ?? 45,
            no2: aqiData?.current?.pollutants?.no2?.value,
            o3: aqiData?.current?.pollutants?.o3?.value,
          },
          history: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions,
        scientificReasoning: data.scientificReasoning,
        environmentalImpact: data.environmentalImpact,
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      LocalStorageStore.saveChatHistory(finalMessages);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `I encountered an unexpected connection issue (${err.message || 'Connection failure'}). Please verify your internet connection or check API configuration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear your conversation history?')) {
      const resetMsg: ChatMessage[] = [
        {
          id: 'welcome_reset',
          role: 'assistant',
          content: `Conversation reset. Ask me any environmental or air protection question for **${location.city}**!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(resetMsg);
      LocalStorageStore.saveChatHistory(resetMsg);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Google Gemini Environmental Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            BreatheWise AI Assistant
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time contextual advisory based on live atmospheric data for {location.city}.
          </p>
        </div>

        {/* Live Environmental Context Pill & Clear */}
        <div className="flex items-center gap-3">
          {aqiData && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">{location.city}:</span>
              <span className="font-bold text-slate-900">{aqiData.current.usAqi} AQI</span>
              <span className="text-[10px] text-slate-500">({aqiData.current.category})</span>
            </div>
          )}

          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Recommended Environmental Prompts:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 shrink-0 transition-all shadow-subtle text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card min-h-[480px] max-h-[640px] flex flex-col justify-between overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Speech Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none prose prose-slate prose-sm max-w-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Copy button for AI replies */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                        <span>BreatheWise Environmental Brain</span>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions & Insights attached to AI responses */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Immediate Action Steps:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px]">
                        {msg.suggestedActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scientific Reasoning & Impact */}
                  {!isUser && msg.scientificReasoning && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 px-2">
                      <Info className="w-3 h-3 text-cyan-600" />
                      <span>{msg.scientificReasoning}</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 py-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600">
                Analyzing {location.city} atmospheric readings & formulating advice...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask BreatheWise AI anything about air quality, outdoor safety, or sustainable habits...`}
              disabled={loading}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-subtle"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Environmental guardrails notice */}
          <div className="mt-2 text-center text-[10px] text-slate-600 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Grounded in live atmospheric physics and WHO standards. BreatheWise AI never invents air quality metrics or provides medical diagnoses.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

