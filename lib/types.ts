// Tipos para la galería y contenido sin dependencia de MySQL

export interface GalleryImage {
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

export interface GalleryCategory {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface GalleryData {
  [categorySlug: string]: GalleryImage[]
}

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  alt?: string
  title?: string
  category?: string
  created_at?: string
}
