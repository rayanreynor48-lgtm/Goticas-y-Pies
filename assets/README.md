# Assets — Goticas y Pies

## Estructura de carpetas

Cada persona tiene su propia carpeta dentro de `/assets/personas/`:

```
/assets/personas/
├── maria/
│   ├── img1.jpg        ← imagen de preview (referenciada en JSON como "preview")
│   ├── img2.jpg
│   ├── img3.jpg
│   └── video1.mp4
├── ana/
│   ├── img1.jpg
│   └── img2.jpg
└── nueva_persona/      ← solo crear carpeta y agregar entrada en personas.json
    ├── img1.jpg
    └── video1.mp4
```

## Cómo agregar una nueva persona

1. Crear carpeta: `/assets/personas/<id>/`
2. Agregar imágenes y videos dentro
3. Agregar entrada en `/data/personas.json`:

```json
{
  "id": "nueva_persona",
  "nombre": "Nombre Completo",
  "tags": ["tag1", "tag2"],
  "descripcion": "Descripción corta.",
  "preview": "assets/personas/nueva_persona/img1.jpg",
  "imagenes": [
    "assets/personas/nueva_persona/img1.jpg",
    "assets/personas/nueva_persona/img2.jpg"
  ],
  "videos": [
    "assets/personas/nueva_persona/video1.mp4"
  ],
  "links": {
    "instagram": "https://instagram.com/...",
    "onlyfans": "https://onlyfans.com/..."
  }
}
```

## Formatos recomendados

- **Imágenes**: JPG, WebP (máx 1200px, comprimidas)
- **Videos**: MP4 (H.264), máx 720p para carga rápida
- **Preview**: imagen vertical relación 3:4 aprox.
