// Funciones para manejar los datos del hero en la base de datos
import {
  executeQuery,
  executeQuerySingle,
  executeInsert,
  type HeroContent,
  type HeroBackground,
  type HeroCarousel,
  type HeroCarouselItem,
  type HeroText,
  type HeroButton,
} from "./database"
// Corregir la importación de crypto
import { randomUUID } from "crypto"

// =============================================
// FUNCIONES PARA HERO CONTENT
// =============================================

export async function getHeroContent(): Promise<HeroContent | null> {
  const query = `
    SELECT * FROM hero_content 
    WHERE is_active = TRUE 
    ORDER BY created_at DESC 
    LIMIT 1
  `
  return await executeQuerySingle<HeroContent>(query)
}

export async function createHeroContent(data: Omit<HeroContent, "id" | "created_at" | "updated_at">): Promise<number> {
  const query = `
    INSERT INTO hero_content (
      title, subtitle, company_name, description, layout, text_alignment, 
      vertical_position, height, custom_height, show_scroll_button, 
      custom_class, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.title,
    data.subtitle || null,
    data.company_name || null,
    data.description || null,
    data.layout,
    data.text_alignment,
    data.vertical_position,
    data.height,
    data.custom_height || null,
    data.show_scroll_button,
    data.custom_class || null,
    data.is_active,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroContent(id: number, data: Partial<HeroContent>): Promise<void> {
  const fields = []
  const params = []

  if (data.title !== undefined) {
    fields.push("title = ?")
    params.push(data.title)
  }
  if (data.subtitle !== undefined) {
    fields.push("subtitle = ?")
    params.push(data.subtitle)
  }
  if (data.company_name !== undefined) {
    fields.push("company_name = ?")
    params.push(data.company_name)
  }
  if (data.description !== undefined) {
    fields.push("description = ?")
    params.push(data.description)
  }
  if (data.layout !== undefined) {
    fields.push("layout = ?")
    params.push(data.layout)
  }
  if (data.text_alignment !== undefined) {
    fields.push("text_alignment = ?")
    params.push(data.text_alignment)
  }
  if (data.vertical_position !== undefined) {
    fields.push("vertical_position = ?")
    params.push(data.vertical_position)
  }
  if (data.height !== undefined) {
    fields.push("height = ?")
    params.push(data.height)
  }
  if (data.custom_height !== undefined) {
    fields.push("custom_height = ?")
    params.push(data.custom_height)
  }
  if (data.show_scroll_button !== undefined) {
    fields.push("show_scroll_button = ?")
    params.push(data.show_scroll_button)
  }
  if (data.custom_class !== undefined) {
    fields.push("custom_class = ?")
    params.push(data.custom_class)
  }

  if (fields.length === 0) return

  fields.push("updated_at = CURRENT_TIMESTAMP")
  params.push(id)

  const query = `UPDATE hero_content SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

// =============================================
// FUNCIONES PARA HERO BACKGROUNDS
// =============================================

export async function getHeroBackgrounds(heroId: number): Promise<HeroBackground[]> {
  const query = `
    SELECT * FROM hero_backgrounds 
    WHERE hero_id = ? AND is_active = TRUE 
    ORDER BY sort_order ASC
  `
  return await executeQuery<HeroBackground>(query, [heroId])
}

export async function createHeroBackground(data: Omit<HeroBackground, "id" | "created_at">): Promise<number> {
  const query = `
    INSERT INTO hero_backgrounds (
      hero_id, type, value, overlay, overlay_opacity, sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.hero_id,
    data.type,
    data.value,
    data.overlay,
    data.overlay_opacity,
    data.sort_order,
    data.is_active,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroBackground(id: number, data: Partial<HeroBackground>): Promise<void> {
  const fields = []
  const params = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "created_at") {
      fields.push(`${key} = ?`)
      params.push(value)
    }
  })

  if (fields.length === 0) return

  params.push(id)
  const query = `UPDATE hero_backgrounds SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

export async function deleteHeroBackground(id: number): Promise<void> {
  const query = `UPDATE hero_backgrounds SET is_active = FALSE WHERE id = ?`
  await executeQuery(query, [id])
}

// =============================================
// FUNCIONES PARA HERO CAROUSEL
// =============================================

export async function getHeroCarousel(heroId: number): Promise<HeroCarousel | null> {
  const query = `SELECT * FROM hero_carousel WHERE hero_id = ? LIMIT 1`
  return await executeQuerySingle<HeroCarousel>(query, [heroId])
}

export async function createHeroCarousel(data: Omit<HeroCarousel, "id" | "created_at">): Promise<number> {
  const query = `
    INSERT INTO hero_carousel (
      hero_id, enabled, autoplay, interval_seconds, show_controls, 
      show_indicators, effect
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.hero_id,
    data.enabled,
    data.autoplay,
    data.interval_seconds,
    data.show_controls,
    data.show_indicators,
    data.effect,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroCarousel(id: number, data: Partial<HeroCarousel>): Promise<void> {
  const fields = []
  const params = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "created_at" && key !== "hero_id") {
      fields.push(`${key} = ?`)
      params.push(value)
    }
  })

  if (fields.length === 0) return

  params.push(id)
  const query = `UPDATE hero_carousel SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

// =============================================
// FUNCIONES PARA HERO CAROUSEL ITEMS
// =============================================

export async function getHeroCarouselItems(carouselId: number): Promise<HeroCarouselItem[]> {
  const query = `
    SELECT * FROM hero_carousel_items 
    WHERE carousel_id = ? AND is_active = TRUE 
    ORDER BY sort_order ASC
  `
  return await executeQuery<HeroCarouselItem>(query, [carouselId])
}

export async function createHeroCarouselItem(data: Omit<HeroCarouselItem, "id" | "created_at">): Promise<number> {
  const query = `
    INSERT INTO hero_carousel_items (
      carousel_id, type, url, alt_text, overlay, overlay_opacity, 
      sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.carousel_id,
    data.type,
    data.url,
    data.alt_text || null,
    data.overlay,
    data.overlay_opacity,
    data.sort_order,
    data.is_active,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroCarouselItem(id: number, data: Partial<HeroCarouselItem>): Promise<void> {
  const fields = []
  const params = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "created_at") {
      fields.push(`${key} = ?`)
      params.push(value)
    }
  })

  if (fields.length === 0) return

  params.push(id)
  const query = `UPDATE hero_carousel_items SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

export async function deleteHeroCarouselItem(id: number): Promise<void> {
  const query = `UPDATE hero_carousel_items SET is_active = 0 WHERE id = ?`
  await executeQuery(query, [id])
}

// Función para obtener medios del hero
export async function getHeroMedia(subfolder?: string | null, type?: string | null) {
  try {
    let query = `
      SELECT 
        hci.id,
        hci.uuid,
        hci.title,
        hci.description,
        hci.image_url as url,
        hci.image_type as type,
        hci.alt_text,
        hci.overlay,
        hci.overlay_opacity,
        hci.sort_order,
        hci.created_at
      FROM hero_carousel_items hci
      WHERE hci.is_active = 1
    `

    const params: any[] = []

    if (subfolder) {
      query += ` AND hci.subfolder = ?`
      params.push(subfolder)
    }

    if (type) {
      if (type === "image") {
        query += ` AND hci.image_type LIKE 'image/%'`
      } else if (type === "video") {
        query += ` AND hci.image_type LIKE 'video/%'`
      }
    }

    query += ` ORDER BY hci.sort_order ASC, hci.created_at DESC`

    const results = await executeQuery(query, params)
    return results
  } catch (error) {
    console.error("Error obteniendo medios del hero:", error)
    return []
  }
}

// Función para obtener todos los medios (para otras secciones)
export async function getAllMedia(section?: string | null, subfolder?: string | null, type?: string | null) {
  try {
    // Por ahora retornamos array vacío, implementar cuando tengamos otras tablas
    return []
  } catch (error) {
    console.error("Error obteniendo todos los medios:", error)
    return []
  }
}

// Función para agregar un medio al carrusel del hero
export async function addHeroCarouselItem(data: {
  title: string
  description?: string
  imageUrl: string
  imageType: string
  altText?: string
  overlay?: boolean
  overlayOpacity?: number
  subfolder: string
  sortOrder?: number
}) {
  try {
    const query = `
      INSERT INTO hero_carousel_items (
        uuid, title, description, image_url, image_type, 
        alt_text, overlay, overlay_opacity, subfolder, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    // Usar randomUUID directamente en lugar de crypto.randomUUID
    const uuid = randomUUID()
    const params = [
      uuid,
      data.title,
      data.description || null,
      data.imageUrl,
      data.imageType,
      data.altText || null,
      data.overlay || false,
      data.overlayOpacity || 50,
      data.subfolder,
      data.sortOrder || 0,
    ]

    const result = await executeQuery(query, params)
    return { id: result.insertId, uuid }
  } catch (error) {
    console.error("Error agregando item al carrusel:", error)
    throw error
  }
}

// =============================================
// FUNCIONES PARA HERO TEXTS
// =============================================

export async function getHeroTexts(heroId: number): Promise<HeroText[]> {
  const query = `
    SELECT * FROM hero_texts 
    WHERE hero_id = ? AND is_active = TRUE 
    ORDER BY sort_order ASC
  `
  return await executeQuery<HeroText>(query, [heroId])
}

export async function createHeroText(data: Omit<HeroText, "id" | "created_at">): Promise<number> {
  const query = `
    INSERT INTO hero_texts (
      hero_id, type, content, custom_class, position, position_top, 
      position_left, position_right, position_bottom, custom_style, 
      animation_enabled, animation_type, animation_delay, animation_duration, 
      sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.hero_id,
    data.type,
    data.content,
    data.custom_class || null,
    data.position,
    data.position_top || null,
    data.position_left || null,
    data.position_right || null,
    data.position_bottom || null,
    data.custom_style ? JSON.stringify(data.custom_style) : null,
    data.animation_enabled,
    data.animation_type,
    data.animation_delay,
    data.animation_duration,
    data.sort_order,
    data.is_active,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroText(id: number, data: Partial<HeroText>): Promise<void> {
  const fields = []
  const params = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "created_at") {
      if (key === "custom_style") {
        fields.push(`${key} = ?`)
        params.push(value ? JSON.stringify(value) : null)
      } else {
        fields.push(`${key} = ?`)
        params.push(value)
      }
    }
  })

  if (fields.length === 0) return

  params.push(id)
  const query = `UPDATE hero_texts SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

export async function deleteHeroText(id: number): Promise<void> {
  const query = `UPDATE hero_texts SET is_active = FALSE WHERE id = ?`
  await executeQuery(query, [id])
}

// =============================================
// FUNCIONES PARA HERO BUTTONS
// =============================================

export async function getHeroButtons(heroId: number): Promise<HeroButton[]> {
  const query = `
    SELECT * FROM hero_buttons 
    WHERE hero_id = ? AND is_active = TRUE 
    ORDER BY sort_order ASC
  `
  return await executeQuery<HeroButton>(query, [heroId])
}

export async function createHeroButton(data: Omit<HeroButton, "id" | "created_at">): Promise<number> {
  const query = `
    INSERT INTO hero_buttons (
      hero_id, text, url, variant, size, icon, icon_position, 
      custom_class, animation_type, animation_delay, animation_duration, 
      sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    data.hero_id,
    data.text,
    data.url,
    data.variant,
    data.size,
    data.icon || null,
    data.icon_position,
    data.custom_class || null,
    data.animation_type,
    data.animation_delay,
    data.animation_duration,
    data.sort_order,
    data.is_active,
  ]

  return await executeInsert(query, params)
}

export async function updateHeroButton(id: number, data: Partial<HeroButton>): Promise<void> {
  const fields = []
  const params = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "created_at") {
      fields.push(`${key} = ?`)
      params.push(value)
    }
  })

  if (fields.length === 0) return

  params.push(id)
  const query = `UPDATE hero_buttons SET ${fields.join(", ")} WHERE id = ?`
  await executeQuery(query, params)
}

export async function deleteHeroButton(id: number): Promise<void> {
  const query = `UPDATE hero_buttons SET is_active = FALSE WHERE id = ?`
  await executeQuery(query, [id])
}

// =============================================
// FUNCIÓN COMPLETA PARA OBTENER TODO EL HERO
// =============================================

export async function getCompleteHeroData() {
  try {
    // Obtener contenido principal del hero
    const heroContent = await getHeroContent()

    if (!heroContent) {
      return null
    }

    // Obtener todos los datos relacionados
    const [backgrounds, carousel, texts, buttons] = await Promise.all([
      getHeroBackgrounds(heroContent.id!),
      getHeroCarousel(heroContent.id!),
      getHeroTexts(heroContent.id!),
      getHeroButtons(heroContent.id!),
    ])

    // Obtener items del carrusel si existe
    let carouselItems: HeroCarouselItem[] = []
    if (carousel) {
      carouselItems = await getHeroCarouselItems(carousel.id!)
    }

    return {
      ...heroContent,
      backgrounds,
      carousel: carousel
        ? {
            ...carousel,
            images: carouselItems,
          }
        : null,
      texts,
      buttons,
    }
  } catch (error) {
    console.error("Error obteniendo datos completos del hero:", error)
    throw error
  }
}

// =============================================
// FUNCIÓN PARA GUARDAR TODO EL HERO
// =============================================

export async function saveCompleteHeroData(data: any) {
  try {
    // Obtener o crear el contenido principal del hero
    const heroContent = await getHeroContent()
    let heroId: number

    if (heroContent) {
      // Actualizar contenido existente
      await updateHeroContent(heroContent.id!, {
        title: data.title,
        subtitle: data.subtitle,
        company_name: data.companyName,
        description: data.description,
        layout: data.layout,
        text_alignment: data.textAlignment,
        vertical_position: data.verticalPosition,
        height: data.height,
        custom_height: data.customHeight,
        show_scroll_button: data.showScrollButton,
        custom_class: data.customClass,
      })
      heroId = heroContent.id!
    } else {
      // Crear nuevo contenido
      heroId = await createHeroContent({
        title: data.title || "TRABAJO SEGURO EN ALTURA",
        subtitle: data.subtitle,
        company_name: data.companyName,
        description: data.description,
        layout: data.layout || "centered",
        text_alignment: data.textAlignment || "center",
        vertical_position: data.verticalPosition || "middle",
        height: data.height || "full",
        custom_height: data.customHeight,
        show_scroll_button: data.showScrollButton !== false,
        custom_class: data.customClass,
        is_active: true,
      })
    }

    // Guardar fondo si existe
    if (data.background) {
      // Primero desactivar fondos existentes
      const existingBackgrounds = await getHeroBackgrounds(heroId)
      for (const bg of existingBackgrounds) {
        await deleteHeroBackground(bg.id!)
      }

      // Crear nuevo fondo
      await createHeroBackground({
        hero_id: heroId,
        type: data.background.type || "image",
        value: data.background.value || data.backgroundImage || "/hero-background.jpg",
        overlay: data.background.overlay || false,
        overlay_opacity: data.background.overlayOpacity || 50,
        sort_order: 0,
        is_active: true,
      })
    }

    // Guardar carrusel si existe
    if (data.carousel) {
      let carousel = await getHeroCarousel(heroId)

      if (carousel) {
        // Actualizar carrusel existente
        await updateHeroCarousel(carousel.id!, {
          enabled: data.carousel.enabled,
          autoplay: data.carousel.autoplay,
          interval_seconds: data.carousel.interval,
          show_controls: data.carousel.showControls,
          show_indicators: data.carousel.showIndicators,
          effect: data.carousel.effect,
        })
      } else {
        // Crear nuevo carrusel
        const carouselId = await createHeroCarousel({
          hero_id: heroId,
          enabled: data.carousel.enabled || false,
          autoplay: data.carousel.autoplay || true,
          interval_seconds: data.carousel.interval || 5,
          show_controls: data.carousel.showControls || true,
          show_indicators: data.carousel.showIndicators || true,
          effect: data.carousel.effect || "fade",
        })
        carousel = { id: carouselId, hero_id: heroId } as HeroCarousel
      }

      // Guardar items del carrusel
      if (data.carousel.images && carousel.id) {
        // Desactivar items existentes
        const existingItems = await getHeroCarouselItems(carousel.id)
        for (const item of existingItems) {
          await deleteHeroCarouselItem(item.id!)
        }

        // Crear nuevos items
        for (let i = 0; i < data.carousel.images.length; i++) {
          const image = data.carousel.images[i]
          await createHeroCarouselItem({
            carousel_id: carousel.id,
            type: image.type || "image",
            url: image.url,
            alt_text: image.alt,
            overlay: image.overlay || false,
            overlay_opacity: image.overlayOpacity || 50,
            sort_order: i,
            is_active: true,
          })
        }
      }
    }

    // Guardar textos
    if (data.texts) {
      // Desactivar textos existentes
      const existingTexts = await getHeroTexts(heroId)
      for (const text of existingTexts) {
        await deleteHeroText(text.id!)
      }

      // Crear nuevos textos
      for (let i = 0; i < data.texts.length; i++) {
        const text = data.texts[i]
        await createHeroText({
          hero_id: heroId,
          type: text.type,
          content: text.content,
          custom_class: text.customClass,
          position: text.position || "relative",
          position_top: text.top,
          position_left: text.left,
          position_right: text.right,
          position_bottom: text.bottom,
          custom_style: text.customStyle,
          animation_enabled: text.animation?.enabled || true,
          animation_type: text.animation?.type || "fade-in",
          animation_delay: text.animation?.delay || 1,
          animation_duration: text.animation?.duration || 0.8,
          sort_order: i,
          is_active: true,
        })
      }
    }

    // Guardar botones
    if (data.buttons) {
      // Desactivar botones existentes
      const existingButtons = await getHeroButtons(heroId)
      for (const button of existingButtons) {
        await deleteHeroButton(button.id!)
      }

      // Crear nuevos botones
      for (let i = 0; i < data.buttons.length; i++) {
        const button = data.buttons[i]
        await createHeroButton({
          hero_id: heroId,
          text: button.text,
          url: button.url,
          variant: button.variant || "primary",
          size: button.size || "lg",
          icon: button.icon,
          icon_position: button.position || "right",
          custom_class: button.customClass,
          animation_type: button.animation?.type || "fade-in",
          animation_delay: button.animation?.delay || 1,
          animation_duration: button.animation?.duration || 0.8,
          sort_order: i,
          is_active: true,
        })
      }
    }

    return heroId
  } catch (error) {
    console.error("Error guardando datos completos del hero:", error)
    throw error
  }
}
