import { Injectable, computed, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { Registro, FullRow, BloqRow, Org } from '../models/qa.models';
import { DATA, DETALLE, FULL, BLOQ, ORG, LIDER_MAP } from '../data/seed.data';
import { parseWorkbook, validateFormat, EXPECTED_SHEET } from '../data/qa-transform';

export interface FilterState {
  tes: string; ana: string; lob: string; gru: string;
  fase: string; smax: string; int: string; tip: string;
}
const EMPTY_FILTERS: FilterState = { tes: '', ana: '', lob: '', gru: '', fase: '', smax: '', int: '', tip: '' };

@Injectable({ providedIn: 'root' })
export class QaDataService {
  // ---- Estado base ----
  readonly data = signal<Registro[]>(this.seedRegistros());
  readonly full = signal<FullRow[]>(FULL);
  readonly bloq = signal<BloqRow[]>(BLOQ);
  readonly org: Org = ORG;

  readonly filters = signal<FilterState>({ ...EMPTY_FILTERS });
  readonly uploadStatus = signal<string>('Sube el Control Maestro (.xlsx) para actualizar las gráficas.');

  // ---- Derivados ----
  readonly filtered = computed<Registro[]>(() => {
    const f = this.filters();
    return this.data().filter(r =>
      (!f.tes || r.e === f.tes) &&
      (!f.ana || r.a === f.ana) &&
      (!f.lob || r.l === f.lob) &&
      (!f.gru || r.g === f.gru) &&
      (!f.fase || r.f === f.fase) &&
      (!f.smax || (r._d != null && r._d.smax === f.smax)) &&
      (!f.int || (r._d != null && r._d.interna === f.int)) &&
      (!f.tip || r.t === f.tip),
    );
  });

  readonly testers = computed(() => this.uniq('e'));
  readonly analistas = computed(() => this.uniq('a'));
  readonly lineas = computed(() => this.uniq('l'));
  readonly tipos = computed(() => this.uniq('t'));
  readonly smaxVals = computed(() =>
    [...new Set(this.data().map(r => r._d ? r._d.smax : null).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'es')));
  readonly internaVals = computed(() =>
    [...new Set(this.data().map(r => r._d ? r._d.interna : null).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'es')));

  private uniq(k: keyof Registro): string[] {
    return [...new Set(this.data().map(r => r[k] as string))].sort((a, b) => String(a).localeCompare(String(b), 'es'));
  }

  /** Aplica _i / _d / lt a los datos semilla. */
  private seedRegistros(): Registro[] {
    return DATA.map((r, i) => ({
      ...r,
      _i: i,
      _d: DETALLE[i] || null,
      lt: LIDER_MAP[r.e] || 'Sin líder asignado',
    }));
  }

  setFilter(key: keyof FilterState, value: string): void {
    this.filters.update(f => ({ ...f, [key]: value }));
  }
  clearFilters(): void {
    this.filters.set({ ...EMPTY_FILTERS });
  }

  /** Procesa un archivo Excel del Control Maestro y regenera todos los datos. */
  async loadFile(file: File): Promise<{ ok: boolean; msg: string }> {
    if (typeof XLSX === 'undefined') {
      const msg = 'No se pudo cargar el lector de Excel.';
      this.uploadStatus.set(msg);
      return { ok: false, msg };
    }
    this.uploadStatus.set('Procesando ' + file.name + '…');
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      // Validación de formato oficial (Control_Maestro_QA_v3.1)
      if (!wb.SheetNames.includes(EXPECTED_SHEET)) {
        const msg = `⚠ Formato no válido: el archivo no contiene la hoja "${EXPECTED_SHEET}". Usa la plantilla oficial del Control Maestro QA (v3.1).`;
        this.uploadStatus.set(msg);
        return { ok: false, msg };
      }
      const ws = wb.Sheets[EXPECTED_SHEET];
      const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, raw: true, defval: null });
      if (!validateFormat(rows)) {
        const msg = '⚠ Formato no válido: los encabezados no coinciden con el Control Maestro QA oficial (v3.1). Verifica que uses la plantilla oficial sin mover columnas.';
        this.uploadStatus.set(msg);
        return { ok: false, msg };
      }
      const parsed = parseWorkbook(rows);
      if (!parsed.active.length) {
        const msg = 'El archivo tiene el formato correcto pero no contiene filas con estatus "Activo".';
        this.uploadStatus.set(msg);
        return { ok: false, msg };
      }
      this.data.set(parsed.active);
      this.full.set(parsed.full156);
      this.bloq.set(parsed.bloq);
      this.clearFilters();
      const msg = `✓ Actualizado con ${file.name} · ${parsed.active.length} activos · ${parsed.full156.length} histórico`;
      this.uploadStatus.set(msg);
      return { ok: true, msg };
    } catch (err: any) {
      const msg = 'Error al leer el archivo: ' + (err?.message || err);
      this.uploadStatus.set(msg);
      return { ok: false, msg };
    }
  }
}
