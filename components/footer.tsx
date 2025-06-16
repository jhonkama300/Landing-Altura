"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
  Send,
  Pin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PrivacyPolicyContent } from "@/components/privacy-policy-content"
import { TermsOfServiceContent } from "@/components/terms-of-service-content"

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger)

// Componente específico para el icono de TikTok
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={className}
    >
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  )
}

// Mapa de iconos para las redes sociales (solo para referencia, no se usa directamente en el map)
const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  TikTok: <TikTokIcon className="h-5 w-5" />,
  // Otros iconos no hardcodeados directamente en el footer
  Twitter: <Twitter className="h-5 w-5" />,
  Youtube: <Youtube className="h-5 w-5" />,
  Linkedin: <Linkedin className="h-5 w-5" />,
  MessageCircle: <MessageCircle className="h-5 w-5" />,
  Send: <Send className="h-5 w-5" />,
  Pin: <Pin className="h-5 w-5" />,
}

export function Footer() {
  // Eliminado socialData y navbarData state

  // Referencias para animaciones
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const quickLinksRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Eliminado loadData y listeners de contentUpdated/storage
    // Ya no se cargan datos dinámicamente
  }, [])

  // Configurar animaciones con GSAP
  useGSAP(() => {
    if (!footerRef.current) return

    // Animación del logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.9,
          filter: "blur(5px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )
    }

    // Animación de la descripción
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )
    }

    // Animación de los iconos sociales
    if (socialRef.current) {
      gsap.fromTo(
        socialRef.current.children,
        { y: 15, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.4,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )
    }

    // Animaciones para otras secciones del footer
    const sections = [quickLinksRef.current, contactRef.current]
    sections.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.2 + index * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        )
      }
    })

    // Animación del footer inferior
    if (bottomRef.current) {
      gsap.fromTo(
        bottomRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "center 90%",
            toggleActions: "play none none none",
          },
        },
      )
    }
  }, [])

  return (
    <footer ref={footerRef} className="bg-gradient-to-b from-primary to-primary/90 text-white py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col">
              <div ref={logoRef} className="origin-left">
                {/* Logo estático */}
                <div className=" h-auto w-auto mb-6">
                  <Image
                    src="/logoaltura.png"
                    alt="Logo UPARSISTEM Altura"
                    width={200}
                    height={200}
                    className="object-contain max-h-16"
                  />
                </div>
              </div>
              <p ref={descriptionRef} className="text-gray-200 mb-8 max-w-md leading-relaxed">
                Centro de entrenamiento especializado en trabajo seguro en altura. Formamos personas para el trabajo y
                el desarrollo humano, con valores, espíritu emprendedor y capacidad técnica.
              </p>
              <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
              <div ref={socialRef} className="flex space-x-4">
                {/* Redes Sociales Estáticas */}
                <Link
                  href="https://www.facebook.com/uparsistem/" // Reemplaza con tu URL de Facebook
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent transition-colors p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transform transition-transform duration-200 ease-out hover:scale-110" // Added hover effect
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/uparsistem/" // Reemplaza con tu URL de Instagram
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent transition-colors p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transform transition-transform duration-200 ease-out hover:scale-110" // Added hover effect
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://www.tiktok.com/@uparsistem" // Reemplaza con tu URL de TikTok
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent transition-colors p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transform transition-transform duration-200 ease-out hover:scale-110" // Added hover effect
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Link>
              </div>
            </div>
          </div>

          <div ref={quickLinksRef}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Enlaces rápidos
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200"
                >
                  {" "}
                  {/* Added hover effect */}
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200"
                >
                  {" "}
                  {/* Added hover effect */}
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200"
                >
                  {" "}
                  {/* Added hover effect */}
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="#gallery"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200"
                >
                  {" "}
                  {/* Added hover effect */}
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="#certifications"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200" // Added hover effect
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Certificaciones
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center hover:translate-x-1 transition-transform duration-200"
                >
                  {" "}
                  {/* Added hover effect */}
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div ref={contactRef}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Contacto
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent"></span>
            </h3>
            <ul className="space-y-4">
              <li className="text-gray-300 flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-1" />
                <span>Sede Principal: Calle 16 A No. 12 - 36</span>
              </li>
              <li className="text-gray-300 flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-1" />
                <span>Centro de Prácticas: Calle 6 No. 1 - 3</span>
              </li>
              <li className="text-gray-300 flex items-start">
                <Phone className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p>PBX: 6019197356</p>
                  <p>3202509270 / 3103708870</p>
                </div>
              </li>
              <li className="text-gray-300 flex items-start">
                <Mail className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-1" />
                <span>alturasupar@uparsistem.edu.co</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          ref={bottomRef}
          className="border-t border-white/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Centro de Entrenamiento Trabajo Seguro en Altura de UPARSISTEM. Todos los
            derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-gray-300 hover:text-accent text-sm transition-colors cursor-pointer">
                  Política de privacidad
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Política de privacidad</DialogTitle>
                  <DialogDescription>Última actualización: 15 de mayo de 2024</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-4">
                  <PrivacyPolicyContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-gray-300 hover:text-accent text-sm transition-colors cursor-pointer">
                  Términos de servicio
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Términos de servicio</DialogTitle>
                  <DialogDescription>Última actualización: 15 de mayo de 2024</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-4">
                  <TermsOfServiceContent />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  )
}
