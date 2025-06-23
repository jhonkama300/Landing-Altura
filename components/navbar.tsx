"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Menu, X, Home, Users, Briefcase, ImageIcon, Award, Phone, Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useRouter, usePathname } from "next/navigation"

interface NavButton {
  text: string
  url: string
  variant: "primary" | "secondary" | "accent" | "outline" | "ghost"
}

interface NavContent {
  logo?: string
  logoText?: string
  showLogoImage?: boolean
  logoSize?: {
    width: number
    height: number
  }
  buttons?: NavButton[]
}

interface NavbarProps {
  className?: string
  content?: NavContent
}

const defaultNavContent: NavContent = {
  logo: "/logoaltura.png",
  showLogoImage: true,
  logoSize: {
    width: 200,
    height: 120,
  },
  buttons: [
    {
      text: "Preinscríbete",
      url: "https://site2.q10.com/Preinscripcion?aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
      variant: "secondary",
    },
    {
      text: "Pagos",
      url: "https://site2.q10.com/login?ReturnUrl=%2F&aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
      variant: "primary",
    },
    {
      text: "PQRSF",
      url: "https://site2.q10.com/SolicitudesInstitucionales/NuevaSolicitud?aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
      variant: "accent",
    },
  ],
}

const navigationItems = [
  { label: "Inicio", section: null, icon: Home },
  { label: "Quiénes Somos", section: "about", icon: Users },
  { label: "Servicios", section: "services", icon: Briefcase },
  { label: "Galería", section: "gallery", icon: ImageIcon },
  { label: "Certificaciones", section: "certifications", icon: Award },
  { label: "Contacto", section: "contact", icon: Phone },
]

export function Navbar({ className, content }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [navContent, setNavContent] = useState<NavContent>(content || defaultNavContent)
  const [showNotification, setShowNotification] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = (scrollTop / docHeight) * 100

    setScrolled(scrollTop > 20)
    setScrollProgress(Math.min(progress, 100))

    const sections = navigationItems.filter((item) => item.section)
    let currentSection = null

    for (const item of sections) {
      const element = document.getElementById(item.section!)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = item.section
          break
        }
      }
    }

    setActiveSection(currentSection)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Close mobile menu on escape key or outside click
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden" // Asegura que el scroll del body se deshabilite
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const scrollToSection = useCallback(
    (sectionId: string | null) => {
      setIsOpen(false) // Cerrar el menú móvil

      if (pathname !== "/") {
        // Si no estamos en la página de inicio, navegamos a la página de inicio con el hash
        const targetPath = sectionId ? `/#${sectionId}` : "/"
        router.push(targetPath)
        return
      }

      // Si ya estamos en la página de inicio, nos desplazamos directamente
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }

      const element = document.getElementById(sectionId)
      if (element) {
        const headerOffset = showNotification ? 140 : 100
        const elementPosition = element.offsetTop - headerOffset
        window.scrollTo({ top: elementPosition, behavior: "smooth" })
      }
    },
    [pathname, router, showNotification], // Añadir pathname y router como dependencias
  )

  const handleExternalLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  // Handle notification click to go to contact
  const handleNotificationClick = useCallback(() => {
    scrollToSection("contact")
  }, [scrollToSection])

  // Enhanced styles with gradients and effects
  const headerStyles = useMemo(
    () =>
      cn(
        "fixed  w-full z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100/50"
          : "bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-sm",
        className,
      ),
    [scrolled, className],
  )

  const logoStyles = useMemo(
    () =>
      cn(
        "text-2xl font-bold transition-all duration-500 hover:scale-105 cursor-pointer relative",
        "bg-gradient-to-r bg-clip-text text-transparent",
        scrolled ? "from-primary via-accent to-primary" : "from-white via-gray-100 to-white",
      ),
    [scrolled],
  )

  const navLinkStyles = useCallback(
    (section: string | null) =>
      cn(
        "text-sm font-semibold transition-all duration-300 relative group py-2 px-3 rounded-lg flex items-center gap-2",
        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2",
        "hover:bg-white/10 hover:backdrop-blur-sm",
        scrolled ? "text-gray-700 hover:text-accent hover:bg-accent/5" : "text-white/90 hover:text-white",
        activeSection === section && "text-accent bg-accent/10",
      ),
    [scrolled, activeSection],
  )

  const buttons = Array.isArray(navContent.buttons) ? navContent.buttons : []

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent via-primary to-accent z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Notification Bar with auto-dismiss */}
      {showNotification && (
        <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-accent to-primary text-white text-center py-2 text-sm z-[55] transform transition-all duration-300">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2 relative">
            <Bell size={16} className="animate-pulse" />
            <button
              onClick={handleNotificationClick}
              className="hover:underline cursor-pointer transition-all duration-200 hover:text-yellow-200"
            >
              ¡Inscripciones Abiertas! Inscríbete ahora y contáctanos ya 3202509270
            </button>
            <button
              onClick={() => setShowNotification(false)}
              className="absolute right-4 p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <header className={cn(headerStyles, showNotification && "top-10")} data-navbar>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex  justify- h-16 lg:h-28 ">
            {/* Logo - Left Side */}
            <div
              className="flex items-center cursor-pointer  flex-shrink-2"
              onClick={() => scrollToSection(null)}
              onKeyDown={(e) => e.key === "Enter" && scrollToSection(null)}
              tabIndex={0}
              role="button"
              aria-label="Ir al inicio"
            >
              {navContent.showLogoImage && navContent.logo ? (
                <div className="relative overflow-hidden rounded-xl group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={navContent.logo || "/placeholder.svg"}
                    alt="UPARSISTEM"
                    className="w-auto object-contain transition-transform duration-500 group-hover:scale-110 h-16 lg:h-28"
                    style={{
                      maxWidth: `${navContent.logoSize?.width || 150}px`,
                    }}
                  />
                </div>
              ) : (
                <div className="relative flex items-center gap-3">
                  {/* Animated Logo Icon */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Globe size={20} className="text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                  </div>

                  <div className="relative">
                    <span className={logoStyles}>
                      UPAR<span className="text-accent font-black">SISTEM</span>
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links - Center */}
            <nav className="hidden lg:flex items-center space-x-4 flex-1  justify-center" role="navigation">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.section)}
                    className={navLinkStyles(item.section)}
                    aria-label={`Ir a ${item.label}`}
                  >
                    <IconComponent size={16} className="transition-transform duration-300 group-hover:scale-110" />
                    {item.label}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    {activeSection === item.section && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* CTA Buttons - Right Side */}
            <div className="hidden xl:flex items-center space-x-3 flex-shrink-0 ">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => handleExternalLink(button.url)}
                  variant={button.variant === "primary" ? "default" : button.variant} // Usar el variant directamente
                  size="sm"
                  className={cn(
                    "transition-all duration-300 hover:scale-105 focus:scale-105 relative overflow-hidden group",
                    // Clases específicas para el hover y sombra, el color base lo maneja el variant
                    button.variant === "primary" ? "shadow-lg hover:shadow-xl border-0" : "shadow-md hover:shadow-lg",
                  )}
                  aria-label={button.text}
                >
                  {index === 0 && <Users size={16} className="mr-1" />}
                  {index === 1 && <Globe size={16} className="mr-1" />}
                  {index === 2 && <Phone size={16} className="mr-1" />}
                  <span className="relative z-10 text-xs lg:text-sm">{button.text}</span>
                  {button.variant === "primary" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "md:hidden p-3 rounded-xl transition-all duration-300 hover:scale-110 relative flex-shrink-0",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                    scrolled
                      ? "text-primary hover:bg-accent/10 shadow-md"
                      : "text-white hover:bg-white/10 backdrop-blur-sm",
                  )}
                  aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                  aria-expanded={isOpen}
                >
                  <div className="relative w-6 h-6">
                    <Menu
                      size={24}
                      className={cn(
                        "absolute inset-0 transition-all duration-300",
                        isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100",
                      )}
                    />
                    <X
                      size={24}
                      className={cn(
                        "absolute inset-0 transition-all duration-300",
                        isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75",
                      )}
                    />
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white p-0 flex flex-col">
                <SheetHeader className="p-4 border-b border-gray-100">
                  <SheetTitle className="text-2xl font-bold text-primary">
                    {navContent.showLogoImage && navContent.logo ? (
                      <img
                        src={navContent.logo || "/placeholder.svg"}
                        alt="UPARSISTEM"
                        className="w-auto object-contain h-16"
                        style={{
                          maxWidth: `${navContent.logoSize?.width || 150}px`,
                        }}
                      />
                    ) : (
                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                          <Globe size={20} className="text-white" />
                        </div>
                        <span className="text-primary">
                          UPAR<span className="text-accent font-black">SISTEM</span>
                        </span>
                      </div>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto p-4" role="navigation">
                  <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={item.label}
                          onClick={() => scrollToSection(item.section)}
                          className={cn(
                            "text-left py-4 px-4 text-lg font-semibold rounded-xl transition-all duration-300 relative group flex items-center gap-3",
                            "hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10",
                            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                            activeSection === item.section
                              ? "text-accent bg-accent/10"
                              : "text-gray-700 hover:text-accent",
                          )}
                          aria-label={`Ir a ${item.label}`}
                        >
                          <IconComponent
                            size={20}
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className="relative z-10">{item.label}</span>
                          {activeSection === item.section && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                          )}
                          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-accent to-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r" />
                        </button>
                      )
                    })}

                    {/* Enhanced Mobile CTA Buttons */}
                    <div className="pt-6 space-y-4">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      {buttons.map((button, index) => (
                        <Button
                          key={index}
                          onClick={() => handleExternalLink(button.url)}
                          variant={button.variant === "primary" ? "default" : button.variant} // Usar el variant directamente
                          className={cn(
                            "w-full justify-center transition-all duration-300 text-base py-6 relative overflow-hidden group",
                            // Clases específicas para el hover y sombra, el color base lo maneja el variant
                            button.variant === "primary" ? "shadow-lg" : "shadow-md",
                          )}
                          aria-label={button.text}
                        >
                          {index === 0 && <Users size={18} className="mr-2" />}
                          {index === 1 && <Globe size={18} className="mr-2" />}
                          {index === 2 && <Phone size={18} className="mr-2" />}
                          <span className="relative z-10">{button.text}</span>
                          {button.variant === "primary" && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
