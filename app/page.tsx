"use client"

import { useEffect } from "react" // Importar useEffect
import { usePathname } from "next/navigation" // Importar usePathname
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Gallery } from "@/components/gallery"
import { Certifications } from "@/components/certifications"
import { Contact } from "@/components/contact"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { QuickAccess } from "@/components/quick-access"
import { AboutUs } from "@/components/about-us" // Asegúrate de que AboutUs esté importado si es el componente que contiene Misión/Visión

export default function Home() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      const hash = window.location.hash
      if (hash) {
        const id = hash.substring(1) // Eliminar el '#'
        const element = document.getElementById(id)
        if (element) {
          // Pequeño retraso para asegurar que el layout se ha renderizado
          setTimeout(() => {
            // Ajustar este offset si tienes una barra de navegación fija
            const headerOffset = 100 // O 140 si la notificación está siempre visible
            const elementPosition = element.offsetTop - headerOffset
            window.scrollTo({ top: elementPosition, behavior: "smooth" })
          }, 100) // Retraso de 100ms
        }
      }
    }
  }, [pathname]) // Ejecutar cuando la ruta (incluido el hash) cambie

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <Hero id="2" />
        <AboutUs id="about" /> 
        <QuickAccess />
        <Services id="services" />
        <Gallery id="gallery" />
        <Certifications id="certifications" />
        <Contact id="contact" />
      </main>
      <Footer />
    </div>
  )
}
