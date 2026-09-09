/* ==========================================================================
   THREE-SCENES.JS — ESCENA 3D ESTRATOSFÉRICA HIPERREALISTA (VUELO DIURNO)
   - Atmósfera Rayleigh/Mie a 35.000 pies (FL350) con sol cegador.
   - Mar de nubes volumétricas dinámicas (undercast continuo) con ruido FBM 3D.
   - Nubes intermedias veloces que transmiten la sensación de 900 km/h.
   - Avión comercial detallado con librea de Marta Airlines y estelas (contrails).
   - Parallax sutil de pasajero sentado en el asiento 23A.
   ========================================================================== */

(function() {
  let escena, camara, renderer;
  let grupoAvion, estelaIzq, estelaDer;
  let matCielo, matNubesMar, nubesCercanas = [];
  let reloj = new THREE.Clock();
  let rafId = null;
  let velocidadVuelo = 1.0;
  let mouseX = 0, mouseY = 0;
  let objetivoCamaraX = 0, objetivoCamaraY = 0.3;

  /* --------------------------------------------------------------------------
     SHADERS GLSL DE PRECISIÓN FÍSICA: CIELO DIURNO ESTRATOSFÉRICO
     -------------------------------------------------------------------------- */
  const VertCielo = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const FragCielo = `
    precision highp float;
    varying vec3 vWorldPosition;
    uniform vec3 uSolDir;
    uniform float uTiempo;

    void main() {
      vec3 dir = normalize(vWorldPosition);
      float y = max(dir.y + 0.08, 0.0);

      // Dispersión atmosférica diurna a 35.000 pies (FL350)
      vec3 colorZenith = vec3(0.04, 0.18, 0.58);   // Azul zafiro puro estratosférico
      vec3 colorMedio  = vec3(0.25, 0.60, 0.96);   // Azul celeste brillante
      vec3 colorHorizonte = vec3(0.88, 0.94, 1.0); // Bruma densa en el horizonte

      vec3 sky = mix(colorHorizonte, colorMedio, pow(y, 0.5));
      sky = mix(sky, colorZenith, smoothstep(0.22, 0.95, y));

      // Sol directo y halo óptico (Mie scattering)
      vec3 sDir = normalize(uSolDir);
      float cosTheta = dot(dir, sDir);
      float discoSol = smoothstep(0.9990, 0.9998, cosTheta);
      float corona = pow(max(cosTheta, 0.0), 16.0) * 1.3;
      float resplandor = pow(max(cosTheta, 0.0), 3.5) * 0.55;

      vec3 colSol = vec3(1.0, 0.98, 0.92);
      vec3 colCorona = vec3(1.0, 0.88, 0.70);

      sky += colSol * discoSol * 6.5;
      sky += colCorona * corona;
      sky += colCorona * resplandor;

      gl_FragColor = vec4(sky, 1.0);
    }
  `;

  /* --------------------------------------------------------------------------
     SHADER GLSL: MAR DE NUBES VOLUMÉTRICAS (UNDERCAST CARPET)
     -------------------------------------------------------------------------- */
  const VertNubes = `
    varying vec2 vUv;
    varying vec3 vPosicion;
    void main() {
      vUv = uv;
      vPosicion = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const FragNubes = `
    precision highp float;
    varying vec2 vUv;
    varying vec3 vPosicion;
    uniform float uTiempo;
    uniform vec3 uSolDir;

    // Hash y ruido cúbico 3D de alta velocidad
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float ruido3D(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
            mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
            mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }

    float fbm(vec3 p) {
      float f = 0.0;
      f += 0.5000 * ruido3D(p); p = p * 2.02;
      f += 0.2500 * ruido3D(p); p = p * 2.03;
      f += 0.1250 * ruido3D(p); p = p * 2.01;
      f += 0.0625 * ruido3D(p);
      return f;
    }

    void main() {
      // Coordenadas con desplazamiento continuo que simula velocidad de crucero
      vec2 st = vUv * vec2(5.0, 6.0);
      vec3 p = vec3(st.x + uTiempo * 0.045, st.y, uTiempo * 0.02);

      float n1 = fbm(p * 1.5);
      float n2 = fbm(p * 3.0 + vec3(2.1, 1.4, 0.5));
      float densidad = smoothstep(0.36, 0.82, n1 * 0.7 + n2 * 0.3);

      // Sombras azuladas bajo los cúmulos y cimas iluminadas por sol diurno
      vec3 sombraCielo = vec3(0.58, 0.70, 0.88);
      vec3 blancoSol = vec3(1.0, 0.99, 0.95);
      vec3 colorNube = mix(sombraCielo, blancoSol, pow(densidad, 0.75) * 1.25);
      colorNube += pow(densidad, 3.0) * vec3(0.18, 0.15, 0.08); // Borde brillante

      float alfa = clamp(densidad * 1.1, 0.0, 0.95);
      // Desvanecimiento suave en los extremos de la ventana
      alfa *= smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

      gl_FragColor = vec4(colorNube, alfa);
    }
  `;

  /* --------------------------------------------------------------------------
     CONSTRUCCIÓN PROCEDURAL DEL AVIÓN COMERCIAL (MARTA AIRLINES)
     -------------------------------------------------------------------------- */
  function construirAvion() {
    const avion = new THREE.Group();

    const matFuselaje = new THREE.MeshStandardMaterial({
      color: 0xf3f6fa,
      metalness: 0.75,
      roughness: 0.22
    });

    const matAlas = new THREE.MeshStandardMaterial({
      color: 0xe0e7ef,
      metalness: 0.55,
      roughness: 0.32
    });

    const matRojoMarta = new THREE.MeshStandardMaterial({
      color: 0xb5221d,
      metalness: 0.4,
      roughness: 0.28
    });

    const matTurbina = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      metalness: 0.9,
      roughness: 0.25
    });

    const matVentanas = new THREE.MeshBasicMaterial({ color: 0x101a2b });

    // Fuselaje cilíndrico aerodinámico
    const cuerpoGeo = new THREE.CylinderGeometry(0.48, 0.48, 5.4, 20);
    cuerpoGeo.rotateZ(Math.PI / 2);
    const cuerpo = new THREE.Mesh(cuerpoGeo, matFuselaje);
    avion.add(cuerpo);

    // Morro cónico afilado
    const morroGeo = new THREE.ConeGeometry(0.48, 1.3, 20);
    morroGeo.rotateZ(-Math.PI / 2);
    const morro = new THREE.Mesh(morroGeo, matFuselaje);
    morro.position.set(3.35, 0, 0);
    avion.add(morro);

    // Parabrisas de cabina de pilotos
    const cockpitGeo = new THREE.BoxGeometry(0.35, 0.16, 0.44);
    const cockpit = new THREE.Mesh(cockpitGeo, matVentanas);
    cockpit.position.set(2.8, 0.22, 0);
    cockpit.rotation.z = -0.32;
    avion.add(cockpit);

    // Fila de ventanillas de pasajeros
    for (let x = -1.8; x <= 1.8; x += 0.28) {
      const v1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.98), matVentanas);
      v1.position.set(x, 0.14, 0);
      avion.add(v1);
    }

    // Franja roja corporativa de Marta Airlines
    const franja = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 0.985), matRojoMarta);
    franja.position.set(0.2, -0.06, 0);
    avion.add(franja);

    // Alas en flecha con diedro
    const alaShape = new THREE.Shape();
    alaShape.moveTo(0, 0);
    alaShape.lineTo(-1.8, -3.9);
    alaShape.lineTo(-2.4, -3.8);
    alaShape.lineTo(-0.9, 0);
    alaShape.closePath();

    const alaExtrude = new THREE.ExtrudeGeometry(alaShape, { depth: 0.06, bevelEnabled: false });
    alaExtrude.rotateX(Math.PI / 2);

    const alaDer = new THREE.Mesh(alaExtrude, matAlas);
    alaDer.position.set(0.5, -0.08, 0);
    avion.add(alaDer);

    const alaIzq = alaDer.clone();
    alaIzq.scale.set(1, 1, -1);
    avion.add(alaIzq);

    // Winglets rojos aerodinámicos
    const wingletGeo = new THREE.BoxGeometry(0.2, 0.55, 0.05);
    const wDer = new THREE.Mesh(wingletGeo, matRojoMarta);
    wDer.position.set(-1.5, 0.28, -3.85);
    wDer.rotation.z = -0.2;
    avion.add(wDer);

    const wIzq = wDer.clone();
    wIzq.position.z = 3.85;
    avion.add(wIzq);

    // Estabilizador vertical de cola (deriva con librea roja)
    const colaGeo = new THREE.BoxGeometry(1.3, 1.6, 0.08);
    colaGeo.rotateZ(0.38);
    const cola = new THREE.Mesh(colaGeo, matRojoMarta);
    cola.position.set(-2.7, 0.95, 0);
    avion.add(cola);

    // Estabilizadores horizontales
    const estabHGeo = new THREE.BoxGeometry(0.9, 0.05, 2.3);
    const estabH = new THREE.Mesh(estabHGeo, matAlas);
    estabH.position.set(-2.8, 0.22, 0);
    avion.add(estabH);

    // Motores Turbofan gemelos bajo las alas
    [-1.45, 1.45].forEach((posZ) => {
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 1.1, 18), matTurbina);
      motor.rotateZ(Math.PI / 2);
      motor.position.set(0.1, -0.48, posZ);
      avion.add(motor);
    });

    avion.scale.setScalar(0.46);
    return avion;
  }

  /* --------------------------------------------------------------------------
     SISTEMA DE ESTELAS DE CONDENSACIÓN (CONTRAILS VOLUMÉTRICAS)
     -------------------------------------------------------------------------- */
  function crearEstela(totalPuntos = 70) {
    const posiciones = new Float32Array(totalPuntos * 3);
    const opacidades = new Float32Array(totalPuntos);
    const puntos = [];

    for (let i = 0; i < totalPuntos; i++) {
      puntos.push(new THREE.Vector3(-100, 0, 0));
      posiciones[i * 3] = -100;
      posiciones[i * 3 + 1] = 0;
      posiciones[i * 3 + 2] = 0;
      opacidades[i] = Math.max(0, 1.0 - (i / totalPuntos));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.38,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });

    const malla = new THREE.Points(geo, mat);
    return { malla, puntos, posiciones, total: totalPuntos };
  }

  function actualizarEstela(estela, posActual) {
    estela.puntos.unshift(posActual.clone());
    estela.puntos.pop();

    for (let i = 0; i < estela.total; i++) {
      const p = estela.puntos[i];
      // Pequeña turbulencia expansiva
      const dispersion = (i / estela.total) * 0.18;
      estela.posiciones[i * 3] = p.x;
      estela.posiciones[i * 3 + 1] = p.y + Math.sin(i * 0.2) * dispersion;
      estela.posiciones[i * 3 + 2] = p.z + Math.cos(i * 0.2) * dispersion;
    }
    estela.malla.geometry.attributes.position.needsUpdate = true;
  }

  /* --------------------------------------------------------------------------
     NUBES CERCANAS EN PERSPECTIVA (CÚMULOS VOLANDO A 900 KM/H)
     -------------------------------------------------------------------------- */
  function crearNubesCercanas(escena) {
    const grupo = new THREE.Group();
    const matNube = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.9,
      depthWrite: false
    });

    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      const numBolas = 5 + Math.floor(Math.random() * 4);
      for (let j = 0; j < numBolas; j++) {
        const r = 0.5 + Math.random() * 0.8;
        const bola = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), matNube);
        bola.position.set(
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.8
        );
        g.add(bola);
      }
      g.position.set(
        -8 + Math.random() * 16,
        -1.8 - Math.random() * 1.2,
        -2.5 - Math.random() * 3.5
      );
      g.userData = { vel: 0.8 + Math.random() * 0.6 };
      grupo.add(g);
      nubesCercanas.push(g);
    }
    escena.add(grupo);
  }

  /* --------------------------------------------------------------------------
     INICIALIZACIÓN DEL MOTOR THREE.JS
     -------------------------------------------------------------------------- */
  function init() {
    const contenedor = document.getElementById('escena-ventanilla');
    if (!contenedor || renderer) return;

    const w = contenedor.clientWidth || 360;
    const h = contenedor.clientHeight || 500;
    const esMovil = window.innerWidth < 768;

    // Renderizador WebGL de alto rendimiento
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, esMovil ? 1.5 : 2.0));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22; // Exposición diurna radiante

    contenedor.innerHTML = '';
    contenedor.appendChild(renderer.domElement);

    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera(42, w / h, 0.1, 200);
    camara.position.set(0, 0.3, 7.6);
    camara.lookAt(0, 0.1, 0);

    // Iluminación solar diurna a gran altitud
    const solDir = new THREE.Vector3(10.0, 14.0, 7.0).normalize();

    const luzSol = new THREE.DirectionalLight(0xfff5e6, 3.4);
    luzSol.position.copy(solDir.clone().multiplyScalar(30));
    escena.add(luzSol);

    const luzCielo = new THREE.AmbientLight(0x7ea8dc, 1.35);
    escena.add(luzCielo);

    // 1. Cúpula de Cielo Diurno Estratosférico
    matCielo = new THREE.ShaderMaterial({
      vertexShader: VertCielo,
      fragmentShader: FragCielo,
      uniforms: {
        uSolDir: { value: solDir },
        uTiempo: { value: 0 }
      },
      side: THREE.BackSide,
      depthWrite: false
    });
    const cieloMalla = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 24), matCielo);
    escena.add(cieloMalla);

    // 2. Mar de Nubes Volumétricas (Undercast carpet)
    matNubesMar = new THREE.ShaderMaterial({
      vertexShader: VertNubes,
      fragmentShader: FragNubes,
      uniforms: {
        uTiempo: { value: 0 },
        uSolDir: { value: solDir }
      },
      transparent: true,
      depthWrite: false
    });
    const planoNubes = new THREE.Mesh(new THREE.PlaneGeometry(42, 38), matNubesMar);
    planoNubes.rotation.x = -Math.PI / 2.25;
    planoNubes.position.set(0, -3.1, -4.0);
    escena.add(planoNubes);

    // 3. Nubes intermedias veloces
    crearNubesCercanas(escena);

    // 4. Avión Comercial de Marta Airlines en crucero
    grupoAvion = construirAvion();
    grupoAvion.position.set(-6.5, 0.75, -2.8);
    grupoAvion.rotation.set(0.08, Math.PI, 0.03);
    escena.add(grupoAvion);

    // 5. Estelas gemelas de condensación
    estelaIzq = crearEstela(70);
    estelaDer = crearEstela(70);
    escena.add(estelaIzq.malla);
    escena.add(estelaDer.malla);

    // Adaptación a cambios de tamaño de ventana
    const ro = new ResizeObserver((entradas) => {
      for (const e of entradas) {
        const width = Math.max(e.contentRect.width, 1);
        const height = Math.max(e.contentRect.height, 1);
        camara.aspect = width / height;
        camara.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    ro.observe(contenedor);

    // Interacción de Parallax con el cursor / toque
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      objetivoCamaraX = mouseX * 0.35;
      objetivoCamaraY = 0.3 + mouseY * 0.25;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        objetivoCamaraX = mouseX * 0.25;
        objetivoCamaraY = 0.3 + mouseY * 0.2;
      }
    }, { passive: true });

    // Bucle de renderizado cinematográfico a 60-120 FPS
    function bucle() {
      rafId = requestAnimationFrame(bucle);
      const delta = reloj.getDelta();
      const t = reloj.getElapsedTime();

      // Actualizar shaders
      matNubesMar.uniforms.uTiempo.value = t * velocidadVuelo;
      matCielo.uniforms.uTiempo.value = t;

      // Desplazamiento de nubes cercanas
      nubesCercanas.forEach((nube) => {
        nube.position.x += nube.userData.vel * delta * 1.8 * velocidadVuelo;
        if (nube.position.x > 9.0) {
          nube.position.x = -9.0;
          nube.position.y = -1.8 - Math.random() * 1.2;
        }
      });

      // Vuelo del avión en la lejanía
      grupoAvion.position.x += 0.85 * delta * velocidadVuelo;
      grupoAvion.position.y = 0.75 + Math.sin(t * 1.1) * 0.08;
      grupoAvion.rotation.z = Math.sin(t * 1.3) * 0.03;
      grupoAvion.rotation.x = 0.08 + Math.cos(t * 0.7) * 0.02;

      // Si el avión cruza el campo de visión, se reinicia suavemente
      if (grupoAvion.position.x > 8.0) {
        grupoAvion.position.x = -8.5;
        for (let i = 0; i < estelaIzq.total; i++) {
          estelaIzq.puntos[i].set(-100, 0, 0);
          estelaDer.puntos[i].set(-100, 0, 0);
        }
      }

      // Emisión de estelas desde ambas turbinas
      const posMotorIzq = new THREE.Vector3(-0.6, -0.22, 0.7).applyMatrix4(grupoAvion.matrixWorld);
      const posMotorDer = new THREE.Vector3(-0.6, -0.22, -0.7).applyMatrix4(grupoAvion.matrixWorld);
      actualizarEstela(estelaIzq, posMotorIzq);
      actualizarEstela(estelaDer, posMotorDer);

      // Inercia de cámara (POV del pasajero)
      camara.position.x += (objetivoCamaraX - camara.position.x) * 0.06;
      camara.position.y += (objetivoCamaraY - camara.position.y) * 0.06;
      camara.lookAt(0, 0.1, 0);

      renderer.render(escena, camara);
    }

    bucle();
  }

  function acelerarVuelo() {
    if (typeof gsap !== 'undefined') {
      gsap.to({ v: velocidadVuelo }, {
        v: 6.0,
        duration: 0.9,
        ease: 'power2.in',
        onUpdate() { velocidadVuelo = this.targets()[0].v; }
      });
    }
  }

  function destruir() {
    if (rafId) cancelAnimationFrame(rafId);
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    }
    renderer = null;
    escena = null;
    camara = null;
  }

  window.EscenaVentanilla = { init, acelerarVuelo, destruir };
})();