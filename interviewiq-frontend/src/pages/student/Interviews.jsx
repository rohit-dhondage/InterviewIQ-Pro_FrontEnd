import { useState, useEffect } from 'react'
import { Calendar, Video, Clock, CheckCircle, XCircle, ChevronRight, MessageSquare, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Interviews() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const navigate = useNavigate()
  
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [pastInterviews, setPastInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        const [upcomingRes, historyRes] = await Promise.all([
          api.get('/interviews/upcoming/me'),
          api.get('/interviews/history/me')
        ])

        const mapUpcoming = (item) => ({
          id: item.id,
          company: item.company || 'Practice',
          type: item.interviewType || 'Mock Round',
          date: new Date(item.scheduledAt).toLocaleDateString(),
          time: new Date(item.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          duration: item.durationSeconds ? `${Math.floor(item.durationSeconds/60)} mins` : 'Flexible',
          interviewer: 'AI Assistant',
          link: `/student/interviews/session-${item.id}`
        })

        const mapHistory = (item) => ({
          id: item.id,
          company: item.company || 'Practice',
          type: item.interviewType || 'Mock Round',
          date: item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString() : 'Past',
          score: item.overallScore ? `${item.overallScore}%` : 'N/A',
          status: item.overallScore && item.overallScore >= 70 ? 'Passed' : 'Needs Improvement',
          feedback: item.feedback || 'No feedback available.'
        })

        setUpcomingInterviews(upcomingRes.data.map(mapUpcoming))
        setPastInterviews(historyRes.data.map(mapHistory))
      } catch (error) {
        console.error('Error fetching interviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])



  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Interviews</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage your upcoming sessions and review past performance.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'past' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('past')}
          >
            Past Feedback
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('practice')}
          >
            Practice
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : activeTab === 'upcoming' && (
        <div className="grid gap-4">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-white/5">
              <div className="flex items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Video size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{interview.company} - {interview.type}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {interview.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {interview.time} ({interview.duration})</span>
                    <span className="badge badge-blue text-[10px] py-0.5">{interview.interviewer}</span>
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-primary whitespace-nowrap"
                onClick={() => navigate(interview.link)}
              >
                Join Session
              </button>
            </div>
          ))}
          {upcomingInterviews.length === 0 && (
            <div className="text-center py-12 text-gray-400">No upcoming interviews scheduled.</div>
          )}
        </div>
      )}

      {!loading && activeTab === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastInterviews.map((interview) => (
            <div key={interview.id} className="surface-card flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{interview.company}</h3>
                  <p className="text-sm text-gray-400">{interview.type}</p>
                </div>
                {interview.status === 'Passed' ? (
                  <span className="badge badge-green flex items-center gap-1"><CheckCircle size={12} /> {interview.score}</span>
                ) : (
                  <span className="badge badge-yellow flex items-center gap-1"><XCircle size={12} /> {interview.score}</span>
                )}
              </div>
              <div className="text-sm text-gray-300 flex-grow bg-black/20 p-4 rounded-lg mb-4 flex gap-3">
                <MessageSquare className="text-gray-500 shrink-0 mt-0.5" size={16} />
                <p>{interview.feedback}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <span className="text-xs text-gray-500">{interview.date}</span>
                <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  View Detailed Report <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
          {pastInterviews.length === 0 && (
            <div className="text-center py-12 text-gray-400 col-span-full">No past interview history found.</div>
          )}
        </div>
      )}

      {!loading && activeTab === 'practice' && (
        <div className="text-center py-16 surface-card border-dashed">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Video className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start a Practice Session</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Choose a topic and our AI will conduct a mock interview to help you prepare for the real thing.
          </p>
          <button className="btn btn-primary mx-auto" onClick={() => navigate('/student/interviews/practice-setup')}>
            Start AI Mock Interview
          </button>
        </div>
      )}
    </div>
  )
}
