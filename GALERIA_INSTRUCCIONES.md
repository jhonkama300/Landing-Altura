# Instrucciones para la Galería de Imágenes

## Cómo funciona la galería

La galería ahora carga automáticamente las imágenes desde el sistema de archivos. Esto significa que no necesitas usar una base de datos para gestionar las imágenes. Las imágenes se muestran en un carousel elegante en cada categoría.

## Estructura de carpetas

Las imágenes deben estar organizadas en carpetas dentro de `public/gallery/`. Cada carpeta representa una categoría.

\`\`\`
public/
└── gallery/
    ├── instalaciones/
    │   ├── imagen1.jpg
    │   ├── imagen2.png
    │   └── imagen3.webp
    ├── formacion/
    │   ├── curso1.jpg
    │   └── curso2.jpg
    ├── equipos/
    │   ├── equipo1.jpg
    │   └── equipo2.jpg
    └── encuentros/
        ├── encuentro1.jpg
        ├── encuentro2.jpg
        └── encuentro3.jpg
\`\`\`

## Cómo añadir una nueva categoría

1. Crea una nueva carpeta dentro de `public/gallery/` con el nombre de la categoría
2. Añade las imágenes dentro de esa carpeta
3. La galería detectará automáticamente la nueva categoría y mostrará las imágenes

**Ejemplo:** Si quieres crear una categoría llamada "Encuentros":
- Crea la carpeta `public/gallery/encuentros/`
- Añade tus imágenes dentro de esa carpeta
- La galería mostrará automáticamente la categoría "Encuentros" con todas las imágenes en un carousel

## Subir imágenes desde el panel de administración

1. Ve a `/admin/dashboard/gallery`
2. Selecciona la categoría donde quieres subir imágenes
3. Haz clic en "Subir Imágenes"
4. Selecciona uno o varios archivos
5. Las imágenes se guardarán automáticamente en la carpeta correspondiente del servidor

## Subir imágenes vía cPanel/FTP

Si prefieres subir imágenes directamente al servidor:

1. Accede a tu servidor vía FTP o el administrador de archivos de cPanel
2. Navega a la carpeta `public/gallery/`
3. Crea una carpeta con el nombre de tu categoría (si no existe)
4. Sube las imágenes a esa carpeta
5. Las imágenes aparecerán automáticamente en la galería sin necesidad de reiniciar

## Formatos de imagen soportados

- JPG/JPEG
- PNG
- GIF
- WEBP
- SVG

## Formatos de video soportados

- MP4
- WEBM
- OGG

## Nombres de archivo

Los nombres de los archivos se convertirán automáticamente en títulos legibles:
- `imagen-de-prueba.jpg` → "Imagen De Prueba"
- `curso_formacion_2024.png` → "Curso Formacion 2024"

## Características de la galería

- **Carousel**: Las imágenes se muestran en un carousel elegante en cada categoría
- **Modal de galería completa**: Haz clic en "Ver galería completa" para ver todas las imágenes en un grid
- **Búsqueda**: Busca imágenes por título, descripción o etiquetas
- **Favoritos**: Marca imágenes como favoritas
- **Navegación con teclado**: Usa las flechas izquierda/derecha para navegar entre imágenes en el modal

## Notas importantes

- Las carpetas deben estar directamente dentro de `public/gallery/`
- Los nombres de las carpetas se convertirán en slugs para las URLs (ej: "Mis Fotos" → "mis-fotos")
- Las imágenes se ordenan por nombre de archivo
- No es necesario reiniciar el servidor, los cambios se detectan automáticamente
- Compatible con despliegue en cPanel y otros servidores tradicionales
