'use strict';
/* Contenido de la experiencia. Fuente de verdad: "PROPUESTAS PRESIDENCIA 2027 ALEJANDRO GALEANO M.pdf". */

const VISION = '“Queremos llevar a Partners más allá de lo extraordinario: una comunidad que conecta y lidera, transformando con propósito y visión global”.';

const PILLARS = {
  con: { name: 'Conectando', n: 1, c: '#4e689b', d: '#3b5079', l: '#e9f0f8',
    sub: 'Cercanía, continuidad y conexiones que llegan más allá de EAFIT.' },
  sir: { name: 'Sirviendo', n: 2, c: '#8a6f8a', d: '#6b516b', l: '#f4edf4',
    sub: 'Planeación, organización y comunicación para que el grupo funcione.' },
  cam: { name: 'Cambiando vidas', n: 3, c: '#fd7c5e', d: '#a84d3f', l: '#fff0eb',
    sub: 'Formación, liderazgo y una bienvenida que abre oportunidades.' },
};

const OBJECTIVES = {
  1: { title: 'Una Presidencia cercana', zone: 'Zona de encuentro', icon: 'users',
    text: 'Que cada Partner se sienta escuchado, acompañado y parte de una familia que trasciende fronteras.' },
  2: { title: 'Una organización que funciona', zone: 'Zona de coordinación', icon: 'route',
    text: 'Consolidar procesos organizados, equipos alineados y eventos que reflejen lo mejor de Partners.' },
  3: { title: 'Crecimiento con propósito', zone: 'Zona de crecimiento', icon: 'spark',
    text: 'Lograr que cada persona encuentre en Partners un espacio para crecer, liderar y generar impacto.' },
};

/* main: objetivo al que la propuesta aporta de forma principal; also: aporte complementario.
   Relación construida a partir del objetivo declarado de cada propuesta. */
const PROPOSALS = [
  {
    id: '1.1', pillar: 'con', name: 'Partners Next Chapter',
    tagline: 'Empalme para la continuidad de los macroeventos',
    main: [2], also: [],
    que: 'Un sistema formal y estandarizado para que cada cambio de directores de un macroevento deje por escrito y entregue lo que el grupo ha construido.',
    objetivo: 'Que ningún equipo de evento empiece de cero: que lo valioso se conserve, lo que falló se corrija y cada pendiente pase a manos de alguien con nombre.',
    acciones: [
      { i: 'users', t: 'Reunión de empalme', d: 'Quien sale y quien entra recorren, frente a frente, una hoja por cada cargo.' },
      { i: 'pen', t: 'Notas en vivo', d: 'Una persona llena el archivo y, al cerrar cada cargo, ambos confirman lo escrito.' },
      { i: 'folder', t: 'Entrega y archivo', d: 'El archivo pasa al equipo entrante y se guarda en una carpeta compartida de Partners.' },
    ],
    flow: { title: '¿Qué se transfiere?', items: ['Aprendizajes', 'Contactos', 'Documentos', 'Procesos', 'Pendientes'] },
    nota: 'Para Voluntarios por un Día, La Noche Internacional y demás eventos. No se anotan datos personales ni lo conversado en espacios confidenciales de escucha.',
  },
  {
    id: '1.2', pillar: 'con', name: 'Partners con Presi Presente',
    tagline: 'PPP para el grupo',
    main: [1], also: [2],
    que: 'Una Presidencia presente en la vida cotidiana de Partners, y no solo en reuniones de Junta, eventos o momentos de decisión.',
    objetivo: 'Acercar la Presidencia a los miembros y a los espacios de Partners, fortaleciendo la confianza, la comunicación y el conocimiento directo de lo que ocurre en el grupo.',
    acciones: [
      { i: 'chat', t: 'Presi, ¿Hablamos?', d: 'Cualquier miembro puede acercarse a conversar con el presidente, sin agenda ni protocolo.' },
      { i: 'eye', t: 'Presi Shadow', d: 'El presidente acompaña como observador las reuniones de los comités y equipos.' },
      { i: 'table', t: 'De la experiencia a la Junta', d: 'Qué funciona, qué mejorar y cómo acompañar a cada comité, sin evaluar a sus directores.' },
      { i: 'swap', t: 'Junta Shadow', d: 'También se implementa en los procesos que tienen que ver con el presidente.' },
    ],
  },
  {
    id: '1.3', pillar: 'con', name: 'Partners Global',
    tagline: 'Conectados con la red de Partners of the Americas',
    main: [1, 3], also: [],
    que: 'Fortalecer la conexión de Partners Campus EAFIT con la red internacional de Partners of the Americas: sus capítulos, miembros, oportunidades y espacios.',
    objetivo: 'Generar oportunidades reales de intercambio, colaboración, voluntariado y aprendizaje más allá de EAFIT y Colombia, con un capítulo activo dentro de la red.',
    acciones: [
      { i: 'globe', t: 'Conexión entre capítulos', d: 'Encuentros, intercambio de experiencias y proyectos con capítulos de intereses similares.' },
      { i: 'plane', t: 'Oportunidades internacionales', d: 'Intercambios, grants, encuentros y convocatorias más visibles y accesibles.' },
      { i: 'heart', t: 'Voluntariado más allá de EAFIT', d: 'Participar en proyectos de otros capítulos o de Partners of the Americas.' },
      { i: 'spark', t: 'Un capítulo que también aporta', d: 'Pasar de recibir oportunidades a generarlas y compartirlas con la red.' },
    ],
  },
  {
    id: '2.1', pillar: 'sir', name: 'GEL: Gestores de Estrategia y Logística',
    tagline: 'Equipo permanente de Presidencia',
    main: [2], also: [],
    que: 'Un equipo que parte de la experiencia del Comité de Logística para fortalecer la planeación, la operación y las relaciones del grupo durante todo el año.',
    objetivo: 'Que cada evento y proyecto cuente con anticipación, responsables y procesos claros, y que las relaciones con Partners of the Americas y EAFIT se mantengan en el tiempo.',
    acciones: [
      { i: 'truck', t: 'Operación y logística', d: 'Evento 2.0: un formato de planeación previo a cada evento y aprendizajes al cierre.' },
      { i: 'calendar', t: 'Planeación', d: 'Calendario anual único con la Junta: sin cruces, obligatorio vs. opcional y seguimiento a compromisos.' },
      { i: 'map', t: 'Estrategia y relaciones', d: 'Mapa de capítulos y base de relaciones con historial de contactos, acuerdos y próximos pasos.' },
    ],
    nota: 'La Presidencia mantiene la representación oficial; GEL prepara, organiza y da continuidad, y articula cada relación con el comité encargado.',
  },
  {
    id: '2.2', pillar: 'sir', name: 'Junta Alineada, Equipo Informado',
    tagline: 'Comunicación interna clara y unificada',
    main: [2], also: [1],
    que: 'Una Junta que trabaja bajo los mismos acuerdos y un equipo con información clara, accesible y fácil de consultar.',
    objetivo: 'Que las decisiones, actividades, oportunidades y próximos pasos de Partners se conozcan de manera clara y oportuna.',
    split: [
      { i: 'table', t: 'Junta Alineada', items: [
        'Acuerdo de trabajo y sesión inicial sobre Estatutos, Reglamento Interno y cargos',
        'Formato de Excel por reunión: agenda, responsables, fechas y seguimiento',
        'Acta de cada reunión de Junta y de cada Asamblea',
        'Un espacio en cada Junta para definir qué comunicar al grupo',
      ] },
      { i: 'megaphone', t: 'Equipo Informado', items: [
        'Información comunicada por los canales oficiales de Partners',
        'Primeros 10 minutos de cada Asamblea para proyectos, logros y oportunidades de los miembros',
        'Agente de IA de Partners: un punto de consulta permanente',
      ] },
    ],
  },
  {
    id: '3.1', pillar: 'cam', name: 'Escuela de Liderazgo Partners',
    tagline: 'Formando líderes, fortaleciendo equipos y construyendo el futuro de Partners.',
    main: [3], also: [2],
    que: 'Una iniciativa para fortalecer las competencias de la Junta Directiva y generar nuevas oportunidades de crecimiento para los miembros.',
    objetivo: 'Consolidar una cultura de liderazgo compartido en Partners Campus EAFIT.',
    route: [
      { t: 'Formación a la Junta', d: 'Cada dos meses, con Claudia Londoño: comunicación asertiva, delegación, conflictos, liderazgo con propósito y más.' },
      { t: 'Aprendizaje compartido', d: 'La Junta transmite lo aprendido a los miembros en espacios de formación interna.' },
      { t: 'Roles de liderazgo', d: 'Nuevos roles en Voluntarios por un Día y La Noche Internacional, definidos con la Junta.' },
      { t: 'Preparación anticipada', d: 'Preselección por la Junta y postulación en asamblea general para empezar con tiempo.' },
    ],
    impacto: 'Equipos más preparados, continuidad de los procesos y nuevas generaciones de líderes que asumen mayores responsabilidades.',
  },
  {
    id: '3.2', pillar: 'cam', name: 'On-boarding del nuevo Partner',
    tagline: 'Una incorporación estructurada, cercana e informada',
    main: [3], also: [1],
    que: 'Que cada nuevo miembro comprenda desde el inicio la identidad del capítulo, su funcionamiento, su conexión con Partners of the Americas y sus oportunidades.',
    objetivo: 'Facilitar una experiencia de ingreso organizada y enriquecedora.',
    acciones: [
      { i: 'door', t: 'Inducción inicial', d: 'Primeras dos semanas: historia, pilares, estructura, comités, macroeventos, proyectos e impacto social.' },
      { i: 'screen', t: 'Plataforma de conocimiento', d: 'Estructura, procesos, eventos, canales y oportunidades en un solo lugar de consulta.', link: 'plataforma-partners.netlify.app' },
    ],
    impacto: 'Más sentido de pertenencia y menos incertidumbre: cada nuevo miembro comprende su papel, participa y visualiza sus oportunidades.',
    nota: 'En coordinación con Vicepresidencia y Gestión Humana.',
  },
];

const PROP = Object.fromEntries(PROPOSALS.map(p => [p.id, p]));

/* Recorrido. cam: destino de la cámara; reveal: lo que se "construye" en el mundo al llegar. */
const STEPS = [
  { kind: 'hero', group: 'Visión', label: 'Mi visión', cam: 'all', reveal: ['vision'] },
  { kind: 'objectives', group: 'Objetivos', label: 'Los tres objetivos', cam: 'all' },
  { kind: 'relation', group: 'Objetivos', label: 'Objetivos y pilares', cam: 'all' },
  { kind: 'pillar', group: 'Conectando', p: 'con', label: 'Conectando', cam: 'con', reveal: ['con'] },
  { kind: 'proposal', group: 'Conectando', id: '1.1', cam: '1.1', reveal: ['1.1'] },
  { kind: 'proposal', group: 'Conectando', id: '1.2', cam: '1.2', reveal: ['1.2'] },
  { kind: 'proposal', group: 'Conectando', id: '1.3', cam: '1.3', reveal: ['1.3'] },
  { kind: 'pillar', group: 'Sirviendo', p: 'sir', label: 'Sirviendo', cam: 'sir', reveal: ['sir'] },
  { kind: 'proposal', group: 'Sirviendo', id: '2.1', cam: '2.1', reveal: ['2.1'] },
  { kind: 'proposal', group: 'Sirviendo', id: '2.2', cam: '2.2', reveal: ['2.2'] },
  { kind: 'pillar', group: 'Cambiando vidas', p: 'cam', label: 'Cambiando vidas', cam: 'cam', reveal: ['cam'] },
  { kind: 'proposal', group: 'Cambiando vidas', id: '3.1', cam: '3.1', reveal: ['3.1'] },
  { kind: 'proposal', group: 'Cambiando vidas', id: '3.2', cam: '3.2', reveal: ['3.2'] },
  { kind: 'closing', group: 'Cierre', label: 'Todo conecta', cam: 'all' },
];
STEPS.forEach(s => { if (s.kind === 'proposal') s.label = PROP[s.id].name; });
