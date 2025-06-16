"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImageIcon,
  Search,
  Maximize2,
  Heart,
  Share2,
  Loader2,
  AlertTriangle,
  Video,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getGalleryData, getAllCategories, type GalleryData } from "@/lib/gallery" // Importar getAllCategories
import type { GalleryImage, GalleryCategory } from "@/lib/database" // Importar tipos de lib/database

export function Gallery() {
  // States
  const [galleryData, setGalleryData] = useState<GalleryData>({})
  const [categories, setCategories] = useState<GalleryCategory[]>([]) // Nuevo estado para las categorías
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<(GalleryImage & { categorySlug?: string; index?: number }) | null>(
    null,
  )
  const [activeTab, setActiveTab] = useState("todos") // "todos" para mostrar todas las imágenes
  const [searchQuery, setSearchQuery] = useState("")
  const [showFullGalleryModal, setShowFullGalleryModal] = useState(false)
  const [favorites, setFavorites] = new useState<Set<number>>(new Set())

  // Refs
  const tabsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedCategories = await getAllCategories()
        setCategories(fetchedCategories)

        const data = await getGalleryData()
        setGalleryData(data)

        // Establecer la primera categoría como activa si no hay ninguna seleccionada
        if (fetchedCategories.length > 0) {
          setActiveTab(fetchedCategories[0].slug)
        } else {
          setActiveTab("todos") // Si no hay categorías, mantener "todos"
        }
      } catch (err: any) {
        console.error("Error al cargar la galería:", err)
        setError(err.message || "No se pudieron cargar las imágenes de la galería. Inténtalo de nuevo más tarde.")
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

  const toggleFavorite = (imageId: number) => {
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
  const previewImages = currentImages.slice(0, 3) // Solo mostrar 3 imágenes como preview

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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-4xl font-bold mb-4 relative inline-block"
          >
            Galería de Imágenes
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto"
          >
            Explora nuestras instalaciones, programas de formación y equipos especializados para trabajo seguro en
            altura
          </motion.p>
        </div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

                {/* Preview Images Grid */}
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {previewImages.map((image, index) => (
                      <PreviewImageCard
                        key={image.id}
                        image={image}
                        index={index}
                        categorySlug={activeTab} // Pasar el slug de la categoría
                        isFavorite={favorites.has(image.id)}
                        onClick={() => handleImageClick(image, activeTab, index)}
                        onToggleFavorite={() => toggleFavorite(image.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      No hay imágenes en esta categoría
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">Añade imágenes desde el panel de administración.</p>
                  </div>
                )}

                {/* Show more button if there are more images */}
                {currentImages.length > 3 && (
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-4">
                      {currentImages.length - 3} imágenes más en esta categoría
                    </Badge>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* View full gallery button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Button
            onClick={() => setShowFullGalleryModal(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Maximize2 className="h-5 w-5 mr-2" />
            Ver galería completa
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>

        {/* Image Modal */}
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          isFavorite={selectedImage ? favorites.has(selectedImage.id) : false}
          onToggleFavorite={selectedImage ? () => toggleFavorite(selectedImage.id) : undefined}
        />

        {/* Full Gallery Modal */}
        <FullGalleryModal
          isOpen={showFullGalleryModal}
          onClose={() => setShowFullGalleryModal(false)}
          galleryData={galleryData}
          categories={categories} // Pasar las categorías al modal completo
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onImageClick={handleImageClick}
        />
      </div>
    </section>
  )
}

// Preview Image Card Component
function PreviewImageCard({
  image,
  index,
  categorySlug, // Cambiado a categorySlug
  isFavorite,
  onClick,
  onToggleFavorite,
}: {
  image: GalleryImage
  index: number
  categorySlug: string // Cambiado a categorySlug
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden shadow-lg h-full flex flex-col group cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-square" onClick={onClick}>
          {image.type === "image" ? (
            <img
              src={image.src || "/placeholder.svg"} // Fallback para src
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <video
              src={image.src}
              poster={image.thumbnail_src || "/placeholder.svg"} // Use thumbnail for poster
              controls={false} // No controls in preview
              muted // Mute in preview
              loop // Loop in preview
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Click para ampliar</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite()
                  }}
                  className={cn("text-white hover:bg-white/20 transition-colors p-1", isFavorite && "text-red-400")}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </Button>
              </div>
            </div>
          </div>

          {/* Type indicator */}
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {image.type === "video" && <Video className="h-3 w-3" />}
            {image.type === "image" && <ImageIcon className="h-3 w-3" />}
            {image.type === "video" ? "Video" : "Imagen"}
          </div>
        </div>

        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
          {image.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{image.description}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-auto">
            {image.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Image Modal Component
function ImageModal({
  image,
  onClose,
  onPrev,
  onNext,
  isFavorite,
  onToggleFavorite,
}: {
  image: (GalleryImage & { categorySlug?: string; index?: number }) | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isFavorite: boolean
  onToggleFavorite?: () => void
}) {
  if (!image) return null

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] md:max-w-[900px] lg:max-w-6xl p-0 bg-transparent border-none">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full bg-black/70 text-white z-50 hover:bg-black/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white z-50 hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white z-50 hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Action buttons */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-2 z-50">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={cn(
                  "rounded-full bg-black/70 text-white hover:bg-black/80 transition-colors",
                  isFavorite && "text-red-400",
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: image.title,
                    text: image.description,
                    url: image.src,
                  })
                }
              }}
              className="rounded-full bg-black/70 text-white hover:bg-black/80 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Image container */}
          <div className="relative w-full h-[75vh] sm:h-[85vh] bg-black rounded-lg overflow-hidden">
            {image.type === "image" ? (
              <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-contain" />
            ) : (
              <video
                src={image.src}
                poster={image.thumbnail_src || "/placeholder.svg"} // Use thumbnail for poster
                controls
                className="w-full h-full object-contain"
              />
            )}
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6 text-white">
              <div className="max-w-4xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{image.title}</h3>
                {image.description && <p className="text-sm sm:text-base text-gray-200 mb-3">{image.description}</p>}
                {image.tags && (
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Full Gallery Modal Component
function FullGalleryModal({
  isOpen,
  onClose,
  galleryData,
  categories, // Recibir categorías
  searchQuery,
  onSearchChange,
  favorites,
  onToggleFavorite,
  onImageClick,
}: {
  isOpen: boolean
  onClose: () => void
  galleryData: Record<string, GalleryImage[]>
  categories: GalleryCategory[] // Tipo para categorías
  searchQuery: string
  onSearchChange: (query: string) => void
  favorites: Set<number>
  onToggleFavorite: (id: number) => void
  onImageClick: (image: GalleryImage, categorySlug: string, index: number) => void // Cambiado a categorySlug
}) {
  const [activeTab, setActiveTab] = useState("todos")

  const allImages = Object.entries(galleryData).flatMap(([categorySlug, images]) =>
    images.map((img) => ({ ...img, categorySlug })),
  )

  const getFilteredImages = () => {
    const images =
      activeTab === "todos"
        ? allImages
        : galleryData[activeTab]?.map((img) => ({ ...img, categorySlug: activeTab })) || []

    if (!searchQuery.trim()) return images

    return images.filter(
      (img) =>
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const filteredImages = getFilteredImages()

  const availableCategories = categories // Usar el estado de categorías

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-7xl sm:h-[90vh] p-0 bg-white dark:bg-gray-900 rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Galería Completa</h2>
            <Badge variant="secondary">
              {filteredImages.length} {filteredImages.length === 1 ? "imagen" : "imágenes"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Tabs */}
            <div className="p-4 pb-0 sm:p-6 sm:pb-0">
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                <div className="overflow-x-auto py-2 px-4 scrollbar-hide">
                  <TabsList className="flex flex-row gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <TabsTrigger
                      value="todos"
                      className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap px-4"
                    >
                      Todos
                    </TabsTrigger>
                    {availableCategories.map((category) => (
                      <TabsTrigger
                        key={category.slug}
                        value={category.slug}
                        className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white capitalize whitespace-nowrap px-4"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
              </div>
            </div>

            {/* Images grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {filteredImages.map((image, index) => (
                        <motion.div
                          key={`${image.category_id}-${image.id}`} // Usar category_id y id para la clave
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="group cursor-pointer"
                          onClick={() => onImageClick(image, image.categorySlug || "todos", index)} // Pasar categorySlug
                        >
                          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="relative aspect-square">
                              {image.type === "image" ? (
                                <img
                                  src={image.src || "/placeholder.svg"}
                                  alt={image.alt}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <video
                                  src={image.src}
                                  poster={image.thumbnail_src || "/placeholder.svg"} // Use thumbnail for poster
                                  controls={false} // No controls in preview
                                  muted // Mute in preview
                                  loop // Loop in preview
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center p-4">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{image.title}</h4>
                                  <div className="flex items-center justify-center gap-2 text-xs">
                                    <span>Ver</span>
                                    <Maximize2 className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>

                              {/* Type indicator */}
                              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                {image.type === "video" && <Video className="h-3 w-3" />}
                                {image.type === "image" && <ImageIcon className="h-3 w-3" />}
                                {image.type === "video" ? "Video" : "Imagen"}
                              </div>

                              {/* Favorite button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleFavorite(image.id)
                                }}
                                className={cn(
                                  "absolute top-2 right-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/70",
                                  favorites.has(image.id) && "text-red-400 opacity-100",
                                )}
                              >
                                <Heart className={cn("h-3 w-3", favorites.has(image.id) && "fill-current")} />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        No se encontraron imágenes
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        {searchQuery ? "Intenta con otros términos de búsqueda" : "No hay imágenes en esta categoría"}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
