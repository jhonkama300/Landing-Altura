import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { promisify } from "util"
import { exec } from "child_process"

const execAsync = promisify(exec)

// Tipos de archivos permitidos por sección
export const ALLOWED_FILE_TYPES = {
  hero: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
  about: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  services: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  gallery: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  certifications: ["image/jpeg", "image/png", "image/webp", "image/pdf"],
  contact: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  navbar: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  features: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
}

// Tamaños máximos por sección (en bytes)
export const MAX_FILE_SIZES = {
  hero: 100 * 1024 * 1024, // 10MB
  about: 10 * 1024 * 1024, // 5MB
  services: 10 * 1024 * 1024, // 5MB
  gallery: 20 * 1024 * 1024, // 8MB
  certifications: 3 * 1024 * 1024, // 3MB
  contact: 2 * 1024 * 1024, // 2MB
  navbar: 10 * 1024 * 1024, // 1MB
  features: 10 * 1024 * 1024, // 2MB
}

// Estructura de carpetas por sección
export const FOLDER_STRUCTURE = {
  hero: ["backgrounds", "carousel"],
  about: ["main", "team", "facilities"],
  services: ["thumbnails", "icons", "gallery"],
  gallery: ["instalaciones", "formacion", "equipos"],
  certifications: ["logos", "certificates"],
  contact: ["maps", "icons"],
  navbar: ["logos", "icons"],
  features: ["icons", "images"],
}

// Interfaz para la información del archivo subido
export interface UploadedFileInfo {
  filename: string
  originalName: string
  path: string
  publicUrl: string
  mimeType: string
  size: number
  width?: number
  height?: number
  duration?: number
}

/**
 * Asegura que exista la estructura de carpetas para uploads
 */
export async function ensureUploadFolders() {
  const baseDir = path.join(process.cwd(), "public", "upload")

  // Crear carpeta base si no existe
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  // Crear estructura de carpetas por sección
  for (const [section, subfolders] of Object.entries(FOLDER_STRUCTURE)) {
    const sectionDir = path.join(baseDir, section)

    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true })
    }

    for (const subfolder of subfolders) {
      const subfolderDir = path.join(sectionDir, subfolder)
      if (!fs.existsSync(subfolderDir)) {
        fs.mkdirSync(subfolderDir, { recursive: true })
      }
    }
  }
}

/**
 * Valida un archivo antes de subirlo
 */
export function validateFile(
  file: File,
  section: keyof typeof ALLOWED_FILE_TYPES,
  subfolder?: string,
): { valid: boolean; error?: string } {
  // Verificar tipo de archivo
  if (!ALLOWED_FILE_TYPES[section].includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${ALLOWED_FILE_TYPES[section]
        .map((type) => type.split("/")[1])
        .join(", ")}`,
    }
  }

  // Verificar tamaño de archivo
  if (file.size > MAX_FILE_SIZES[section]) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZES[section] / (1024 * 1024)}MB`,
    }
  }

  // Verificar subfolder válido
  if (subfolder && !FOLDER_STRUCTURE[section].includes(subfolder)) {
    return {
      valid: false,
      error: `Subcarpeta no válida. Opciones: ${FOLDER_STRUCTURE[section].join(", ")}`,
    }
  }

  return { valid: true }
}

/**
 * Sube un archivo al servidor
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  mimeType: string,
  section: keyof typeof ALLOWED_FILE_TYPES,
  subfolder: string = FOLDER_STRUCTURE[section][0],
): Promise<UploadedFileInfo> {
  await ensureUploadFolders()

  // Generar nombre de archivo único
  const fileExt = fileName.split(".").pop() || "jpg"
  const uniqueFileName = `${uuidv4().substring(0, 8)}-${Date.now()}.${fileExt}`

  // Definir rutas
  const relativePath = path.join("upload", section, subfolder, uniqueFileName)
  const absolutePath = path.join(process.cwd(), "public", relativePath)

  // Guardar el archivo
  fs.writeFileSync(absolutePath, file)

  // Obtener información del archivo
  const stats = fs.statSync(absolutePath)
  const fileInfo: UploadedFileInfo = {
    filename: uniqueFileName,
    originalName: fileName,
    path: relativePath,
    publicUrl: `/${relativePath.replace(/\\/g, "/")}`,
    mimeType,
    size: stats.size,
  }

  // Si es una imagen, obtener dimensiones
  if (mimeType.startsWith("image/")) {
    try {
      // Usar ImageMagick para obtener dimensiones (requiere que esté instalado)
      const { stdout } = await execAsync(`identify -format "%w %h" "${absolutePath}"`)
      const [width, height] = stdout.trim().split(" ").map(Number)

      if (!isNaN(width) && !isNaN(height)) {
        fileInfo.width = width
        fileInfo.height = height
      }
    } catch (error) {
      console.warn("No se pudieron obtener dimensiones de la imagen:", error)
    }
  }

  // Si es un video, obtener duración
  if (mimeType.startsWith("video/")) {
    try {
      // Usar ffprobe para obtener duración (requiere que ffmpeg esté instalado)
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${absolutePath}"`,
      )
      const duration = Number.parseFloat(stdout.trim())

      if (!isNaN(duration)) {
        fileInfo.duration = Math.round(duration)
      }
    } catch (error) {
      console.warn("No se pudo obtener duración del video:", error)
    }
  }

  return fileInfo
}

/**
 * Elimina un archivo del servidor
 */
export function deleteFile(filePath: string): boolean {
  try {
    const absolutePath = path.join(process.cwd(), "public", filePath)

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath)
      return true
    }

    return false
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    return false
  }
}

/**
 * Mueve un archivo a otra ubicación
 */
export function moveFile(
  currentPath: string,
  newSection: keyof typeof ALLOWED_FILE_TYPES,
  newSubfolder: string,
): string | null {
  try {
    const fileName = path.basename(currentPath)
    const currentAbsolutePath = path.join(process.cwd(), "public", currentPath)

    // Verificar que el archivo existe
    if (!fs.existsSync(currentAbsolutePath)) {
      return null
    }

    // Crear nueva ruta
    const newRelativePath = path.join("upload", newSection, newSubfolder, fileName)
    const newAbsolutePath = path.join(process.cwd(), "public", newRelativePath)

    // Asegurar que la carpeta destino existe
    const destDir = path.dirname(newAbsolutePath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // Mover el archivo
    fs.renameSync(currentAbsolutePath, newAbsolutePath)

    return `/${newRelativePath.replace(/\\/g, "/")}`
  } catch (error) {
    console.error("Error al mover archivo:", error)
    return null
  }
}
