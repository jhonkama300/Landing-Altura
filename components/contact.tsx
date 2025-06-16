"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, ExternalLink, Send } from "lucide-react"
import { getContentSection } from "@/lib/content"

export function Contact() {
  const [contactData, setContactData] = useState({
    title: "Información de contacto",
    description: "Estamos disponibles para resolver todas tus dudas",
    address: "Calle 16 A No. 12 - 36, Bogotá, Colombia",
    secondaryAddress: "Calle 6 No. 1 - 3",
    email: "alturasupar@uparsistem.edu.co",
    phone: "PBX: 6019197356",
    secondaryPhone: "3202509270 / 3103708870 / 3006506171",
    website: "www.uparsistem.edu.co",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8101320556097!2d-74.0720223!3d4.6097100999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a2e545a44c1%3A0x4b15aee42b8aee23!2sCl.%2016a%20%2312-36%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1715626800000!5m2!1ses!2sco",
  })

  useEffect(() => {
    // Cargar datos iniciales
    loadContactData()

    // Escuchar eventos de actualización
    window.addEventListener("contentUpdated", loadContactData)
    window.addEventListener("storage", loadContactData)

    return () => {
      window.removeEventListener("contentUpdated", loadContactData)
      window.removeEventListener("storage", loadContactData)
    }
  }, [])

  const loadContactData = () => {
    const data = getContentSection("contact")
    setContactData((prev) => ({
      ...prev,
      ...data,
    }))
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold relative inline-block pb-3 mb-4">
            <span className="relative z-10">{contactData.title}</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary"></span>
          </h2>
          {contactData.description && (
            <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{contactData.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary to-secondary"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Send className="h-6 w-6 mr-3 text-primary" />
                  Envíanos un mensaje
                </h3>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nombre completo
                      </label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        required
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Correo electrónico
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      placeholder="Tu número de teléfono"
                      required
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Asunto
                    </label>
                    <Input
                      id="subject"
                      placeholder="Asunto de tu mensaje"
                      required
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      placeholder="¿En qué podemos ayudarte?"
                      rows={5}
                      required
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-3 px-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Enviar mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-primary to-secondary"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Información de contacto</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Sede Principal</h4>
                      <p className="text-gray-600 dark:text-gray-400">{contactData.address}</p>
                    </div>
                  </div>

                  {contactData.secondaryAddress && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Centro de Prácticas</h4>
                        <p className="text-gray-600 dark:text-gray-400">{contactData.secondaryAddress}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Teléfonos</h4>
                      <p className="text-gray-600 dark:text-gray-400">{contactData.phone}</p>
                      {contactData.secondaryPhone && (
                        <p className="text-gray-600 dark:text-gray-400">{contactData.secondaryPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Correo electrónico</h4>
                      <p className="text-gray-600 dark:text-gray-400">{contactData.email}</p>
                    </div>
                  </div>

                  {contactData.website && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <ExternalLink className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Sitio web</h4>
                        <p className="text-gray-600 dark:text-gray-400">{contactData.website}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg overflow-hidden shadow-xl h-[500px] w-full">
            <iframe
              src={contactData.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
