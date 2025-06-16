
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileEdit, CreditCard, PhoneCall, Laptop, Briefcase, MessageSquare, ExternalLink, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface QuickAccessItem {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  hoverColor: string
  external?: boolean
  popular?: boolean
}

const quickAccessItems: QuickAccessItem[] = [
  {
    id: "inscripcion",
    title: "Inscripción",
    description: "Realiza tu preinscripción sin costo y asegura tu cupo",
    href: "https://site2.q10.com/Preinscripcion?aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
    icon: FileEdit,
    bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
    hoverColor: "hover:from-emerald-600 hover:to-green-700",
    external: true,
    popular: true
  },
  {
    id: "pagos",
    title: "Pagos",
    description: "Realiza tus pagos y consulta tu información financiera",
    href: "https://site2.q10.com/login?ReturnUrl=%2F&aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
    icon: CreditCard,
    bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    hoverColor: "hover:from-blue-600 hover:to-indigo-700",
    external: true
  },
  {
    id: "contacto",
    title: "Contacto",
    description: "Comunícate con nosotros para resolver tus dudas",
    href: "#contact",
    icon: PhoneCall,
    bgColor: "bg-gradient-to-br from-orange-500 to-amber-600",
    hoverColor: "hover:from-orange-600 hover:to-amber-700"
  },
  {
    id: "campus",
    title: "Campus Virtual Q10",
    description: "Accede a tu plataforma académica y recursos de estudio",
    href: "https://site2.q10.com/login?ReturnUrl=%2F&aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
    icon: Laptop,
    bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
    hoverColor: "hover:from-purple-600 hover:to-violet-700",
    external: true
  },
  {
    id: "trabajo",
    title: "Trabaja Con Nosotros",
    description: "Explora oportunidades laborales y únete a nuestro equipo",
    href: "http://uparnet.com:8080/talento_humano/",
    icon: Briefcase,
    bgColor: "bg-gradient-to-br from-gray-700 to-slate-800",
    hoverColor: "hover:from-gray-800 hover:to-slate-900",
    external: true
  },
  {
    id: "pqrsf",
    title: "PQRSF",
    description: "Envía tus Peticiones, Quejas, Reclamos, Sugerencias o Felicitaciones",
    href: "https://site2.q10.com/SolicitudesInstitucionales/NuevaSolicitud?aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
    icon: MessageSquare,
    bgColor: "bg-gradient-to-br from-blue-600 to-cyan-700",
    hoverColor: "hover:from-blue-700 hover:to-cyan-800",
    external: true
  }
]

export function QuickAccess() {
  const [loaded, setLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.03,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    }
  }

  if (!loaded) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-56 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="quick-access" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="relative inline-block">
            <h2 className="text-4xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
              Acceso Rápido
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Accede a nuestros servicios en línea de manera rápida y sencilla. Todo lo que necesitas al alcance de un clic.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center"
        >
          <AnimatePresence>
            {quickAccessItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="w-full max-w-[320px]"
                  onHoverStart={() => setHoveredCard(item.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : "_self"}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block group"
                  >
                    <motion.div
                      variants={hoverVariants}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-white shadow-xl transition-all duration-500",
                        item.bgColor,
                        item.hoverColor,
                        "hover:shadow-2xl hover:shadow-black/20"
                      )}
                    >
                      {/* Popular Badge */}
                      {item.popular && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            POPULAR
                          </div>
                        </div>
                      )}

                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center space-y-4">
                        <motion.div
                          className="relative mx-auto"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          {hoveredCard === item.id && item.external && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center"
                            >
                              <ExternalLink className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </motion.div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/90 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Hover Arrow */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredCard === item.id ? 1 : 0,
                            x: hoveredCard === item.id ? 0 : -10
                          }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center pt-2"
                        >
                          <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <span>Acceder</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
