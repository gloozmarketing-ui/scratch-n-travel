import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, triggerHaptic } = useTravel()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    triggerHaptic(15)
    setSent(true)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic([30, 60])
    navigate('/passport')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 pb-24 md:pb-8">
      <div className="card w-full max-w-md p-8 border-[rgba(201,168,76,0.3)] shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🧭</span>
          <h1 className="font-display text-2xl font-bold text-[#F4E4C1]">Explorer Login</h1>
          <p className="font-script text-[rgba(201,168,76,0.5)] text-base">access your digital travel passport</p>
        </div>

        {sent ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-[#0C1825] rounded-xl p-4 border border-emerald-500/30 text-center">
              <span className="text-2xl block mb-1">✉️</span>
              <p className="font-body text-emerald-400 text-sm font-semibold">Magic Link / Code gesendet!</p>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA] mt-1">an {email}</p>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                6-stelliger Bestätigungscode (Demo-Code: 123456)
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="field text-center font-mono tracking-widest text-lg"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold">
              Bestätigen & Einloggen →
            </button>

            <button type="button" onClick={() => setSent(false)} className="btn btn-ghost w-full text-xs py-2">
              ← Andere E-Mail verwenden
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                Deine E-Mail Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="explorer@wanderer.eu"
                className="field"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold">
              Passwortlosen Login-Link senden →
            </button>

            <div className="section-divider my-4">
              <span className="font-mono text-[0.58rem] tracking-widest">ODER</span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(10)
                navigate('/passport')
              }}
              className="btn btn-secondary w-full py-2.5 text-xs"
            >
              🚀 Als Gast ({user.name}) fortfahren
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
