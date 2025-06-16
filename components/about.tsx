"use client"

import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGsapScrollTrigger } from "@/hooks/use-gsap"
import { getContentSection } from "@/lib/content"

export function About() {
  const textContainerRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const paragraph1Ref = useRef<HTMLParagraphElement>(null)
  const paragraph2Ref = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Obtener el contenido de la sección About
  const aboutContent =
    typeof window !== "undefined"
      ? getContentSection("about")
      : {
          title: "Sobre Nosotros",
          paragraph1:
            "Somos un equipo apasionado de desarrolladores y diseñadores dedicados a crear experiencias web excepcionales. Nuestra misión es transformar la forma en que los usuarios interactúan con los sitios web, haciendo que cada desplazamiento sea una experiencia fluida y agradable.",
          paragraph2:
            "Con años de experiencia en el desarrollo web, hemos perfeccionado el arte de combinar React con Lenis y GSAP para crear sitios web que no solo se ven increíbles, sino que también ofrecen una experiencia de usuario inigualable.",
          buttonText: "Conoce al equipo",
          imageUrl: "/placeholder.svg?key=dni35",
        }

  // Aplicamos animaciones GSAP
  useGsapScrollTrigger(textContainerRef, {
    start: "top 70%",
  })

  useGsapScrollTrigger(imageContainerRef, {
    start: "top 70%",
  })

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={textContainerRef} className="opacity-0">
            <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-6">
              {aboutContent.title}
            </h2>
            <p ref={paragraph1Ref} className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {aboutContent.paragraph1}
            </p>
            <p ref={paragraph2Ref} className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {aboutContent.paragraph2}
            </p>
            <Button ref={buttonRef} size="lg">
              {aboutContent.buttonText}
            </Button>
          </div>

          <div
            ref={imageContainerRef}
            className={cn("relative h-[400px] md:h-[500px] rounded-xl overflow-hidden opacity-0")}
          >
            <Image
              src={aboutContent.imageUrl || "/placeholder.svg"}
              alt="Nuestro equipo"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
