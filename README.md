# Instrucciones de Subida — Zalei Atlas v2.0 🚀

Este directorio `deploy_zalei_ready/` contiene la estructura completa y lista para ser publicada en el servidor de producción bajo el subdirectorio `/zalei` del dominio `www.inglesconjuanma.com.ar`.

---

## 📂 Estructura del Directorio a Subir

Debes subir todo el contenido de este directorio (o el archivo comprimido `deploy_zalei_ready.zip` que dejé preparado) a la carpeta del hosting correspondiente a `/zalei`.

La estructura final en el servidor debe quedar así:

```text
public_html/zalei/
├── index.html                   ← Nueva landing/panel (Outfit/Inter, dark theme)
├── chadi-review.html            ← Página de revisión visual para celulares
├── assets/                      ← Assets optimizados para la revisión de Chadi
│   ├── 01_atlas_overview.jpg
│   ├── 02_z06_compare.jpg
│   ├── 03_z19_compare.jpg
│   ├── 04_z18_questioned.jpg
│   ├── 05_z15_candidates.jpg
│   └── 06_z16_candidates.jpg
├── viewers/                     ← Herramientas interactivas
│   ├── index_2d.html
│   ├── index_3d.html
│   └── crop_viewer.html
├── atlas/                       ← Metadata (requerido por viewers 2D y Crops)
│   ├── zones.json
│   ├── microzones.json
│   ├── blockout_3d.json
│   ├── validation.json
│   └── crops_manifest.json
└── v1/                          ← Primera Versión Del Atlas (Versión Anterior Archivada)
    ├── index.html
    ├── styles.css
    ├── assets/
    │   ├── map.jpg
    │   └── zalei-hero.png
    ├── data/
    └── src/
```

---

## ⚠️ ¡IMPORTANTE! Archivos Pesados Excluidos del ZIP

Para evitar crear un archivo ZIP excesivamente pesado, los siguientes componentes locales **no** se incluyeron dentro de `deploy_zalei_ready/` pero **son necesarios si deseas que el Visualizador 2D y el Crop Viewer carguen correctamente en el servidor**:

1. **Imagen Satelital de Alta Resolución:**
   * Archivo local: `zalei_satellite_5042x4474.png` (28.37 MB)
   * Destino en el servidor: `public_html/zalei/zalei_satellite_5042x4474.png`
2. **Carpeta de Crops Individuales:**
   * Carpeta local: `crops/` (80.86 MB)
   * Destino en el servidor: `public_html/zalei/crops/` (con todos los subdirectorios `z01_...` a `z22_...`)

> [!NOTE]
> Si no vas a utilizar las herramientas interactivas complejas (2D y Crop Viewer) con Chadi y solo necesitas que vea la landing y la revisión visual de imágenes (Card Roja), **no es necesario que subas estos 108 MB de archivos pesados**. La revisión celular y el blockout 3D seguirán funcionando perfectamente.

---

## 🛠️ Procedimiento de Subida Paso a Paso

### Opción A: A través de cPanel (Recomendado y rápido)

1. En tu computadora, comprime todo el contenido de la carpeta `deploy_zalei_ready/` en un archivo ZIP (o utiliza el archivo `deploy_zalei_ready.zip` que ya he generado por ti en la raíz de tu proyecto).
2. Entra al **Administrador de Archivos** (File Manager) de tu cPanel en Hostgator/proveedor.
3. Navega hasta la carpeta **`public_html/`**.
4. Si no existe una carpeta llamada **`zalei`**, créala (`+ Carpeta` -> nombre: `zalei`).
5. Entra a la carpeta **`zalei`** (`public_html/zalei/`).
6. Haz clic en **Cargar** (Upload) y selecciona el archivo **`deploy_zalei_ready.zip`**.
7. Una vez subido al 100%, selecciónalo en el Administrador de Archivos y haz clic en **Extraer** (Extract).
8. Asegúrate de extraerlo directamente en la carpeta actual (`public_html/zalei/`).
9. *(Opcional)* Si quieres soporte completo para el mapa 2D y crop viewer, sube también de la misma forma el archivo `zalei_satellite_5042x4474.png` y la carpeta `crops/` comprimida en un ZIP temporal y extráela allí mismo.
10. ¡Listo! Ya puedes acceder a la URL:
    👉 `https://www.inglesconjuanma.com.ar/zalei`

### Opción B: Subida manual por FTP/SFTP (FileZilla)

1. Abre tu cliente FTP (FileZilla) y conéctate al servidor de `inglesconjuanma.com.ar`.
2. Ve al directorio remoto `/public_html/zalei/`.
3. Arrastra y sube el contenido de `deploy_zalei_ready/` desde tu panel local al remoto.
4. Arrastra también `zalei_satellite_5042x4474.png` y el directorio `crops/` al directorio remoto `/public_html/zalei/`.

---

## 🧪 Verificaciones del Deploy

Una vez realizada la subida, ingresa y confirma que los siguientes enlaces funcionen correctamente en tu celular o navegador:
* Landing principal: `https://www.inglesconjuanma.com.ar/zalei`
* Revisión celular para Chadi: `https://www.inglesconjuanma.com.ar/zalei/chadi-review.html`
* 3D Blockout: `https://www.inglesconjuanma.com.ar/zalei/viewers/index_3d.html`
* Primera versión archivada (v1): `https://www.inglesconjuanma.com.ar/zalei/v1/index.html`
* Mapa 2D: `https://www.inglesconjuanma.com.ar/zalei/viewers/index_2d.html` *(Requiere subir la imagen satelital)*
* Crop Viewer: `https://www.inglesconjuanma.com.ar/zalei/viewers/crop_viewer.html` *(Requiere subir la carpeta de crops)*
