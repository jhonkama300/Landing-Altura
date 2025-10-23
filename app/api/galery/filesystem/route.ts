import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Tipos para la galería basada en sistema de archivos
interface FileSystemGalleryImage {
  id: number
  category_id: number
  src: string
  alt: string
  title: string
  description?: string
  tags?: string[]
  type: "image" | "video"
  thumbnail_src?: string
  created_at?: string
  updated_at?: string
}

interface FileSystemGalleryCategory {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

interface FileSystemGalleryData {
  [categorySlug: string]: FileSystemGalleryImage[]
}

// Extensiones de archivo soportadas
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"]

// Función para generar un slug a partir del nombre de la carpeta
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]+/g, "-") // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, "") // Eliminar guiones al inicio y final
}

// Función para generar un título legible a partir del nombre del archivo
function generateTitle(filename: string): string {
  const nameWithoutExt = path.parse(filename).name
  return nameWithoutExt
    .replace(/[-_]/g, " ") // Reemplazar guiones y guiones bajos con espacios
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalizar primera letra de cada palabra
}

// Función para verificar si un archivo es una imagen
function isImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

// Función para verificar si un archivo es un video
function isVideo(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return VIDEO_EXTENSIONS.includes(ext)
}

// Función para escanear las carpetas y obtener las imágenes
async function scanGalleryFolders(): Promise<{
  categories: FileSystemGalleryCategory[]
  galleryData: FileSystemGalleryData
}> {
  const galleryPath = path.join(process.cwd(), "public", "gallery")

  try {
    // Verificar si la carpeta gallery existe
    await fs.access(galleryPath)
  } catch (error) {
    // Si no existe, crearla
    await fs.mkdir(galleryPath, { recursive: true })
    return { categories: [], galleryData: {} }
  }

  // Leer todas las carpetas dentro de public/gallery
  const folders = await fs.readdir(galleryPath, { withFileTypes: true })
  const categoryFolders = folders.filter((dirent) => dirent.isDirectory())

  const categories: FileSystemGalleryCategory[] = []
  const galleryData: FileSystemGalleryData = {}

  let categoryId = 1
  let imageId = 1

  // Iterar sobre cada carpeta (categoría)
  for (const folder of categoryFolders) {
    const categoryName = folder.name
    const categorySlug = generateSlug(categoryName)
    const categoryPath = path.join(galleryPath, categoryName)

    // Crear objeto de categoría
    const category: FileSystemGalleryCategory = {
      id: categoryId,
      name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), // Capitalizar primera letra
      slug: categorySlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    categories.push(category)

    // Leer todos los archivos dentro de la carpeta
    const files = await fs.readdir(categoryPath)
    const mediaFiles = files.filter((file) => isImage(file) || isVideo(file))

    // Crear objetos de imagen para cada archivo
    const images: FileSystemGalleryImage[] = mediaFiles.map((file, index) => {
      const isVideoFile = isVideo(file)
      const src = `/gallery/${categoryName}/${file}`

      return {
        id: imageId++,
        category_id: categoryId,
        src,
        alt: generateTitle(file),
        title: generateTitle(file),
        description: `Imagen de ${category.name}`,
        tags: [category.name],
        type: isVideoFile ? "video" : "image",
        thumbnail_src: isVideoFile ? undefined : src, // Para videos, se podría generar una miniatura
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    galleryData[categorySlug] = images
    categoryId++
  }

  return { categories, galleryData }
}

// GET: Obtener todas las imágenes organizadas por categoría desde el sistema de archivos
export async function GET() {
  try {
    const { categories, galleryData } = await scanGalleryFolders()
    return NextResponse.json({ categories, galleryData })
  } catch (error) {
    console.error("Error al escanear carpetas de galería:", error)
    return NextResponse.json(
      { message: "Error al escanear carpetas de galería", error: (error as Error).message },
      { status: 500 },
    )
  }
}
