# 📋 Instrucciones para implementar AdSense en páginas

## ✅ Ya hice estos cambios:

1. **Creado:** `src/components/GoogleAdsense.astro`
2. **Modificado:** `src/layouts/MainLayout.astro` (añadido script de AdSense)

## 📝 Lo que necesitas hacer:

### 1. En páginas de noticias individuales (`src/pages/noticias/[slug].astro`):

**Añadir al inicio (con los otros imports):**
```astro
import GoogleAdsense from "../../components/GoogleAdsense.astro";
```

**Añadir anuncios donde quieras:**

```astro
<!-- Después del header de la noticia -->
</header>
<GoogleAdsense slot="1234567890" />

<!-- En medio del contenido (si es largo) -->
{data.content && data.content.length > 2000 && (
  <GoogleAdsense slot="0987654321" layout="in-article" />
)}

<!-- Antes del footer -->
<GoogleAdsense slot="5432109876" />
<footer class="noticia-footer">
```

### 2. En listado de noticias (`src/pages/noticias/page/[...page].astro`):

**Import:**
```astro
import GoogleAdsense from "../../../components/GoogleAdsense.astro";
```

**En el grid (cada 6 noticias):**
```astro
{(index + 1) % 6 === 0 && index !== noticias.length - 1 && (
  <div style="grid-column: 1 / -1;">
    <GoogleAdsense slot="BBBBBBBBBB" format="horizontal" />
  </div>
)}
```

### 3. Crear bloques en AdSense:

1. Ve a https://www.google.com/adsense
2. Crea bloques de anuncios:
   - **Header noticia**: Display adaptable
   - **In-article**: Anuncio In-article
   - **Listado**: Display horizontal
3. Copia el `data-ad-slot` de cada bloque

### 4. Commit y push:

```bash
git add .
git commit -m "feat: Implementar Google AdSense

- Añadir componente GoogleAdsense
- Añadir script global en MainLayout
- Client ID: ca-pub-6260623796240430"

git push
```

## ⚠️ Importante:
- Reemplaza `1234567890` con los IDs reales de tus bloques
- Los anuncios pueden tardar 30-60 min en aparecer
- NO hagas clic en tus propios anuncios
