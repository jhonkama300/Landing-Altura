"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ImageIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react"
// Añadir la importación de la función logout
import { logout, getCurrentUser } from "@/lib/auth"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Hero",
    href: "/admin/dashboard/hero",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Galería",
    href: "/admin/dashboard/gallery",
    icon: <ImageIcon className="h-5 w-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()

    setTimeout(() => {
      router.push("/admin/login")
    }, 100)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-md bg-primary p-2 text-white md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-4 shadow-lg transition-transform duration-200 ease-in-out dark:bg-gray-800 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center justify-center py-4">
              <Link href="/admin/dashboard" className="text-2xl font-bold">
                UPAR<span className="text-primary">SISTEM</span>
              </Link>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-700">
              <p className="text-sm font-medium">Conectado como:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {typeof window !== "undefined" ? getCurrentUser()?.name || "Administrador" : "Administrador"}
              </p>
            </div>
            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={toggleSidebar}></div>}
    </>
  )
}
