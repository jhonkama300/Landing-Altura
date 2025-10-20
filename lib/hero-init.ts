// Función para inicializar los datos del hero con valores por defecto
import { executeQuery, executeInsert } from "@/lib/database"

export async function initializeHeroData() {
  try {
    // Verificar si ya existen datos del hero
    const existingHero = await executeQuery("SELECT * FROM hero_content WHERE is_active = 1 LIMIT 1")

    if (existingHero.length > 0) {
      console.log("Hero data already exists, skipping initialization")
      return
    }

    // Insertar contenido principal del hero
    const heroId = await executeInsert(
      `INSERT INTO hero_content (
        title, 
        subtitle, 
        company_name, 
        description, 
        layout, 
        text_alignment, 
        vertical_position, 
        height, 
        show_scroll_button, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Trabajo Seguro en Altura",
        "Centro de Entrenamiento Certificado",
        "ALTURA UPARSISTEM",
        "Formación especializada en trabajo seguro en altura, certificados en calidad NTC 6052:2014 ICONTEC",
        "centered",
        "center",
        "middle",
        "full",
        true,
        true,
      ],
    )

    // Insertar background por defecto
    await executeInsert(
      `INSERT INTO hero_backgrounds (
        hero_id, 
        type, 
        value, 
        overlay, 
        overlay_opacity, 
        sort_order, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [heroId, "gradient", "linear-gradient(135deg, #0a3c4b 0%, #bad834 100%)", true, 0.3, 1, true],
    )

    // Insertar configuración del carrusel
    const carouselId = await executeInsert(
      `INSERT INTO hero_carousel (
        hero_id, 
        enabled, 
        autoplay, 
        interval_seconds, 
        show_controls, 
        show_indicators, 
        effect
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [heroId, false, true, 5, true, true, "fade"],
    )

    // Insertar textos del hero
    await executeInsert(
      `INSERT INTO hero_texts (
        hero_id, 
        type, 
        content, 
        position, 
        animation_enabled, 
        animation_type, 
        animation_delay, 
        animation_duration, 
        sort_order, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [heroId, "title", "Trabajo Seguro en Altura", "relative", true, "fade-up", 0, 1000, 1, true],
    )

    await executeInsert(
      `INSERT INTO hero_texts (
        hero_id, 
        type, 
        content, 
        position, 
        animation_enabled, 
        animation_type, 
        animation_delay, 
        animation_duration, 
        sort_order, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [heroId, "subtitle", "Centro de Entrenamiento Certificado", "relative", true, "fade-up", 200, 1000, 2, true],
    )

    // Insertar botones del hero
    await executeInsert(
      `INSERT INTO hero_buttons (
        hero_id, 
        text, 
        url, 
        variant, 
        size, 
        icon_position, 
        animation_type, 
        animation_delay, 
        animation_duration, 
        sort_order, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [heroId, "Nuestros Servicios", "#services", "primary", "lg", "right", "fade-up", 400, 1000, 1, true],
    )

    await executeInsert(
      `INSERT INTO hero_buttons (
        hero_id, 
        text, 
        url, 
        variant, 
        size, 
        icon_position, 
        animation_type, 
        animation_delay, 
        animation_duration, 
        sort_order, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [heroId, "Contáctanos", "#contact", "secondary", "lg", "right", "fade-up", 600, 1000, 2, true],
    )

    console.log("Hero data initialized successfully")
  } catch (error) {
    console.error("Error initializing hero data:", error)
    throw error
  }
}
