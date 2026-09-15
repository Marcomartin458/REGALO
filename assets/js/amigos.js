/* ==========================================================================
   AMIGOS.JS — Control de Fronteras
   - Renderiza visados colectivos (con carrusel en el modal), personal
     especial (diplomáticos + capitanes) y pasaportes individuales.
   - Filtros por país, apertura/cierre de pasaporte (expand in-place,
     sin solapar vecinos), carrusel de fotos individuales.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const panelVisados = document.getElementById('visados-colectivos');
  const filaDiplomatica = document.getElementById('personal-diplomatico');
  const gridPasaportes = document.getElementById('grid-pasaportes');
  const chipsPaises = document.getElementById('chips-paises');
  const modal = document.getElementById('modal-visado');

  if(!gridPasaportes || typeof AMIGOS === 'undefined') return;

  let filtroActivo = 'todos';

  /* ---------------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------------- */
  function hash(texto){
    let h = 0;
    for(let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
    return h;
  }
  function rotacionSello(clave){ return ((hash(clave) % 17) - 8) + 'deg'; }

  function iniciales(nombre){
    return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  function formatearFecha(iso){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return iso || '—';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }

  function generarMRZ(amigo){
    const pais = PAISES[amigo.pais];
    const codigo = (amigo.categoria === 'diplomatico') ? 'DIP'
      : (amigo.categoria === 'capitanes' ? 'CAP'
      : (pais ? pais.codigo : 'ESP'));
    const nombreMRZ = amigo.nombre.toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, '<');
    const linea1 = `P<${codigo}${nombreMRZ}`.padEnd(39, '<').slice(0, 39);
    const numero = (amigo.numeroPasaporte || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().padEnd(9, '<').slice(0, 9);
    const fechaMRZ = (amigo.fechaEmision || '').replace(/-/g, '').slice(2).split('').reverse().join('').padEnd(6, '0').slice(0, 6) || '000000';
    const linea2 = `${numero}${codigo}${fechaMRZ}M${fechaMRZ}${(hash(amigo.id) % 90 + 10)}`.padEnd(39, '<').slice(0, 39);
    return `${linea1}\n${linea2}`;
  }

  function nombrePersona(id){
    const amigo = AMIGOS.find(a => a.id === id);
    if(amigo) return amigo.nombre;
    if(id === 'marta') return 'Marta';
    if(id === 'yo') return 'Yo';
    return id;
  }

  /* ---------------------------------------------------------------
     VISADOS COLECTIVOS
     --------------------------------------------------------------- */
  function renderVisados(){
    if(!panelVisados || typeof GRUPOS_FOTO === 'undefined' || !GRUPOS_FOTO.length){
      if(panelVisados) panelVisados.closest('.seccion-visados')?.setAttribute('hidden', '');
      return;
    }
    panelVisados.innerHTML = GRUPOS_FOTO.map((grupo, i) => {
      const primeraFoto = grupo.fotos[0];
      const numFotos = grupo.fotos.length;
      return `
      <button class="sello-grupal" type="button" data-grupo="${grupo.id}" style="--rot:${rotacionSello(grupo.id)}" data-reveal data-retardo="${i * 80}" aria-label="Ver visado colectivo: ${grupo.pie}">
        <span class="sello-grupal__marco">
          <img src="${primeraFoto.src}" alt="" loading="lazy" onerror="this.style.display='none'">
        </span>
        <span class="sello-grupal__anillo" aria-hidden="true"></span>
        ${numFotos > 1 ? `<span class="sello-grupal__badge">${numFotos} fotos</span>` : ''}
        <span class="sello-grupal__texto">
          <span class="sello-grupal__fecha">${grupo.fecha}</span>
          <span class="sello-grupal__lugar">${grupo.lugar}</span>
        </span>
      </button>`;
    }).join('');

    panelVisados.querySelectorAll('.sello-grupal').forEach(btn => {
      btn.addEventListener('click', () => abrirModalVisado(btn.dataset.grupo));
    });
  }

  /* ---------------------------------------------------------------
     MODAL VISADO COLECTIVO (con carrusel interno)
     --------------------------------------------------------------- */
  function abrirModalVisado(idGrupo){
    const grupo = GRUPOS_FOTO.find(g => g.id === idGrupo);
    if(!grupo || !modal) return;

    const imgPrincipal = modal.querySelector('.modal-visado__img');
    const miniaturasEl = modal.querySelector('.modal-visado__miniaturas');
    imgPrincipal.src = grupo.fotos[0].src;
    imgPrincipal.alt = grupo.fotos[0].pie || grupo.pie;

    if(miniaturasEl){
      if(grupo.fotos.length > 1){
        miniaturasEl.innerHTML = grupo.fotos.map((f, i) => `
          <button class="modal-visado__mini ${i === 0 ? 'activa' : ''}" type="button" data-indice="${i}" aria-label="Foto ${i + 1}">
            <img src="${f.src}" alt="" loading="lazy">
          </button>
        `).join('');
        miniaturasEl.style.display = 'flex';
        miniaturasEl.querySelectorAll('.modal-visado__mini').forEach(mini => {
          mini.addEventListener('click', () => {
            const i = Number(mini.dataset.indice);
            imgPrincipal.src = grupo.fotos[i].src;
            imgPrincipal.alt = grupo.fotos[i].pie || grupo.pie;
            miniaturasEl.querySelectorAll('.modal-visado__mini').forEach(m => m.classList.toggle('activa', m === mini));
          });
        });
      } else {
        miniaturasEl.innerHTML = '';
        miniaturasEl.style.display = 'none';
      }
    }

    modal.querySelector('.modal-visado__fecha').textContent = grupo.fecha;
    modal.querySelector('.modal-visado__lugar').textContent = grupo.lugar;
    modal.querySelector('.modal-visado__personas').textContent = grupo.personas.map(nombrePersona).join(' · ');
    modal.querySelector('.modal-visado__pie').textContent = grupo.pie;

    modal.classList.add('abierto');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModalVisado(){
    if(!modal) return;
    modal.classList.remove('abierto');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if(modal){
    modal.querySelector('.modal-visado__cerrar')?.addEventListener('click', cerrarModalVisado);
    modal.addEventListener('click', (e) => { if(e.target === modal) cerrarModalVisado(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') cerrarModalVisado(); });
  }

  /* ---------------------------------------------------------------
     MARCADO DE PASAPORTE
     --------------------------------------------------------------- */
  function marcadoPasaporte(amigo, indice){
    const pais = PAISES[amigo.pais] || { nombre: 'Desconocido', codigo: '???', color: 'rojo' };
    const esEspecial = amigo.categoria !== 'normal';
    const claseCategoria = `pasaporte--${amigo.categoria}`;
    const colorTapa = esEspecial ? '' : `pasaporte--${pais.color}`;

    let etiquetaTapa, codigoTapa;
    if(amigo.categoria === 'diplomatico'){
      etiquetaTapa = 'PASAPORTE DIPLOMÁTICO';
      codigoTapa = 'DIP';
    } else if(amigo.categoria === 'capitanes'){
      etiquetaTapa = 'PASAPORTE · CAPITANES';
      codigoTapa = 'CAP';
    } else {
      etiquetaTapa = 'PASAPORTE / PASSPORT';
      codigoTapa = pais.codigo;
    }

    // Bloque foto + miniaturas + indicador (va arriba de la columna izquierda)
    const bloqueFoto = `
      <div class="pasaporte__foto">
        <img class="js-foto-principal" src="${amigo.fotos[0].src}" alt="${amigo.nombre}" loading="lazy" onerror="this.parentElement.classList.add('sin-foto')">
        <span class="pasaporte__foto-iniciales">${iniciales(amigo.nombre)}</span>
      </div>
      ${amigo.fotos.length > 1 ? `
        <div class="pasaporte__miniaturas" role="tablist" aria-label="Fotos de ${amigo.nombre}">
          ${amigo.fotos.map((f, i) => `<button class="pasaporte__mini" type="button" role="tab" data-indice="${i}" aria-selected="${i === 0}" aria-label="Foto ${i + 1} de ${amigo.fotos.length}"><img src="${f.src}" alt="" loading="lazy" onerror="this.parentElement.textContent='${i+1}'"></button>`).join('')}
        </div>
        <p class="pasaporte__pagina-indicador"><span class="js-pagina-actual">1</span> de ${amigo.fotos.length}</p>
      ` : ''}
    `;

    const sellos = amigo.sellos.map((s, i) => `
      <div class="sello" style="--rot:${rotacionSello(amigo.id + i)}">
        <span class="sello__cabecera">CONTROL DE FRONTERAS · ${pais.codigo}</span>
        <span class="sello__fecha">${formatearFecha(s.fecha)}</span>
        <p class="sello__texto">${s.texto}</p>
        <span class="sello__firma">Firmado ✕ ${amigo.nombre.split(' ')[0]}</span>
      </div>
    `).join('');

    return `
    <article class="pasaporte ${claseCategoria} ${colorTapa}" data-reveal data-retardo="${indice * 60}" data-id="${amigo.id}">
      <button class="pasaporte__tapa" type="button" aria-expanded="false" aria-label="Abrir pasaporte de ${amigo.nombre}">
        <span class="pasaporte__tapa-escudo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2l7 3v6c0 4.5-3 8-7 11-4-3-7-6.5-7-11V5z"/><path d="M9 12l2 2 4-4"/></svg>
        </span>
        <span class="pasaporte__tapa-titulo">${etiquetaTapa}</span>
        <span class="pasaporte__tapa-codigo">${codigoTapa}</span>
      </button>

      <div class="pasaporte__interior">
        <div class="pasaporte__pagina-izq">
          ${bloqueFoto}
          <h3 class="pasaporte__nombre">${amigo.nombre}</h3>
          <dl class="pasaporte__datos">
            <div><dt>País emisor</dt><dd>${pais.nombre}</dd></div>
            <div><dt>Nº pasaporte</dt><dd>${amigo.numeroPasaporte}</dd></div>
            <div><dt>Emisión</dt><dd>${formatearFecha(amigo.fechaEmision)}</dd></div>
            <div><dt>Asiento</dt><dd>${amigo.asiento}</dd></div>
          </dl>
        </div>

        <div class="pasaporte__pagina-der">
          ${sellos}
        </div>

        <div class="pasaporte__mrz">${generarMRZ(amigo)}</div>
      </div>

      <button class="pasaporte__cerrar" type="button" aria-label="Cerrar pasaporte">✕</button>
    </article>`;
  }

  function enlazarInteracciones(articulo){
    const tapa = articulo.querySelector('.pasaporte__tapa');
    const cerrar = articulo.querySelector('.pasaporte__cerrar');

    function abrir(){
      articulo.classList.add('abierto');
      tapa.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        try{ articulo.scrollIntoView({ behavior: 'smooth', block: 'start' }); }catch(e){}
      }, 120);
    }
    function cerrarPasaporte(){
      articulo.classList.remove('abierto');
      tapa.setAttribute('aria-expanded', 'false');
    }

    tapa.addEventListener('click', abrir);
    if(cerrar) cerrar.addEventListener('click', (e) => { e.stopPropagation(); cerrarPasaporte(); });

    const fotoPrincipal = articulo.querySelector('.js-foto-principal');
    const indicador = articulo.querySelector('.js-pagina-actual');
    articulo.querySelectorAll('.pasaporte__mini').forEach(mini => {
      mini.addEventListener('click', () => {
        const i = Number(mini.dataset.indice);
        const idAmigo = articulo.dataset.id;
        const amigo = AMIGOS.find(a => a.id === idAmigo);
        if(!amigo || !fotoPrincipal) return;
        fotoPrincipal.parentElement.classList.remove('sin-foto');
        fotoPrincipal.src = amigo.fotos[i].src;
        fotoPrincipal.alt = amigo.fotos[i].pie || amigo.nombre;
        if(indicador) indicador.textContent = String(i + 1);
        articulo.querySelectorAll('.pasaporte__mini').forEach(m => m.setAttribute('aria-selected', String(m === mini)));
      });
    });
  }

  /* ---------------------------------------------------------------
     PERSONAL ESPECIAL (diplomáticos + capitanes)
     --------------------------------------------------------------- */
  function renderDiplomaticos(){
    if(!filaDiplomatica) return;
    const especiales = AMIGOS.filter(a => a.categoria !== 'normal');
    if(!especiales.length){
      filaDiplomatica.closest('.seccion-diplomatica')?.setAttribute('hidden', '');
      return;
    }
    filaDiplomatica.innerHTML = especiales.map((a, i) => marcadoPasaporte(a, i)).join('');
    filaDiplomatica.querySelectorAll('.pasaporte').forEach(enlazarInteracciones);
  }

  /* ---------------------------------------------------------------
     PASAPORTES NORMALES + FILTROS
     --------------------------------------------------------------- */
  function renderChips(){
    if(!chipsPaises) return;
    const entradas = Object.entries(PAISES);
    chipsPaises.innerHTML = `<button class="chip ${filtroActivo === 'todos' ? 'activo' : ''}" data-pais="todos" type="button">Todos</button>` +
      entradas.map(([clave, p]) => `<button class="chip ${filtroActivo === clave ? 'activo' : ''}" data-pais="${clave}" type="button">${p.nombre}</button>`).join('');

    chipsPaises.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filtroActivo = chip.dataset.pais;
        renderChips();
        aplicarFiltro();
      });
    });
  }

  function renderPasaportesNormales(){
    const normales = AMIGOS.filter(a => a.categoria === 'normal');
    gridPasaportes.innerHTML = normales.map((a, i) => marcadoPasaporte(a, i)).join('');
    gridPasaportes.querySelectorAll('.pasaporte').forEach(art => {
      const idAmigo = art.dataset.id;
      const amigo = normales.find(a => a.id === idAmigo);
      art.dataset.pais = amigo.pais;
      enlazarInteracciones(art);
    });
    if(typeof inicializarRevelado === 'function') inicializarRevelado();
    else if(typeof configurarRevelado === 'function') configurarRevelado();
  }

  function aplicarFiltro(){
    gridPasaportes.querySelectorAll('.pasaporte').forEach(art => {
      const visible = filtroActivo === 'todos' || art.dataset.pais === filtroActivo;
      art.classList.toggle('oculto', !visible);
    });
  }

  /* ---------------------------------------------------------------
     INICIO
     --------------------------------------------------------------- */
  renderVisados();
  renderDiplomaticos();
  renderChips();
  renderPasaportesNormales();
  aplicFiltroSafe();

  function aplicFiltroSafe(){ aplicarFiltro(); }

  if(typeof inicializarRevelado !== 'function' && typeof configurarRevelado !== 'function'){
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revelado'));
  }
});