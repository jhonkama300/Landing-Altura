import { type NextRequest, NextResponse } from "next/server"
import { deleteFile } from "@/lib/file-upload"
import { executeQuery } from "@/lib/database-server"

export async function POST(request: NextRequest) {
  try {
    const { id, filePath, section, subfolder } = await request.json()

    if (!filePath) {
      return NextResponse.json({ success: false, message: "Ruta de archivo no proporcionada" }, { status: 400 })
    }

    // Construir la ruta completa relativa a `public`
    let fullPublicPath = filePath
    // Si la ruta no empieza con la sección, la construimos
    if (!fullPublicPath.startsWith(`/${section}/`)) {
      fullPublicPath = `/${section}/${subfolder ? subfolder + "/" : ""}${filePath.split("/").pop()}`
    }

    // Eliminar el archivo del sistema de archivos
    const fileDeleted = await deleteFile(fullPublicPath)

    if (!fileDeleted) {
      // Si el archivo no se pudo eliminar del disco, pero no es un error de "no existe",
      // podríamos querer detener la eliminación de la DB o registrar un error.
      // Por ahora, continuamos para eliminar de la DB si el archivo no existe en disco.
      console.warn(`No se pudo eliminar el archivo físico: ${fullPublicPath}. Puede que ya no exista.`)
    }

    // Si se proporciona un ID, intentar eliminar de la base de datos
    if (id) {
      // Lógica específica para eliminar de la tabla `gallery_images`
      if (section === "gallery") {
        const deleteDbResult = await executeQuery("DELETE FROM gallery_images WHERE id = ?", [id])
        if ((deleteDbResult as any).affectedRows === 0) {
          console.warn(`No se encontró la imagen de galería con ID ${id} en la base de datos.`)
        }
      } else if (section === "hero") {
        // Lógica para eliminar de la tabla `hero_carousel_items`
        // Asumiendo que el ID para hero es un UUID y se almacena como `uuid`
        const deleteDbResult = await executeQuery("DELETE FROM hero_carousel_items WHERE uuid = ?", [id])
        if ((deleteDbResult as any).affectedRows === 0) {
          console.warn(`No se encontró el elemento del carrusel del hero con ID ${id} en la base de datos.`)
        }
      }
      // Puedes añadir más secciones aquí si es necesario
    }

    return NextResponse.json({ success: true, message: "Archivo y registro eliminados correctamente" })
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la eliminación del archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
