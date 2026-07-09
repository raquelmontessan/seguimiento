# Tablero QA — INFONAVIT

Panel del equipo de **Aseguramiento de Calidad (QA)** de INFONAVIT. App **Ionic + Angular** (standalone + signals) portada desde un tablero HTML de un solo archivo (`Tablero_Carga_QA_v27.html`). Se despliega como **web (Netlify)** y como **APK Android (Capacitor)**.

> Idioma del proyecto: **español** (UI, comentarios y mensajes de commit). Mantén ese idioma.

## Stack

- **Angular 20.3** (componentes standalone, `signal()`/`computed()`, control flow `@if`/`@for`)
- **Ionic 8** (`@ionic/angular/standalone`, íconos `ionicons`)
- **Capacitor 8** (Android). `appId: mx.infonavit.qa.tablero`, `appName: Tablero QA`
- **Chart.js 4** (gráficas), **xlsx / SheetJS** (lectura del Control Maestro)
- Requiere **Node ≥ 22** (lo exige el CLI de Capacitor 8)

## Comandos

```bash
npm install
npm start          # dev server (ng serve) — se usa en el puerto 8100 (como ionic serve)
npm run build      # build de producción -> www/  (defaultConfiguration = production)
npm run lint
```

No hay CLI de `ionic` instalado; usar `ng`/`npm`. Para levantar en 8100: `npx ng serve --port 8100 --host 127.0.0.1`.

## Arquitectura

Rutas en [src/app/app.routes.ts](src/app/app.routes.ts). Todas menos `/bienvenida` pasan por `authGuard`:

- `/bienvenida` — [pages/welcome](src/app/pages/welcome) — portada + login por perfil
- `/home` — portada interna con tarjetas de sección
- `/organigrama` — [pages/org](src/app/pages/org) — organigrama y backups por línea
- `/seguimiento` — [pages/seguimiento](src/app/pages/seguimiento) — el tablero principal
- `/conocimiento` — [pages/kb](src/app/pages/kb) — base de conocimiento (PDFs + recorridos)

### Datos

- **Semilla** en [src/app/data/seed.data.ts](src/app/data/seed.data.ts): `DATA` (requerimientos activos), `DETALLE`, `FULL` (histórico 156), `BLOQ` (bloqueantes), `ORG`, `DIRECTORIO`.
- [src/app/data/constants.ts](src/app/data/constants.ts): `GRUPOS`, `GCOL` (colores de fase), `EJEC`, `FASES_POR_GRUPO`, `ORDEN_FASES`, `LIDER_MAP`.
- [src/app/data/qa-transform.ts](src/app/data/qa-transform.ts): **parser del Control Maestro QA (.xlsx)** — replica la lógica del HTML original (normalización de nombres/acentos, grupos de fase, cálculo de avance). Al subir un Excel se reemplazan los datasets en memoria.
- [services/qa-data.service.ts](src/app/services/qa-data.service.ts): estado reactivo (signals) de datos + filtros; `filtered()` aplica los filtros; `loadFile()` reparsea el xlsx subido.
- Modelos en [models/qa.models.ts](src/app/models/qa.models.ts).

### Autenticación y bloqueo por fecha

[services/auth.service.ts](src/app/services/auth.service.ts):
- **Perfiles**: `qa` (correo registrado en `DIRECTORIO`) o `guest` (Invitado, solo lectura gerencial). Sesión en `localStorage` (`qa-session`).
- **`appBloqueada()`**: si la fecha del dispositivo es **≥ 10/07/2026**, la app queda restringida a `/bienvenida` (candado de caducidad, del lado del cliente). El `authGuard` redirige y la bienvenida muestra un aviso.

### Vista de seguimiento (la más compleja)

QA (`auth.isQa()`) ve el tablero completo; Invitado ve una **vista gerencial** reducida. La vista QA incluye: submenú lateral "Secciones" (scroll a sección + resaltado), métricas clicables (`mlist`), filtros, gráficas (consultor×fase, línea de negocio, analista), tabla de capacidad, semáforo de disponibilidad, mapas de calor (4 pestañas, incl. bloqueantes clicables) y subida de Excel. Todo replica la interacción del HTML original.

### Base de conocimiento

4 PDFs en `src/assets/kb/` (nombres **exactos** que espera [data/kb.data.ts](src/app/data/kb.data.ts)) + "recorridos guiados". Apertura/descarga:
- **Web**: `window.open` / `<a download>`.
- **Móvil**: el WebView de Android no muestra PDFs; se usa `@capacitor/filesystem` + `@capacitor-community/file-opener` (copiar a caché/Documentos y abrir con el visor nativo). Ver `viewFile`/`downloadFile` en [kb.page.ts](src/app/pages/kb/kb.page.ts).
- Las fuentes originales están en `src/app/base_conocimiento/` (respaldo, no se empaquetan).

## Marca (ícono y splash)

`brand/` contiene los SVG fuente y `render.cjs` (puppeteer-core + Chrome local) que genera los PNG: `icon.png`, `icon-foreground.png`/`icon-background.png` (ícono adaptativo Android), `splash.png`, `splash-dark.png`. Paleta institucional guinda (`#8e2438`). En CI se generan los recursos nativos con `@capacitor/assets`.

## Despliegue

- **Web (Netlify)**: [netlify.toml](netlify.toml) — `npm run build` → `www`, Node 22, redirect SPA `/* → /index.html 200`. También `public/_redirects` para deploy manual (drag-drop de `www/`).
- **Android (APK)**: GitHub Actions [.github/workflows/android-apk.yml](.github/workflows/android-apk.yml) compila un **APK debug** en cada push a `main`. Pasos: build web → `cap add android` → `@capacitor/assets generate` (ícono/splash desde `brand/`) → `cap sync` → `assembleDebug`. El APK queda en Artifacts.
- Repo: `github.com/raquelmontessan/seguimiento`, rama `main`.

## Convenciones

- Componentes **standalone**; estado con **signals/computed**; plantillas con `@if`/`@for`.
- Estilos: variables CSS en [src/theme/variables.scss](src/theme/variables.scss) y [src/global.scss](src/global.scss) (`--brand`, `--brand-dark`, `--gold`, `--ink*`, etc.). Reusar esos tokens.
- No commitear `www/`, `android/`, `node_modules/` (están en `.gitignore`).
- Verificar cambios de UI en el navegador antes de dar por hecho que funcionan (el proyecto no tiene suite de tests de UI).
