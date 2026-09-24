import * as THREE from "three";

// An abstract line interpretation of forms associated with Oscar Niemeyer's
// Paris building — a dome emerging from a plaza, an undulating slab on
// pilotis, ground contours. Not a survey or a reconstruction: proportions
// are invented for the composition.
//
// Every line lives in one group whose local z can be flattened (uExtrude = 0)
// onto the picture plane, so the scene starts as a flat elevation drawing —
// in the frame where Sarah's photograph will sit — and extrudes into space
// as the visitor scrolls.

const lineVertex = /* glsl */ `
  uniform float uExtrude;
  varying vec3 vWorld;
  void main() {
    vec3 p = position;
    p.z *= uExtrude;
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const lineFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uLightColor;
  uniform vec3 uLightPos;
  uniform float uLightAmt;
  uniform float uAlpha;
  varying vec3 vWorld;
  void main() {
    float d = distance(vWorld, uLightPos);
    float l = exp(-d * d / 18.0) * uLightAmt;
    vec3 c = mix(uInk, uLightColor, clamp(l, 0.0, 1.0));
    gl_FragColor = vec4(c, uAlpha * (0.5 + 0.5 * clamp(l * 1.4, 0.0, 1.0)));
  }
`;

type Key = { p: number; pos: [number, number, number]; look: [number, number, number] };

// Camera path: elevation (front) → three-quarter orbit → along the façade →
// into the dome, facing the words.
const KEYS: Key[] = [
  { p: 0, pos: [0, 6.5, 40], look: [0, 6.5, 0] },
  { p: 0.3, pos: [-4, 7, 36], look: [0, 6, -2] },
  { p: 0.5, pos: [-17, 9, 24], look: [0, 5, -6] },
  { p: 0.72, pos: [-4, 3.6, 9], look: [6, 5.5, -7] },
  { p: 1, pos: [7, 3.4, 4.5], look: [7, 4.4, -6] },
];

function curveAt(p: number, pick: (k: Key) => [number, number, number]) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1);
  const e = t * t * (3 - 2 * t); // smoothstep between keys
  const va = pick(a);
  const vb = pick(b);
  return new THREE.Vector3(
    va[0] + (vb[0] - va[0]) * e,
    va[1] + (vb[1] - va[1]) * e,
    va[2] + (vb[2] - va[2]) * e,
  );
}

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export class NiemeyerGL {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
  private group = new THREE.Group();
  private lineMat: THREE.ShaderMaterial;
  private photo: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private words: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private disposables: { dispose: () => void }[] = [];
  private progress = 0;
  private pointer = new THREE.Vector2();
  private pointerCur = new THREE.Vector2();
  private narrow = false;

  constructor(
    canvas: HTMLCanvasElement,
    opts: { lite: boolean; font: string; photoLabel: string; missing: boolean },
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lite ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    this.lineMat = new THREE.ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uExtrude: { value: 0 },
        uInk: { value: new THREE.Color("#eef2ea") },
        uLightColor: { value: new THREE.Color("#c9f0d8") },
        uLightPos: { value: new THREE.Vector3(0, 6, -6) },
        uLightAmt: { value: 0 },
        uAlpha: { value: 0.75 },
      },
    });
    this.disposables.push(this.lineMat);

    this.buildArchitecture(opts.lite);
    this.scene.add(this.group);

    // Picture plane: the elevation sheet the drawing starts on. (Sarah's
    // photographs each have their own moment elsewhere — none is repeated
    // here.) With no photos at all yet, it says it is waiting for them.
    const photoTex = this.textTexture(1600, 900, (ctx, w, h) => {
      ctx.fillStyle = "rgba(242,236,228,0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(242,236,228,0.55)";
      // Waiting for photos: dashed. Otherwise a drawing sheet, thin and solid.
      ctx.setLineDash(opts.missing ? [14, 12] : []);
      ctx.lineWidth = opts.missing ? 3 : 2;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(242,236,228,0.8)";
      ctx.font = `500 30px ${opts.font}`;
      ctx.textBaseline = "top";
      ctx.fillText(opts.missing ? `PHOTOGRAPHIE À FOURNIR — ${opts.photoLabel.toUpperCase()}` : opts.photoLabel.toUpperCase(), 44, h - 76);
    });
    this.photo = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 18),
      new THREE.MeshBasicMaterial({ map: photoTex, transparent: true, depthWrite: false }),
    );
    this.photo.position.set(0, 6.5, 0.4);
    this.scene.add(this.photo);
    this.disposables.push(this.photo.geometry, this.photo.material, photoTex);

    // The words, standing inside the dome.
    const wordsTex = this.textTexture(2048, 420, (ctx, w, h) => {
      ctx.fillStyle = "#f2ece4";
      ctx.font = `500 188px ${opts.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("I COLLECT SPACES", w / 2 - 34, h / 2);
      ctx.fillStyle = "#ff6557";
      const m = ctx.measureText("I COLLECT SPACES");
      ctx.fillText(".", w / 2 - 34 + m.width / 2 + 30, h / 2);
    });
    this.words = new THREE.Mesh(
      new THREE.PlaneGeometry(9.6, 1.97),
      new THREE.MeshBasicMaterial({ map: wordsTex, transparent: true, opacity: 0, depthWrite: false }),
    );
    this.words.position.set(7, 4.4, -6.2);
    this.scene.add(this.words);
    this.disposables.push(this.words.geometry, this.words.material, wordsTex);
  }

  private textTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    draw(ctx, w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  private addLines(points: number[]) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const lines = new THREE.LineSegments(g, this.lineMat);
    this.group.add(lines);
    this.disposables.push(g);
  }

  private buildArchitecture(lite: boolean) {
    const seg: number[] = [];
    const push = (a: THREE.Vector3, b: THREE.Vector3) => seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const poly = (pts: THREE.Vector3[], closed = false) => {
      for (let i = 0; i < pts.length - 1; i++) push(pts[i], pts[i + 1]);
      if (closed) push(pts[pts.length - 1], pts[0]);
    };

    // Dome — latitude rings and meridians of a hemisphere on the plaza.
    const dc = new THREE.Vector3(7, 0, -6);
    const R = 5.2;
    const rings = lite ? 7 : 11;
    const meridians = lite ? 14 : 22;
    for (let i = 0; i < rings; i++) {
      const phi = (i / rings) * (Math.PI / 2);
      const y = R * Math.sin(phi);
      const r = R * Math.cos(phi);
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 72; k++) {
        const th = (k / 72) * Math.PI * 2;
        pts.push(new THREE.Vector3(dc.x + Math.cos(th) * r, y, dc.z + Math.sin(th) * r));
      }
      poly(pts);
    }
    for (let m = 0; m < meridians; m++) {
      const th = (m / meridians) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 24; k++) {
        const phi = (k / 24) * (Math.PI / 2);
        pts.push(new THREE.Vector3(dc.x + Math.cos(th) * R * Math.cos(phi), R * Math.sin(phi), dc.z + Math.sin(th) * R * Math.cos(phi)));
      }
      poly(pts);
    }

    // Undulating slab on pilotis — a curve in plan, floor lines and mullions.
    const zAt = (x: number) => -13 + 2.6 * Math.sin(x * 0.32 + 0.6);
    const x0 = -19;
    const x1 = 3;
    const floors = [1.8, 3.9, 6, 8.1, 10.2, 12.3];
    for (const y of floors) {
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 90; k++) {
        const x = x0 + ((x1 - x0) * k) / 90;
        pts.push(new THREE.Vector3(x, y, zAt(x)));
      }
      poly(pts);
    }
    const step = lite ? 0.9 : 0.55;
    for (let x = x0; x <= x1 + 0.001; x += step) {
      push(new THREE.Vector3(x, floors[0], zAt(x)), new THREE.Vector3(x, floors[floors.length - 1], zAt(x)));
    }
    for (let x = x0 + 1; x <= x1; x += 3.2) {
      push(new THREE.Vector3(x, 0, zAt(x)), new THREE.Vector3(x, floors[0], zAt(x)));
    }

    // Plaza — a loose grid, and contour lines that echo the dome.
    for (let z = -20; z <= 6; z += 2) push(new THREE.Vector3(-24, 0, z), new THREE.Vector3(18, 0, z));
    for (let x = -24; x <= 18; x += 3) push(new THREE.Vector3(x, 0, -20), new THREE.Vector3(x, 0, 6));
    for (let c = 1; c <= (lite ? 3 : 5); c++) {
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 96; k++) {
        const th = (k / 96) * Math.PI * 2;
        const r = R + c * 1.1 + Math.sin(th * 3 + c) * 0.35;
        pts.push(new THREE.Vector3(dc.x + Math.cos(th) * r, 0.02, dc.z + Math.sin(th) * r));
      }
      poly(pts);
    }

    this.addLines(seg);
  }

  setProgress(p: number) {
    this.progress = p;
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Keep the elevation framed on narrow screens.
    this.narrow = w / h < 0.8;
    this.camera.fov = this.narrow ? 52 : 34;
    this.camera.updateProjectionMatrix();
  }

  render(time: number) {
    const p = this.progress;
    this.pointerCur.lerp(this.pointer, 0.05);

    const u = this.lineMat.uniforms;
    u.uExtrude.value = smooth(0.12, 0.46, p);
    u.uLightAmt.value = smooth(0.35, 0.6, p);
    u.uAlpha.value = 0.55 + smooth(0.1, 0.4, p) * 0.3;
    // The light travels along the façade, then settles into the dome.
    const along = THREE.MathUtils.lerp(-19, 3, (Math.sin(time * 0.35) + 1) / 2);
    const lp = u.uLightPos.value as THREE.Vector3;
    const toDome = smooth(0.72, 0.95, p);
    lp.set(
      THREE.MathUtils.lerp(along, 7, toDome),
      THREE.MathUtils.lerp(7, 3.2, toDome),
      THREE.MathUtils.lerp(-13 + 2.6 * Math.sin(along * 0.32 + 0.6), -4, toDome),
    );

    this.photo.material.opacity = 1 - smooth(0.12, 0.34, p) * 0.94;
    this.photo.position.z = 0.4 - smooth(0.12, 0.45, p) * 14;
    this.words.material.opacity = smooth(0.66, 0.84, p);

    const pos = curveAt(p, (k) => k.pos);
    const look = curveAt(p, (k) => k.look);
    const par = 1 - smooth(0.85, 1, p) * 0.6;
    // Portrait screens: step back so the words fit the frame.
    if (this.narrow) pos.sub(look).multiplyScalar(1 + smooth(0.6, 1, p) * 1.1).add(look);
    pos.x += this.pointerCur.x * 1.4 * par;
    pos.y += -this.pointerCur.y * 0.8 * par;
    this.camera.position.copy(pos);
    this.camera.lookAt(look);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
