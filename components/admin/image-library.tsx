"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Trash2, Eye } from "lucide-react"
import { getImages, deleteImage, type ImageInfo } from "@/lib/images"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageLibraryProps {
  onSelectImage?: (image: ImageInfo) => void
  showSelect?: boolean
  section?: string
  subfolder?: string
}

export function ImageLibrary({ onSelectImage, showSelect = false, section, subfolder }: ImageLibraryProps) {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSection, setSelectedSection] = useState(section || "all")
  const [selectedSubfolder, setSelectedSubfolder] = useState(subfolder || "all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Cargar imágenes
  useEffect(() => {
    loadImages()
  }, [selectedSection, selectedSubfolder])

  const loadImages = async () => {
    setLoading(true)
    try {
      const sectionFilter = selectedSection === "all" ? undefined : selectedSection
      const subfolderFilter = selectedSubfolder === "all" ? undefined : selectedSubfolder
      const imageList = await getImages(sectionFilter, subfolderFilter)
      setImages(imageList)
      setFilteredImages(imageList)
    } catch (error) {
      console.error("Error cargando imágenes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar imágenes por búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredImages(images)
    } else {
      const filtered = images.filter(
        (image) =>
          image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredImages(filtered)
    }
  }, [searchTerm, images])

  const handleDeleteImage = async (image: ImageInfo) => {
    try {
      const success = await deleteImage(image.id, image.url)
      if (success) {
        await loadImages() // Recargar la lista
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error("Error eliminando imagen:", error)
    }
  }

  const handleSelectImage = (image: ImageInfo) => {
    if (onSelectImage) {
      onSelectImage(image)
    }
  }

  const handlePreviewImage = (image: ImageInfo) => {
    setSelectedImage(image)
    setIsPreviewOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const sections = ["all", "hero", "about", "services", "gallery", "certifications", "contact", "navbar", "features"]
  const subfolders = [
    "all",
    "backgrounds",
    "carousel",
    "media",
    "main",
    "team",
    "facilities",
    "thumbnails",
    "certificates",
    "instalaciones",
    "formacion",
    "equipos",
    "logos",
    "icons",
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sección" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  {sec === "all" ? "Todas" : sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubfolder} onValueChange={setSelectedSubfolder}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Subcarpeta" />
            </SelectTrigger>
            <SelectContent>
              {subfolders.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub === "all" ? "Todas" : sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Lista de imágenes */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No se encontraron imágenes que coincidan con la búsqueda" : "No hay imágenes disponibles"}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  {image.type.startsWith("video/") ? (
                    <video src={image.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handlePreviewImage(image)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {showSelect && (
                      <Button size="sm" variant="secondary" onClick={() => handleSelectImage(image)}>
                        Seleccionar
                      </Button>
                    )}

                    <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(image.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-2">
                  <p className="text-xs font-medium truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {image.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    {image.type.startsWith("video/") ? (
                      <video src={image.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{image.name}</h3>
                    <p className="text-sm text-gray-500">
                      {image.section}/{image.subfolder} • {formatFileSize(image.size)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {image.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handlePreviewImage(image)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {showSelect && (
                      <Button size="sm" onClick={() => handleSelectImage(image)}>
                        Seleccionar
                      </Button>
                    )}

                    <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(image.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p>¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const image = images.find((img) => img.id === deleteConfirm)
                  if (image) handleDeleteImage(image)
                }}
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de vista previa */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {selectedImage.type.startsWith("video/") ? (
                  <video src={selectedImage.url} className="max-w-full max-h-96 object-contain" controls />
                ) : (
                  <img
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.name}
                    className="max-w-full max-h-96 object-contain"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Sección:</strong> {selectedImage.section}
                </div>
                <div>
                  <strong>Subcarpeta:</strong> {selectedImage.subfolder}
                </div>
                <div>
                  <strong>Tamaño:</strong> {formatFileSize(selectedImage.size)}
                </div>
                <div>
                  <strong>Tipo:</strong> {selectedImage.type}
                </div>
                {selectedImage.dimensions && (
                  <div>
                    <strong>Dimensiones:</strong> {selectedImage.dimensions.width} x {selectedImage.dimensions.height}
                  </div>
                )}
                {selectedImage.duration && (
                  <div>
                    <strong>Duración:</strong> {selectedImage.duration}s
                  </div>
                )}
              </div>

              <div>
                <strong>Etiquetas:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <strong>URL:</strong>
                <code className="block bg-gray-100 p-2 rounded text-xs break-all">{selectedImage.url}</code>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
