// Backdrop for the site: a flight through space. Twinkling stars of several
// kinds, drifting nebulae, three planetary systems and the odd shooting star.
// Scrolling the page flies the camera forward. Background only; nothing here
// carries content. `npm run build:site` bundles this with three.js into
// ../assets/backdrop.js.
//
// The suns, planets and rings are drawn with small procedural shaders (noise
// for surfaces, light from the system's own sun), so no image files are needed.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from "three";

const SPACE = 0x070f3a; // matches --space in main.css
const FOV = 42; // narrow enough that spheres near the screen edge stay round
const TRAVEL = 150; // how far the camera flies over the whole page
const DEPTH_NEAR = 30;
const DEPTH_FAR = -250;
const SYSTEM_SCALE = 1.4;

const root = document.documentElement;
const canvas = document.getElementById("backdrop");

// ───────── Shaders ─────────

const STAR_VERTEX = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute vec2 aTwinkle; // phase, speed
  uniform float uTime;
  uniform float uScale;
  uniform float uMinSize;
  uniform float uMaxSize;
  uniform float uCamZ;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSpike;
  void main() {
    // Stars wrap around in depth so the sky is as full at the bottom of the
    // page as at the top.
    vec3 at = position;
    float front = uCamZ + 20.0;
    at.z = front - mod(front - position.z, 280.0);
    vec4 mv = modelViewMatrix * vec4(at, 1.0);
    float dist = max(-mv.z, 0.001);
    float twinkle = 0.7 + 0.3 * sin(uTime * aTwinkle.y + aTwinkle.x);
    float px = aSize * uScale / dist;
    gl_PointSize = clamp(px, uMinSize, uMaxSize);
    // Stars too small for a pixel dim instead of vanishing; stars about to
    // pass the camera fade out instead of popping.
    float tiny = px < uMinSize ? max(px / uMinSize, 0.35) : 1.0;
    vAlpha = twinkle * tiny * smoothstep(1.5, 10.0, dist);
    vSpike = step(0.62, aSize);
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSpike;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float d = length(p);
    float core = 1.0 - smoothstep(0.0, 0.35, d);
    float glow = pow(max(0.0, 1.0 - d), 2.5) * 0.55;
    float rays = max(0.0, 1.0 - abs(p.x) * 18.0) + max(0.0, 1.0 - abs(p.y) * 18.0);
    float spike = vSpike * rays * max(0.0, 1.0 - d) * 0.7;
    float a = (core + glow + spike) * vAlpha;
    gl_FragColor = vec4(vColor * a, 1.0);
  }
`;

const PLANE_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NOISE_2D = `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
`;

const NEBULA_FRAGMENT = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uAlpha;
  uniform vec3 uA;
  uniform vec3 uB;
  varying vec2 vUv;
  ${NOISE_2D}
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p = p * 2.03 + 11.7;
      amp *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float mask = 1.0 - smoothstep(0.15, 1.0, length(p));
    // Nothing to add outside the cloud: skip the noise.
    if (mask <= 0.0 || uAlpha <= 0.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    vec2 q = p * 1.6 + uSeed;
    float n = fbm(q + vec2(uTime * 0.012, -uTime * 0.008));
    float n2 = fbm(q * 2.1 - n * 1.3 + uSeed * 2.0);
    float density = smoothstep(0.35, 0.95, n * 0.65 + n2 * 0.55);
    float a = density * mask * uAlpha;
    gl_FragColor = vec4(mix(uA, uB, n2) * a, 1.0);
  }
`;

// Shared by the sun, planet and ring shaders.
const BODY_VERTEX = `
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vObj = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const NOISE_3D = `
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419)); // uneven offsets: no mirrored surfaces
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i), hash3(i + vec3(1.0, 0.0, 0.0)), u.x),
          mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
      mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), u.x),
          mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y),
      u.z
    );
  }
  float fbm3(vec3 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise3(p);
      p = p * 2.02 + 7.3;
      amp *= 0.5;
    }
    return v;
  }
`;

// A star's surface: slow boiling granulation, darker toward the limb.
const SUN_FRAGMENT = `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uDeep;
  uniform vec3 uHot;
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vWorld;
  ${NOISE_3D}
  void main() {
    vec3 p = normalize(vObj);
    float cells = fbm3(p * 5.0 + uSeed + vec3(0.0, uTime * 0.04, 0.0));
    float grain = fbm3(p * 13.0 + uSeed - vec3(uTime * 0.06, 0.0, 0.0));
    float heat = cells * 0.65 + grain * 0.5;
    vec3 col = mix(uDeep, uHot, smoothstep(0.3, 0.85, heat));
    float facing = max(dot(normalize(vNormal), normalize(cameraPosition - vWorld)), 0.0);
    col *= mix(0.5, 1.3, pow(facing, 0.45));
    gl_FragColor = vec4(col, 1.0);
  }
`;

// The glow around a star, drawn on a camera-facing plane.
const CORONA_FRAGMENT = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  ${NOISE_2D}
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r >= 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    // Sample noise around a circle, so the streaks join up with no seam.
    vec2 around = p / max(r, 0.0001);
    float streak = noise(around * 1.5 + vec2(uTime * 0.08, 3.1)) * 0.6 + noise(around * 3.5 + vec2(-uTime * 0.05, 7.7)) * 0.4;
    float glow = exp(-r * 7.0) * 1.6 + pow(1.0 - r, 3.0) * (0.25 + 0.45 * streak);
    gl_FragColor = vec4(uColor * glow, 1.0);
  }
`;

// uKind: 0 rock, 1 gas giant, 2 ocean world. Lit by the system's sun, with a
// soft day/night line and a thin glow of atmosphere at the edge.
const PLANET_FRAGMENT = `
  uniform int uKind;
  uniform float uSeed;
  uniform float uTime;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  uniform vec3 uAtmo;
  uniform vec3 uSun;
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vWorld;
  ${NOISE_3D}
  void main() {
    vec3 p = normalize(vObj);
    vec3 s = p + uSeed;
    vec3 col;
    float shine = 0.0;
    if (uKind == 0) {
      float height = fbm3(s * 3.0);
      float patches = fbm3(s * 9.0);
      col = mix(uC1, uC2, smoothstep(0.3, 0.7, height));
      col = mix(col, uC3, smoothstep(0.55, 0.8, patches) * 0.6);
      col *= 0.75 + 0.5 * fbm3(s * 22.0);
    } else if (uKind == 1) {
      float warp = fbm3(s * vec3(2.0, 6.0, 2.0)) * 1.6;
      float band = sin(p.y * 11.0 + warp * 3.0 + uSeed);
      float fine = fbm3(vec3(s.x * 3.0, p.y * 26.0 + warp * 2.0, s.z * 3.0));
      col = mix(uC1, uC2, smoothstep(-0.6, 0.6, band));
      col = mix(col, uC3, smoothstep(0.5, 0.85, fine) * 0.7);
    } else {
      float height = fbm3(s * 2.6);
      float land = smoothstep(0.5, 0.56, height);
      col = mix(uC1, mix(uC2, uC3, smoothstep(0.56, 0.75, height)), land);
      float ice = smoothstep(0.72, 0.86, abs(p.y) + (height - 0.5) * 0.25);
      col = mix(col, vec3(0.93, 0.96, 1.0), ice);
      float clouds = smoothstep(0.52, 0.75, fbm3(s * 4.5 + vec3(uTime * 0.01, 0.0, 0.0)));
      col = mix(col, vec3(1.0), clouds * 0.75);
      shine = (1.0 - land) * (1.0 - clouds);
    }
    vec3 n = normalize(vNormal);
    vec3 toSun = normalize(uSun - vWorld);
    vec3 toEye = normalize(cameraPosition - vWorld);
    float facing = dot(n, toSun);
    float day = smoothstep(-0.12, 0.35, facing);
    vec3 lit = col * (0.04 + day * 1.05);
    lit += shine * pow(max(dot(reflect(-toSun, n), toEye), 0.0), 40.0) * 0.6 * day;
    float rim = pow(1.0 - max(dot(n, toEye), 0.0), 2.5);
    lit += uAtmo * rim * (0.15 + 0.85 * smoothstep(-0.3, 0.4, facing));
    gl_FragColor = vec4(lit, 1.0);
  }
`;

// Planetary rings: thin bands with a gap, see-through.
const RING_FRAGMENT = `
  uniform float uSeed;
  uniform float uInner;
  uniform float uOuter;
  uniform vec3 uColor;
  varying vec3 vObj;
  ${NOISE_2D}
  void main() {
    float t = (length(vObj.xy) - uInner) / (uOuter - uInner);
    // Broad bands with finer ones inside them, like a sheet of dust and ice.
    float bands = 0.55 * noise(vec2(t * 7.0 + uSeed, uSeed)) + 0.45 * noise(vec2(t * 31.0 + uSeed * 2.0, uSeed));
    float edges = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.94, 1.0, t));
    float gap = 1.0 - (smoothstep(0.56, 0.59, t) - smoothstep(0.62, 0.65, t)) * 0.9;
    gl_FragColor = vec4(uColor * (0.6 + 0.4 * bands), (0.35 + 0.65 * bands) * edges * gap * 0.85);
  }
`;

// ───────── What is in the sky ─────────
// Colours are written the way they should appear on screen (0 to 1).

const SYSTEMS = [
  {
    // A yellow star like the Sun. Orbits are kept short so the giant never
    // swings across the camera's path.
    at: [4, -15, -62],
    tilt: 1.15,
    roll: 0.35,
    sun: { radius: 1.5, deep: [0.95, 0.42, 0.05], hot: [1.0, 0.95, 0.7], corona: [1.0, 0.72, 0.3] },
    planets: [
      { kind: 0, radius: 0.3, orbit: 3.2, c: [[0.42, 0.36, 0.32], [0.62, 0.55, 0.48], [0.25, 0.22, 0.2]], atmo: [0.25, 0.2, 0.16] },
      { kind: 2, radius: 0.48, orbit: 5.2, c: [[0.04, 0.16, 0.42], [0.16, 0.4, 0.16], [0.5, 0.42, 0.28]], atmo: [0.3, 0.55, 1.0], lean: 0.4 },
      {
        kind: 1, radius: 1.0, orbit: 7.8, c: [[0.78, 0.64, 0.46], [0.56, 0.4, 0.27], [0.9, 0.82, 0.7]], atmo: [0.75, 0.6, 0.42], lean: 0.45,
        ring: { inner: 1.35, outer: 2.3, color: [0.82, 0.74, 0.62] },
      },
    ],
  },
  {
    // A small red dwarf with a scorched inner world.
    at: [15, 6, -108],
    tilt: 1.3,
    roll: -0.5,
    sun: { radius: 1.0, deep: [0.6, 0.06, 0.03], hot: [1.0, 0.56, 0.3], corona: [1.0, 0.32, 0.2] },
    belt: 5.4,
    planets: [
      { kind: 0, radius: 0.34, orbit: 3.0, c: [[0.16, 0.1, 0.09], [0.36, 0.14, 0.08], [0.95, 0.4, 0.1]], atmo: [0.8, 0.3, 0.12] },
      { kind: 1, radius: 0.8, orbit: 8.2, c: [[0.42, 0.3, 0.62], [0.24, 0.17, 0.42], [0.72, 0.62, 0.88]], atmo: [0.6, 0.45, 0.95], lean: 0.25 },
    ],
  },
  {
    // A hot blue-white star with an ice world and a ringed giant.
    at: [-12, -7, -185],
    tilt: 0.95,
    roll: 0.8,
    sun: { radius: 1.7, deep: [0.3, 0.52, 1.0], hot: [0.95, 0.98, 1.0], corona: [0.45, 0.7, 1.0] },
    planets: [
      { kind: 0, radius: 0.36, orbit: 4.0, c: [[0.5, 0.26, 0.16], [0.68, 0.4, 0.24], [0.32, 0.17, 0.12]], atmo: [0.65, 0.4, 0.3] },
      { kind: 2, radius: 0.5, orbit: 6.8, c: [[0.5, 0.74, 0.86], [0.82, 0.9, 0.95], [0.95, 0.98, 1.0]], atmo: [0.6, 0.85, 1.0], lean: 0.3 },
      {
        kind: 1, radius: 0.9, orbit: 11.0, c: [[0.2, 0.55, 0.6], [0.11, 0.36, 0.45], [0.62, 0.86, 0.84]], atmo: [0.35, 0.82, 0.86], lean: 0.6,
        ring: { inner: 1.4, outer: 2.1, color: [0.62, 0.8, 0.84] },
      },
    ],
  },
];

function start() {
  if (!canvas) return;

  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedQuery.matches;
  const small = window.matchMedia("(max-width: 860px)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: (window.devicePixelRatio || 1) < 2, alpha: false });
  } catch (err) {
    root.classList.add("no-gl");
    return;
  }
  renderer.setClearColor(SPACE, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 320);

  let seed = 20261111;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const between = (lo, hi) => lo + (hi - lo) * rand();

  // Every shader material that animates shares this one time value.
  const time = { value: 0 };

  // ── Stars ──
  const starCount = small ? 1300 : 2600;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const colors = new Float32Array(starCount * 3);
  const twinkles = new Float32Array(starCount * 2);
  const palette = [
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [0.72, 0.82, 1.0], // blue-white
    [0.72, 0.82, 1.0],
    [1.0, 0.86, 0.45], // yellow
    [1.0, 0.68, 0.5], // orange
    [1.0, 0.62, 0.82], // pink
    [0.55, 0.95, 0.95], // teal
  ];
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = between(-110, 110);
    positions[i * 3 + 1] = between(-80, 80);
    positions[i * 3 + 2] = between(DEPTH_FAR, DEPTH_NEAR);
    const r = rand();
    sizes[i] = 0.1 + r * r * r * 0.85;
    colors.set(palette[Math.floor(rand() * palette.length)], i * 3);
    twinkles[i * 2] = rand() * Math.PI * 2;
    twinkles[i * 2 + 1] = between(0.5, 2.6);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new BufferAttribute(positions, 3));
  starGeometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  starGeometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  starGeometry.setAttribute("aTwinkle", new BufferAttribute(twinkles, 2));
  const starMaterial = new ShaderMaterial({
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    uniforms: {
      uTime: time,
      uScale: { value: 1 },
      uMinSize: { value: 1.5 },
      uMaxSize: { value: 96 },
      uCamZ: { value: 0 },
    },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const stars = new Points(starGeometry, starMaterial);
  stars.frustumCulled = false;
  scene.add(stars);

  // ── Nebulae ──
  const nebulaSpecs = [
    { at: [-38, 18, -95], size: 170, a: [0.16, 0.32, 1.0], b: [0.5, 0.25, 1.0], alpha: 0.5 },
    { at: [46, -22, -150], size: 210, a: [0.05, 0.6, 0.75], b: [0.16, 0.32, 1.0], alpha: 0.42 },
    { at: [10, 34, -215], size: 240, a: [0.85, 0.2, 0.6], b: [0.5, 0.25, 1.0], alpha: 0.4 },
    { at: [-52, -30, -230], size: 230, a: [0.16, 0.32, 1.0], b: [0.05, 0.6, 0.75], alpha: 0.45 },
    { at: [30, 6, -265], size: 200, a: [1.0, 0.7, 0.25], b: [0.85, 0.2, 0.6], alpha: 0.3 },
  ].filter((_, i) => !small || i === 0 || i === 1 || i === 3); // phones get three, spread along the route
  const plane = new PlaneGeometry(1, 1);
  const nebulae = nebulaSpecs.map((spec, i) => {
    const material = new ShaderMaterial({
      vertexShader: PLANE_VERTEX,
      fragmentShader: NEBULA_FRAGMENT,
      uniforms: {
        uTime: time,
        uSeed: { value: 3.7 + i * 5.3 },
        uAlpha: { value: spec.alpha },
        uA: { value: spec.a },
        uB: { value: spec.b },
      },
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new Mesh(plane, material);
    mesh.position.set(spec.at[0], spec.at[1], spec.at[2]);
    mesh.scale.set(spec.size, spec.size, 1);
    mesh.renderOrder = -1;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { mesh, material, z: spec.at[2], alpha: spec.alpha };
  });

  // ── Planetary systems ──
  const ball = new SphereGeometry(1, small ? 32 : 48, small ? 20 : 32);
  // A soft round dot for asteroids, so they are not drawn as squares.
  // If the browser cannot give a 2D canvas, asteroids fall back to squares.
  let dotTexture = null;
  const dot = document.createElement("canvas");
  dot.width = dot.height = 32;
  const ink = dot.getContext("2d");
  if (ink) {
    const fade = ink.createRadialGradient(16, 16, 0, 16, 16, 16);
    fade.addColorStop(0, "rgba(255,255,255,1)");
    fade.addColorStop(0.5, "rgba(255,255,255,0.9)");
    fade.addColorStop(1, "rgba(255,255,255,0)");
    ink.fillStyle = fade;
    ink.fillRect(0, 0, 32, 32);
    dotTexture = new CanvasTexture(dot);
  }
  const spinning = []; // planets turning on their own axis
  const orbiting = []; // planets going round their sun
  const belts = [];
  const systems = SYSTEMS.map((spec, index) => {
    const group = new Group();
    group.position.set(spec.at[0], spec.at[1], spec.at[2]);
    group.rotation.set(spec.tilt, 0, spec.roll);
    group.scale.setScalar(SYSTEM_SCALE);

    const sun = new Mesh(
      ball,
      new ShaderMaterial({
        vertexShader: BODY_VERTEX,
        fragmentShader: SUN_FRAGMENT,
        uniforms: { uTime: time, uSeed: { value: 0.9 + index * 6.7 }, uDeep: { value: spec.sun.deep }, uHot: { value: spec.sun.hot } },
      })
    );
    sun.scale.setScalar(spec.sun.radius);
    group.add(sun);
    spinning.push({ mesh: sun, speed: 0.03 });

    // The corona is not a child of the tilted group: it must face the camera.
    const corona = new Mesh(
      plane,
      new ShaderMaterial({
        vertexShader: PLANE_VERTEX,
        fragmentShader: CORONA_FRAGMENT,
        uniforms: { uTime: time, uColor: { value: spec.sun.corona } },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    corona.scale.setScalar(spec.sun.radius * 9 * SYSTEM_SCALE);
    corona.position.copy(group.position);
    scene.add(corona);

    spec.planets.forEach((p, n) => {
      // holder: position on the orbit and axial lean. The planet spins inside it.
      const holder = new Group();
      holder.rotation.z = p.lean || 0;
      holder.scale.setScalar(p.radius);
      const planet = new Mesh(
        ball,
        new ShaderMaterial({
          vertexShader: BODY_VERTEX,
          fragmentShader: PLANET_FRAGMENT,
          uniforms: {
            uKind: { value: p.kind },
            uSeed: { value: 1.7 + index * 9.1 + n * 4.3 },
            uTime: time,
            uC1: { value: p.c[0] },
            uC2: { value: p.c[1] },
            uC3: { value: p.c[2] },
            uAtmo: { value: p.atmo },
            uSun: { value: group.position }, // live: follows the group when it moves
          },
        })
      );
      holder.add(planet);
      spinning.push({ mesh: planet, speed: between(0.08, 0.2) });
      if (p.ring) {
        const ring = new Mesh(
          new RingGeometry(p.ring.inner, p.ring.outer, 96, 1),
          new ShaderMaterial({
            vertexShader: BODY_VERTEX,
            fragmentShader: RING_FRAGMENT,
            uniforms: {
              uSeed: { value: 2.3 + index * 3.1 },
              uInner: { value: p.ring.inner },
              uOuter: { value: p.ring.outer },
              uColor: { value: p.ring.color },
            },
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
          })
        );
        ring.rotation.x = Math.PI / 2; // into the planet's equatorial plane
        holder.add(ring);
      }
      group.add(holder);
      // Outer planets move slower, roughly as real orbits do.
      orbiting.push({ holder, radius: p.orbit, angle: rand() * Math.PI * 2, speed: 0.16 * Math.pow(3.2 / p.orbit, 1.5) });
    });

    if (spec.belt) {
      const count = small ? 140 : 280;
      const rocks = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = rand() * Math.PI * 2;
        const r = spec.belt + between(-0.7, 0.7);
        rocks[i * 3] = Math.cos(a) * r;
        rocks[i * 3 + 1] = between(-0.12, 0.12);
        rocks[i * 3 + 2] = Math.sin(a) * r;
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(rocks, 3));
      const belt = new Points(
        geometry,
        new PointsMaterial({ color: 0xb8a898, map: dotTexture, size: 0.3, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false })
      );
      group.add(belt);
      belts.push(belt);
    }

    scene.add(group);
    return { group, corona, x: spec.at[0], y: spec.at[1], z: spec.at[2] };
  });
  const moveBodies = (dt) => {
    for (const body of orbiting) {
      body.angle += body.speed * dt;
      body.holder.position.set(Math.cos(body.angle) * body.radius, 0, Math.sin(body.angle) * body.radius);
    }
    for (const body of spinning) body.mesh.rotation.y += body.speed * dt;
    for (const belt of belts) belt.rotation.y += 0.02 * dt;
  };

  // ── Shooting stars ──
  const shooters = [];
  for (let i = 0; i < 3; i++) {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(6), 3));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(6), 3));
    const line = new Line(
      geometry,
      new LineBasicMaterial({ vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false })
    );
    line.frustumCulled = false;
    line.visible = false;
    scene.add(line);
    shooters.push({ line, geometry, age: 0, life: 0, x: 0, y: 0, z: 0, dx: 0, dy: 0 });
  }
  let nextShooter = 1.5;
  const updateShooters = (dt, cameraZ) => {
    nextShooter -= dt;
    if (nextShooter <= 0) {
      nextShooter = between(1.8, 5);
      const free = shooters.find((s) => !s.line.visible);
      if (free) {
        const dir = rand() < 0.5 ? -1 : 1;
        free.age = 0;
        free.life = between(0.7, 1.1);
        free.x = between(-24, 24) * Math.min(1, camera.aspect);
        free.y = between(4, 22);
        free.z = cameraZ - between(38, 55);
        free.dx = dir * between(26, 38);
        free.dy = -between(10, 20);
        free.line.visible = true;
      }
    }
    for (const s of shooters) {
      if (!s.line.visible) continue;
      s.age += dt;
      if (s.age >= s.life) {
        s.line.visible = false;
        continue;
      }
      const hx = s.x + s.dx * s.age;
      const hy = s.y + s.dy * s.age;
      const tail = Math.min(s.age, 0.22);
      const pos = s.geometry.attributes.position.array;
      pos[0] = hx;
      pos[1] = hy;
      pos[2] = s.z;
      pos[3] = hx - s.dx * tail;
      pos[4] = hy - s.dy * tail;
      pos[5] = s.z;
      const fade = 1 - s.age / s.life;
      const col = s.geometry.attributes.color.array;
      col[0] = col[1] = col[2] = fade; // head; the tail stays black, which adds nothing
      s.geometry.attributes.position.needsUpdate = true;
      s.geometry.attributes.color.needsUpdate = true;
    }
  };

  const smooth = (v) => {
    const c = Math.min(1, Math.max(0, v));
    return c * c * (3 - 2 * c);
  };

  let target = 0; // scroll progress, 0 at the top and 1 at the bottom
  let progress = 0;
  let clock = 0;
  let pointerX = 0;
  let pointerY = 0;
  let driftX = 0;
  let driftY = 0;

  const readScroll = () => {
    const room = document.documentElement.scrollHeight - window.innerHeight;
    target = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0;
  };

  const frame = (dt) => {
    if (reduced) {
      progress = target;
    } else {
      clock += dt;
      progress += (target - progress) * (1 - Math.exp(-dt * 4));
      if (Math.abs(target - progress) < 0.0003) progress = target;
      driftX += (pointerX - driftX) * (1 - Math.exp(-dt * 3));
      driftY += (pointerY - driftY) * (1 - Math.exp(-dt * 3));
    }
    const cameraZ = -progress * TRAVEL;
    camera.position.set(
      Math.sin(clock * 0.07) * 0.8 + driftX * 1.2,
      Math.cos(clock * 0.05) * 0.6 - driftY * 0.9,
      cameraZ
    );
    camera.rotation.set(driftY * -0.02, driftX * -0.03, Math.sin(clock * 0.03) * 0.04);

    time.value = clock;
    starMaterial.uniforms.uCamZ.value = cameraZ;
    for (const nebula of nebulae) {
      // Fade a cloud out as the camera reaches it, so it never pops.
      const alpha = nebula.alpha * smooth((cameraZ - nebula.z - 20) / 50);
      nebula.mesh.visible = alpha > 0;
      nebula.material.uniforms.uAlpha.value = alpha;
    }
    moveBodies(reduced ? 0 : dt);
    if (!reduced) updateShooters(dt, cameraZ);
    renderer.render(scene, camera);
  };

  let raf = 0;
  let last = 0;
  let lost = false;
  let dead = false;
  let lostTimer = 0;
  const giveUp = () => {
    dead = true;
    cancelAnimationFrame(raf);
    raf = 0;
    root.classList.add("no-gl");
  };
  const draw = (dt) => {
    try {
      frame(dt);
      return true;
    } catch (err) {
      giveUp();
      console.error(err);
      return false;
    }
  };
  const tick = (now) => {
    raf = 0;
    if (lost || dead) return;
    // About 30 frames a second is plenty for slow drift.
    if (last && now - last < 30) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.033;
    last = now;
    if (!draw(dt)) return;
    if (!reduced && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (raf || lost || dead) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  };

  let sizeKey = "";
  let sizedW = 0;
  let sizedH = 0;
  const resize = () => {
    if (dead) return;
    const w = canvas.clientWidth;
    let h = canvas.clientHeight;
    if (!w || !h) return;
    readScroll();
    // A phone's URL bar sliding away changes only the height, by a little.
    // Keep the old buffer then; CSS stretches it and nobody can tell.
    if (w === sizedW && Math.abs(h - sizedH) < 120) h = sizedH;
    sizedW = w;
    sizedH = h;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    const key = w + "x" + h + "@" + dpr;
    if (key === sizeKey) {
      wake();
      return;
    }
    sizeKey = key;
    try {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
    } catch (err) {
      giveUp();
      console.error(err);
      return;
    }
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // World size to pixels at distance 1, so stars keep their size on any screen.
    starMaterial.uniforms.uScale.value = (h * dpr) / (2 * Math.tan((FOV * Math.PI) / 360));
    starMaterial.uniforms.uMinSize.value = 1.5 * dpr;
    starMaterial.uniforms.uMaxSize.value = 96 * dpr;
    // On narrow screens pull the systems in sideways so they stay in view,
    // and start them all low on the screen, below the intro text.
    const narrow = camera.aspect < 0.9;
    const pull = Math.min(1, camera.aspect / 1.4);
    for (const system of systems) {
      system.group.position.x = system.x * pull;
      system.group.position.y = narrow ? system.z * 0.19 : system.y;
      system.corona.position.copy(system.group.position);
    }
    if (!lost && draw(0)) wake();
  };

  window.addEventListener(
    "scroll",
    () => {
      readScroll();
      wake();
    },
    { passive: true }
  );
  window.addEventListener("resize", resize, { passive: true });
  const sizeWatch = new ResizeObserver(resize);
  sizeWatch.observe(canvas);
  sizeWatch.observe(document.body); // page height changes move the scroll range
  // Give up on a lost context only after it has stayed lost for 3 seconds
  // with the tab visible: phones often restore it when the tab comes back.
  const armGiveUp = () => {
    window.clearTimeout(lostTimer);
    if (lost && !dead && !document.hidden) lostTimer = window.setTimeout(giveUp, 3000);
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(lostTimer);
      return;
    }
    armGiveUp();
    wake();
  });
  if (reducedQuery.addEventListener) {
    reducedQuery.addEventListener("change", (e) => {
      reduced = e.matches;
      wake();
    });
  }
  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (e) => {
        pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    armGiveUp();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    window.clearTimeout(lostTimer);
    if (dead) return;
    lost = false;
    wake();
  });

  moveBodies(0);
  resize();
}

try {
  start();
} catch (err) {
  root.classList.add("no-gl");
  console.error(err);
}
