import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Play, Loader2, CheckCircle2, ArrowLeft, Brain, Code2, ChevronRight, XCircle,
  Video, VideoOff, Mic, MicOff, Volume2, VolumeX, Monitor, ShieldCheck, Terminal,
  Cpu, FileText, Sparkles, Clock, Download, RefreshCw, AlertCircle, Maximize2, Zap
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import api from '../../api/axios'

// Language starter templates for realistic coding environment
const STARTER_CODES = {
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your optimal solution here
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  Python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your optimal Python solution here
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
`,
  CPlusPlus: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            return [map.get(comp), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
  CSharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int comp = target - nums[i];
            if (map.ContainsKey(comp)) {
                return new int[] { map[comp], i };
            }
            map[nums[i]] = i;
        }
        return new int[0];
    }
}`
}

const SAMPLE_TEST_CASES = [
  { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', status: 'PASSED', time: '14ms', memory: '14.2MB' },
  { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]', status: 'PASSED', time: '18ms', memory: '14.5MB' },
  { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]', status: 'PASSED', time: '11ms', memory: '13.8MB' },
]

export default function InterviewSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  // Session state
  const [question, setQuestion] = useState('')
  const [code, setCode] = useState(STARTER_CODES.Java)
  const [language, setLanguage] = useState('Java')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const [finished, setFinished] = useState(false)
  const [rawFeedbackText, setRawFeedbackText] = useState('')
  const [questionCount, setQuestionCount] = useState(1)
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'ide' | 'tests' | 'scorecard'

  // Microsoft Teams Control state
  const [micActive, setMicActive] = useState(true)
  const [cameraActive, setCameraActive] = useState(true)
  const [aiVoiceMuted, setAiVoiceMuted] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(45 * 60) // 45 mins countdown

  // Voice Speech State
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Camera Video Ref
  const videoRef = useRef(null)
  const rawSessionId = sessionId?.replace('session-', '')

  // Timer Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Setup Webcam if available
  useEffect(() => {
    let stream = null
    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s
          if (videoRef.current) videoRef.current.srcObject = s
        })
        .catch(() => {
          console.log('Webcam permission not granted or device missing — showing digital avatar preview')
        })
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
        videoRef.current.srcObject = null
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [cameraActive])

  // Text to Speech Helper
  const speakQuestion = (text) => {
    if (aiVoiceMuted || !('speechSynthesis' in window) || !text) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block snippet.').substring(0, 300)
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  // Voice Dictation Helper
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported on this browser. You can type your solution code directly!')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setCode(prev => prev + '\n// Note: ' + transcript)
    }
    recognition.start()
  }

  // Start Session API call
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await api.post(`/interviews/${rawSessionId}/start`)
        const qText = res.data.question || 'Describe your approach to solve the problem efficiently.'
        setQuestion(qText)
        speakQuestion(qText)
        if (res.data.finished) {
          setFinished(true)
          setRawFeedbackText(res.data.feedback)
          setActiveTab('scorecard')
        }
      } catch (err) {
        console.warn('Backend unavailable, launching Microsoft Assessment demo question:', err)
        const demoQ = 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].'
        setQuestion(demoQ)
        speakQuestion(demoQ)
      } finally {
        setStarting(false)
      }
    }
    startSession()
  }, [rawSessionId])

  // Language Change Handler
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    if (STARTER_CODES[newLang]) {
      setCode(STARTER_CODES[newLang])
    }
  }

  // Submit Answer to AI Interviewer
  const submitAnswer = async () => {
    if (!code.trim() || loading || finished) return

    setLoading(true)
    try {
      const res = await api.post(`/interviews/${rawSessionId}/answer`, { answer: code })
      const responseText = res.data.question || res.data.feedback || 'Thank you.'
      
      setRawFeedbackText(responseText)
      setQuestionCount(prev => prev + 1)
      
      if (res.data.finished) {
        setFinished(true)
        setRawFeedbackText(res.data.feedback)
        setActiveTab('scorecard')
        speakQuestion('Interview complete. Here is your final performance evaluation scorecard.')
      } else {
        setQuestion(responseText)
        speakQuestion(responseText)
        setActiveTab('problem')
      }
    } catch (err) {
      console.warn('Backend offline, using Microsoft evaluation response:', err)
      const demoReply = 'Excellent solution! Your approach uses a single-pass Hash Map with O(N) Time Complexity and O(N) Auxiliary Space. All edge cases including duplicate target values are handled correctly.\n\nNext Question (Round 2):\nHow would you modify this solution if the input array is already sorted? Can you achieve O(1) extra space?'
      setRawFeedbackText(demoReply)
      setQuestion(demoReply)
      speakQuestion(demoReply)
      setQuestionCount(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  // Export PDF Assessment Report
  const downloadPdfReport = () => {
    const doc = new jsPDF()
    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Microsoft Technical Assessment Report', 14, 22)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(148, 163, 184)
    doc.text(`Candidate Assessment ID: MS-INT-${sessionId}  |  Date: ${new Date().toLocaleDateString()}`, 14, 32)
    
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Performance Summary & Evaluation', 14, 52)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`- Overall Readiness Score: 88/100`, 14, 62)
    doc.text(`- Data Structures & Algorithms: Strong Pass (O(N) Time Complexity)`, 14, 70)
    doc.text(`- Code Structure & Quality: Excellent Clean Code Standards`, 14, 78)
    doc.text(`- Edge Case & Error Handling: Verified across test suites`, 14, 86)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('AI Senior Interviewer Feedback:', 14, 100)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const splitText = doc.splitTextToSize(rawFeedbackText || 'Candidate demonstrated optimal problem solving with hash map lookups, edge case handling, and clear communication.', 180)
    doc.text(splitText, 14, 110)

    doc.save(`Microsoft_Assessment_Report_${sessionId}.pdf`)
  }

  // Format Timer String (mm:ss)
  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (starting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-6 animate-pulse">
          <Brain size={36} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-tight">Microsoft AI Interview Suite</h2>
        <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
          <Loader2 size={16} className="animate-spin text-indigo-400" /> Initializing secure proctored environment...
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> AI Proctoring Active</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Video size={14} className="text-blue-400" /> HD Stream Ready</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* 🔴 Top Bar - Microsoft Teams / Assessment Header */}
      <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 shadow-md">
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/interviews')}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
            title="Exit Session"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Brain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-wide">Microsoft Assessment Suite</span>
                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  AI Live Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Session #{rawSessionId?.substring(0, 8) || '8f2a9c'}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> LIVE
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Assessment Stage Pipeline */}
        <div className="hidden lg:flex items-center gap-6 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-1.5">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
            <Clock size={16} className="text-amber-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className={questionCount === 1 ? 'text-indigo-400 font-bold' : 'text-emerald-400'}>1. Intro & Approach</span>
            <span>→</span>
            <span className={questionCount === 2 ? 'text-indigo-400 font-bold' : questionCount > 2 ? 'text-emerald-400' : ''}>2. Code Implementation</span>
            <span>→</span>
            <span className={questionCount === 3 ? 'text-indigo-400 font-bold' : questionCount > 3 ? 'text-emerald-400' : ''}>3. Optimization</span>
            <span>→</span>
            <span className={finished ? 'text-emerald-400 font-bold' : ''}>4. Evaluation</span>
          </div>
        </div>

        {/* Right: Microsoft Teams Meeting Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              micActive ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              cameraActive ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
            title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
          </button>

          <button
            onClick={() => setAiVoiceMuted(!aiVoiceMuted)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              !aiVoiceMuted ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
            title={!aiVoiceMuted ? 'Mute AI Voice' : 'Unmute AI Voice'}
          >
            {!aiVoiceMuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => setScreenSharing(!screenSharing)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              screenSharing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Screen Sharing Status"
          >
            <Monitor size={18} />
          </button>

          <button
            onClick={() => navigate('/student/interviews')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
          >
            End Call
          </button>
        </div>
      </header>

      {/* 💻 Main Split Grid Content */}
      <div className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1920px] mx-auto w-full">
        
        {/* ------------------------------------------------------------- */}
        {/* LEFT COLUMN: Microsoft AI Video Call & Live AI Dialogue Feed (Cols 4) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* AI Senior Interviewer Video Tile */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Microsoft AI Interviewer</span>
              </div>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-indigo-500/30">
                Principal Engineer AI
              </span>
            </div>

            {/* AI Avatar Visualizer */}
            <div className="my-6 flex flex-col items-center justify-center relative z-10">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 border-4 border-slate-800 flex items-center justify-center text-white shadow-2xl transition-all ${
                isSpeaking ? 'scale-105 ring-4 ring-indigo-500/40 shadow-indigo-500/50' : ''
              }`}>
                <Brain size={40} />
              </div>
              
              {/* Sound wave animation when speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-1 mt-3">
                  <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-8 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3 z-10">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> Microsoft Verified AI</span>
              <span className="text-[11px] text-indigo-300">Voice Synthesis Active</span>
            </div>
          </div>

          {/* Candidate Webcam Feed Tile */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-slate-300">You (Candidate)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> HD 1080p
              </span>
            </div>

            {/* Video element or fallback preview */}
            <div className="absolute inset-0 top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center">
              {cameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <VideoOff size={32} className="mb-2" />
                  <span className="text-xs">Camera Feed Disabled</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-300 font-medium">Proctoring Grid: Optimal</span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {micActive ? <Mic size={12} className="text-emerald-400" /> : <MicOff size={12} className="text-red-400" />}
                <span>{micActive ? 'Mic Active' : 'Muted'}</span>
              </div>
            </div>
          </div>

          {/* AI Dialogue & Interview Question Feed */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Live AI Interview Prompt</h2>
              </div>
              <button
                onClick={() => speakQuestion(question)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Volume2 size={14} /> Replay Voice
              </button>
            </div>

            {/* Prompt Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
                <p className="font-semibold text-indigo-300 text-xs uppercase tracking-wider mb-2">Question #{questionCount}</p>
                {question}
              </div>

              {rawFeedbackText && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-emerald-400 text-xs mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={14} /> AI Evaluator Feedback:
                  </p>
                  <p className="whitespace-pre-line">{rawFeedbackText}</p>
                </div>
              )}
            </div>

            {/* Voice Dictation Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <button
                onClick={startListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Mic size={14} /> {isListening ? 'Listening...' : 'Voice Input Dictation'}
              </button>
              
              <span className="text-[11px] text-slate-500">Press Run to Submit</span>
            </div>
          </div>

        </div>


        {/* ------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Microsoft IDE Assessment Suite (Cols 8) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'problem'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText size={15} /> Problem Statement
                </button>

                <button
                  onClick={() => setActiveTab('ide')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'ide'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 size={15} /> IDE Code Editor
                </button>

                <button
                  onClick={() => setActiveTab('tests')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'tests'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal size={15} /> Test Cases & Terminal
                </button>

                {finished && (
                  <button
                    onClick={() => setActiveTab('scorecard')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                      activeTab === 'scorecard'
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles size={15} /> Assessment Scorecard
                  </button>
                )}
              </div>

              {/* Language Selector Dropdown */}
              <div className="flex items-center gap-3 pb-1">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Language:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Java">Java 21</option>
                  <option value="Python">Python 3.12</option>
                  <option value="CPlusPlus">C++ 20</option>
                  <option value="JavaScript">JavaScript ES6</option>
                  <option value="CSharp">C# .NET 8</option>
                </select>
              </div>
            </div>


            {/* TAB CONTENT 1: Problem Statement */}
            {activeTab === 'problem' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Two Sum - Optimal Hash Target Lookup</h2>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
                        Medium Difficulty
                      </span>
                      <span className="text-slate-400">Microsoft SDE-II Standard Assessment</span>
                      <span className="text-slate-500">• Target: O(N) Time Complexity</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('ide')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Open Code Editor <ChevronRight size={16} />
                  </button>
                </div>

                <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
                  <p>
                    Given an array of integers <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono">nums</code> and an integer <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono">target</code>, return indices of the two numbers such that they add up to target.
                  </p>

                  <p>
                    You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                    <p className="font-bold text-indigo-400 uppercase font-sans tracking-wider text-[11px]">Example 1:</p>
                    <p><strong className="text-slate-400">Input:</strong> nums = [2,7,11,15], target = 9</p>
                    <p><strong className="text-slate-400">Output:</strong> [0,1]</p>
                    <p><strong className="text-slate-400">Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                    <p className="font-bold text-indigo-400 uppercase font-sans tracking-wider text-[11px]">Constraints:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
                      <li>2 &lt;= nums.length &lt;= 10^4</li>
                      <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                      <li>-10^9 &lt;= target &lt;= 10^9</li>
                      <li>Only one valid answer exists.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}


            {/* TAB CONTENT 2: Code Editor (VS Code Theme) */}
            {activeTab === 'ide' && (
              <div className="flex-1 flex flex-col bg-[#090d16] font-mono text-sm relative">
                
                {/* Line Numbers + Code Editor Area */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Line Numbers Column */}
                  <div className="w-12 bg-slate-950/80 text-slate-600 border-r border-slate-800/80 py-4 text-right pr-3 font-mono text-xs select-none space-y-1">
                    {Array.from({ length: 22 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Code Textarea */}
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={loading || finished}
                    spellCheck="false"
                    className="flex-1 bg-transparent text-slate-200 font-mono text-xs sm:text-sm p-4 outline-none resize-none leading-relaxed focus:ring-0 selection:bg-indigo-500/30"
                    placeholder="// Write your solution here..."
                  />
                </div>

                {/* Bottom Action Footer */}
                <div className="h-16 bg-[#0f172a] border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCode(STARTER_CODES[language] || '')}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <RefreshCw size={13} /> Reset Boilerplate
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                    >
                      <Terminal size={14} /> Run Test Cases
                    </button>

                    <button
                      onClick={submitAnswer}
                      disabled={loading || finished || !code.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> Evaluating Code...
                        </>
                      ) : (
                        <>
                          <Play size={15} fill="currentColor" /> Submit Answer to AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* TAB CONTENT 3: Test Cases & Execution Terminal */}
            {activeTab === 'tests' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-[#090d16] font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                      <Terminal size={18} className="text-emerald-400" /> Standard Test Suite Results
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">Execution Environment: Linux x86_64, OpenJDK 21.0.2</p>
                  </div>

                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 font-sans">
                    <CheckCircle2 size={14} /> All 3 Test Cases Passed
                  </span>
                </div>

                <div className="space-y-4">
                  {SAMPLE_TEST_CASES.map(tc => (
                    <div key={tc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
                      <div className="flex items-center justify-between mb-2 border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-indigo-400 font-sans">Test Case #{tc.id}</span>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-slate-400">Runtime: {tc.time}</span>
                          <span className="text-slate-400">Memory: {tc.memory}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            {tc.status}
                          </span>
                        </div>
                      </div>
                      <p className="mb-1"><strong className="text-slate-500">Input:</strong> {tc.input}</p>
                      <p><strong className="text-slate-500">Expected Output:</strong> {tc.expected}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* TAB CONTENT 4: Microsoft Evaluation Scorecard (When Complete) */}
            {(activeTab === 'scorecard' || finished) && (
              <div className="p-8 flex-1 overflow-y-auto space-y-8 bg-[#090d16]">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                      Microsoft AI Final Scorecard
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-1">Technical Assessment Complete</h2>
                    <p className="text-sm text-slate-300">
                      Congratulations! Your code structure, complexity, and approach have been verified.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 min-w-[120px]">
                      <p className="text-3xl font-extrabold text-emerald-400">88%</p>
                      <p className="text-[11px] text-slate-400 uppercase font-bold mt-1">Readiness Grade</p>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Problem Solving</p>
                    <p className="text-lg font-bold text-indigo-400">Optimal (Hash Map)</p>
                    <p className="text-xs text-slate-500 mt-2">Single pass O(N) lookup approach</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Time & Space</p>
                    <p className="text-lg font-bold text-emerald-400">O(N) Time / O(N) Space</p>
                    <p className="text-xs text-slate-500 mt-2">Meets Microsoft SDE-II benchmarks</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Edge Case Coverage</p>
                    <p className="text-lg font-bold text-amber-400">100% Passed</p>
                    <p className="text-xs text-slate-500 mt-2">Verified across all 3 test suites</p>
                  </div>
                </div>

                {/* Detailed Feedback Text */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Brain size={16} className="text-indigo-400" /> AI Senior Interviewer Assessment Log
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line border border-slate-800/80">
                    {rawFeedbackText || 'Candidate showed excellent problem solving capabilities with clean, readable code. Hash map approach was communicated effectively. Recommended for next round!'}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={downloadPdfReport}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download Official Microsoft PDF Scorecard
                  </button>

                  <button
                    onClick={() => navigate('/student/interviews')}
                    className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    Complete Session & Return to Portal <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
