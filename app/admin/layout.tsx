"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = () => {
      // Si estamos en la página de login, no redirigir
      if (pathname.includes("/admin/login")) {
        setLoading(false)
        setIsUserAuthenticated(false)
        return
      }

      // Verificar autenticación usando la función importada
      const authenticated = checkIsAuthenticated()

      if (!authenticated) {
        router.push("/admin/login")
      } else {
        setIsUserAuthenticated(true)
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Si no está autenticado y estamos en la página de login, mostrar los children (que es el formulario de login)
  if (!isUserAuthenticated && pathname.includes("/admin/login")) {
    return children
  }

  // Si no está autenticado y no estamos en login, no mostrar nada (se redirigirá a login)
  if (!isUserAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </div>
    </div>
  )
}
