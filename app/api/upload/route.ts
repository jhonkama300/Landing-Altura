import { type NextRequest, NextResponse } from "next/server"
import { uploadFile, validateFile, ALLOWED_FILE_TYPES } from "@/lib/file-upload"
import { addHeroCarouselItem } from "@/lib/hero-db" // Mantener si aún se usa para hero

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Obtener datos del formulario
    const file = formData.get("file") as File
    const section = formData.get("section") as keyof typeof ALLOWED_FILE_TYPES
    const subfolder = formData.get("subfolder") as string // Usado para categorías de galería
    const tags = formData.get("tags") as string // JSON string

    // Validar parámetros
    if (!file) {
      return NextResponse.json({ success: false, message: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!section || !Object.keys(ALLOWED_FILE_TYPES).includes(section)) {
      return NextResponse.json(
        {
          success: false,
          message: `Sección no válida. Opciones: ${Object.keys(ALLOWED_FILE_TYPES).join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validar archivo
    const validation = validateFile(file, section, subfolder)
    if (!validation.valid) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    // Leer el archivo como buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Subir archivo
    const fileInfo = await uploadFile(buffer, file.name, file.type, section, subfolder)

    // Si es para el hero, agregar a la base de datos del hero (lógica existente)
    if (section === "hero") {
      try {
        const dbResult = await addHeroCarouselItem({
          title: fileInfo.originalName,
          description: `Archivo subido: ${fileInfo.originalName}`,
          imageUrl: fileInfo.publicUrl,
          imageType: fileInfo.mimeType,
          altText: fileInfo.originalName,
          overlay: false,
          overlayOpacity: 50,
          subfolder: subfolder,
          sortOrder: 0,
        })

        return NextResponse.json({
          success: true,
          message: "Archivo subido correctamente",
          data: {
            id: dbResult.uuid, // Asumiendo que addHeroCarouselItem devuelve un UUID
            filename: fileInfo.filename,
            url: fileInfo.publicUrl,
            type: fileInfo.mimeType,
            size: fileInfo.size,
            section: section,
            subfolder: subfolder,
            uploadDate: new Date().toISOString(),
            dimensions:
              fileInfo.width && fileInfo.height ? { width: fileInfo.width, height: fileInfo.height } : undefined,
            duration: fileInfo.duration,
            tags: tags ? JSON.parse(tags) : [],
          },
        })
      } catch (dbError) {
        console.error("Error guardando en base de datos (hero):", dbError)
        // El archivo se subió pero no se guardó en BD del hero
        return NextResponse.json({
          success: true,
          message: "Archivo subido pero no se pudo guardar en la base de datos del hero",
          data: {
            filename: fileInfo.filename,
            url: fileInfo.publicUrl,
            type: fileInfo.mimeType,
            size: fileInfo.size,
            section: section,
            subfolder: subfolder,
            uploadDate: new Date().toISOString(),
            dimensions:
              fileInfo.width && fileInfo.height ? { width: fileInfo.width, height: fileInfo.height } : undefined,
            duration: fileInfo.duration,
            tags: tags ? JSON.parse(tags) : [],
          },
        })
      }
    }

    // Para la sección 'gallery' o 'general', solo se sube el archivo y se devuelve la info.
    // La inserción en la DB de la galería se hará en otra API.
    return NextResponse.json({
      success: true,
      message: "Archivo subido correctamente",
      data: {
        filename: fileInfo.filename,
        url: fileInfo.publicUrl,
        type: fileInfo.mimeType,
        size: fileInfo.size,
        section: section,
        subfolder: subfolder,
        uploadDate: new Date().toISOString(),
        dimensions: fileInfo.width && fileInfo.height ? { width: fileInfo.width, height: fileInfo.height } : undefined,
        duration: fileInfo.duration,
        tags: tags ? JSON.parse(tags) : [],
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
