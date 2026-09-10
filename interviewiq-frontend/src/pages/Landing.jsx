import { Link } from 'react-router-dom'
import { ArrowRight, Play, HelpCircle, Mic, BarChart3, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: HelpCircle,
    color: 'icon-blue',
    title: 'Doubt Solver',
    desc: 'Get instant, grounded answers from your actual DSA, Core Java, and aptitude material — not generic LLM guesses.',
  },
  {
    icon: Mic,
    color: 'icon-violet',
    title: 'Mock Interviews',
    desc: 'Practice with AI interviewers modeled on TCS, Cognizant, and Infosys patterns. Get scored, structured feedback.',
  },
  {
    icon: BarChart3,
    color: 'icon-green',
    title: 'Progress Analytics',
    desc: 'Track your weak topics, score trends, and session history over time with clear visual dashboards.',
  },
]

const steps = [
  { num: '1', title: 'Register', desc: 'Sign up with your college and department. Your TPO manages drive visibility for your college.' },
  { num: '2', title: 'Solve Doubts', desc: 'Ask any DSA or aptitude question. RAG retrieves grounded answers from curated material.' },
  { num: '3', title: 'Practice', desc: 'Schedule and run live mock interviews against company-specific AI interviewers.' },
  { num: '4', title: 'Track Growth', desc: 'Review scores, spot weak topics, and watch your performance improve over sessions.' },
]

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      {/* Orbs */}
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
          InterviewIQ <span style={{ color: 'var(--primary-light)', marginLeft: 4 }}>Pro</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Features</a>
          <a href="#how" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>How It Works</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500, textDecoration: 'none', padding: '8px 16px' }}>Log in</Link>
          <Link to="/register" className="btn-primary">Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 80px 60px', minHeight: 'calc(100vh - 64px)', gap: 60 }}>
        <div style={{ flex: 1, maxWidth: 560 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 28 }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-light)', display: 'inline-block' }} />
            AI-Powered Placement Prep
          </div>

          <h1 style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2.5px', marginBottom: 22 }}>
            Ace Your Campus<br />
            <span className="gradient-text">Placements with AI</span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 40 }}>
            Grounded doubt-solving, realistic mock interviews, and deep progress analytics — built for engineering students preparing for campus placements.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', transition: 'transform 0.15s' }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none' }}>
              <Play size={14} /> Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            {[['1,200+', 'Students Enrolled'], ['94%', 'Placement Rate'], ['50+', 'Partner Colleges']].map(([num, label], i) => (
              <>
                {i > 0 && <div style={{ width: 1, height: 36, background: 'var(--border)' }} />}
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{num}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Mock Interview Card */}
        <div style={{ flex: 1, maxWidth: 500 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)' }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>TCS NQT Mock Interview — Round 1</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>● LIVE</span>
            </div>
            {/* Messages */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { role: 'ai', text: "Hello Rohit! Let's begin your TCS NQT mock. Tell me about yourself and your experience with data structures." },
                { role: 'user', text: "I'm a final year CS student at VJTI. I've worked extensively with arrays, linked lists, and trees..." },
                { role: 'ai', text: "Good answer! Now, explain the time complexity difference between BFS and DFS on a graph. 🎯" },
              ].map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, background: msg.role === 'ai' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
                    {msg.role === 'ai' ? '🤖' : '👤'}
                  </div>
                  <div style={{ padding: '9px 13px', borderRadius: 11, fontSize: 12, lineHeight: 1.5, maxWidth: '80%', background: msg.role === 'ai' ? 'var(--surface2)' : 'rgba(124,58,237,0.25)', border: `1px solid ${msg.role === 'ai' ? 'var(--border)' : 'rgba(124,58,237,0.3)'}` }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', margin: '4px 16px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>Type your answer...</span>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role pills */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 80px 60px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Built for</span>
        {[['#60a5fa', 'Students'], ['#a78bfa', 'TPO Officers'], ['#34d399', 'College Admins']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />{label}
          </div>
        ))}
      </div>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '40px 80px 100px' }}>
        <div className="section-label">Platform Features</div>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.15, marginBottom: 12 }}>Everything you need<br />to crack placements</h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 48, maxWidth: 480 }}>Three focused tools that cover the complete placement journey — from preparation to analytics.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} style={{ background: 'var(--surface)', padding: '36px 32px', transition: 'background 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                background: color === 'icon-blue' ? 'rgba(59,130,246,0.12)' : color === 'icon-violet' ? 'rgba(124,58,237,0.12)' : 'rgba(16,185,129,0.12)',
                border: `1px solid ${color === 'icon-blue' ? 'rgba(59,130,246,0.2)' : color === 'icon-violet' ? 'rgba(124,58,237,0.2)' : 'rgba(16,185,129,0.2)'}`,
                color: color === 'icon-blue' ? '#60a5fa' : color === 'icon-violet' ? '#a78bfa' : '#34d399' }}>
                <Icon size={18} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.2px' }}>{title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 18 }}>{desc}</div>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary-light)', textDecoration: 'none' }}>
                Learn more <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how" style={{ position: 'relative', zIndex: 1, padding: '0 80px 100px' }}>
        <div className="section-label">How It Works</div>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 48 }}>Four steps to placement-ready</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{num}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 80px 120px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.15))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, maxWidth: 440 }}>Ready to ace your next campus placement?</h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 10 }}>Join 1,200+ students already preparing smarter.</p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
            <Link to="/register" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>Get Started Free →</Link>
            <Link to="/login" className="btn-outline" style={{ padding: '13px 24px', fontSize: 15 }}>Log in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '28px 80px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>© 2026 InterviewIQ Pro · Built by Rohit Dhondage</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'GitHub', 'LinkedIn'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
