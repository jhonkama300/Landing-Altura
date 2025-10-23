"use client"

import { useState, useEffect, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, FolderOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import CarouselImageCard from "@/components/carousel-image-card" // Import CarouselImageCard

type GalleryImage = {
  id: string
  src: string
  title: string
  alt: string
  description?: string
  tags?: string[]
  type: "image" | "video"
  thumbnail_src?: string
}

type GalleryCategory = {
  slug: string
  name: string
}

type GalleryData = Record<string, GalleryImage[]>

export function Gallery() {
  // States
  const [galleryData, setGalleryData] = useState<GalleryData>({})
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<(GalleryImage & { categorySlug?: string; index?: number }) | null>(
    null,
  )
  const [activeTab, setActiveTab] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFullGalleryModal, setShowFullGalleryModal] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set()) // Cambiado a Set<string> para usar image.id

  // Refs
  const tabsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/galery/filesystem")
        if (!response.ok) throw new Error("Error al cargar la galería")

        const data = await response.json()
        setGalleryData(data.galleryData || {})
        setCategories(data.categories || [])

        if (data.categories.length > 0) {
          setActiveTab(data.categories[0].slug)
        } else {
          setActiveTab("todos")
        }
      } catch (err: any) {
        console.error("Error al cargar la galería:", err)
        setError(err.message || "No se pudieron cargar las imágenes de la galería.")
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Derived state
  const allImages = Object.entries(galleryData).flatMap(([categorySlug, images]) =>
    images.map((img) => ({ ...img, categorySlug: categorySlug })),
  )

  // Effects
  useEffect(() => {
    if (searchInputRef.current && showFullGalleryModal) {
      searchInputRef.current.focus()
    }
  }, [showFullGalleryModal])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          handlePrevImage()
          break
        case "ArrowRight":
          e.preventDefault()
          handleNextImage()
          break
        case "Escape":
          e.preventDefault()
          setSelectedImage(null)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, galleryData]) // Dependencia de galleryData para asegurar que las imágenes estén actualizadas

  // Image navigation in modal
  const handlePrevImage = () => {
    if (!selectedImage?.categorySlug || selectedImage.index === undefined) return

    const images = galleryData[selectedImage.categorySlug] || []
    const prevIndex = (selectedImage.index - 1 + images.length) % images.length

    setSelectedImage({
      ...images[prevIndex],
      categorySlug: selectedImage.categorySlug,
      index: prevIndex,
    })
  }

  const handleNextImage = () => {
    if (!selectedImage?.categorySlug || selectedImage.index === undefined) return

    const images = galleryData[selectedImage.categorySlug] || []
    const nextIndex = (selectedImage.index + 1) % images.length

    setSelectedImage({
      ...images[nextIndex],
      categorySlug: selectedImage.categorySlug,
      index: nextIndex,
    })
  }

  // Utility functions
  const handleImageClick = (image: GalleryImage, categorySlug: string, index: number) => {
    setSelectedImage({ ...image, categorySlug, index })
  }

  const toggleFavorite = (imageId: string) => {
    // Cambiado a string para usar image.id
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId)
      } else {
        newFavorites.add(imageId)
      }
      return newFavorites
    })
  }

  // Filtering logic
  const getFilteredImages = (categorySlug: string) => {
    const images = categorySlug === "todos" ? allImages : galleryData[categorySlug] || []

    if (!searchQuery.trim()) return images

    return images.filter(
      (img) =>
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const currentImages = getFilteredImages(activeTab) // Usar la función de filtrado

  if (loading) {
    return (
      <section
        id="gallery"
        className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Cargando galería...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="gallery"
        className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Recargar
          </Button>
        </div>
      </section>
    )
  }

  const availableCategories = categories // Usar el estado de categorías

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <FolderOpen className="h-10 w-10 text-primary" />
            <h2 className="text-4xl sm:text-5xl md:text-4xl font-bold relative inline-block">
              Galería de Imágenes
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto"
          >
            Explora nuestras instalaciones, programas de formación y equipos especializados para trabajo seguro en
            altura
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <Badge variant="secondary" className="text-sm">
              <FolderOpen className="h-3 w-3 mr-1" />
              Las imágenes se cargan automáticamente desde las carpetas
            </Badge>
          </motion.div>
        </div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Category tabs */}
            <div className="relative mb-8 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
              <div ref={tabsRef} className="overflow-x-auto py-2 px-4 scrollbar-hide">
                <TabsList className="flex flex-row gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <TabsTrigger
                    value="todos"
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap px-6 py-2 font-medium transition-all"
                  >
                    Todos
                  </TabsTrigger>
                  {availableCategories.map((category) => (
                    <TabsTrigger
                      key={category.slug}
                      value={category.slug}
                      className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white capitalize whitespace-nowrap px-6 py-2 font-medium transition-all"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category title */}
                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold capitalize mb-2">
                    {activeTab === "todos"
                      ? "Todas las imágenes"
                      : categories.find((cat) => cat.slug === activeTab)?.name || "Galería"}
                  </h3>
                  <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                {currentImages.length > 0 ? (
                  <div className="mb-8">
                    <Carousel
                      plugins={[plugin.current]}
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-full"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {currentImages.map((image, index) => (
                          <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                            <CarouselImageCard
                              image={image}
                              index={index}
                              categorySlug={activeTab}
                              isFavorite={favorites.has(image.id)}
                              onClick={() => handleImageClick(image, activeTab, index)}
                              onToggleFavorite={() => toggleFavorite(image.id)}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                    </Carousel>

                    {currentImages.length > 3 && (
                      <div className="text-center mt-6">
                        <Badge variant="secondary" className="text-sm">
                          {currentImages.length} {currentImages.length === 1 ? "imagen" : "imágenes"} en esta categoría
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpen className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      No hay imágenes en esta categoría
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      Crea una carpeta con el nombre de la categoría en{" "}
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        public/gallery/
                        <span className="text-gray-400">/</span>
                        {activeTab}
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400">images</span>
                      </code>
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
