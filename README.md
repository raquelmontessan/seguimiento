# Tablero de Carga QA — INFONAVIT (Ionic + Angular)

Aplicación **Ionic 8 / Angular 20 (standalone)** responsiva (web y móvil) que porta el
tablero HTML `Tablero_Carga_QA_v27` a un sistema con menú, control de acceso por perfil,
carga del Control Maestro (Excel) y todas las vistas del tablero original.

## Requisitos
- Node.js 20+ (probado en Node 24)

## Ejecutar
```bash
npm install
npm start           # ng serve → http://localhost:4200  (o: npx ionic serve)
```

## Compilar para web
```bash
npm run build       # genera www/
```

## App móvil (Capacitor, opcional)
```bash
npm run build
npx cap add android    # y/o: npx cap add ios
npx cap sync
npx cap open android
```

## Acceso por perfil
- **Equipo QA** — requiere un correo del directorio (ej. `gustavo.meza@b-process.mx`).
  Acceso completo al panel operativo.
- **Invitado** — vista gerencial de solo lectura.

## Carga del Control Maestro
En *Seguimiento de avance* → **Subir Control Maestro (.xlsx)**.
- Solo se acepta el **formato oficial** `Control_Maestro_QA_v3.1` (hoja `Control Maestro QA`
  con los encabezados en la fila 2). Cualquier otro archivo se rechaza con un aviso de
  *"Formato no válido"*.
- Al cargar, se recalculan métricas, gráficas, semáforo, mapas de calor y detalle.
- Si no se sube nada, la app arranca con los datos semilla incrustados.

## Documentos de la base de conocimiento
Coloca los PDF en `src/assets/kb/` con el nombre exacto (ver `src/assets/kb/LEEME.txt`).
El *recorrido guiado* funciona sin los archivos.

## Estructura
```
src/app/
  data/         seed.data.ts (datos), kb.data.ts, constants.ts, qa-transform.ts (parser + validación)
  models/       qa.models.ts (interfaces de dominio)
  services/     qa-data.service.ts (señales + filtros + Excel), auth.service.ts (perfil/login)
  guards/       auth.guard.ts (protege las vistas internas)
  shared/       chart.component.ts (envoltorio Chart.js)
  pages/        welcome, home, org, seguimiento (QA + gerencial), kb
```

Estado con **signals** de Angular; todas las vistas derivan del arreglo filtrado central.
Gráficas con **Chart.js** (dependencia local, sin CDN). Excel con **SheetJS (xlsx)**.
