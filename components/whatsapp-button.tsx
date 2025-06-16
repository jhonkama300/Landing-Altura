"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  position?: "bottom-right" | "bottom-left"
  showOnMobile?: boolean
  delay?: number
  autoShowTooltip?: boolean
  autoShowDelay?: number
  autoHideDelay?: number
  reappearDelay?: number
  maxReappearances?: number
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hola, me gustaría obtener más información sobre sus servicios.",
  position = "bottom-right",
  showOnMobile = true,
  delay = 1500,
  autoShowTooltip = true,
  autoShowDelay = 30000,
  autoHideDelay = 10000,
  reappearDelay = 60000,
  maxReappearances = 3,
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const reappearancesRef = useRef(0)
  const timersRef = useRef<NodeJS.Timeout[]>([])

  // Función para limpiar todos los temporizadores
  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current = []
  }

  // Función para programar la aparición del tooltip
  const scheduleTooltipShow = (delay: number) => {
    const timer = setTimeout(() => {
      if (!userInteracted && reappearancesRef.current < maxReappearances) {
        setShowTooltip(true)
        reappearancesRef.current += 1

        // Programar ocultamiento
        const hideTimer = setTimeout(() => {
          setShowTooltip(false)

          // Programar reaparición
          scheduleTooltipShow(reappearDelay)
        }, autoHideDelay)

        timersRef.current.push(hideTimer)
      }
    }, delay)

    timersRef.current.push(timer)
  }

  // Formatear el número de teléfono (eliminar espacios, guiones, etc.)
  const formattedPhone = phoneNumber.replace(/\D/g, "")

  // Crear el enlace de WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`

  // Posición del botón
  const positionClasses = position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"

  // Mostrar el botón después de un breve retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  // Ocultar en móviles si showOnMobile es false
  useEffect(() => {
    if (!showOnMobile) {
      const handleResize = () => {
        setIsVisible(window.innerWidth > 768)
      }

      handleResize()
      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
    }
  }, [showOnMobile])

  // Mostrar tooltip automáticamente después de un tiempo y configurar reapariciones
  useEffect(() => {
    if (isVisible && autoShowTooltip) {
      // Programar primera aparición
      scheduleTooltipShow(autoShowDelay)
    }

    return () => clearAllTimers()
  }, [isVisible, autoShowTooltip, autoShowDelay, autoHideDelay, reappearDelay])

  // Manejar interacción del usuario con el botón
  const handleUserInteraction = () => {
    setUserInteracted(true)
    clearAllTimers()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${positionClasses} flex items-center`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Tooltip con posición condicional */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                className="absolute right-20 bottom-0 px-4 py-3 bg-white text-gray-800 rounded-lg shadow-lg text-sm w-[220px] text-center border border-gray-100"
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    mass: 1,
                    delay: 0.1,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
              >
                <p className="font-medium mb-1">¿Necesitas ayuda?</p>
                <p className="text-xs text-gray-600">Chatea con nosotros por WhatsApp</p>
                <div className="absolute w-3 h-3 bg-white transform rotate-45 top-1/2 -mt-1.5 -right-1.5 border-t border-r border-gray-100"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón de WhatsApp */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            onClick={handleUserInteraction}
            aria-label="Chatear por WhatsApp"
            role="button"
          >
            <div className="relative flex items-center justify-center">
              {/* Icono de WhatsApp mejorado */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-8 h-8 text-white fill-current drop-shadow-md"
                aria-hidden="true"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>

              {/* Efecto de pulso mejorado */}
              <motion.span
                className="absolute w-full h-full rounded-full bg-[#25D366] opacity-30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />

              {/* Efecto de brillo */}
              <motion.span
                className="absolute w-full h-full rounded-full bg-white opacity-0"
                animate={{
                  opacity: [0, 0.2, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: 1,
                }}
              />
            </div>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
