# Jornada ARIA — Web de producción audiovisual

Aplicación estática para organizar la jornada de rodaje del 29/10. Incluye pestañas para VIDEO 1 — CINE y REEL 1–4, gestión de planos y checklist de rodaje.

## Funcionalidades
- Crear, editar y eliminar videos.
- Crear, editar y eliminar planos.
- Marcar planos como grabados y ver el progreso.
- Guardar automáticamente los cambios en `localStorage`.
- Diseño responsive para celular y escritorio.
- Incluye un desglose inicial para VIDEO 1 — CINE basado en las notas de ARIA.

## Importante sobre el guardado
Los datos se conservan al cerrar y volver a abrir la web en el mismo navegador y dispositivo. No se sincronizan entre distintos dispositivos ni navegadores. Si se borran los datos del navegador, se pueden perder. Para compartir progreso entre varias personas o usar varios celulares, habría que conectar una base de datos (por ejemplo, Supabase).

## Publicar en Vercel
1. Descomprimí `jornada-aria-vercel.zip`.
2. Creá un repositorio en GitHub llamado `jornada-aria`.
3. Subí al repositorio los archivos `index.html`, `styles.css`, `app.js` y `vercel.json` (no hace falta subir la carpeta ZIP).
4. Entrá en https://vercel.com/new e iniciá sesión.
5. Importá el repositorio `jornada-aria`.
6. En la configuración del proyecto, dejá Framework Preset como **Other**. No hace falta build command ni output directory para esta web estática.
7. Hacé clic en **Deploy**. Vercel te dará una URL pública.
8. Abrí la URL en el celular y agregala a favoritos o a la pantalla de inicio.

## Archivos
- `index.html`: estructura de la app.
- `styles.css`: diseño y estilos.
- `app.js`: videos, planos, edición, checklist y guardado local.
- `vercel.json`: configuración simple para servir la web estática.
