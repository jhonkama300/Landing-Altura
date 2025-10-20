import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ success: false, message: "No se proporcionó la ruta del archivo" }, { status: 400 })
    }

    // Construir la ruta completa del archivo
    const fullPath = path.join(process.cwd(), "public", filePath)

    // Verificar que el archivo existe
    if (!existsSync(fullPath)) {
      return NextResponse.json({ success: false, message: "El archivo no existe" }, { status: 404 })
    }

    // Eliminar el archivo
    await unlink(fullPath)

    return NextResponse.json({
      success: true,
      message: "Archivo eliminado correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al eliminar el archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
