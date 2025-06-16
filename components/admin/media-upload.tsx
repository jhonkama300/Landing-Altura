"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, AlertCircle, Check, Video, ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"]

interface MediaUploadProps {
  onUploadComplete?: (mediaInfo: {
    id: string
    url: string
    type: "image" | "video"
    name: string
    thumbnail_url?: string
  }) => void
  maxSizeMB?: number
  tags?: string[]
  type: "image" | "video"
  section?: string
  subfolder?: string
}

export function MediaUpload({
  onUploadComplete,
  maxSizeMB = 50,
  tags = [],
  type = "image",
  section = "hero",
  subfolder = "backgrounds",
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [customTags, setCustomTags] = useState<string[]>(tags)
  const [tagInput, setTagInput] = useState("")
  const [progress, setProgress] = useState(0)
  const [selectedSubfolder, setSelectedSubfolder] = useState(subfolder)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Subcarpetas disponibles según la sección
  const getSubfolders = (section: string) => {
    const subfolders = {
      hero: ["backgrounds", "carousel", "media"],
      about: ["main", "team", "facilities", "portfolio"],
      services: ["thumbnails", "certificates", "gallery"],
      gallery: ["instalaciones", "formacion", "equipos", "general"],
      certifications: ["certificates", "logos"],
      contact: ["locations", "team"],
      navbar: ["logos", "icons"],
      features: ["icons", "images"],
    }
    return subfolders[section as keyof typeof subfolders] || ["general"]
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    const allowedTypes = type === "image" ? IMAGE_TYPES : VIDEO_TYPES

    if (!allowedTypes.includes(file.type)) {
      setError(
        `Tipo de archivo no permitido. Tipos permitidos: ${
          type === "image" ? "JPG, PNG, GIF, WEBP, SVG" : "MP4, WEBM, OGG, MOV, AVI, WMV"
        }`,
      )
      return false
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024 // Corrected calculation: MB to Bytes
    if (file.size > maxSizeBytes) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    setSuccess(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]

      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(false)

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, selecciona un archivo primero")
      return
    }

    setIsUploading(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("section", section)
      formData.append("subfolder", selectedSubfolder)
      formData.append("tags", JSON.stringify(customTags))
      formData.append("type", type) // Pass the type to the API

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al subir el archivo")
      }

      const result = await response.json()
      setProgress(100)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          if (onUploadComplete) {
            onUploadComplete({
              id: result.data.id,
              url: result.data.url,
              type: result.data.type, // Ensure type is returned from API
              name: result.data.filename,
              thumbnail_url: result.data.thumbnail_url, // Ensure thumbnail_url is returned from API
            })
          }
        }, 500)
      } else {
        setError(result.message || "Error al subir el archivo")
      }
    } catch (err) {
      console.error("Error al subir el archivo:", err)
      setError(err instanceof Error ? err.message : "Error al subir el archivo")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setSuccess(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !customTags.includes(tagInput.trim())) {
      setCustomTags([...customTags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const acceptedFileTypes = type === "image" ? IMAGE_TYPES.join(",") : VIDEO_TYPES.join(",")

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>Archivo subido correctamente</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Sección</Label>
          <Input value={section} disabled className="bg-gray-50" />
        </div>
        <div>
          <Label>Subcarpeta</Label>
          <Select value={selectedSubfolder} onValueChange={setSelectedSubfolder}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona subcarpeta" />
            </SelectTrigger>
            <SelectContent>
              {getSubfolders(section).map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {type === "image" ? (
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
          ) : (
            <Video className="h-12 w-12 mx-auto text-gray-400" />
          )}
          <p className="mt-2 text-sm font-medium">
            Arrastra y suelta {type === "image" ? "una imagen" : "un video"} aquí, o haz clic para seleccionar
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Formatos permitidos: {type === "image" ? "JPG, PNG, GIF, WEBP, SVG" : "MP4, WEBM, OGG, MOV, AVI, WMV"}
          </p>
          <p className="text-xs text-gray-500">Tamaño máximo: {maxSizeMB}MB</p>
          <p className="text-xs text-gray-500 mt-1">
            Se guardará en: /upload/{section}/{selectedSubfolder}/
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {file?.type.startsWith("image/") ? (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-contain bg-gray-50" />
          ) : (
            <video
              ref={videoRef}
              src={preview || ""}
              className="w-full h-64 object-contain bg-gray-50"
              controls
              muted
            />
          )}
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
            aria-label="Eliminar archivo"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="p-3 bg-white">
            <p className="font-medium truncate">{file?.name}</p>
            <p className="text-sm text-gray-500">{file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB</p>
            <p className="text-xs text-gray-500">
              Se guardará en: /upload/{section}/{selectedSubfolder}/
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subiendo...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tags">Etiquetas (opcional)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {customTags.map((tag) => (
            <div key={tag} className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-primary hover:text-primary/80"
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Añadir etiqueta"
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Añadir
          </Button>
        </div>
      </div>

      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
        {isUploading ? "Subiendo..." : "Subir archivo"}
      </Button>
    </div>
  )
}
