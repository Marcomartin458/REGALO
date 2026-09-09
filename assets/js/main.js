/* ==========================================================================
   MAIN.JS — UTILIDADES COMPARTIDAS, AUDIO SINTETIZADO Y NAVEGACIÓN
   ========================================================================== */

/* CONTROL DE ESTADOS DE NAVEGACIÓN */
const Progreso = {
  CLAVE_SECRETO: 'martaAirlines:codigoDesbloqueado',

  estaSecretoDesbloqueado() {
    return localStorage.getItem(this.CLAVE_SECRETO) === '1';
  },
  marcarSecretoDesbloqueado() {
    try { localStorage.setItem(this.CLAVE_SECRETO, '1'); } catch(e){}
  }
};

/* SINTETIZADOR DE AUDIO WEBAUDIO (AERONÁUTICO Y AUTÓNOMO) */
const AudioAeronautico = (() => {
  let ctx = null;

  function obtenerContexto() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  return {
    // Doble aviso "Ding-Dong" de llamada en cabina de pasajeros
    tocarDingDong() {
      const c = obtenerContexto();
      if (!c) return;

      const ahora = c.currentTime;
      const tonos = [
        { freq: 659.25, inicio: 0, dur: 0.8 },     // Mi (E5)
        { freq: 523.25, inicio: 0.32, dur: 1.1 }   // Do (C5)
      ];

      tonos.forEach(nota => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(nota.freq, ahora + nota.inicio);

        gain.gain.setValueAtTime(0, ahora + nota.inicio);
        gain.gain.linearRampToValueAtTime(0.18, ahora + nota.inicio + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ahora + nota.inicio + nota.dur);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(ahora + nota.inicio);
        osc.stop(ahora + nota.inicio + nota.dur);
      });
    },

    // Despresurización y apertura neumática de compuerta
    tocarWhooshPuerta() {
      const c = obtenerContexto();
      if (!c) return;

      const bufferSize = c.sampleRate * 0.75;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const ruido = c.createBufferSource();
      ruido.buffer = buffer;

      const filtro = c.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.setValueAtTime(260, c.currentTime);
      filtro.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.35);
      filtro.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.75);

      const gain = c.createGain();
      gain.gain.setValueAtTime(0.001, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, c.currentTime + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.75);

      ruido.connect(filtro);
      filtro.connect(gain);
      gain.connect(c.destination);

      ruido.start();
    },

    // Clic mecánico sutil de botón
    tocarClic() {
      const c = obtenerContexto();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, c.currentTime);
      gain.gain.setValueAtTime(0.08, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.07);
    }
  };
})();

/* NAVBAR SCROLL & COMPORTAMIENTO MÓVIL */
function configurarNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const hamburguesa = nav.querySelector('.hamburguesa');
  const enlaces = nav.querySelector('.nav-enlaces');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('encogida', window.scrollY > 30);
  }, { passive: true });

  if (hamburguesa && enlaces) {
    hamburguesa.addEventListener('click', () => {
      const abierta = enlaces.classList.toggle('abierta');
      hamburguesa.classList.toggle('abierta', abierta);
      hamburguesa.setAttribute('aria-expanded', String(abierta));
      AudioAeronautico.tocarClic();
    });

    enlaces.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        enlaces.classList.remove('abierta');
        hamburguesa.classList.remove('abierta');
      });
    });
  }

  // Detección de página activa
  const actual = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a[data-pagina]').forEach(enlace => {
    if (enlace.dataset.pagina === actual) enlace.classList.add('activo');
  });
}

/* LENIS SMOOTH SCROLLING (INERCIA CÓMODA) */
function configurarLenis() {
  if (typeof Lenis === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: t => 1 - Math.pow(1 - t, 3.5),
    smoothWheel: true,
    touchMultiplier: 1.15
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

/* REVELADO POR SCROLL (INTERSECTION OBSERVER) */
function configurarRevelado() {
  const elems = document.querySelectorAll('[data-reveal]');
  if (!elems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.retardo || 0);
        setTimeout(() => {
          entry.target.classList.add('revelado');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  elems.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  configurarNavbar();
  configurarLenis();
  configurarRevelado();

  // Retroalimentación auditiva en botones
  document.querySelectorAll('button, .btn-embarcar').forEach(btn => {
    btn.addEventListener('click', () => AudioAeronautico.tocarClic());
  });
});