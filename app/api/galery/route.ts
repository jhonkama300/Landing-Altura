import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import type { GalleryCategory, GalleryImage } from "@/lib/database"

export async function GET() {
  try {
    // Obtener todas las categorías
    const categories: GalleryCategory[] = await executeQuery("SELECT * FROM gallery_categories ORDER BY name ASC")

    // Obtener todas las imágenes
    const images: GalleryImage[] = await executeQuery("SELECT * FROM gallery_images ORDER BY created_at DESC")

    // Mapear imágenes a sus categorías y parsear tags
    const galleryData: { [slug: string]: GalleryImage[] } = {}

    categories.forEach((category) => {
      galleryData[category.slug] = images
        .filter((image) => image.category_id === category.id)
        .map((img: any) => ({
          ...img,
          tags: img.tags ? JSON.parse(img.tags) : [],
        }))
    })

    return NextResponse.json(galleryData)
  } catch (error) {
    console.error("Error al obtener datos de la galería:", error)
    return NextResponse.json({ message: "Error al obtener datos de la galería", error }, { status: 500 })
  }
}
