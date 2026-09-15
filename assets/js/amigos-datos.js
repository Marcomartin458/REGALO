/* ==========================================================================
   AMIGOS-DATOS.JS — EDITABLE
   Aquí van TODOS los datos: países emisores, amigos (con sus fotos y
   sellos) y fotos grupales. No hace falta tocar amigos.js para añadir
   contenido — solo rellena o amplía estos arrays/objetos.

   GUÍA RÁPIDA
   - Para añadir un amigo nuevo: copia un bloque de AMIGOS y cambia sus
     datos. El "id" tiene que ser único (se usa para enlazarlo desde las
     fotos grupales).
   - Para una foto grupal: añade un bloque a GRUPOS_FOTO. Ahora "fotos" es
     un array (para poder tener varias fotos en un mismo visado).
   - "categoria": "normal" (tapa color según país) | "diplomatico"
     (tapa negra y dorada) | "capitanes" (tapa morada con holograma).
   ========================================================================== */

/* --------------------------------------------------------------------
   PAÍSES EMISORES (grupos de amigos)
   -------------------------------------------------------------------- */
const PAISES = {
  barrio:  { nombre: 'República del Barrio', codigo: 'RDB', color: 'rojo'  },
  trabajo: { nombre: 'Estado del Trabajo',    codigo: 'EDT', color: 'azul'  },
  urba:    { nombre: 'Principado de la Urba', codigo: 'PDU', color: 'verde' }
};

/* --------------------------------------------------------------------
   AMIGOS — un pasaporte por persona o grupo.
   -------------------------------------------------------------------- */
const AMIGOS = [

  /* ============ LOS CAPITANES · EL TRÍO LALALA ============ */
  {
    id: 'trio-lalala',
    nombre: 'Los Capitanes · El Trío Lalala',
    pais: 'barrio',
    numeroPasaporte: 'CAP-23-001',
    fechaEmision: 'Con alguno desde siempre y con los dos para siempre',
    asiento: '01A · 01B · 01C',
    categoria: 'capitanes',
    fotos: [
      { src: 'assets/img/amigos/triolalala.jpg', pie: 'Los tres, siempre' },
      { src: 'assets/img/amigos/triolalala2.jpg', pie: 'La primera aventura' },
      { src: 'assets/img/amigos/triolalala3.jpg', pie: 'Capitaneando la vida' }
    ],
    sellos: [
      {
        tipo: 'capitanes',
        fecha: 'Con alguno desde siempre y con los dos para siempre',
        texto: 'Creo que no es necesario que te digamos lo que significas para nosotros. Eres nuestra mejor amiga, a veces nuestra salvadora y otras la culpable de que nuestras madres nos digan "qué horas de llegar son estas??" Pero nunca cambiaríamos ni un segundo de lo que hemos vivido juntos. Somos un equipo, para siempre. Te queremos con todo nuestro corazón, y aunque no podamos estar siempre a tu lado, siempre estaremos contigo. Gracias por ser nuestra amiga y por hacernos mejores personas. Te queremos mucho, mucho, mucho. Con todo nuestro amor, tus capitanes.'
      }
    ]
  },

  /* ============ PERSONAL DIPLOMÁTICO ============ */
  {
    id: 'marco',
    nombre: 'Marco',
    pais: 'urba',
    numeroPasaporte: 'D23-VIP-001',
    fechaEmision: 'Desde chiquititos',
    asiento: '01D',
    categoria: 'diplomatico',
    fotos: [
      { src: 'assets/img/amigos/MarcoyMarta3.jpg', pie: 'Los dos' },
      { src: 'assets/img/amigos/MarcoyMarta2.jpg', pie: 'De viaje' },
      { src: 'assets/img/amigos/MarcoyMarta.jpg', pie: 'De viaje' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2024-01-01', texto: 'Hola Tuki, Loli, Marta. Esta seguro que no te la esperabas eh, jajaja. Eres esa persona a la que miro (afortunadamente casi todos los días) y siempre me pregunto: Cómo lo hará para seguir adelante con tanta fuerza? Te admiro porque no conozco a nadie con tu filosofía. Me haces querer ser mejor persona, porque tú quieres serlo todos los días. Me haces aprender a querer y quererme mejor, porque tu forma de querer es preciosa. Desde pequeños te prometí que pasase lo que pasase siempre estaría contigo y, pase lo que pase, seguiré estando aquí. Por toda una vida sonriendo, abrazando, llorando y queriendo a tu lado. Te quiero tuki.' }
    ]
  },
  {
    id: 'adam',
    nombre: 'Adam',
    pais: 'barrio',
    numeroPasaporte: 'D23-VIP-002',
    fechaEmision: '2010-01-01',
    asiento: '01E',
    categoria: 'diplomatico',
    fotos: [
      { src: 'assets/img/amigos/adam-01.jpg', pie: 'De toda la vida' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2024-01-01', texto: 'Mensaje EDITABLE de Adam para Marta.' }
    ]
  },
  {
    id: 'ines-2',
    nombre: 'Inés',
    pais: 'barrio',
    numeroPasaporte: 'D23-VIP-003',
    fechaEmision: '2015-06-01',
    asiento: '01F',
    categoria: 'diplomatico',
    fotos: [
      { src: 'assets/img/amigos/ines2-01.jpg', pie: 'Primer viaje juntas' },
      { src: 'assets/img/amigos/ines2-02.jpg', pie: 'Verano inolvidable' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2024-05-01', texto: 'Mensaje EDITABLE de Inés para Marta.' }
    ]
  },

  /* ============ PASAJEROS (pasaportes normales) ============ */

  /* --- BARRIO --- */
  {
    id: 'adriana',
    nombre: 'Adriana',
    pais: 'barrio',
    numeroPasaporte: 'M23-RDB-002',
    fechaEmision: '2016-04-12',
    asiento: '23B',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/adriana-01.jpg', pie: 'La del barrio' },
      { src: 'assets/img/amigos/adriana-02.jpg', pie: 'Meriendas eternas' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-03-15', texto: 'Mensaje EDITABLE de Adriana.' }
    ]
  },
  {
    id: 'iris',
    nombre: 'Iris',
    pais: 'barrio',
    numeroPasaporte: 'M23-RDB-003',
    fechaEmision: '2017-08-20',
    asiento: '23C',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/iris-01.jpg', pie: 'Iris, la del barrio' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2023-09-01', texto: 'Mensaje EDITABLE de Iris.' }
    ]
  },
  {
    id: 'nerea',
    nombre: 'Nerea',
    pais: 'barrio',
    numeroPasaporte: 'M23-RDB-004',
    fechaEmision: '2018-02-10',
    asiento: '23D',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/nerea-01.jpg', pie: 'Risas aseguradas' },
      { src: 'assets/img/amigos/nerea-02.jpg', pie: 'Fiesta del barrio' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-04-10', texto: 'Mensaje EDITABLE de Nerea.' }
    ]
  },
  {
    id: 'paula-2',
    nombre: 'Paula',
    pais: 'barrio',
    numeroPasaporte: 'M23-RDB-005',
    fechaEmision: '2019-07-03',
    asiento: '23E',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/paula2-01.jpg', pie: 'La peque del grupo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-07-03', texto: 'Mensaje EDITABLE de Paula.' }
    ]
  },

  /* --- TRABAJO --- */
  {
    id: 'bea',
    nombre: 'Bea',
    pais: 'trabajo',
    numeroPasaporte: 'M23-EDT-001',
    fechaEmision: '2020-09-02',
    asiento: '14A',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/bea-01.jpg', pie: 'Compañera y amiga' },
      { src: 'assets/img/amigos/bea-02.jpg', pie: 'Vuelos compartidos' },
      { src: 'assets/img/amigos/bea-03.jpg', pie: 'Escala en el paraíso' },
      { src: 'assets/img/amigos/bea-04.jpg', pie: 'Después del turno' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-01-20', texto: 'Mensaje EDITABLE de Bea.' }
    ]
  },
  {
    id: 'ines-1',
    nombre: 'Inés',
    pais: 'trabajo',
    numeroPasaporte: 'M23-EDT-002',
    fechaEmision: '2021-02-15',
    asiento: '14B',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/ines1-01.jpg', pie: 'Con Inés en cabina' },
      { src: 'assets/img/amigos/ines1-02.jpg', pie: 'Turno de noche' },
      { src: 'assets/img/amigos/ines1-03.jpg', pie: 'Escala en Roma' },
      { src: 'assets/img/amigos/ines1-04.jpg', pie: 'Café antes del vuelo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-02-15', texto: 'Mensaje EDITABLE de Inés.' }
    ]
  },
  {
    id: 'julia',
    nombre: 'Julia',
    pais: 'trabajo',
    numeroPasaporte: 'M23-EDT-003',
    fechaEmision: '2019-05-22',
    asiento: '14C',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/julia-01.jpg', pie: 'La jefa de turno' },
      { src: 'assets/img/amigos/julia-02.jpg', pie: 'Destino favorito' },
      { src: 'assets/img/amigos/julia-03.jpg', pie: 'Noche en el hotel' },
      { src: 'assets/img/amigos/julia-04.jpg', pie: 'Ruta Madrid - Nueva York' },
      { src: 'assets/img/amigos/julia-05.jpg', pie: 'Después del último vuelo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-05-22', texto: 'Mensaje EDITABLE de Julia.' }
    ]
  },
  {
    id: 'maria',
    nombre: 'María',
    pais: 'trabajo',
    numeroPasaporte: 'M23-EDT-004',
    fechaEmision: '2018-11-30',
    asiento: '14D',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/maria-01.jpg', pie: 'Compañera de fatigas' },
      { src: 'assets/img/amigos/maria-02.jpg', pie: 'Siempre con una sonrisa' },
      { src: 'assets/img/amigos/maria-03.jpg', pie: 'Layover en Estambul' },
      { src: 'assets/img/amigos/maria-04.jpg', pie: 'Cenita después del vuelo' },
      { src: 'assets/img/amigos/maria-05.jpg', pie: 'Equipo de cabina' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-11-30', texto: 'Mensaje EDITABLE de María.' }
    ]
  },

  /* --- URBA --- */
  {
    id: 'aitana',
    nombre: 'Aitana',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-001',
    fechaEmision: '2018-06-15',
    asiento: '09A',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/aitana-01.jpg', pie: 'Fiesta de la urba' },
      { src: 'assets/img/amigos/aitana-02.jpg', pie: 'Verano eterno' },
      { src: 'assets/img/amigos/aitana-03.jpg', pie: 'Risas garantizadas' },
      { src: 'assets/img/amigos/aitana-04.jpg', pie: 'Nochevieja juntas' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2023-06-15', texto: 'Mensaje EDITABLE de Aitana.' }
    ]
  },
  {
    id: 'claudia',
    nombre: 'Claudia',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-002',
    fechaEmision: '2017-03-08',
    asiento: '09B',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/claudia-01.jpg', pie: 'Claudia en estado puro' },
      { src: 'assets/img/amigos/claudia-02.jpg', pie: 'Sesión de fotos' },
      { src: 'assets/img/amigos/claudia-03.jpg', pie: 'Plan de domingo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2023-03-08', texto: 'Mensaje EDITABLE de Claudia.' }
    ]
  },
  {
    id: 'miky',
    nombre: 'Miky',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-003',
    fechaEmision: '2019-01-25',
    asiento: '09C',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/miky-01.jpg', pie: 'Miky de fiesta' },
      { src: 'assets/img/amigos/miky-02.jpg', pie: 'Vacaciones en grupo' },
      { src: 'assets/img/amigos/miky-03.jpg', pie: 'Plan espontáneo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-01-25', texto: 'Mensaje EDITABLE de Miky.' }
    ]
  },
  {
    id: 'paula-1',
    nombre: 'Paula',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-004',
    fechaEmision: '2020-04-12',
    asiento: '09D',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/paula1-01.jpg', pie: 'Risas con Paula' },
      { src: 'assets/img/amigos/paula1-02.jpg', pie: 'Atardecer de urba' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2024-04-12', texto: 'Mensaje EDITABLE de Paula.' }
    ]
  },
  {
    id: 'vicky',
    nombre: 'Vicky',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-005',
    fechaEmision: '2018-09-18',
    asiento: '09E',
    categoria: 'normal',
    fotos: [
      { src: 'assets/img/amigos/vicky-01.jpg', pie: 'Vicky y su flow' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2023-09-18', texto: 'Mensaje EDITABLE de Vicky.' }
    ]
  }

];

/* --------------------------------------------------------------------
   VISADOS COLECTIVOS — fotos grupales. "fotos" es un ARRAY para poder
   tener varias fotos dentro del mismo visado (con carrusel en el modal).
   -------------------------------------------------------------------- */
const GRUPOS_FOTO = [
  {
    id: 'urba-grupal',
    fotos: [
      { src: 'assets/img/amigos/grupal-urba-01.jpg', pie: 'La Urba al completo' },
      { src: 'assets/img/amigos/grupal-urba-02.jpg', pie: 'Fiesta de verano' },
      { src: 'assets/img/amigos/grupal-urba-03.jpg', pie: 'Merienda en el parque' },
      { src: 'assets/img/amigos/grupal-urba-04.jpg', pie: 'Escapada rural' },
      { src: 'assets/img/amigos/grupal-urba-05.jpg', pie: 'Nochevieja' },
      { src: 'assets/img/amigos/grupal-urba-06.jpg', pie: 'Después de cenar' }
    ],
    fecha: 'Verano 2023',
    lugar: 'La Urba',
    personas: ['aitana', 'claudia', 'miky', 'paula-1', 'vicky'],
    pie: 'El grupo de siempre, la Urba entera en una foto. (EDITABLE)'
  }
];