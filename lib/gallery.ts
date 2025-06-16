// Biblioteca para gestionar los datos de la galería
import type { GalleryCategory, GalleryImage } from "@/lib/database" // Importar tipos de lib/database

// Tipo para la estructura de datos de la galería
export interface GalleryData {
  [categorySlug: string]: GalleryImage[]
}

// Obtener todas las categorías desde la API
export async function getAllCategories(): Promise<GalleryCategory[]> {
  try {
    const response = await fetch("/api/galery/category", { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: GalleryCategory[] = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    throw error
  }
}

// Obtener los datos de la galería (categorías e imágenes agrupadas) desde la API
export async function getGalleryData(): Promise<GalleryData> {
  try {
    const response = await fetch("/api/galery", { cache: "no-store" }) // Endpoint que devuelve categorías e imágenes agrupadas
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: GalleryData = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener los datos de la galería:", error)
    throw error
  }
}

// Añadir una nueva categoría
export async function addGalleryCategory(name: string): Promise<GalleryCategory> {
  try {
    const response = await fetch("/api/galery/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    const data: GalleryCategory = await response.json()
    return data
  } catch (error) {
    console.error("Error al añadir categoría:", error)
    throw error
  }
}

// Eliminar una categoría
export async function deleteGalleryCategory(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/galery/category?id=${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    return true
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    throw error
  }
}

// Añadir una imagen a una categoría
export async function addGalleryImage(
  categoryId: number,
  image: Omit<GalleryImage, "id" | "category_id">,
): Promise<GalleryImage> {
  try {
    const response = await fetch("/api/galery/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...image, category_id: categoryId }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    const data: GalleryImage = await response.json()
    return data
  } catch (error) {
    console.error("Error al añadir imagen:", error)
    throw error
  }
}

// Actualizar una imagen
export async function updateGalleryImage(image: GalleryImage): Promise<boolean> {
  try {
    const response = await fetch("/api/galery/image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(image),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    return true
  } catch (error) {
    console.error("Error al actualizar imagen:", error)
    throw error
  }
}

// Eliminar una imagen
export async function deleteGalleryImage(imageId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/galery/image?id=${imageId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    return true
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    throw error
  }
}

// Restablecer los datos de la galería a los valores por defecto
export async function resetGalleryData(): Promise<boolean> {
  try {
    // Eliminar todas las imágenes y categorías
    await fetch("/api/galery/category?all=true", { method: "DELETE" })

    // Definir datos por defecto (sin IDs, ya que la DB los generará)
    const defaultCategories = [
      { name: "Instalaciones", slug: "instalaciones" },
      { name: "Formación", slug: "formacion" },
      { name: "Equipos", slug: "equipos" },
    ]

    const defaultImages = {
      instalaciones: [
        {
          src: "/gallery/instalaciones-1.jpg",
          alt: "Centro de entrenamiento",
          title: "Centro de entrenamiento",
          description: "Nuestro moderno centro de entrenamiento para trabajo en altura",
        },
        {
          src: "/gallery/instalaciones-2.jpg",
          alt: "Aulas de formación",
          title: "Aulas de formación",
          description: "Espacios diseñados para el aprendizaje teórico",
        },
        {
          src: "/gallery/instalaciones-3.jpg",
          alt: "Torre de entrenamiento",
          title: "Torre de entrenamiento",
          description: "Estructura especializada para prácticas de altura",
        },
        {
          src: "/gallery/instalaciones-4.jpg",
          alt: "Área de prácticas",
          title: "Área de prácticas",
          description: "Zona segura para realizar ejercicios prácticos",
        },
      ],
      formacion: [
        {
          src: "/gallery/formacion-1.jpg",
          alt: "Entrenamiento práctico",
          title: "Entrenamiento práctico",
          description: "Estudiantes realizando ejercicios prácticos de altura",
        },
        {
          src: "/gallery/formacion-2.jpg",
          alt: "Capacitación teórica",
          title: "Capacitación teórica",
          description: "Sesiones teóricas sobre normativas y procedimientos",
        },
        {
          src: "/gallery/formacion-3.jpg",
          alt: "Ejercicios de rescate",
          title: "Ejercicios de rescate",
          description: "Prácticas de rescate en situaciones de emergencia",
        },
        {
          src: "/gallery/formacion-4.jpg",
          alt: "Prácticas de seguridad",
          title: "Prácticas de seguridad",
          description: "Aplicación de protocolos de seguridad en altura",
        },
      ],
      equipos: [
        {
          src: "/gallery/equipos-1.jpg",
          alt: "Equipos de protección",
          title: "Equipos de protección",
          description: "Equipos de protección personal para trabajo en altura",
        },
        {
          src: "/gallery/equipos-2.jpg",
          alt: "Arneses y líneas de vida",
          title: "Arneses y líneas de vida",
          description: "Sistemas de sujeción y protección contra caídas",
        },
        {
          src: "/gallery/equipos-3.jpg",
          alt: "Sistemas de anclaje",
          title: "Sistemas de anclaje",
          description: "Puntos de anclaje y sistemas de sujeción",
        },
        {
          src: "/gallery/equipos-4.jpg",
          alt: "Equipos de rescate",
          title: "Equipos de rescate",
          description: "Herramientas especializadas para rescate en altura",
        },
      ],
    }

    // Reinsertar categorías y obtener sus IDs
    const insertedCategories: { [slug: string]: number } = {}
    for (const cat of defaultCategories) {
      const newCat = await addGalleryCategory(cat.name)
      insertedCategories[newCat.slug] = newCat.id
    }

    // Reinsertar imágenes con los category_id correctos
    for (const categorySlug in defaultImages) {
      const categoryId = insertedCategories[categorySlug]
      if (categoryId) {
        for (const img of defaultImages[categorySlug as keyof typeof defaultImages]) {
          await addGalleryImage(categoryId, img)
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error al restablecer los datos de la galería:", error)
    throw error
  }
}
