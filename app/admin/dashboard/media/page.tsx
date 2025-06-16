"use client"

import { useState, useEffect } from "react"
import { FileUpload } from "@/components/admin/file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALLOWED_FILE_TYPES, FOLDER_STRUCTURE } from "@/lib/media-constants";
import { Trash2, Search, Filter, Grid, List, ImageIcon, Video, FileText, X } from "lucide-react"

interface MediaFile {
  id: string
  publicUrl: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  section: string
  subfolder: string
  createdAt: string
}

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof ALLOWED_FILE_TYPES>("hero")
  const [activeSubfolder, setActiveSubfolder] = useState<string>(FOLDER_STRUCTURE.hero[0])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  // Simular carga de archivos
  useEffect(() => {
    // En una implementación real, aquí cargaríamos los archivos desde la API
    setIsLoading(true)

    // Simular delay de carga
    const timer = setTimeout(() => {
      // Datos de ejemplo
      const demoFiles: MediaFile[] = [
        {
          id: "1",
          publicUrl: "/upload/hero/backgrounds/hero-bg-1.jpg",
          filename: "hero-bg-1.jpg",
          originalName: "background-image.jpg",
          mimeType: "image/jpeg",
          size: 1024 * 1024 * 2.5,
          width: 1920,
          height: 1080,
          section: "hero",
          subfolder: "backgrounds",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          publicUrl: "/upload/hero/carousel/slide-1.jpg",
          filename: "slide-1.jpg",
          originalName: "slide-image-1.jpg",
          mimeType: "image/jpeg",
          size: 1024 * 1024 * 1.8,
          width: 1920,
          height: 1080,
          section: "hero",
          subfolder: "carousel",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          publicUrl: "/upload/about/team/team-member.jpg",
          filename: "team-member.jpg",
          originalName: "john-doe.jpg",
          mimeType: "image/jpeg",
          size: 1024 * 1024 * 0.8,
          width: 800,
          height: 800,
          section: "about",
          subfolder: "team",
          createdAt: new Date().toISOString(),
        },
      ]

      setFiles(demoFiles)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrar archivos según la sección, subcarpeta y término de búsqueda
  const filteredFiles = files.filter((file) => {
    const matchesSection = file.section === activeTab
    const matchesSubfolder = !activeSubfolder || file.subfolder === activeSubfolder
    const matchesSearch =
      !searchTerm ||
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSection && matchesSubfolder && matchesSearch
  })

  // Manejar la subida completa de un archivo
  const handleUploadComplete = (fileInfo: any) => {
    // En una implementación real, aquí actualizaríamos la lista de archivos
    const newFile: MediaFile = {
      id: Date.now().toString(),
      publicUrl: fileInfo.publicUrl,
      filename: fileInfo.filename,
      originalName: fileInfo.originalName,
      mimeType: fileInfo.mimeType,
      size: fileInfo.size,
      width: fileInfo.width,
      height: fileInfo.height,
      section: activeTab,
      subfolder: activeSubfolder,
      createdAt: new Date().toISOString(),
    }

    setFiles([newFile, ...files])
  }

  // Manejar la eliminación de un archivo
  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
      return
    }

    try {
      // En una implementación real, aquí llamaríamos a la API para eliminar el archivo
      const response = await fetch("/api/upload/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: file.publicUrl }),
      })

      const result = await response.json()

      if (result.success) {
        // Actualizar la lista de archivos
        setFiles(files.filter((f) => f.id !== file.id))

        // Si el archivo eliminado es el seleccionado, deseleccionarlo
        if (selectedFile?.id === file.id) {
          setSelectedFile(null)
        }
      } else {
        alert(`Error al eliminar el archivo: ${result.message}`)
      }
    } catch (error) {
      console.error("Error al eliminar el archivo:", error)
      alert("Error al eliminar el archivo. Verifica la conexión.")
    }
  }

  // Renderizar el icono según el tipo de archivo
  const renderFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />
    } else if (mimeType.startsWith("video/")) {
      return <Video className="h-5 w-5" />
    } else {
      return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestor de Medios</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Vista de cuadrícula"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="Vista de lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Selector de sección */}
          <Card>
            <CardHeader>
              <CardTitle>Secciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value as keyof typeof ALLOWED_FILE_TYPES)
                  setActiveSubfolder(FOLDER_STRUCTURE[value as keyof typeof FOLDER_STRUCTURE][0])
                }}
              >
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="hero">Hero</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Servicios</TabsTrigger>
                  <TabsTrigger value="gallery">Galería</TabsTrigger>
                  <TabsTrigger value="certifications">Certificados</TabsTrigger>
                  <TabsTrigger value="contact">Contacto</TabsTrigger>
                  <TabsTrigger value="navbar">Navbar</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Selector de subcarpeta */}
          <Card>
            <CardHeader>
              <CardTitle>Subcarpetas</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={activeSubfolder} onValueChange={setActiveSubfolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una subcarpeta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {FOLDER_STRUCTURE[activeTab].map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Subir archivo */}
          <Card>
            <CardHeader>
              <CardTitle>Subir archivo</CardTitle>
              <CardDescription>
                Sube un nuevo archivo a la sección {activeTab} / {activeSubfolder}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload section={activeTab} subfolder={activeSubfolder} onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-3 space-y-6">
          {/* Barra de búsqueda */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar archivos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Lista de archivos */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-square" />
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron archivos</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`relative rounded-lg overflow-hidden border ${
                    selectedFile?.id === file.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.mimeType.startsWith("image/") ? (
                    <div className="aspect-square bg-gray-50">
                      <img
                        src={file.publicUrl || "/placeholder.svg"}
                        alt={file.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : file.mimeType.startsWith("video/") ? (
                    <div className="aspect-square bg-gray-50 flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-50 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <p className="text-sm font-medium truncate">{file.filename}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file)
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
                    aria-label="Eliminar archivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y border rounded-lg">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                    selectedFile?.id === file.id ? "bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="mr-3">
                    {file.mimeType.startsWith("image/") ? (
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                        <img
                          src={file.publicUrl || "/placeholder.svg"}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                        {renderFileIcon(file.mimeType)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {file.subfolder} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file)
                    }}
                    aria-label="Eliminar archivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Detalles del archivo seleccionado */}
          {selectedFile && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Detalles del archivo</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} aria-label="Cerrar detalles">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {selectedFile.mimeType.startsWith("image/") ? (
                      <img
                        src={selectedFile.publicUrl || "/placeholder.svg"}
                        alt={selectedFile.filename}
                        className="w-full h-auto rounded-lg"
                      />
                    ) : selectedFile.mimeType.startsWith("video/") ? (
                      <video src={selectedFile.publicUrl} controls className="w-full h-auto rounded-lg" />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Nombre</Label>
                      <p className="text-sm">{selectedFile.filename}</p>
                    </div>
                    <div>
                      <Label>Nombre original</Label>
                      <p className="text-sm">{selectedFile.originalName}</p>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <div className="flex items-center space-x-2">
                        <Input value={selectedFile.publicUrl} readOnly onClick={(e) => e.currentTarget.select()} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedFile.publicUrl)
                            alert("URL copiada al portapapeles")
                          }}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Tipo</Label>
                        <p className="text-sm">{selectedFile.mimeType}</p>
                      </div>
                      <div>
                        <Label>Tamaño</Label>
                        <p className="text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      {selectedFile.width && selectedFile.height && (
                        <>
                          <div>
                            <Label>Ancho</Label>
                            <p className="text-sm">{selectedFile.width}px</p>
                          </div>
                          <div>
                            <Label>Alto</Label>
                            <p className="text-sm">{selectedFile.height}px</p>
                          </div>
                        </>
                      )}
                      <div>
                        <Label>Sección</Label>
                        <p className="text-sm">{selectedFile.section}</p>
                      </div>
                      <div>
                        <Label>Subcarpeta</Label>
                        <p className="text-sm">{selectedFile.subfolder}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.open(selectedFile.publicUrl, "_blank")}>
                  Ver archivo
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteFile(selectedFile)}>
                  Eliminar archivo
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
