# 👨‍💻 Guía para Desarrolladores

## Setup Inicial

### 1. Clonar/Descargar Proyecto
```bash
cd "C:\Users\HP\Desktop\MMORPG - MSC"
# O: git clone <repo-url>
```

### 2. Instalar Dependencias (Opcional)
```bash
cd Goticas-y-Pies
npm install
```

### 3. Ejecutar Local
```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node
npm run serve:node

# Opción 3: VS Code Live Server
# Click derecho en index.html → Open with Live Server
```

---

## Estructura de Código

### Frontend
```
js/
├── app.js          - Lógica grid principal (search, render, modal trigger)
├── persona.js      - Página perfil (tabs, galería, lightbox)
├── router.js       - Navegación y verificación edad
├── modal.js        - Modal previsualizador
├── search.js       - Búsqueda + filtros tags
├── loadData.js     - Carga datos con caché
└── cookies.js      - Consentimiento cookies + modales legales

css/
└── styles.css      - Todos los estilos (variables CSS, responsive)

data/
├── personas.json   - Base de datos perfiles
└── legal.json      - Textos legales
```

---

## Agregar Nueva Persona

### 1. Assets
```
assets/personas/mi_usuario/
├── avatar.jpg      (170×170)
├── banner.jpg      (820×312)
├── img1.jpg
├── img2.jpg
└── video.mp4       (opcional)
```

### 2. personas.json
```json
{
  "id": "mi_usuario",
  "nombre": "Mi Nombre",
  "verificado": false,
  "usuario": "@mi_usuario",
  "seguidores": "100",
  "seguidos": "50",
  "tags": ["tag1", "tag2", "tag3"],
  "descripcion": "Mi descripción",
  "avatar": "assets/personas/mi_usuario/avatar.jpg",
  "banner": "assets/personas/mi_usuario/banner.jpg",
  "preview": "assets/personas/mi_usuario/img1.jpg",
  "imagenes": [
    "assets/personas/mi_usuario/img1.jpg",
    "assets/personas/mi_usuario/img2.jpg"
  ],
  "videos": ["assets/personas/mi_usuario/video.mp4"],
  "links": {
    "instagram": "https://instagram.com/mi_usuario",
    "onlyfans": "https://onlyfans.com/mi_usuario"
  }
}
```

---

## Convenciones de Código

### JavaScript
```javascript
// ✅ Naming
const allPersons = [];
function renderCard(person) {}

// ✅ Sanitización XSS (OBLIGATORIO)
const name = person.nombre.replace(/&/g, '&amp;')...;
const html = `<div>${esc(name)}</div>`;

// ✅ Error handling
try {
  const data = await fetch('url').then(r => r.json());
} catch(e) {
  console.error('[module] error:', e);
  return [];
}

// ❌ Evitar
innerHTML = userInput;  // XSS risk
eval(code);             // Security risk
```

### CSS
```css
/* ✅ Usar variables */
:root {
  --color-primary: #5b21b6;
  --spacing-base: 16px;
}

.element {
  color: var(--color-primary);
  padding: var(--spacing-base);
}

/* ✅ Mobile-first */
.card { width: 100%; }
@media (min-width: 768px) { .card { width: 50%; } }
```

### HTML
```html
<!-- ✅ Accessibility -->
<button aria-label="Close modal">✕</button>
<div role="list">
  <article role="listitem">Item</article>
</div>

<!-- ✅ SEO -->
<meta name="description" content="...">
<meta property="og:title" content="...">
```

---

## Debugging

### Browser DevTools
```javascript
// Console
_todas           // Array de personas en app.js
_query           // Búsqueda actual
_tag             // Tag filtrado

// Check localStorage
localStorage.getItem('gy_age_confirmed')
localStorage.getItem('gy_cookie_consent')
sessionStorage.getItem('gy_session_verified')
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "CORS error" | Acceso file:// | Usar http-server |
| "imagen no carga" | Ruta incorrecta | Verificar en DevTools |
| "modal no abre" | JavaScript error | Ver Console (F12) |
| "búsqueda lenta" | Archivo JSON grande | Implementar pagination |
| "edad no valida" | localStorage corrupto | Borrar: `localStorage.clear()` |

---

## Testing Manual

### Checklist
- [ ] **Verificación edad**: Borrar localStorage, recargar, verificar flujo
- [ ] **Búsqueda**: Escribe en input, verifica filtrado en tiempo real
- [ ] **Tags**: Clica tag, verifica filtrado correcto
- [ ] **Modal**: Clica card → preview → "Ver perfil completo"
- [ ] **Lightbox**: Clica foto → ampliar → cerrar con X o ESC
- [ ] **Mobile**: DevTools → Responsive → prueba gestos
- [ ] **Keyboard**: TAB → navegación, ENTER → click, ESC → cerrar

### URLs para Testing
```
http://localhost:8000                          # Índice
http://localhost:8000/persona.html?id=ci_ling # Perfil específico
http://localhost:8000/18.html                  # Edad
http://localhost:8000/18.html?redirect=...     # Con redirect
```

---

## Performance Tips

1. **Imágenes**: Comprime con WebP (45% menor)
2. **Caché**: Añade Service Worker para offline
3. **Bundle**: Minifica CSS/JS (~60% menor)
4. **Lazy loading**: Usa `loading="lazy"`
5. **Debounce**: Búsqueda ya tiene delay (220ms)

---

## Seguridad

### Auditoría
```bash
npm audit              # Revisar vulnerabilidades
npm audit fix          # Arreglar automáticamente
```

### Checklist
- [ ] Nunca guardar contraseñas en localStorage
- [ ] Sanitizar TODO input de usuarios
- [ ] No exponer URLs privadas en código
- [ ] Usar HTTPS en producción
- [ ] Implementar CSP headers

---

## Git Workflow

```bash
# Crear rama
git checkout -b feature/nueva-funcion

# Hacer cambios
git add .
git commit -m "feat: agregar nueva persona"

# Push
git push origin feature/nueva-funcion

# Pull request en GitHub
```

### Commit Messages
```
feat: agregar búsqueda por tags
fix: corregir renderizado de modal
docs: actualizar README
style: optimizar CSS
refactor: mejorar loadData cache
test: agregar tests E2E
```

---

## Recursos

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev Best Practices](https://web.dev/)
- [Can I Use](https://caniuse.com/) - Compatibilidad browsers
- [DevTools Tips](https://devtoolstips.org/)

---

**Última actualización**: Mayo 2026
**Versión**: 2.0

¿Preguntas? Contacta al administrador del proyecto.
