import { type NextRequest, NextResponse } from "next/server"
import { getCompleteHeroData, saveCompleteHeroData } from "@/lib/hero-db-server"

export async function GET() {
  try {
    // Agregar un pequeño retraso para simular la carga (solo para desarrollo)
    // await new Promise(resolve => setTimeout(resolve, 500));

    const heroData = await getCompleteHeroData()

    if (!heroData) {
      console.log("No se encontró contenido del hero en la base de datos")
      return NextResponse.json(
        {
          success: false,
          message: "No se encontró contenido del hero",
          data: null, // Devolver null explícitamente
        },
        { status: 404 },
      )
    }

    // Transformar los datos al formato esperado por el frontend
    const transformedData = {
      title: heroData.title,
      subtitle: heroData.subtitle,
      companyName: heroData.company_name,
      description: heroData.description,
      layout: heroData.layout,
      textAlignment: heroData.text_alignment,
      verticalPosition: heroData.vertical_position,
      height: heroData.height,
      customHeight: heroData.custom_height,
      showScrollButton: heroData.show_scroll_button,
      customClass: heroData.custom_class,

      // Fondo
      background:
        heroData.backgrounds && heroData.backgrounds.length > 0
          ? {
              type: heroData.backgrounds[0].type,
              value: heroData.backgrounds[0].value,
              overlay: heroData.backgrounds[0].overlay,
              overlayOpacity: heroData.backgrounds[0].overlay_opacity,
            }
          : {
              type: "image",
              value: "/hero-background.jpg",
              overlay: true,
              overlayOpacity: 50,
            },

      // Para compatibilidad con el formato antiguo
      backgroundImage:
        heroData.backgrounds && heroData.backgrounds.length > 0
          ? heroData.backgrounds[0].value
          : "/hero-background.jpg",

      // Carrusel
      carousel: heroData.carousel
        ? {
            enabled: heroData.carousel.enabled,
            autoplay: heroData.carousel.autoplay,
            interval: heroData.carousel.interval_seconds,
            showControls: heroData.carousel.show_controls,
            showIndicators: heroData.carousel.show_indicators,
            effect: heroData.carousel.effect,
            images:
              heroData.carousel.images?.map((item) => ({
                url: item.url,
                type: item.type,
                alt: item.alt_text,
                overlay: item.overlay,
                overlayOpacity: item.overlay_opacity,
              })) || [],
          }
        : null,

      // Textos
      texts: heroData.texts
        ? heroData.texts.map((text) => ({
            id: text.id?.toString(),
            type: text.type,
            content: text.content,
            customClass: text.custom_class,
            position: text.position,
            top: text.position_top,
            left: text.position_left,
            right: text.position_right,
            bottom: text.position_bottom,
            customStyle: text.custom_style ? JSON.parse(text.custom_style) : null,
            animation: {
              enabled: text.animation_enabled,
              type: text.animation_type,
              delay: text.animation_delay,
              duration: text.animation_duration,
            },
          }))
        : [],

      // Botones
      buttons: heroData.buttons
        ? heroData.buttons.map((button) => ({
            id: button.id?.toString(),
            text: button.text,
            url: button.url,
            variant: button.variant,
            size: button.size,
            icon: button.icon,
            position: button.icon_position,
            customClass: button.custom_class,
            animation: {
              type: button.animation_type,
              delay: button.animation_delay,
              duration: button.animation_duration,
            },
          }))
        : [],
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
    })
  } catch (error) {
    console.error("Error obteniendo datos del hero:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const heroId = await saveCompleteHeroData(data)

    return NextResponse.json({
      success: true,
      message: "Datos del hero guardados correctamente",
      heroId,
    })
  } catch (error) {
    console.error("Error guardando datos del hero:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
