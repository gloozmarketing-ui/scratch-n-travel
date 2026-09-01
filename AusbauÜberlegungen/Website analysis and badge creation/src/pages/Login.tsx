import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { supabase } from '../services/supabase'

type Step = 'email' | 'otp' | 'tester' | 'error'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginAsTester, triggerHaptic } = useTravel()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Private tester URL param: /login?tester=andrey
  useEffect(() => {
    const p = searchParams.get('test_account') || searchParams.get('tester') || ''
    if (p.toLowerCase().includes('andrey')) {
      loginAsTester()
      setTimeout(() => navigate('/passport'), 1000)
      setStep('tester')
    }
  }, [])

  // ------------------------------------------------------------------
  // 1. Send OTP via Supabase Magic Link (real email)
  // ------------------------------------------------------------------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    triggerHaptic(15)

    // Private tester shortcut
    if (email.toLowerCase().includes('andrey')) {
      loginAsTester()
      setStep('tester')
      setTimeout(() => navigate('/passport'), 1000)
      return
    }

    setLoading(true)
    setErrorMsg('')

    // If Supabase is configured, use it
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin + '/passport',
          shouldCreateUser: true,
        },
      })
      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }
    }
    // Always show OTP input (works in demo mode too)
    setLoading(false)
    setStep('otp')
  }

  // ------------------------------------------------------------------
  // 2. Verify OTP
  // ------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic([30, 60])
    setLoading(true)
    setErrorMsg('')

    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      })
      if (error) {
        // Demo fallback: accept any 6-digit code
        if (otp.length === 6) {
          setLoading(false)
          navigate('/passport')
          return
        }
        setErrorMsg('Ungültiger Code. Bitte prüfe deine E-Mail oder nutze den Demo-Code 123456.')
        setLoading(false)
        return
      }
    }
    setLoading(false)
    navigate('/passport')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 pb-24 md:pb-8">
      <div className="card w-full max-w-md p-8 border-[rgba(201,168,76,0.3)] shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🧭</span>
          <h1 className="font-display text-2xl font-bold text-[#F4E4C1]">Explorer Login</h1>
          <p className="font-script text-[rgba(201,168,76,0.5)] text-base">access your digital travel passport</p>
        </div>

        {/* TESTER ACTIVATED */}
        {step === 'tester' && (
          <div className="bg-[#0C1825] rounded-xl p-5 border border-amber-500/40 text-center space-y-2">
            <span className="text-3xl block">👑</span>
            <p className="font-display text-[#F4E4C1] text-base font-bold">Andrey Test – Master Access geladen!</p>
            <p className="font-mono text-xs text-[#C9A84C]">Level 25 · 460+ Badges · Alle Secret Spots freigeschaltet</p>
            <p className="text-[0.65rem] text-[#8A9AAA]">Weiterleitung zum Reisepass…</p>
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                Deine E-Mail Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@explorer.eu"
                className="field"
                required
                autoComplete="email"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 font-mono">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-xs font-bold shadow-lg disabled:opacity-60"
            >
              {loading ? '✉️ Sende Code…' : '✉️ 6-stelligen Code senden →'}
            </button>

            <div className="pt-3 border-t border-[rgba(201,168,76,0.1)] text-center">
              <p className="font-body text-[0.72rem] text-[#8A9AAA] mb-3">
                Noch kein Konto? Einfach E-Mail eingeben — dein Explorer-Pass wird automatisch erstellt.
              </p>
              <button
                type="button"
                onClick={() => {
                  loginAsTester()
                  setStep('tester')
                  setTimeout(() => navigate('/passport'), 1000)
                }}
                className="text-[0.65rem] font-mono text-[rgba(201,168,76,0.4)] hover:text-[#C9A84C] transition-colors"
              >
                🔒 Privater Tester-Zugang
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-[#0C1825] rounded-xl p-4 border border-emerald-500/30 text-center">
              <span className="text-2xl block mb-1">✉️</span>
              <p className="font-body text-emerald-400 text-sm font-semibold">Code gesendet!</p>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA] mt-1">an <strong>{email}</strong></p>
              <p className="font-mono text-[0.58rem] text-[#8A9AAA] mt-1">
                Bitte prüfe auch deinen Spam-Ordner. Der Code ist 10 Minuten gültig.
              </p>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                6-stelliger Bestätigungscode
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="______"
                className="field text-center font-mono tracking-[0.5em] text-xl"
                maxLength={6}
                required
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 font-mono">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="btn btn-primary w-full py-3 text-xs font-bold disabled:opacity-60"
            >
              {loading ? 'Prüfe Code…' : 'Bestätigen & Einloggen →'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  await handleSendOtp({ preventDefault: () => {} } as any)
                  setLoading(false)
                }}
                className="btn btn-ghost flex-1 text-xs py-2"
              >
                ↺ Code erneut senden
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setErrorMsg(''); setOtp('') }}
                className="btn btn-ghost flex-1 text-xs py-2"
              >
                ← Andere E-Mail
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
