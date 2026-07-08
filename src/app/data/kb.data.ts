/* eslint-disable */
// Documentos de la base de conocimiento y sus recorridos guiados (portados del HTML v27).
import { KbDoc } from '../models/qa.models';

export const KB_DOCS: KbDoc[] = [
  {
    id:'proceso',
    badge:'PDF · Proceso',
    title:'Proceso QA Interno_040326',
    desc:'El proceso de Verificación y Pruebas del Servicio (TI.04.05) de punta a punta: sistemas, fases, roles, insumos y salidas de QA.',
    file:'Proceso QA Interno_040326.pdf',
    steps:[
      {eyebrow:'Objetivo del proceso', h:'Verificación y Pruebas del Servicio · TI.04.05',
        html:'<p>Este proceso pertenece a la <b>Gerencia de Aseguramiento de Calidad y Cambios</b>. Su objetivo es asegurar que la calidad de los desarrollos y soluciones tecnológicas se realice conforme a la estrategia y el plan de pruebas, y que cumplan al 100% con el objetivo del requerimiento para una correcta implementación en producción.</p><div class="tour-callout"><div class="tc-t">Insumo principal → Producto final</div><p>Entra el Diseño Funcional aprobado; sale software verificado y formalizado antes de liberar.</p></div>'},
      {eyebrow:'El ecosistema', h:'Los 4 sistemas del proceso de atención',
        html:'<p>El proceso opera en cascada: cada sistema entrega un insumo al siguiente.</p><ul><li><b>S-MAX</b> — Registro de la petición del usuario. Genera el ID (S-/O-) y el Diseño Funcional.</li><li><b>Fases de Atención</b> — Las fases que recorre el proyecto una vez que tiene DF aprobado.</li><li><b>SISP</b> — Sistema Integral de Seguimiento de Proyectos: alta, asignación y control.</li><li><b>ALM</b> — Administración del Ciclo de Vida: carga de casos, defectos, import/export.</li></ul>'},
      {eyebrow:'S-MAX', h:'Registro de la petición del usuario',
        html:'<p>El usuario hace el pre-registro y registro; la Gerencia de Soluciones de Negocio aplica modelo de valoración, aprobación de enlace, lista priorizada y análisis de negocio.</p><ul><li>Se registra la petición en S-MAX y se genera el <b>Diseño Funcional</b>.</li><li>Se identifica si es <b>solicitud</b> (15 días hábiles) u <b>orden</b> (45 días hábiles).</li><li>El Grupo Técnico solo atiende solicitudes; las órdenes entran desde arquitectura.</li></ul>'},
      {eyebrow:'Las 7 fases', h:'Fases de atención (A – G)',
        html:'<div class="tour-chips"><span class="tour-chip">A · Aprob. Grupo Técnico</span><span class="tour-chip">B · Arquitectura</span><span class="tour-chip">C · Estimación</span><span class="tour-chip">D · Desarrollo</span><span class="tour-chip">E · Pruebas Unitarias</span><span class="tour-chip">F · QA</span><span class="tour-chip">G · UAT</span></div><p>A partir de la aprobación del Grupo Técnico se recorren las fases. Los insumos clave de QA son el <b>DF</b> (fase A), la <b>DTA</b> (fase B) y la <b>DTS</b> (fase D).</p>'},
      {eyebrow:'¿Dónde participa QA?', h:'Inicio del SLA y salidas de QA',
        html:'<p>El SLA de QA inicia en la fase de desarrollo/QA: <b>15 días hábiles</b> para órdenes y <b>45 días hábiles</b> para solicitudes.</p><ul><li><b>Análisis y diseño:</b> Estimación de pruebas, Matriz de Ambigüedades, Matriz de Pruebas QA, Matriz de Trazabilidad, Estrategia y Plan de Pruebas.</li><li><b>Ejecución QA:</b> Ambiente y datos, Informe de Pruebas QA, defectos en ALM.</li><li><b>Ejecución UAT:</b> Informe UAT, Matriz terminada y Carta de Aceptación.</li></ul>'},
      {eyebrow:'SISP', h:'Alta, turno y asignación',
        html:'<ul><li>El <b>Administrador Infonavit</b> da de alta el proyecto en SISP.</li><li>El <b>Líder QA</b> visualiza las solicitudes asignadas y las turna a un tester.</li><li>El <b>Tester</b> visualiza sus solicitudes para atención y seguimiento.</li></ul><p>Aquí se genera la estructura de cada proyecto para integrar el Plan de Pruebas.</p>'},
      {eyebrow:'ALM', h:'Administración del Ciclo de Vida de la Aplicación',
        html:'<p>El tester genera la estructura para registrar el plan de pruebas y carga casos y defectos para su exportación.</p><div class="tour-callout"><div class="tc-t">Regla de validación</div><p>Los casos de prueba deben empatar con la especificación del Diseño Funcional. A partir del DF se identifican ambigüedades y, si es necesario, se hacen sesiones de aclaración para que la carga en ALM sea correcta.</p></div>'}
    ]
  },
  {
    id:'iniciativa',
    badge:'PDF · Iniciativa',
    title:'Iniciativa_QA_Testers_actualizada',
    desc:'El flujo de QA de punta a punta desde la perspectiva del tester: por qué importa tu trabajo, insumos, salidas, colaboración y acuerdos del equipo.',
    file:'Iniciativa_QA_Testers_actualizada.pdf',
    steps:[
      {eyebrow:'Por qué estamos aquí', h:'Entender el proceso completo, no solo tu parte',
        html:'<p>Cuando conoces el flujo de inicio a fin, trabajas con contexto, anticipas problemas y tu trabajo tiene propósito. El objetivo del proceso (TI.04.05) es asegurar la calidad conforme a la estrategia y el plan de pruebas.</p><div class="tour-callout"><div class="tc-t">Somos la última línea antes de producción</div><p>Lo que QA no detecta, lo encuentra el usuario final.</p></div>'},
      {eyebrow:'Importancia', h:'Por qué importa el proceso de QA',
        html:'<ul><li><b>Detecta antes de liberar:</b> encontramos ambigüedades y defectos cuando aún son baratos de corregir.</li><li><b>Protege al usuario y al negocio:</b> cada caso validado evita una falla en producción.</li><li><b>Da formalidad y evidencia:</b> matrices, informes y la Carta de Aceptación dejan constancia de que el servicio cumple.</li></ul>'},
      {eyebrow:'Los roles', h:'Quién hace qué en el procedimiento',
        html:'<ul><li><b>Usuario / Negocio:</b> elabora y prioriza el Diseño Funcional.</li><li><b>Líder QA:</b> valida la documentación y asigna.</li><li><b>Administrador QA:</b> da de alta el proyecto en SISP.</li><li><b>Líder de Pruebas:</b> revisa, valida y asigna al tester.</li><li><b>Analista QA:</b> revisa el DF, registra ambigüedades y diseña la estrategia.</li><li><b>Tester (tú):</b> elabora la matriz, construye el laboratorio en ALM, carga casos y registra defectos.</li></ul>'},
      {eyebrow:'Lo que recibes', h:'Insumos: tu materia prima',
        html:'<ul><li><b>Diseño Funcional (DF)</b> — Fase A, aprobado. Insumo PRINCIPAL: define qué debe hacer la solución.</li><li><b>DTA</b> — Fase B, arquitectura. Base de la Matriz de Ambigüedades.</li><li><b>DTS</b> — Fase D, desarrollo. Marca el arranque formal del SLA de QA.</li><li><b>Insumos opcionales de negocio</b> — Matriz de Trazabilidad y Matriz de Pruebas propuesta.</li></ul>'},
      {eyebrow:'Lo que produces', h:'Salidas: los entregables de QA',
        html:'<ul><li><b>Análisis y Diseño (B–D):</b> Matriz de Ambigüedades, Estimación, Matriz de Pruebas QA, Matriz de Trazabilidad, Estrategia y Plan.</li><li><b>Ejecución QA (F):</b> Ambiente y datos, Informe de Pruebas QA, defectos en ALM, evidencias.</li><li><b>Ejecución UAT (G):</b> Informe UAT, Matriz terminada, Carta de Aceptación.</li></ul>'},
      {eyebrow:'Manos a la obra', h:'Tu trabajo en ALM, en 6 pasos',
        html:'<ul><li><b>1. Estructura en Release</b> — árbol de carpetas por área/solicitud/ciclo.</li><li><b>2. Ciclo UAT en Test Plan</b> — misma estructura.</li><li><b>3. Cargar casos</b> — con el template y el plugin TestMap_2.1.</li><li><b>4. Pasar a Test Lab</b> — conectas, validas y mueves.</li><li><b>5. Ejecutar</b> — marcas Passed o No Run.</li><li><b>6. Exportar e importar</b> — actualizas estatus en SISP y S-MAX.</li></ul>'},
      {eyebrow:'Colaboración', h:'Buenas prácticas de sinergia',
        html:'<ul><li>Comunica con evidencia (pasos, datos y evidencia en ALM).</li><li>Aclara dudas a tiempo con la Matriz de Ambigüedades.</li><li>Una sola fuente de verdad: SISP y ALM.</li><li>Respeta tiempos y handoffs (DF, DTA, DTS) y los SLA.</li><li>Habla un lenguaje común y cierra con acuerdos.</li></ul>'},
      {eyebrow:'Acuerdos del equipo', h:'Evidencia, participación y liderazgo',
        html:'<ul><li><b>Evidencia y seguimiento:</b> deja constancia por correo del acompañamiento.</li><li><b>Participación activa:</b> preséntate, aporta y documenta; no solo observes.</li><li><b>Liderazgo y estatus:</b> conduce las sesiones y comunica el avance al cierre.</li></ul><div class="tour-callout"><div class="tc-t">Conocer el flujo completo</div><p>Te convierte de "ejecutor de casos" en un verdadero responsable de la calidad.</p></div>'}
    ]
  },
  {
    id:'ambiguedades',
    badge:'PDF · Análisis',
    title:'Analisis_Ambiguedades_Institucional',
    desc:'Cómo identificar y gestionar incertidumbres en el Diseño Funcional: qué es una ambigüedad, sus tipos, cómo documentarla y la regla de oro.',
    file:'Analisis_Ambiguedades_Institucional.pdf',
    steps:[
      {eyebrow:'Introducción', h:'Análisis de Ambigüedades en Diseño Funcional',
        html:'<p>Identificar y eliminar interpretaciones múltiples en los requerimientos previene errores en fases posteriores. El QA debe actuar desde etapas tempranas para reducir riesgos y mejorar la calidad del producto.</p><div class="tour-callout"><div class="tc-t">Mentalidad analítica integrada</div><p>El análisis de ambigüedades es un pensamiento cotidiano que mejora la colaboración y la claridad del equipo.</p></div>'},
      {eyebrow:'El desafío', h:'Problemas en los equipos de QA',
        html:'<ul><li><b>Información confusa:</b> los equipos reciben información imprecisa.</li><li><b>Ejecución mecánica:</b> probar sin análisis profundo genera resultados superficiales.</li><li><b>Falta de análisis crítico:</b> impide detectar defectos profundos a tiempo.</li></ul><p>Reflexionar sobre esto fomenta un cambio mental hacia pruebas más analíticas y efectivas.</p>'},
      {eyebrow:'Cómo piensa un QA real', h:'Cuestionar antes que probar',
        html:'<ul><li><b>Mentalidad de cuestionamiento:</b> un QA efectivo comienza cuestionando.</li><li><b>Riesgos de asumir:</b> completar vacíos pone en riesgo la calidad final.</li><li><b>Cultura de preguntas tempranas:</b> promueve mejores soluciones.</li><li><b>QA como aliado del negocio:</b> ayuda a construir soluciones claras.</li></ul>'},
      {eyebrow:'Ejemplo práctico', h:'El caso de "integridad ≥ 99.9%"',
        html:'<p>El requerimiento "integridad de datos ≥ 99.9%" carece de contexto claro para su interpretación y medición. Definir qué es integridad y cómo medirla es crucial para que el requerimiento sea verificable y testeable.</p><div class="tour-callout"><div class="tc-t">Impacto</div><p>La falta de claridad impide diseñar pruebas objetivas y genera distintas interpretaciones entre áreas.</p></div>'},
      {eyebrow:'Descomposición', h:'Cómo descomponer un requerimiento',
        html:'<p>Un requerimiento debe dividirse en <b>datos de entrada, proceso, reglas, resultado y validación</b> para facilitar su análisis.</p><p>Detectar si falta información en cualquiera de estos elementos previene ambigüedades y asegura claridad antes de avanzar. La técnica mejora la comprensión y eleva la calidad de los casos de prueba.</p>'},
      {eyebrow:'Definición', h:'¿Qué es una ambigüedad?',
        html:'<ul><li>Existe cuando hay <b>múltiples interpretaciones</b> en un requerimiento o se necesita adivinar.</li><li>Ocurre si no se puede medir un resultado o diseñar una prueba objetiva.</li><li>Es una <b>condición del requerimiento</b>, no un error del tester, y debe ser atendida.</li></ul>'},
      {eyebrow:'Clasificación', h:'Tipos de ambigüedad',
        html:'<div class="tour-chips"><span class="tour-chip">Semántica</span><span class="tour-chip">De datos</span><span class="tour-chip">De reglas</span><span class="tour-chip">Temporal</span><span class="tour-chip">De validación</span></div><p>Clasificar los hallazgos ayuda a documentar, priorizar riesgos y mejorar la comunicación con negocio y desarrollo, contribuyendo a un proceso de QA más maduro.</p>'},
      {eyebrow:'Documentación', h:'Cómo documentar una ambigüedad',
        html:'<ul><li><b>Campos clave:</b> identificador, descripción, tipo y ubicación.</li><li><b>Estandarización:</b> facilita el seguimiento y la resolución efectiva.</li><li><b>Trazabilidad y transparencia:</b> una documentación clara mejora el control de calidad.</li></ul>'},
      {eyebrow:'Regla de oro', h:'El principio fundamental',
        html:'<div class="tour-callout"><div class="tc-t">Regla de oro del análisis</div><p>Si no puedes demostrar algo con claridad, no está listo para ser probado o aprobado.</p></div><p>Aplicarla evita defectos y retrabajos costosos, y fortalece al QA para exigir claridad como condición para avanzar.</p>'}
    ]
  },
  {
    id:'matriz',
    badge:'PDF · Guía',
    title:'Matriz_de_Casos_Pruebas_QA_Institucional',
    desc:'Guía práctica para construir, ejecutar y dar trazabilidad a los casos de prueba. Procedimiento IT.04.05 · GOP-IT.04.05-004.',
    file:'Matriz_de_Casos_Pruebas_QA_Institucional.pdf',
    steps:[
      {eyebrow:'Punto de partida', h:'¿Qué es y para qué sirve la Matriz de Pruebas?',
        html:'<p>Es el documento donde se diseñan, organizan, ejecutan y registran los casos de prueba de un sistema; es la base para medir y demostrar su calidad antes de salir a producción.</p><ul><li><b>Cobertura completa:</b> toda la funcionalidad y cada requerimiento quedan probados.</li><li><b>Ejecución controlada:</b> pasos, datos y condiciones definidos.</li><li><b>Evidencia verificable:</b> deja registro de qué se probó y qué pasó.</li></ul>'},
      {eyebrow:'Conceptos clave', h:'Escenario, caso de prueba y requerimiento',
        html:'<ul><li><b>Escenario:</b> QUÉ voy a probar (visión general).</li><li><b>Caso de prueba:</b> CÓMO lo voy a probar (pasos, datos, resultado esperado).</li><li><b>Requerimiento funcional (RF):</b> lo que el sistema debe hacer.</li></ul><div class="tour-callout"><div class="tc-t">Regla de oro</div><p>Debe existir al menos 1 caso de prueba por cada requerimiento. Así se asegura una cobertura del 100%.</p></div>'},
      {eyebrow:'El documento', h:'Las pestañas de la plantilla',
        html:'<ul><li><b>Carátula</b> — número, nombre de solicitud e ID de requerimiento.</li><li><b>Tabla de Revisión</b> — historial de versiones.</li><li><b>Matriz de Pruebas</b> — el corazón: aquí se capturan los casos.</li><li><b>Métricas</b> — se calculan solas a partir de la matriz.</li><li><b>Glosario</b> — registro de ambigüedades.</li><li><b>Catálogo</b> — valores permitidos para las listas.</li></ul>'},
      {eyebrow:'El proceso', h:'Construir la matriz en 7 pasos',
        html:'<ul><li><b>1.</b> Preparar información base (encabezado).</li><li><b>2.</b> Derivar casos de cada requerimiento.</li><li><b>3.</b> Definir casos por escenario.</li><li><b>4.</b> Definir la ejecución (pasos, resultados, estatus, prioridad).</li><li><b>5.</b> Asegurar trazabilidad.</li><li><b>6.</b> Validar cobertura.</li><li><b>7.</b> Validar la calidad.</li></ul>'},
      {eyebrow:'Pasos 2 y 3', h:'Definir escenarios y casos',
        html:'<p><b>Escenario:</b> número consecutivo, nombre, descripción y tipo (Principal / Alterno / Negativo / UX).</p><p><b>Caso de prueba:</b> número, nombre y descripción con <b>objetivo</b>, <b>criterio de éxito</b> y <b>criterio de fallo</b>.</p><div class="tour-callout"><div class="tc-t">Regla clave</div><p>1 caso = 1 objetivo de validación principal. Cada caso debe tener un propósito claro y no repetirse.</p></div>'},
      {eyebrow:'Tipo de escenario', h:'Los 4 tipos de flujo',
        html:'<ul><li><b>Flujo principal:</b> el "happy path", todo sale bien.</li><li><b>Flujo alterno:</b> una variación válida para la misma funcionalidad.</li><li><b>Flujo negativo:</b> datos o acciones incorrectas; el sistema debe validar.</li><li><b>Experiencia de usuario (UX):</b> navegación y diseño.</li></ul><p>La guía pide al menos un flujo principal y, cuando hay reglas, un flujo negativo.</p>'},
      {eyebrow:'Paso 4', h:'Definir la ejecución, estatus y prioridad',
        html:'<p><b>Ejecución:</b> tipo (manual/automatizada), precondiciones, pasos numerados, resultado esperado y resultado real.</p><div class="tour-chips"><span class="tour-chip">Exitoso</span><span class="tour-chip">Fallido</span><span class="tour-chip">No ejecutado</span><span class="tour-chip">Bloqueado</span><span class="tour-chip">No aplica</span></div><p><b>Prioridad</b> según criticidad y riesgo: Alta, Media o Baja. Evita poner todos los casos en la misma prioridad.</p>'},
      {eyebrow:'Paso 5', h:'Asegurar la trazabilidad',
        html:'<p>Liga cada caso con el requerimiento que verifica: <b>RF</b>, <b>descripción del RF</b> y <b>aplicativo / módulo</b>.</p><div class="tour-callout"><div class="tc-t">Sin requerimiento, no hay caso</div><p>No pueden existir casos de prueba sin un RF asociado. Al menos un caso por requerimiento garantiza cobertura del 100%.</p></div>'},
      {eyebrow:'Pasos 6 y 7', h:'Validar cobertura y calidad',
        html:'<p><b>Cobertura:</b> tipos de caso presentes, casos negativos sobre las reglas y sin redundancia.</p><p><b>Calidad:</b> técnica (pasos claros, resultados medibles), funcional (cubre comportamiento y errores) y de ejecución (reproducible por cualquiera).</p>'},
      {eyebrow:'Checklist final', h:'Antes de dar por terminada tu matriz',
        html:'<ul><li>Encabezado completo (SMAX, proyecto, responsables, totales).</li><li>Cada requerimiento con al menos un caso de prueba.</li><li>Cada caso con objetivo, criterio de éxito y de fallo.</li><li>Pasos claros, numerados y reproducibles.</li><li>Casos negativos donde hay reglas; estatus y prioridad bien asignados.</li></ul><div class="tour-callout"><div class="tc-t">Recuerda</div><p>Una matriz bien construida = pruebas confiables = calidad demostrable.</p></div>'}
    ]
  }
];
