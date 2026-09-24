import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// The portrait is a single textured quad. Depth (from a monocular depth
// estimate, masked by the silhouette) drives three things: a two-step
// parallax offset (so near features like the nose genuinely move more than
// the hairline), surface normals for a stage light that follows the cursor
// with its own lag, and — during the reveal — a refraction ripple.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTex;
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  uniform vec2 uMouse;
  uniform vec2 uLight;
  uniform float uDepthAmt;
  uniform float uTime;
  uniform float uBreath;
  uniform float uRipple;
  uniform vec2 uRippleOrigin;
  uniform float uKey;
  uniform float uScrollKey;
  uniform vec3 uRim;

  float depthAt(vec2 uv) { return texture2D(uDepth, uv).r; }

  void main() {
    vec2 uv = vUv;
    float breath = sin(uTime * 0.5) * uBreath;
    vec2 m = uMouse + vec2(breath * 0.35, breath);

    float d = depthAt(uv);
    vec2 off = m * (d - 0.4) * uDepthAmt;
    d = depthAt(uv - off);
    off = m * (d - 0.4) * uDepthAmt;
    vec2 puv = uv - off;

    float wave = 0.0;
    if (uRipple > 0.001 && uRipple < 0.999) {
      vec2 dir = uv - uRippleOrigin;
      float dist = length(dir * vec2(1.0, 1.25));
      float r = uRipple * 1.7;
      wave = smoothstep(r - 0.14, r, dist) * (1.0 - smoothstep(r, r + 0.14, dist));
      wave *= (1.0 - uRipple);
      puv += normalize(dir + 1e-5) * wave * 0.03;
    }

    float ca = wave * 0.01;
    vec4 c = texture2D(uTex, puv);
    c.r = texture2D(uTex, puv + vec2(ca, 0.0)).r;
    c.b = texture2D(uTex, puv - vec2(ca, 0.0)).b;

    vec2 s = uTexel * 3.0;
    float dl = depthAt(puv - vec2(s.x, 0.0));
    float dr = depthAt(puv + vec2(s.x, 0.0));
    float du = depthAt(puv + vec2(0.0, s.y));
    float dd = depthAt(puv - vec2(0.0, s.y));
    vec3 n = normalize(vec3((dl - dr) * 7.0, (dd - du) * 7.0, 1.0));
    vec3 L = normalize(vec3(uLight, 0.95));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    float facing = clamp(dot(normalize(n.xy + 1e-5), normalize(uLight + 1e-5)), 0.0, 1.0);
    float rim = pow(1.0 - n.z, 1.5) * facing;

    // Event lighting (moody, coral rim that follows the cursor) vs clean key
    // light. Driven by the reveal toggle OR by scroll, whichever is higher.
    float key = max(uKey, uScrollKey);
    vec3 col = c.rgb;
    col *= mix(0.84, 1.0, key) + diff * mix(0.2, 0.1, key);
    col += uRim * rim * mix(0.42, 0.1, key) * c.a;

    gl_FragColor = vec4(col * c.a, c.a);
  }
`;

export type PortraitUniforms = {
  mouse: THREE.Vector2;
  light: THREE.Vector2;
};

export class PortraitGL {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private textures: THREE.Texture[] = [];
  readonly u: Record<string, THREE.IUniform>;

  constructor(canvas: HTMLCanvasElement, cutout: HTMLImageElement, depth: HTMLImageElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const tex = this.makeTexture(cutout);
    const dep = this.makeTexture(depth);

    this.u = {
      uTex: { value: tex },
      uDepth: { value: dep },
      uTexel: { value: new THREE.Vector2(1 / depth.naturalWidth, 1 / depth.naturalHeight) },
      uMouse: { value: new THREE.Vector2() },
      uLight: { value: new THREE.Vector2(0.35, 0.45) },
      uDepthAmt: { value: 0.028 },
      uTime: { value: 0 },
      uBreath: { value: 0.06 },
      uRipple: { value: 0 },
      uRippleOrigin: { value: new THREE.Vector2(0.5, 0.7) },
      uKey: { value: 0 },
      uScrollKey: { value: 0 },
      uRim: { value: new THREE.Color("#ff8a70") },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.u,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(this.mesh);
  }

  private makeTexture(img: HTMLImageElement) {
    const t = new THREE.Texture(img);
    // Sample raw sRGB values and write them back out untouched — the shader
    // does no lighting maths that would need a linear workflow.
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    this.textures.push(t);
    return t;
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
  }

  render(time: number) {
    this.u.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.textures.forEach((t) => t.dispose());
    this.material.dispose();
    this.mesh.geometry.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
