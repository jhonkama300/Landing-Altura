// Biblioteca para gestionar los datos de la galería desde el sistema de archivos
import type { GalleryCategory, GalleryImage } from "@/lib/database"

// Tipo para la estructura de datos de la galería
export interface GalleryData {
  [categorySlug: string]: GalleryImage[]
}

// Obtener todas las categorías desde el sistema de archivos
export async function getAllCategoriesFromFileSystem(): Promise<GalleryCategory[]> {
  try {
    const response = await fetch("/api/galery/filesystem/categories", { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: GalleryCategory[] = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener categorías desde el sistema de archivos:", error)
    throw error
  }
}

// Obtener los datos de la galería desde el sistema de archivos
export async function getGalleryDataFromFileSystem(): Promise<GalleryData> {
  try {
    const response = await fetch("/api/galery/filesystem", { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: GalleryData = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener los datos de la galería desde el sistema de archivos:", error)
    throw error
  }
}
