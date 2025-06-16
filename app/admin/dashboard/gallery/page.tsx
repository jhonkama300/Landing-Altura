"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageLibrary } from "@/components/admin/image-library"
import { MediaUpload } from "@/components/admin/media-upload"
import {
  getGalleryData,
  getAllCategories, // Importar getAllCategories
  addGalleryCategory,
  deleteGalleryCategory,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  resetGalleryData, // Importar resetGalleryData
  type GalleryData,
} from "@/lib/gallery"
import type { GalleryImage, GalleryCategory } from "@/lib/database" // Importar tipos de lib/database
import { Plus, Trash2, Save, Edit, ImageIcon, FolderPlus, RefreshCw, AlertTriangle, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function GalleryAdminPage() {
  const router = useRouter()
  const [galleryData, setGalleryData] = useState<GalleryData>({})
  const [categories, setCategories] = useState<GalleryCategory[]>([]) // Estado para las categorías con sus IDs
  const [activeTab, setActiveTab] = useState<string>("") // Usará el slug de la categoría
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [newImage, setNewImage] = useState<Partial<GalleryImage>>({
    title: "",
    alt: "",
    description: "",
    src: "",
    tags: [], // Añadir tags
  })
  const [selectedImageFromLibrary, setSelectedImageFromLibrary] = useState<any>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(true)

  // Función para cargar todos los datos de la galería
  const fetchGallery = async () => {
    setLoading(true)
    try {
      const fetchedCategories = await getAllCategories() // Obtener categorías con IDs
      setCategories(fetchedCategories)

      const data = await getGalleryData() // Obtener imágenes agrupadas por slug
      setGalleryData(data)

      // Establecer la primera categoría como activa si no hay ninguna seleccionada
      if (fetchedCategories.length > 0 && !activeTab) {
        setActiveTab(fetchedCategories[0].slug)
      } else if (
        fetchedCategories.length > 0 &&
        activeTab &&
        !fetchedCategories.some((cat) => cat.slug === activeTab)
      ) {
        // Si la pestaña activa ya no existe, cambiar a la primera
        setActiveTab(fetchedCategories[0].slug)
      } else if (fetchedCategories.length === 0) {
        setActiveTab("")
      }
    } catch (err: any) {
      console.error("Error al cargar la galería:", err)
      setErrorMessage(err.message || "Error al cargar la galería")
      setShowErrorAlert(true)
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos de la galería al montar el componente
  useEffect(() => {
    fetchGallery()
  }, [])

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Añadir nueva categoría
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrorMessage("El nombre de la categoría no puede estar vacío")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    try {
      await addGalleryCategory(newCategoryName.trim())
      await fetchGallery() // Volver a cargar los datos
      setNewCategoryName("")
      setShowNewCategoryDialog(false)
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err: any) {
      console.error("Error al añadir la categoría:", err)
      setErrorMessage(err.message || "Error al añadir la categoría")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
    }
  }

  // Eliminar categoría
  const handleDeleteCategory = async (categorySlug: string) => {
    const categoryToDelete = categories.find((cat) => cat.slug === categorySlug)
    if (!categoryToDelete) {
      setErrorMessage("Categoría no encontrada para eliminar.")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    if (
      confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete.name}" y todas sus imágenes?`)
    ) {
      try {
        await deleteGalleryCategory(categoryToDelete.id)
        await fetchGallery() // Volver a cargar los datos
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 3000)
      } catch (err: any) {
        console.error("Error al eliminar la categoría:", err)
        setErrorMessage(err.message || "Error al eliminar la categoría")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 3000)
      }
    }
  }

  // Preparar para añadir una nueva imagen
  const handleAddImageClick = () => {
    setEditingImage(null)
    setNewImage({
      title: "",
      alt: "",
      description: "",
      src: "",
      tags: [],
    })
    setSelectedImageFromLibrary(null)
    setShowImageDialog(true)
  }

  // Preparar para editar una imagen existente
  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image)
    setNewImage({
      title: image.title,
      alt: image.alt,
      description: image.description || "",
      src: image.src,
      tags: image.tags || [],
    })
    setSelectedImageFromLibrary(null) // Resetear selección de biblioteca
    setShowImageDialog(true)
  }

  // Guardar imagen (nueva o editada)
  const handleSaveImage = async () => {
    if (!activeTab) {
      setErrorMessage("No hay categoría seleccionada")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    if (!newImage.title || !newImage.src) {
      setErrorMessage("El título y la imagen son obligatorios")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    const currentCategory = categories.find((cat) => cat.slug === activeTab)
    if (!currentCategory) {
      setErrorMessage("Categoría no encontrada")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
      return
    }

    try {
      if (editingImage) {
        // Actualizar imagen existente
        await updateGalleryImage({
          id: editingImage.id,
          category_id: currentCategory.id, // Usar el ID de la categoría actual
          title: newImage.title!,
          alt: newImage.alt || newImage.title!,
          description: newImage.description,
          src: newImage.src!,
          tags: newImage.tags,
        })
      } else {
        // Añadir nueva imagen
        await addGalleryImage(currentCategory.id, {
          // Usar el ID de la categoría actual
          title: newImage.title!,
          alt: newImage.alt || newImage.title!,
          description: newImage.description,
          src: newImage.src!,
          tags: newImage.tags,
        })
      }
      await fetchGallery() // Volver a cargar los datos
      setShowImageDialog(false)
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err: any) {
      console.error("Error al guardar la imagen:", err)
      setErrorMessage(err.message || "Error al guardar la imagen")
      setShowErrorAlert(true)
      setTimeout(() => setShowErrorAlert(false), 3000)
    }
  }

  // Eliminar imagen
  const handleDeleteImage = async (imageId: number) => {
    if (!activeTab) return

    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
        await deleteGalleryImage(imageId)
        await fetchGallery() // Volver a cargar los datos
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 3000)
      } catch (err: any) {
        console.error("Error al eliminar la imagen:", err)
        setErrorMessage(err.message || "Error al eliminar la imagen")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 3000)
      }
    }
  }

  // Seleccionar imagen de la biblioteca
  const handleSelectImageFromLibrary = (image: any) => {
    setSelectedImageFromLibrary(image)
    setNewImage({
      ...newImage,
      src: image.url,
    })
  }

  // Restablecer datos de la galería
  const handleResetGallery = async () => {
    if (
      confirm(
        "¿Estás seguro de que quieres restablecer la galería a los valores por defecto? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        await resetGalleryData()
        await fetchGallery() // Volver a cargar los datos
        setShowSuccessAlert(true)
        setTimeout(() => setShowSuccessAlert(false), 3000)
      } catch (err: any) {
        console.error("Error al restablecer la galería:", err)
        setErrorMessage(err.message || "Error al restablecer la galería")
        setShowErrorAlert(true)
        setTimeout(() => setShowErrorAlert(false), 3000)
      }
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
          <p className="text-gray-600 dark:text-gray-400">Administra las imágenes y categorías de la galería</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowNewCategoryDialog(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
          <Button variant="destructive" onClick={handleResetGallery}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>
        </div>
      </div>

      {/* Alertas */}
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

      {categories.length === 0 ? ( // Usar categories.length para verificar si hay categorías
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No hay categorías en la galería</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">Crea una nueva categoría para empezar a añadir imágenes</p>
              <Button onClick={() => setShowNewCategoryDialog(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {categories.map(
                (
                  category, // Mapear sobre el estado de categorías
                ) => (
                  <TabsTrigger
                    key={category.slug}
                    value={category.slug}
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white capitalize"
                  >
                    {category.name}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </div>

          {categories.map(
            (
              category, // Mapear sobre el estado de categorías
            ) => (
              <TabsContent key={category.slug} value={category.slug}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold capitalize">{category.name}</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleAddImageClick}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir Imagen
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteCategory(category.slug)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar Categoría
                    </Button>
                  </div>
                </div>

                {galleryData[category.slug]?.length === 0 ? ( // Usar galleryData[category.slug]
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">No hay imágenes en esta categoría</h3>
                        <p className="text-sm text-gray-500 mt-2 mb-6">Añade imágenes para mostrarlas en la galería</p>
                        <Button onClick={handleAddImageClick}>
                          <Plus className="mr-2 h-4 w-4" />
                          Añadir Imagen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryData[category.slug]?.map(
                      (
                        image, // Usar galleryData[category.slug]
                      ) => (
                        <Card key={image.id} className="overflow-hidden">
                          <div className="relative aspect-square">
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-1">{image.title}</h3>
                            {image.description && (
                              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{image.description}</p>
                            )}
                            {image.tags && image.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {image.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditImage(image)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                )}
              </TabsContent>
            ),
          )}
        </Tabs>
      )}

      {/* Diálogo para nueva categoría */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nombre de la categoría</Label>
              <Input
                id="category-name"
                placeholder="Ej: Instalaciones, Equipos, etc."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                El nombre se convertirá automáticamente a minúsculas y los espacios se reemplazarán por guiones bajos.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Crear Categoría
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para añadir/editar imagen */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Editar Imagen" : "Añadir Nueva Imagen"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="image">Seleccionar Imagen</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-title">Título *</Label>
                      <Input
                        id="image-title"
                        placeholder="Título de la imagen"
                        value={newImage.title}
                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-alt">Texto alternativo</Label>
                      <Input
                        id="image-alt"
                        placeholder="Descripción para accesibilidad"
                        value={newImage.alt}
                        onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">
                        Si se deja vacío, se usará el título como texto alternativo.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-description">Descripción</Label>
                      <Textarea
                        id="image-description"
                        placeholder="Descripción detallada de la imagen"
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-tags">Etiquetas (separadas por comas)</Label>
                      <Input
                        id="image-tags"
                        placeholder="Ej: seguridad, rescate, formación"
                        value={newImage.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Introduce palabras clave separadas por comas para ayudar en la búsqueda.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="border rounded-lg overflow-hidden aspect-square relative">
                      {newImage.src ? (
                        <Image
                          src={newImage.src || "/placeholder.svg"}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {newImage.src ? "Imagen seleccionada" : "No hay imagen seleccionada"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <Tabs defaultValue="library">
                  <TabsList className="mb-4">
                    <TabsTrigger value="library">Biblioteca de Imágenes</TabsTrigger>
                    <TabsTrigger value="upload">Subir Nueva Imagen</TabsTrigger>
                  </TabsList>

                  <TabsContent value="library">
                    <ImageLibrary
                      onSelectImage={handleSelectImageFromLibrary}
                      selectedImageId={selectedImageFromLibrary?.id}
                    />
                  </TabsContent>

                  <TabsContent value="upload">
                    <MediaUpload
                      onUploadComplete={(image) => {
                        setSelectedImageFromLibrary(image)
                        setNewImage({
                          ...newImage,
                          src: image.url,
                        })
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveImage} disabled={!newImage.title || !newImage.src}>
                <Save className="mr-2 h-4 w-4" />
                {editingImage ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
