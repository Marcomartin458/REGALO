/* ==========================================================================
   HOME.JS — LÓGICA DE LA CABINA DE AVIÓN (ASIENTO 23A) Y APERTURA
   - Control electrocrómico de tinte de ventanilla Boeing 787 (5 niveles reales).
   - Tipografiado nítido y elegante del mensaje a bordo en la ventanilla.
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
  const textoElemento = document.getElementById('texto-cabina');
  const cristalTint = document.getElementById('cristal-tint');

  const FRASE_VENTANILLA = "Por si algún día se te olvida quién eres,\neste es tu camino de vuelta a casa...";
  let cancelarEscritura = false;

  /* --------------------------------------------------------------------------
     CONTROL ELECTROCRÓMICO DE TINTE DE VENTANILLA BOEING 787 DREAMLINER
     5 niveles de opacidad de tinte azul cobalto profundo
     -------------------------------------------------------------------------- */
  const NIVELES_TINTE = [0.0, 0.24, 0.48, 0.72, 0.92];
  let nivelActualTint = 0; // Inicia despejado para apreciar el cielo diurno

  const btnTintUp = document.getElementById('btn-tint-up');
  const btnTintDown = document.getElementById('btn-tint-down');
  const ledsContainer = document.getElementById('dimmer-leds');
  const leds = ledsContainer ? ledsContainer.querySelectorAll('.led') : [];

  function actualizarTinte(nuevoNivel) {
    nivelActualTint = Math.max(0, Math.min(NIVELES_TINTE.length - 1, nuevoNivel));

    // 1. Actualizar indicador visual de LEDs
    leds.forEach((led, idx) => {
      led.classList.toggle('active', idx <= nivelActualTint);
    });

    // 2. Aplicar tinte al cristal acrílico con transición suave
    if (cristalTint) {
      cristalTint.style.opacity = String(NIVELES_TINTE[nivelActualTint]);
    }

    if (typeof AudioAeronautico !== 'undefined') {
      AudioAeronautico.tocarClic();
    }
  }

  if (btnTintUp) {
    btnTintUp.addEventListener('click', () => {
      if (nivelActualTint < NIVELES_TINTE.length - 1) {
        actualizarTinte(nivelActualTint + 1);
      }
    });
  }

  if (btnTintDown) {
    btnTintDown.addEventListener('click', () => {
      if (nivelActualTint > 0) {
        actualizarTinte(nivelActualTint - 1);
      }
    });
  }

  /* --------------------------------------------------------------------------
     TIPOGRAFÍA Y ESCRITURA NÍTIDA DEL MENSAJE DE A BORDO
     -------------------------------------------------------------------------- */
  async function escribirMensaje(elemento, texto) {
    if (!elemento) return;
    elemento.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-trazo';

    const lineas = texto.split('\n');
    let acumulado = '';

    for (let l = 0; l < lineas.length; l++) {
      const linea = lineas[l];
      if (l > 0) acumulado += '<br>';

      for (let i = 0; i < linea.length; i++) {
        if (cancelarEscritura) return;
        acumulado += linea[i];
        elemento.innerHTML = acumulado;
        elemento.appendChild(cursor);

        const pausa = (linea[i] === ',' || linea[i] === '.') ? 240 : 0;
        await new Promise(r => setTimeout(r, 40 + Math.random() * 20 + pausa));
      }
      await new Promise(r => setTimeout(r, 160));
    }

    setTimeout(() => {
      if (cursor.parentElement) cursor.remove();
    }, 1500);
  }

  /* --------------------------------------------------------------------------
     SECUENCIA CINEMATOGRÁFICA DE APERTURA DE COMPUERTA (ACCESO AL VESTÍBULO)
     -------------------------------------------------------------------------- */
  function ejecutarAperturaPuerta() {
    if (botonAbrir) botonAbrir.classList.add('abriendo');

    // Efectos de sonido aeronáuticos coordinados
    if (typeof AudioAeronautico !== 'undefined') {
      AudioAeronautico.tocarWhooshPuerta();
      AudioAeronautico.tocarDingDong();
    }

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

    tl.to('.cabina-bahia-central', { scale: 0.94, duration: dur ?? 0.4 }, 0)
      .to(hojaIzq, { rotateY: -96, x: '-102%', duration: dur ?? 0.95 }, 0.1)
      .to(hojaDer, { rotateY: 96, x: '102%', duration: dur ?? 0.95 }, 0.1)
      .to(destello, { opacity: 1, duration: dur ?? 0.22, ease: 'power2.in' }, dur ? 0 : 0.8)
      .to(escenaVuelo, { opacity: 0, scale: 1.05, duration: dur ?? 0.5 }, dur ? 0 : 0.9)
      .to(destello, { opacity: 0, duration: dur ?? 0.45 }, dur ? 0 : 1.15);
  }

  function revelarVestibulo() {
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
    gsap.set('.cabina-bahia-central', { scale: 1 });

    if (window.EscenaVentanilla) window.EscenaVentanilla.init();
    if (textoElemento) textoElemento.innerHTML = '';
    setTimeout(() => escribirMensaje(textoElemento, FRASE_VENTANILLA), 500);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* --------------------------------------------------------------------------
     INICIALIZACIÓN INMEDIATA (SIEMPRE MUESTRA LA CABINA DE AVIÓN AL CARGAR)
     -------------------------------------------------------------------------- */
  if (window.EscenaVentanilla) window.EscenaVentanilla.init();
  actualizarTinte(0);
  setTimeout(() => escribirMensaje(textoElemento, FRASE_VENTANILLA), 650);

  if (botonAbrir) botonAbrir.addEventListener('click', ejecutarAperturaPuerta);
  if (botonVolver) botonVolver.addEventListener('click', volverAEntrar);
});