// Modelos de dominio del Tablero de Carga QA (INFONAVIT).

/** Un requerimiento activo (una fila con estatus "Activo" del Control Maestro). */
export interface Registro {
  q: string;          // ID requerimiento
  n: string;          // nombre (recortado)
  t: string;          // tipo (Solicitud/Orden/Incidente/Tarea Adicional/Evento)
  l: string;          // línea de negocio (abreviada)
  a: string;          // analista QA
  e: string;          // tester / consultor (normalizado)
  f: string;          // fase real (col I)
  g: string;          // grupo de fase
  ac: string;         // actividad (col J)
  av: number;         // % avance general
  s: string;          // alerta SLA: Vencido | A Tiempo | NA
  _i?: number;        // índice secuencial
  _d?: DetalleRow | null;   // detalle extendido
  lt?: string;        // líder técnico asignado
}

/** Detalle extendido por requerimiento (fase SMAX, interna y subfases). */
export interface DetalleRow {
  smax: string;
  interna: string;
  subs: [string, number][];
}

/** Fila del histórico completo (156) para los mapas de calor. */
export interface FullRow {
  e: string;
  l: string;
  t: string;
  st: string;
}

/** Requerimiento marcado como bloqueante (stopper). */
export interface BloqRow {
  q: string;
  n: string;
  l: string;
  motivo: string;
  det: string;
  est: string;
}

export interface OrgPerson { n: string; p: string; }
export interface OrgRama {
  respaldo: OrgPerson;
  lider: OrgPerson;
  analista: OrgPerson | null;
  cls: string;
  testers: OrgPerson[];
}
export interface OrgMapaRow { l: string; t: string; p: string; b: string; }
export interface OrgCelula {
  nombre: string;
  respaldo: string;
  analista: string;
  backupLider: string;
  lineas: number;
  perfiles: string;
  cls: string;
  mapa: OrgMapaRow[];
}
export interface Org {
  lider: OrgPerson;
  servicio: { nombre: string; miembros: OrgPerson[] };
  ramas: OrgRama[];
  celulas: OrgCelula[];
}

/** Documento de la base de conocimiento con su recorrido guiado. */
export interface KbStep { eyebrow: string; h: string; html: string; }
export interface KbDoc {
  id: string;
  badge: string;
  title: string;
  desc: string;
  file: string;
  steps: KbStep[];
}

/** Resultado del parseo del Control Maestro. */
export interface ParseResult {
  active: Registro[];
  full156: FullRow[];
  bloq: BloqRow[];
}

export type ProfileType = 'qa' | 'guest';
export interface SessionUser { n: string; e: string; }
