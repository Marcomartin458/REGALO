/* ==========================================================================
   MUSICA.JS — Reproductor de la mixtape con tema dinámico
   - Cada canción tiene su propio color y TODO el tema cambia con ella.
   - Ya NO se genera el span de hover-play (se eliminó el crossfade).
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const listaEl = document.getElementById('musica-lista');
  const audio = document.getElementById('audio-elemento');
  if(!listaEl || !audio) return;

  const estadoCarga = document.getElementById('musica-estado');
  const heroCover = document.getElementById('hero-cover');
  const heroTitulo = document.getElementById('hero-titulo');
  const heroArtista = document.getElementById('hero-artista');
  const heroNota = document.getElementById('hero-nota');
  const heroPlay = document.getElementById('hero-play');
  const lienzoViz = document.getElementById('visualizador');

  const barraTitulo = document.getElementById('barra-titulo');
  const barraArtista = document.getElementById('barra-artista');
  const barraMini = document.getElementById('barra-mini');
  const barraPlay = document.getElementById('barra-play');
  const barraPrev = document.getElementById('barra-prev');
  const barraNext = document.getElementById('barra-next');
  const barraAleatorio = document.getElementById('barra-aleatorio');
  const barraRepetir = document.getElementById('barra-repetir');
  const barraProgreso = document.getElementById('barra-progreso');
  const barraProgresoRelleno = document.getElementById('barra-progreso-relleno');
  const tiempoActualEl = document.getElementById('tiempo-actual');
  const tiempoTotalEl = document.getElementById('tiempo-total');
  const barraVolumen = document.getElementById('barra-volumen');
  const barraAviso = document.getElementById('barra-aviso');
  const buscadorInput = document.getElementById('musica-buscador-input');
  const sidebarAleatorio = document.getElementById('sidebar-aleatorio');
  const statTotal = document.getElementById('stat-total');

  let CANCIONES = [];
  const estado = { indiceActual: 0, sonando: false, aleatorio: false, repetir: 'apagado', cola: [], filtro: '' };

  /* ---------------------------------------------------------------
     COLOR ÚNICO POR CANCIÓN
     --------------------------------------------------------------- */
  function hashTexto(texto){
    let h = 0;
    for(let i = 0; i < texto.length; i++){ h = (h * 31 + texto.charCodeAt(i)) >>> 0; }
    return h;
  }
  function hslAHex(h, s, l){
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const rgb = [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0'));
    return `#${rgb.join('')}`;
  }
  function colorDesde(clave){
    const h = hashTexto(clave);
    const tono = h % 360;
    return {
      de: hslAHex(tono, 78, 58),
      a: hslAHex((tono + 46) % 360, 70, 30)
    };
  }

  function hexARgba(hex, alpha){
    const limpio = hex.replace('#', '');
    const bigint = parseInt(limpio.length === 3
      ? limpio.split('').map(c => c + c).join('')
      : limpio, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ---------------------------------------------------------------
     DESCUBRIMIENTO AUTOMÁTICO VÍA LA API DE GITHUB
     --------------------------------------------------------------- */
  const EXTENSIONES_AUDIO = ['.mp3', '.m4a', '.wav', '.ogg'];

  function parsearNombre(nombreArchivo){
    const sinExtension = nombreArchivo.replace(/\.[^.]+$/, '');
    const partes = sinExtension.split(' - ');
    if(partes.length >= 2){
      return { artista: partes[0].trim(), titulo: partes.slice(1).join(' - ').trim() };
    }
    return { artista: '', titulo: sinExtension.trim() };
  }

  function detectarRepoDesdeUrl(){
    const host = location.hostname;
    if(!host.endsWith('.github.io')) return null;
    const usuario = host.replace('.github.io', '');
    const segmentos = location.pathname.split('/').filter(Boolean);
    const repositorio = segmentos.length ? segmentos[0] : `${usuario}.github.io`;
    return { usuario, repositorio, rama: 'main', carpeta: (typeof REPO_GITHUB !== 'undefined' && REPO_GITHUB.carpeta) || 'assets/audio' };
  }

  async function descubrirCanciones(){
    const manual = (typeof REPO_GITHUB !== 'undefined') ? REPO_GITHUB : {};
    const manualValido = manual.usuario && manual.repositorio && !manual.usuario.startsWith('TU-');
    const { usuario, repositorio, rama, carpeta } = manualValido ? manual : (detectarRepoDesdeUrl() || {});
    const extra = (typeof CANCIONES_EXTRA !== 'undefined') ? CANCIONES_EXTRA : [];
    const notas = (typeof NOTAS !== 'undefined') ? NOTAS : {};

    let descubiertas = [];
    let avisoCarga = '';

    if(usuario && repositorio){
      try{
        const url = `https://api.github.com/repos/${usuario}/${repositorio}/contents/${carpeta}?ref=${rama || 'main'}`;
        const resp = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
        if(!resp.ok) throw new Error('respuesta ' + resp.status);
        const archivos = await resp.json();

        descubiertas = archivos
          .filter(f => f.type === 'file' && EXTENSIONES_AUDIO.some(ext => f.name.toLowerCase().endsWith(ext)))
          .map(f => {
            const { artista, titulo } = parsearNombre(f.name);
            return {
              id: 'auto-' + f.sha,
              titulo: titulo || f.name,
              artista: artista || 'Pista de la mixtape',
              nota: notas[f.name] || '',
              duracion: null,
              src: f.download_url,
              enlaceExterno: '',
              portada: colorDesde(f.name),
              archivo: f.name
            };
          });

        if(!descubiertas.length) avisoCarga = 'No hay archivos de audio en esa carpeta todavía. Sube alguno a ' + carpeta + ' y recarga.';
      }catch(err){
        console.warn('No se pudo listar el audio automáticamente:', err);
        avisoCarga = 'No se pudieron detectar canciones automáticamente (revisa REPO_GITHUB en musica-datos.js). Mostrando solo las añadidas a mano, si las hay.';
      }
    } else {
      avisoCarga = 'No se detectó automáticamente un repositorio de GitHub Pages (¿estás viendo esto fuera de github.io, por ejemplo en local?). Si quieres probar aquí, rellena REPO_GITHUB en musica-datos.js; si no, sube el sitio a GitHub Pages y funcionará solo.';
    }

    const manuales = extra.map((c, i) => ({
      id: 'extra-' + i,
      titulo: c.titulo,
      artista: c.artista || '',
      nota: c.nota || '',
      duracion: c.duracion || null,
      src: c.src || '',
      enlaceExterno: c.enlaceExterno || '',
      portada: c.portada || colorDesde(c.titulo + i)
    }));

    return { canciones: [...descubiertas, ...manuales], aviso: avisoCarga };
  }

  /* ---------------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------------- */
  function formatearTiempo(segundos){
    if(!isFinite(segundos) || segundos === null || segundos < 0) return '—:—';
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  function fondoGradiente(portada){
    const de = portada?.de || '#a855f7', a = portada?.a || '#ec4899';
    return `background: linear-gradient(150deg, ${de}, ${a});`;
  }
  function mezclar(array){
    const copia = array.slice();
    for(let i = copia.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
  function generarCola(){
    const indices = CANCIONES.map((_, i) => i);
    estado.cola = estado.aleatorio ? mezclar(indices) : indices;
  }
  function iconoPlay(){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; }
  function iconoPausa(){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>'; }
  function iconoNota(){ return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'; }

  /* ---------------------------------------------------------------
     TEMA DINÁMICO
     --------------------------------------------------------------- */
  function aplicarColorAmbiente(portada){
    const de = portada?.de || '#a855f7';
    const a = portada?.a || '#ec4899';
    const raiz = document.documentElement.style;

    raiz.setProperty('--color-de', de);
    raiz.setProperty('--color-a', a);
    raiz.setProperty('--color-brillo', hexARgba(de, 0.45));
    raiz.setProperty('--track-a', de);
    raiz.setProperty('--track-b', a);
  }

  /* ---------------------------------------------------------------
     RENDER DE LA LISTA
     --------------------------------------------------------------- */
  function cancionesFiltradas(){
    const q = estado.filtro.trim().toLowerCase();
    const conIndice = CANCIONES.map((c, i) => ({ ...c, indiceOriginal: i }));
    if(!q) return conIndice;
    return conIndice.filter(c => c.titulo.toLowerCase().includes(q) || c.artista.toLowerCase().includes(q));
  }

  function renderLista(){
    if(!CANCIONES.length){
      listaEl.innerHTML = '<div class="musica-vacio"><span class="musica-vacio__icono">🎵</span>Todavía no hay canciones que mostrar.</div>';
      return;
    }
    const items = cancionesFiltradas();
    if(!items.length){
      listaEl.innerHTML = '<div class="musica-vacio"><span class="musica-vacio__icono">🔍</span>Ninguna canción coincide con esa búsqueda.</div>';
      return;
    }

    // Sin crossfade: el índice siempre muestra el número o el ecualizador.
    listaEl.innerHTML = items.map((c) => {
      const activa = c.indiceOriginal === estado.indiceActual;
      const sonandoAqui = activa && estado.sonando;
      const celdaIndice = sonandoAqui
        ? '<div class="eq-bars"><span></span><span></span><span></span></div>'
        : `<span class="pista-card__num">${c.indiceOriginal + 1}</span>`;
      return `
      <article class="pista-card ${activa ? 'activa' : ''}" data-reveal data-indice="${c.indiceOriginal}" tabindex="0" role="button"
        aria-label="Reproducir ${c.titulo}">
        <div class="pista-card__index">${celdaIndice}</div>
        <div class="pista-card__thumb" style="${fondoGradiente(c.portada)}">${iconoNota()}</div>
        <div class="pista-card__info">
          <div class="pista-card__name">${c.titulo}</div>
          <div class="pista-card__artist">${c.artista}${c.nota ? ` <span class="pista-card__tag">${c.nota}</span>` : ''}</div>
        </div>
        <div class="pista-card__time">
          ${!c.src ? '<span class="chip-external">Enlace</span>' : ''}${formatearTiempo(c.duracion)}
        </div>
      </article>`;
    }).join('');

    listaEl.querySelectorAll('.pista-card').forEach(fila => {
      const activar = () => cargarCancion(Number(fila.dataset.indice), true);
      fila.addEventListener('click', activar);
      fila.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activar(); } });
    });
    if(typeof inicializarRevelado === 'function') inicializarRevelado();
  }

  /* ---------------------------------------------------------------
     REPRODUCCIÓN
     --------------------------------------------------------------- */
  function actualizarInterfazCancion(){
    const c = CANCIONES[estado.indiceActual];
    if(!c) return;
    aplicarColorAmbiente(c.portada);

    if(heroTitulo) heroTitulo.textContent = c.titulo;
    if(heroArtista) heroArtista.textContent = c.artista;
    if(heroNota) heroNota.textContent = c.nota || '';
    if(heroCover) heroCover.classList.toggle('girando', estado.sonando);
    if(heroPlay) heroPlay.innerHTML = estado.sonando ? iconoPausa() : iconoPlay();

    if(barraTitulo) barraTitulo.textContent = c.titulo;
    if(barraArtista) barraArtista.textContent = c.artista;
    if(barraMini) barraMini.style.cssText = fondoGradiente(c.portada);
    if(barraPlay) barraPlay.innerHTML = estado.sonando ? iconoPausa() : iconoPlay();
    if(tiempoTotalEl) tiempoTotalEl.textContent = formatearTiempo(c.duracion);

    if(barraAviso){
      barraAviso.innerHTML = c.src
        ? ''
        : (c.enlaceExterno ? `Sin audio local · <a href="${c.enlaceExterno}" target="_blank" rel="noopener">escuchar en el enlace</a>` : 'Esta canción no tiene audio todavía.');
    }
    renderLista();
  }

  function cargarCancion(indice, autoreproducir){
    estado.indiceActual = indice;
    const c = CANCIONES[indice];
    if(!c) return;

    if(c.src){
      audio.crossOrigin = 'anonymous';
      audio.src = c.src;
      audio.load();
      if(autoreproducir) reproducir(); else { estado.sonando = false; actualizarInterfazCancion(); }
    } else {
      audio.removeAttribute('src');
      estado.sonando = false;
      actualizarInterfazCancion();
      if(autoreproducir && c.enlaceExterno) window.open(c.enlaceExterno, '_blank', 'noopener');
    }
    if(barraProgresoRelleno) barraProgresoRelleno.style.width = '0%';
    if(tiempoActualEl) tiempoActualEl.textContent = '0:00';
  }

  function reproducir(){
    const c = CANCIONES[estado.indiceActual];
    if(!c) return;
    if(!c.src){
      if(c.enlaceExterno) window.open(c.enlaceExterno, '_blank', 'noopener');
      return;
    }
    iniciarVisualizador();
    audio.play().then(() => {
      estado.sonando = true;
      actualizarInterfazCancion();
    }).catch(() => {
      estado.sonando = false;
      if(barraAviso) barraAviso.textContent = 'No se pudo reproducir este archivo.';
      actualizarInterfazCancion();
    });
  }
  function pausar(){ audio.pause(); estado.sonando = false; actualizarInterfazCancion(); }
  function alternarReproduccion(){
    if(estado.sonando) pausar();
    else if(audio.src) reproducir();
    else cargarCancion(estado.indiceActual, true);
  }
  function siguiente(automatico){
    const posicion = estado.cola.indexOf(estado.indiceActual);
    const siguientePosicion = posicion + 1;
    if(siguientePosicion >= estado.cola.length){
      if(estado.repetir === 'todas' || !automatico) cargarCancion(estado.cola[0], true);
      else pausar();
      return;
    }
    cargarCancion(estado.cola[siguientePosicion], true);
  }
  function anterior(){
    if(audio.currentTime > 3){ audio.currentTime = 0; return; }
    const posicion = estado.cola.indexOf(estado.indiceActual);
    const anteriorPosicion = (posicion - 1 + estado.cola.length) % estado.cola.length;
    cargarCancion(estado.cola[anteriorPosicion], true);
  }

  /* ---------------------------------------------------------------
     VISUALIZADOR DE AUDIO EN VIVO
     --------------------------------------------------------------- */
  let contextoAudio, nodoAnalizador, nodoFuente, datosFrecuencia, vizActivo = false;
  function iniciarVisualizador(){
    if(!lienzoViz || contextoAudio) { if(nodoAnalizador) dibujarVisualizador(); return; }
    try{
      const AC = window.AudioContext || window.webkitAudioContext;
      contextoAudio = new AC();
      nodoFuente = contextoAudio.createMediaElementSource(audio);
      nodoAnalizador = contextoAudio.createAnalyser();
      nodoAnalizador.fftSize = 64;
      datosFrecuencia = new Uint8Array(nodoAnalizador.frequencyBinCount);
      nodoFuente.connect(nodoAnalizador);
      nodoAnalizador.connect(contextoAudio.destination);
      dibujarVisualizador();
    }catch(err){
      console.warn('Visualizador no disponible, usando modo simple.', err);
      lienzoViz.classList.add('viz-simple');
    }
  }
  function dibujarVisualizador(){
    if(vizActivo) return;
    vizActivo = true;
    const ctx = lienzoViz.getContext('2d');
    function fotograma(){
      requestAnimationFrame(fotograma);
      if(contextoAudio && contextoAudio.state === 'suspended') contextoAudio.resume();
      const ancho = lienzoViz.width = lienzoViz.clientWidth * devicePixelRatio;
      const alto = lienzoViz.height = lienzoViz.clientHeight * devicePixelRatio;
      ctx.clearRect(0, 0, ancho, alto);
      if(!nodoAnalizador || !estado.sonando) return;
      nodoAnalizador.getByteFrequencyData(datosFrecuencia);
      const n = datosFrecuencia.length;
      const anchoBarra = ancho / n * .68;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--track-a') || '#a855f7';
      for(let i = 0; i < n; i++){
        const h = Math.max(3, (datosFrecuencia[i] / 255) * alto);
        const x = i * (ancho / n);
        ctx.fillRect(x, alto - h, anchoBarra, h);
      }
    }
    fotograma();
  }

  /* ---------------------------------------------------------------
     EVENTOS DEL <audio>
     --------------------------------------------------------------- */
  audio.addEventListener('timeupdate', () => {
    const c = CANCIONES[estado.indiceActual];
    const duracion = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (c?.duracion || 0);
    if(duracion && barraProgresoRelleno) barraProgresoRelleno.style.width = (audio.currentTime / duracion * 100) + '%';
    if(tiempoActualEl) tiempoActualEl.textContent = formatearTiempo(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => {
    const c = CANCIONES[estado.indiceActual];
    if(c && isFinite(audio.duration)){
      c.duracion = audio.duration;
      if(tiempoTotalEl) tiempoTotalEl.textContent = formatearTiempo(audio.duration);
      renderLista();
    }
  });
  audio.addEventListener('ended', () => {
    if(estado.repetir === 'una'){ audio.currentTime = 0; audio.play(); }
    else siguiente(true);
  });
  audio.addEventListener('error', () => {
    if(audio.getAttribute('src')){
      estado.sonando = false;
      if(barraAviso) barraAviso.textContent = 'No se encontró el archivo de audio.';
      actualizarInterfazCancion();
    }
  });

  /* ---------------------------------------------------------------
     CONTROLES
     --------------------------------------------------------------- */
  [heroPlay, barraPlay].forEach(btn => btn && btn.addEventListener('click', alternarReproduccion));
  if(barraPrev) barraPrev.addEventListener('click', anterior);
  if(barraNext) barraNext.addEventListener('click', () => siguiente(false));

  function alternarAleatorio(){
    estado.aleatorio = !estado.aleatorio;
    generarCola();
    [barraAleatorio, sidebarAleatorio].forEach(el => el && el.classList.toggle('activo', estado.aleatorio));
  }
  if(barraAleatorio) barraAleatorio.addEventListener('click', alternarAleatorio);
  if(sidebarAleatorio) sidebarAleatorio.addEventListener('click', alternarAleatorio);

  if(barraRepetir){
    const etiquetas = { apagado: 'Repetir', todas: 'Repetir todas', una: 'Repetir una' };
    barraRepetir.addEventListener('click', () => {
      estado.repetir = estado.repetir === 'apagado' ? 'todas' : (estado.repetir === 'todas' ? 'una' : 'apagado');
      barraRepetir.classList.toggle('activo', estado.repetir !== 'apagado');
      barraRepetir.title = etiquetas[estado.repetir];
    });
  }
  if(barraProgreso){
    barraProgreso.addEventListener('click', (evento) => {
      const c = CANCIONES[estado.indiceActual];
      const duracion = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (c?.duracion || 0);
      if(!duracion) return;
      const rect = barraProgreso.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (evento.clientX - rect.left) / rect.width));
      if(audio.src) audio.currentTime = ratio * duracion;
      if(barraProgresoRelleno) barraProgresoRelleno.style.width = (ratio * 100) + '%';
    });
  }
  if(barraVolumen){
    audio.volume = Number(barraVolumen.value) / 100;
    barraVolumen.addEventListener('input', () => { audio.volume = Number(barraVolumen.value) / 100; });
  }
  if(buscadorInput) buscadorInput.addEventListener('input', () => { estado.filtro = buscadorInput.value; renderLista(); });

  /* ---------------------------------------------------------------
     INICIO
     --------------------------------------------------------------- */
  if(estadoCarga) estadoCarga.textContent = 'Buscando canciones…';
  const { canciones, aviso } = await descubrirCanciones();
  CANCIONES = canciones;

  if(estadoCarga) estadoCarga.textContent = aviso || '';
  if(statTotal) statTotal.textContent = CANCIONES.length + (CANCIONES.length === 1 ? ' canción' : ' canciones');

  if(CANCIONES.length){
    generarCola();
    cargarCancion(0, false);
  } else {
    renderLista();
  }

  if(typeof inicializarRevelado !== 'function'){
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revelado'));
  }
});