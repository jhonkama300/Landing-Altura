"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, ExternalLink, Send, PhoneIcon as Whatsapp } from "lucide-react" // Importar el icono de WhatsApp
import { getContentSection } from "@/lib/content"

export function Contact() {
  const [contactData, setContactData] = useState({
    title: "Información de contacto",
    description: "Estamos disponibles para resolver todas tus dudas",
    address: "Calle 16 A No. 12 - 36, Barrio Loperena Valledupar, Cesar",
    secondaryAddress: "Calle 60 No. 18D - 33, Valledupar, Cesar",
    email: "alturasupar@uparsistem.edu.co",
    phone: "PBX: 6019197356",
    secondaryPhone: "3202509270 / 3103708870 / 3006506171",
    website: "www.uparsistem.edu.co",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2954.546198844394!2d-73.25122093933759!3d10.472442829783622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8ab9b70ce6e525%3A0xa80636493c697ae8!2sCentro%20Educativo%20de%20Sistemas%20UPARSISTEM!5e1!3m2!1ses!2sco!4v1750709649313!5m2!1ses!2sco",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSending, setIsSending] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const whatsappNumber = "573202509270" // Número de WhatsApp con código de país (Colombia)
    const { name, email, phone, message } = formData

    let whatsappMessage = `Hola, mi nombre es ${name}.`
    if (email) whatsappMessage += ` Mi correo es ${email}.`
    if (phone) whatsappMessage += ` Mi teléfono es ${phone}.`
    whatsappMessage += `\n\n${message}`

    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")

    // Reset form and loading state after a short delay for UX
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" })
      setIsSending(false)
    }, 1000)
  }

  const formatPhoneNumberForCall = (phoneNumber: string) => {
    // Elimina espacios y caracteres no numéricos, luego añade el prefijo tel:
    return `tel:${phoneNumber.replace(/[^0-9+]/g, "")}`
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

                <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nombre completo
                      </label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
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
                        value={formData.email}
                        onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      value={formData.message}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-3 px-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="animate-spin">
                          <Send size={18} />
                        </span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Whatsapp size={18} />
                        Enviar mensaje por WhatsApp
                      </>
                    )}
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
                      <a
                        href={formatPhoneNumberForCall(contactData.phone)}
                        className="text-gray-600 dark:text-gray-400 hover:underline block"
                      >
                        {contactData.phone}
                      </a>
                      {contactData.secondaryPhone &&
                        contactData.secondaryPhone.split("/").map((num, index) => (
                          <a
                            key={index}
                            href={formatPhoneNumberForCall(num.trim())}
                            className="text-gray-600 dark:text-gray-400 hover:underline block"
                          >
                            {num.trim()}
                          </a>
                        ))}
                      <Button
                        onClick={() => window.open(`https://wa.me/573202509270`, "_blank")}
                        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <Whatsapp size={20} />
                        Enviar WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Correo electrónico</h4>
                      <a
                        href={`mailto:${contactData.email}`}
                        className="text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        {contactData.email}
                      </a>
                    </div>
                  </div>

                  {contactData.website && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <ExternalLink className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Sitio web</h4>
                        <a
                          href={`https://${contactData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:underline"
                        >
                          {contactData.website}
                        </a>
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
