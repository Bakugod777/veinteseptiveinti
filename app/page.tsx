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
    title: 'Inventario de una casualidad',
    text: `Me preguntan qué es el amor y siempre me parece injusta la pregunta. Porque cómo se supone que uno explique algo que se fue construyendo en silencio. Algo que empezó siendo una conversación cualquiera y terminó apareciendo en todos lados.\n\nPorque ahora te encuentro en las canciones, incluso en las malas, sobre todo en las malas. En esas canciones absurdamente cursis que parecen escritas por alguien que jamás conoció el mundo real y aun así pienso: “Ojalá ella pudiera vivir en un lugar así”.\n\nTe encuentro en los atardeceres, en las películas, en las frases que leo y guardo durante horas porque quisiera enviártelas. Te encuentro en los días buenos porque quiero compartirlos contigo y en los días malos porque alguna parte de mí aprendió a buscar refugio en tu recuerdo.\n\nY entonces entendí algo: amar no era pensar en una persona todo el tiempo. Amar era descubrir que una persona terminó cambiando la forma en que miras todo lo demás. Como si hubieras llegado a mi vida y después hubieras empezado a aparecer en cada rincón de ella.\n\nY si algún día me preguntan qué es el arte, qué es la poesía, qué es el amor, no creo que responda con una definición. Creo que simplemente empezaría a hablar de ti.`,
  },
  {
    label: 'Carta 1',
    title: 'Jesenia',
    text: `Hay algo que me parece curioso. Cuando uno es niño cree que ser detallista consiste en regalar muchas cosas. Luego crece y descubre que los mejores detalles casi nunca cuestan dinero.\n\nSon las canciones que uno guarda porque recuerdan a alguien, los mensajes que escribe y borra tres veces porque quiere encontrar las palabras correctas, las fotos que ve más de una vez sin razón aparente y los pequeños esfuerzos que nadie ve.\n\nPorque empecé a querer regalarte cosas. No cosas grandes, sino cosas que me hacían pensar en ti: una canción, una frase, una historia, un detalle tonto. Como si quisiera acercarte todas las cosas bonitas que encuentro por el camino.\n\nCuando uno quiere a alguien no busca impresionarlo. Busca hacerle la vida un poco más amable, un poco más ligera, un poco más bonita. Y me gusta que contigo no siento que tenga que defender cada opinión como si estuviera en una batalla. Me importa entenderte.\n\nContigo no siento vergüenza de ser quien soy. Supongo que eres uno de esos lugares raros donde una persona puede descansar de sí misma. Y eso vale más de lo que las palabras alcanzan a explicar.`,
  },
  {
    label: 'Carta 2',
    title: 'Jesenia',
    text: `A veces siento que quererte es parecido a entrar en uno de esos bazares enormes donde hay demasiadas cosas para mirar. Uno entra pensando que sabe qué busca y termina perdiéndose entre cosas que ni siquiera sabía que necesitaba.\n\nPorque contigo pasa algo parecido: siempre descubro algo nuevo, una idea, una historia, una forma distinta de ver el mundo. Y cuando creo que ya terminé de admirar una cosa aparece otra.\n\nMuchas personas creen que el amor aparece cuando encuentras a alguien perfecto. Yo cada vez creo menos en eso. Creo que el amor se parece más a una receta imposible, donde cada ingrediente parece innecesario y luego descubres que justamente eso era lo que le daba sabor a todo.\n\nTus ocurrencias, tus silencios, tus dudas, tus convicciones, tus días buenos y tus días malos: todo eso forma parte de ti y hace que seas tú.\n\nNo entendí lo que sentía cuando escribí algo bonito, sino cuando me di cuenta de que las cosas que más disfrutaba seguían estando incompletas si no podía compartirlas contigo. Sigues apareciendo en todas partes y la verdad, no quisiera que dejara de ser así.`,
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
          Jesenia, hice este pequeño rincón para guardar tres cosas que a veces no sé decirte en voz alta: lo que admiro de ti, lo que me haces sentir y todo lo que todavía quiero vivir contigo.
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
        Hecho con cariño, para la persona que hace mis días más bonitos.
      </footer>
    </main>
  )
}
