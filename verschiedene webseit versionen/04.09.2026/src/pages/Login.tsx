import { useState } from 'react'
import { Link } from 'react-router-dom'

type Tab = 'login' | 'signup'

export default function Login() {
  const [tab, setTab] = useState<Tab>('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handle = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1400)
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <svg width="56" height="56" viewBox="0 0 100 100">
              <polygon points="50,6 44,50 56,50"  fill="#C9A84C" />
              <polygon points="50,94 44,50 56,50" fill="#8A7040" />
              <polygon points="94,50 50,44 50,56" fill="#8A7040" />
              <polygon points="6,50 50,44 50,56"  fill="#8A7040" />
              <circle cx="50" cy="50" r="9" fill="#C9A84C" />
              <circle cx="50" cy="50" r="4" fill="#0C1825" />
            </svg>
          </div>
          <h1 className="font-display text-[#C9A84C] text-2xl font-bold">Scratch'n'Travel</h1>
          <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">chart your course</p>
        </div>

        {done ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <p className="font-display text-[#F4E4C1] text-xl font-bold mb-2">
              {tab === 'login' ? 'Welcome back, Explorer!' : 'Welcome aboard, Explorer!'}
            </p>
            <p className="font-body text-[#8A9AAA] mb-6">Your journey continues…</p>
            <Link to="/" className="btn btn-primary w-full">Enter the Map →</Link>
          </div>
        ) : (
          <div className="card p-8">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[#0C1825] rounded-lg mb-6">
              {([['login','Sign In'],['signup','Create Account']] as const).map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 btn py-2 text-[0.72rem] ${tab === t ? 'btn-primary' : 'btn-ghost border-transparent'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={handle} className="btn btn-ghost w-full gap-3 py-3">
                <span className="text-lg">G</span> Continue with Google
              </button>
              <button onClick={handle} className="btn btn-ghost w-full gap-3 py-3">
                <span className="text-lg">🍎</span> Continue with Apple
              </button>
            </div>

            <div className="section-divider mb-6"><span className="font-mono text-[0.6rem] tracking-widest">or with email</span></div>

            {tab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1.5">Email</label>
                  <input type="email" value={loginForm.email} onChange={e => setLoginForm(p=>({...p,email:e.target.value}))} className="field" placeholder="explorer@email.com" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest">Password</label>
                    <button className="font-mono text-[0.6rem] text-[#C9A84C] hover:text-[#E8C460]">Forgot?</button>
                  </div>
                  <input type="password" value={loginForm.password} onChange={e => setLoginForm(p=>({...p,password:e.target.value}))} className="field" placeholder="••••••••" />
                </div>
                <button onClick={handle} disabled={loading} className="btn btn-primary w-full py-3 mt-2 disabled:opacity-50">
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1.5">Your Name</label>
                  <input value={signupForm.name} onChange={e => setSignupForm(p=>({...p,name:e.target.value}))} className="field" placeholder="Explorer name" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1.5">Email</label>
                  <input type="email" value={signupForm.email} onChange={e => setSignupForm(p=>({...p,email:e.target.value}))} className="field" placeholder="explorer@email.com" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1.5">Password</label>
                  <input type="password" value={signupForm.password} onChange={e => setSignupForm(p=>({...p,password:e.target.value}))} className="field" placeholder="Minimum 8 characters" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1.5">Confirm Password</label>
                  <input type="password" value={signupForm.confirm} onChange={e => setSignupForm(p=>({...p,confirm:e.target.value}))} className="field" placeholder="Repeat password" />
                </div>
                <p className="font-mono text-[0.6rem] text-[#8A9AAA] leading-relaxed">
                  By creating an account you agree to our <Link to="/terms" className="text-[#C9A84C] hover:underline">Terms of Service</Link> and <Link to="/datenschutz" className="text-[#C9A84C] hover:underline">Privacy Policy</Link>.
                </p>
                <button onClick={handle} disabled={loading} className="btn btn-primary w-full py-3 disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create Account — Free →'}
                </button>
              </div>
            )}

            <p className="font-body text-center text-[#8A9AAA] text-sm mt-6">
              {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-[#C9A84C] hover:text-[#E8C460] transition-colors">
                {tab === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        )}

        <p className="text-center font-mono text-[0.6rem] text-[#8A9AAA] mt-6">
          🔒 Passwortlose Anmeldung · Keine Werbe-Tracker
        </p>
      </div>
    </div>
  )
}
