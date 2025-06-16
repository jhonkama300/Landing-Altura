"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, ImageIcon, CheckCircle } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import { ImageLibrary } from "@/components/admin/image-library"

export default function ImagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("library")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Cargar imágenes de demostración al iniciar
  

  const handleUploadComplete = () => {
    setUploadSuccess(true)
    setActiveTab("library")

    // Ocultar el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setUploadSuccess(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Gestión de Imágenes</h1>
      </div>

      {uploadSuccess && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Imagen subida correctamente</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="library">
            <ImageIcon className="h-4 w-4 mr-2" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Subir Imagen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Imágenes</CardTitle>
              <CardDescription>Gestiona todas las imágenes de tu sitio web</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageLibrary showSelect={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Subir Nueva Imagen</CardTitle>
              <CardDescription>Sube una nueva imagen a tu biblioteca</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
