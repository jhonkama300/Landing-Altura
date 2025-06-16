"use client"

import { type ReactNode, useEffect, useState } from "react"
import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Registramos el plugin ScrollTrigger de GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Creamos la instancia de Lenis con una configuración optimizada
    const lenisInstance = new Lenis({
      duration: 0.8, // Duración moderada para scroll suave pero no demasiado lento
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Función de easing suave
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1, // Multiplicador normal para el scroll con rueda
      smoothTouch: false, // Desactivamos el suavizado en dispositivos táctiles
      touchMultiplier: 2,
      infinite: false,
    })

    // Integramos Lenis con GSAP ScrollTrigger
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000)
    })

    // Actualizamos ScrollTrigger cuando Lenis se actualiza
    lenisInstance.on("scroll", ScrollTrigger.update)

    setLenis(lenisInstance)

    return () => {
      gsap.ticker.remove(lenisInstance.raf)
      lenisInstance.destroy()
    }
  }, [])

  return <>{children}</>
}
