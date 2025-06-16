"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CheckCircle, Award, Target, Users, BookOpen } from "lucide-react"
import { getContentSection } from "@/lib/content"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { motion } from "framer-motion" // Importar motion

export function AboutUs() {
  const [content, setContent] = useState({
    title: "",
    introduction: "",
    paragraph1: "",
    paragraph2: "",
    buttonText: "",
    imageUrl: "",
    mission: "",
    vision: "",
    portfolio: {
      title: "",
      description: "",
      features: [] as { id: string; text: string; icon: string }[],
    },
  })

  useEffect(() => {
    const aboutContent = getContentSection("about")
    setContent(aboutContent)

    const handleContentUpdate = () => {
      const updatedContent = getContentSection("about")
      setContent(updatedContent)
    }

    window.addEventListener("contentUpdated", handleContentUpdate)
    window.addEventListener("storage", handleContentUpdate)

    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdate)
      window.removeEventListener("storage", handleContentUpdate)
    }
  }, [])

  // Variantes para las animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYTNjNGIiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-4xl font-bold mb-4 text-primary inline-block relative" variants={itemVariants}>
            {content.title || "¿Quiénes somos?"}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary"></span>
          </motion.h2>
          <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" variants={itemVariants}>
            {content.introduction ||
              "Formamos personas para el trabajo y el desarrollo humano, con valores, espíritu emprendedor y capacidad técnica a través de una oferta académica basada en competencias laborales."}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8 order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              variants={itemVariants}
            >
              <p className="text-lg leading-relaxed mb-6">
                <span className="font-semibold text-primary">UPARSISTEM</span>{" "}
                {content.paragraph1 ||
                  "se proyecta como la institución de educación para el trabajo y el desarrollo humano líder en Colombia, que contribuye con su oferta educativa al progreso del país."}
              </p>
              <p className="text-lg leading-relaxed">
                {content.paragraph2 ||
                  "Propendemos por el reconocimiento nacional de nuestros programas de formación para el trabajo, por su calidad y pertinencia, cumpliendo con el compromiso de articular la educación con el sector productivo, la comunidad y el desarrollo de la Nación."}
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10" variants={itemVariants}>
              {/* Misión Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="mission"
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-white rounded-xl hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full -mr-12 -mt-12"></div>
                  <AccordionTrigger className="p-6 relative z-10 flex items-center justify-between text-white hover:no-underline">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-secondary/30 mr-3">
                        <Target className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-bold text-white">MISIÓN</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0 relative z-10 text-white">
                    <p className="leading-relaxed">
                      {content.mission ||
                        "Formar personas para el trabajo y el desarrollo humano, con valores, espíritu emprendedor y capacidad técnica a través de una oferta académica con base en competencias laborales pertinentes a todos los escenarios productivos de la realidad actual y articulada con todos los niveles de la educación, a la vanguardia de los avances tecnológicos y en procura del bienestar social y del progreso del país."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Visión Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="vision"
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-secondary to-secondary/90 text-primary rounded-xl hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12"></div>
                  <AccordionTrigger className="p-6 relative z-10 flex items-center justify-between text-primary hover:no-underline">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/20 mr-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">VISIÓN</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0 relative z-10 text-primary">
                    <p className="leading-relaxed">
                      {content.vision ||
                        "UPARSISTEM se proyecta como la institución de educación para el trabajo y el desarrollo humano líder en Colombia, que contribuye con su oferta educativa al progreso del país, reconocida por la calidad y pertinencia de sus programas de formación."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
              <Image
                src={content.imageUrl || "/logoaltura.png"}
                alt="Entrenamiento en altura"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-3xl font-bold mb-3">{content.portfolio?.title || "PORTAFOLIO"}</h3>
                  <p className="text-xl mb-6">
                    {content.portfolio?.description ||
                      "Formación especializada en trabajo seguro en altura con los más altos estándares de calidad"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {content.portfolio?.features && content.portfolio.features.length > 0 ? (
                      content.portfolio.features.map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                        >
                          {feature.icon === "CheckCircle" && <CheckCircle className="h-5 w-5 text-secondary mr-2" />}
                          {feature.icon === "Users" && <Users className="h-5 w-5 text-secondary mr-2" />}
                          {feature.icon === "Award" && <Award className="h-5 w-5 text-secondary mr-2" />}
                          <span className="text-sm font-medium">{feature.text}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                          <span className="text-sm font-medium">Certificación NTC 6052:2014</span>
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Users className="h-5 w-5 text-secondary mr-2" />
                          <span className="text-sm font-medium">Instructores Certificados</span>
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Award className="h-5 w-5 text-secondary mr-2" />
                          <span className="text-sm font-medium">Instalaciones Modernas</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
