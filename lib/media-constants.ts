// Constantes compartidas entre frontend y backend

export const ALLOWED_FILE_TYPES = {
  hero: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
  about: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  services: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  gallery: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  certifications: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  contact: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  navbar: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  features: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
};

export const FOLDER_STRUCTURE = {
  hero: ["backgrounds", "carousel"],
  about: ["main", "team", "facilities"],
  services: ["thumbnails", "icons", "gallery"],
  gallery: ["instalaciones", "formacion", "equipos"],
  certifications: ["logos", "certificates"],
  contact: ["maps", "icons"],
  navbar: ["logos", "icons"],
  features: ["icons", "images"],
};
