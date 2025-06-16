import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileText, Grid, Award, MessageSquare, ExternalLink } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido al panel de administración de UPARSISTEM</p>
        </div>
        <Button asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver sitio web
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/dashboard/hero">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sección Hero</CardTitle>
              <ImageIcon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hero</div>
              <p className="text-xs text-gray-500">Título, subtítulo, descripción, botones</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dashboard/gallery">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Galería</CardTitle>
              <ImageIcon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Galería</div>
              <p className="text-xs text-gray-500">Imágenes y categorías de la galería</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
