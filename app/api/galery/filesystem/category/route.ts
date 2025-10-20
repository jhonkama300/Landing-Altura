import { type NextRequest, NextResponse } from "next/server"
import { mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, message: "Nombre de categoría inválido" }, { status: 400 })
    }

    // Limpiar el nombre de la categoría (convertir a slug)
    const categorySlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")

    if (!categorySlug) {
      return NextResponse.json({ success: false, message: "Nombre de categoría inválido" }, { status: 400 })
    }

    // Crear la ruta de la carpeta de la categoría
    const categoryPath = path.join(process.cwd(), "public", "gallery", categorySlug)

    // Verificar si la carpeta ya existe
    if (existsSync(categoryPath)) {
      return NextResponse.json({ success: false, message: "La categoría ya existe" }, { status: 400 })
    }

    // Crear la carpeta
    await mkdir(categoryPath, { recursive: true })

    return NextResponse.json({
      success: true,
      message: "Categoría creada correctamente",
      data: {
        slug: categorySlug,
        name: name,
      },
    })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al crear la categoría",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
