/* ==========================================================================
   RAICES-DATOS.JS — EDITABLE
   Contenido de la sección "El cielo compartido".

   CÓMO FUNCIONA
   - Cada foto se coloca en una FRANJA (1 baja / 2 media / 3 alta) y se
     muestra como NUBE (los que están) o como ESTRELLA (los que ya no están).
   - Los campos "nombre", "anio" y "comentario" son OPCIONALES.
   ========================================================================== */

const FOTOS = [
  /* =================== FRANJA 1 — LA MÁS BAJA =================== */
  { id: 'foto-01', src: 'assets/img/familia/fam1.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-02', src: 'assets/img/familia/fam2.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-03', src: 'assets/img/familia/fam3.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-04', src: 'assets/img/familia/fam4.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-05', src: 'assets/img/familia/fam5.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-06', src: 'assets/img/familia/fam6.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-07', src: 'assets/img/familia/fam7.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-08', src: 'assets/img/familia/fam8.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-09', src: 'assets/img/familia/fam9.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-10', src: 'assets/img/familia/fam10.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-11', src: 'assets/img/familia/fam11.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-12', src: 'assets/img/familia/fam12.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-13', src: 'assets/img/familia/fam13.jpg', franja: 1, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-14', src: 'assets/img/familia/fam14.jpg', franja: 1, tipo: 'estrella', nombre: '', anio: '', comentario: '' },

  /* =================== FRANJA 2 — MEDIA =================== */
  { id: 'foto-15', src: 'assets/img/familia/fam15.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-16', src: 'assets/img/familia/fam16.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-17', src: 'assets/img/familia/fam17.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-18', src: 'assets/img/familia/fam18.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-19', src: 'assets/img/familia/fam19.jpg', franja: 2, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-20', src: 'assets/img/familia/fam20.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-21', src: 'assets/img/familia/fam21.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-22', src: 'assets/img/familia/fam22.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-23', src: 'assets/img/familia/fam23.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-24', src: 'assets/img/familia/fam24.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-25', src: 'assets/img/familia/fam25.jpg', franja: 2, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-26', src: 'assets/img/familia/fam26.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-27', src: 'assets/img/familia/fam27.jpg', franja: 2, tipo: 'nube',     nombre: '', anio: '', comentario: '' },

  /* =================== FRANJA 3 — LA MÁS ALTA =================== */
  { id: 'foto-28', src: 'assets/img/familia/fam28.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-29', src: 'assets/img/familia/fam29.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-30', src: 'assets/img/familia/fam30.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-31', src: 'assets/img/familia/fam31.jpg', franja: 3, tipo: 'estrella', nombre: '', anio: '', comentario: '' },
  { id: 'foto-32', src: 'assets/img/familia/fam32.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-33', src: 'assets/img/familia/fam33.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-34', src: 'assets/img/familia/fam34.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-35', src: 'assets/img/familia/fam35.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-36', src: 'assets/img/familia/fam36.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-37', src: 'assets/img/familia/fam37.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-38', src: 'assets/img/familia/fam38.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-39', src: 'assets/img/familia/fam39.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' },
  { id: 'foto-40', src: 'assets/img/familia/fam40.jpg', franja: 3, tipo: 'nube',     nombre: '', anio: '', comentario: '' }
];

/* --------------------------------------------------------------------
   CARTA FINAL — todo editable.
   La firma la dejo vacía a propósito.
   -------------------------------------------------------------------- */
const CARTA_FINAL = {
  encabezado: 'Último registro del Vuelo 23',

  parrafos: [
    'Si estás leyendo esto, es porque has llegado hasta el final. Y queríamos que fuera aquí, en la parte más alta, donde el aire está limpio y no hay ruido, donde te dijéramos todo lo que en persona no sabemos decirte.',

    'Nos has enseñado a querer de una forma que no sabíamos. Nos has hecho reír hasta que nos doliese la mandíbula y nos has hecho llorar solo de verte crecer. Nos has obligado a ser mejores sin pedírnoslo. Y un día, sin darnos cuenta, dejaste de ser la niña que llevábamos de la mano y te convertiste en esta mujer que ahora vuela sola por el mundo. Eso, aunque duela, es la prueba de que algo hicimos bien. Que sepas irte. Que sepas volar. Que sepas, también, volver.',

    'Vuela. Viaja. Disfruta. Persigue cada destino que te llame. Pero acuérdate de una cosa: aquí no hay puertas cerradas. Aquí solo hay una luz encendida por si vuelves de noche, una mesa puesta por si llegas con hambre, y una cama hecha desde el día en que te fuiste. Esta casa no es un sitio al que vienes. Es el sitio del que nunca te vas del todo.',

    'Y si alguna noche, en algún hotel, en alguna escala, te despiertas y sientes que te falta algo, mira al cielo. Porque ahí están los que se fueron. No se fueron del todo: están en cómo sostienes la taza, en cómo te ríes, en cómo dices las cosas cuando estás contenta. Están en ti. Y desde donde estén, también te ven volar. Y si algo te puedo asegurar Marta, es que todos están muy orgullosos de la persona en la que te has convertido. Y todos te acompañan.',

    'Buen vuelo, Marta. Buen viaje, hija. Buen camino, hermana. Buen todo, amiga. Vuelve cuando quieras. Aquí no hace falta que avises. Aquí no te vas a encontrar nunca la puerta cerrada.',

    'Porque... como dije al inicio, si algún día se te olvida quien eres, aquí siempre habrá alguien que te lo recuerde. Y ese alguien, siempre seremos nosotros.',

    'Con todo nuestro amor, siempre.'
  ],

  firma: 'Los que te queremos, desde donde estemos.', 

  boton: 'Volver a la ventanilla'
};