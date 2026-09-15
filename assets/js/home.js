/* ==========================================================================
   HOME.JS — LÓGICA DE CABINA (23A), MOTOR SPLIT-FLAP Y E-GATES DE EMBARQUE
   - Control electrocrómico de tinte de ventanilla Boeing 787 (5 niveles reales).
   - Tipografiado nítido y elegante del mensaje a bordo en la ventanilla.
   - Generador dinámico Solari Split-Flap con animación mecánica y sonido clack.
   - Interactividad con las puertas de embarque (apertura de cristal y sonido escáner).
   - Secuencia cinematográfica de apertura con Web Audio API y GSAP.
   - Acceso directo a terminal si se regresa desde una subpágina (#terminal).
   - FIX v2: al mostrar el vestíbulo se revelan TODOS los elementos con
     [data-reveal] escalonadamente. Ya no dependemos del IntersectionObserver,
     que en móvil dejaba las puertas 2, 3 y 4 ocultas hasta hacer scroll.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const escenaVuelo = document.querySelector('.escena-vuelo');
  const vestibulo = document.querySelector('.vestibulo');
  if (!escenaVuelo || !vestibulo) return;

  const botonAbrir = document.querySelector('.js-abrir-puerta');
  const hojaIzq = document.querySelector('.hoja--izq');
  const hojaDer = document.querySelector('.hoja--der');
  const destello = document.querySelector('.destello-apertura');
  const textoElemento = document.getElementById('texto-cabina');
  const cristalTint = document.getElementById('cristal-tint');

  const FRASE_VENTANILLA = "Por si algún día se te olvida quién eres,\neste es tu camino de vuelta a casa...";
  let cancelarEscritura = false;

  /* --------------------------------------------------------------------------
     CONTROL ELECTROCRÓMICO DE TINTE DE VENTANILLA BOEING 787 DREAMLINER
     -------------------------------------------------------------------------- */
  const NIVELES_TINTE = [0.0, 0.24, 0.48, 0.72, 0.92];
  let nivelActualTint = 0;

  const btnTintUp = document.getElementById('btn-tint-up');
  const btnTintDown = document.getElementById('btn-tint-down');
  const ledsContainer = document.getElementById('dimmer-leds');
  const leds = ledsContainer ? ledsContainer.querySelectorAll('.led') : [];

  function actualizarTinte(nuevoNivel) {
    nivelActualTint = Math.max(0, Math.min(NIVELES_TINTE.length - 1, nuevoNivel));

    leds.forEach((led, idx) => {
      led.classList.toggle('active', idx <= nivelActualTint);
    });

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
     TIPOGRAFÍA NÍTIDA EN LA VENTANILLA
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
     MOTOR SOLARI SPLIT-FLAP (LETREROS MECÁNICOS CON SONIDO CLACK)
     -------------------------------------------------------------------------- */
  const ALFABETO_FLAP = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-.·/★";

  function sintetizarClackFlap() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.018), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.0035));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200 + Math.random() * 600, ctx.currentTime);
      filter.Q.value = 3.2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Sonido óptico de confirmación al validar pasaje en los e-Gates
  function sonidoEscanerGate() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, ctx.currentTime);
      gain.gain.setValueAtTime(0.065, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  class SplitFlapFila {
    constructor(contenedor) {
      this.contenedor = contenedor;
      this.textoFinal = (contenedor.dataset.flapText || contenedor.textContent || '').trim().toUpperCase();
      this.esAmarillo = contenedor.dataset.flapColor === 'amber' || contenedor.classList.contains('flap--amber');
      this.tiles = [];
      this.construir();
    }

    construir() {
      this.contenedor.innerHTML = '';
      for (let i = 0; i < this.textoFinal.length; i++) {
        const char = this.textoFinal[i];
        const tile = document.createElement('div');
        tile.className = 'flap-tile' + (char === ' ' ? ' flap-tile--space' : '');
        if (this.esAmarillo) tile.classList.add('flap-tile--amber');

        tile.innerHTML = `
          <span class="flap-char">${char === ' ' ? '&nbsp;' : ' '}</span>
          <span class="flap-split"></span>
          <span class="flap-notch-l"></span>
          <span class="flap-notch-r"></span>
        `;
        this.contenedor.appendChild(tile);
        this.tiles.push({
          el: tile,
          charEl: tile.querySelector('.flap-char'),
          destino: char
        });
      }
    }

    voltear(staggerBase = 40) {
      this.tiles.forEach((t, idx) => {
        if (t.destino === ' ') return;
        const totalVueltas = 5 + (idx % 6);
        let contador = 0;

        setTimeout(() => {
          const intervalo = setInterval(() => {
            contador++;
            if (contador >= totalVueltas) {
              clearInterval(intervalo);
              t.charEl.textContent = t.destino;
              t.el.classList.remove('flipping');
              if (idx % 3 === 0) sintetizarClackFlap();
            } else {
              const randChar = ALFABETO_FLAP[Math.floor(Math.random() * (ALFABETO_FLAP.length - 1)) + 1];
              t.charEl.textContent = randChar;
              t.el.classList.add('flipping');
              if (Math.random() < 0.3) sintetizarClackFlap();
            }
          }, 45);
        }, idx * staggerBase);
      });
    }
  }

  let filasFlapInstancias = [];

  function inicializarTablonesSplitFlap() {
    filasFlapInstancias = [];
    document.querySelectorAll('.js-split-flap').forEach((filaEl) => {
      const instancia = new SplitFlapFila(filaEl);
      filasFlapInstancias.push(instancia);

      filaEl.addEventListener('mouseenter', () => {
        instancia.voltear(25);
      });
    });
  }

  function arrancarCascadaTablones() {
    filasFlapInstancias.forEach((instancia, i) => {
      setTimeout(() => {
        instancia.voltear(35);
      }, i * 160);
    });
  }

  // Efecto auditivo y óptico al interactuar con las puertas de embarque
  function configurarInteraccionGates() {
    document.querySelectorAll('.btn-board-gate').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        sonidoEscaneroGate();
      });
    });
  }

  // Alias por si hay un typo previo, lo dejamos funcionando
  function sonidoEscaneroGate(){ sonidoEscanerGate(); }

  /* --------------------------------------------------------------------------
     REVELADO DE TODOS LOS ELEMENTOS DEL VESTÍBULO
     En móvil el IntersectionObserver solo revelaba los elementos que cabían
     en el viewport. Aquí forzamos el revelado de TODOS los [data-reveal] que
     haya dentro del vestíbulo (tablón, 4 puertas, barra inferior) con un
     stagger pequeño para que aparezcan en cascada.
     -------------------------------------------------------------------------- */
  function revelarTodoElVestibulo() {
    const elementos = vestibulo.querySelectorAll('[data-reveal]');
    elementos.forEach((el, i) => {
      // Respetamos el data-retardo original si lo tuviera, y añadimos un
      // pequeño offset por índice para que se vea una cascada ordenada.
      const retardoOriginal = Number(el.dataset.retardo || 0);
      const retardo = retardoOriginal + i * 60;
      setTimeout(() => {
        el.classList.add('revelado');
      }, 200 + retardo);
    });
  }

  /* --------------------------------------------------------------------------
     SECUENCIA CINEMATOGRÁFICA DE APERTURA DE COMPUERTA (ACCESO AL VESTÍBULO)
     -------------------------------------------------------------------------- */
  function ejecutarAperturaPuerta() {
    if (botonAbrir) botonAbrir.classList.add('abriendo');

    if (typeof AudioAeronautico !== 'undefined') {
      AudioAeronautico.tocarWhooshPuerta();
      AudioAeronautico.tocarDingDong();
    }

    if (window.EscenaVentanilla && typeof window.EscenaVentanilla.acelerarVuelo === 'function') {
      window.EscenaVentanilla.acelerarVuelo();
    }

    if (hojaIzq) hojaIzq.style.display = 'block';
    if (hojaDer) hojaDer.style.display = 'block';

    const dur = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.05 : undefined;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        sessionStorage.setItem('martaAirlines:enTerminal', '1');
        window.location.hash = 'terminal';
        revelarVestibulo();
      }
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

    // FIX: revelamos TODO el vestíbulo de golpe (con cascada), no dependemos
    // del IntersectionObserver que en móvil dejaba puertas ocultas.
    // Un pequeño delay para que el navegador pinte el estado "entrando".
    setTimeout(revelarTodoElVestibulo, 100);

    // Arrancamos el cascada del tablón split-flap
    setTimeout(() => {
      arrancarCascadaTablones();
    }, 400);

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* --------------------------------------------------------------------------
     INICIALIZACIÓN AL CARGAR LA PÁGINA
     - Si la URL tiene #terminal o la sesión ya cruzó la puerta, muestra la terminal.
     - Si es visita nueva sin hash, muestra la cabina frente a la ventanilla.
     -------------------------------------------------------------------------- */
  inicializarTablonesSplitFlap();
  configurarInteraccionGates();

  const estaEnTerminal = window.location.hash === '#terminal' || sessionStorage.getItem('martaAirlines:enTerminal') === '1';

  if (estaEnTerminal) {
    revelarVestibulo();
  } else {
    if (window.EscenaVentanilla) window.EscenaVentanilla.init();
    actualizarTinte(0);
    setTimeout(() => escribirMensaje(textoElemento, FRASE_VENTANILLA), 650);
  }

  if (botonAbrir) botonAbrir.addEventListener('click', ejecutarAperturaPuerta);
});
