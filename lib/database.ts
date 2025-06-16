// Configuración de la base de datos MySQL
import mysql from "mysql2/promise"

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || "162.211.80.32",
  user: process.env.DB_USER || "sa1df687_altura",
  password: process.env.DB_PASSWORD || "1L4hxfhc@",
  database: process.env.DB_NAME || "sa1df687_altura_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
}

// Pool de conexiones
let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Función para ejecutar consultas
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const connection = getPool()
    const [rows] = await connection.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Error ejecutando consulta:", error)
    throw error
  }
}

// Función para ejecutar una consulta que devuelve un solo resultado
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Función para insertar y obtener el ID
export async function executeInsert(query: string, params: any[] = []): Promise<number> {
  try {
    const connection = getPool()
    const [result] = await connection.execute(query, params)
    return (result as any).insertId
  } catch (error) {
    console.error("Error ejecutando inserción:", error)
    throw error
  }
}

// Función para transacciones
export async function executeTransaction(queries: Array<{ query: string; params: any[] }>): Promise<any[]> {
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    const results = []
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params)
      results.push(result)
    }

    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Tipos para las tablas del hero
export interface HeroContent {
  id?: number
  title: string
  subtitle?: string
  company_name?: string
  description?: string
  layout: "centered" | "left" | "right" | "split"
  text_alignment: "left" | "center" | "right"
  vertical_position: "top" | "middle" | "bottom"
  height: "full" | "large" | "medium" | "small" | "custom"
  custom_height?: string
  show_scroll_button: boolean
  custom_class?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface HeroBackground {
  id?: number
  hero_id: number
  type: "color" | "image" | "video" | "gradient"
  value: string
  overlay: boolean
  overlay_opacity: number
  sort_order: number
  is_active: boolean
  created_at?: string
}

export interface HeroCarousel {
  id?: number
  hero_id: number
  enabled: boolean
  autoplay: boolean
  interval_seconds: number
  show_controls: boolean
  show_indicators: boolean
  effect: "fade" | "slide"
  created_at?: string
}

export interface HeroCarouselItem {
  id?: number
  carousel_id: number
  type: "image" | "video"
  url: string
  alt_text?: string
  overlay: boolean
  overlay_opacity: number
  sort_order: number
  is_active: boolean
  created_at?: string
}

export interface HeroText {
  id?: number
  hero_id: number
  type: "title" | "subtitle" | "companyName" | "description" | "custom"
  content: string
  custom_class?: string
  position: "relative" | "absolute"
  position_top?: string
  position_left?: string
  position_right?: string
  position_bottom?: string
  custom_style?: any
  animation_enabled: boolean
  animation_type: string
  animation_delay: number
  animation_duration: number
  sort_order: number
  is_active: boolean
  created_at?: string
}

export interface HeroButton {
  id?: number
  hero_id: number
  text: string
  url: string
  variant: "primary" | "secondary" | "accent" | "outline" | "ghost"
  size: "sm" | "default" | "lg"
  icon?: string
  icon_position: "left" | "right"
  custom_class?: string
  animation_type: string
  animation_delay: number
  animation_duration: number
  sort_order: number
  is_active: boolean
  created_at?: string
}

// Nuevos tipos para la galería
export interface GalleryCategory {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface GalleryImage {
  id: number
  category_id: number
  src: string
  alt: string
  title: string
  description?: string
  tags?: string[] // JSON en la DB, array en TS
  type: "image" | "video" // Añadido para soporte de video
  thumbnail_src?: string // Añadido para miniaturas de video
  created_at?: string
  updated_at?: string
}
