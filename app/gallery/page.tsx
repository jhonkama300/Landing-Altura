"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Search, ArrowLeft, SlidersHorizontal, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getGalleryData, type GalleryImage } from "@/lib/gallery"

// Tipos para los filtros
type SortOption = "newest" | "oldest" | "az" | "za"
type FilterOptions = {
  sortBy: SortOption
  showWithDescription: boolean
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt: string
    title: string
    description?: string
    category?: string
    index?: number
  } | null>(null)

  const [activeTab, setActiveTab] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [galleryData, setGalleryData] = useState<{ [category: string]: GalleryImage[] }>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [allImages, setAllImages] = useState<(GalleryImage & { category: string })[]>([])
  const tabsRef = useRef<HTMLDivElement>(null)

  // Estado para los filtros
  const [showFilters, setShowFilters] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: "newest",
    showWithDescription: false,
  })

  // Función para desplazar a la pestaña activa
  const scrollToActiveTab = () => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector('[data-state="active"]')
      if (activeTabElement) {
        const containerWidth = tabsRef.current.offsetWidth
        const tabWidth = activeTabElement.clientWidth
        const tabLeft = (activeTabElement as HTMLElement).offsetLeft
        const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2

        tabsRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }

  useEffect(() => {
    // Cargar datos de la galería desde localStorage
    const data = getGalleryData()
    setGalleryData(data)

    // Combinar todas las imágenes para la vista "todos"
    const combined: (GalleryImage & { category: string })[] = []
    Object.keys(data).forEach((category) => {
      data[category].forEach((img) => {
        combined.push({
          ...img,
          category,
        })
      })
    })

    setAllImages(combined)
    setIsLoaded(true)
  }, [])

  // Desplazar a la pestaña activa cuando cambia
  useEffect(() => {
    scrollToActiveTab()
  }, [activeTab])

  // Filtrar imágenes según la búsqueda
  const filteredImages = allImages.filter(
    (img) =>
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Aplicar filtros adicionales a las imágenes
  const applyFilters = (images: (GalleryImage & { category: string })[]) => {
    let result = [...images]

    // Filtrar por descripción si está activado
    if (filterOptions.showWithDescription) {
      result = result.filter((img) => img.description && img.description.trim() !== "")
    }

    // Ordenar según la opción seleccionada
    switch (filterOptions.sortBy) {
      case "newest":
        result.sort((a, b) => b.id - a.id) // Asumiendo que ID más alto = más reciente
        break
      case "oldest":
        result.sort((a, b) => a.id - b.id)
        break
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return result
  }

  // Obtener las imágenes a mostrar según la pestaña activa y aplicar filtros
  const getImagesToShow = () => {
    let imagesToFilter

    if (activeTab === "todos") {
      imagesToFilter = searchTerm ? filteredImages : allImages
    } else {
      const categoryImages =
        galleryData[activeTab]?.map((img) => ({
          ...img,
          category: activeTab,
        })) || []

      imagesToFilter = searchTerm
        ? categoryImages.filter(
            (img) =>
              img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())),
          )
        : categoryImages
    }

    return applyFilters(imagesToFilter)
  }

  const handleImageClick = (image: any, index: number) => {
    setSelectedImage({
      ...image,
      index,
    })
  }

  const handlePrevImage = () => {
    if (!selectedImage || selectedImage.index === undefined) return

    const images = getImagesToShow()
    const prevIndex = (selectedImage.index - 1 + images.length) % images.length
    const prevImage = images[prevIndex]

    setSelectedImage({
      ...prevImage,
      index: prevIndex,
    })
  }

  const handleNextImage = () => {
    if (!selectedImage || selectedImage.index === undefined) return

    const images = getImagesToShow()
    const nextIndex = (selectedImage.index + 1) % images.length
    const nextImage = images[nextIndex]

    setSelectedImage({
      ...nextImage,
      index: nextIndex,
    })
  }

  // Función para actualizar las opciones de filtro
  const updateFilterOption = (key: keyof FilterOptions, value: any) => {
    setFilterOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Si no hay datos o no se ha cargado aún, mostrar un estado de carga
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">Cargando galería...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const imagesToShow = getImagesToShow()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Link href="/#gallery">
                <Button variant="ghost" className="mb-4 -ml-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Galería Completa</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Explora todas nuestras instalaciones, actividades y equipos
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar imágenes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                className={`gap-2 ${showFilters ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {(filterOptions.showWithDescription || filterOptions.sortBy !== "newest") && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </div>
          </div>

          {/* Panel de filtros */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="font-medium mb-3">Ordenar por</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={filterOptions.sortBy === "newest" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilterOption("sortBy", "newest")}
                          className="justify-start"
                        >
                          {filterOptions.sortBy === "newest" && <Check className="mr-1 h-3 w-3" />}
                          Más recientes
                        </Button>
                        <Button
                          variant={filterOptions.sortBy === "oldest" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilterOption("sortBy", "oldest")}
                          className="justify-start"
                        >
                          {filterOptions.sortBy === "oldest" && <Check className="mr-1 h-3 w-3" />}
                          Más antiguos
                        </Button>
                        <Button
                          variant={filterOptions.sortBy === "az" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilterOption("sortBy", "az")}
                          className="justify-start"
                        >
                          {filterOptions.sortBy === "az" && <Check className="mr-1 h-3 w-3" />}
                          A-Z
                        </Button>
                        <Button
                          variant={filterOptions.sortBy === "za" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilterOption("sortBy", "za")}
                          className="justify-start"
                        >
                          {filterOptions.sortBy === "za" && <Check className="mr-1 h-3 w-3" />}
                          Z-A
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium mb-3">Mostrar solo</h3>
                      <Button
                        variant={filterOptions.showWithDescription ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilterOption("showWithDescription", !filterOptions.showWithDescription)}
                        className="justify-start"
                      >
                        {filterOptions.showWithDescription && <Check className="mr-1 h-3 w-3" />}
                        Con descripción
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-8">
                {/* Indicador de scroll izquierdo */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>

                {/* Contenedor de pestañas con scroll */}
                <div ref={tabsRef} className="flex justify-start overflow-x-auto py-2 px-4 scrollbar-none">
                  <TabsList className="flex flex-row flex-nowrap gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                    <TabsTrigger
                      value="todos"
                      className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap px-4"
                    >
                      Todos
                    </TabsTrigger>
                    {Object.keys(galleryData).map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white capitalize whitespace-nowrap px-4"
                      >
                        {category.replace(/_/g, " ")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Indicador de scroll derecho */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + searchTerm + JSON.stringify(filterOptions)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {imagesToShow.map((image, index) => (
                      <GalleryItem
                        key={`${image.category}-${image.id}`}
                        image={image}
                        onClick={() => handleImageClick(image, index)}
                      />
                    ))}
                  </div>

                  {imagesToShow.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No se encontraron imágenes que coincidan con tu búsqueda o filtros.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {searchTerm && (
                          <Button variant="outline" onClick={() => setSearchTerm("")}>
                            Limpiar búsqueda
                          </Button>
                        )}
                        {(filterOptions.showWithDescription || filterOptions.sortBy !== "newest") && (
                          <Button
                            variant="outline"
                            onClick={() => setFilterOptions({ sortBy: "newest", showWithDescription: false })}
                          >
                            Restablecer filtros
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>

        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 rounded-full bg-black/70 p-2 text-white z-50 hover:bg-black/90 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white z-50 hover:bg-black/90 transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white z-50 hover:bg-black/90 transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {selectedImage && (
                <div className="relative w-full h-[85vh] bg-black rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage.src || "/placeholder.svg"}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6 text-white">
                    <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                    {selectedImage.description && <p className="mt-2 text-gray-200">{selectedImage.description}</p>}
                    {selectedImage.category && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm capitalize">
                          {selectedImage.category.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}

function GalleryItem({
  image,
  onClick,
}: {
  image: {
    id: number
    src: string
    alt: string
    title: string
    description?: string
    category?: string
  }
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div
        className="gallery-item cursor-pointer overflow-hidden rounded-xl shadow-lg h-full bg-white dark:bg-gray-800 flex flex-col"
        onClick={onClick}
      >
        <div className="relative aspect-square">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white w-full">
              <h3 className="font-medium text-lg">{image.title}</h3>
              <p className="text-sm text-white/80 flex items-center mt-1">
                <span className="mr-1">Ver detalles</span>
                <ChevronRight className="h-4 w-4" />
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{image.title}</h3>
          {image.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{image.description}</p>
          )}
          {image.category && (
            <div className="mt-3">
              <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs capitalize">
                {image.category.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
