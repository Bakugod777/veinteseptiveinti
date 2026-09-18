'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'

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
    title: 'Jessenia',
    text: `A veces me pregunto cuándo pasó. Porque no fue un día concreto. No hubo música de fondo, ni una escena perfecta, ni una fecha que pueda señalar en un calendario.\n\nSimplemente un día me descubrí guardando cosas para ti. Una frase. Una música. Y luego otra. Y luego otra más. Como si me hubiera convertido en una especie de coleccionista de pequeñas cosas que me recuerdan a ti.\n\nY creo que ahí empezó el problema. Porque mientras más cosas guardaba, más me daba cuenta de que ya estabas ocupando demasiados espacios dentro de mi cabeza. Sin anuncio. Sin drama. Solo ahí.`,
  },
  {
    label: 'Carta 2',
    title: 'Jessenia',
    text: `Siento que quererte se parece a entrar contigo a un bazar inmenso. Uno de esos donde hay demasiadas cosas para mirar y cada estante te llama por un motivo distinto. Mientras yo veo algo pienso “esto seguro le gustaría”, y seguramente tú estás pensando exactamente lo mismo de otra cosa completamente distinta. Y al final resulta que estábamos mirando el mismo lugar todo el tiempo.\n\nSupongo que por eso me gusta tanto hablar contigo. Porque contigo nunca siento que tenga que explicarme completo. Como cuando dos personas están viendo la misma película y ninguna necesita contarle a la otra qué está pasando. Simplemente lo entienden.\n\nY no sé. Creo que eso es algo que cada vez encuentro menos en el mundo. Contigo, por suerte, todavía pasa.`,
  },
]

const keepsakes = [
  {
    id: 'phrase',
    mark: '“',
    label: 'Una frase',
    whisper:
      'Si el mundo se apagara un segundo, igual te encontraría: eres la única luz que aprendí a reconocer con los ojos cerrados.',
  },
  {
    id: 'music',
    mark: '♫',
    label: 'Una música',
    whisper: 'Abrí esta playlist para ti. Elige una y déjala sonar.',
  },
]

const playlist = [
  {
    id: 'die-for-you',
    artist: 'The Weeknd',
    title: 'Die For You',
    spotifyId: '2LBqCSwhJGcFQeTHMVGwy3',
  },
  {
    id: 'love',
    artist: 'Kendrick Lamar',
    title: 'LOVE.',
    spotifyId: '6PGoSes0D9eUDeeAafB2As',
  },
  {
    id: 'going-home',
    artist: 'Drake',
    title: "Hold On, We're Going Home",
    spotifyId: '14Rcq31SafFBHNEwXrtR2B',
  },
  {
    id: 'passionfruit',
    artist: 'Drake',
    title: 'Passionfruit',
    spotifyId: '38GZE9mex4GGFYULCo5Fi7',
  },
]

const secretNote = {
  title: 'Lo que no cabe en una burbuja',
  text: `Si llegaste hasta aquí es porque abriste todo. Entonces te dejo esto sin metáfora:\n\nMe gusta cómo ocupas mi cabeza. Me gusta que el mundo se vuelva más interesante cuando pienso en contártelo. Y me gusta que contigo no tenga que ensayar tanto para ser yo.\n\nEso. Sin escena perfecta. Solo eso.`,
}

export default function Page() {
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [openNote, setOpenNote] = useState<number | null>(null)
  const [openedNotes, setOpenedNotes] = useState<number[]>([])
  const [activeKeepsake, setActiveKeepsake] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [activeTrackId, setActiveTrackId] = useState(playlist[0].id)
  const [pointer, setPointer] = useState({ x: 50, y: 40 })
  const [showSecret, setShowSecret] = useState(false)

  const allNotesOpened = openedNotes.length === loveNotes.length
  const activeTrack = playlist.find((track) => track.id === activeTrackId) ?? playlist[0]

  const constellation = useMemo(
    () =>
      keepsakes.map((item, index) => {
        const spots = [
          { x: '32%', y: '38%' },
          { x: '68%', y: '42%' },
        ]
        const spot = spots[index] ?? spots[0]
        return {
          ...item,
          style: {
            '--x': spot.x,
            '--y': spot.y,
            '--delay': `${index * 0.35}s`,
            '--drift': `${10 + index * 4}s`,
          } as CSSProperties,
        }
      }),
    [],
  )

  useEffect(() => {
    if (!allNotesOpened) return
    const timer = window.setTimeout(() => setShowSecret(true), 700)
    return () => window.clearTimeout(timer)
  }, [allNotesOpened])

  function playSound(kind: 'open' | 'pop' | 'soft') {
    if (!soundEnabled || typeof window === 'undefined') return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime

    if (kind === 'soft') {
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(420, now)
      oscillator.frequency.exponentialRampToValueAtTime(680, now + 0.28)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.35)
    } else {
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
    }

    oscillator.addEventListener('ended', () => void context.close())
  }

  function openEnvelope() {
    if (isOpening || isLetterOpen) return
    setIsOpening(true)
    playSound('open')
    window.setTimeout(() => {
      setIsLetterOpen(true)
      setIsOpening(false)
    }, 520)
  }

  function openLoveNote(index: number) {
    setOpenNote((current) => (current === index ? null : index))
    setOpenedNotes((current) => (current.includes(index) ? current : [...current, index]))
    setActiveKeepsake(null)
    playSound('pop')
  }

  function toggleKeepsake(id: string) {
    const next = activeKeepsake === id ? null : id
    setActiveKeepsake(next)
    setOpenNote(null)

    if (id === 'music') {
      setShowPlaylist(next === 'music')
      playSound('soft')
      return
    }

    setShowPlaylist(false)
    playSound('soft')
  }

  return (
    <main
      className="love-page"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setPointer({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        })
      }}
      style={
        {
          '--mx': `${pointer.x}%`,
          '--my': `${pointer.y}%`,
        } as CSSProperties
      }
    >
      <div className="paper-grain" aria-hidden="true" />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="floating-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

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

      <header className="topbar">
        <span className="topbar-mark" aria-hidden="true">
          ♥
        </span>
        <span>Para ti, siempre</span>
        <span className="topbar-date">19 · 09 · 2026</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Una pequeña carta digital</p>
        <h1 id="page-title">
          Mi lugar favorito
          <br />
          <em>es contigo.</em>
        </h1>
        <p className="intro">
          Jessenia, hice este rincón para dejarte tres cosas que a veces se me quedan a medias cuando te
          hablo: un poema, una carta, y la costumbre rara de guardarte pedazos del mundo.
        </p>

        {!isLetterOpen ? (
          <div className="letter-intro">
            <p className="bubble-instruction">Hay algo especial para ti</p>
            <button
              className={`envelope ${isOpening ? 'is-open' : ''}`}
              type="button"
              onClick={openEnvelope}
              aria-label="Abrir carta de amor"
            >
              <span className="envelope-flap" aria-hidden="true" />
              <span className="envelope-heart" aria-hidden="true">
                ♥
              </span>
              <span className="envelope-label">{isOpening ? 'Abriendo…' : 'Abrir mi carta'}</span>
            </button>
          </div>
        ) : (
          <div className="letter-content">
            <div className="progress-rail" aria-live="polite">
              <span>
                Cosas abiertas · {openedNotes.length}/{loveNotes.length}
              </span>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(openedNotes.length / loveNotes.length) * 100}%` }}
                />
              </div>
            </div>

            <p className="bubble-instruction">
              Toca una burbuja. Si quieres, también las cositas que fui guardando alrededor.
            </p>

            <div className="keepsake-sky" aria-label="Cositas guardadas">
              {constellation.map((item) => {
                const isActive = activeKeepsake === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`keepsake ${isActive ? 'is-active' : ''} ${item.id === 'music' && showPlaylist ? 'is-playing' : ''}`}
                    style={item.style}
                    onClick={() => toggleKeepsake(item.id)}
                    aria-expanded={isActive}
                    aria-pressed={item.id === 'music' ? showPlaylist : undefined}
                  >
                    <span className="keepsake-mark" aria-hidden="true">
                      {item.mark}
                    </span>
                    <span className="keepsake-label">{item.label}</span>
                    {isActive && item.id !== 'music' ? (
                      <span className="keepsake-whisper">{item.whisper}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>

            {showPlaylist ? (
              <aside className="playlist-panel" aria-label="Playlist guardada para ti">
                <p className="playlist-kicker">Canciones que te guardé</p>
                <div className="playlist-tracks">
                  {playlist.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      className={`playlist-track ${activeTrackId === track.id ? 'is-active' : ''}`}
                      onClick={() => setActiveTrackId(track.id)}
                    >
                      <span className="playlist-track-artist">{track.artist}</span>
                      <span className="playlist-track-title">{track.title}</span>
                    </button>
                  ))}
                </div>
                <iframe
                  key={activeTrack.spotifyId}
                  className="spotify-embed"
                  title={`${activeTrack.title} — ${activeTrack.artist}`}
                  src={`https://open.spotify.com/embed/track/${activeTrack.spotifyId}?utm_source=generator&theme=0`}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
                <p className="playlist-note">Reproduce desde Spotify. Si te pide login, es normal.</p>
              </aside>
            ) : null}

            <div className="love-bubbles" aria-label="Mensajes de amor">
              {loveNotes.map((note, index) => {
                const isOpen = openNote === index
                const wasOpened = openedNotes.includes(index)
                return (
                  <div
                    className={`love-bubble-item ${isOpen ? 'is-open' : ''} ${wasOpened ? 'was-opened' : ''}`}
                    key={note.label}
                  >
                    <button
                      className="love-bubble"
                      type="button"
                      onClick={() => openLoveNote(index)}
                      aria-expanded={isOpen}
                      aria-controls={`love-note-${index}`}
                    >
                      <span className="bubble-shine" aria-hidden="true" />
                      <span className="bubble-heart" aria-hidden="true">
                        ♥
                      </span>
                      <span className="bubble-label">{note.label}</span>
                    </button>
                    <div id={`love-note-${index}`} className="love-note" aria-live="polite">
                      <span className="note-spark" aria-hidden="true">
                        ✦
                      </span>
                      <h2>{note.title}</h2>
                      <p>{note.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {showSecret && allNotesOpened ? (
              <aside className="secret-note" aria-live="polite">
                <p className="secret-kicker">Desbloqueado</p>
                <h2>{secretNote.title}</h2>
                <p>{secretNote.text}</p>
              </aside>
            ) : null}
          </div>
        )}
      </section>

      <footer className="footer-note">
        Hecho para ti. Sin escena perfecta. Solo porque un día empecé a guardarte cosas.
      </footer>
    </main>
  )
}
