// Transformaciones del Control Maestro QA (replica la lógica del HTML v27 / Python original).
import { Registro, FullRow, BloqRow, ParseResult } from '../models/qa.models';
import { NAME_BY_NORM } from './constants';
import { LIDER_MAP } from './seed.data';

/** Normaliza: quita acentos + minúsculas + trim + quita punto final. */
export function norm(s: unknown): string {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim().replace(/\.$/, '');
}

/** Convierte el % de avance: fracción (<=1.5) -> *100; entero -> tal cual. */
export function pct(v: unknown): number {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v <= 1.5 ? Math.round(v * 100) : Math.round(v);
  const n = parseFloat(String(v).replace('%', '').replace(',', '.'));
  if (isNaN(n)) return 0;
  return n <= 1.5 ? Math.round(n * 100) : Math.round(n);
}

/** Abrevia la línea de negocio (solo display). */
export function abreviaLOB(full: string | null | undefined): string {
  if (!full) return 'Sin línea';
  let s = full;
  const reps: [string, string][] = [
    ['Subdirección General de ', 'SG '], ['Subdirección General De ', 'SG '],
    ['Subdirección de ', 'Sub. '], ['Subdirección De ', 'Sub. '], ['Subdirección ', 'Sub. '],
    ['Dirección de ', 'Dir. '],
    ['Coordinación General de ', 'Coord. '], ['Coordinación de ', 'Coord. '],
    ['Secretaría General ', 'Sec. Gral. '],
  ];
  for (const [a, b] of reps) s = s.split(a).join(b);
  return s.trim();
}

/** Nombre canónico del consultor (fusiona variantes de captura). */
export function canonName(raw: unknown): string {
  if (!raw || String(raw).trim() === '') return 'Sin asignar';
  const n = String(raw).trim();
  const key = norm(n);
  if (NAME_BY_NORM[key]) return NAME_BY_NORM[key];
  return n;
}

/** Grupo de fase a partir de la fase real (col I). */
export function grupoFase(fase: unknown): string {
  const f = String(fase || '').trim();
  if (['Pre-Registro', 'Aprobacion Gpo Tecnico', 'Arquitectura', 'Estimación'].includes(f)) return 'Definición';
  if (['Desarrollo', 'Pruebas Unitarias'].includes(f)) return 'Desarrollo/PU';
  if (f === 'QA(UAT)') return 'QA (UAT)';
  if (['QA(Concluido)', 'Cierre de Cambio/Liberado'].includes(f)) return 'Concluido/Cierre';
  return 'Tarea adicional';
}

/** Nombre de hoja obligatorio del formato oficial (Control_Maestro_QA_v3.1). */
export const EXPECTED_SHEET = 'Control Maestro QA';

/** Firma de encabezados (columna 1-based interna -> texto esperado en la fila 2). */
const HEADER_SIG: [number, string][] = [
  [1, 'ID Requerimiento'],
  [2, 'Nombre del Requerimiento'],
  [7, 'Tester Asignado'],
  [8, 'Fase Actual (SMAX/SISP)'],
  [11, 'Estatus General'],
  [16, 'Alerta SLA'],
  [46, '% Avance General QA'],
];

/** Valida que el workbook tenga el formato oficial (hoja + encabezados en la fila 2). */
export function validateFormat(rows: any[][]): boolean {
  if (!rows || rows.length < 3) return false;
  const h = rows[1] || [];
  return HEADER_SIG.every(([i, txt]) => String(h[i] ?? '').trim().toLowerCase() === txt.toLowerCase());
}

/**
 * Parseo principal del workbook. `rows` = matriz (SheetJS header:1),
 * encabezados en índice 1 (fila 2 real), datos desde índice 2.
 */
export function parseWorkbook(rows: any[][]): ParseResult {
  const C = { ID: 1, NOM: 2, TIPO: 3, LOB: 4, ANA: 6, TES: 7, SMAX: 8, ACT: 9, EST: 11, SLA: 16, BLOQ: 17, MOT: 18, DET: 19, U: 20, X: 23, AC: 28, AF: 31, AI: 34, AL: 37, AO: 40, AU: 46 };
  const SUB: [string, number][] = [
    ['Análisis DF', C.U], ['Matriz Ambigüedades', C.X], ['Estimación', C.AC],
    ['Estrategia y Plan Pruebas', C.AF], ['Matriz de CP', C.AI],
    ['Matriz Trazabilidad', C.AL], ['Ejecución de Pruebas', C.AO],
  ];
  const active: Registro[] = [];
  const full156: FullRow[] = [];
  const bloq: BloqRow[] = [];
  let idx = 0;
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r] || [];
    const id = row[C.ID];
    if (id == null || String(id).trim() === '') continue;
    const tipo = String(row[C.TIPO] || '-').trim();
    const lobFull = row[C.LOB];
    const lob = abreviaLOB(lobFull ? String(lobFull).trim() : null);
    let estatus = String(row[C.EST] || '').trim();
    if (estatus === '' || estatus.charAt(0) === '=') {
      const actv = String(row[C.ACT] || '').trim();
      estatus = (actv === '') ? '' : ((actv === 'Cerrado / Liberado' || actv === 'Abandonado') ? 'Inactivo' : 'Activo');
    }
    full156.push({ e: canonName(row[C.TES]), l: lob, t: tipo, st: estatus || 'Sin estatus' });
    if (String(row[C.BLOQ] || '').trim() === 'Sí') {
      bloq.push({ q: String(id).trim(), n: String(row[C.NOM] || '').slice(0, 55), l: lob, motivo: String(row[C.MOT] || 'Sin motivo').trim(), det: String(row[C.DET] || '').trim(), est: estatus });
    }
    if (estatus !== 'Activo') continue;
    let av = pct(row[C.AU]);
    const subs: [string, number][] = SUB.map(([lab, ci]) => [lab, pct(row[ci])] as [string, number]);
    if (!av) { const vals = subs.map(s => s[1]).filter(x => x > 0); av = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0; }
    const fase = String(row[C.SMAX] || '').trim() || 'Tarea adicional';
    const rec: Registro = {
      q: String(id).trim(), n: String(row[C.NOM] || '').slice(0, 52).trim(), t: tipo, l: lob,
      a: canonName(row[C.ANA]), e: canonName(row[C.TES]),
      f: (fase === 'NA' ? 'Tarea adicional' : fase), g: grupoFase(fase),
      ac: String(row[C.ACT] || '-').trim(), av,
      s: String(row[C.SLA] || 'NA').trim() || 'NA', _i: idx,
      _d: { smax: String(row[C.SMAX] || 'Sin fase SMAX').trim(), interna: String(row[C.ACT] || 'Sin actividad').trim(), subs },
    };
    rec.lt = LIDER_MAP[rec.e] || 'Sin líder asignado';
    active.push(rec);
    idx++;
  }
  return { active, full156, bloq };
}
