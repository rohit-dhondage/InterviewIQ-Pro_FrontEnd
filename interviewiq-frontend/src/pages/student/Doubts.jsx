import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  HelpCircle, Send, Bot, User, Loader2, Sparkles,
  ChevronRight, X, RotateCcw, BookOpen
} from 'lucide-react'
import api from '../../api/axios'

const SUGGESTED_QUESTIONS = [
  'What is the difference between HashMap and HashTable?',
  'Explain ACID properties in DBMS',
  'What is the difference between process and thread?',
  'How does garbage collection work in Java?',
  'What is normalization in databases?',
  'Explain the OSI model layers',
  'What is dynamic programming?',
  'Explain RESTful API principles',
  'What is a deadlock and how to prevent it?',
  'Explain polymorphism in OOP',
]

const TOPIC_CHIPS = [
  { label: 'DSA', color: 'badge-blue' },
  { label: 'DBMS', color: 'badge-violet' },
  { label: 'OS', color: 'badge-yellow' },
  { label: 'Java / OOP', color: 'badge-green' },
  { label: 'Networks', color: 'badge-blue' },
  { label: 'System Design', color: 'badge-red' },
]

function Message({ msg }) {
  const isBot = msg.role === 'assistant'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        isBot ? 'bg-indigo-500/30 text-indigo-400' : 'bg-violet-500/30 text-violet-400'
      }`}>
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isBot ? '' : 'items-end flex flex-col'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? 'bg-white/8 border border-white/10 text-slate-200 rounded-tl-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm'
        }`}>
          {msg.content}
        </div>
        <p className="text-[10px] text-slate-600 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  )
}

export default function Doubts() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your AI doubt solver, powered by RAG (Retrieval-Augmented Generation). I can answer any CS, interview prep, or placement-related doubt. What would you like to know?`,
      time: 'just now',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topicFilter, setTopicFilter] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const question = text || input.trim()
    if (!question) return
    setInput('')

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await api.post('/rag/ask', { question })
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data?.answer || res.data || 'I found some relevant information. Let me elaborate on that...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      // Demo response when API is unavailable
      const demoAnswers = {
        'hashmap': 'HashMap is not synchronized and allows null keys/values. HashTable is synchronized (thread-safe) but slower. In modern Java, ConcurrentHashMap is preferred for thread safety.',
        'acid': 'ACID properties ensure reliable database transactions:\n• Atomicity: All or nothing\n• Consistency: Data remains valid\n• Isolation: Transactions don\'t interfere\n• Durability: Committed data persists even after failures',
        'default': `Great question! Here's what I know about "${question}":\n\nThis topic is covered in the knowledge base. The answer involves understanding core concepts from Computer Science fundamentals. I recommend also practicing related problems on LeetCode and GeeksforGeeks to solidify your understanding.\n\n(Note: Connect the backend RAG service for fully context-aware answers from uploaded study materials.)`,
      }
      const key = question.toLowerCase().includes('hashmap') ? 'hashmap' :
                  question.toLowerCase().includes('acid') ? 'acid' : 'default'
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: demoAnswers[key],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Chat cleared! Ask me anything about CS, interviews, or your placement prep.",
      time: 'just now',
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Doubt Solver</h1>
            <p className="text-xs text-slate-400">RAG-powered — answers from your study materials</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">AI Online</span>
          </div>
          <button onClick={clearChat} className="btn-ghost py-1.5 px-3 text-xs">
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4 shrink-0">
        {TOPIC_CHIPS.map(chip => (
          <button
            key={chip.label}
            onClick={() => setTopicFilter(topicFilter === chip.label ? null : chip.label)}
            className={`badge cursor-pointer transition-all ${
              topicFilter === chip.label ? chip.color : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-5 surface-card p-5 mb-4 scrollbar-thin">
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && !loading && (
        <div className="shrink-0 mb-3">
          <p className="text-xs text-slate-500 mb-2 font-medium">Suggested Questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 5).map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="shrink-0 surface-card flex items-center gap-3 p-3">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about CS, interviews, or placement prep..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            input.trim() && !loading
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'bg-white/5 text-slate-500'
          }`}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}
