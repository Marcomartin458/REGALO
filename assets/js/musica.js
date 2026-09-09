/* ==========================================================================
   MUSICA.JS — playlist de a bordo con reproductor global simulado
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('playlist');
  if(!lista || typeof CANCIONES === 'undefined') return;

  const barraTitulo = document.getElementById('reproductor-titulo');
  const barraArtista = document.getElementById('reproductor-artista');
  const barraProgreso = document.getElementById('reproductor-progreso');
  const botonPrev = document.getElementById('reproductor-prev');
  const botonNext = document.getElementById('reproductor-next');
  const botonPlayGlobal = document.getElementById('reproductor-play');

  let indiceActual = 0;
  let sonando = false;
  let intervalo = null;
  const DURACION_SIMULADA = 26; // segundos "de mentira" para la barra de progreso
  let progresoActual = 0;

  function caratulaCSS(cancion){
    return `background: linear-gradient(150deg, ${cancion.color1}, ${cancion.color2});`;
  }

  function render(){
    lista.innerHTML = CANCIONES.map((c, i) => `
      <article class="cancion ${i === indiceActual && sonando ? 'sonando' : ''}" data-reveal data-retardo="${i * 60}" data-indice="${i}">
        <div class="cancion__caratula" style="${caratulaCSS(c)}">
          ${i === indiceActual && sonando
            ? '<div class="ecualizador"><i></i><i></i><i></i></div>'
            : '<span aria-hidden="true">♪</span>'}
        </div>
        <div class="cancion__info">
          <div class="cancion__titulo">${c.titulo}</div>
          <div class="cancion__artista">${c.artista}</div>
          <div class="cancion__nota">${c.nota}</div>
        </div>
        <button class="cancion__play" type="button" aria-label="Reproducir ${c.titulo}" data-indice="${i}">
          ${i === indiceActual && sonando ? iconoPausa() : iconoPlay()}
        </button>
      </article>
    `).join('');

    lista.querySelectorAll('.cancion__play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const i = Number(btn.dataset.indice);
        seleccionar(i, true);
      });
    });

    if(typeof inicializarRevelado === 'function') inicializarRevelado();
  }

  function iconoPlay(){
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  }
  function iconoPausa(){
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
  }

  function seleccionar(indice, abrirEnlace){
    if(indice === indiceActual){
      sonando = !sonando;
    } else {
      indiceActual = indice;
      sonando = true;
      progresoActual = 0;
    }
    actualizarBarraGlobal();
    render();
    gestionarIntervalo();
    if(abrirEnlace && sonando){
      const cancion = CANCIONES[indiceActual];
      if(cancion.enlace) window.open(cancion.enlace, '_blank', 'noopener');
    }
  }

  function actualizarBarraGlobal(){
    const c = CANCIONES[indiceActual];
    if(barraTitulo) barraTitulo.textContent = c.titulo;
    if(barraArtista) barraArtista.textContent = c.artista;
    if(botonPlayGlobal) botonPlayGlobal.innerHTML = sonando ? iconoPausa() : iconoPlay();
  }

  function gestionarIntervalo(){
    clearInterval(intervalo);
    if(!sonando) return;
    intervalo = setInterval(() => {
      progresoActual += 0.5;
      if(progresoActual >= DURACION_SIMULADA){
        seleccionar((indiceActual + 1) % CANCIONES.length, false);
        return;
      }
      if(barraProgreso) barraProgreso.style.width = (progresoActual / DURACION_SIMULADA * 100) + '%';
    }, 500);
  }

  if(botonPlayGlobal) botonPlayGlobal.addEventListener('click', () => seleccionar(indiceActual, false));
  if(botonPrev) botonPrev.addEventListener('click', () => seleccionar((indiceActual - 1 + CANCIONES.length) % CANCIONES.length, false));
  if(botonNext) botonNext.addEventListener('click', () => seleccionar((indiceActual + 1) % CANCIONES.length, false));

  actualizarBarraGlobal();
  render();
});