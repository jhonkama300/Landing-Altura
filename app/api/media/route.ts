import { type NextRequest, NextResponse } from "next/server"
import { getHeroMedia, getAllMedia } from "@/lib/hero-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")
    const subfolder = searchParams.get("subfolder")
    const type = searchParams.get("type") // image, video

    let media = []

    if (section === "hero") {
      // Obtener medios específicos del hero
      media = await getHeroMedia(subfolder, type)
    } else {
      // Obtener todos los medios
      media = await getAllMedia(section, subfolder, type)
    }

    return NextResponse.json({
      success: true,
      data: media,
    })
  } catch (error) {
    console.error("Error obteniendo medios:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener los medios",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
