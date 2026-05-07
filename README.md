# ⚰ Goticas y Pies — Catálogo +18

Catálogo web moderno para perfiles exclusivos +18 con diseño gótico elegante. Incluye verificación de edad, búsqueda en tiempo real, filtros por tags, modal previsualizador y perfil completo con galería.

## 🎯 Características

✅ **Verificación de Edad +18** - Doble validación (localStorage + sessionStorage)
✅ **Búsqueda en Tiempo Real** - Busca por nombre, tags y descripción
✅ **Filtros Avanzados** - Tags dinámicos extraídos de personas.json
✅ **Modal Previsualizador** - Antes de acceder al perfil completo
✅ **Perfil Completo** - Banner, avatar, galería de fotos, videos
✅ **Lightbox** - Ampliar imágenes con navegación
✅ **Diseño Responsivo** - Mobile-first, adaptado a todos los tamaños
✅ **Gestión de Cookies** - Consentimiento integrado en localStorage
✅ **Accesibilidad** - Atributos ARIA, navegación por teclado
✅ **Seguridad** - Sanitización XSS, sin exponer datos sensibles

---

## 📁 Estructura del Proyecto

```
Goticas-y-Pies/
├── index.html              # Página principal (grid de cards)
├── persona.html            # Página de perfil completo
├── 18.html                 # Verificación de edad
├── css/
│   └── styles.css          # Estilos únicos (variables, grid, responsivo)
├── js/
│   ├── app.js              # Lógica principal (grid, búsqueda, modal)
│   ├── persona.js          # Lógica de perfil (galería, lightbox, tabs)
│   ├── router.js           # Navegación y verificación de edad
│   ├── modal.js            # Modal previsualizador
│   ├── search.js           # Búsqueda y filtros por tags
│   ├── loadData.js         # Carga de datos con caché
│   └── cookies.js          # Gestión de cookies y modales legales
├── data/
│   ├── personas.json       # Base de datos de perfiles
│   └── legal.json          # Textos legales (privacidad, cookies, etc.)
├── assets/
│   ├── personas/           # Carpetas individuales por perfil
│   │   ├── ci_ling/
│   │   │   ├── avatar.jpg
│   │   │   ├── banner.jpg
│   │   │   ├── img1.jpg ... img5.jpg
│   │   └── wdna_ii/
│   │       ├── avatar.jpg
│   │       ├── banner.jpg
│   │       ├── img1.jpg ... img4.jpg
│   └── README.md           # Guía de assets
├── .gitignore             # Archivos ignorados por git
└── README.md              # Este archivo
```

---

## 🚀 Instalación y Ejecución

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- HTTP server local (no funciona con `file://` por CORS)

### Opción 1: Python
```bash
cd "C:\Users\HP\Desktop\MMORPG - MSC\Goticas-y-Pies"
python -m http.server 8000
# Accede a http://localhost:8000
```

### Opción 2: Node.js (http-server)
```bash
npm install -g http-server
cd "C:\Users\HP\Desktop\MMORPG - MSC\Goticas-y-Pies"
http-server
```

### Opción 3: VS Code Live Server
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"

---

## 📊 Estructura de Datos

### personas.json
```json
{
  "id": "ci_ling",
  "nombre": "CI Ling",
  "verificado": true,
  "usuario": "@ci_ling",
  "seguidores": "142K",
  "seguidos": "129",
  "tags": ["cosplay", "gotica", "alternativa", "anime", "plus-size", "curvy", "feet-focus", "model", "fantasy-style", "glutes"],
  "descripcion": "Descripción de la persona",
  "avatar": "assets/personas/ci_ling/avatar.jpg",
  "banner": "assets/personas/ci_ling/banner.jpg",
  "preview": "assets/personas/ci_ling/img1.jpg",
  "imagenes": ["assets/personas/ci_ling/img1.jpg", ...],
  "videos": ["assets/personas/ci_ling/video1.mp4"],
  "links": {
    "instagram": "https://instagram.com/...",
    "onlyfans": "https://onlyfans.com/..."
  }
}
```

### Tags Disponibles
```
cosplay, gotica, alternativa, anime, plus-size, curvy, feet-focus, model, 
fantasy-style, glutes, slim, long-legs, fashion, busty
```

---

## ➕ Agregar una Nueva Persona

### 1. Crear carpeta de assets
```
assets/personas/nueva_persona/
├── avatar.jpg    (170×170 mínimo)
├── banner.jpg    (820×312, ratio 2.63:1)
├── img1.jpg ... (galería de fotos)
└── video1.mp4    (opcional)
```

### 2. Agregar entrada en `data/personas.json`
```json
{
  "id": "nueva_persona",
  "nombre": "Nombre Completo",
  "verificado": false,
  "usuario": "@usuario",
  "seguidores": "1K",
  "seguidos": "50",
  "tags": ["tag1", "tag2", "tag3"],
  "descripcion": "Breve descripción",
  "avatar": "assets/personas/nueva_persona/avatar.jpg",
  "banner": "assets/personas/nueva_persona/banner.jpg",
  "preview": "assets/personas/nueva_persona/img1.jpg",
  "imagenes": [
    "assets/personas/nueva_persona/img1.jpg",
    "assets/personas/nueva_persona/img2.jpg"
  ],
  "videos": ["assets/personas/nueva_persona/video1.mp4"],
  "links": {
    "instagram": "https://instagram.com/usuario",
    "onlyfans": "https://onlyfans.com/usuario"
  }
}
```

---

## 🔒 Seguridad

### Verificación de Edad
- ✅ localStorage + sessionStorage (doble validación)
- ✅ URL redirect parameter para volver después de verificar
- ✅ Timestamp de verificación en sessionStorage
- ⚠️ **Nota**: Esta es una verificación client-side. Para producción, implementar con backend + sesiones

### Sanitización XSS
- Función `esc()` en todos los archivos JS
- No usar `innerHTML` con datos no sanitizados
- Siempre escapar caracteres especiales (&, <, >, ")

### Meta Tags Seguridad
- `robots: noindex, nofollow` - Previene indexación no deseada
- Content Security Policy recommended (agregar en producción)

---

## 🎨 Personalización

### Variables CSS (styles.css)
```css
:root {
  --negro: #060608;
  --morado: #5b21b6;
  --morado-vivo: #a855f7;
  --rojo: #dc2626;
  --blanco: #f8f4ff;
  --avatar-desktop: 170px;
  --avatar-mobile: 128px;
  --nav-h: 68px;
}
```

### Tipografía
- Display: **Cinzel Decorative** (serif, 700/900)
- Body: **Crimson Pro** (serif, 300/400/600)

---

## 📱 Responsive Breakpoints

```css
Desktop:   grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))
Tablet:    (768px) → minmax(200px, 1fr)
Mobile:    (480px) → minmax(160px, 1fr)
```

---

## 🔧 Mejoras Planeadas

- [ ] Panel de administración para gestionar perfiles
- [ ] Sistema de comentarios y valoraciones
- [ ] Integración con redes sociales (OAuth)
- [ ] Backend Node.js + Base de datos (MongoDB)
- [ ] PWA (instalable como app)
- [ ] Caché persistente (Service Worker)
- [ ] Analytics (Plausible o Fathom)
- [ ] Sistema de notificaciones
- [ ] API REST para datos

---

## 🧪 Testing

### Manual
1. Verificación de edad: Borra localStorage y recarga
2. Búsqueda: Escribe en el input y verifica filtrado
3. Tags: Clica en tags y verifica filtrado combinado
4. Modal: Clica card → preview → ver perfil completo
5. Lightbox: Clica foto en perfil → ampliar → cerrar
6. Responsive: Abre DevTools (F12) y prueba en móvil

---

## 📝 Licencia & Legales

- Contenido para adultos +18
- Uso exclusivo con consentimiento
- Privacidad: Ver `data/legal.json`
- Cookies: Almacenamiento local apenas (sin tracking externo)

---

## 👨‍💻 Autor

Desarrollado para catálogo de perfiles góticos y fetish.
Proyecto 2026 · MMORPG - MSC

---

## 📞 Contacto & Soporte

Para agregar perfiles o reportar problemas, contacta al administrador.

**Último actualizado**: Mayo 2026
**Versión**: 2.0 (con etiquetas expandidas y seguridad mejorada)
