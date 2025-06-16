import { NextResponse } from "next/server"
import { executeQuery, executeInsert } from "@/lib/database"

// GET: Obtener imágenes por categoría o todas las imágenes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    let query = "SELECT * FROM gallery_images"
    const params: any[] = []

    if (categoryId) {
      query += " WHERE category_id = ?"
      params.push(categoryId)
    }

    query += " ORDER BY created_at DESC"

    const images = await executeQuery(query, params)

    // Parsear el campo 'tags' si existe
    const parsedImages = images.map((img: any) => ({
      ...img,
      tags: img.tags ? JSON.parse(img.tags) : [],
    }))

    return NextResponse.json(parsedImages)
  } catch (error) {
    console.error("Error al obtener imágenes:", error)
    return NextResponse.json({ message: "Error al obtener imágenes", error }, { status: 500 })
  }
}

// POST: Añadir una nueva imagen
export async function POST(req: Request) {
  try {
    const { category_id, src, alt, title, description, tags } = await req.json()

    if (!category_id || !src || !alt || !title) {
      return NextResponse.json({ message: "category_id, src, alt y title son campos obligatorios" }, { status: 400 })
    }

    const insertId = await executeInsert(
      "INSERT INTO gallery_images (category_id, src, alt, title, description, tags) VALUES (?, ?, ?, ?, ?, ?)",
      [category_id, src, alt, title, description, tags ? JSON.stringify(tags) : null],
    )

    return NextResponse.json({ id: insertId, message: "Imagen añadida con éxito" }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir imagen:", error)
    return NextResponse.json({ message: "Error al añadir imagen", error }, { status: 500 })
  }
}

// PUT: Actualizar una imagen existente
export async function PUT(req: Request) {
  try {
    const { id, category_id, src, alt, title, description, tags } = await req.json()

    if (!id || !category_id || !src || !alt || !title) {
      return NextResponse.json(
        { message: "id, category_id, src, alt y title son campos obligatorios" },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      "UPDATE gallery_images SET category_id = ?, src = ?, alt = ?, title = ?, description = ?, tags = ? WHERE id = ?",
      [category_id, src, alt, title, description, tags ? JSON.stringify(tags) : null, id],
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Imagen actualizada con éxito" }, { status: 200 })
  } catch (error) {
    console.error("Error al actualizar imagen:", error)
    return NextResponse.json({ message: "Error al actualizar imagen", error }, { status: 500 })
  }
}

// DELETE: Eliminar una imagen
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "El ID de la imagen es obligatorio" }, { status: 400 })
    }

    const result = await executeQuery("DELETE FROM gallery_images WHERE id = ?", [id])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Imagen eliminada con éxito" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return NextResponse.json({ message: "Error al eliminar imagen", error }, { status: 500 })
  }
}
