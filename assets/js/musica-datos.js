/* ==========================================================================
   MUSICA-DATOS.JS — EDITABLE
   Ya NO hace falta añadir cada canción a mano, ni configurar nada aquí
   en el caso normal. Sube el archivo de audio (.mp3, .m4a, .wav u .ogg)
   a la carpeta assets/audio/ y súbelo a GitHub: la próxima vez que se
   cargue la página en GitHub Pages, el reproductor detecta solo el
   usuario y el repositorio a partir de la URL, lista esa carpeta y crea
   una tarjeta por cada canción (título, artista, color y duración
   incluidos).

   NOMBRA LOS ARCHIVOS ASÍ para que el título y el artista salgan bien:
     "Artista - Título.mp3"
   Si no sigues ese formato, se usará el nombre del archivo como título.
   -------------------------------------------------------------------- */

/* --------------------------------------------------------------------
   REPO_GITHUB — NORMALMENTE NO HACE FALTA TOCAR ESTO.
   Cuando la web se sirve desde GitHub Pages, musica.js detecta solo el
   usuario y el repositorio mirando la URL de la página. Este bloque
   solo se usa como respaldo si esa detección falla — por ejemplo si
   estás probando la web en tu ordenador (file:// o localhost) en vez
   de en github.io, o si usas un dominio propio en vez del de GitHub.
   -------------------------------------------------------------------- */
const REPO_GITHUB = {
  usuario: '',                          // EDITABLE — solo si necesitas el respaldo
  repositorio: '',                      // EDITABLE — solo si necesitas el respaldo
  rama: 'main',                         // EDITABLE — la rama que publica GitHub Pages
  carpeta: 'assets/audio'               // EDITABLE — dónde subes los archivos de audio
};

/* --------------------------------------------------------------------
   NOTAS — opcional. Si quieres que alguna canción lleve una frase tipo
   "esta canción me recuerda a...", añádela aquí usando el NOMBRE EXACTO
   del archivo como clave. Las que no tengan nota simplemente no la
   muestran, sin que tengas que tocar nada más.
   -------------------------------------------------------------------- */
const NOTAS = {
  // 'Artista - Título.mp3': 'Esta canción me recuerda a... (EDITABLE)'
};

/* --------------------------------------------------------------------
   CANCIONES_EXTRA — opcional. Para canciones que NO tienes como archivo
   (por ejemplo, algo que solo existe en Spotify) puedes añadirlas aquí
   a mano y aparecerán igualmente en la lista, con un botón "Enlace" en
   vez de reproducirse directamente.
   -------------------------------------------------------------------- */
const CANCIONES_EXTRA = [
  // {
  //   titulo: 'Título de la canción',
  //   artista: 'Artista',
  //   nota: 'EDITABLE',
  //   enlaceExterno: 'https://open.spotify.com/...'
  // }
];