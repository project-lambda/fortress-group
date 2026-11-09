"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { buildBasements, buildCar, buildFloor, buildRoof, buildSite, buildTree, FH, GH, MH, PLOT_D, PLOT_W, rng, type Lines, type WireParams } from "./build";

const STONE = new THREE.Color("#d9d4cc"), GREEN = new THREE.Color("#38b080"), DIM = new THREE.Color("#6a6f76");
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function lineObj(L: Lines, color: THREE.Color, opacity = 0.9) {
  const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const o = new THREE.LineSegments(L.geometry(), m);
  o.frustumCulled = false;
  return o;
}
function occluderMesh(boxes: THREE.Box3[], mat: THREE.MeshBasicMaterial) {
  const g = new THREE.Group();
  for (const b of boxes) {
    const s = new THREE.Vector3(); b.getSize(s); const c = new THREE.Vector3(); b.getCenter(c);
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.x, s.y, s.z), mat); m.position.copy(c); g.add(m);
  }
  return g;
}

interface FloorRef { group: THREE.Group; start: number; win: number }

function Model({ progress, params }: { progress: MotionValue<number>; params: WireParams }) {
  const { pointer } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 20, 0));

  const built = useMemo(() => {
    const root = new THREE.Group();
    const occMat = new THREE.MeshBasicMaterial({ color: 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const rnd = rng(42);

    // site
    const site = buildSite(params);
    const siteObjs = [lineObj(site.lines, STONE, 0.75), lineObj(site.accents, GREEN, 0.7), lineObj(site.dim, DIM, 0.7)];
    siteObjs.forEach((o) => root.add(o));
    // ground occluder (hides basements until "excavated" look — keep slightly transparent so basements read as underground)
    const groundOcc = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.82, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 }));
    groundOcc.rotation.x = -Math.PI / 2; groundOcc.position.y = -0.02; root.add(groundOcc);

    // basements
    const baseObj = lineObj(buildBasements(params), DIM, 0.9); root.add(baseObj);

    // floors
    const levels: { kind: "ground" | "mezz" | "res"; h: number }[] = [{ kind: "ground", h: GH }];
    if (params.mezzanine) levels.push({ kind: "mezz", h: MH });
    for (let i = 0; i < params.floors; i++) levels.push({ kind: "res", h: FH });
    const floors: FloorRef[] = []; let y = 0; let resIndex = 0;
    levels.forEach((lv, idx) => {
      const fb = buildFloor(lv.kind === "res" ? resIndex++ : 0, 0, lv.h, params, rnd, lv.kind);
      const g = new THREE.Group(); g.position.y = y;
      g.add(lineObj(fb.lines, STONE, 0.9)); g.add(lineObj(fb.accents, GREEN, 0.95)); g.add(occluderMesh(fb.occluders, occMat));
      g.scale.y = 0; g.visible = false; root.add(g);
      const T = levels.length; floors.push({ group: g, start: 0.2 + (0.6 * idx) / T, win: (0.6 / T) * 1.8 });
      y += lv.h;
    });
    const yTop = y;
    const roof = buildRoof(params, 0);
    const roofGroup = new THREE.Group(); roofGroup.position.y = yTop;
    const roofLines = [lineObj(roof.lines, STONE, 0.9), lineObj(roof.accents, GREEN, 0.95)];
    roofLines.forEach((o) => roofGroup.add(o)); roofGroup.add(occluderMesh(roof.occluders, occMat)); root.add(roofGroup);

    // trees: inside plot edges + along roads + lake shore
    const hx = PLOT_W / 2, hz = PLOT_D / 2; const treePos: [number, number, number][] = [];
    for (let x = -hx + 6; x < hx - 10; x += 9) treePos.push([x, 0, -hz + 4 + (rnd() - 0.5) * 2]);
    for (let x = -hx + 20; x < hx - 20; x += 11) treePos.push([x, 0, hz - 5]);
    for (let z = -hz + 8; z < hz - 8; z += 9) treePos.push([-hx + 5, 0, z]);
    for (let x = -120; x < 140; x += 17) treePos.push([x + (rnd() - 0.5) * 4, 0, hz + 19 + rnd() * 3]);
    for (let z = -120; z < 120; z += 15) treePos.push([hx + 31 + rnd() * 3, 0, z + (rnd() - 0.5) * 4]);
    for (let z = -60; z < 60; z += 12) treePos.push([-hx - 8 - rnd() * 4, 0, z]);
    const trees = treePos.map((p, i) => { const t = buildTree(100 + i, 0.9 + rnd() * 0.6); const g = new THREE.Group(); g.position.set(...p); g.add(lineObj(t.lines, STONE, 0.8)); g.add(lineObj(t.accents, GREEN, 0.75)); g.scale.setScalar(0); g.visible = false; root.add(g); return g; });

    // cars on lanes
    const rs = hz + 3, re = hx + 3;
    const lanes = [
      { axis: "x" as const, at: rs + 3, dir: 1 }, { axis: "x" as const, at: rs + 9, dir: -1 },
      { axis: "z" as const, at: re + 3, dir: -1 }, { axis: "z" as const, at: re + 8, dir: -1 }, { axis: "z" as const, at: re + 16, dir: 1 }, { axis: "z" as const, at: re + 21, dir: 1 },
    ];
    const cars = lanes.flatMap((ln, li) => [0, 1].map((k) => {
      const g = new THREE.Group(); const o = lineObj(buildCar(500 + li * 3 + k), STONE, 0.85); g.add(o);
      const occ = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.3, 1.6), occMat); occ.position.y = 1; g.add(occ);
      g.rotation.y = ln.axis === "x" ? (ln.dir > 0 ? 0 : Math.PI) : (ln.dir > 0 ? -Math.PI / 2 : Math.PI / 2);
      g.visible = false; root.add(g);
      return { g, ln, t: rnd() * 280 - 140, speed: 7 + rnd() * 5 };
    }));

    return { root, siteObjs, baseObj, floors, roofLines, trees, cars, occMat, yTop };
  }, [params]);

  const lit = useRef(new THREE.Color());
  useFrame((state, dt) => {
    const p = progress.get();
    const { siteObjs, baseObj, floors, roofLines, trees, cars, occMat, yTop } = built;
    const setRange = (o: THREE.LineSegments, r: number) => { const n = o.geometry.attributes.position.count; o.geometry.setDrawRange(0, Math.floor((n * clamp(r)) / 2) * 2); };
    siteObjs.forEach((o, i) => setRange(o, (p - i * 0.02) / 0.16));
    setRange(baseObj, (p - 0.08) / 0.1);
    floors.forEach((f) => { const s = clamp((p - f.start) / f.win); f.group.visible = s > 0; f.group.scale.y = Math.max(0.0001, easeOut(s)); });
    roofLines.forEach((o) => setRange(o, (p - 0.8) / 0.08));
    trees.forEach((t, i) => { const s = clamp((p - (0.82 + (0.14 * i) / trees.length)) / 0.05); t.visible = s > 0; const k = s < 1 ? 1.15 * easeOut(s) : 1; t.scale.setScalar(Math.max(0.0001, k)); });
    const carsOn = p > 0.9;
    cars.forEach((c) => {
      c.g.visible = carsOn; c.t += c.speed * dt * c.ln.dir; if (c.t > 150) c.t = -150; if (c.t < -150) c.t = 150;
      if (c.ln.axis === "x") c.g.position.set(c.t, 0, c.ln.at); else c.g.position.set(c.ln.at, 0, c.t);
    });
    // lights on at handover
    const l = clamp((p - 0.9) / 0.1);
    occMat.color.copy(lit.current.set(0x000000).lerp(new THREE.Color(0x07362a), l * 0.9));

    // camera orbit + mouse parallax
    const theta = -0.7 + p * 0.95 + pointer.x * 0.06;
    const radius = 180 + p * 60; const camY = 72 + p * 55 + pointer.y * -5;
    const target = camTarget.current.lerp(new THREE.Vector3(0, 6 + p * (yTop * 0.5), 0), 0.08);
    const desired = new THREE.Vector3(Math.sin(theta) * radius, camY, Math.cos(theta) * radius);
    state.camera.position.lerp(desired, 0.08); state.camera.lookAt(target);
  });

  return <primitive object={built.root} />;
}

export default function WireScene({ progress, params }: { progress: MotionValue<number>; params: WireParams }) {
  return (
    <Canvas gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} dpr={[1, 2]} camera={{ fov: 38, near: 1, far: 900, position: [90, 50, 120] }} style={{ background: "transparent" }}>
      <Model progress={progress} params={params} />
    </Canvas>
  );
}
