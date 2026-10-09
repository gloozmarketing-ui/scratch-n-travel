import React, { useState } from 'react'
import { supportedLanguages, useI18n, SupportedLanguage } from '../lib/i18n'

interface LanguageSelectorProps {
  compact?: boolean
  className?: string
}

export default function LanguageSelector({ compact = false, className = '' }: LanguageSelectorProps) {
  const { lang: currentLang, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentMeta = supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages[0]

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sprache auswählen"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? '0.25rem' : '0.45rem',
          padding: compact ? '0.3rem 0.55rem' : '0.35rem 0.75rem',
          borderRadius: 999,
          background: 'var(--paper-deep)',
          border: '1px solid var(--line)',
          color: 'var(--ink)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          lineHeight: 1,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span style={{ fontSize: '0.95rem' }}>{currentMeta.flag}</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {compact ? currentMeta.code : currentMeta.label}
        </span>
        <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: '1px' }}>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 60 }}
          />
          <div
            role="menu"
            aria-label="Verfügbare Sprachen"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              zIndex: 70,
              minWidth: '160px',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md, 0 8px 24px rgba(0,0,0,0.12))',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {supportedLanguages.map((lang) => {
              const active = lang.code === currentLang
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: active ? 'var(--sun-wash, rgba(235,142,39,0.12))' : 'transparent',
                    color: active ? 'var(--sun)' : 'var(--ink)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>{lang.flag}</span>
                  <span style={{ flex: 1 }}>{lang.label}</span>
                  {active && <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
