// Gestión de imágenes para el demo
// En una aplicación real, esto se conectaría a un backend

export interface ImageInfo {
  id: string
  name: string
  url: string
  type: string
  size: number
  tags: string[]
  section: string
  subfolder: string
  uploadDate: string
  dimensions?: {
    width: number
    height: number
  }
  duration?: number // Para videos
}

// Función para obtener imágenes desde la API
export async function getImages(section?: string, subfolder?: string): Promise<ImageInfo[]> {
  try {
    const params = new URLSearchParams()
    if (section) params.append("section", section)
    if (subfolder) params.append("subfolder", subfolder)

    const response = await fetch(`/api/media?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Error al obtener las imágenes")
    }

    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error obteniendo imágenes:", error)
    return []
  }
}

// Función para subir una imagen usando el nuevo sistema
export async function addImage(
  file: File,
  tags: string[] = [],
  section = "general",
  subfolder = "images",
): Promise<ImageInfo | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("section", section)
    formData.append("subfolder", subfolder)
    formData.append("tags", JSON.stringify(tags))

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error al subir la imagen")
    }

    const result = await response.json()

    if (result.success) {
      return {
        id: result.data.id,
        name: result.data.filename,
        url: result.data.url,
        type: result.data.type,
        size: result.data.size,
        tags: result.data.tags || [],
        section: result.data.section,
        subfolder: result.data.subfolder,
        uploadDate: result.data.uploadDate,
        dimensions: result.data.dimensions,
      }
    }

    return null
  } catch (error) {
    console.error("Error subiendo imagen:", error)
    return null
  }
}

// Función para subir un video usando el nuevo sistema
export async function addVideo(
  file: File,
  tags: string[] = [],
  section = "general",
  subfolder = "videos",
): Promise<ImageInfo | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("section", section)
    formData.append("subfolder", subfolder)
    formData.append("tags", JSON.stringify(tags))

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error al subir el video")
    }

    const result = await response.json()

    if (result.success) {
      return {
        id: result.data.id,
        name: result.data.filename,
        url: result.data.url,
        type: result.data.type,
        size: result.data.size,
        tags: result.data.tags || [],
        section: result.data.section,
        subfolder: result.data.subfolder,
        uploadDate: result.data.uploadDate,
        duration: result.data.duration,
      }
    }

    return null
  } catch (error) {
    console.error("Error subiendo video:", error)
    return null
  }
}

// Función para eliminar una imagen
export async function deleteImage(id: string, filePath: string): Promise<boolean> {
  try {
    const response = await fetch("/api/upload/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, filePath }),
    })

    if (!response.ok) {
      throw new Error("Error al eliminar la imagen")
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("Error eliminando imagen:", error)
    return false
  }
}

// Función para buscar imágenes
export async function searchImages(query: string, section?: string): Promise<ImageInfo[]> {
  try {
    const params = new URLSearchParams()
    params.append("search", query)
    if (section) params.append("section", section)

    const response = await fetch(`/api/media/search?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Error al buscar imágenes")
    }

    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error buscando imágenes:", error)
    return []
  }
}

// Función para obtener imágenes por etiqueta
export async function getImagesByTag(tag: string): Promise<ImageInfo[]> {
  try {
    const response = await fetch(`/api/media/tag/${encodeURIComponent(tag)}`)

    if (!response.ok) {
      throw new Error("Error al obtener imágenes por etiqueta")
    }

    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error obteniendo imágenes por etiqueta:", error)
    return []
  }
}
