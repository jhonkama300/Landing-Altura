"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, AlertCircle, Check, Loader2 } from "lucide-react"
import { FOLDER_STRUCTURE, ALLOWED_FILE_TYPES } from "@/lib/media-constants"

interface FileUploadProps {
  section: keyof typeof ALLOWED_FILE_TYPES
  subfolder?: string
  onUploadComplete?: (fileInfo: {
    publicUrl: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number
    height?: number
  }) => void
  buttonText?: string
  className?: string
}

export function FileUpload({
  section,
  subfolder,
  onUploadComplete,
  buttonText = "Subir archivo",
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>(subfolder || FOLDER_STRUCTURE[section][0])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Obtener los tipos de archivo permitidos para esta sección
  const allowedTypes = ALLOWED_FILE_TYPES[section]
  const allowedExtensions = allowedTypes.map((type) => type.split("/")[1]).join(", ")

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
      setError(`Tipo de archivo no permitido. Tipos permitidos: ${allowedExtensions}`)
      return false
    }

    // Validar tamaño de archivo (10MB máximo)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Tamaño máximo: 10MB`)
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
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 200)

      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("section", section)
      formData.append("subfolder", selectedSubfolder)

      // Enviar archivo al servidor
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          if (onUploadComplete) {
            onUploadComplete(result.file)
          }
          // Limpiar después de completar
          setFile(null)
          setPreview(null)
          setProgress(0)
        }, 1000)
      } else {
        setError(result.message || "Error al subir el archivo")
      }
    } catch (err) {
      console.error("Error al subir el archivo:", err)
      setError("Error al subir el archivo. Verifica la conexión.")
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

  return (
    <div className={`space-y-4 ${className}`}>
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

      {!subfolder && (
        <div className="space-y-2">
          <Label htmlFor="subfolder">Subcarpeta</Label>
          <Select value={selectedSubfolder} onValueChange={setSelectedSubfolder}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una subcarpeta" />
            </SelectTrigger>
            <SelectContent>
              {FOLDER_STRUCTURE[section].map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          <p className="mt-2 text-sm font-medium">Arrastra y suelta un archivo aquí, o haz clic para seleccionar</p>
          <p className="mt-1 text-xs text-gray-500">Formatos permitidos: {allowedExtensions}</p>
          <p className="text-xs text-gray-500">Tamaño máximo: 10MB</p>
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
          {file?.type.startsWith("image/") ? (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-contain bg-gray-50" />
          ) : file?.type.startsWith("video/") ? (
            <video src={preview} className="w-full h-64 object-contain bg-gray-50" controls />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">{file?.name}</p>
            </div>
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

      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  )
}
