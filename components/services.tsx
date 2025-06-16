"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock,
  FileCheck,
  User,
  Users,
  Heart,
  PenToolIcon as Tool,
  Shield,
  Award,
  Info,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"

interface ServiceData {
  id: string
  title: string
  duration: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  requirements?: string[]
  highlights?: string[]
  category: string
  price?: string
  popular?: boolean
  summary: string
  gradient: string
  bgColor: string
  image: string
}

const servicesData: ServiceData[] = [
  {
    id: "jefe-area",
    title: "JEFE DE ÁREA",
    duration: "8 HORAS (1 DÍA)",
    summary: "Formación básica para supervisores que trabajan en altura",
    description:
      "Curso de alturas que se hace por primera vez y aplica para desempeñar labores en una altura superior a 2 m.",
    icon: User,
    category: "Básico",
    gradient: "from-emerald-400 via-emerald-500 to-green-600",
    bgColor: "bg-emerald-500",
    image: "/placeholder.svg?height=1000&width=1000",
    requirements: [
      "Copia de cedula de ciudadanía ampliada.",
      "Planilla de afiliación a salud y ARL.",
      "Rut de la empresa, contratante o empleador.",
    ],
  },
  {
    id: "trabajador",
    title: "TRABAJADOR AUTORIZADO",
    duration: "35 HORAS (5 DÍAS)",
    summary: "Certificación avanzada para trabajadores especializados",
    description:
      "Curso de alturas dirigido al personal que con anterioridad haya realizado y aprobado el curso para trabajo en alturas de nivel avanzado.",
    icon: Users,
    category: "Avanzado",
    popular: true,
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    bgColor: "bg-blue-500",
    image: "/placeholder.svg?height=1000&width=1000",
    requirements: [
      "Copia de cedula de ciudadanía ampliada.",
      "Planilla de afiliación a salud y ARL.",
      "Examen de aptitud médica con concepto de APT para realizar trabajo seguro en altura, con vigencia inferior a un (1) año.",
      "Rut de la empresa contratante o empleador.",
    ],
  },
  {
    id: "reentrenamiento",
    title: "REENTRENAMIENTO",
    duration: "10 HORAS (2 DÍAS)",
    summary: "Actualización obligatoria para mantener certificación",
    description:
      "Curso de alturas dirigido al personal que con anterioridad haya realizado y aprobado el curso para trabajo en alturas de nivel avanzado.",
    icon: FileCheck,
    category: "Actualización",
    gradient: "from-orange-400 via-orange-500 to-amber-600",
    bgColor: "bg-orange-500",
    image: "/placeholder.svg?height=1000&width=1000",
    requirements: [
      "Copia de cedula de ciudadanía ampliada.",
      "Planilla de afiliación a salud y ARL.",
      "Examen de aptitud médica con concepto de APT para realizar trabajo seguro en altura, con vigencia inferior a un (1) año.",
      "Curso de trabajador autorizado (avanzado) o curso de reentrenamiento no superior a 18 meses.",
      "Rut de la empresa contratante o empleador.",
    ],
  },
  {
    id: "coordinador",
    title: "NIVEL COORDINADOR DE TSA",
    duration: "80 HORAS (8 DÍAS)",
    summary: "Especialización para profesionales coordinadores de seguridad",
    description:
      "Curso dirigido al personal especialista o profesional que dentro de sus funciones se encuentre garantizar la seguridad los trabajadores.",
    icon: Shield,
    category: "Especializado",
    gradient: "from-purple-400 via-purple-500 to-violet-600",
    bgColor: "bg-purple-500",
    image: "/placeholder.svg?height=1000&width=1000",
    requirements: [
      "Copia de cedula de ciudadanía ampliada.",
      "Planilla de afiliación a salud y ARL.",
      "Examen de aptitud médica con concepto de APT para realizar trabajo seguro en altura, con vigencia inferior a un (1) año.",
      "Curso de 50 o 20 horas en sg-sst.",
      "Rut de la empresa contratante o empleador.",
      "Demostrar experiència certificada mínima de un año en coordinar, organizar y supervisar trabajos en altura.",
    ],
  },
  {
    id: "primeros-auxilios",
    title: "PRIMEROS AUXILIOS",
    duration: "Capacitación esencial para emergencias",
    summary: "Formación vital para respuesta ante emergencias médicas",
    description:
      "La capacitación en primeros auxilios es vital, ya que puede ser la diferencia entre la vida y la muerte en situaciones críticas.",
    icon: Heart,
    category: "Salud",
    gradient: "from-red-400 via-red-500 to-rose-600",
    bgColor: "bg-red-500",
    image: "/placeholder.svg?height=1000&width=1000",
    highlights: [
      "Prevención de lesiones graves: Actuar rápidamente puede evitar que una lesión menor se convierta en algo más grave.",
      "Incremento de la supervivencia: La asistencia inmediata puede salvar vidas en casos críticos.",
      "Reducción del tiempo de respuesta: Permite actuar eficientemente sin perder tiempo crucial.",
      "Mejora de la confianza: Proporciona la confianza necesaria para afrontar emergencias.",
    ],
  },
  {
    id: "andamios",
    title: "ARMADO Y DESARMADO DE ANDAMIOS",
    duration: "Formación Continuada",
    summary: "Técnicas seguras para instalación de estructuras temporales",
    description: "Realizar un curso de armado y desarmado de andamios es esencial por diversas razones de seguridad.",
    icon: Tool,
    category: "Técnico",
    gradient: "from-gray-500 via-gray-600 to-slate-700",
    bgColor: "bg-gray-600",
    image: "/placeholder.svg?height=1000&width=1000",
    highlights: [
      "Seguridad: Garantizar la protección siguiendo procedimientos específicos para prevenir accidentes.",
      "Eficiencia laboral: Conocimientos sólidos reducen tiempo y costos de la obra.",
      "Reducción de riesgos: La capacitación disminuye significativamente los riesgos de accidentes laborales.",
    ],
  },
]

interface ServicesProps {
  id?: string
}

export function Services({ id }: ServicesProps) {
  const [activeService, setActiveService] = useState<ServiceData | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality with pause controls
  useEffect(() => {
    if (isAutoPlaying && !isHovered && !activeService) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % servicesData.length)
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, isHovered, activeService])

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % servicesData.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + servicesData.length) % servicesData.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleCardHover = (isHovering: boolean) => {
    setIsHovered(isHovering)
  }

  const handleServiceModalOpen = (service: ServiceData) => {
    setActiveService(service)
    setIsAutoPlaying(false)
  }

  const handleServiceModalClose = () => {
    setActiveService(null)
    setTimeout(() => setIsAutoPlaying(true), 1000)
  }

  return (
    <section id={id} className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
              Nuestros Servicios
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full mx-auto mb-6" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Certificaciones profesionales en trabajo seguro en altura con instructores especializados
          </motion.p>
        </div>

        {/* Vertical Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Service Navigation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Explora Nuestros Cursos</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      isAutoPlaying && !isHovered && !activeService ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {isAutoPlaying && !isHovered && !activeService ? "Auto" : "Pausado"}
                  </button>
                  <span className="text-sm text-gray-500">
                    {currentSlide + 1} / {servicesData.length}
                  </span>
                </div>
              </div>

              {/* Service List with Progress */}
              <div
                className="space-y-3 max-h-96 overflow-y-auto pr-2"
                onMouseEnter={() => handleCardHover(true)}
                onMouseLeave={() => handleCardHover(false)}
              >
                {servicesData.map((service, index) => {
                  const IconComponent = service.icon
                  const isActive = index === currentSlide

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleSlideChange(index)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                        isActive
                          ? "bg-white shadow-lg border-primary/20 scale-105"
                          : "bg-gray-50/50 hover:bg-white/70 border-transparent hover:shadow-md"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        isActive
                          ? `bg-gradient-to-br ${service.gradient}`
                          : "bg-gray-200"
                      )}>
                        <IconComponent className={cn(
                          "w-5 h-5 transition-colors duration-300",
                          isActive ? "text-white" : "text-gray-600"
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-semibold text-sm transition-colors duration-300 truncate",
                          isActive ? "text-gray-900" : "text-gray-700"
                        )}>
                          {service.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{service.summary}</p>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={prevSlide}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  ← Anterior
                </button>

                <div className="flex gap-1">
                  {servicesData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === currentSlide ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>

            {/* Right Side - Featured Service Card */}
            <div className="relative">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative"
                onMouseEnter={() => handleCardHover(true)}
                onMouseLeave={() => handleCardHover(false)}
              >
                {(() => {
                  const service = servicesData[currentSlide]
                  const IconComponent = service.icon

                  return (
                    <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                      {/* Service Card */}
                      <div className={cn(
                        "relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden", // Adjusted height for responsiveness
                        "bg-gradient-to-br shadow-2xl transition-all duration-500",
                        "hover:shadow-3xl hover:scale-[1.02] transform-gpu",
                        service.gradient
                      )}>

                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            className="w-full h-full object-cover opacity-20"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full"> {/* Adjusted padding */}
                          {/* Popular Badge */}
                          {service.popular && (
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6"> {/* Adjusted position */}
                              <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2"> {/* Adjusted padding and font size */}
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> {/* Adjusted icon size */}
                                MÁS POPULAR
                              </div>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 sm:top-6 sm:left-6"> {/* Adjusted position */}
                            <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium"> {/* Adjusted padding and font size */}
                              {service.category}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col justify-center items-center text-center text-white space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
                            {/* Icon */}
                            <div className="relative">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"> {/* Adjusted size */}
                                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" /> {/* Adjusted icon size */}
                              </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-2 sm:space-y-3"> {/* Adjusted spacing */}
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight"> {/* Adjusted font size */}
                                {service.title}
                              </h3>
                              <p className="text-base sm:text-lg text-white/90 font-medium flex items-center justify-center gap-1 sm:gap-2"> {/* Adjusted font size and spacing */}
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Adjusted icon size */}
                                {service.duration}
                              </p>
                            </div>

                            {/* Summary */}
                            <p className="text-sm sm:text-base text-white/80 max-w-xs sm:max-w-sm leading-relaxed"> {/* Adjusted font size and max-width */}
                              {service.summary}
                            </p>

                            {/* Description Preview */}
                            <p className="text-xs sm:text-sm text-white/70 max-w-xs sm:max-w-md leading-relaxed line-clamp-3"> {/* Adjusted font size and max-width */}
                              {service.description}
                            </p>
                          </div>

                          {/* Bottom Action */}
                          <div className="flex justify-center pt-4 sm:pt-6"> {/* Adjusted padding */}
                            <Button
                              variant="secondary"
                              size="lg"
                              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 group text-sm sm:text-base" // Adjusted padding and font size
                              onClick={() => handleServiceModalOpen(service)}
                            >
                              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> {/* Adjusted icon size and margin */}
                              Ver Detalles Completos
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" /> {/* Adjusted icon size and margin */}
                            </Button>
                          </div>

                          {/* Decorative Elements */}
                          <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" /> {/* Adjusted size */}
                          <div className="absolute -bottom-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-3xl" /> {/* Adjusted size */}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>

              {/* Auto-play Progress Bar */}
              {isAutoPlaying && !isHovered && !activeService && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8"> {/* Adjusted position */}
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/60 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 sm:p-8 shadow-xl"> {/* Adjusted padding */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4"> {/* Adjusted font size and margin */}
              ¿Necesitas una certificación específica?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 max-w-2xl mx-auto"> {/* Adjusted font size and margin */}
              Contáctanos para obtener información personalizada sobre nuestros cursos y fechas disponibles
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"> {/* Adjusted spacing */}
              <a
                href="https://api.whatsapp.com/send?phone=573202509270&text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20UPARSISTEM."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-accent to-accent text-white hover:from-primary hover:to-primary px-6 sm:px-8 w-full sm:w-auto" // Adjusted padding and width
                >
                  Solicitar Información
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Service Detail Modal */}
        <Dialog open={!!activeService} onOpenChange={() => activeService && handleServiceModalClose()}>
          <DialogContent className="max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] p-0 overflow-hidden"> {/* Adjusted max-width for responsiveness */}
            {activeService && (
              <>
                {/* Modal Header with Gradient and Image */}
                <div className={cn("relative p-6 sm:p-8 text-white bg-gradient-to-br", activeService.gradient)}> {/* Adjusted padding */}
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={activeService.image || "/placeholder.svg"}
                      alt={activeService.title}
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60" />
                  </div>

                  <DialogHeader className="relative z-10">
                    <div className="flex items-start gap-4 sm:gap-6"> {/* Adjusted spacing */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"> {/* Adjusted size */}
                        <activeService.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> {/* Adjusted icon size */}
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"> {/* Adjusted font size and margin */}
                          {activeService.title}
                        </DialogTitle>
                        <DialogDescription className="text-base sm:text-lg text-white/90 flex items-center gap-1 sm:gap-2"> {/* Adjusted font size and spacing */}
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Adjusted icon size */}
                          {activeService.duration}
                        </DialogDescription>
                        <div className="mt-3 sm:mt-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium inline-block"> {/* Adjusted padding and font size */}
                          {activeService.category}
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto"> {/* Adjusted padding and spacing */}
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 sm:p-6 rounded-2xl border border-blue-100"> {/* Adjusted padding */}
                    <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Resumen del Servicio</h4> {/* Adjusted font size and margin */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{activeService.summary}</p> {/* Adjusted font size */}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4">Descripción Completa</h4> {/* Adjusted font size and margin */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{activeService.description}</p> {/* Adjusted font size */}
                  </div>

                  {/* Requirements or Highlights */}
                  {(activeService.requirements || activeService.highlights) && (
                    <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200"> {/* Adjusted padding */}
                      <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center text-gray-800"> {/* Adjusted font size and margin */}
                        {activeService.highlights ? (
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" /> 
                        ) : (
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" /> 
                        )}
                        {activeService.highlights ? "Beneficios Principales" : "Requisitos Necesarios"}
                      </h4>
                      <div className="space-y-2 sm:space-y-3"> {/* Adjusted spacing */}
                        {(activeService.highlights || activeService.requirements || []).map((item, index) => {
                          const [title, description] = item.includes(":") ? item.split(":") : [null, item]
                          return (
                            <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100"> {/* Adjusted spacing and padding */}
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" /> {/* Adjusted icon size */}
                              <div className="text-sm sm:text-base text-gray-700 leading-relaxed"> {/* Adjusted font size */}
                                {title && <span className="font-semibold text-gray-900">{title.trim()}:</span>}
                                <span className={cn(title && "ml-1")}>
                                  {description?.trim() || item}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-5 sm:p-6 rounded-2xl border border-blue-200/50"> {/* Adjusted padding */}
                    <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">¿Listo para comenzar?</h4> {/* Adjusted font size and margin */}
                    <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed"> {/* Adjusted font size and margin */}
                      Contáctanos para obtener más información sobre fechas disponibles, precios y proceso de inscripción.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"> {/* Adjusted spacing */}
                      <a
                        href="https://api.whatsapp.com/send?phone=573202509270&text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20UPARSISTEM."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-accent to-accent text-white hover:from-primary hover:to-primary px-6 sm:px-8 w-full sm:w-auto" // Adjusted padding and width
                        >
                          Solicitar Información
                        </Button>
                      </a>

                    </div>
                  </div>
                </div>

                <DialogFooter className="p-4 sm:p-6 border-t border-gray-200"> {/* Adjusted padding */}
                  <Button variant="outline" onClick={handleServiceModalClose}>
                    Cerrar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
