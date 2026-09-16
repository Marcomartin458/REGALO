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
      { src: 'assets/img/amigos/MarcoyMarta3.JPG', pie: 'Los dos' },
      { src: 'assets/img/amigos/MarcoyMarta2.jpg', pie: 'De viaje' },
      { src: 'assets/img/amigos/MarcoyMarta.jpg', pie: 'De viaje' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2026-09-17', texto: 'Hola Tuki, Loli, Marta. Esta seguro que no te la esperabas eh, jajaja. Eres esa persona a la que miro (afortunadamente casi todos los días) y siempre me pregunto: Cómo lo hará para seguir adelante con tanta fuerza? Te admiro porque no conozco a nadie con tu filosofía. Me haces querer ser mejor persona, porque tú quieres serlo todos los días. Me haces aprender a querer y quererme mejor, porque tu forma de querer es preciosa. Desde pequeños te prometí que pasase lo que pasase siempre estaría contigo y, pase lo que pase, seguiré estando aquí. Por toda una vida sonriendo, abrazando, llorando y queriendo a tu lado. Te quiero tuki.' }
    ]
  },
  {
    id: 'adam',
    nombre: 'Adam',
    pais: 'barrio',
    numeroPasaporte: 'D23-VIP-002',
    fechaEmision: '2069-69-69',
    asiento: '01E',
    categoria: 'diplomatico',
    fotos: [
      { src: 'assets/img/amigos/Adam.jpg', pie: 'De toda la vida' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2026-09-17', texto: 'Esa tukiiiii, la chiquilla más guapa y perfecta chocho. Es muy poco tiempo que se me ha hecho infinito contigo. Llegamos a un punto en el que me costaría no verte en mi vida en un futuro así que no tengas novio ni nada de eso que te echaría de menos joder. Te amo mi pequeña.' }
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
      { src: 'assets/img/amigos/InesP1.jpg', pie: 'Primer viaje juntas' },
      { src: 'assets/img/amigos/InesP2.jpg', pie: 'Verano inolvidable' }
    ],
    sellos: [
      { tipo: 'diplomatico', fecha: '2026-09-17', texto: 'Otro año más siendo la una para la otra. Siempre tendrás un lugar para refugiarte y reír como solo lo sabemos hacer nosotras. Feliz cumpleaños ratita. te amo con todo mi corazón, por y para siempre. 💛' }
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
      { src: 'assets/img/amigos/Adriana1.jpg', pie: 'La del barrio' },
      { src: 'assets/img/amigos/Adriana2.jpg', pie: 'Meriendas eternas' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'No se nota ni nada cual es tu perfil bueno eh jajaja' }
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
      { src: 'assets/img/amigos/Iris1.jpg', pie: 'Iris, la del barrio' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Qué suerte haber coincidido contigo, feliz cumpleaños preciosa' }
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
      { src: 'assets/img/amigos/Nerea1.jpg', pie: 'Risas aseguradas' },
      { src: 'assets/img/amigos/Nerea2.jpg', pie: 'Fiesta del barrio' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Cuál es la más oscura de las dos?' }
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
      { src: 'assets/img/amigos/PaulaR1.jpg', pie: 'La peque del grupo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Parecéis un piano jajajjaj' }
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
      { src: 'assets/img/amigos/Bea1.jpg', pie: 'Compañera y amiga' },
      { src: 'assets/img/amigos/Bea2.jpg', pie: 'Vuelos compartidos' },
      { src: 'assets/img/amigos/Bea3.jpg', pie: 'Escala en el paraíso' },
      { src: 'assets/img/amigos/Bea4.jpg', pie: 'Después del turno' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Tu primer beso de 3' }
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
      { src: 'assets/img/amigos/InesB1.jpg', pie: 'Con Inés en cabina' },
      { src: 'assets/img/amigos/InesB2.jpg', pie: 'Turno de noche' },
      { src: 'assets/img/amigos/InesB3.jpg', pie: 'Escala en Roma' },
      { src: 'assets/img/amigos/InesB4.jpg', pie: 'Café antes del vuelo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Pulgas aventureras por el mundo' }
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
      { src: 'assets/img/amigos/Julia1.jpg', pie: 'La jefa de turno' },
      { src: 'assets/img/amigos/Julia2.jpg', pie: 'Destino favorito' },
      { src: 'assets/img/amigos/Julia3.jpg', pie: 'Noche en el hotel' },
      { src: 'assets/img/amigos/Julia4.jpg', pie: 'Ruta Madrid - Nueva York' },
      { src: 'assets/img/amigos/Julia5.jpg', pie: 'Después del último vuelo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Fotógrafa y viajera, aunque vas a acabar sin rodillas por agacharte a hacerte la foto' }
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
      { src: 'assets/img/amigos/Maria1.jpg', pie: 'Compañera de fatigas' },
      { src: 'assets/img/amigos/Maria2.jpg', pie: 'Siempre con una sonrisa' },
      { src: 'assets/img/amigos/Maria3.jpg', pie: 'Layover en Estambul' },
      { src: 'assets/img/amigos/Maria4.jpg', pie: 'Cenita después del vuelo' },
      { src: 'assets/img/amigos/Maria5.jpg', pie: 'Equipo de cabina' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Vaya dos joyitas, en los vuelos dejáis ciego hasta al comandante y borracho a Adam' }
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
      { src: 'assets/img/amigos/Aitana1.jpg', pie: 'Fiesta de la urba' },
      { src: 'assets/img/amigos/Aitana2.jpg', pie: 'Verano eterno' },
      { src: 'assets/img/amigos/Aitana3.jpg', pie: 'Risas garantizadas' },
      { src: 'assets/img/amigos/Aitana4.jpg', pie: 'Nochevieja juntas' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Zipi y Zape si tuviesen la regla. Os falta compartir el cigarro por la ventana. Desde bien pequeñitas siempre juntas.' }
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
      { src: 'assets/img/amigos/Claudia3.jpg', pie: 'Claudia en estado puro' },
      { src: 'assets/img/amigos/Claudia2.jpg', pie: 'Sesión de fotos' },
      { src: 'assets/img/amigos/Claudia1.jpg', pie: 'Plan de domingo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Esta tambien podría ser Zipi, pero tira más a ser de suecia. Prácticamente la has cuidado como si fuera tu hermana y estoy seguro de que ha aprendido mucho' }
    ]
  },
  {
    id: 'miky',
    nombre: 'Miky',
    pais: 'urba',
    numeroPasaporte: 'M23-PDU-003',
    fechaEmision: '2019-01-25',
    asiento: '09C',
    categoria: 'diplomatico',
    fotos: [
      { src: 'assets/img/amigos/Miky1.jpg', pie: 'Miky de fiesta' },
      { src: 'assets/img/amigos/Miky2.jpg', pie: 'Vacaciones en grupo' },
      { src: 'assets/img/amigos/Miky3.jpg', pie: 'Plan espontáneo' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'El Hermano Oso. Padre de la urba y un gran confidente para ti. Por muchas más partidas de cricket juntos.' }
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
      { src: 'assets/img/amigos/Paula1.jpg', pie: 'Risas con Paula' },
      { src: 'assets/img/amigos/Paula2.jpg', pie: 'Atardecer de urba' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'Hasta de chiquitita la sacabas 3 cabezas. Por algo te llaman Klimanjaro' }
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
      { src: 'assets/img/amigos/Vicky1.jpg', pie: 'Vicky y su flow' }
    ],
    sellos: [
      { tipo: 'entrada', fecha: '2026-09-17', texto: 'La niña del pelo rizado. Eres como una hermana para ella.' }
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
      { src: 'assets/img/amigos/Urba.jpg', pie: 'La Urba al completo' },
      { src: 'assets/img/amigos/Urba2.jpg', pie: 'Fiesta de verano' },
      { src: 'assets/img/amigos/Urba3.jpg', pie: 'Merienda en el parque' },
      { src: 'assets/img/amigos/Urba4.jpg', pie: 'Escapada rural' },
      { src: 'assets/img/amigos/Urba5.jpg', pie: 'Nochevieja' },
      { src: 'assets/img/amigos/Urba6.jpg', pie: 'Después de cenar' }
    ],
    fecha: 'Mocosos',
    lugar: 'La Urba',
    personas: ['aitana', 'claudia', 'miky', 'paula-1', 'vicky','Sergio'],
    pie: 'El grupo de siempre, con sus risas, sus bailes, sus peleas y sus dramas. Creo que todos podemos decir que nunca has sido nuestra amiga, eres nuestra hermana. Gracias por estar siempre ahí, por cuidarnos y por hacernos reír. Te queremos ahora y te querremos siempre, como parte de nuestras familias.'
  }
];