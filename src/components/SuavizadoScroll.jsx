import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll suavizado.
 *
 * El navegador desplaza a saltos, uno por muesca de rueda. Lenis interpola
 * entre esos saltos, así que la página llega a su sitio con inercia en vez de
 * de golpe. Es la mitad de la sensación de una portada de este tipo: sin esto,
 * la secuencia de apertura avanza a tirones aunque los fotogramas sean buenos.
 *
 * Va atado al reloj de GSAP, no a su propio `requestAnimationFrame`: si cada
 * uno corriera por su lado, el scrub de ScrollTrigger iría un fotograma por
 * detrás de la posición real y se notaría como retraso.
 *
 * Con `prefers-reduced-motion` no se instala: quien lo pide quiere el scroll
 * del sistema, sin interpolación ni inercia.
 */
export default function SuavizadoScroll() {
  useEffect(() => {
    const prefiereQuieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefiereQuieto) return

    const lenis = new Lenis({
      // Un poco más largo que el valor por defecto: la inercia debe leerse
      // como peso, no como pereza.
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // El táctil ya trae su propia inercia; duplicarla marea.
      smoothWheel: true,
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const alTicker = (tiempo) => lenis.raf(tiempo * 1000)
    gsap.ticker.add(alTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(alTicker)
      lenis.destroy()
    }
  }, [])

  return null
}
