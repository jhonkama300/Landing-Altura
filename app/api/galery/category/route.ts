import { NextResponse } from "next/server"
import { executeQuery, executeInsert } from "@/lib/database"

// GET: Obtener todas las categorías
export async function GET() {
  try {
    const categories = await executeQuery("SELECT * FROM gallery_categories ORDER BY name ASC")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ message: "Error al obtener categorías", error }, { status: 500 })
  }
}

// POST: Añadir una nueva categoría
export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    if (!name) {
      return NextResponse.json({ message: "El nombre de la categoría es obligatorio" }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "_")

    // Verificar si ya existe una categoría con el mismo slug
    const existingCategory = await executeQuery("SELECT id FROM gallery_categories WHERE slug = ?", [slug])
    if (existingCategory.length > 0) {
      return NextResponse.json({ message: "Ya existe una categoría con este nombre" }, { status: 409 })
    }

    const insertId = await executeInsert("INSERT INTO gallery_categories (name, slug) VALUES (?, ?)", [name, slug])

    return NextResponse.json({ id: insertId, name, slug, message: "Categoría añadida con éxito" }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir categoría:", error)
    return NextResponse.json({ message: "Error al añadir categoría", error }, { status: 500 })
  }
}

// DELETE: Eliminar una categoría
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const deleteAll = searchParams.get("all") === "true"

    if (deleteAll) {
      // Eliminar todas las imágenes primero
      await executeQuery("DELETE FROM gallery_images")
      // Luego eliminar todas las categorías
      const result = await executeQuery("DELETE FROM gallery_categories")
      return NextResponse.json({ message: "Todas las categorías y sus imágenes eliminadas con éxito" }, { status: 200 })
    }

    if (!id) {
      return NextResponse.json({ message: "El ID de la categoría es obligatorio" }, { status: 400 })
    }

    // Eliminar imágenes asociadas a la categoría primero
    await executeQuery("DELETE FROM gallery_images WHERE category_id = ?", [id])

    const result = await executeQuery("DELETE FROM gallery_categories WHERE id = ?", [id])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Categoría eliminada con éxito" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ message: "Error al eliminar categoría", error }, { status: 500 })
  }
}
