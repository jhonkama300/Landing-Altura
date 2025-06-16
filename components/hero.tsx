"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getContentSection } from "@/lib/content"

export function Hero() {
  // Estado para el contenido del hero
  const [heroContent, setHeroContent] = useState({})

  // Estados para carga y errores
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Efecto para cargar el contenido del hero
  useEffect(() => {
    // Función para cargar el contenido
    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (typeof window !== "undefined") {
          const content = await getContentSection("hero")
          console.log("Contenido cargado:", content)

          // Validar y normalizar el contenido
          const normalizedContent = {
            title: content?.title || "TRABAJO SEGURO EN ALTURA",
            subtitle: content?.subtitle || "CENTRO DE ENTRENAMIENTO",
            companyName: content?.companyName || content?.company_name || "UPARSISTEM",
            description:
              content?.description ||
              "Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad",
            backgroundImage: content?.backgroundImage || content?.background?.value || "/hero-background.jpg",
            layout: content?.layout || "centered",
            textAlignment: content?.textAlignment || content?.text_alignment || "center",
            verticalPosition: content?.verticalPosition || content?.vertical_position || "middle",
            height: content?.height || "full",
            customHeight: content?.customHeight || content?.custom_height,
            showScrollButton: content?.showScrollButton !== false && content?.show_scroll_button !== false,
            customClass: content?.customClass || content?.custom_class || "",

            // Normalizar background
            background: content?.background
              ? {
                  type: content.background.type || "image",
                  value: content.background.value || content.backgroundImage || "/hero-background.jpg",
                  overlay: content.background.overlay || false,
                  overlayOpacity: content.background.overlayOpacity || content.background.overlay_opacity || 50,
                }
              : {
                  type: "image",
                  value: content?.backgroundImage || "/hero-background.jpg",
                  overlay: true,
                  overlayOpacity: 50,
                },

            // Normalizar carousel
            carousel: content?.carousel
              ? {
                  enabled: content.carousel.enabled || false,
                  images: Array.isArray(content.carousel.images) ? content.carousel.images : [],
                  autoplay: content.carousel.autoplay !== false,
                  interval: content.carousel.interval || content.carousel.interval_seconds || 5,
                  showControls: content.carousel.showControls !== false && content.carousel.show_controls !== false,
                  showIndicators:
                    content.carousel.showIndicators !== false && content.carousel.show_indicators !== false,
                  effect: content.carousel.effect || "fade",
                }
              : {
                  enabled: false,
                  images: [],
                  autoplay: true,
                  interval: 5,
                  showControls: true,
                  showIndicators: true,
                  effect: "fade",
                },

            // Normalizar texts
            texts: Array.isArray(content?.texts) ? content.texts : [],

            // Normalizar buttons
            buttons: Array.isArray(content?.buttons)
              ? content.buttons
              : [
                  {
                    id: "btn-1",
                    text: "Nuestros Servicios",
                    url: "#services",
                    variant: "primary",
                  },
                  {
                    id: "btn-2",
                    text: "Contáctanos",
                    url: "#contact",
                    variant: "outline",
                  },
                ],
          }

          setHeroContent(normalizedContent)
        }
      } catch (error) {
        console.error("Error al cargar el contenido:", error)
        setError("Error al cargar el contenido del hero")
      } finally {
        setIsLoading(false)
      }
    }

    // Cargar contenido inicial
    loadContent()

    // Configurar event listeners
    const handleStorageChange = () => loadContent()
    const handleContentUpdate = () => loadContent()

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("contentUpdated", handleContentUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("contentUpdated", handleContentUpdate)
    }
  }, [])

  // Función para manejar el carrusel
  const goToSlide = useCallback(
    (index: number) => {
      if (heroContent.carousel?.images) {
        const totalSlides = heroContent.carousel.images.length
        if (index < 0) {
          setCurrentSlide(totalSlides - 1)
        } else if (index >= totalSlides) {
          setCurrentSlide(0)
        } else {
          setCurrentSlide(index)
        }
      }
    },
    [heroContent.carousel?.images],
  )

  const nextSlide = useCallback(() => {
    if (heroContent.carousel?.images) {
      goToSlide(currentSlide + 1)
    }
  }, [currentSlide, goToSlide, heroContent.carousel?.images])

  const prevSlide = useCallback(() => {
    if (heroContent.carousel?.images) {
      goToSlide(currentSlide - 1)
    }
  }, [currentSlide, goToSlide, heroContent.carousel?.images])

  // Configurar el intervalo para el carrusel automático
  useEffect(() => {
    // Limpiar cualquier intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Si el carrusel está habilitado y la reproducción automática está activada
    if (heroContent.carousel?.enabled && heroContent.carousel?.autoplay && heroContent.carousel?.images?.length > 1) {
      const interval = (heroContent.carousel.interval || 5) * 1000
      intervalRef.current = setInterval(nextSlide, interval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    heroContent.carousel?.enabled,
    heroContent.carousel?.autoplay,
    heroContent.carousel?.interval,
    heroContent.carousel?.images,
    nextSlide,
  ])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Determinar las clases de alineación según el layout
  const getLayoutClasses = () => {
    const layout = heroContent.layout || "centered"
    const textAlign = heroContent.textAlignment || "center"

    let containerClasses = "container mx-auto px-4 z-20 "
    let contentClasses = "flex flex-col "

    // Alineación horizontal
    switch (layout) {
      case "left":
        containerClasses += "text-left ml-0 mr-auto"
        contentClasses += "items-start "
        break
      case "right":
        containerClasses += "text-right ml-auto mr-0"
        contentClasses += "items-end "
        break
      case "split":
        containerClasses += `text-${textAlign} w-1/2`
        contentClasses +=
          textAlign === "center" ? "items-center " : textAlign === "left" ? "items-start " : "items-end "
        break
      default: // centered
        containerClasses += "text-center"
        contentClasses += "items-center "
    }

    // Alineación vertical
    const verticalPosition = heroContent.verticalPosition || "middle"
    switch (verticalPosition) {
      case "top":
        containerClasses += " pt-32 pb-0"
        break
      case "bottom":
        containerClasses += " pt-0 pb-32"
        break
      default: // middle
        containerClasses += ""
    }

    return { containerClasses, contentClasses }
  }

  const { containerClasses, contentClasses } = getLayoutClasses()

  // Renderizar un texto según su tipo
  const renderText = (text: any) => {
    const customStyle = text.customStyle || {}
    const animationClass = text.animation?.enabled
      ? `animate-${text.animation.type || "fadeIn"} delay-${text.animation.delay || 0}`
      : ""

    switch (text.type) {
      case "title":
        return (
          <h1
            key={text.id}
            className={`font-bold text-white drop-shadow-lg mb-4 ${text.customClass || "text-4xl md:text-6xl"} ${animationClass}`}
            style={{
              ...customStyle,
              opacity: 1,
              visibility: "visible",
              position: text.position || "relative",
              top: text.top || "auto",
              left: text.left || "auto",
              right: text.right || "auto",
              bottom: text.bottom || "auto",
            }}
          >
            {text.content}
          </h1>
        )
      case "subtitle":
        return (
          <div
            key={text.id}
            className={`bg-secondary text-white px-6 py-2 rounded-md mb-4 shadow-lg transform transition-transform hover:scale-105 ${text.customClass || ""} ${animationClass}`}
            style={{
              ...customStyle,
              opacity: 1,
              visibility: "visible",
              position: text.position || "relative",
              top: text.top || "auto",
              left: text.left || "auto",
              right: text.right || "auto",
              bottom: text.bottom || "auto",
            }}
          >
            {text.content}
          </div>
        )
      case "companyName":
        return (
          <h2
            key={text.id}
            className={`font-semibold text-white drop-shadow-lg mb-4 ${text.customClass || "text-2xl md:text-3xl"} ${animationClass}`}
            style={{
              ...customStyle,
              opacity: 1,
              visibility: "visible",
              position: text.position || "relative",
              top: text.top || "auto",
              left: text.left || "auto",
              right: text.right || "auto",
              bottom: text.bottom || "auto",
            }}
          >
            {text.content}
          </h2>
        )
      case "description":
        return (
          <p
            key={text.id}
            className={`text-white max-w-3xl mx-auto mb-8 drop-shadow-md ${text.customClass || "text-xl"} ${animationClass}`}
            style={{
              ...customStyle,
              opacity: 1,
              visibility: "visible",
              position: text.position || "relative",
              top: text.top || "auto",
              left: text.left || "auto",
              right: text.right || "auto",
              bottom: text.bottom || "auto",
            }}
          >
            {text.content}
          </p>
        )
      case "custom":
        return (
          <div
            key={text.id}
            className={`${text.customClass || "text-white text-xl"} ${animationClass}`}
            style={{
              ...customStyle,
              opacity: 1,
              visibility: "visible",
              position: text.position || "relative",
              top: text.top || "auto",
              left: text.left || "auto",
              right: text.right || "auto",
              bottom: text.bottom || "auto",
            }}
          >
            {text.content}
          </div>
        )
      default:
        return null
    }
  }

  // Determinar el fondo según el tipo
  const renderBackground = () => {
    const background = heroContent.background || {
      type: "image",
      value: heroContent.backgroundImage || "/hero-background.jpg",
    }

    if (background.type === "video" && background.value) {
      return (
        <>
          <video
            src={background.value}
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
          />
          {background.overlay && (
            <div
              className="absolute inset-0 bg-black z-0"
              style={{ opacity: (background.overlayOpacity || 50) / 100 }}
            ></div>
          )}
        </>
      )
    } else if (background.type === "gradient" && background.value) {
      return <div className="absolute inset-0 z-0" style={{ backgroundImage: background.value }}></div>
    } else if (background.type === "color" && background.value) {
      return <div className="absolute inset-0 z-0" style={{ backgroundColor: background.value }}></div>
    } else {
      // Default: image
      return (
        <>
          <Image
            src={background.value || heroContent.backgroundImage || "/hero-background.jpg"}
            alt="Fondo"
            fill
            className="object-cover object-center"
            priority
          />
          {background.overlay && (
            <div
              className="absolute inset-0 bg-black z-0"
              style={{ opacity: (background.overlayOpacity || 50) / 100 }}
            ></div>
          )}
        </>
      )
    }
  }

  // Renderizar el carrusel si está habilitado
  const renderCarousel = () => {
    const carousel = heroContent.carousel

    if (!carousel || !carousel.enabled || !carousel.images || carousel.images.length === 0) {
      return null
    }

    return (
      <div className="absolute inset-0 z-0">
        {carousel.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {image.type === "video" ? (
              <video src={image.url} className="w-full h-full object-cover" autoPlay muted loop />
            ) : (
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `Slide ${index + 1}`}
                fill
                className="object-cover object-center"
              />
            )}
            {image.overlay && (
              <div className="absolute inset-0 bg-black" style={{ opacity: (image.overlayOpacity || 50) / 100 }}></div>
            )}
          </div>
        ))}

        {carousel.showControls && carousel.images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 z-10">
            <button
              className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              onClick={prevSlide}
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              onClick={nextSlide}
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {carousel.showIndicators && carousel.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {carousel.images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section
      className={`relative h-screen flex items-center justify-center overflow-hidden ${heroContent.customClass || ""}`}
    >
      {/* Background */}
      {heroContent.carousel?.enabled ? renderCarousel() : renderBackground()}

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className={containerClasses}>
        <div className={contentClasses}>
          {/* Renderizar textos según su orden en el array */}
          {heroContent.texts && heroContent.texts.length > 0 ? (
            heroContent.texts.map((text) => renderText(text))
          ) : (
            // Fallback para compatibilidad con el formato antiguo
            <>
              {heroContent.title &&
                renderText({
                  id: "title-1",
                  type: "title",
                  content: heroContent.title,
                })}

              {heroContent.subtitle &&
                renderText({
                  id: "subtitle-1",
                  type: "subtitle",
                  content: heroContent.subtitle,
                })}

              {heroContent.companyName &&
                renderText({
                  id: "company-1",
                  type: "companyName",
                  content: heroContent.companyName,
                })}

              {heroContent.description &&
                renderText({
                  id: "desc-1",
                  type: "description",
                  content: heroContent.description,
                })}
            </>
          )}

          {/* Botones */}
          {heroContent.buttons && heroContent.buttons.length > 0 && (
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                heroContent.layout === "left"
                  ? "justify-start"
                  : heroContent.layout === "right"
                    ? "justify-end"
                    : "justify-center"
              }`}
              style={{ opacity: 1 }}
            >
              {heroContent.buttons.map((button) => {
                // Determinar la clase del botón según su variante
                let buttonClass = ""
                switch (button.variant) {
                  case "primary":
                    buttonClass = "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                    break
                  case "secondary":
                    buttonClass = "bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl"
                    break
                  case "accent":
                    buttonClass = "bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl"
                    break
                  case "outline":
                    buttonClass = "text-white border-white hover:bg-white/20 shadow-lg"
                    break
                  case "ghost":
                    buttonClass = "text-white hover:bg-white/10"
                    break
                  default:
                    buttonClass = "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                }

                return (
                  <Button
                    key={button.id}
                    size={button.size || "lg"}
                    className={`${buttonClass} ${button.customClass || ""} transform transition-transform hover:scale-105`}
                    variant={
                      button.variant === "outline" ? "outline" : button.variant === "ghost" ? "ghost" : "default"
                    }
                    onClick={() => {
                      if (button.url.startsWith("#")) {
                        scrollToSection(button.url.substring(1))
                      } else if (button.url) {
                        window.location.href = button.url
                      }
                    }}
                  >
                    {button.text}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Down Button */}
      {heroContent.showScrollButton !== false && (
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-20"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </button>
      )}
    </section>
  )
}
