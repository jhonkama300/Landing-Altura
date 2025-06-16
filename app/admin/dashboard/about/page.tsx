"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowLeft, ImageIcon, Plus, Trash2, Award, Users, Upload } from "lucide-react"
import { getContentSection, updateContentSection } from "@/lib/content"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageLibrary } from "@/components/admin/image-library"
import { MediaUpload } from "@/components/admin/media-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ImageInfo } from "@/lib/images"

export default function AboutEditorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    paragraph1: "",
    paragraph2: "",
    buttonText: "",
    imageUrl: "",
    mission: "",
    vision: "",
    portfolio: {
      title: "",
      description: "",
      features: [] as { id: string; text: string; icon: string }[],
    },
  })
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library")

  useEffect(() => {
    // Cargar datos actuales
    const aboutContent = getContentSection("about")

    // Asegurarse de que portfolio y features existan
    const portfolio = aboutContent.portfolio || {
      title: "PORTAFOLIO",
      description: "Formación especializada en trabajo seguro en altura con los más altos estándares de calidad",
      features: [],
    }

    if (!portfolio.features) {
      portfolio.features = []
    }

    setFormData({
      ...aboutContent,
      portfolio,
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [name]: value,
      },
    }))
  }

  const handleFeatureChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedFeatures = [...prev.portfolio.features]
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value,
      }
      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          features: updatedFeatures,
        },
      }
    })
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        features: [
          ...prev.portfolio.features,
          {
            id: `feature-${Date.now()}`,
            text: "",
            icon: "CheckCircle",
          },
        ],
      },
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      const updatedFeatures = [...prev.portfolio.features]
      updatedFeatures.splice(index, 1)
      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          features: updatedFeatures,
        },
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: "" })

    try {
      // Simulamos un pequeño retraso para la experiencia de usuario
      await new Promise((resolve) => setTimeout(resolve, 600))

      const success = updateContentSection("about", formData)

      if (success) {
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

  const handleSelectImage = (image: ImageInfo) => {
    console.log("Imagen seleccionada:", image)
    setFormData((prev) => ({
      ...prev,
      imageUrl: image.url,
    }))
    setIsImageDialogOpen(false)
  }

  const handleUploadComplete = (mediaInfo: { id: string; url: string; type: string }) => {
    console.log("Subida completada:", mediaInfo)
    setFormData((prev) => ({
      ...prev,
      imageUrl: mediaInfo.url,
    }))
    setIsUploadDialogOpen(false)
  }

  const openImageDialog = () => {
    setIsImageDialogOpen(true)
  }

  const openUploadDialog = () => {
    setIsUploadDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Sección Quiénes Somos</h1>
      </div>

      {status.type && (
        <Alert variant={status.type === "error" ? "destructive" : "default"}>
          {status.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="mission-vision">Misión y Visión</TabsTrigger>
            <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          {/* Pestaña General */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Edita la información principal de la sección</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Título
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título de la sección"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="introduction">
                    Introducción
                  </label>
                  <Textarea
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    placeholder="Texto introductorio"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="paragraph1">
                    Párrafo 1
                  </label>
                  <Textarea
                    id="paragraph1"
                    name="paragraph1"
                    value={formData.paragraph1}
                    onChange={handleChange}
                    placeholder="Primer párrafo"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="paragraph2">
                    Párrafo 2
                  </label>
                  <Textarea
                    id="paragraph2"
                    name="paragraph2"
                    value={formData.paragraph2}
                    onChange={handleChange}
                    placeholder="Segundo párrafo"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="buttonText">
                    Texto del Botón
                  </label>
                  <Input
                    id="buttonText"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="Texto del botón"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Imagen</label>
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                      <img
                        src={formData.imageUrl || "/placeholder.svg?height=400&width=600&query=team"}
                        alt="Imagen de equipo"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={openImageDialog}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Seleccionar imagen
                      </Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={openUploadDialog}>
                        <Upload className="mr-2 h-4 w-4" />
                        Subir nueva imagen
                      </Button>
                    </div>

                    {/* Dialog para seleccionar imagen de la biblioteca */}
                    <Dialog
                      open={isImageDialogOpen}
                      onOpenChange={(open) => {
                        console.log("Dialog state changed:", open)
                        setIsImageDialogOpen(open)
                      }}
                    >
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Seleccionar imagen</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <ImageLibrary onSelectImage={handleSelectImage} />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog para subir nueva imagen */}
                    <Dialog
                      open={isUploadDialogOpen}
                      onOpenChange={(open) => {
                        setIsUploadDialogOpen(open)
                      }}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Subir nueva imagen</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <MediaUpload type="image" tags={["about", "team"]} onUploadComplete={handleUploadComplete} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Misión y Visión */}
          <TabsContent value="mission-vision">
            <Card>
              <CardHeader>
                <CardTitle>Misión y Visión</CardTitle>
                <CardDescription>Edita la misión y visión de tu organización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="mission">
                    Misión
                  </label>
                  <Textarea
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    placeholder="Misión de la organización"
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="vision">
                    Visión
                  </label>
                  <Textarea
                    id="vision"
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    placeholder="Visión de la organización"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Portafolio */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Información del Portafolio</CardTitle>
                <CardDescription>Edita la información del portafolio que aparece sobre la imagen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="portfolio-title">
                    Título del Portafolio
                  </label>
                  <Input
                    id="portfolio-title"
                    name="title"
                    value={formData.portfolio.title}
                    onChange={handlePortfolioChange}
                    placeholder="Título del portafolio"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="portfolio-description">
                    Descripción del Portafolio
                  </label>
                  <Textarea
                    id="portfolio-description"
                    name="description"
                    value={formData.portfolio.description}
                    onChange={handlePortfolioChange}
                    placeholder="Descripción del portafolio"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Características</label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4 mr-1" /> Añadir
                    </Button>
                  </div>

                  {formData.portfolio.features.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay características. Haz clic en "Añadir" para crear una.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.portfolio.features.map((feature, index) => (
                        <div key={feature.id} className="flex items-start gap-3 p-3 border rounded-md">
                          <div className="flex-1">
                            <div className="mb-2">
                              <Input
                                value={feature.text}
                                onChange={(e) => handleFeatureChange(index, "text", e.target.value)}
                                placeholder="Texto de la característica"
                                required
                              />
                            </div>
                            <Select
                              value={feature.icon}
                              onValueChange={(value) => handleFeatureChange(index, "icon", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un icono" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CheckCircle">Círculo de verificación</SelectItem>
                                <SelectItem value="Users">Usuarios</SelectItem>
                                <SelectItem value="Award">Premio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Vista Previa */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
                <CardDescription>Así se verá la sección Quiénes Somos con los cambios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-800">
                  <h2 className="mb-4 text-2xl font-bold">{formData.title || "Título de Nosotros"}</h2>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {formData.introduction || "Texto introductorio..."}
                  </p>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {formData.paragraph1 || "Primer párrafo sobre nosotros..."}
                  </p>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    {formData.paragraph2 || "Segundo párrafo sobre nosotros..."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary text-white p-4 rounded-md">
                      <h3 className="font-bold mb-2">MISIÓN</h3>
                      <p className="text-xs">{formData.mission || "Texto de la misión..."}</p>
                    </div>
                    <div className="bg-secondary text-primary p-4 rounded-md">
                      <h3 className="font-bold mb-2">VISIÓN</h3>
                      <p className="text-xs">{formData.vision || "Texto de la visión..."}</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white inline-block">
                    {formData.buttonText || "Botón"}
                  </div>

                  <div className="mt-6 rounded-md overflow-hidden relative">
                    <img
                      src={formData.imageUrl || "/placeholder.svg?height=200&width=400&query=team"}
                      alt="Imagen de equipo"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                      <h4 className="font-bold">{formData.portfolio.title || "PORTAFOLIO"}</h4>
                      <p className="text-xs">{formData.portfolio.description || "Descripción del portafolio..."}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.portfolio.features.map((feature) => (
                          <div
                            key={feature.id}
                            className="bg-white/20 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            {feature.icon === "CheckCircle" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {feature.icon === "Users" && <Users className="h-3 w-3 mr-1" />}
                            {feature.icon === "Award" && <Award className="h-3 w-3 mr-1" />}
                            {feature.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
