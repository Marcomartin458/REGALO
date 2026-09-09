/* ==========================================================================
   AMIGOS.JS — puertas de embarque por grupo + tarjetas de amigos
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const contenedorPuertas = document.getElementById('puertas-embarque');
  const contenedorChips = document.getElementById('chips-grupos');
  const contenedorGrid = document.getElementById('grid-amigos');
  const tituloGrupo = document.getElementById('titulo-grupo-activo');
  if(!contenedorPuertas || typeof GRUPOS_AMIGOS === 'undefined') return;

  let grupoActivo = GRUPOS_AMIGOS[0]?.id || null;

  function iniciales(nombre){
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  function pintarBarcode(){
    const barras = Array.from({ length: 24 }, () => Math.random() * 18 + 6);
    return barras.map(alto => `<i style="height:${alto}px"></i>`).join('');
  }

  function renderPuertas(){
    contenedorPuertas.innerHTML = GRUPOS_AMIGOS.map(grupo => `
      <button class="puerta-emb ${grupo.id === grupoActivo ? 'activa' : ''}" data-grupo="${grupo.id}" type="button">
        <div class="puerta-emb__num">${grupo.puerta}</div>
        <div class="puerta-emb__nombre">${grupo.nombre}</div>
        <div class="puerta-emb__contador">${grupo.amigos.length} embarcando</div>
      </button>
    `).join('');

    contenedorPuertas.querySelectorAll('.puerta-emb').forEach(btn => {
      btn.addEventListener('click', () => {
        grupoActivo = btn.dataset.grupo;
        actualizar();
      });
    });
  }

  function renderChips(){
    if(!contenedorChips) return;
    contenedorChips.innerHTML = `<button class="chip ${grupoActivo === 'todos' ? 'activo' : ''}" data-grupo="todos" type="button">Todos</button>` +
      GRUPOS_AMIGOS.map(g => `<button class="chip ${g.id === grupoActivo ? 'activo' : ''}" data-grupo="${g.id}" type="button">${g.nombre}</button>`).join('');

    contenedorChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        grupoActivo = chip.dataset.grupo;
        actualizar();
      });
    });
  }

  function renderGrid(){
    const grupos = grupoActivo === 'todos' ? GRUPOS_AMIGOS : GRUPOS_AMIGOS.filter(g => g.id === grupoActivo);
    const amigosAMostrar = grupos.flatMap(g => g.amigos.map(a => ({ ...a, grupo: g.nombre })));

    if(tituloGrupo){
      tituloGrupo.textContent = grupoActivo === 'todos'
        ? 'Todos los pasajeros'
        : (GRUPOS_AMIGOS.find(g => g.id === grupoActivo)?.nombre || '');
    }

    contenedorGrid.innerHTML = amigosAMostrar.map((amigo, i) => `
      <article class="pase pase-amigo" data-reveal data-retardo="${i * 60}" style="--muesca-top:64px;">
        <div class="pase__cabecera">
          <div class="pase__foto">${amigo.foto ? `<img src="${amigo.foto}" alt="${amigo.nombre}" loading="lazy" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : iniciales(amigo.nombre)}</div>
          <div>
            <div class="pase__eyebrow">${amigo.grupo}</div>
            <div class="pase__titulo">${amigo.nombre}</div>
            <div class="pase__asiento">Asiento ${amigo.asiento}</div>
          </div>
        </div>
        <div class="pase__cuerpo">
          <p class="pase__mensaje">${amigo.mensaje}</p>
          <button class="leer-mas" type="button">Leer más</button>
          <div class="barcode" aria-hidden="true">${pintarBarcode()}</div>
        </div>
      </article>
    `).join('');

    contenedorGrid.querySelectorAll('.pase-amigo').forEach(tarjeta => {
      const boton = tarjeta.querySelector('.leer-mas');
      boton.addEventListener('click', () => {
        const expandido = tarjeta.classList.toggle('expandido');
        boton.textContent = expandido ? 'Leer menos' : 'Leer más';
      });
    });

    if(typeof inicializarRevelado === 'function') inicializarRevelado();
  }

  function actualizar(){
    renderPuertas();
    renderChips();
    renderGrid();
  }

  actualizar();
});