# 🚀 Implementación Completa: Guía Paso a Paso

## Resumen de cambios realizados

✅ **Minificación de assets**
- ✓ Scripts npm para minificar CSS y JS
- ✓ Output en `dist/` directory
- ✓ Referencias actualizadas en package.json

✅ **Optimización de imágenes**
- ✓ Script `scripts/optimize-images.js` para convertir a WebP
- ✓ Generación automática de thumbnails
- ✓ Integración con imagemin

✅ **CSP Headers**
- ✓ Configuración Nginx completa
- ✓ Configuración Apache completa
- ✓ Integración Node.js/Express

✅ **Service Worker**
- ✓ `js/sw.js` implementado con caché intelligent
- ✓ Registro automático en index.html y persona.html
- ✓ Offline support + PWA capabilities

✅ **Rate Limiting**
- ✓ `server/rate-limiter.js` middleware
- ✓ Protección para búsqueda, verificación de edad, APIs
- ✓ Response headers con límites restantes

✅ **Tests**
- ✓ Jest configurado en `jest.config.js`
- ✓ Tests de core en `__tests__/core.test.js`
- ✓ Cobertura de: loadData, search, router, XSS protection

✅ **HTTPS Setup**
- ✓ Guía Let's Encrypt (gratuita)
- ✓ Configuración Nginx + Apache
- ✓ Node.js/Express HTTPS support
- ✓ Redirección HTTP → HTTPS

---

## Instalación & Setup (30 minutos)

### Paso 1: Instalar dependencias

```bash
cd "C:\Users\HP\Desktop\MMORPG - MSC\Goticas-y-Pies"

# Instalar devDependencies
npm install

# Instalar herramientas faltantes (opcional si no están)
npm install --save-dev babel-jest @babel/preset-env
npm install --save-dev compression helmet
```

### Paso 2: Minificar assets (5 minutos)

```bash
# Crear directorio dist/
mkdir -p dist

# Minificar CSS
npm run minify:css

# Minificar JS
npm run minify:js

# O todo junto:
npm run build
```

**Resultado esperado:**
```
dist/
  ├── styles.min.css  (~2-4KB vs 5-10KB actual)
  └── app.min.js      (~8-12KB vs 15-20KB actual)
```

**Reemplazar referencias en HTML:**
```html
<!-- Antes -->
<link rel="stylesheet" href="css/styles.css"/>
<script type="module" src="js/app.js"></script>

<!-- Después -->
<link rel="stylesheet" href="dist/styles.min.css"/>
<script type="module" src="dist/app.min.js"></script>
```

### Paso 3: Optimizar imágenes (10 minutos)

```bash
# Instalar imagemin si aún no está
npm install --save-dev imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant

# Ejecutar optimización
npm run optimize:images

# Resultado:
# assets/personas-optimized/  (WebP de todos los JPG)
# assets/personas/*/          (thumbnails creados)
```

**Reemplazar referencias en HTML:**
```html
<!-- Antes -->
<img src="assets/personas/ci_ling/avatar.jpg" alt="...">

<!-- Después: Fallback -->
<picture>
  <source srcset="assets/personas/ci_ling/avatar.webp" type="image/webp">
  <img src="assets/personas/ci_ling/avatar.jpg" alt="...">
</picture>
```

### Paso 4: Ejecutar tests (5 minutos)

```bash
# Ejecutar tests
npm test

# Con watch (desarrollo)
npm run test:watch

# Con cobertura
npm test -- --coverage
```

**Output esperado:**
```
PASS  __tests__/core.test.js
  loadData
    ✓ debería cargar personas.json
    ✓ debería cachear datos por 1 hora
    ✓ debería validar estructura
  search
    ✓ debería filtrar por nombre
    ✓ debería filtrar por tag
  router
    ✓ debería extraer ID de URL
  Age Verification
    ✓ debería redirigir si no confirmó edad
    ✓ debería permitir acceso con verificación
  XSS Protection
    ✓ debería escapar caracteres peligrosos

Tests: 9 passed
Coverage: 60-75%
```

### Paso 5: Ejecutar linter (3 minutos)

```bash
# Verificar errores
npm run lint

# Arreglar automáticamente
npm run lint
```

### Paso 6: Service Worker (Automático)

Ya está registrado en `index.html` y `persona.html`. Funciona automáticamente en HTTPS.

**Verificar en DevTools:**
1. F12 → Application → Service Workers
2. Debe mostrar: ✓ Registered, Running

---

## Deployment: Configuración por servidor

### OPCIÓN 1: Node.js/Express (Más fácil)

```bash
# 1. Instalar dependencias servidor
npm install express compression

# 2. Ejecutar servidor
node server/app.js

# Resultado:
# 🚀 Servidor corriendo en: http://localhost:3000
```

**Para HTTPS en desarrollo:**
```bash
npm install https
node server/app-https.js
```

### OPCIÓN 2: Nginx (Recomendado para producción)

```bash
# 1. Instalar Nginx
sudo apt install nginx

# 2. Crear config
sudo cp server/CSP-HTTPS-GUIDE.md /tmp/nginx-config.txt

# 3. Editar configuración (ver CSP-HTTPS-GUIDE.md)
sudo nano /etc/nginx/sites-available/goticas-y-pies

# 4. Habilitar
sudo ln -s /etc/nginx/sites-available/goticas-y-pies /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### OPCIÓN 3: Apache (Si ya lo tienes)

```bash
# Ver CSP-HTTPS-GUIDE.md para configuración completa
sudo a2enmod ssl rewrite headers expires deflate
sudo a2ensite goticas-y-pies
sudo apache2ctl configtest
sudo systemctl restart apache2
```

---

## HTTPS Setup (15 minutos)

### Paso 1: Instalar Certbot

```bash
# En Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# En CentOS
sudo yum install certbot python3-certbot-nginx

# En macOS
brew install certbot
```

### Paso 2: Generar certificado Let's Encrypt

```bash
# Para Nginx
sudo certbot --nginx -d goticas-y-pies.com -d www.goticas-y-pies.com

# O standalone
sudo certbot certonly --standalone -d goticas-y-pies.com

# Verificar
sudo certbot certificates
```

### Paso 3: Renovación automática

```bash
# Habilitar (renovación cada 2.5 meses)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar
sudo systemctl status certbot.timer
```

---

## Verificación Post-Deployment

### ✅ Checklist de seguridad

```bash
# 1. Verificar CSP headers
curl -I https://goticas-y-pies.com | grep -i "content-security-policy"

# 2. Verificar HSTS
curl -I https://goticas-y-pies.com | grep -i "strict-transport"

# 3. Verificar certificado SSL
openssl s_client -connect goticas-y-pies.com:443

# 4. Verificar Service Worker
# En DevTools: F12 → Application → Service Workers → debe mostrar registrado

# 5. Verificar rate limiting
# Hacer 31 requests en < 1 min: debe retornar 429
for i in {1..35}; do curl -s https://goticas-y-pies.com/api/personas | head -c 20; echo; done
```

### 🔍 SSL Labs Test

1. Ir a: https://www.ssllabs.com/ssltest/
2. Ingresar: goticas-y-pies.com
3. Target: A+ grade

### 🚀 Lighthouse Audit

```bash
# En DevTools: Ctrl+Shift+P → Lighthouse
# Target scores:
# ✓ Performance: 80+
# ✓ Accessibility: 90+
# ✓ Best Practices: 90+
# ✓ SEO: 90+
# ✓ PWA: Installable (gracias a Service Worker)
```

---

## Monitoreo continuo

### Error Tracking (Sentry)

```javascript
// En app.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Analytics (Plausible/Fathom)

```html
<!-- En index.html -->
<script defer data-domain="goticas-y-pies.com" src="https://plausible.io/js/script.js"></script>
```

### Uptime Monitoring

- Pingdom: https://www.pingdom.com
- Uptime Robot: https://uptimerobot.com
- Free alert cada hora

---

## Troubleshooting

### ❌ Service Worker no registra
```javascript
// Verificar en DevTools Console:
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations))

// Debe estar en HTTPS o localhost
console.log(location.protocol) // debe ser "https:"
```

### ❌ CSP violations en console
```
Blocked by CSP: ...
```
Ajustar políticas en CSP header (ver CSP-HTTPS-GUIDE.md)

### ❌ Rate limiting demasiado restrictivo
Ajustar en `server/rate-limiter.js`:
```javascript
const limits = {
  search: { max: 50, window: 60000 }, // Aumentar a 50
  ageCheck: { max: 15, window: 60000 }, // Aumentar a 15
}
```

### ❌ Certificado expirado
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

---

## Resumen de archivos creados/modificados

| Archivo | Tipo | Propósito |
|---------|------|----------|
| package.json | modificado | Scripts build, test, minify |
| js/sw.js | **NUEVO** | Service Worker PWA |
| jest.config.js | **NUEVO** | Testing configuration |
| .eslintrc.json | **NUEVO** | Linting rules |
| __tests__/core.test.js | **NUEVO** | Tests básicos |
| scripts/optimize-images.js | **NUEVO** | Optimización imágenes |
| server/rate-limiter.js | **NUEVO** | Rate limiting middleware |
| server/app.js | **NUEVO** | Express server |
| server/CSP-HTTPS-GUIDE.md | **NUEVO** | Security config |
| server/HTTPS-SETUP.md | **NUEVO** | HTTPS setup guide |
| index.html | modificado | SW registration |
| persona.html | modificado | SW registration |
| babel.config.js | **NUEVO** | Babel transpilation |

---

## Próximos pasos (Opcionales)

1. **Analytics**: Integrar Sentry + Plausible
2. **CDN**: Usar Cloudflare para caché global + DDoS
3. **Monitoring**: Setup uptime monitoring
4. **Backup**: Configurar backup automático DB/assets
5. **Docs**: Actualizar documentación interna

---

## Contacto & Support

Para problemas:
1. Ver logs: `tail -f /var/log/nginx/error.log`
2. DevTools: F12 → Console, Network, Application
3. SSL Labs: https://www.ssllabs.com/ssltest/

¡Listo para producción! 🚀
