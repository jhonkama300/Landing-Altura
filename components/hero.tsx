"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Array de imágenes para el carrusel
  const images = [
    "/logoaltura.png",
    "/entrenamiento-de-seguridad-industrial-en-altura-co.jpg",
    "/centro-de-capacitaci-n-para-trabajo-en-altura-con-.jpg",
    "/instructores-ense-ando-t-cnicas-de-seguridad-en-al.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Imagen anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Siguiente imagen"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 z-20 text-center">
        <div className="flex flex-col items-center">
          {/* Título principal */}
          <h1 className="font-bold text-white drop-shadow-lg mb-4 text-4xl md:text-6xl">TRABAJO SEGURO EN ALTURA</h1>

          {/* Subtítulo */}
          <div className="bg-blue-600 text-white px-6 py-2 rounded-md mb-4 shadow-lg transform transition-transform hover:scale-105">
            CENTRO DE ENTRENAMIENTO
          </div>

          {/* Nombre de la empresa */}
          <h2 className="font-semibold text-white drop-shadow-lg mb-4 text-2xl md:text-3xl">UPARSISTEM</h2>

          {/* Descripción */}
          <p className="text-white max-w-3xl mx-auto mb-8 drop-shadow-md text-xl">
            Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
              onClick={() => scrollToSection("services")}
            >
              Nuestros Servicios
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20 shadow-lg transform transition-transform hover:scale-105 bg-transparent"
              onClick={() => scrollToSection("contact")}
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>

      {/* Botón de scroll hacia abajo */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-20"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
