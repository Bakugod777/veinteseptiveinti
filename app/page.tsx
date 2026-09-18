'use client'

import { useState } from 'react'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

const loveNotes = [
  {
    label: 'Poema',
    title: 'En cosas que no son tú',
    text: `Me di cuenta de que te amaba de la forma más absurda posible.\n\nNo fue cuando te extrañé. No fue cuando pensé en ti. Ni siquiera cuando me descubrí sonriendo por una tontería que dijiste.\n\nFue cuando empecé a verte en cosas que no tenían nada que ver contigo. En canciones que jamás escucharías. En películas que ni siquiera te gustan. En frases escritas por personas que murieron mucho antes de que naciéramos. Y aun así aparecías. Como si hubieras encontrado una forma extraña de expandirte por mi mundo sin pedir permiso.\n\nPorque ahora los lugares bonitos me parecen incompletos. Las historias buenas me dan ganas de contártelas. Y los días felices me duran un poco menos si no puedo compartirlos contigo.\n\nDurante mucho tiempo pensé que amar era encontrar a alguien. Ahora sospecho que es otra cosa: es cuando una persona deja de ocupar un lugar en tu vida y empieza a ocupar un lugar en tu forma de mirarla.`,
  },
  {
    label: 'Carta 1',
    title: 'Jesenia',
    text: `A veces me pregunto cuándo pasó. Porque no fue un día concreto. No hubo música de fondo, ni una escena perfecta, ni una fecha que pueda señalar en un calendario.\n\nSimplemente un día me descubrí guardando cosas para ti. Una canción. Una frase. Una imagen. Una historia. Y luego otra. Y luego otra más. Como si me hubiera convertido en una especie de coleccionista de pequeñas cosas que me recuerdan a ti.\n\nY creo que ahí empezó el problema. Porque mientras más cosas guardaba, más me daba cuenta de que ya estabas ocupando demasiados espacios dentro de mi cabeza. Sin anuncio. Sin drama. Solo ahí.`,
  },
  {
    label: 'Carta 2',
    title: 'Jesenia',
    text: `Siento que quererte se parece a entrar contigo a un bazar inmenso. Uno de esos donde hay demasiadas cosas para mirar y cada estante te llama por un motivo distinto. Mientras yo veo algo pienso “esto seguro le gustaría”, y seguramente tú estás pensando exactamente lo mismo de otra cosa completamente distinta. Y al final resulta que estábamos mirando el mismo lugar todo el tiempo.\n\nSupongo que por eso me gusta tanto hablar contigo. Porque contigo nunca siento que tenga que explicarme completo. Como cuando dos personas están viendo la misma película y ninguna necesita contarle a la otra qué está pasando. Simplemente lo entienden.\n\nY no sé. Creo que eso es algo que cada vez encuentro menos en el mundo. Contigo, por suerte, todavía pasa.`,
  },
]

export default function Page() {
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [openNote, setOpenNote] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  function playSound(kind: 'open' | 'pop') {
    if (!soundEnabled || typeof window === 'undefined') return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime
    const isPop = kind === 'pop'

    oscillator.type = isPop ? 'sine' : 'triangle'
    oscillator.frequency.setValueAtTime(isPop ? 520 : 330, now)
    oscillator.frequency.exponentialRampToValueAtTime(isPop ? 920 : 660, now + (isPop ? 0.14 : 0.45))
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(isPop ? 0.12 : 0.08, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isPop ? 0.2 : 0.7))
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + (isPop ? 0.2 : 0.7))
    oscillator.addEventListener('ended', () => void context.close())
  }

  function openLoveNote(index: number) {
    setOpenNote((current) => (current === index ? null : index))
    playSound('pop')
  }

  return (
    <main className="love-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <button
        className={`sound-toggle ${soundEnabled ? 'is-on' : ''}`}
        type="button"
        onClick={() => {
          setSoundEnabled((current) => !current)
          if (!soundEnabled) window.setTimeout(() => playSound('open'), 0)
        }}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
      >
        <span aria-hidden="true">{soundEnabled ? '♫' : '♪'}</span>
        {soundEnabled ? 'Sonido activado' : 'Activar sonido'}
      </button>
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <span className="topbar-mark" aria-hidden="true">♥</span>
        <span>Para ti, siempre</span>
        <span className="topbar-date">19 · 09 · 2026</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Una pequeña carta digital</p>
        <h1 id="page-title">
          Mi lugar favorito<br />
          <em>es contigo.</em>
        </h1>
        <p className="intro">
          Jessenia, hice este rincón para dejarte tres cosas que a veces se me quedan a medias cuando te hablo: un poema, una carta, y la costumbre rara de guardarte pedazos del mundo.
        </p>

        {!isLetterOpen ? (
          <div className="letter-intro">
            <p className="bubble-instruction">Hay algo especial para ti</p>
            <button
              className="envelope"
              type="button"
              onClick={() => setIsLetterOpen(true)}
              aria-label="Abrir carta de amor"
            >
              <span className="envelope-flap" aria-hidden="true" />
              <span className="envelope-heart" aria-hidden="true">♥</span>
              <span className="envelope-label">Abrir mi carta</span>
            </button>
          </div>
        ) : (
          <div className="letter-content">
            <p className="bubble-instruction">La carta está abierta. Toca una burbuja y deja que el mensaje aparezca</p>
            <div className="love-bubbles" aria-label="Mensajes de amor">
              {loveNotes.map((note, index) => {
                const isOpen = openNote === index
                return (
                  <div className={`love-bubble-item ${isOpen ? 'is-open' : ''}`} key={note.label}>
                    <button
                      className="love-bubble"
                      type="button"
                      onClick={() => openLoveNote(index)}
                      aria-expanded={isOpen}
                      aria-controls={`love-note-${index}`}
                    >
                      <span className="bubble-shine" aria-hidden="true" />
                      <span className="bubble-heart" aria-hidden="true">♥</span>
                      <span className="bubble-label">{note.label}</span>
                    </button>
                    <div id={`love-note-${index}`} className="love-note" aria-live="polite">
                      <span className="note-spark" aria-hidden="true">✦</span>
                      <h2>{note.title}</h2>
                      <p>{note.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <footer className="footer-note">
        Hecho para ti. Sin escena perfecta. Solo porque un día empecé a guardarte cosas.
      </footer>
    </main>
  )
}
