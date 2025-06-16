"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Eye,
  Type,
  Contrast,
  BracketsIcon as Spacing,
  MousePointer2,
  PanelLeft,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  Play,
  Pause,
  Square,
  FastForward,
  Rewind,
  VolumeX,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ColorBlindnessType = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
type FontSizeLevel = 0 | 1 | 2 | 3
type AccessibilitySettings = {
  colorBlindness: ColorBlindnessType
  fontSize: FontSizeLevel
  highContrast: boolean
  textSpacing: boolean
  cursorSize: boolean
  textToSpeechEnabled: boolean
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    colorBlindness: "none",
    fontSize: 0,
    highContrast: false,
    textSpacing: false,
    cursorSize: false,
    textToSpeechEnabled: false,
  })

  // Estado para el lector de texto
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const [currentText, setCurrentText] = useState("")
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")

  // Referencias para el lector de texto
  const synth = useRef<SpeechSynthesis | null>(null)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)

  // Inicializar el sintetizador de voz
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis

      // Cargar voces disponibles
      const loadVoices = () => {
        const voices = synth.current?.getVoices() || []
        setAvailableVoices(voices)

        // Intentar seleccionar una voz en español por defecto
        const spanishVoice = voices.find((voice) => voice.lang.includes("es"))
        if (spanishVoice) {
          setSelectedVoice(spanishVoice.name)
        } else if (voices.length > 0) {
          setSelectedVoice(voices[0].name)
        }
      }

      // Chrome necesita este evento para cargar las voces
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices
      }

      loadVoices()

      // Limpiar al desmontar
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel()
        }
      }
    }
  }, [])

  // Cargar configuración guardada
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
        applySettings(parsedSettings)
      } catch (e) {
        console.error("Error parsing saved accessibility settings", e)
      }
    }
  }, [])

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
    applySettings(settings)
  }, [settings])

  // Aplicar configuraciones al documento
  const applySettings = (currentSettings: AccessibilitySettings) => {
    // Aplicar filtros de daltonismo
    document.documentElement.style.filter = getColorBlindnessFilter(currentSettings.colorBlindness)

    // Aplicar tamaño de fuente
    document.documentElement.setAttribute("data-font-size", currentSettings.fontSize.toString())

    // Aplicar alto contraste
    if (currentSettings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Aplicar espaciado de texto
    if (currentSettings.textSpacing) {
      document.documentElement.classList.add("increased-spacing")
    } else {
      document.documentElement.classList.remove("increased-spacing")
    }

    // Aplicar cursor grande
    if (currentSettings.cursorSize) {
      document.documentElement.classList.add("large-cursor")
    } else {
      document.documentElement.classList.remove("large-cursor")
    }
  }

  const getColorBlindnessFilter = (type: ColorBlindnessType): string => {
    switch (type) {
      case "protanopia":
        return "url(#protanopia-filter)"
      case "deuteranopia":
        return "url(#deuteranopia-filter)"
      case "tritanopia":
        return "url(#tritanopia-filter)"
      case "achromatopsia":
        return "grayscale(100%)"
      default:
        return "none"
    }
  }

  const setColorBlindness = (type: ColorBlindnessType) => {
    setSettings((prev) => ({ ...prev, colorBlindness: type }))
  }

  const increaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(3, prev.fontSize + 1) as FontSizeLevel,
    }))
  }

  const decreaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(0, prev.fontSize - 1) as FontSizeLevel,
    }))
  }

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
  }

  const toggleTextSpacing = () => {
    setSettings((prev) => ({ ...prev, textSpacing: !prev.textSpacing }))
  }

  const toggleCursorSize = () => {
    setSettings((prev) => ({ ...prev, cursorSize: !prev.cursorSize }))
  }

  const toggleTextToSpeech = () => {
    setSettings((prev) => ({ ...prev, textToSpeechEnabled: !prev.textToSpeechEnabled }))
  }

  const resetSettings = () => {
    const defaultSettings = {
      colorBlindness: "none",
      fontSize: 0,
      highContrast: false,
      textSpacing: false,
      cursorSize: false,
      textToSpeechEnabled: false,
    } as AccessibilitySettings

    setSettings(defaultSettings)

    // Detener la lectura si está activa
    if (synth.current?.speaking) {
      synth.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }

    // Eliminar resaltado
    if (highlightedElement) {
      highlightedElement.classList.remove("tts-highlight")
      setHighlightedElement(null)
    }
  }

  // Funciones para el lector de texto
  const startSpeaking = (textType: "page" | "paragraph" | "selection") => {
    if (!synth.current) return

    // Detener cualquier lectura en curso
    if (synth.current.speaking) {
      synth.current.cancel()
    }

    let textToRead = ""

    // Obtener el texto según el tipo seleccionado
    if (textType === "selection") {
      // Leer texto seleccionado
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        textToRead = selection.toString()

        // Intentar obtener el elemento que contiene la selección
        const range = selection.getRangeAt(0)
        const container =
          range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentElement
            : (range.commonAncestorContainer as HTMLElement)

        if (container) {
          // Resaltar el elemento
          if (highlightedElement) {
            highlightedElement.classList.remove("tts-highlight")
          }
          container.classList.add("tts-highlight")
          setHighlightedElement(container as HTMLElement)
        }
      } else {
        alert("Por favor, selecciona algún texto para leer.")
        return
      }
    } else if (textType === "paragraph") {
      // Leer párrafo donde está el cursor o el primer párrafo visible
      const selection = window.getSelection()
      let paragraph: HTMLElement | null = null

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        let node = range.commonAncestorContainer

        // Buscar el párrafo más cercano
        while (node && node.nodeName !== "P" && node !== document.body) {
          node = node.parentNode as Node
        }

        if (node && node.nodeName === "P") {
          paragraph = node as HTMLElement
        }
      }

      // Si no hay párrafo seleccionado, buscar el primer párrafo visible
      if (!paragraph) {
        const paragraphs = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li")
        for (const p of paragraphs) {
          const rect = p.getBoundingClientRect()
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            paragraph = p as HTMLElement
            break
          }
        }
      }

      if (paragraph) {
        textToRead = paragraph.textContent || ""

        // Resaltar el párrafo
        if (highlightedElement) {
          highlightedElement.classList.remove("tts-highlight")
        }
        paragraph.classList.add("tts-highlight")
        setHighlightedElement(paragraph)
      } else {
        alert("No se encontró ningún párrafo para leer.")
        return
      }
    } else {
      // Leer toda la página (contenido principal)
      const mainContent = document.querySelector("main") || document.body

      // Excluir elementos que no deberían leerse
      const textNodes: Node[] = []
      const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          // Excluir textos ocultos o en elementos de navegación/footer
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT

          const style = window.getComputedStyle(parent)
          if (style.display === "none" || style.visibility === "hidden") {
            return NodeFilter.FILTER_REJECT
          }

          // Excluir elementos específicos
          if (
            parent.closest("nav") ||
            parent.closest("footer") ||
            parent.closest("script") ||
            parent.closest("style") ||
            parent.closest(".accessibility-panel")
          ) {
            return NodeFilter.FILTER_REJECT
          }

          // Aceptar solo nodos con texto no vacío
          return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        },
      })

      let node
      while ((node = walker.nextNode())) {
        textNodes.push(node)
      }

      textToRead = textNodes.map((node) => node.textContent).join(" ")
    }

    if (!textToRead.trim()) {
      alert("No se encontró texto para leer.")
      return
    }

    // Crear y configurar el utterance
    utterance.current = new SpeechSynthesisUtterance(textToRead)
    utterance.current.rate = speechRate

    // Establecer la voz seleccionada
    if (selectedVoice) {
      const voice = availableVoices.find((v) => v.name === selectedVoice)
      if (voice) {
        utterance.current.voice = voice
      }
    }

    // Eventos para controlar el estado
    utterance.current.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setCurrentText(textToRead)
    }

    utterance.current.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentText("")

      // Quitar resaltado
      if (highlightedElement) {
        highlightedElement.classList.remove("tts-highlight")
        setHighlightedElement(null)
      }
    }

    utterance.current.onerror = (event) => {
      console.error("Error en la síntesis de voz:", event)
      setIsSpeaking(false)
      setIsPaused(false)

      // Quitar resaltado
      if (highlightedElement) {
        highlightedElement.classList.remove("tts-highlight")
        setHighlightedElement(null)
      }
    }

    // Iniciar la lectura
    synth.current.speak(utterance.current)
  }

  const pauseSpeaking = () => {
    if (!synth.current) return

    if (isSpeaking && !isPaused) {
      synth.current.pause()
      setIsPaused(true)
    } else if (isPaused) {
      synth.current.resume()
      setIsPaused(false)
    }
  }

  const stopSpeaking = () => {
    if (!synth.current) return

    synth.current.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentText("")

    // Quitar resaltado
    if (highlightedElement) {
      highlightedElement.classList.remove("tts-highlight")
      setHighlightedElement(null)
    }
  }

  const changeRate = (faster: boolean) => {
    const newRate = faster ? Math.min(2, speechRate + 0.25) : Math.max(0.5, speechRate - 0.25)

    setSpeechRate(newRate)

    // Aplicar el cambio a la lectura en curso
    if (isSpeaking && utterance.current) {
      // Guardar la posición actual
      const currentPosition = synth.current?.speaking ? synth.current.paused : false

      // Detener la lectura actual
      synth.current?.cancel()

      // Crear un nuevo utterance con la misma configuración pero diferente velocidad
      const newUtterance = new SpeechSynthesisUtterance(currentText)
      newUtterance.rate = newRate

      if (selectedVoice) {
        const voice = availableVoices.find((v) => v.name === selectedVoice)
        if (voice) {
          newUtterance.voice = voice
        }
      }

      // Configurar eventos
      newUtterance.onstart = utterance.current.onstart
      newUtterance.onend = utterance.current.onend
      newUtterance.onerror = utterance.current.onerror

      // Actualizar la referencia
      utterance.current = newUtterance

      // Reanudar la lectura
      synth.current?.speak(utterance.current)

      // Si estaba pausado, pausar de nuevo
      if (currentPosition) {
        setTimeout(() => {
          synth.current?.pause()
        }, 50)
      }
    }
  }

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value)

    // Si hay una lectura en curso, actualizar la voz
    if (isSpeaking && utterance.current) {
      const voice = availableVoices.find((v) => v.name === e.target.value)
      if (voice) {
        // Guardar la posición actual
        const currentPosition = synth.current?.speaking ? synth.current.paused : false

        // Detener la lectura actual
        synth.current?.cancel()

        // Crear un nuevo utterance con la misma configuración pero diferente voz
        const newUtterance = new SpeechSynthesisUtterance(currentText)
        newUtterance.rate = speechRate
        newUtterance.voice = voice

        // Configurar eventos
        newUtterance.onstart = utterance.current.onstart
        newUtterance.onend = utterance.current.onend
        newUtterance.onerror = utterance.current.onerror

        // Actualizar la referencia
        utterance.current = newUtterance

        // Reanudar la lectura
        synth.current?.speak(utterance.current)

        // Si estaba pausado, pausar de nuevo
        if (currentPosition) {
          setTimeout(() => {
            synth.current?.pause()
          }, 50)
        }
      }
    }
  }

  return (
    <>
      {/* SVG Filters para daltonismo */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Protanopia (ceguera al rojo) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>

          {/* Deuteranopia (ceguera al verde) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>

          {/* Tritanopia (ceguera al azul) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Botón principal de accesibilidad */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-white p-3 rounded-r-lg shadow-lg",
          "transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-secondary",
          isOpen ? "translate-x-[320px]" : "translate-x-0",
        )}
        aria-label={isOpen ? "Cerrar panel de accesibilidad" : "Abrir panel de accesibilidad"}
      >
        {isOpen ? <X size={24} /> : <PanelLeft size={24} />}
      </button>

      {/* Panel de accesibilidad */}
      <div
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-gray-900 w-[320px] rounded-r-lg shadow-xl",
          "transition-transform duration-300 ease-in-out transform",
          "border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 text-primary flex items-center gap-2">
            <span role="img" aria-label="Accesibilidad">
              ♿
            </span>{" "}
            Opciones de accesibilidad
          </h2>

          {/* Sección de lector de texto */}
          <div className="mb-6 border-b pb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Headphones size={18} /> Lector de texto
            </h3>

            {/* Controles principales */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => startSpeaking("selection")}
                className="text-xs p-2 rounded border bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Leer texto seleccionado"
              >
                <Volume2 size={16} />
                <span>Selección</span>
              </button>
              <button
                onClick={() => startSpeaking("paragraph")}
                className="text-xs p-2 rounded border bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Leer párrafo actual"
              >
                <Volume2 size={16} />
                <span>Párrafo</span>
              </button>
              <button
                onClick={() => startSpeaking("page")}
                className="text-xs p-2 rounded border bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Leer toda la página"
              >
                <Volume2 size={16} />
                <span>Página</span>
              </button>
            </div>

            {/* Controles de reproducción */}
            {isSpeaking && (
              <div className="flex justify-between items-center mb-3 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <button
                  onClick={() => changeRate(false)}
                  disabled={speechRate <= 0.5}
                  className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                  aria-label="Reducir velocidad"
                >
                  <Rewind size={16} />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={pauseSpeaking}
                    className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label={isPaused ? "Reanudar lectura" : "Pausar lectura"}
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>

                  <button
                    onClick={stopSpeaking}
                    className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Detener lectura"
                  >
                    <Square size={16} />
                  </button>
                </div>

                <button
                  onClick={() => changeRate(true)}
                  disabled={speechRate >= 2}
                  className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                  aria-label="Aumentar velocidad"
                >
                  <FastForward size={16} />
                </button>
              </div>
            )}

            {/* Información de velocidad */}
            <div className="flex justify-between items-center mb-3 text-xs">
              <span>Velocidad: {speechRate.toFixed(2)}x</span>
              {isSpeaking && <span>{isPaused ? "Pausado" : "Reproduciendo..."}</span>}
            </div>

            {/* Selector de voces */}
            {availableVoices.length > 0 && (
              <div className="mb-3">
                <label htmlFor="voice-select" className="text-xs block mb-1">
                  Voz:
                </label>
                <select
                  id="voice-select"
                  value={selectedVoice}
                  onChange={handleVoiceChange}
                  className="w-full text-xs p-1.5 rounded border bg-gray-50 dark:bg-gray-800"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Activar/desactivar lector */}
            <button
              onClick={toggleTextToSpeech}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded text-left text-sm",
                settings.textToSpeechEnabled
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              {settings.textToSpeechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              {settings.textToSpeechEnabled ? "Desactivar lector" : "Activar lector"}
            </button>
          </div>

          {/* Sección de daltonismo */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Eye size={18} /> Daltonismo
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setColorBlindness("none")}
                className={cn(
                  "text-xs p-2 rounded border",
                  settings.colorBlindness === "none"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                Normal
              </button>
              <button
                onClick={() => setColorBlindness("protanopia")}
                className={cn(
                  "text-xs p-2 rounded border",
                  settings.colorBlindness === "protanopia"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                Protanopia
              </button>
              <button
                onClick={() => setColorBlindness("deuteranopia")}
                className={cn(
                  "text-xs p-2 rounded border",
                  settings.colorBlindness === "deuteranopia"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                Deuteranopia
              </button>
              <button
                onClick={() => setColorBlindness("tritanopia")}
                className={cn(
                  "text-xs p-2 rounded border",
                  settings.colorBlindness === "tritanopia"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                Tritanopia
              </button>
              <button
                onClick={() => setColorBlindness("achromatopsia")}
                className={cn(
                  "text-xs p-2 rounded border col-span-2",
                  settings.colorBlindness === "achromatopsia"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gray-100 dark:bg-gray-800",
                )}
              >
                Escala de grises
              </button>
            </div>
          </div>

          {/* Sección de tamaño de texto */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Type size={18} /> Tamaño de texto
            </h3>
            <div className="flex items-center justify-between">
              <button
                onClick={decreaseFontSize}
                disabled={settings.fontSize === 0}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                aria-label="Disminuir tamaño de texto"
              >
                <ZoomOut size={18} />
              </button>
              <span className="font-medium">
                {settings.fontSize === 0 && "Normal"}
                {settings.fontSize === 1 && "Grande"}
                {settings.fontSize === 2 && "Más grande"}
                {settings.fontSize === 3 && "Muy grande"}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={settings.fontSize === 3}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                aria-label="Aumentar tamaño de texto"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>

          {/* Otras opciones de accesibilidad */}
          <div className="space-y-3">
            <button
              onClick={toggleHighContrast}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded text-left text-sm",
                settings.highContrast ? "bg-secondary text-secondary-foreground" : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <Contrast size={18} /> Alto contraste
            </button>

            <button
              onClick={toggleTextSpacing}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded text-left text-sm",
                settings.textSpacing ? "bg-secondary text-secondary-foreground" : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <Spacing size={18} /> Mayor espaciado
            </button>

            <button
              onClick={toggleCursorSize}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded text-left text-sm",
                settings.cursorSize ? "bg-secondary text-secondary-foreground" : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <MousePointer2 size={18} /> Cursor grande
            </button>
          </div>

          {/* Botón de reinicio */}
          <button
            onClick={resetSettings}
            className="mt-6 flex items-center gap-2 w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-sm font-medium"
          >
            <RotateCcw size={18} /> Restablecer configuración
          </button>
        </div>
      </div>
    </>
  )
}
