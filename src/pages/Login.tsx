import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { supabase } from '../services/supabase'

type Step = 'email' | 'otp'

/** Ist Supabase konfiguriert? Ohne echtes Backend gibt es keinen Login. */
const authReady = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Login() {
  const navigate = useNavigate()
  const { triggerHaptic } = useTravel()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // ------------------------------------------------------------------
  // 1. Login-Link per E-Mail anfordern
  // ------------------------------------------------------------------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !authReady) return
    triggerHaptic(15)

    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin + '/passport',
        shouldCreateUser: true,
      },
    })

    if (error) {
      setErrorMsg('Die E-Mail konnte nicht gesendet werden. Bitte später erneut versuchen.')
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('otp')
  }

  // ------------------------------------------------------------------
  // 2. Code bestätigen — ausschliesslich über Supabase.
  //    Es gibt bewusst KEINEN Demo-Fallback: ein Local-Fallback würde
  //    jeden 6-stelligen Code als gültig annehmen.
  // ------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !otp.trim() || !authReady) return
    triggerHaptic([30, 60])
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    })

    if (error) {
      setErrorMsg('Dieser Code ist nicht gültig oder abgelaufen. Fordere einen neuen an.')
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/passport')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 pb-24 md:pb-8">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🧭</span>
          <h1 className="font-display text-2xl font-bold text-ink">Explorer Login</h1>
          <p className="font-hand text-lg text-sun">dein digitaler Reisepass</p>
        </div>

        {!authReady && (
          <div className="card-accent rounded-xl p-4 mb-5 text-xs text-ink-soft">
            <p className="font-semibold text-ink mb-1">Anmeldung noch nicht aktiv</p>
            <p>
              Es ist noch kein Supabase-Projekt verbunden. Stöbern, Geheimtipps und
              die Suche funktionieren ohne Konto — das Anmelden geht los, sobald
              das Backend live ist.
            </p>
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="label-input block mb-1">
                Deine E-Mail-Adresse
              </label>
              <input
                id="login-email"
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
              <div className="rounded-lg p-3 text-xs chip-warn" role="alert">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-xs font-bold"
            >
              {loading ? '✉️ Sende Code…' : '✉️ 6-stelligen Code senden →'}
            </button>

            <div className="pt-3 border-t border-line-soft text-center">
              <p className="text-xs text-faint">
                Noch kein Konto? Gib deine E-Mail ein — dein Explorer-Pass wird
                automatisch angelegt.
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-xl p-4 bg-lagoon-wash border border-lagoon text-center">
              <span className="text-2xl block mb-1">✉️</span>
              <p className="text-sm font-semibold text-ink">Code gesendet!</p>
              <p className="text-xs text-ink-faint mt-1">
                an <strong>{email}</strong>
              </p>
              <p className="text-xs text-ink-faint mt-1">
                Bitte prüfe auch deinen Spam-Ordner. Der Code ist 10 Minuten gültig.
              </p>
            </div>

            <div>
              <label htmlFor="login-otp" className="label-input block mb-1">
                6-stelliger Bestätigungscode
              </label>
              <input
                id="login-otp"
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
              <div className="rounded-lg p-3 text-xs chip-warn" role="alert">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="btn btn-primary w-full py-3 text-xs font-bold"
            >
              {loading ? 'Prüfe Code…' : 'Bestätigen & Einloggen →'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
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
