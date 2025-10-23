"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input, Label } from "@/components/ui/input"
import { Upload, Trash2, RefreshCw, AlertTriangle, Check, FolderOpen, FolderPlus, ImageIcon, Video } from "lucide-react"

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

export default function GalleryAdminPage() {
  const [galleryData, setGalleryData] = useState<GalleryData>({})
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [activeTab, setActiveTab] = useState<string>("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File; preview: string; type: "image" | "video" }>>([])

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/galery/filesystem")
      if (!response.ok) throw new Error("Error al cargar la galería")

      const data = await response.json()
      setGalleryData(data.galleryData || {})
      setCategories(data.categories || [])

      if (data.categories.length > 0 && !activeTab) {
        setActiveTab(data.categories[0].slug)
      }
    } catch (err: any) {
      console.error("Error al cargar la galería:", err)
      setErrorMessage(err.message || "Error al cargar la galería")
      setShowErrorAlert(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  useEffect(() => {
    if (!showUploadDialog) {
      previewFiles.forEach((preview) => URL.revokeObjectURL(preview.preview))
      setPreviewFiles([])
      setSelectedFiles(null)
    }
  }, [showUploadDialog])

  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      setSelectedFiles(null)
      setPreviewFiles([])
      return
    }

    setSelectedFiles(files)

    const previews: Array<{ file: File; preview: string; type: "image" | "video" }> = []
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/")
      const preview = URL.createObjectURL(file)
      previews.push({
        file,
        preview,
        type: isVideo ? "video" : "image",
      })
    })
    setPreviewFiles(previews)
  }

  const handleUploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setErrorMessage("No se seleccionaron archivos")
      setShowErrorAlert(true)
      return
    }

    if (!activeTab) {
      setErrorMessage("No hay categoría seleccionada")
      setShowErrorAlert(true)
      return
    }

    setUploading(true)
    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("category", activeTab)

        const response = await fetch("/api/galery/filesystem/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Error al subir archivo")
        }

        return response.json()
      })

      await Promise.all(uploadPromises)

      setShowUploadDialog(false)
      setSelectedFiles(null)
      setPreviewFiles([])
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)

      await fetchGallery()
    } catch (err: any) {
      console.error("Error al subir archivos:", err)
      setErrorMessage(err.message || "Error al subir archivos")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageSrc: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
      try {
        const response = await fetch(`/api/galery/filesystem/delete?path=${encodeURIComponent(imageSrc)}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Error al eliminar archivo")
        }

        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 3000)

        await fetchGallery()
      } catch (err: any) {
        console.error("Error al eliminar archivo:", err)
        setErrorMessage(err.message || "Error al eliminar archivo")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 3000)
      }
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrorMessage("El nombre de la categoría no puede estar vacío")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    setCreatingCategory(true)
    try {
      const response = await fetch("/api/galery/filesystem/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear categoría")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Error al crear categoría")
      }

      setShowNewCategoryDialog(false)
      setNewCategoryName("")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)

      await fetchGallery()
    } catch (err: any) {
      console.error("Error al crear categoría:", err)
      setErrorMessage(err.message || "Error al crear categoría")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
    } finally {
      setCreatingCategory(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-600 dark:text-gray-400">Cargando galería...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Galería</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Las imágenes y videos se almacenan directamente en las carpetas del servidor
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowNewCategoryDialog(true)} variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
          <Button onClick={() => fetchGallery()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar
          </Button>
        </div>
      </div>

      {showSuccessAlert && (
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <Check className="h-4 w-4" />
          <AlertDescription>Operación completada con éxito</AlertDescription>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert className="bg-red-50 border-red-500 text-red-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Cómo agregar archivos a la galería
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>
                  Crea una carpeta en{" "}
                  <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">public/gallery/</code> con el nombre
                  de tu categoría (ej: "encuentros")
                </li>
                <li>Sube imágenes o videos usando el botón "Subir Archivos" o directamente vía FTP/cPanel</li>
                <li>Los archivos aparecerán automáticamente en la galería</li>
                <li>Formatos soportados: JPG, PNG, GIF, WebP, MP4, WebM, OGG</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No hay categorías en la galería</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Crea una carpeta en{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">public/gallery/</code> para empezar
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.slug}
                  value={category.slug}
                  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white capitalize"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.slug} value={category.slug}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold capitalize">{category.name}</h2>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Archivos
                </Button>
              </div>

              {galleryData[category.slug]?.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium">No hay archivos en esta categoría</h3>
                      <p className="text-sm text-gray-500 mt-2 mb-6">
                        Sube imágenes o videos para mostrarlos en la galería
                      </p>
                      <Button onClick={() => setShowUploadDialog(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Archivos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {galleryData[category.slug]?.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative aspect-square">
                        {image.type === "video" ? (
                          <video src={image.src} className="w-full h-full object-cover" controls preload="metadata" />
                        ) : (
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          {image.type === "video" ? (
                            <>
                              <Video className="h-3 w-3" />
                              Video
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-3 w-3" />
                              Imagen
                            </>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg mb-1 line-clamp-1">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{image.description}</p>
                        )}
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.src)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subir Archivos a {categories.find((c) => c.slug === activeTab)?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="files">Seleccionar imágenes o videos</Label>
              <Input
                id="files"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
              />
              <p className="text-xs text-gray-500">
                Puedes seleccionar múltiples archivos. Formatos soportados: JPG, PNG, GIF, WebP, MP4, WebM, OGG
              </p>
            </div>

            {previewFiles.length > 0 && (
              <div className="space-y-2">
                <Label>
                  Vista previa ({previewFiles.length} {previewFiles.length === 1 ? "archivo" : "archivos"})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg">
                  {previewFiles.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      {preview.type === "video" ? (
                        <video
                          src={preview.preview}
                          className="w-full h-full object-cover"
                          controls={false}
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={preview.preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-1 left-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        {preview.type === "video" ? (
                          <>
                            <Video className="h-3 w-3" />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3" />
                            Imagen
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                        {preview.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
                Cancelar
              </Button>
              <Button onClick={handleUploadImages} disabled={!selectedFiles || uploading}>
                {uploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Categoría</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Nombre de la categoría</Label>
              <Input
                id="categoryName"
                placeholder="ej: encuentros, capacitaciones, eventos"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Se creará una carpeta en{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">public/gallery/</code> con este nombre
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)} disabled={creatingCategory}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCategory} disabled={creatingCategory}>
                {creatingCategory ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Crear
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
