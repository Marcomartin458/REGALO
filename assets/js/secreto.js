/* ==========================================================================
   SECRETO.JS — Candado VIP con código numérico
   - Modal con teclado numérico en index.html (se abre desde la Puerta C-03).
   - Comprobación de estado en secreto.html (si no está desbloqueado, muestra
     el panel de acceso bloqueado).

   IMPORTANTE: usamos sessionStorage, no localStorage.
   - Durante la navegación entre páginas (index → musica → secreto, etc.) el
     desbloqueo se mantiene, porque sessionStorage persiste mientras la
     pestaña esté abierta.
   - Al cerrar el navegador / pestaña, sessionStorage se borra y la Sala VIP
     vuelve a estar bloqueada la próxima vez.
   ========================================================================== */

const CodigoVIP = (() => {
  const CLAVE = 'martaAirlines:codigoDesbloqueado';
  const CODIGO_CORRECTO = '1422';

  return {
    CLAVE,
    CODIGO_CORRECTO,
    estaDesbloqueado() {
      try { return sessionStorage.getItem(CLAVE) === '1'; } catch (e) { return false; }
    },
    marcarDesbloqueado() {
      try { sessionStorage.setItem(CLAVE, '1'); } catch (e) {}
    },
    reiniciar() {
      try { sessionStorage.removeItem(CLAVE); } catch (e) {}
    }
  };
})();

/* ==========================================================================
   MODAL DEL CANDADO (solo se activa si existe en el DOM)
   ========================================================================== */
function inicializarModalCandado() {
  const overlay = document.getElementById('candado-overlay');
  const botonAbrir = document.querySelector('.js-abrir-candado');
  if (!overlay || !botonAbrir) return;

  const panel = overlay.querySelector('.candado-panel');
  const led = document.getElementById('candado-led');
  const display = document.getElementById('candado-display');
  const digitos = display ? display.querySelectorAll('.digito') : [];
  const errorEl = document.getElementById('candado-error');
  const cerrar = overlay.querySelector('.candado-cerrar');
  const teclas = overlay.querySelectorAll('[data-tecla]');

  let entrada = '';
  let bloqueado = false;

  /* Si ya está desbloqueado en esta sesión, cambiar el botón para que
     navegue directo sin pedir código. */
  function actualizarBotonSegunEstado() {
    if (CodigoVIP.estaDesbloqueado()) {
      botonAbrir.innerHTML =
        '<span class="btn-label">ACCEDER A SALA VIP</span>' +
        '<span class="btn-arrow">&rarr;</span>';
      botonAbrir.classList.remove('js-abrir-candado');
      botonAbrir.classList.add('js-ir-vip');
      botonAbrir.addEventListener('click', () => {
        window.location.href = 'secreto.html';
      });
      return true;
    }
    return false;
  }
  if (actualizarBotonSegunEstado()) return;

  /* --- Abrir / cerrar modal --- */
  function abrirModal() {
    entrada = '';
    bloqueado = false;
    pintarDisplay();
    if (errorEl) errorEl.textContent = '';
    if (led) led.classList.remove('ok', 'error');
    if (display) display.classList.remove('ok');
    overlay.classList.add('abierto');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof AudioAeronautico !== 'undefined') AudioAeronautico.tocarClic();
  }

  function cerrarModal() {
    overlay.classList.remove('abierto');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  botonAbrir.addEventListener('click', abrirModal);
  if (cerrar) cerrar.addEventListener('click', cerrarModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cerrarModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('abierto')) cerrarModal();
  });

  /* --- Pintar display --- */
  function pintarDisplay() {
    digitos.forEach((d, i) => {
      const val = entrada[i] || '';
      d.textContent = val;
      d.classList.toggle('lleno', val !== '');
    });
  }

  /* --- Procesar tecla --- */
  function procesarTecla(tecla) {
    if (bloqueado) return;

    if (tecla === 'borrar') {
      entrada = entrada.slice(0, -1);
      pintarDisplay();
      if (errorEl) errorEl.textContent = '';
      return;
    }

    if (tecla === 'ok') {
      comprobarCodigo();
      return;
    }

    if (/^\d$/.test(tecla) && entrada.length < 4) {
      entrada += tecla;
      pintarDisplay();
      if (typeof AudioAeronautico !== 'undefined') AudioAeronautico.tocarClic();

      if (entrada.length === 4) {
        setTimeout(comprobarCodigo, 180);
      }
    }
  }

  teclas.forEach((btn) => {
    btn.addEventListener('click', () => procesarTecla(btn.dataset.tecla));
  });

  /* --- Comprobar código --- */
  function comprobarCodigo() {
    if (bloqueado) return;

    if (entrada === CodigoVIP.CODIGO_CORRECTO) {
      bloqueado = true;
      if (display) display.classList.add('ok');
      if (led) led.classList.add('ok');
      if (errorEl) errorEl.textContent = 'Acceso concedido. Bienvenida, Marta.';

      CodigoVIP.marcarDesbloqueado();

      if (typeof AudioAeronautico !== 'undefined') {
        AudioAeronautico.tocarDingDong();
      }

      setTimeout(() => {
        window.location.href = 'secreto.html';
      }, 1100);
    } else {
      if (panel) {
        panel.classList.remove('shake');
        void panel.offsetWidth; /* reflow para reiniciar animación */
        panel.classList.add('shake');
      }
      if (led) {
        led.classList.remove('error');
        void led.offsetWidth;
        led.classList.add('error');
      }
      if (errorEl) errorEl.textContent = 'Código incorrecto. Vuelve a intentarlo.';
      entrada = '';
      setTimeout(pintarDisplay, 380);
      setTimeout(() => {
        if (led) led.classList.remove('error');
      }, 1400);
    }
  }
}

/* ==========================================================================
   PANTALLA BLOQUEADA EN secreto.html
   ========================================================================== */
function inicializarPantallaBloqueada() {
  const bloqueadoEl = document.getElementById('secreto-bloqueado');
  const contenidoEl = document.getElementById('secreto-contenido');
  if (!bloqueadoEl || !contenidoEl) return;

  if (CodigoVIP.estaDesbloqueado()) {
    bloqueadoEl.hidden = true;
    contenidoEl.hidden = false;
  } else {
    bloqueadoEl.hidden = false;
    contenidoEl.hidden = true;
  }
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  inicializarModalCandado();
  inicializarPantallaBloqueada();
});