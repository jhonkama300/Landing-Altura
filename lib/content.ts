// Simulación de gestión de contenido para el demo
// En una aplicación real, esto se conectaría a un backend o CMS

// Clave para almacenar el contenido en localStorage
const CONTENT_KEY = "uparsistem_content"

// Contenido por defecto
const DEFAULT_CONTENT = {
  hero: {
    title: "TRABAJO SEGURO EN ALTURA",
    subtitle: "CENTRO DE ENTRENAMIENTO",
    companyName: "UPARSISTEM",
    description: "Formación especializada para el trabajo seguro en altura con los más altos estándares de calidad",
    backgroundImage: "/hero-background.jpg",
    background: {
      type: "image",
      value: "/hero-background.jpg",
      overlay: true,
      overlayOpacity: 50,
    },
    carousel: {
      enabled: false,
      images: [
        {
          url: "/hero-background.jpg",
          type: "image",
          alt: "Trabajo en altura",
          overlay: true,
          overlayOpacity: 50,
        },
        {
          url: "/abstract-purple-landscape.png",
          type: "image",
          alt: "Formación especializada",
          overlay: true,
          overlayOpacity: 60,
        },
        {
          url: "/hero-video-background.mp4",
          type: "video",
          alt: "Video de formación",
          overlay: true,
          overlayOpacity: 40,
        },
      ],
      autoplay: true,
      interval: 5,
      showControls: true,
      showIndicators: true,
      effect: "fade",
    },
    buttons: [
      {
        id: "btn-1",
        text: "Nuestros Servicios",
        url: "#services",
        variant: "primary",
      },
      {
        id: "btn-2",
        text: "Contáctanos",
        url: "#contact",
        variant: "outline",
      },
    ],
  },
  navbar: {
    logo: "/logo.png",
    logoText: "UPAR<span>SISTEM</span>",
    showLogoImage: false,
    logoSize: {
      width: 150,
      height: 40,
    },
    buttons: [
      {
        text: "Inscríbete Ahora",
        url: "https://site2.q10.com/Preinscripcion?aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
        variant: "primary",
      },
      {
        text: "Pagos en línea",
        url: "https://site2.q10.com/login?ReturnUrl=%2F&aplentId=1b2f24dd-889b-45b4-b7ed-e8390ef5489d",
        variant: "secondary",
      },
    ],
  },
  about: {
    title: "Sobre Nosotros",
    introduction:
      "Formamos personas para el trabajo y el desarrollo humano, con valores, espíritu emprendedor y capacidad técnica a través de una oferta académica basada en competencias laborales.",
    paragraph1:
      "UPARSISTEM se proyecta como la institución de educación para el trabajo y el desarrollo humano líder en Colombia, que contribuye con su oferta educativa al progreso del país.",
    paragraph2:
      "Propendemos por el reconocimiento nacional de nuestros programas de formación para el trabajo, por su calidad y pertinencia, cumpliendo con el compromiso de articular la educación con el sector productivo, la comunidad y el desarrollo de la Nación.",
    buttonText: "Conoce al equipo",
    imageUrl: "/about-image.jpg",
    mission:
      "Formar personas para el trabajo y el desarrollo humano, con valores, espíritu emprendedor y capacidad técnica a través de una oferta académica con base en competencias laborales pertinentes a todos los escenarios productivos de la realidad actual y articulada con todos los niveles de la educación, a la vanguardia de los avances tecnológicos y en procura del bienestar social y del progreso del país.",
    vision:
      "UPARSISTEM se proyecta como la institución de educación para el trabajo y el desarrollo humano líder en Colombia, que contribuye con su oferta educativa al progreso del país, reconocida por la calidad y pertinencia de sus programas de formación.",
    portfolio: {
      title: "PORTAFOLIO",
      description: "Formación especializada en trabajo seguro en altura con los más altos estándares de calidad",
      features: [
        {
          id: "feature-1",
          text: "Certificación NTC 6052:2014",
          icon: "CheckCircle",
        },
        {
          id: "feature-2",
          text: "Instructores Certificados",
          icon: "Users",
        },
        {
          id: "feature-3",
          text: "Instalaciones Modernas",
          icon: "Award",
        },
      ],
    },
  },
  services: {
    title: "Nuestros Servicios",
    description: "Ofrecemos una amplia gama de servicios de formación en trabajo seguro en altura",
    categories: [
      {
        id: "cat-1",
        name: "Cursos de Altura",
        services: [
          {
            id: "serv-1",
            title: "Jefe de Área",
            description: "Curso de 8 horas para supervisores",
            icon: "User",
          },
          {
            id: "serv-2",
            title: "Trabajador Autorizado",
            description: "Curso de 35 horas para trabajadores",
            icon: "Users",
          },
        ],
      },
    ],
  },
  certifications: {
    title: "Certificaciones",
    description: "Contamos con las certificaciones más importantes del sector",
    items: [
      {
        id: "cert-1",
        title: "NTC 6052:2014 ICONTEC",
        description: "Certificación en calidad para formación en trabajo seguro en altura",
        icon: "Award",
      },
    ],
  },
  contact: {
    title: "Contáctanos",
    description: "Estamos disponibles para resolver todas tus dudas",
    address: "Calle 16 A No. 12 - 36, Bogotá, Colombia",
    email: "alturasupar@uparsistem.edu.co",
    phone: "PBX: 6019197356",
  },
  features: [
    {
      icon: "Shield",
      title: "Seguridad Garantizada",
      description: "Formación con los más altos estándares de seguridad para el trabajo en altura.",
    },
    {
      icon: "Award",
      title: "Certificación ICONTEC",
      description: "Certificados bajo la norma NTC 6052:2014 que garantiza la calidad de nuestra formación.",
    },
    {
      icon: "Users",
      title: "Instructores Calificados",
      description: "Equipo de instructores con amplia experiencia y certificaciones internacionales.",
    },
    {
      icon: "Cpu",
      title: "Equipos Modernos",
      description: "Contamos con los equipos más modernos para garantizar prácticas seguras y efectivas.",
    },
    {
      icon: "FileCheck",
      title: "Programas Actualizados",
      description: "Contenidos actualizados según las últimas normativas y mejores prácticas del sector.",
    },
    {
      icon: "Layers",
      title: "Formación Integral",
      description: "Programas que combinan teoría y práctica para una formación completa y efectiva.",
    },
  ],
  social: {
    networks: [
      {
        id: "facebook",
        name: "Facebook",
        enabled: true,
        url: "https://www.facebook.com/uparsistem/",
        icon: "Facebook",
      },
      {
        id: "instagram",
        name: "Instagram",
        enabled: true,
        url: "https://www.instagram.com/uparsistem/",
        icon: "Instagram",
      },
      {
        id: "tiktok",
        name: "TikTok",
        enabled: true,
        url: "https://www.tiktok.com/@uparsistem",
        icon: "TikTok",
      },
      {
        id: "twitter",
        name: "Twitter",
        enabled: false,
        url: "https://twitter.com/uparsistem",
        icon: "Twitter",
      },
      {
        id: "youtube",
        name: "YouTube",
        enabled: false,
        url: "https://www.youtube.com/channel/uparsistem",
        icon: "Youtube",
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        enabled: false,
        url: "https://www.linkedin.com/company/uparsistem",
        icon: "Linkedin",
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        enabled: false,
        url: "https://wa.me/573202509270",
        icon: "MessageCircle",
      },
      {
        id: "telegram",
        name: "Telegram",
        enabled: false,
        url: "https://t.me/uparsistem",
        icon: "Send",
      },
      {
        id: "pinterest",
        name: "Pinterest",
        enabled: false,
        url: "https://www.pinterest.com/uparsistem",
        icon: "Pin",
      },
    ],
    displayCount: 3, // Número de redes sociales a mostrar en el footer
  },
}

// Inicializar el contenido si no existe
function initContent() {
  if (typeof window === "undefined") return

  const existingContent = localStorage.getItem(CONTENT_KEY)
  if (!existingContent) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT))
  }
}

// Obtener todo el contenido
export function getContent() {
  if (typeof window === "undefined") return DEFAULT_CONTENT

  initContent()
  try {
    const content = JSON.parse(localStorage.getItem(CONTENT_KEY) || "{}")
    return { ...DEFAULT_CONTENT, ...content }
  } catch (error) {
    console.error("Error al obtener el contenido:", error)
    return DEFAULT_CONTENT
  }
}

// Modificar la función getContentSection para que no se quede esperando indefinidamente

// Función principal para obtener contenido de cualquier sección
export async function getContentSection(section: string): Promise<any> {
  try {
    // Si es hero, intentar cargar desde la API primero
    if (section === "hero" && typeof window !== "undefined") {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 segundos de timeout

        const response = await fetch("/api/hero", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            return result.data
          }
        }
      } catch (error) {
        console.log("API no disponible o timeout, usando localStorage")
      }
    }

    // Fallback a localStorage
    if (typeof window !== "undefined") {
      const content = getContent()
      return content[section] || DEFAULT_CONTENT[section]
    }

    return DEFAULT_CONTENT[section] || {}
  } catch (error) {
    console.error(`Error cargando contenido de ${section}:`, error)
    return DEFAULT_CONTENT[section] || {}
  }
}

// Función para guardar contenido (mantener compatibilidad)
export function saveContentSection(section: string, content: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${section}_content`, JSON.stringify(content))

    // Disparar evento para notificar cambios
    window.dispatchEvent(new CustomEvent("contentUpdated", { detail: { section, content } }))
  }
}

// Función para actualizar una sección del contenido
export async function updateContentSection(section: keyof typeof DEFAULT_CONTENT, data: any) {
  // Si es la sección hero, intentar usar la API
  if (section === "hero" && typeof window !== "undefined") {
    try {
      const response = await fetch("/api/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Disparar eventos para notificar a los componentes
          window.dispatchEvent(new Event("storage"))
          window.dispatchEvent(new Event("contentUpdated"))
          return true
        }
      }
    } catch (error) {
      console.error("Error guardando datos del hero en la API:", error)
    }
  }

  // Fallback al localStorage para otras secciones o si la API falla
  if (typeof window === "undefined") return false

  try {
    const content = getContent()

    // Guardar los datos actualizados
    content[section] = data

    // Asegurarse de que los campos principales estén presentes para el hero
    if (section === "hero") {
      // Si hay textos, extraerlos y actualizar los campos principales
      if (data.texts && Array.isArray(data.texts)) {
        // Inicializar campos principales como vacíos
        content[section].title = ""
        content[section].subtitle = ""
        content[section].companyName = ""
        content[section].description = ""

        // Extraer textos de la estructura texts si existen
        data.texts.forEach((text: any) => {
          if (text.type === "title") content[section].title = text.content
          if (text.type === "subtitle") content[section].subtitle = text.content
          if (text.type === "companyName") content[section].companyName = text.content
          if (text.type === "description") content[section].description = text.content
        })
      }

      // Si no hay textos, asegurarse de que los campos principales estén vacíos
      if (!data.texts || data.texts.length === 0) {
        content[section].title = ""
        content[section].subtitle = ""
        content[section].companyName = ""
        content[section].description = ""
      }
    }

    console.log("Guardando contenido actualizado:", content[section])

    // Guardar en localStorage
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content))

    // Forzar una actualización para que los cambios se reflejen inmediatamente
    window.dispatchEvent(new Event("storage"))

    // Disparar un evento personalizado para notificar a los componentes
    const customEvent = new Event("contentUpdated")
    window.dispatchEvent(customEvent)

    return true
  } catch (error) {
    console.error("Error al actualizar el contenido:", error)
    return false
  }
}

// Restablecer el contenido a los valores por defecto
export function resetContent() {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT))
    return true
  } catch (error) {
    console.error("Error al restablecer el contenido:", error)
    return false
  }
}
