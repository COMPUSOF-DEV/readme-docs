# README Navegable

Convierte cualquier `README.md` en una web navegable con búsqueda, menú lateral y temas Light/Dark. Este proyecto está pensado para documentación rápida en repos públicos o privados sin necesidad de un generador complejo.

---

## Qué incluye

- Render de Markdown en el navegador.
- Menú lateral automático (TOC) con navegación por secciones.
- Búsqueda instantánea por títulos y contenido.
- Selector de temas (Light, Dark).
- Diseño responsive (sidebar plegable en móviles).
- Botón flotante para volver arriba.

---

## Demo local

1. Sirve la carpeta `docs/` con un servidor local.
2. Abre el navegador.

```bash
# desde la raíz del proyecto
php -S 127.0.0.1:8099 -t docs
```

Abrir en:

```
http://127.0.0.1:8099
```

---

## Cómo usarlo

1. Coloca tu `README.md` dentro de `docs/`.
2. Abre el sitio (ver demo local arriba).
3. El visor cargará automáticamente ese archivo.

> Si prefieres mantener tu `README.md` principal en la raíz, puedes copiarlo manualmente a `docs/README.md` cuando lo actualices.

---

## Estructura del proyecto

```
/README.md                 -> Este documento público del proyecto
/docs/README.md            -> El markdown que se renderiza en la web
/docs/index.html           -> Shell de la aplicación
/docs/style.css            -> Estilos y temas
/docs/app.js               -> Lógica (render, TOC, búsqueda, temas)
```

---

## Personalización rápida

### 1) Cambiar tema por defecto

En `docs/app.js`:

```
const initial = saved || 'light';
```

Cambia `light` por `dark` si quieres modo oscuro por defecto.

### 2) Paleta de colores

En `docs/style.css`:

```
:root { ... }                -> Light
[data-theme="dark"] { ... }   -> Dark
```

### 3) Logo / Branding

En `docs/index.html`:

```
<div class="brand-title">README Navegable</div>
<div class="brand-subtitle">Generado desde README.md</div>
```

---

## Publicación en GitHub Pages

1. Sube el repo a GitHub.
2. En Settings → Pages, elige la carpeta `/docs` como fuente.
3. GitHub publicará el sitio automáticamente.

---

## Licencia

Usa este proyecto libremente en tus repos, tanto públicos como privados.
