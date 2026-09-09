/* ==========================================================================
   HOME.JS — LÓGICA EXCLUSIVA DE LA VENTANILLA Y APERTURA DE CABINA
   - Condensación física con microgotas en Canvas 2D.
   - Texto manuscrito ("Por si algún día se te olvida quién eres...") que
     despeja el vaho dejando ver el cielo 3D cristalino y brillante.
   - Limpieza interactiva con el dedo o ratón.
   - Secuencia cinematográfica de apertura con Web Audio API y GSAP.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const escenaVuelo = document.querySelector('.escena-vuelo');
  const vestibulo = document.querySelector('.vestibulo');
  if (!escenaVuelo || !vestibulo) return;

  const botonAbrir = document.querySelector('.js-abrir-puerta');
  const botonVolver = document.querySelector('.js-volver-entrar');
  const hojaIzq = document.querySelector('.hoja--izq');
  const hojaDer = document.querySelector('.hoja--der');
  const destello = document.querySelector('.destello-apertura');
  const canvasVaho = document.querySelector('.canvas-vaho');
  const textoElemento = document.getElementById('texto-vaho');

  const FRASE_VENTANILLA = "Por si algún día se te olvida quién eres,\neste es tu camino de vuelta a casa...";
  let animVahoId = null;
  let cancelarEscritura = false;

  /* --------------------------------------------------------------------------
     SIMULACIÓN DE CONDENSACIÓN Y GOTAS QUE RESBALAN SOBRE EL CRISTAL
     -------------------------------------------------------------------------- */
  function iniciarCondensacion() {
    if (!canvasVaho) return () => {};
    const ctx = canvasVaho.getContext('2d', { willReadFrequently: true });
    let ancho, alto, dpr;
    let gotasEstaticas = [];
    let gotasQueResbalan = [];

    function redimensionar() {
      const rect = canvasVaho.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = canvasVaho.width = Math.round(rect.width * dpr);
      alto = canvasVaho.height = Math.round(rect.height * dpr);
      canvasVaho.style.width = `${rect.width}px`;
      canvasVaho.style.height = `${rect.height}px`;
    }

    function generarGotas() {
      gotasEstaticas = [];
      const total = Math.round((ancho * alto) / 580);
      for (let i = 0; i < total; i++) {
        const x = Math.random() * ancho;
        const y = Math.random() * alto;
        // Mayor densidad y condensación en el perímetro y fondo
        const r = (Math.random() * 2.8 + 0.8) * dpr;
        const op = Math.random() * 0.45 + 0.3;
        gotasEstaticas.push({ x, y, r, op });
      }
    }

    function pintarCapaVaho() {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      // 1. Capa de niebla perlada traslúcida (vaho frío)
      const grad = ctx.createRadialGradient(
        ancho * 0.5, alto * 0.45, ancho * 0.1,
        ancho * 0.5, alto * 0.5, ancho * 0.75
      );
      grad.addColorStop(0, 'rgba(235, 245, 255, 0.65)');
      grad.addColorStop(0.65, 'rgba(215, 235, 255, 0.76)');
      grad.addColorStop(1, 'rgba(195, 220, 250, 0.88)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ancho, alto);

      // 2. Microgotas refractivas de condensación
      gotasEstaticas.forEach((g) => {
        ctx.fillStyle = `rgba(8, 16, 28, ${g.op * 0.35})`;
        ctx.beginPath();
        ctx.arc(g.x + 0.5, g.y + 0.7, g.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${g.op * 0.85})`;
        ctx.beginPath();
        ctx.arc(g.x - 0.4, g.y - 0.4, g.r * 0.85, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Área del Bleed Hole naturalmente desprovista de condensación
      ctx.globalCompositeOperation = 'destination-out';
      const holeX = ancho * 0.5;
      const holeY = alto * 0.92;
      const holeR = 14 * dpr;
      const gradHole = ctx.createRadialGradient(holeX, holeY, 0, holeX, holeY, holeR);
      gradHole.addColorStop(0, 'rgba(0,0,0,1)');
      gradHole.addColorStop(0.5, 'rgba(0,0,0,0.8)');
      gradHole.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradHole;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    /* Trazo del dedo que borra la niebla y revela el 3D */
    function trazarDedo(x, y, radio = 16 * dpr) {
      ctx.save();
      // Borrado de condensación
      ctx.globalCompositeOperation = 'destination-out';
      const gDedo = ctx.createRadialGradient(x, y, radio * 0.3, x, y, radio);
      gDedo.addColorStop(0, 'rgba(0,0,0,1)');
      gDedo.addColorStop(0.75, 'rgba(0,0,0,0.92)');
      gDedo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gDedo;
      ctx.beginPath();
      ctx.arc(x, y, radio, 0, Math.PI * 2);
      ctx.fill();

      // Menisco húmedo acumulado en el contorno del dedo
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.arc(x, y, radio * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // Gotas que resbalan de forma natural
    function animarGotas() {
      if (gotasQueResbalan.length > 0) {
        gotasQueResbalan.forEach((g, idx) => {
          trazarDedo(g.x, g.y, g.r);
          g.y += g.vy;
          g.vida -= g.vy;
          if (g.vida <= 0 || g.y > alto) {
            gotasQueResbalan.splice(idx, 1);
          }
        });
      }
      animVahoId = requestAnimationFrame(animarGotas);
    }

    /* ------------------------------------------------------------------------
       INTERACTIVIDAD TÁCTIL: MARTA PUEDE LIMPIAR EL VAHO CON SU DEDO
       ------------------------------------------------------------------------ */
    let tocando = false;

    function posEvento(e) {
      const rect = canvasVaho.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (cx - rect.left) * (ancho / rect.width),
        y: (cy - rect.top) * (alto / rect.height)
      };
    }

    function alTocarInicio(e) {
      tocando = true;
      const p = posEvento(e);
      trazarDedo(p.x, p.y, 18 * dpr);
      AudioAeronautico.tocarClic();
    }

    function alTocarMover(e) {
      if (!tocando) return;
      const p = posEvento(e);
      trazarDedo(p.x, p.y, 15 * dpr);
    }

    function alTocarFin() {
      tocando = false;
    }

    canvasVaho.addEventListener('mousedown', alTocarInicio);
    window.addEventListener('mousemove', alTocarMover);
    window.addEventListener('mouseup', alTocarFin);

    canvasVaho.addEventListener('touchstart', alTocarInicio, { passive: true });
    window.addEventListener('touchmove', alTocarMover, { passive: true });
    window.addEventListener('touchend', alTocarFin);

    redimensionar();
    generarGotas();
    pintarCapaVaho();
    animarGotas();

    window.addEventListener('resize', () => {
      redimensionar();
      generarGotas();
      pintarCapaVaho();
    });

    return {
      trazarDedo,
      agregarGota(x, y) {
        gotasQueResbalan.push({
          x,
          y,
          vy: (Math.random() * 0.7 + 0.5) * dpr,
          vida: (Math.random() * 50 + 30) * dpr,
          r: 2.5 * dpr
        });
      },
      destruir() {
        if (animVahoId) cancelAnimationFrame(animVahoId);
        canvasVaho.removeEventListener('mousedown', alTocarInicio);
        window.removeEventListener('mousemove', alTocarMover);
        window.removeEventListener('mouseup', alTocarFin);
        canvasVaho.removeEventListener('touchstart', alTocarInicio);
        window.removeEventListener('touchmove', alTocarMover);
        window.removeEventListener('touchend', alTocarFin);
      }
    };
  }

  /* --------------------------------------------------------------------------
     ESCRITURA MANUSCRITA SOBRE EL CRISTAL HÚMEDO
     -------------------------------------------------------------------------- */
  async function escribirFrase(elemento, texto, controladorVaho) {
    if (!elemento) return;
    elemento.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-trazo';

    const lineas = texto.split('\n');
    let textoAcumulado = '';

    for (let l = 0; l < lineas.length; l++) {
      const linea = lineas[l];
      if (l > 0) textoAcumulado += '<br>';

      for (let i = 0; i < linea.length; i++) {
        if (cancelarEscritura) return;
        textoAcumulado += linea[i];
        elemento.innerHTML = textoAcumulado;
        elemento.appendChild(cursor);

        // Limpiar el vaho proporcionalmente donde se escribe
        if (controladorVaho && canvasVaho) {
          const rect = canvasVaho.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const xNorm = (i / linea.length) * 0.7 + 0.15;
          const yNorm = l === 0 ? 0.38 : 0.54;
          controladorVaho.trazarDedo(rect.width * xNorm * dpr, rect.height * yNorm * dpr, 16 * dpr);

          // Una gota resbala al final de la primera línea
          if (l === 0 && i === linea.length - 1) {
            controladorVaho.agregarGota(rect.width * 0.75 * dpr, rect.height * 0.4 * dpr);
          }
        }

        const pausa = (linea[i] === ',' || linea[i] === '.') ? 260 : 0;
        await new Promise(r => setTimeout(r, 45 + Math.random() * 25 + pausa));
      }
      await new Promise(r => setTimeout(r, 180));
    }

    setTimeout(() => cursor.remove(), 1400);
  }

  /* --------------------------------------------------------------------------
     APERTURA CINEMATOGRÁFICA DE LA COMPUERTA (ACCESO AL VESTÍBULO)
     -------------------------------------------------------------------------- */
  function ejecutarAperturaPuerta() {
    if (botonAbrir) botonAbrir.classList.add('abriendo');

    // Efectos de sonido aeronáuticos
    AudioAeronautico.tocarWhooshPuerta();
    AudioAeronautico.tocarDingDong();

    // Aceleración de vuelo 3D
    if (window.EscenaVentanilla && typeof window.EscenaVentanilla.acelerarVuelo === 'function') {
      window.EscenaVentanilla.acelerarVuelo();
    }

    if (hojaIzq) hojaIzq.style.display = 'block';
    if (hojaDer) hojaDer.style.display = 'block';

    const dur = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.05 : undefined;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: revelarVestibulo
    });

    tl.to('.cabina-pared', { scale: 0.94, duration: dur ?? 0.4 }, 0)
      .to(hojaIzq, { rotateY: -96, x: '-102%', duration: dur ?? 0.95 }, 0.1)
      .to(hojaDer, { rotateY: 96, x: '102%', duration: dur ?? 0.95 }, 0.1)
      .to(destello, { opacity: 1, duration: dur ?? 0.22, ease: 'power2.in' }, dur ? 0 : 0.8)
      .to(escenaVuelo, { opacity: 0, scale: 1.06, duration: dur ?? 0.5 }, dur ? 0 : 0.9)
      .to(destello, { opacity: 0, duration: dur ?? 0.45 }, dur ? 0 : 1.15);
  }

  function revelarVestibulo() {
    if (controladorVaho) controladorVaho.destruir();
    if (window.EscenaVentanilla) window.EscenaVentanilla.destruir();

    escenaVuelo.style.display = 'none';
    escenaVuelo.style.opacity = '';
    escenaVuelo.style.transform = '';

    vestibulo.classList.add('entrando');
    body.classList.remove('antes-vuelo');
    body.classList.add('en-vuelo');

    if (typeof configurarRevelado === 'function') configurarRevelado();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function volverAEntrar() {
    vestibulo.classList.remove('entrando');
    body.classList.remove('en-vuelo');
    body.classList.add('antes-vuelo');
    escenaVuelo.style.display = 'flex';
    escenaVuelo.style.opacity = '1';
    escenaVuelo.style.transform = 'none';

    if (hojaIzq) { hojaIzq.style.display = 'none'; gsap.set(hojaIzq, { rotateY: 0, x: 0 }); }
    if (hojaDer) { hojaDer.style.display = 'none'; gsap.set(hojaDer, { rotateY: 0, x: 0 }); }
    if (destello) destello.style.opacity = '0';
    if (botonAbrir) botonAbrir.classList.remove('abriendo');
    gsap.set('.cabina-pared', { scale: 1 });

    if (window.EscenaVentanilla) window.EscenaVentanilla.init();
    controladorVaho = iniciarCondensacion();
    if (textoElemento) textoElemento.innerHTML = '';
    setTimeout(() => escribirFrase(textoElemento, FRASE_VENTANILLA, controladorVaho), 500);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* --------------------------------------------------------------------------
     ARRANQUE INICIAL (SIEMPRE MUESTRA LA VENTANILLA EN INDEX.HTML)
     -------------------------------------------------------------------------- */
  let controladorVaho = iniciarCondensacion();
  if (window.EscenaVentanilla) window.EscenaVentanilla.init();
  setTimeout(() => escribirFrase(textoElemento, FRASE_VENTANILLA, controladorVaho), 700);

  if (botonAbrir) botonAbrir.addEventListener('click', ejecutarAperturaPuerta);
  if (botonVolver) botonVolver.addEventListener('click', volverAEntrar);

  // Microinteracción con botones de oscurecimiento 787
  const leds = document.querySelectorAll('.dimmer-leds .led');
  let nivelTint = 2;
  document.querySelector('.dimmer-btn.btn-up')?.addEventListener('click', () => {
    if (nivelTint < leds.length) {
      nivelTint++;
      leds.forEach((l, i) => l.classList.toggle('active', i < nivelTint));
      AudioAeronautico.tocarClic();
    }
  });
  document.querySelector('.dimmer-btn.btn-down')?.addEventListener('click', () => {
    if (nivelTint > 0) {
      nivelTint--;
      leds.forEach((l, i) => l.classList.toggle('active', i < nivelTint));
      AudioAeronautico.tocarClic();
    }
  });
});