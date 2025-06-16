"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  ImageIcon,
  Layers,
  Eye,
  Code,
  SlidersHorizontal,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  PanelTop,
  PanelBottom,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getContentSection, updateContentSection } from "@/lib/content"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ImageInfo } from "@/lib/images"
import { ImageLibrary } from "@/components/admin/image-library"
import { MediaUpload } from "@/components/admin/media-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

// Tipos para el contenido del hero
interface HeroButton {
  id: string
  text: string
  url: string
  variant: "primary" | "secondary" | "outline" | "ghost" | "accent"
  icon?: string
  position?: "left" | "right"
  size?: "sm" | "default" | "lg"
  customClass?: string
  animation?: {
    type: string
    delay: number
    duration: number
  }
}

interface HeroMedia {
  id: string
  type: "image" | "video"
  url: string
  alt?: string
  overlay?: boolean
  overlayOpacity?: number
  animation?: {
    type: string
    delay: number
    duration: number
  }
}

interface HeroText {
  id: string
  type: "title" | "subtitle" | "description" | "companyName" | "custom"
  content: string
  customClass?: string
  position?: "relative" | "absolute"
  top?: string
  left?: string
  right?: string
  bottom?: string
  customStyle?: Record<string, any>
  animation?: {
    enabled: boolean
    type: string
    delay: number
    duration: number
  }
}

interface CarouselMedia {
  url: string
  type: "image" | "video"
  alt?: string
  overlay?: boolean
  overlayOpacity?: number
}

interface HeroCarousel {
  enabled: boolean
  images: CarouselMedia[]
  autoplay: boolean
  interval: number
  showControls: boolean
  showIndicators: boolean
  effect: "fade" | "slide"
}

interface HeroContent {
  layout: "centered" | "left" | "right" | "split"
  textAlignment: "left" | "center" | "right"
  verticalPosition: "top" | "middle" | "bottom"
  background: {
    type: "color" | "image" | "video" | "gradient"
    value: string
    overlay?: boolean
    overlayOpacity?: number
  }
  carousel?: HeroCarousel
  texts: HeroText[]
  media: HeroMedia[]
  buttons: HeroButton[]
  height: "full" | "large" | "medium" | "small" | "custom"
  customHeight?: string
  customClass?: string
  showScrollButton?: boolean
  animations: {
    enabled: boolean
    scroll: boolean
    presets: string
  }
  backgroundImage?: string // Para compatibilidad con el formato antiguo
  title?: string
  subtitle?: string
  companyName?: string
  description?: string
}

// Opciones para animaciones
const animationTypes = [
  "fade-in",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "bounce",
  "flip",
  "rotate",
]

// Opciones para iconos de botones
const buttonIcons = ["ArrowRight", "ArrowDown", "ChevronRight", "ExternalLink", "Play", "Download", "Send", "Plus"]

export default function HeroEditorPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("content")
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const [isCarouselImageDialog, setIsCarouselImageDialog] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<number | null>(null)
  const [currentCarouselMediaType, setCurrentCarouselMediaType] = useState<"image" | "video">("image")
  const [loading, setLoading] = useState(true)

  // Estado para el contenido del hero
  const [heroContent, setHeroContent] = useState<HeroContent>({
    layout: "centered",
    textAlignment: "center",
    verticalPosition: "middle",
    background: {
      type: "image",
      value: "/hero-background.jpg",
      overlay: true,
      overlayOpacity: 50,
    },
    carousel: {
      enabled: false,
      images: [
      ],
      autoplay: true,
      interval: 5,
      showControls: true,
      showIndicators: true,
      effect: "fade",
    },
    texts: [
    ],
    media: [
     
    ],
    buttons: [
    ],
    height: "full",
    customHeight: "",
    showScrollButton: true,
    animations: {
      enabled: true,
      scroll: true,
      presets: "default",
    },
  })

  // Referencia para la vista previa
  const previewRef = useRef<HTMLDivElement>(null)

  // Cargar datos al iniciar
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setLoading(true)

        // Establecer un timeout para evitar carga infinita
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tiempo de espera agotado")), 5000),
        )

        // Intentar cargar desde la API primero
        try {
          const fetchPromise = fetch("/api/hero")
          const response = await Promise.race([fetchPromise, timeoutPromise])

          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data) {
              console.log("Cargando datos del hero desde la API:", result.data)

              // Convertir los datos de la API al formato del editor
              const apiData = result.data

              const convertedHero: HeroContent = {
                layout: apiData.layout || "centered",
                textAlignment: apiData.textAlignment || "center",
                verticalPosition: apiData.verticalPosition || "middle",
                background: apiData.background || {
                  type: "image",
                  value: "/hero-background.jpg",
                  overlay: true,
                  overlayOpacity: 50,
                },
                carousel: apiData.carousel || {
                  enabled: false,
                  images: [],
                  autoplay: true,
                  interval: 5,
                  showControls: true,
                  showIndicators: true,
                  effect: "fade",
                },
                texts: apiData.texts || [],
                media: apiData.media || [],
                buttons: apiData.buttons || [],
                height: apiData.height || "full",
                customHeight: apiData.customHeight || "",
                showScrollButton: apiData.showScrollButton !== false,
                animations: {
                  enabled: true,
                  scroll: true,
                  presets: "default",
                },
                // Campos de compatibilidad
                backgroundImage: apiData.backgroundImage || apiData.background?.value,
                title: apiData.title || "TRABAJO SEGURO EN ALTURA",
                subtitle: apiData.subtitle || "CENTRO DE ENTRENAMIENTO",
                companyName: apiData.companyName || "UPARSISTEM",
                description:
                  apiData.description ||
                  "Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad",
              }

              setHeroContent(convertedHero)
              setStatus({
                type: "success",
                message: "Configuración cargada desde la base de datos",
              })
              setLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.error("Error cargando desde la API:", apiError)
          // Continuar con localStorage si la API falla
        }

        // Fallback: cargar desde localStorage
        try {
          const storedHero = await getContentSection("hero")

          if (storedHero && typeof storedHero === "object") {
            console.log("Cargando datos del hero desde localStorage:", storedHero)

            // Si el formato almacenado es el antiguo, convertirlo al nuevo formato
            if (!storedHero.layout) {
              const convertedHero: HeroContent = {
                layout: "centered",
                textAlignment: "center",
                verticalPosition: "middle",
                background: {
                  type: "image",
                  value: storedHero.backgroundImage || "/hero-background.jpg",
                  overlay: true,
                  overlayOpacity: 50,
                },
                carousel: {
                  enabled: false,
                  images: [
                    {
                      url: storedHero.backgroundImage || "/hero-background.jpg",
                      type: "image",
                      alt: "Trabajo en altura",
                      overlay: true,
                      overlayOpacity: 50,
                    },
                    {
                      url: "/abstract-purple-landscape.png",
                      type: "image",
                      alt: "Formación especializada",
                      overlay: true,
                      overlayOpacity: 60,
                    },
                    {
                      url: "/modern-office-building.png",
                      type: "image",
                      alt: "Instalaciones",
                      overlay: true,
                      overlayOpacity: 40,
                    },
                  ],
                  autoplay: true,
                  interval: 5,
                  showControls: true,
                  showIndicators: true,
                  effect: "fade",
                },
                texts: [
                  {
                    id: "title-1",
                    type: "title",
                    content: storedHero.title || "TRABAJO SEGURO EN ALTURA",
                    animation: {
                      enabled: true,
                      type: "fade-in",
                      delay: 0.2,
                      duration: 0.8,
                    },
                  },
                  {
                    id: "subtitle-1",
                    type: "subtitle",
                    content: storedHero.subtitle || "CENTRO DE ENTRENAMIENTO",
                    animation: {
                      enabled: true,
                      type: "fade-in",
                      delay: 0.4,
                      duration: 0.8,
                    },
                  },
                  {
                    id: "company-1",
                    type: "companyName",
                    content: storedHero.companyName || "UPARSISTEM",
                    animation: {
                      enabled: true,
                      type: "fade-in",
                      delay: 0.6,
                      duration: 0.8,
                    },
                  },
                  {
                    id: "desc-1",
                    type: "description",
                    content:
                      storedHero.description ||
                      "Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad",
                    animation: {
                      enabled: true,
                      type: "fade-in",
                      delay: 0.8,
                      duration: 0.8,
                    },
                  },
                ],
                media: [
                  {
                    id: "media-1",
                    type: "image",
                    url: storedHero.backgroundImage || "/hero-background.jpg",
                    alt: "Trabajo en altura",
                    overlay: true,
                    overlayOpacity: 50,
                  },
                ],
                buttons:
                  storedHero.buttons?.map((btn: any, index: number) => ({
                    id: btn.id || `btn-${index + 1}`,
                    text: btn.text || "Botón",
                    url: btn.url || "#",
                    variant: btn.variant || "primary",
                    size: "lg",
                    animation: {
                      type: "fade-in",
                      delay: 1 + index * 0.1,
                      duration: 0.8,
                    },
                  })) || [],
                height: "full",
                customHeight: "",
                showScrollButton: true,
                animations: {
                  enabled: true,
                  scroll: true,
                  presets: "default",
                },
                backgroundImage: storedHero.backgroundImage,
                title: storedHero.title || "TRABAJO SEGURO EN ALTURA",
                subtitle: storedHero.subtitle || "CENTRO DE ENTRENAMIENTO",
                companyName: storedHero.companyName || "UPARSISTEM",
                description:
                  storedHero.description ||
                  "Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad",
              }
              setHeroContent(convertedHero)
            } else {
              // Formato nuevo, usar directamente
              setHeroContent(storedHero as HeroContent)
            }

            setStatus({
              type: "success",
              message: "Configuración cargada desde el almacenamiento local",
            })
          } else {
            // No hay datos, usar valores por defecto
            setStatus({
              type: null,
              message: "Usando configuración por defecto",
            })
          }
        } catch (error) {
          console.error("Error cargando configuración:", error)
          setStatus({
            type: "error",
            message: "Error cargando la configuración, usando valores por defecto",
          })
        }
      } catch (error) {
        console.error("Error general:", error)
        setStatus({
          type: "error",
          message: "Error cargando la configuración, usando valores por defecto",
        })
      } finally {
        setLoading(false)
      }
    }

    loadHeroData()
  }, [])

  // Manejar cambios en el layout
  const handleLayoutChange = (layout: HeroContent["layout"]) => {
    setHeroContent((prev) => ({
      ...prev,
      layout,
    }))
  }

  // Manejar cambios en la alineación de texto
  const handleTextAlignmentChange = (textAlignment: HeroContent["textAlignment"]) => {
    setHeroContent((prev) => ({
      ...prev,
      textAlignment,
    }))
  }

  // Manejar cambios en la posición vertical
  const handleVerticalPositionChange = (verticalPosition: HeroContent["verticalPosition"]) => {
    setHeroContent((prev) => ({
      ...prev,
      verticalPosition,
    }))
  }

  // Manejar cambios en el fondo
  const handleBackgroundChange = (field: string, value: any) => {
    setHeroContent((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        [field]: value,
      },
    }))
  }

  // Manejar cambios en el carrusel
  const handleCarouselChange = (field: string, value: any) => {
    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        [field]: value,
      },
    }))
  }

  // Manejar cambios en las imágenes del carrusel
  const handleCarouselImageChange = (index: number, field: string, value: any) => {
    const updatedImages = [...(heroContent.carousel?.images || [])]
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    }

    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        images: updatedImages,
      },
    }))
  }

  // Añadir nuevo medio al carrusel
  const handleAddCarouselMedia = (type: "image" | "video" = "image") => {
    const newMedia: CarouselMedia = {
      url: type === "image" ? "/placeholder.svg" : "/hero-video-background.mp4",
      type,
      alt: type === "image" ? "Nueva imagen" : "Nuevo video",
      overlay: true,
      overlayOpacity: 50,
    }

    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        images: [...(prev.carousel?.images || []), newMedia],
      },
    }))

    // Si estamos añadiendo un nuevo medio, abrir el diálogo de selección inmediatamente
    const newIndex = (heroContent.carousel?.images || []).length
    setTimeout(() => {
      setCurrentCarouselIndex(newIndex)
      setCurrentCarouselMediaType(type)
      setIsCarouselImageDialog(true)
    }, 100)
  }

  // Eliminar imagen del carrusel
  const handleRemoveCarouselImage = (index: number) => {
    const updatedImages = [...(heroContent.carousel?.images || [])]
    updatedImages.splice(index, 1)

    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        images: updatedImages,
      },
    }))
  }

  // Mover imagen del carrusel hacia arriba
  const handleMoveCarouselImageUp = (index: number) => {
    if (index === 0) return

    const updatedImages = [...(heroContent.carousel?.images || [])]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index - 1]
    updatedImages[index - 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        images: updatedImages,
      },
    }))
  }

  // Mover imagen del carrusel hacia abajo
  const handleMoveCarouselImageDown = (index: number) => {
    const images = heroContent.carousel?.images || []
    if (index === images.length - 1) return

    const updatedImages = [...images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[index + 1]
    updatedImages[index + 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      carousel: {
        ...prev.carousel!,
        images: updatedImages,
      },
    }))
  }

  // Abrir diálogo para seleccionar imagen del carrusel
  const handleOpenCarouselImageDialog = (index: number) => {
    const mediaType = heroContent.carousel?.images[index]?.type || "image"
    setCurrentCarouselIndex(index)
    setCurrentCarouselMediaType(mediaType)
    setIsCarouselImageDialog(true)
  }

  // Seleccionar imagen para el carrusel
  const handleSelectCarouselImage = (image: ImageInfo) => {
    if (currentCarouselIndex !== null) {
      const updatedImages = [...(heroContent.carousel?.images || [])]
      updatedImages[currentCarouselIndex] = {
        ...updatedImages[currentCarouselIndex],
        url: image.url,
        alt: image.name,
      }

      setHeroContent((prev) => ({
        ...prev,
        carousel: {
          ...prev.carousel!,
          images: updatedImages,
        },
      }))
    }

    setIsCarouselImageDialog(false)
  }

  // Manejar cambios en los textos
  const handleTextChange = (index: number, field: string, value: any) => {
    const updatedTexts = [...heroContent.texts]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      updatedTexts[index] = {
        ...updatedTexts[index],
        [parent]: {
          ...(updatedTexts[index][parent as keyof HeroText] as object),
          [child]: value,
        },
      }
    } else {
      updatedTexts[index] = {
        ...updatedTexts[index],
        [field]: value,
      }

      // Actualizar también los campos principales para compatibilidad
      if (updatedTexts[index].type === "title") {
        setHeroContent((prev) => ({ ...prev, title: value }))
      } else if (updatedTexts[index].type === "subtitle") {
        setHeroContent((prev) => ({ ...prev, subtitle: value }))
      } else if (updatedTexts[index].type === "companyName") {
        setHeroContent((prev) => ({ ...prev, companyName: value }))
      } else if (updatedTexts[index].type === "description") {
        setHeroContent((prev) => ({ ...prev, description: value }))
      }
    }

    setHeroContent((prev) => ({
      ...prev,
      texts: updatedTexts,
    }))
  }

  // Manejar cambios en el estilo personalizado de un texto
  const handleTextStyleChange = (index: number, styleProperty: string, value: any) => {
    const updatedTexts = [...heroContent.texts]

    // Asegurarse de que customStyle existe
    if (!updatedTexts[index].customStyle) {
      updatedTexts[index].customStyle = {}
    }

    // Actualizar la propiedad de estilo
    updatedTexts[index].customStyle = {
      ...updatedTexts[index].customStyle,
      [styleProperty]: value,
    }

    setHeroContent((prev) => ({
      ...prev,
      texts: updatedTexts,
    }))
  }

  // Añadir nuevo texto
  const handleAddText = () => {
    const newText: HeroText = {
      id: `text-${Date.now()}`,
      type: "custom",
      content: "Nuevo texto",
      animation: {
        enabled: true,
        type: "fade-in",
        delay: 0.5,
        duration: 0.8,
      },
    }

    setHeroContent((prev) => ({
      ...prev,
      texts: [...prev.texts, newText],
    }))
  }

  // Eliminar texto
  const handleRemoveText = (index: number) => {
    const textToRemove = heroContent.texts[index]
    const updatedTexts = [...heroContent.texts]
    updatedTexts.splice(index, 1)

    // Actualizar el estado con los textos actualizados
    setHeroContent((prev) => {
      // Crear una copia del estado actual
      const newState = { ...prev, texts: updatedTexts }

      // Si el texto eliminado era uno de los principales, limpiar ese campo
      if (textToRemove.type === "title") {
        newState.title = ""
      } else if (textToRemove.type === "subtitle") {
        newState.subtitle = ""
      } else if (textToRemove.type === "companyName") {
        newState.companyName = ""
      } else if (textToRemove.type === "description") {
        newState.description = ""
      }

      return newState
    })
  }

  // Mover texto hacia arriba
  const handleMoveTextUp = (index: number) => {
    if (index === 0) return

    const updatedTexts = [...heroContent.texts]
    const temp = updatedTexts[index]
    updatedTexts[index] = updatedTexts[index - 1]
    updatedTexts[index - 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      texts: updatedTexts,
    }))
  }

  // Mover texto hacia abajo
  const handleMoveTextDown = (index: number) => {
    if (index === heroContent.texts.length - 1) return

    const updatedTexts = [...heroContent.texts]
    const temp = updatedTexts[index]
    updatedTexts[index] = updatedTexts[index + 1]
    updatedTexts[index + 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      texts: updatedTexts,
    }))
  }

  // Manejar cambios en los botones
  const handleButtonChange = (index: number, field: string, value: any) => {
    const updatedButtons = [...heroContent.buttons]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      updatedButtons[index] = {
        ...updatedButtons[index],
        [parent]: {
          ...(updatedButtons[index][parent as keyof HeroButton] as object),
          [child]: value,
        },
      }
    } else {
      updatedButtons[index] = {
        ...updatedButtons[index],
        [field]: value,
      }
    }

    setHeroContent((prev) => ({
      ...prev,
      buttons: updatedButtons,
    }))
  }

  // Añadir nuevo botón
  const handleAddButton = () => {
    const newButton: HeroButton = {
      id: `btn-${Date.now()}`,
      text: "Nuevo Botón",
      url: "#",
      variant: "primary",
      size: "lg",
      animation: {
        type: "fade-in",
        delay: 1,
        duration: 0.8,
      },
    }

    setHeroContent((prev) => ({
      ...prev,
      buttons: [...prev.buttons, newButton],
    }))
  }

  // Eliminar botón
  const handleRemoveButton = (index: number) => {
    const updatedButtons = [...heroContent.buttons]
    updatedButtons.splice(index, 1)

    setHeroContent((prev) => ({
      ...prev,
      buttons: updatedButtons,
    }))
  }

  // Mover botón hacia arriba
  const handleMoveButtonUp = (index: number) => {
    if (index === 0) return

    const updatedButtons = [...heroContent.buttons]
    const temp = updatedButtons[index]
    updatedButtons[index] = updatedButtons[index - 1]
    updatedButtons[index - 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      buttons: updatedButtons,
    }))
  }

  // Mover botón hacia abajo
  const handleMoveButtonDown = (index: number) => {
    if (index === heroContent.buttons.length - 1) return

    const updatedButtons = [...heroContent.buttons]
    const temp = updatedButtons[index]
    updatedButtons[index] = updatedButtons[index + 1]
    updatedButtons[index + 1] = temp

    setHeroContent((prev) => ({
      ...prev,
      buttons: updatedButtons,
    }))
  }

  // Manejar cambios en los medios
  const handleMediaChange = (index: number, field: string, value: any) => {
    const updatedMedia = [...heroContent.media]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      updatedMedia[index] = {
        ...updatedMedia[index],
        [parent]: {
          ...(updatedMedia[index][parent as keyof HeroMedia] as object),
          [child]: value,
        },
      }
    } else {
      updatedMedia[index] = {
        ...updatedMedia[index],
        [field]: value,
      }
    }

    setHeroContent((prev) => ({
      ...prev,
      media: updatedMedia,
    }))
  }

  // Añadir nuevo medio
  const handleAddMedia = (type: "image" | "video") => {
    const newMedia: HeroMedia = {
      id: `media-${Date.now()}`,
      type,
      url: type === "image" ? "/placeholder.svg" : "/hero-video-background.mp4",
      alt: type === "image" ? "Nueva imagen" : undefined,
      overlay: false,
      animation: {
        type: "fade-in",
        delay: 0,
        duration: 1,
      },
    }

    setHeroContent((prev) => ({
      ...prev,
      media: [...prev.media, newMedia],
    }))
  }

  // Eliminar medio
  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...heroContent.media]
    updatedMedia.splice(index, 1)

    setHeroContent((prev) => ({
      ...prev,
      media: updatedMedia,
    }))
  }

  // Abrir diálogo para seleccionar medio
  const handleOpenMediaDialog = (index: number, type: "image" | "video") => {
    setCurrentMediaIndex(index)
    setMediaType(type)
    setIsMediaDialogOpen(true)
  }

  // Seleccionar imagen de la biblioteca
  const handleSelectImage = (image: ImageInfo) => {
    if (currentMediaIndex !== null) {
      const updatedMedia = [...heroContent.media]
      updatedMedia[currentMediaIndex].url = image.url
      updatedMedia[currentMediaIndex].alt = image.name

      setHeroContent((prev) => ({
        ...prev,
        media: updatedMedia,
      }))
    } else {
      // Si estamos seleccionando para el fondo
      setHeroContent((prev) => ({
        ...prev,
        background: {
          ...prev.background,
          value: image.url,
        },
        // También actualizar backgroundImage para compatibilidad con el formato antiguo
        backgroundImage: image.url,
      }))
    }

    setIsMediaDialogOpen(false)
  }

  // Manejar cambios en las animaciones
  const handleAnimationChange = (field: string, value: any) => {
    setHeroContent((prev) => ({
      ...prev,
      animations: {
        ...prev.animations,
        [field]: value,
      },
    }))
  }

  // Manejar cambios en la altura
  const handleHeightChange = (height: HeroContent["height"]) => {
    setHeroContent((prev) => ({
      ...prev,
      height,
    }))
  }

  // Manejar cambios en la clase personalizada
  const handleCustomClassChange = (customClass: string) => {
    setHeroContent((prev) => ({
      ...prev,
      customClass,
    }))
  }

  // Manejar cambios en el botón de desplazamiento
  const handleScrollButtonChange = (show: boolean) => {
    setHeroContent((prev) => ({
      ...prev,
      showScrollButton: show,
    }))
  }

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: "" })

    try {
      // Simulamos un pequeño retraso para la experiencia de usuario
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Asegurar que los textos estén incluidos en los datos a guardar
      const dataToSave = {
        ...heroContent,
        title: heroContent.texts.find((t) => t.type === "title")?.content || heroContent.title,
        subtitle: heroContent.texts.find((t) => t.type === "subtitle")?.content || heroContent.subtitle,
        companyName: heroContent.texts.find((t) => t.type === "companyName")?.content || heroContent.companyName,
        description: heroContent.texts.find((t) => t.type === "description")?.content || heroContent.description,
        backgroundImage: heroContent.background?.value || heroContent.backgroundImage,
      }

      console.log("Guardando datos del hero:", dataToSave)

      const success = updateContentSection("hero", dataToSave)

      if (success) {
        // Forzar actualización de la página principal
        window.dispatchEvent(new Event("contentUpdated"))

        setStatus({
          type: "success",
          message: "Los cambios se han guardado correctamente",
        })
      } else {
        setStatus({
          type: "error",
          message: "Ocurrió un error al guardar los cambios",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Ocurrió un error al guardar los cambios",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Generar clases CSS para la vista previa
  const getPreviewClasses = () => {
    let classes = "relative overflow-hidden rounded-lg"

    switch (heroContent.height) {
      case "full":
        classes += " h-[400px]"
        break
      case "large":
        classes += " h-[350px]"
        break
      case "medium":
        classes += " h-[300px]"
        break
      case "small":
        classes += " h-[250px]"
        break
      case "custom":
        classes += ` h-[${heroContent.customHeight || "400px"}]`
        break
    }

    return classes
  }

  // Generar estilos para el fondo
  const getBackgroundStyles = () => {
    const styles: React.CSSProperties = {}

    if (heroContent.background.type === "color") {
      styles.backgroundColor = heroContent.background.value || "#000000"
    } else if (heroContent.background.type === "gradient") {
      styles.backgroundImage = heroContent.background.value || "linear-gradient(to right, #4F46E5, #7C3AED)"
    }

    return styles
  }

  // Función para manejar el cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando configuración...</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Editor Avanzado del Hero</h1>
          </div>

          {status.type && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} defaultValue="content" onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="content">
                <Layers className="h-4 w-4 mr-2" />
                Contenido
              </TabsTrigger>
              <TabsTrigger value="layout">
                <Layout className="h-4 w-4 mr-2" />
                Diseño
              </TabsTrigger>
              <TabsTrigger value="media">
                <ImageIcon className="h-4 w-4 mr-2" />
                Medios
              </TabsTrigger>
              <TabsTrigger value="carousel">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Carrusel
              </TabsTrigger>
              <TabsTrigger value="animations">
                <Code className="h-4 w-4 mr-2" />
                Animaciones
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de Contenido */}
            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Textos */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Textos</CardTitle>
                      <Button size="sm" onClick={handleAddText}>
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir texto
                      </Button>
                    </div>
                    <CardDescription>Gestiona los textos del hero</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {heroContent.texts.map((text, index) => (
                      <Card key={text.id} className="p-4 border-l-4 border-l-primary">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">
                            {text.type === "title"
                              ? "Título principal"
                              : text.type === "subtitle"
                                ? "Subtítulo"
                                : text.type === "companyName"
                                  ? "Nombre de empresa"
                                  : text.type === "description"
                                    ? "Descripción"
                                    : "Texto personalizado"}
                          </h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveTextUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveTextDown(index)}
                              disabled={index === heroContent.texts.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveText(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Tipo de texto</Label>
                            <Select
                              value={text.type}
                              defaultValue={text.type}
                              onValueChange={(value) => handleTextChange(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="title">Título principal</SelectItem>
                                <SelectItem value="subtitle">Subtítulo</SelectItem>
                                <SelectItem value="companyName">Nombre de empresa</SelectItem>
                                <SelectItem value="description">Descripción</SelectItem>
                                <SelectItem value="custom">Texto personalizado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Contenido</Label>
                            {text.type === "description" ? (
                              <Textarea
                                value={text.content}
                                onChange={(e) => handleTextChange(index, "content", e.target.value)}
                                rows={3}
                              />
                            ) : (
                              <Input
                                value={text.content}
                                onChange={(e) => handleTextChange(index, "content", e.target.value)}
                              />
                            )}
                          </div>

                          <div>
                            <Label>Clase CSS personalizada</Label>
                            <Input
                              value={text.customClass || ""}
                              onChange={(e) => handleTextChange(index, "customClass", e.target.value)}
                              placeholder="Ej: text-xl font-bold text-blue-500"
                            />
                          </div>

                          <div className="pt-2 border-t">
                            <Label className="mb-2 block">Posicionamiento</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Tipo de posición</Label>
                                <Select
                                  value={text.position || "relative"}
                                  defaultValue={text.position || "relative"}
                                  onValueChange={(value) => handleTextChange(index, "position", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo de posición" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="relative">Relativa</SelectItem>
                                    <SelectItem value="absolute">Absoluta</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {text.position === "absolute" && (
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <Label className="text-xs">Superior</Label>
                                  <Input
                                    value={text.top || ""}
                                    onChange={(e) => handleTextChange(index, "top", e.target.value)}
                                    placeholder="Ej: 10px, 2rem, 5%"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Izquierda</Label>
                                  <Input
                                    value={text.left || ""}
                                    onChange={(e) => handleTextChange(index, "left", e.target.value)}
                                    placeholder="Ej: 10px, 2rem, 5%"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Derecha</Label>
                                  <Input
                                    value={text.right || ""}
                                    onChange={(e) => handleTextChange(index, "right", e.target.value)}
                                    placeholder="Ej: 10px, 2rem, 5%"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Inferior</Label>
                                  <Input
                                    value={text.bottom || ""}
                                    onChange={(e) => handleTextChange(index, "bottom", e.target.value)}
                                    placeholder="Ej: 10px, 2rem, 5%"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t">
                            <Label className="mb-2 block">Estilo personalizado</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Color de texto</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={text.customStyle?.color || "#ffffff"}
                                    onChange={(e) => handleTextStyleChange(index, "color", e.target.value)}
                                    className="w-12 h-10 p-1"
                                  />
                                  <Input
                                    value={text.customStyle?.color || ""}
                                    onChange={(e) => handleTextStyleChange(index, "color", e.target.value)}
                                    placeholder="#ffffff o rgb(255,255,255)"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Tamaño de fuente</Label>
                                <Input
                                  value={text.customStyle?.fontSize || ""}
                                  onChange={(e) => handleTextStyleChange(index, "fontSize", e.target.value)}
                                  placeholder="Ej: 24px, 1.5rem"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`animation-enabled-${index}`}
                                checked={text.animation?.enabled || false}
                                onCheckedChange={(checked) => handleTextChange(index, "animation.enabled", checked)}
                              />
                              <Label htmlFor={`animation-enabled-${index}`}>Habilitar animación</Label>
                            </div>

                            {text.animation?.enabled && (
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <Label className="text-xs">Tipo</Label>
                                  <Select
                                    value={text.animation?.type || "fade-in"}
                                    defaultValue={text.animation?.type || "fade-in"}
                                    onValueChange={(value) => handleTextChange(index, "animation.type", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tipo de animación" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {animationTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs">Retraso (segundos)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={text.animation?.delay || 0}
                                    onChange={(e) =>
                                      handleTextChange(index, "animation.delay", Number.parseFloat(e.target.value))
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Botones */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Botones</CardTitle>
                      <Button size="sm" onClick={handleAddButton}>
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir botón
                      </Button>
                    </div>
                    <CardDescription>Gestiona los botones del hero</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {heroContent.buttons.map((button, index) => (
                      <Card key={button.id} className="p-4 border-l-4 border-l-secondary">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Botón {index + 1}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveButtonUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveButtonDown(index)}
                              disabled={index === heroContent.buttons.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveButton(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Texto</Label>
                            <Input
                              value={button.text}
                              onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>URL</Label>
                            <Input
                              value={button.url}
                              onChange={(e) => handleButtonChange(index, "url", e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Estilo</Label>
                              <Select
                                value={button.variant}
                                defaultValue={button.variant}
                                onValueChange={(value) => handleButtonChange(index, "variant", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Estilo del botón" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="primary">Primario</SelectItem>
                                  <SelectItem value="secondary">Secundario</SelectItem>
                                  <SelectItem value="accent">Acento</SelectItem>
                                  <SelectItem value="outline">Contorno</SelectItem>
                                  <SelectItem value="ghost">Fantasma</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Tamaño</Label>
                              <Select
                                value={button.size || "lg"}
                                defaultValue={button.size || "lg"}
                                onValueChange={(value) => handleButtonChange(index, "size", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Tamaño del botón" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sm">Pequeño</SelectItem>
                                  <SelectItem value="default">Normal</SelectItem>
                                  <SelectItem value="lg">Grande</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Clase CSS personalizada</Label>
                            <Input
                              value={button.customClass || ""}
                              onChange={(e) => handleButtonChange(index, "customClass", e.target.value)}
                              placeholder="Ej: rounded-full px-8"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Icono</Label>
                              <Select
                                value={button.icon || "none"}
                                defaultValue={button.icon || "none"}
                                onValueChange={(value) =>
                                  handleButtonChange(index, "icon", value === "none" ? "" : value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar icono" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Sin icono</SelectItem>
                                  {buttonIcons.map((icon) => (
                                    <SelectItem key={icon} value={icon}>
                                      {icon}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Posición del icono</Label>
                              <Select
                                value={button.position || "right"}
                                defaultValue={button.position || "right"}
                                onValueChange={(value) => handleButtonChange(index, "position", value)}
                                disabled={!button.icon}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Posición" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Izquierda</SelectItem>
                                  <SelectItem value="right">Derecha</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <Label className="mb-2 block">Animación</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Tipo</Label>
                                <Select
                                  value={button.animation?.type || "fade-in"}
                                  defaultValue={button.animation?.type || "fade-in"}
                                  onValueChange={(value) => handleButtonChange(index, "animation.type", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo de animación" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {animationTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs">Retraso (segundos)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.1"
                                  value={button.animation?.delay || 0}
                                  onChange={(e) =>
                                    handleButtonChange(index, "animation.delay", Number.parseFloat(e.target.value))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Diseño */}
            <TabsContent value="layout">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Diseño del Hero</CardTitle>
                    <CardDescription>Configura el layout y la altura</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Disposición del contenido</Label>
                      <Select
                        value={heroContent.layout}
                        defaultValue={heroContent.layout}
                        onValueChange={handleLayoutChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la disposición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="centered">Centrado</SelectItem>
                          <SelectItem value="left">Alineado a la izquierda</SelectItem>
                          <SelectItem value="right">Alineado a la derecha</SelectItem>
                          <SelectItem value="split">Dividido (texto/imagen)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Alineación del texto</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant={heroContent.textAlignment === "left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextAlignmentChange("left")}
                          className="flex-1"
                        >
                          <AlignLeft className="h-4 w-4 mr-2" />
                          Izquierda
                        </Button>
                        <Button
                          variant={heroContent.textAlignment === "center" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextAlignmentChange("center")}
                          className="flex-1"
                        >
                          <AlignCenter className="h-4 w-4 mr-2" />
                          Centro
                        </Button>
                        <Button
                          variant={heroContent.textAlignment === "right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTextAlignmentChange("right")}
                          className="flex-1"
                        >
                          <AlignRight className="h-4 w-4 mr-2" />
                          Derecha
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Posición vertical</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant={heroContent.verticalPosition === "top" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVerticalPositionChange("top")}
                          className="flex-1"
                        >
                          <PanelTop className="h-4 w-4 mr-2" />
                          Superior
                        </Button>
                        <Button
                          variant={heroContent.verticalPosition === "middle" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVerticalPositionChange("middle")}
                          className="flex-1"
                        >
                          <AlignJustify className="h-4 w-4 mr-2" />
                          Medio
                        </Button>
                        <Button
                          variant={heroContent.verticalPosition === "bottom" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVerticalPositionChange("bottom")}
                          className="flex-1"
                        >
                          <PanelBottom className="h-4 w-4 mr-2" />
                          Inferior
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Altura</Label>
                      <Select
                        value={heroContent.height}
                        defaultValue={heroContent.height}
                        onValueChange={handleHeightChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la altura" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Pantalla completa</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                          <SelectItem value="medium">Mediana</SelectItem>
                          <SelectItem value="small">Pequeña</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {heroContent.height === "custom" && (
                      <div>
                        <Label>Altura personalizada</Label>
                        <Input
                          value={heroContent.customHeight || ""}
                          onChange={(e) => setHeroContent((prev) => ({ ...prev, customHeight: e.target.value }))}
                          placeholder="Ej: 500px, 50vh, etc."
                        />
                      </div>
                    )}

                    <div>
                      <Label>Clase CSS personalizada</Label>
                      <Input
                        value={heroContent.customClass || ""}
                        onChange={(e) => handleCustomClassChange(e.target.value)}
                        placeholder="Ej: bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-scroll-button"
                        checked={heroContent.showScrollButton !== false}
                        onCheckedChange={handleScrollButtonChange}
                      />
                      <Label htmlFor="show-scroll-button">Mostrar botón de desplazamiento</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fondo</CardTitle>
                    <CardDescription>Configura el fondo del hero</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Tipo de fondo</Label>
                      <Select
                        value={heroContent.background.type}
                        defaultValue={heroContent.background.type}
                        onValueChange={(value) => handleBackgroundChange("type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de fondo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="color">Color sólido</SelectItem>
                          <SelectItem value="image">Imagen</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="gradient">Gradiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {heroContent.background.type === "color" && (
                      <div>
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={heroContent.background.value || "#000000"}
                            onChange={(e) => handleBackgroundChange("value", e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={heroContent.background.value || "#000000"}
                            onChange={(e) => handleBackgroundChange("value", e.target.value)}
                            placeholder="#000000 o rgb(0,0,0)"
                          />
                        </div>
                      </div>
                    )}

                    {heroContent.background.type === "gradient" && (
                      <div>
                        <Label>Gradiente</Label>
                        <Input
                          value={heroContent.background.value || "linear-gradient(to right, #4F46E5, #7C3AED)"}
                          onChange={(e) => handleBackgroundChange("value", e.target.value)}
                          placeholder="linear-gradient(to right, #4F46E5, #7C3AED)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Formato CSS: linear-gradient(dirección, color1, color2)
                        </p>
                      </div>
                    )}

                    {heroContent.background.type === "image" && (
                      <div className="space-y-4">
                        <div>
                          <Label>URL de la imagen</Label>
                          <div className="flex gap-2">
                            <Input
                              value={heroContent.background.value || ""}
                              onChange={(e) => handleBackgroundChange("value", e.target.value)}
                              placeholder="/ruta/a/imagen.jpg"
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCurrentMediaIndex(null)
                                setMediaType("image")
                                setIsMediaDialogOpen(true)
                              }}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Seleccionar
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="bg-overlay"
                              checked={heroContent.background.overlay || false}
                              onCheckedChange={(checked) => handleBackgroundChange("overlay", checked)}
                            />
                            <Label htmlFor="bg-overlay">Overlay oscuro</Label>
                          </div>

                          {heroContent.background.overlay && (
                            <div className="flex-1">
                              <Label>Opacidad del overlay (%)</Label>
                              <Slider
                                value={[heroContent.background.overlayOpacity || 50]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => handleBackgroundChange("overlayOpacity", value[0])}
                                className="py-4"
                              />
                            </div>
                          )}
                        </div>

                        {heroContent.background.value && (
                          <div className="mt-2">
                            <Label>Vista previa</Label>
                            <div className="mt-2 relative h-32 rounded-md overflow-hidden">
                              <img
                                src={heroContent.background.value || "/placeholder.svg"}
                                alt="Background preview"
                                className="w-full h-full object-cover"
                              />
                              {heroContent.background.overlay && (
                                <div
                                  className="absolute inset-0 bg-black"
                                  style={{ opacity: (heroContent.background.overlayOpacity || 50) / 100 }}
                                ></div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {heroContent.background.type === "video" && (
                      <div className="space-y-4">
                        <div>
                          <Label>URL del video</Label>
                          <div className="flex gap-2">
                            <Input
                              value={heroContent.background.value || ""}
                              onChange={(e) => handleBackgroundChange("value", e.target.value)}
                              placeholder="/ruta/a/video.mp4"
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCurrentMediaIndex(null)
                                setMediaType("video")
                                setIsMediaDialogOpen(true)
                              }}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Seleccionar
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="video-overlay"
                              checked={heroContent.background.overlay || false}
                              onCheckedChange={(checked) => handleBackgroundChange("overlay", checked)}
                            />
                            <Label htmlFor="video-overlay">Overlay oscuro</Label>
                          </div>

                          {heroContent.background.overlay && (
                            <div className="flex-1">
                              <Label>Opacidad del overlay (%)</Label>
                              <Slider
                                value={[heroContent.background.overlayOpacity || 50]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => handleBackgroundChange("overlayOpacity", value[0])}
                                className="py-4"
                              />
                            </div>
                          )}
                        </div>

                        {heroContent.background.value && heroContent.background.value.endsWith(".mp4") && (
                          <div className="mt-2">
                            <Label>Vista previa</Label>
                            <div className="mt-2 relative h-32 rounded-md overflow-hidden">
                              <video
                                src={heroContent.background.value}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                              ></video>
                              {heroContent.background.overlay && (
                                <div
                                  className="absolute inset-0 bg-black"
                                  style={{ opacity: (heroContent.background.overlayOpacity || 50) / 100 }}
                                ></div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pestaña de Carrusel */}
            <TabsContent value="carousel">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Carrusel</CardTitle>
                  <CardDescription>Configura el carrusel de imágenes para el hero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="carousel-enabled"
                      checked={heroContent.carousel?.enabled || false}
                      onCheckedChange={(checked) => handleCarouselChange("enabled", checked)}
                    />
                    <Label htmlFor="carousel-enabled">Habilitar carrusel</Label>
                  </div>

                  {heroContent.carousel?.enabled && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <Switch
                              id="carousel-autoplay"
                              checked={heroContent.carousel?.autoplay || false}
                              onCheckedChange={(checked) => handleCarouselChange("autoplay", checked)}
                            />
                            <Label htmlFor="carousel-autoplay">Reproducción automática</Label>
                          </div>

                          {heroContent.carousel?.autoplay && (
                            <div className="mb-4">
                              <Label>Intervalo (segundos)</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[heroContent.carousel?.interval || 5]}
                                  min={1}
                                  max={10}
                                  step={1}
                                  onValueChange={(value) => handleCarouselChange("interval", value[0])}
                                  className="flex-1"
                                />
                                <span className="w-8 text-center">{heroContent.carousel?.interval || 5}s</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 mb-4">
                            <Switch
                              id="carousel-controls"
                              checked={heroContent.carousel?.showControls || false}
                              onCheckedChange={(checked) => handleCarouselChange("showControls", checked)}
                            />
                            <Label htmlFor="carousel-controls">Mostrar controles</Label>
                          </div>

                          <div className="flex items-center space-x-2 mb-4">
                            <Switch
                              id="carousel-indicators"
                              checked={heroContent.carousel?.showIndicators || false}
                              onCheckedChange={(checked) => handleCarouselChange("showIndicators", checked)}
                            />
                            <Label htmlFor="carousel-indicators">Mostrar indicadores</Label>
                          </div>

                          <div className="mb-4">
                            <Label>Efecto de transición</Label>
                            <Select
                              value={heroContent.carousel?.effect || "fade"}
                              defaultValue={heroContent.carousel?.effect || "fade"}
                              onValueChange={(value) => handleCarouselChange("effect", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el efecto" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fade">Desvanecer</SelectItem>
                                <SelectItem value="slide">Deslizar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                            <h3 className="font-medium mb-2">Información sobre el carrusel</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              El carrusel te permite mostrar múltiples imágenes en el hero que se alternan
                              automáticamente.
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Cuando el carrusel está habilitado, se usará en lugar de la imagen de fondo estática.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-lg">Imágenes del carrusel</h3>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddCarouselMedia("image")}>
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Añadir imagen
                            </Button>
                            <Button size="sm" onClick={() => handleAddCarouselMedia("video")}>
                              <Video className="h-4 w-4 mr-2" />
                              Añadir video
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {heroContent.carousel?.images.map((image, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 h-40 relative">
                                  {image.type === "video" ? (
                                    <video
                                      src={image.url}
                                      className="w-full h-full object-cover"
                                      autoPlay
                                      muted
                                      loop
                                    ></video>
                                  ) : (
                                    <img
                                      src={image.url || "/placeholder.svg"}
                                      alt={image.alt || `Slide ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  {image.overlay && (
                                    <div
                                      className="absolute inset-0 bg-black"
                                      style={{ opacity: (image.overlayOpacity || 50) / 100 }}
                                    ></div>
                                  )}
                                </div>
                                <div className="w-full md:w-2/3 p-4">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">
                                      {image.type === "video" ? "Video" : "Imagen"} {index + 1}
                                    </h4>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoveCarouselImageUp(index)}
                                        disabled={index === 0}
                                      >
                                        <MoveUp className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoveCarouselImageDown(index)}
                                        disabled={index === (heroContent.carousel?.images.length || 0) - 1}
                                      >
                                        <MoveDown className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveCarouselImage(index)}
                                        disabled={(heroContent.carousel?.images.length || 0) <= 1}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label>URL del medio</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          value={image.url || ""}
                                          onChange={(e) => handleCarouselImageChange(index, "url", e.target.value)}
                                          placeholder={`/ruta/a/${image.type === "image" ? "imagen.jpg" : "video.mp4"}`}
                                          className="flex-1"
                                        />
                                        <Button variant="outline" onClick={() => handleOpenCarouselImageDialog(index)}>
                                          {image.type === "image" ? (
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                          ) : (
                                            <Video className="h-4 w-4 mr-2" />
                                          )}
                                          Seleccionar
                                        </Button>
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Texto alternativo</Label>
                                      <Input
                                        value={image.alt || ""}
                                        onChange={(e) => handleCarouselImageChange(index, "alt", e.target.value)}
                                        placeholder="Descripción del medio"
                                      />
                                    </div>

                                    <div>
                                      <Label>Tipo de medio</Label>
                                      <Select
                                        value={image.type || "image"}
                                        defaultValue={image.type || "image"}
                                        onValueChange={(value) => handleCarouselImageChange(index, "type", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona el tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="image">Imagen</SelectItem>
                                          <SelectItem value="video">Video</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`carousel-overlay-${index}`}
                                          checked={image.overlay || false}
                                          onCheckedChange={(checked) =>
                                            handleCarouselImageChange(index, "overlay", checked)
                                          }
                                        />
                                        <Label htmlFor={`carousel-overlay-${index}`}>Overlay oscuro</Label>
                                      </div>

                                      {image.overlay && (
                                        <div className="flex-1">
                                          <Label>Opacidad del overlay (%)</Label>
                                          <Slider
                                            value={[image.overlayOpacity || 50]}
                                            min={0}
                                            max={100}
                                            step={5}
                                            onValueChange={(value) =>
                                              handleCarouselImageChange(index, "overlayOpacity", value[0])
                                            }
                                            className="py-4"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Medios */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Medios adicionales</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAddMedia("image")}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Añadir imagen
                      </Button>
                      <Button size="sm" onClick={() => handleAddMedia("video")}>
                        <Video className="h-4 w-4 mr-2" />
                        Añadir video
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Gestiona imágenes y videos adicionales para el hero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {heroContent.media.length > 0 ? (
                    heroContent.media.map((media, index) => (
                      <Card
                        key={media.id}
                        className={`p-4 border-l-4 ${media.type === "image" ? "border-l-blue-500" : "border-l-purple-500"}`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium flex items-center">
                            {media.type === "image" ? (
                              <>
                                <ImageIcon className="h-4 w-4 mr-2 text-blue-500" /> Imagen {index + 1}
                              </>
                            ) : (
                              <>
                                <Video className="h-4 w-4 mr-2 text-purple-500" /> Video {index + 1}
                              </>
                            )}
                          </h3>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveMedia(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>URL del {media.type === "image" ? "imagen" : "video"}</Label>
                            <div className="flex gap-2">
                              <Input
                                value={media.url}
                                onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                                placeholder={`/ruta/a/${media.type === "image" ? "imagen.jpg" : "video.mp4"}`}
                                className="flex-1"
                              />
                              <Button variant="outline" onClick={() => handleOpenMediaDialog(index, media.type)}>
                                {media.type === "image" ? (
                                  <>
                                    <ImageIcon className="h-4 w-4 mr-2" /> Seleccionar
                                  </>
                                ) : (
                                  <>
                                    <Video className="h-4 w-4 mr-2" /> Seleccionar
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {media.type === "image" && (
                            <div>
                              <Label>Texto alternativo</Label>
                              <Input
                                value={media.alt || ""}
                                onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
                                placeholder="Descripción de la imagen"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`media-overlay-${index}`}
                                checked={media.overlay || false}
                                onCheckedChange={(checked) => handleMediaChange(index, "overlay", checked)}
                              />
                              <Label htmlFor={`media-overlay-${index}`}>Overlay oscuro</Label>
                            </div>

                            {media.overlay && (
                              <div className="flex-1">
                                <Label>Opacidad del overlay (%)</Label>
                                <Slider
                                  value={[media.overlayOpacity || 50]}
                                  min={0}
                                  max={100}
                                  step={5}
                                  onValueChange={(value) => handleMediaChange(index, "overlayOpacity", value[0])}
                                  className="py-4"
                                />
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t">
                            <Label className="mb-2 block">Animación</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Tipo</Label>
                                <Select
                                  value={media.animation?.type || "fade-in"}
                                  defaultValue={media.animation?.type || "fade-in"}
                                  onValueChange={(value) => handleMediaChange(index, "animation.type", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo de animación" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {animationTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs">Retraso (segundos)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.1"
                                  value={media.animation?.delay || 0}
                                  onChange={(e) =>
                                    handleMediaChange(index, "animation.delay", Number.parseFloat(e.target.value))
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {media.url && (
                            <div className="mt-2">
                              <Label>Vista previa</Label>
                              <div className="mt-2 relative h-32 rounded-md overflow-hidden">
                                {media.type === "image" ? (
                                  <img
                                    src={media.url || "/placeholder.svg"}
                                    alt={media.alt || "Media preview"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={media.url}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                  ></video>
                                )}
                                {media.overlay && (
                                  <div
                                    className="absolute inset-0 bg-black"
                                    style={{ opacity: (media.overlayOpacity || 50) / 100 }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay medios adicionales. Añade imágenes o videos para enriquecer tu hero.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Animaciones */}
            <TabsContent value="animations">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de animaciones</CardTitle>
                  <CardDescription>Personaliza las animaciones del hero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="animations-enabled"
                      checked={heroContent.animations.enabled}
                      onCheckedChange={(checked) => handleAnimationChange("enabled", checked)}
                    />
                    <Label htmlFor="animations-enabled">Habilitar animaciones</Label>
                  </div>

                  {heroContent.animations.enabled && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="animations-scroll"
                          checked={heroContent.animations.scroll}
                          onCheckedChange={(checked) => handleAnimationChange("scroll", checked)}
                        />
                        <Label htmlFor="animations-scroll">Animaciones al hacer scroll</Label>
                      </div>

                      <div>
                        <Label>Preset de animaciones</Label>
                        <Select
                          value={heroContent.animations.presets}
                          defaultValue={heroContent.animations.presets}
                          onValueChange={(value) => handleAnimationChange("presets", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un preset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Por defecto</SelectItem>
                            <SelectItem value="subtle">Sutil</SelectItem>
                            <SelectItem value="dramatic">Dramático</SelectItem>
                            <SelectItem value="staggered">Escalonado</SelectItem>
                            <SelectItem value="parallax">Parallax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Información sobre animaciones</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Cada elemento del hero puede tener su propia animación configurada individualmente.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          El preset seleccionado aplicará un conjunto de animaciones predefinidas a todos los elementos,
                          pero puedes personalizar cada uno en sus respectivas secciones.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Vista Previa */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Vista previa del Hero</CardTitle>
                  <CardDescription>Así se verá tu hero con los cambios realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={getPreviewClasses()} ref={previewRef} style={getBackgroundStyles()}>
                    {/* Fondo o Carrusel */}
                    {heroContent.carousel?.enabled ? (
                      <div className="absolute inset-0 z-0">
                        {/* Vista previa del carrusel */}
                        <div className="relative w-full h-full">
                          {(heroContent.carousel?.images || []).map((image, index) => (
                            <div
                              key={index}
                              className="absolute inset-0 transition-opacity duration-500"
                              style={{ opacity: index === 0 ? 1 : 0 }}
                            >
                              {image.type === "video" ? (
                                <video
                                  src={image.url}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                ></video>
                              ) : (
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.alt || `Slide ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {image.overlay && (
                                <div
                                  className="absolute inset-0 bg-black"
                                  style={{ opacity: (image.overlayOpacity || 50) / 100 }}
                                ></div>
                              )}
                            </div>
                          ))}

                          {/* Controles del carrusel */}
                          {heroContent.carousel?.showControls && (
                            <>
                              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                                <ChevronLeft size={16} />
                              </button>
                              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                                <ChevronRight size={16} />
                              </button>
                            </>
                          )}

                          {/* Indicadores del carrusel */}
                          {heroContent.carousel?.showIndicators && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                              {(heroContent.carousel?.images || []).map((_, index) => (
                                <button
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/50"}`}
                                  aria-label={`Go to slide ${index + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Fondo estático */}
                        {heroContent.background.type === "image" && (
                          <div className="absolute inset-0 z-0">
                            <img
                              src={heroContent.background.value || "/hero-background.jpg"}
                              alt="Background"
                              className="w-full h-full object-cover"
                            />
                            {heroContent.background.overlay && (
                              <div
                                className="absolute inset-0 bg-black"
                                style={{ opacity: (heroContent.background.overlayOpacity || 50) / 100 }}
                              ></div>
                            )}
                          </div>
                        )}

                        {heroContent.background.type === "video" && (
                          <div className="absolute inset-0 z-0">
                            <video
                              src={heroContent.background.value || "/hero-video-background.mp4"}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                            ></video>
                            {heroContent.background.overlay && (
                              <div
                                className="absolute inset-0 bg-black"
                                style={{ opacity: (heroContent.background.overlayOpacity || 50) / 100 }}
                              ></div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Contenido */}
                    <div
                      className={`relative z-10 h-full flex items-center ${
                        heroContent.layout === "centered"
                          ? "justify-center text-center"
                          : heroContent.layout === "left"
                            ? "justify-start text-left pl-8"
                            : heroContent.layout === "right"
                              ? "justify-end text-right pr-8"
                              : "justify-between"
                      }`}
                    >
                      <div className={`${heroContent.layout === "split" ? "w-1/2 pl-8" : "w-full px-4"}`}>
                        <div className="space-y-4">
                          {heroContent.texts.map((text) => {
                            if (text.type === "title") {
                              return (
                                <h1 key={text.id} className="text-2xl md:text-3xl font-bold text-white">
                                  {text.content}
                                </h1>
                              )
                            }

                            if (text.type === "subtitle") {
                              return (
                                <h2 key={text.id} className="text-xl md:text-2xl font-semibold text-gray-200">
                                  {text.content}
                                </h2>
                              )
                            }

                            if (text.type === "companyName") {
                              return (
                                <p key={text.id} className="text-lg md:text-xl font-medium text-primary">
                                  {text.content}
                                </p>
                              )
                            }

                            if (text.type === "description") {
                              return (
                                <p key={text.id} className="text-base md:text-lg text-gray-300">
                                  {text.content}
                                </p>
                              )
                            }

                            return (
                              <p key={text.id} className={text.customClass || "text-base text-white"}>
                                {text.content}
                              </p>
                            )
                          })}

                          <div className="flex items-center justify-center space-x-4">
                            {heroContent.buttons.map((button) => (
                              <Button
                                key={button.id}
                                variant={
                                  button.variant as
                                    | "default"
                                    | "destructive"
                                    | "outline"
                                    | "secondary"
                                    | "ghost"
                                    | "link"
                                }
                                size={button.size as "default" | "sm" | "lg" | "icon"}
                              >
                                {button.text}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
            <DialogContent className="sm:max-w-[925px]">
              <DialogHeader>
                <DialogTitle>Seleccionar {mediaType === "image" ? "imagen" : "video"}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="library" className="mt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="library">Biblioteca</TabsTrigger>
                  <TabsTrigger value="upload">Subir nuevo</TabsTrigger>
                </TabsList>
                <TabsContent value="library">
                  <ImageLibrary onSelectImage={handleSelectImage} showSelect={true} />
                </TabsContent>
                <TabsContent value="upload">
                  <MediaUpload
                    type={mediaType}
                    onUploadComplete={(media) => {
                      if (currentMediaIndex !== null) {
                        const updatedMedia = [...heroContent.media]
                        updatedMedia[currentMediaIndex].url = media.url
                        if (mediaType === "image") {
                          updatedMedia[currentMediaIndex].alt = media.id
                        }

                        setHeroContent((prev) => ({
                          ...prev,
                          media: updatedMedia,
                        }))
                      } else {
                        // Si estamos subiendo para el fondo
                        setHeroContent((prev) => ({
                          ...prev,
                          background: {
                            ...prev.background,
                            value: media.url,
                          },
                        }))
                      }
                      setIsMediaDialogOpen(false)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog open={isCarouselImageDialog} onOpenChange={setIsCarouselImageDialog}>
            <DialogContent className="sm:max-w-[925px]">
              <DialogHeader>
                <DialogTitle>
                  Seleccionar {currentCarouselMediaType === "image" ? "imagen" : "video"} para el carrusel
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="library" className="mt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="library">Biblioteca</TabsTrigger>
                  <TabsTrigger value="upload">Subir nuevo</TabsTrigger>
                </TabsList>
                <TabsContent value="library">
                  <ImageLibrary onSelectImage={handleSelectCarouselImage} showSelect={true} />
                </TabsContent>
                <TabsContent value="upload">
                  <MediaUpload
                    type={currentCarouselMediaType}
                    onUploadComplete={(media) => {
                      if (currentCarouselIndex !== null) {
                        const updatedImages = [...(heroContent.carousel?.images || [])]
                        updatedImages[currentCarouselIndex] = {
                          ...updatedImages[currentCarouselIndex],
                          url: media.url,
                          alt: media.id,
                        }

                        setHeroContent((prev) => ({
                          ...prev,
                          carousel: {
                            ...prev.carousel!,
                            images: updatedImages,
                          },
                        }))
                      }
                      setIsCarouselImageDialog(false)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <>
                  Guardando...
                  <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
