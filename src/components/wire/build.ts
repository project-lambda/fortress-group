import * as THREE from "three";

/* ---------- tiny line builder ---------- */
export class Lines {
  pts: number[] = [];
  seg(ax: number, ay: number, az: number, bx: number, by: number, bz: number) { this.pts.push(ax, ay, az, bx, by, bz); return this; }
  /** axis-aligned box outline, origin = min corner */
  box(x: number, y: number, z: number, w: number, h: number, d: number) {
    const X = x + w, Y = y + h, Z = z + d;
    this.seg(x, y, z, X, y, z).seg(X, y, z, X, y, Z).seg(X, y, Z, x, y, Z).seg(x, y, Z, x, y, z);
    this.seg(x, Y, z, X, Y, z).seg(X, Y, z, X, Y, Z).seg(X, Y, Z, x, Y, Z).seg(x, Y, Z, x, Y, z);
    this.seg(x, y, z, x, Y, z).seg(X, y, z, X, Y, z).seg(X, y, Z, X, Y, Z).seg(x, y, Z, x, Y, Z);
    return this;
  }
  /** flat rectangle on XZ plane at height y */
  rect(x: number, y: number, z: number, w: number, d: number) {
    return this.seg(x, y, z, x + w, y, z).seg(x + w, y, z, x + w, y, z + d).seg(x + w, y, z + d, x, y, z + d).seg(x, y, z + d, x, y, z);
  }
  poly(points: [number, number, number][], close = true) {
    for (let i = 0; i < points.length - 1; i++) this.seg(...points[i], ...points[i + 1]);
    if (close && points.length > 2) this.seg(...points[points.length - 1], ...points[0]);
    return this;
  }
  circle(cx: number, y: number, cz: number, r: number, n = 24, ry?: number) {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * (ry ?? r)]); }
    return this.poly(pts);
  }
  /** vertical circle in XY plane (wheels) */
  circleXY(cx: number, cy: number, z: number, r: number, n = 10) {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]); }
    return this.poly(pts);
  }
  dashed(ax: number, ay: number, az: number, bx: number, by: number, bz: number, dash = 3, gap = 3) {
    const L = Math.hypot(bx - ax, by - ay, bz - az); const n = Math.floor(L / (dash + gap));
    for (let i = 0; i <= n; i++) {
      const t0 = (i * (dash + gap)) / L, t1 = Math.min(1, (i * (dash + gap) + dash) / L);
      this.seg(ax + (bx - ax) * t0, ay + (by - ay) * t0, az + (bz - az) * t0, ax + (bx - ax) * t1, ay + (by - ay) * t1, az + (bz - az) * t1);
    }
    return this;
  }
  merge(o: Lines) { this.pts.push(...o.pts); return this; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pts, 3));
    return g;
  }
  get count() { return this.pts.length / 3; }
}

/* ---------- deterministic random ---------- */
export function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* ---------- model parameters ---------- */
export interface WireParams { floors: number; basements: number; towers: 1 | 2; mezzanine: boolean }
export const FH = 3.1, GH = 4.6, MH = 3.0, BH = 3.0;
export const TW = 22, TD = 15, GAP = 8, SPINE_W = 6, SPINE_D = 10;

export interface FloorBuild { lines: Lines; accents: Lines; occluders: THREE.Box3[]; y: number; h: number }

function towerOffsets(towers: number) { return towers === 2 ? [-(TW + GAP) / 2, (TW + GAP) / 2] : [0]; }

/** one residential floor of all towers (+spine) */
export function buildFloor(level: number, y: number, h: number, p: WireParams, rnd: () => number, kind: "res" | "ground" | "mezz"): FloorBuild {
  const L = new Lines(), A = new Lines(); const occ: THREE.Box3[] = [];
  for (const ox of towerOffsets(p.towers)) {
    const x0 = ox - TW / 2, z0 = -TD / 2;
    // slab
    L.box(x0, y, z0, TW, 0.25, TD);
    occ.push(new THREE.Box3(new THREE.Vector3(x0 + 0.05, y + 0.02, z0 + 0.05), new THREE.Vector3(x0 + TW - 0.05, y + h - 0.02, z0 + TD - 0.05)));
    if (kind === "ground") {
      // glass lobby: columns + sparse tall mullions + canopy
      for (const cx of [x0 + 1, x0 + TW / 2, x0 + TW - 1]) for (const cz of [z0 + 1, z0 + TD - 1]) L.box(cx - 0.35, y + 0.25, cz - 0.35, 0.7, h - 0.25, 0.7);
      for (let x = x0; x <= x0 + TW; x += 2.2) L.seg(x, y + 0.25, z0, x, y + h, z0).seg(x, y + 0.25, z0 + TD, x, y + h, z0 + TD);
      L.seg(x0, y + 2.6, z0, x0 + TW, y + 2.6, z0); // transom
      L.box(x0 - 1.5, y + h - 0.3, z0 - 2.4, TW + 3, 0.3, TD + 4.8); // canopy
      A.rect(x0 + 4, y + 0.26, z0 - 0.01, 6, 0.02); // entrance mat
      continue;
    }
    // facade mullions (dense vertical hatching like the reference)
    const step = kind === "mezz" ? 1.1 : 1.5;
    for (let x = x0; x <= x0 + TW + 0.01; x += step) { L.seg(x, y + 0.25, z0, x, y + h, z0); L.seg(x, y + 0.25, z0 + TD, x, y + h, z0 + TD); }
    for (let z = z0; z <= z0 + TD + 0.01; z += 2) { L.seg(x0, y + 0.25, z, x0, y + h, z); L.seg(x0 + TW, y + 0.25, z, x0 + TW, y + h, z); }
    // sill + head lines
    L.box(x0, y + 1.0, z0, TW, 0, TD); L.box(x0, y + h - 0.4, z0, TW, 0, TD);
    // corner columns
    for (const cx of [x0, x0 + TW]) for (const cz of [z0, z0 + TD]) L.seg(cx, y, cz, cx, y + h, cz);
    // blade walls at outer wing edges, protruding front & back
    for (const bx of [x0 + 3, x0 + TW - 3]) { L.box(bx - 0.15, y, z0 - 1.6, 0.3, h, TD + 3.2); occ.push(new THREE.Box3(new THREE.Vector3(bx - 0.14, y, z0 - 1.6), new THREE.Vector3(bx + 0.14, y + h, z0 + TD + 1.6))); }
    if (kind === "mezz") continue;
    // alternating cantilevered balconies with planters (front face)
    const left = level % 2 === 0;
    const bx0 = left ? x0 + 3.3 : x0 + TW - 3.3 - 7.5, bw = 7.5, bd = 2.2;
    L.box(bx0, y, z0 - bd, bw, 0.2, bd);
    occ.push(new THREE.Box3(new THREE.Vector3(bx0, y, z0 - bd), new THREE.Vector3(bx0 + bw, y + 0.2, z0)));
    for (let x = bx0; x <= bx0 + bw + 0.01; x += 0.45) L.seg(x, y + 0.2, z0 - bd, x, y + 1.15, z0 - bd); // railing fins
    L.seg(bx0, y + 1.15, z0 - bd, bx0 + bw, y + 1.15, z0 - bd).seg(bx0, y + 1.15, z0 - bd, bx0, y + 1.15, z0).seg(bx0 + bw, y + 1.15, z0 - bd, bx0 + bw, y + 1.15, z0);
    A.box(bx0 + 0.3, y + 0.2, z0 - bd + 0.2, bw - 0.6, 0.5, 0.6); // planter
    for (let x = bx0 + 0.6; x < bx0 + bw - 0.3; x += 0.55) { const hh = 0.5 + rnd() * 0.7; A.seg(x, y + 0.7, z0 - bd + 0.5, x - 0.25, y + 0.7 + hh, z0 - bd + 0.3).seg(x, y + 0.7, z0 - bd + 0.5, x + 0.2, y + 0.7 + hh * 0.8, z0 - bd + 0.6); }
    // rear balcony on the opposite wing
    const rx0 = left ? x0 + TW - 3.3 - 6 : x0 + 3.3;
    L.box(rx0, y, z0 + TD, 6, 0.2, 1.8); for (let x = rx0; x <= rx0 + 6.01; x += 0.5) L.seg(x, y + 0.2, z0 + TD + 1.8, x, y + 1.1, z0 + TD + 1.8);
    occ.push(new THREE.Box3(new THREE.Vector3(rx0, y, z0 + TD), new THREE.Vector3(rx0 + 6, y + 0.2, z0 + TD + 1.8)));
    // interior hints: partitions + a few furniture blocks
    for (const px of [x0 + TW * 0.33, x0 + TW * 0.66]) L.seg(px, y + 0.25, z0 + 0.5, px, y + 0.25, z0 + TD - 0.5).seg(px, y + 0.25, z0 + TD * 0.5, px, y + h - 0.4, z0 + TD * 0.5);
    for (let k = 0; k < 3; k++) { const fx = x0 + 1 + rnd() * (TW - 4), fz = z0 + 1 + rnd() * (TD - 4); L.box(fx, y + 0.25, fz, 1.2 + rnd() * 1.5, 0.45 + rnd() * 0.4, 0.8 + rnd() * 1.2); }
  }
  // spine between towers (dark glazed core, horizontal bands)
  if (p.towers === 2 && kind !== "ground") {
    const sx = -SPINE_W / 2, sz = -SPINE_D / 2;
    A.box(sx, y, sz, SPINE_W, h, SPINE_D);
    for (let yy = y + 0.6; yy < y + h; yy += 0.6) A.box(sx, yy, sz, SPINE_W, 0, SPINE_D);
    occ.push(new THREE.Box3(new THREE.Vector3(sx + 0.05, y, sz + 0.05), new THREE.Vector3(sx + SPINE_W - 0.05, y + h, sz + SPINE_D - 0.05)));
  } else if (p.towers === 2) {
    const sx = -SPINE_W / 2, sz = -SPINE_D / 2;
    L.box(sx, y, sz, SPINE_W, h, SPINE_D); occ.push(new THREE.Box3(new THREE.Vector3(sx + 0.05, y, sz + 0.05), new THREE.Vector3(sx + SPINE_W - 0.05, y + h, sz + SPINE_D - 0.05)));
  }
  return { lines: L, accents: A, occluders: occ, y, h };
}

export function buildBasements(p: WireParams) {
  const L = new Lines();
  for (let b = 0; b < p.basements; b++) {
    const y = -(b + 1) * BH;
    for (const ox of towerOffsets(p.towers)) {
      const x0 = ox - TW / 2 - 2, z0 = -TD / 2 - 2;
      L.box(x0, y, z0, TW + 4, BH, TD + 4);
      for (let x = x0 + 4; x < x0 + TW + 4; x += 6) for (let z = z0 + 4; z < z0 + TD + 4; z += 6) L.box(x - 0.3, y, z - 0.3, 0.6, BH, 0.6);
      for (let x = x0 + 1; x < x0 + TW + 4; x += 2.6) L.rect(x, y + 0.01, z0 + 1, 2.3, 5); // parking bays
    }
    // ramp
    L.poly([[TW + GAP / 2 + 6, y, -4], [TW + GAP / 2 + 14, y + BH, -4], [TW + GAP / 2 + 14, y + BH, 0], [TW + GAP / 2 + 6, y, 0]]);
  }
  return L;
}

export function buildRoof(p: WireParams, yTop: number) {
  const L = new Lines(), A = new Lines(); const occ: THREE.Box3[] = [];
  const offs = towerOffsets(p.towers);
  offs.forEach((ox, i) => {
    const x0 = ox - TW / 2, z0 = -TD / 2;
    L.box(x0, yTop, z0, TW, 1.2, TD); // parapet
    for (const bx of [x0 + 3, x0 + TW - 3]) L.box(bx - 0.15, yTop, z0 - 1.6, 0.3, 3.2, TD + 3.2); // fin tops
    L.box(x0 + TW / 2 - 3, yTop, z0 + TD / 2 - 2.5, 6, 3.4, 5); // lift machine room
    occ.push(new THREE.Box3(new THREE.Vector3(x0 + TW / 2 - 3, yTop, z0 + TD / 2 - 2.5), new THREE.Vector3(x0 + TW / 2 + 3, yTop + 3.4, z0 + TD / 2 + 2.5)));
    if (i === 0) {
      // pergola grid
      const px = x0 + 1.5, pz = z0 + 1.5, pw = TW * 0.45, pd = TD - 3, ph = 3;
      for (const cx of [px, px + pw]) for (const cz of [pz, pz + pd]) L.seg(cx, yTop, cz, cx, yTop + ph, cz);
      for (let x = px; x <= px + pw + 0.01; x += 1.1) L.seg(x, yTop + ph, pz, x, yTop + ph, pz + pd);
      for (let z = pz; z <= pz + pd + 0.01; z += 1.1) L.seg(px, yTop + ph, z, px + pw, yTop + ph, z);
    } else {
      // rooftop pool
      A.rect(x0 + 2, yTop + 0.3, z0 + 2.5, 10, 4); A.rect(x0 + 2.6, yTop + 0.3, z0 + 3.1, 8.8, 2.8);
      for (let k = 0; k < 4; k++) A.seg(x0 + 3 + k * 2.2, yTop + 0.3, z0 + 3.4, x0 + 4.4 + k * 2.2, yTop + 0.3, z0 + 5.6);
      for (let x = x0 + 13; x < x0 + TW - 1; x += 1.4) A.box(x, yTop + 0.3, z0 + 3, 0.6, 0.4, 1.8); // loungers
    }
  });
  if (p.towers === 2) { L.box(-SPINE_W / 2, yTop, -SPINE_D / 2, SPINE_W, 1.2, SPINE_D); }
  return { lines: L, accents: A, occluders: occ };
}

/* ---------- site ---------- */
export const PLOT_W = 78, PLOT_D = 56;
export function buildSite(_p: WireParams) {
  const L = new Lines(), A = new Lines(), dim = new Lines();
  const hx = PLOT_W / 2, hz = PLOT_D / 2;
  // plot & boundary wall (gap for gate on the south)
  L.rect(-hx, 0.02, -hz, PLOT_W, PLOT_D);
  const wallH = 2.2;
  L.poly([[-hx, wallH, -hz], [hx, wallH, -hz], [hx, wallH, hz], [12, wallH, hz]], false);
  L.poly([[-12, wallH, hz], [-hx, wallH, hz], [-hx, wallH, -hz]], false);
  for (let x = -hx; x <= hx; x += 3.9) { if (Math.abs(x) < 12) continue; L.seg(x, 0, hz, x, wallH, hz); }
  for (let x = -hx; x <= hx; x += 3.9) L.seg(x, 0, -hz, x, wallH, -hz);
  for (let z = -hz; z <= hz; z += 3.9) { L.seg(-hx, 0, z, -hx, wallH, z); L.seg(hx, 0, z, hx, wallH, z); }
  // gate posts + guard room
  L.box(-12.6, 0, hz - 0.6, 0.6, 3, 1.2).box(12, 0, hz - 0.6, 0.6, 3, 1.2);
  L.box(13, 0, hz - 4.5, 4, 2.8, 4);
  // driveway + drop-off loop
  L.seg(-9, 0.03, hz, -9, 0.03, TD / 2 + 6).seg(9, 0.03, hz, 9, 0.03, TD / 2 + 6);
  L.circle(0, 0.03, TD / 2 + 6, 9, 32, 4); A.circle(0, 0.04, TD / 2 + 6, 3.5, 20, 1.8);
  // basketball court (north-east)
  const cx = 18, cz = -hz + 11;
  A.rect(cx - 14, 0.03, cz - 7.5, 28, 15); A.seg(cx, 0.03, cz - 7.5, cx, 0.03, cz + 7.5); A.circle(cx, 0.03, cz, 1.8);
  A.rect(cx - 14, 0.03, cz - 2.5, 5.8, 5); A.rect(cx + 8.2, 0.03, cz - 2.5, 5.8, 5);
  for (const px of [cx - 13, cx + 13]) { A.seg(px, 0, cz, px, 3.05, cz); A.rect(px - 0.9, 3.05, cz - 0.02, 1.8, 0.04); }
  // garden paths + mini park (north-west)
  for (let k = 0; k < 4; k++) A.circle(-24, 0.03, -hz + 12, 3 + k * 2.2, 28);
  dim.dashed(-hx + 4, 0.03, -hz + 4, -hx + 4, 0.03, hz - 6);
  // === roads ===
  // south road (front), 12 m, two lanes, with sidewalks
  const rs = hz + 3; // sidewalk edge
  dim.seg(-150, 0.01, rs, 150, 0.01, rs).seg(-150, 0.01, rs + 12, 150, 0.01, rs + 12).seg(-150, 0.01, rs + 15, 150, 0.01, rs + 15);
  dim.dashed(-150, 0.02, rs + 6, 150, 0.02, rs + 6, 3, 3);
  // east expressway (the 300 ft road side): 4 lanes + median
  const re = hx + 3;
  dim.seg(re, 0.01, -150, re, 0.01, 150).seg(re + 11, 0.01, -150, re + 11, 0.01, 150).seg(re + 13, 0.01, -150, re + 13, 0.01, 150).seg(re + 24, 0.01, -150, re + 24, 0.01, 150).seg(re + 27, 0.01, -150, re + 27, 0.01, 150);
  dim.dashed(re + 5.5, 0.02, -150, re + 5.5, 0.02, 150, 3, 3).dashed(re + 18.5, 0.02, -150, re + 18.5, 0.02, 150, 3, 3);
  for (let z = -140; z < 150; z += 24) dim.box(re + 11.5, 0, z, 1, 0.5, 6); // median planters
  // zebra crossing
  for (let x = -6; x <= 6; x += 1.2) dim.rect(x, 0.03, rs + 0.5, 0.6, 11);
  // lamp posts along both roads
  for (let x = -140; x < 150; x += 22) lamp(L, x, rs + 13.5, 0);
  for (let z = -140; z < 150; z += 22) lamp(L, re + 25.5, z, Math.PI / 2);
  // lake to the west with ripples
  const lake: [number, number, number][] = []; const r = rng(7);
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; const rad = 42 + r() * 10; lake.push([-hx - 48 + Math.cos(a) * rad * 1.4, 0.01, -8 + Math.sin(a) * rad]); }
  A.poly(lake);
  for (let k = 1; k <= 3; k++) { const pts: [number, number, number][] = lake.map(([x, y, z]) => [-hx - 48 + (x + hx + 48) * (1 - k * 0.22), y, -8 + (z + 8) * (1 - k * 0.22)]); A.poly(pts); }
  dim.seg(-hx - 3, 0.01, -150, -hx - 3, 0.01, 150); // west lane edge
  return { lines: L, accents: A, dim };
}
function lamp(L: Lines, x: number, z: number, rot: number) {
  L.seg(x, 0, z, x, 8, z);
  const ax = Math.cos(rot) * 0, az = Math.sin(rot) * 0; void ax; void az;
  const dx = rot === 0 ? 0 : -1.6, dz = rot === 0 ? -1.6 : 0;
  L.seg(x, 8, z, x + dx, 8.4, z + dz).box(x + dx - 0.3, 8.2, z + dz - 0.3, 0.6, 0.25, 0.6);
}

/* ---------- trees ---------- */
export function buildTree(seed: number, scale = 1) {
  const r = rng(seed); const L = new Lines(); const A = new Lines();
  const trunkH = (2.2 + r() * 1.2) * scale;
  L.seg(0, 0, 0, 0, trunkH, 0).seg(0.25, 0, 0.1, 0.1, trunkH * 0.8, 0.05);
  const branch = (x: number, y: number, z: number, dx: number, dy: number, dz: number, len: number, depth: number) => {
    const ex = x + dx * len, ey = y + dy * len, ez = z + dz * len; L.seg(x, y, z, ex, ey, ez);
    if (depth === 0) return;
    for (let k = 0; k < 2 + Math.floor(r() * 2); k++) {
      const ndx = dx + (r() - 0.5) * 1.3, ndy = Math.abs(dy + (r() - 0.3) * 0.8), ndz = dz + (r() - 0.5) * 1.3; const n = Math.hypot(ndx, ndy, ndz) || 1;
      branch(ex, ey, ez, ndx / n, ndy / n, ndz / n, len * 0.62, depth - 1);
    }
  };
  for (let k = 0; k < 3; k++) { const a = r() * Math.PI * 2; branch(0, trunkH, 0, Math.cos(a) * 0.7, 0.7, Math.sin(a) * 0.7, 1.6 * scale, 3); }
  // scribbled canopy: jittered loops
  const cy = trunkH + 2.2 * scale, cr = (2.4 + r() * 0.8) * scale;
  for (let k = 0; k < 5; k++) {
    const pts: [number, number, number][] = []; const tilt = r() * Math.PI; const n = 22;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const rr = cr * (0.75 + r() * 0.35); pts.push([Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.75 * Math.cos(tilt) + (r() - 0.5) * 0.4, Math.sin(a) * rr * Math.sin(tilt) + (r() - 0.5) * 0.6]); }
    A.poly(pts);
  }
  return { lines: L, accents: A };
}

/* ---------- cars ---------- */
export function buildCar(seed: number) {
  const r = rng(seed); const L = new Lines();
  const len = 4.2 + r() * 0.6, w = 1.75, h1 = 0.75, h2 = 0.7;
  L.box(-len / 2, 0.35, -w / 2, len, h1, w);
  const c0 = -len / 2 + 0.9, cl = len - 2.2;
  L.poly([[c0, 0.35 + h1, -w / 2 + 0.15], [c0 + 0.6, 0.35 + h1 + h2, -w / 2 + 0.3], [c0 + cl - 0.5, 0.35 + h1 + h2, -w / 2 + 0.3], [c0 + cl, 0.35 + h1, -w / 2 + 0.15]], false);
  L.poly([[c0, 0.35 + h1, w / 2 - 0.15], [c0 + 0.6, 0.35 + h1 + h2, w / 2 - 0.3], [c0 + cl - 0.5, 0.35 + h1 + h2, w / 2 - 0.3], [c0 + cl, 0.35 + h1, w / 2 - 0.15]], false);
  L.seg(c0 + 0.6, 0.35 + h1 + h2, -w / 2 + 0.3, c0 + 0.6, 0.35 + h1 + h2, w / 2 - 0.3).seg(c0 + cl - 0.5, 0.35 + h1 + h2, -w / 2 + 0.3, c0 + cl - 0.5, 0.35 + h1 + h2, w / 2 - 0.3);
  for (const wx of [-len / 2 + 0.8, len / 2 - 0.8]) for (const wz of [-w / 2, w / 2]) L.circleXY(wx, 0.35, wz, 0.34);
  return L;
}
