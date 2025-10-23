"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Play } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

type GalleryImage = {
  id: string
  src: string
  title: string
  alt: string
  description?: string
  tags?: string[]
  type: "image" | "video"
  thumbnail_src?: string
}

interface CarouselImageCardProps {
  image: GalleryImage
  index: number
  categorySlug: string
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
}

export default function CarouselImageCard({
  image,
  index,
  categorySlug,
  isFavorite,
  onClick,
  onToggleFavorite,
}: CarouselImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
        <CardContent className="p-0 relative h-full">
          {/* Image container */}
          <div className="relative aspect-[4/3] overflow-hidden" onClick={onClick}>
            {image.type === "video" ? (
              <div className="relative w-full h-full bg-gray-900">
                <video
                  src={image.src}
                  poster={image.thumbnail_src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
            ) : (
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-semibold text-lg mb-1 line-clamp-1">{image.title}</h4>
                {image.description && <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>}
              </div>
            </div>
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
              {image.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-white/90 dark:bg-gray-800/90">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
