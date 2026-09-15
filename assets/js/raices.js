/* ==========================================================================
   RAICES.JS — El cielo compartido (versión nocturna, v4)
   - Layout tipo masonry: cada raíz se apila en la columna más corta. Cero
     solapamiento garantizado en cualquier tamaño de pantalla.
   - Jitter determinista por id para que no parezca una cuadrícula.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const franja1El = document.getElementById('franja-1');
  const franja2El = document.getElementById('franja-2');
  const franja3El = document.getElementById('franja-3');
  const modalFoto = document.getElementById('modal-foto');
  const overlay = document.getElementById('transicion-overlay');
  const sobre = document.getElementById('sobre-final');

  if(!franja1El || typeof FOTOS === 'undefined') return;

  /* ------------------------------------------------------------------ */
  function hash(str){
    let h = 0;
    for(let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function retardo(id){ return (hash(id + 'd') % 400) / 100; }
  function duracion(id){ return 8 + ((hash(id + 'u') % 60) / 10); }

  /* ------------------------------------------------------------------
     RENDER DE FOTO
     ------------------------------------------------------------------ */
  function renderFoto(foto, index){
    const esEstrella = foto.tipo === 'estrella';
    const clase = esEstrella ? 'raiz raiz--estrella' : 'raiz raiz--nube';
    const tieneTexto = foto.nombre || foto.anio || foto.comentario;

    return `
      <button class="${clase}" type="button" data-id="${foto.id}"
        style="--flotar-delay:-${retardo(foto.id)}s; --flotar-duracion:${duracion(foto.id)}s;
               --entrada-delay:${(index * 0.05).toFixed(2)}s;"
        aria-label="${foto.nombre ? 'Foto de ' + foto.nombre : 'Foto'}">
        <span class="raiz__silueta" aria-hidden="true"></span>
        <span class="raiz__foto">
          <span class="raiz__placeholder" aria-hidden="true"></span>
          <img src="${foto.src}" alt="${foto.nombre || ''}" loading="lazy"
               onload="this.parentElement.classList.add('con-foto')"
               onerror="this.parentElement.classList.add('sin-foto')">
        </span>
        ${esEstrella ? '<span class="raiz__destello" aria-hidden="true"></span>' : ''}
        ${tieneTexto ? '<span class="raiz__pista" aria-hidden="true">+</span>' : ''}
      </button>
    `;
  }

  /* ------------------------------------------------------------------
     DISTRIBUCIÓN MASONRY
     ------------------------------------------------------------------
     Cada raíz se coloca en la columna más corta en ese momento. Se apilan
     verticalmente dentro de cada columna, así que es IMPOSIBLE que dos se
     solapen, sea cual sea el tamaño de pantalla.
     El "desorden" viene de un jitter pequeño (determinista por id) en la
     posición horizontal y vertical de cada raíz.
     ------------------------------------------------------------------ */
  function distribuirEnFranja(contenedor){
    if(!contenedor) return;
    const raices = Array.from(contenedor.querySelectorAll('.raiz'));
    if(!raices.length) return;

    const anchoUtil = contenedor.clientWidth;
    if(!anchoUtil || anchoUtil < 100) return;

    const esMovil = window.innerWidth < 700;

    // Espaciados
    const padX = esMovil ? 12 : 32;   // padding lateral interior
    const padY = esMovil ? 20 : 40;   // padding superior e inferior
    const gapX = esMovil ? 8 : 24;    // separación horizontal entre columnas
    const gapY = esMovil ? 24 : 48;   // separación vertical entre raíces

    const anchoInterior = anchoUtil - padX * 2;
    if(anchoInterior < 80) return;

    // Medidas reales de cada raíz
    const medidas = raices.map(el => ({
      el,
      w: el.offsetWidth || 140,
      h: el.offsetHeight || 140
    }));

    const wMax = Math.max(...medidas.map(m => m.w));

    // Nº de columnas: cuántas caben sin solapar
    let columnas = Math.max(1, Math.floor((anchoInterior + gapX) / (wMax + gapX)));
    columnas = Math.min(columnas, 5);

    const anchoColumna = (anchoInterior - gapX * (columnas - 1)) / columnas;
    const espacioLibre = Math.max(anchoColumna - wMax, 0);

    // Jitter: proporcional al espacio libre (para no acercar tanto como para solapar)
    const jitterX = espacioLibre * 0.4;
    const jitterY = gapY * 0.3;

    // Ordenamos las raíces por hash del id → layout determinista pero "barajado"
    const ordenadas = medidas.slice().sort((a, b) => {
      return hash(a.el.dataset.id || '') - hash(b.el.dataset.id || '');
    });

    // Alturas actuales de cada columna (empiezan con el padding superior)
    const alturas = new Array(columnas).fill(padY);

    ordenadas.forEach(m => {
      // Columna más corta
      let col = 0;
      for(let i = 1; i < columnas; i++){
        if(alturas[i] < alturas[col]) col = i;
      }

      // Centro base de la columna
      const centroBaseX = padX + anchoColumna * col + anchoColumna / 2 + gapX * col;
      const centroBaseY = alturas[col] + m.h / 2;

      // Jitter determinista
      const h1 = hash(m.el.dataset.id + 'x');
      const h2 = hash(m.el.dataset.id + 'y');
      const jx = ((h1 % 1000) / 1000 - 0.5) * 2 * jitterX;
      const jy = ((h2 % 1000) / 1000 - 0.5) * 2 * jitterY;

      m.el.style.position = 'absolute';
      m.el.style.left = (centroBaseX + jx) + 'px';
      m.el.style.top  = (centroBaseY + jy) + 'px';

      // Actualizar altura de esa columna
      alturas[col] = centroBaseY + m.h / 2 + gapY;
    });

    // Altura total: la columna más alta menos el gap sobrante + padding
    const alturaTotal = Math.max(...alturas) - gapY + padY + 20;

    contenedor.style.position = 'relative';
    contenedor.style.height = alturaTotal + 'px';
    contenedor.style.minHeight = alturaTotal + 'px';
  }

  /* ------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------ */
  function renderFranjas(){
    const grupos = {
      1: FOTOS.filter(f => f.franja === 1),
      2: FOTOS.filter(f => f.franja === 2),
      3: FOTOS.filter(f => f.franja === 3)
    };
    if(franja1El) franja1El.innerHTML = grupos[1].map((f, i) => renderFoto(f, i)).join('');
    if(franja2El) franja2El.innerHTML = grupos[2].map((f, i) => renderFoto(f, i)).join('');
    if(franja3El) franja3El.innerHTML = grupos[3].map((f, i) => renderFoto(f, i)).join('');

    // Esperar a que el navegador mida antes de distribuir
    requestAnimationFrame(() => {
      distribuirEnFranja(franja1El);
      distribuirEnFranja(franja2El);
      distribuirEnFranja(franja3El);
    });

    document.querySelectorAll('.raiz').forEach(el => {
      el.addEventListener('click', () => abrirModalFoto(el.dataset.id));
    });
  }

  /* ------------------------------------------------------------------
     RE-DISTRIBUCIÓN AL REDIMENSIONAR
     ------------------------------------------------------------------ */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      distribuirEnFranja(franja1El);
      distribuirEnFranja(franja2El);
      distribuirEnFranja(franja3El);
    }, 150);
  });

  /* ------------------------------------------------------------------
     MODAL DE FOTO
     ------------------------------------------------------------------ */
  function abrirModalFoto(id){
    const foto = FOTOS.find(f => f.id === id);
    if(!foto || !modalFoto) return;
    modalFoto.querySelector('.modal-foto__img').src = foto.src;
    modalFoto.querySelector('.modal-foto__img').alt = foto.nombre || '';
    modalFoto.querySelector('.modal-foto__nombre').textContent = foto.nombre || '';
    modalFoto.querySelector('.modal-foto__anio').textContent = foto.anio || '';
    modalFoto.querySelector('.modal-foto__comentario').textContent = foto.comentario || '';
    modalFoto.querySelector('.modal-foto__nombre').style.display = foto.nombre ? '' : 'none';
    modalFoto.querySelector('.modal-foto__anio').style.display = foto.anio ? '' : 'none';
    modalFoto.querySelector('.modal-foto__comentario').style.display = foto.comentario ? '' : 'none';
    modalFoto.querySelector('.modal-foto__caja').classList.toggle('modal-foto__caja--estrella', foto.tipo === 'estrella');
    modalFoto.classList.add('abierto');
    modalFoto.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function cerrarModalFoto(){
    if(!modalFoto) return;
    modalFoto.classList.remove('abierto');
    modalFoto.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if(modalFoto){
    modalFoto.querySelector('.modal-foto__cerrar')?.addEventListener('click', cerrarModalFoto);
    modalFoto.addEventListener('click', (e) => { if(e.target === modalFoto) cerrarModalFoto(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') cerrarModalFoto(); });
  }

  /* ------------------------------------------------------------------
     CARTA
     ------------------------------------------------------------------ */
  function renderCarta(){
    const cartaEl = document.getElementById('carta-contenido');
    if(!cartaEl || typeof CARTA_FINAL === 'undefined') return;
    const parrafosHTML = CARTA_FINAL.parrafos
      .filter(p => p && p.trim().length)
      .map(p => `<p>${p}</p>`)
      .join('');
    cartaEl.innerHTML = `
      <h2 class="carta__encabezado">${CARTA_FINAL.encabezado || ''}</h2>
      <div class="carta__cuerpo">${parrafosHTML}</div>
      ${CARTA_FINAL.firma
        ? `<p class="carta__firma">${CARTA_FINAL.firma}</p>`
        : `<p class="carta__firma carta__firma--vacia"><!-- EDITABLE: aquí va la firma --></p>`}
      <p class="carta__pie">
        <button class="carta__boton" type="button" id="btn-volver-ventanilla">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>${CARTA_FINAL.boton || 'Volver a la ventanilla'}</span>
        </button>
      </p>
    `;
    document.getElementById('btn-volver-ventanilla')?.addEventListener('click', transicionInversa);
  }

  /* ------------------------------------------------------------------
     ABRIR SOBRE
     ------------------------------------------------------------------ */
  function abrirSobre(){
    if(!sobre || sobre.classList.contains('abierto')) return;
    if(typeof AudioAeronautico !== 'undefined') AudioAeronautico.tocarClic();

    const cerrarYMostrarCarta = () => {
      sobre.classList.add('abierto');
      document.querySelector('.sobre-final__envoltorio').style.display = 'none';
      document.getElementById('carta-final').classList.add('visible');
      setTimeout(() => {
        document.getElementById('carta-final')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    if(typeof gsap !== 'undefined'){
      const tl = gsap.timeline();
      tl.to('.sobre-final__sello', { scale: 1.18, duration: 0.25, ease: 'power2.out' })
        .to('.sobre-final__sello', { opacity: 0, scale: 0.55, rotate: -25, duration: 0.45, ease: 'power2.in' })
        .to('.sobre-final__cordel', { scale: 0.85, opacity: 0, duration: 0.35, ease: 'power2.in' }, '-=0.4')
        .to('.sobre-final__solapa', { rotateX: -180, duration: 0.85, ease: 'power3.inOut', transformOrigin: 'top center' }, '-=0.2')
        .to('.sobre-final__carta-doblada', { y: -70, opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.4')
        .to('.sobre-final__carta-doblada', { y: -140, scale: 1.06, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.25')
        .call(cerrarYMostrarCarta);
    } else {
      cerrarYMostrarCarta();
    }
  }

  /* ------------------------------------------------------------------
     PRECARGA DE index.html
     ------------------------------------------------------------------ */
  let precargaHecha = false;
  function precargarIndex(){
    if(precargaHecha) return;
    precargaHecha = true;
    try {
      const linkHTML = document.createElement('link');
      linkHTML.rel = 'prefetch';
      linkHTML.href = 'index.html';
      linkHTML.as = 'document';
      document.head.appendChild(linkHTML);
    } catch(e){}
    try {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');
      iframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;opacity:0;pointer-events:none;';
      iframe.src = 'index.html';
      document.body.appendChild(iframe);
    } catch(e){}
  }

  /* ------------------------------------------------------------------
     TRANSICIÓN INVERSA
     ------------------------------------------------------------------ */
  function transicionInversa(){
    precargarIndex();

    if(!overlay){
      try { sessionStorage.removeItem('martaAirlines:enTerminal'); } catch(e){}
      window.location.href = 'index.html';
      return;
    }

    const ventanilla = overlay.querySelector('.transicion-ventanilla');
    const hojaIzq = overlay.querySelector('.transicion-hoja--izq');
    const hojaDer = overlay.querySelector('.transicion-hoja--der');
    const destello = overlay.querySelector('.transicion-destello');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const redirigir = () => {
      try { sessionStorage.removeItem('martaAirlines:enTerminal'); } catch(e){}
      window.location.href = 'index.html';
    };

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');

    if(reducido){
      setTimeout(redirigir, 500);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const wv = ventanilla.offsetWidth;
    const hv = ventanilla.offsetHeight;
    const escalaInicial = Math.max(w / wv, h / hv) * 1.25;

    if(typeof gsap !== 'undefined'){
      const tl = gsap.timeline({ onComplete: redirigir });

      tl.set(ventanilla, { scale: escalaInicial, opacity: 1 });
      tl.set([hojaIzq, hojaDer], { opacity: 0, x: (i) => i === 0 ? '-104%' : '104%' });
      tl.set(destello, { opacity: 0 });

      tl.to(ventanilla, { scale: 1, duration: 1.6, ease: 'power2.inOut' });
      tl.to([hojaIzq, hojaDer], { opacity: 1, duration: 0.25 }, '-=0.35');
      tl.to(hojaIzq, { x: '0%', duration: 0.95, ease: 'power3.inOut' }, '-=0.05');
      tl.to(hojaDer, { x: '0%', duration: 0.95, ease: 'power3.inOut' }, '<');
      tl.to(destello, { opacity: 1, duration: 0.16, ease: 'power2.in' }, '-=0.08');
      tl.set(overlay, { backgroundColor: '#000000' }, '-=0.02');
      tl.to({}, { duration: 0.25 });
    } else {
      setTimeout(redirigir, 1500);
    }
  }

  /* ------------------------------------------------------------------ */
  renderFranjas();
  renderCarta();
  if(sobre) sobre.addEventListener('click', abrirSobre);
});