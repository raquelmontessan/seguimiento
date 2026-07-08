// Constantes de agrupación de fases y colores (portadas del HTML v27).

export const GRUPOS: string[] = ['Definición', 'Desarrollo/PU', 'QA (UAT)', 'Tarea adicional', 'Concluido/Cierre'];

export const GCOL: Record<string, string> = {
  'Definición': '#8e2438',
  'Desarrollo/PU': '#1f7a5a',
  'QA (UAT)': '#b3843a',
  'Tarea adicional': '#c3c2b7',
  'Concluido/Cierre': '#9a8f8a',
};

/** Fases "en ejecución" (todo lo que NO es Concluido/Cierre). */
export const EJEC = new Set<string>(['Definición', 'Desarrollo/PU', 'QA (UAT)', 'Tarea adicional']);

export const FASES_POR_GRUPO: Record<string, string[]> = {
  'Definición': ['Pre-Registro', 'Aprobacion Gpo Tecnico', 'Arquitectura', 'Estimación'],
  'Desarrollo/PU': ['Desarrollo', 'Pruebas Unitarias'],
  'QA (UAT)': ['QA(UAT)'],
  'Tarea adicional': ['Tarea adicional'],
  'Concluido/Cierre': ['QA(Concluido)', 'Cierre de Cambio/Liberado'],
};

/** Orden lógico de fases para encabezados de listas. */
export const ORDEN_FASES: string[] = [
  'Pre-Registro', 'Aprobacion Gpo Tecnico', 'Arquitectura', 'Estimación',
  'Desarrollo', 'Pruebas Unitarias', 'QA(UAT)', 'Tarea adicional',
  'QA(Concluido)', 'Cierre de Cambio/Liberado',
];

/** Mapeo por forma normalizada -> nombre canónico (cubre variantes de captura). */
export const NAME_BY_NORM: Record<string, string> = {
  'joel ruiz': 'Joel Ruiz Rosas',
  'janet martinez': 'Janeth Martínez Núñez',
  'laura mejia': 'Laura Mejia Chavarria',
  'diana lazaro': 'Diana Laura Lázaro Audelo',
  'leivi guitierrez': 'Leivi Dominga Gutiérrez Conrado',
  'leivi gutierrez': 'Leivi Dominga Gutiérrez Conrado',
  'josue almazan': 'Josue Omar Almazán López',
  'anabel padilla': 'Anabel Leonor Padilla Franco',
  'gerardo sandoval': 'Gerardo Sandoval Hernández',
  'guadalupe ramirez': 'Guadalupe del Socorro Ramírez Pinto',
  'lonny chavez': 'Lonny Daniel Chávez Cruz',
  'jesus martinez': 'Jesús Emmanuel Martínez Angeles',
  'gustavo meza': 'Gustavo Arturo Meza Velázquez',
  'miguel huerta': 'Miguel Ángel Huerta Santiago',
  'angel hernandez': 'Ángel Hernández Ramírez',
  'elizabeth garcia': 'Elizabeth García Ortiz',
  'miguel perez': 'Miguel Ángel Pérez Rodríguez',
  'karen falcon': 'Karen Lizbeth López Falcón',
  'karen lizbeth lopez': 'Karen Lizbeth López Falcón',
  'karen lizbeth lopez falcon': 'Karen Lizbeth López Falcón',
};
