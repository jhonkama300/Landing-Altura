"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Zap, Smartphone, Layers, Code, Feather, Cpu, Shield, Globe, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { useGsapScrollTrigger } from "@/hooks/use-gsap"
import { getContentSection } from "@/lib/content"

// Mapa de iconos disponibles
const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-10 w-10" />,
  Smartphone: <Smartphone className="h-10 w-10" />,
  Layers: <Layers className="h-10 w-10" />,
  Code: <Code className="h-10 w-10" />,
  Feather: <Feather className="h-10 w-10" />,
  Cpu: <Cpu className="h-10 w-10" />,
  Shield: <Shield className="h-10 w-10" />,
  Globe: <Globe className="h-10 w-10" />,
  Heart: <Heart className="h-10 w-10" />,
  Star: <Star className="h-10 w-10" />,
}

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  // Obtener las características del almacenamiento
  const features =
    typeof window !== "undefined"
      ? getContentSection("features")
      : [
          {
            icon: "Zap",
            title: "Rendimiento Optimizado",
            description: "Animaciones fluidas con un rendimiento excepcional en todos los dispositivos.",
          },
          {
            icon: "Smartphone",
            title: "Responsive Design",
            description: "Experiencia perfecta en dispositivos móviles, tablets y escritorio.",
          },
          {
            icon: "Layers",
            title: "Efectos Parallax",
            description: "Crea efectos de parallax impresionantes con facilidad.",
          },
          {
            icon: "Code",
            title: "Fácil Integración",
            description: "Se integra perfectamente con React y otros frameworks modernos.",
          },
          {
            icon: "Feather",
            title: "Ligero",
            description: "Mínimo impacto en el rendimiento de tu sitio web.",
          },
          {
            icon: "Cpu",
            title: "Personalizable",
            description: "Configura cada aspecto para adaptarlo a tus necesidades.",
          },
        ]

  // Animación para el título y descripción
  useGsapScrollTrigger(titleRef)
  useGsapScrollTrigger(descriptionRef, { delay: 0.2 })

  useEffect(() => {
    // Animación para las tarjetas de características
    if (featureRefs.current.length > 0) {
      featureRefs.current.forEach((ref, index) => {
        if (!ref) return

        gsap.fromTo(
          ref,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: 0.1 * index, // Efecto escalonado
          },
        )
      })
    }

    return () => {
      // Limpieza
      gsap.killTweensOf(featureRefs.current)
    }
  }, [])

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-4 opacity-0">
            Características Principales
          </h2>
          <p ref={descriptionRef} className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto opacity-0">
            Descubre por qué Lenis y GSAP son la mejor combinación para crear experiencias web interactivas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className={cn(
                "bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm opacity-0",
                "hover:shadow-md hover:scale-105 transition-transform",
              )}
            >
              <div className="text-primary mb-4">{iconMap[feature.icon] || <Star className="h-10 w-10" />}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
