"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Award, Shield, Star, Lightbulb } from "lucide-react" // Añadido Lightbulb para más opciones de iconos

// Mapeo de nombres de iconos a componentes
const iconComponents = {
  CheckCircle,
  Award,
  Shield,
  Star,
  Lightbulb, // Nuevo icono añadido
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
  // Datos de certificaciones estáticos
  const certData: CertificationData = {
    title: "Nuestras Certificaciones",
    description:
      "Nuestras certificaciones avalan la calidad y el compromiso con la excelencia en todos nuestros servicios, garantizando la máxima seguridad y profesionalismo.",
    items: [
      {
        id: "cert-1",
        title: "NTC 6052:2014 ICONTEC",
        description:
          "Certificación en calidad para formación en trabajo seguro en altura, garantizando los más altos estándares de seguridad y educación.",
        icon: "Award",
      },
      {
        id: "cert-2",
        title: "ISO 9001:2015",
        description:
          "Certificación en sistemas de gestión de calidad, asegurando la mejora continua y la satisfacción del cliente en cada proceso.",
        icon: "CheckCircle",
      },
      {
        id: "cert-3",
        title: "OHSAS 18001",
        description:
          "Certificación en sistemas de gestión de seguridad y salud ocupacional, protegiendo el bienestar de nuestros colaboradores y clientes.",
        icon: "Shield",
      },
      {
        id: "cert-4",
        title: "Reconocimiento a la Innovación",
        description: "Premio por nuestra constante búsqueda de soluciones innovadoras y eficientes en el sector.",
        icon: "Lightbulb",
      },
    ],
  }

  // Función para renderizar el icono correcto
  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || Award
    return <IconComponent className="h-6 w-6" />
  }

  // Obtener el primer item de certificación de forma segura
  const primaryCert = certData.items && certData.items.length > 0 ? certData.items[0] : null
  const additionalCerts = certData.items && certData.items.length > 1 ? certData.items.slice(1) : []

  return (
    <section
      id="certifications"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 dark:text-white relative inline-block pb-4">
            {certData.title}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full"></span>
          </h2>
          {certData.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">{certData.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sección de Imagen Principal de Certificación */}
          <div className="relative h-[450px] rounded-xl overflow-hidden shadow-2xl group">
            <Image
              src="/placeholder.svg?height=450&width=600&text=Certificación de Calidad ICONTEC"
              alt="Certificación ICONTEC con logo y texto de calidad"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">CALIDAD CERTIFICADA</h3>
                <p className="text-xl md:text-2xl font-light mb-6 drop-shadow-md">
                  Nuestros procesos cumplen con los más altos estándares de calidad
                </p>
                <div className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg max-w-fit">
                  <div className="p-3 rounded-full bg-secondary text-white shadow-lg">
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xl font-bold">ICONTEC</p>
                    <p className="text-sm opacity-80">Certificación Internacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Tarjetas de Certificación */}
          <div>
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 md:p-8">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-full bg-primary text-white shadow-lg">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">CERTIFICADOS EN CALIDAD</h3>
                </div>

                {primaryCert && (
                  <div className="bg-primary/10 p-6 rounded-lg mb-8 border-l-4 border-l-primary shadow-md">
                    <div className="flex items-start">
                      <Shield className="h-7 w-7 text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl font-bold text-primary mb-2">{primaryCert.title}</h4>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-200">{primaryCert.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {additionalCerts.length > 0 && (
                  <div className="space-y-6">
                    {additionalCerts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] border border-gray-100 dark:border-gray-700"
                      >
                        <div className="p-3 rounded-full bg-secondary/15 text-secondary flex-shrink-0 shadow-sm">
                          {renderIcon(item.icon)}
                        </div>
                        <div>
                          <h5 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{item.title}</h5>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
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
