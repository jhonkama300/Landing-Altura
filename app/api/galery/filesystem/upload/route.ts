import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ success: false, message: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ success: false, message: "No se proporcionó ninguna categoría" }, { status: 400 })
    }

    // Crear la ruta de la carpeta de la categoría
    const categoryPath = path.join(process.cwd(), "public", "gallery", category)

    // Crear la carpeta si no existe
    if (!existsSync(categoryPath)) {
      await mkdir(categoryPath, { recursive: true })
    }

    // Obtener el buffer del archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generar un nombre único para el archivo
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`
    const filePath = path.join(categoryPath, fileName)

    // Guardar el archivo
    await writeFile(filePath, buffer)

    // Retornar la URL pública del archivo
    const publicUrl = `/gallery/${category}/${fileName}`

    return NextResponse.json({
      success: true,
      message: "Archivo subido correctamente",
      data: {
        url: publicUrl,
        filename: fileName,
        category: category,
      },
    })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la subida del archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
