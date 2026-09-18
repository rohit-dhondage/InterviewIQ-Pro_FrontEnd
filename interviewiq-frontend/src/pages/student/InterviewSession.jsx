import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Loader2, CheckCircle, ArrowLeft, Brain, Code, ChevronRight, XCircle } from 'lucide-react'
import api from '../../api/axios'

export default function InterviewSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const [finished, setFinished] = useState(false)
  const [feedback, setFeedback] = useState(null) // Object with { status, points: [] } or just text
  const [rawFeedbackText, setRawFeedbackText] = useState('')

  const rawSessionId = sessionId?.replace('session-', '')

  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await api.post(`/interviews/${rawSessionId}/start`)
        setQuestion(res.data.question)
        if (res.data.finished) {
          setFinished(true)
          setRawFeedbackText(res.data.feedback)
        }
      } catch (err) {
        console.error('Failed to start session', err)
        setQuestion('Unable to start this interview session. Please go back and try again.')
      } finally {
        setStarting(false)
      }
    }
    startSession()
  }, [rawSessionId])

  const submitAnswer = async () => {
    if (!code.trim() || loading || finished) return

    setLoading(true)
    try {
      const res = await api.post(`/interviews/${rawSessionId}/answer`, { answer: code })
      
      // The backend returns a conversational response. We'll show it in the feedback pane.
      // If it's a new question, update the left pane, and put AI's comments in the right pane.
      
      const responseText = res.data.question || res.data.feedback || 'Thank you.'
      setRawFeedbackText(responseText)
      
      // If it looks like a new question (contains question mark, etc), we'll swap it after user clicks 'Next'
      // But for simplicity of matching the mockup, we'll just parse the response:
      if (res.data.finished) {
        setFinished(true)
        setRawFeedbackText(res.data.feedback)
      }
    } catch (err) {
      console.error(err)
      setRawFeedbackText('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    // In a real app, this would fetch the next question. 
    // Here we'll just swap the feedback text into the question area to simulate the loop if not finished.
    if (!finished) {
      setQuestion(rawFeedbackText)
      setRawFeedbackText('')
      setCode('')
    } else {
      navigate('/student/interviews')
    }
  }

  // Helper to parse generic text into the structured feedback bullet points for the UI
  const parseFeedback = (text) => {
    if (!text) return null
    // Simple mock parser: assume if it contains "Good" or "Great", it's positive.
    const isPositive = text.toLowerCase().includes('good') || text.toLowerCase().includes('great') || text.toLowerCase().includes('correct')
    const points = text.split('\n').filter(p => p.trim().length > 0).slice(0, 4) // take first few sentences/lines
    return {
      status: isPositive ? 'success' : 'warning',
      title: isPositive ? 'Good approach!' : 'Needs Improvement',
      points: points
    }
  }

  const parsedFeedback = parseFeedback(rawFeedbackText)

  if (starting) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/student/interviews')} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft size={18} />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Brain size={16} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm">InterviewIQ Pro</h1>
          </div>
        </div>
        {finished && (
          <span className="badge badge-green flex items-center gap-1"><CheckCircle size={12} /> Interview Complete</span>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6">
          
          {/* Left Pane - Coding Area */}
          <div className="flex-[2] flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">AI Technical Interview</h2>
              <p className="text-slate-500 text-sm">Practice real interview questions with AI and get instant feedback.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200 px-2 pt-2">
                {['Coding', 'System Design', 'DSA', 'Behavioral'].map((tab, i) => (
                  <button key={tab} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                    i === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Question Text */}
              <div className="p-6 border-b border-slate-100">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {question}
                </p>
              </div>

              {/* Code Editor Area */}
              <div className="flex-1 flex flex-col p-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-2 px-2">
                  <select className="bg-white border border-slate-200 text-sm text-slate-700 rounded-md px-2 py-1 outline-none">
                    <option>Java</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>C++</option>
                  </select>
                </div>
                
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={loading || finished}
                  placeholder="// Write your solution here..."
                  className="flex-1 w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none shadow-inner"
                />

                <div className="flex justify-end mt-4">
                  <button
                    onClick={submitAnswer}
                    disabled={loading || finished || !code.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                    Run
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane - AI Feedback */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4 h-11 flex items-end">AI Feedback</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col relative">
              
              {!parsedFeedback ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                  <Code size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Submit your code to receive AI feedback on complexity, edge cases, and optimizations.</p>
                </div>
              ) : (
                <div className="flex-1">
                  <div className={`flex items-center gap-2 font-bold mb-4 ${parsedFeedback.status === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {parsedFeedback.status === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {parsedFeedback.title}
                  </div>
                  
                  <ul className="space-y-3">
                    {parsedFeedback.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Button */}
              {parsedFeedback && (
                <div className="mt-8 flex justify-end">
                  <button onClick={handleNext} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    {finished ? 'Finish' : 'Next'} <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
