"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Award, Shield, Star } from "lucide-react"
import { getContentSection } from "@/lib/content"

// Mapeo de nombres de iconos a componentes
const iconComponents = {
  CheckCircle,
  Award,
  Shield,
  Star,
}

// Tipos para las certificaciones
interface CertificationItem {
  id: string
  title: string
  description: string
  icon: string
}

interface CertificationData {
  title: string
  description: string
  items: CertificationItem[]
}

export function Certifications() {
  const [certData, setCertData] = useState<CertificationData>({
    title: "CERTIFICACIONES",
    description: "",
    items: [
      {
        id: "cert-1",
        title: "NTC 6052:2014 ICONTEC",
        description: "Certificación en calidad para formación en trabajo seguro en altura",
        icon: "Award",
      },
    ],
  })

  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos al montar el componente y cuando se actualice el contenido
  useEffect(() => {
    const loadCertData = async () => {
      try {
        setIsLoading(true)
        const data = await getContentSection("certifications")

        // Validar y estructurar los datos
        if (data && typeof data === "object") {
          setCertData({
            title: data.title || "CERTIFICACIONES",
            description: data.description || "",
            items:
              Array.isArray(data.items) && data.items.length > 0
                ? data.items
                : [
                    {
                      id: "cert-1",
                      title: "NTC 6052:2014 ICONTEC",
                      description: "Certificación en calidad para formación en trabajo seguro en altura",
                      icon: "Award",
                    },
                  ],
          })
        }
      } catch (error) {
        console.error("Error loading certification data:", error)
        // Mantener datos por defecto en caso de error
      } finally {
        setIsLoading(false)
      }
    }

    // Cargar datos iniciales
    loadCertData()

    // Escuchar eventos de actualización de contenido
    const handleContentUpdate = () => loadCertData()
    window.addEventListener("contentUpdated", handleContentUpdate)
    window.addEventListener("storage", handleContentUpdate)

    // Limpiar event listeners
    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdate)
      window.removeEventListener("storage", handleContentUpdate)
    }
  }, [])

  // Función para renderizar el icono correcto
  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || Award
    return <IconComponent className="h-6 w-6" />
  }

  // Obtener el primer item de certificación de forma segura
  const primaryCert = certData.items && certData.items.length > 0 ? certData.items[0] : null
  const additionalCerts = certData.items && certData.items.length > 1 ? certData.items.slice(1) : []

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-[450px] bg-gray-200 rounded-xl"></div>
              <div className="h-[450px] bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="certifications"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block pb-3 mb-4">
            <span className="relative z-10 bg-gradient-to-r from-black to-black bg-clip-text text-transparent tracking-wide">
              {certData.title}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-black via-black to-accent rounded-full"></span>
          </h2>
          {certData.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{certData.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[450px] rounded-xl overflow-hidden shadow-xl">
            <Image src="/certification-image.jpg" alt="Certificación ICONTEC" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-3xl font-bold mb-3">CALIDAD CERTIFICADA</h3>
                <p className="text-xl">Nuestros procesos cumplen con los más altos estándares de calidad</p>
                <div className="mt-6 flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <Award className="h-12 w-12 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-bold">ICONTEC</p>
                    <p className="text-sm">Certificación Internacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-full bg-primary text-white shadow-lg">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold">CERTIFICADOS EN CALIDAD</h3>
                </div>

                {primaryCert && (
                  <div className="bg-primary/10 p-6 rounded-lg mb-8 border-l-4 border-l-primary">
                    <div className="flex items-start">
                      <Shield className="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl font-bold text-primary mb-2">{primaryCert.title}</h4>
                        <p className="leading-relaxed">{primaryCert.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {additionalCerts.length > 0 && (
                  <div className="space-y-6">
                    {additionalCerts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="p-3 rounded-full bg-secondary/10 text-secondary flex-shrink-0">
                          {renderIcon(item.icon)}
                        </div>
                        <div>
                          <h5 className="font-bold text-lg mb-1">{item.title}</h5>
                          <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
