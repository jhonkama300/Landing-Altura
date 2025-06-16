"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, AlertCircle, Check } from "lucide-react"
import { addImage } from "@/lib/images"

interface ImageUploadProps {
  onUploadComplete?: (imageId: string) => void
  allowedTypes?: string[]
  maxSizeMB?: number
  tags?: string[]
}

export function ImageUpload({
  onUploadComplete,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  maxSizeMB = 5,
  tags = [],
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [customTags, setCustomTags] = useState<string[]>(tags)
  const [tagInput, setTagInput] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(", ")}`)
      return false
    }

    // Validar tamaño de archivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024
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

    try {
      const result = await addImage(file, customTags)

      if (result) {
        setSuccess(true)
        setFile(null)
        setPreview(null)
        if (onUploadComplete) {
          onUploadComplete(result.id)
        }
      } else {
        setError("Error al subir la imagen")
      }
    } catch (err) {
      console.error("Error al subir la imagen:", err)
      setError("Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setSuccess(false)
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
          <AlertDescription>Imagen subida correctamente</AlertDescription>
        </Alert>
      )}

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
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 text-sm font-medium">Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
          <p className="mt-1 text-xs text-gray-500">
            Formatos permitidos: {allowedTypes.map((type) => type.split("/")[1]).join(", ")}
          </p>
          <p className="text-xs text-gray-500">Tamaño máximo: {maxSizeMB}MB</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-contain bg-gray-50" />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70"
            aria-label="Eliminar imagen"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="p-3 bg-white">
            <p className="font-medium truncate">{file?.name}</p>
            <p className="text-sm text-gray-500">{file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB</p>
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
        {isUploading ? "Subiendo..." : "Subir imagen"}
      </Button>
    </div>
  )
}
