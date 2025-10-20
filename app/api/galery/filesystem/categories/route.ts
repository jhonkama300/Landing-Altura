import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Tipos para la galería basada en sistema de archivos
interface FileSystemGalleryCategory {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

// Función para generar un slug a partir del nombre de la carpeta
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]+/g, "-") // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, "") // Eliminar guiones al inicio y final
}

// Función para escanear las carpetas y obtener las categorías
async function scanGalleryCategories(): Promise<FileSystemGalleryCategory[]> {
  const galleryPath = path.join(process.cwd(), "public", "gallery")

  try {
    // Verificar si la carpeta gallery existe
    await fs.access(galleryPath)
  } catch (error) {
    // Si no existe, crearla
    await fs.mkdir(galleryPath, { recursive: true })
    return []
  }

  // Leer todas las carpetas dentro de public/gallery
  const folders = await fs.readdir(galleryPath, { withFileTypes: true })
  const categoryFolders = folders.filter((dirent) => dirent.isDirectory())

  const categories: FileSystemGalleryCategory[] = []
  let categoryId = 1

  // Iterar sobre cada carpeta (categoría)
  for (const folder of categoryFolders) {
    const categoryName = folder.name
    const categorySlug = generateSlug(categoryName)

    // Crear objeto de categoría
    const category: FileSystemGalleryCategory = {
      id: categoryId,
      name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), // Capitalizar primera letra
      slug: categorySlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    categories.push(category)
    categoryId++
  }

  return categories
}

// GET: Obtener todas las categorías desde el sistema de archivos
export async function GET() {
  try {
    const categories = await scanGalleryCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al escanear categorías de galería:", error)
    return NextResponse.json(
      { message: "Error al escanear categorías de galería", error: (error as Error).message },
      { status: 500 },
    )
  }
}
