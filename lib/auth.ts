// Simulación de autenticación para el demo
// En una aplicación real, esto se conectaría a un backend

// Credenciales de demostración
const DEMO_USER = {
  username: "admin",
  password: "admin123",
  name: "Administrador",
}

// Clave para almacenar la sesión en localStorage
const AUTH_KEY = "lenis_admin_auth"

// Función para iniciar sesión
export async function login(username: string, password: string): Promise<boolean> {
  // Simulamos una llamada a la API con un pequeño retraso
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === DEMO_USER.username && password === DEMO_USER.password) {
        // Guardar la sesión en localStorage
        const session = {
          user: {
            username: DEMO_USER.username,
            name: DEMO_USER.name,
          },
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(session))
        resolve(true)
      } else {
        resolve(false)
      }
    }, 800) // Simulamos un retraso de 800ms
  })
}

// Función para cerrar sesión
export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const sessionData = localStorage.getItem(AUTH_KEY)
  if (!sessionData) return false

  try {
    const session = JSON.parse(sessionData)
    // Verificar si la sesión ha expirado
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_KEY)
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

// Función para obtener el usuario actual
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem(AUTH_KEY)
  if (!sessionData) return null

  try {
    const session = JSON.parse(sessionData)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }
    return session.user
  } catch (error) {
    return null
  }
}
