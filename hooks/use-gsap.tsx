"use client"

import type React from "react"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Aseguramos que ScrollTrigger esté registrado
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Hook para animaciones de entrada
export function useGsapFadeIn(element: React.RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    if (!element.current) return

    const el = element.current

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out",
      },
    )

    return () => {
      // Limpiamos la animación
      gsap.killTweensOf(el)
    }
  }, [element, delay])
}

// Hook para animaciones activadas por scroll
export function useGsapScrollTrigger(element: React.RefObject<HTMLElement>, options = {}) {
  useEffect(() => {
    if (!element.current) return

    const el = element.current

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...options,
      },
    })

    tl.fromTo(
      el,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    )

    return () => {
      // Limpiamos la animación y el ScrollTrigger
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [element, options])
}

// Hook para animaciones de parallax
export function useGsapParallax(element: React.RefObject<HTMLElement>, speed = 0.5) {
  useEffect(() => {
    if (!element.current) return

    const el = element.current

    gsap.to(el, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    return () => {
      // Limpiamos las animaciones
      const triggers = ScrollTrigger.getAll()
      triggers.forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill()
        }
      })
    }
  }, [element, speed])
}
