import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Cargando...</h2>
      </div>
    </div>
  )
}
