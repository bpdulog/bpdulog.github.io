import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import {
  focusAreas,
  roles,
  type FocusArea,
  type FocusTag,
} from "@/lib/career";
import {
  roleByShortName,
  skills,
  type Highlight,
  type Skill,
} from "@/lib/skills";

/* ------------------------------ graph data ------------------------------ */

type NodeType = "hub" | "role" | "skill";

type GNode = {
  key: string;
  type: NodeType;
  label: string;
  color: string;
  focus: FocusTag[];
  refId: string; // hub: focus tag, role: company, skill: id
};

const FOCUS_COLOR: Record<FocusTag, string> = {
  "Treasury & FTP": "#67e8f9",
  "Risk & Regulation": "#fcd34d",
  "Analytics & Systems": "#6ee7b7",
};

const hubTags = focusAreas.filter((f): f is FocusTag => f !== "All");

const nodes: GNode[] = [
  ...hubTags.map<GNode>((tag) => ({
    key: `h:${tag}`,
    type: "hub",
    label: tag,
    color: FOCUS_COLOR[tag],
    focus: [tag],
    refId: tag,
  })),
  ...roles.map<GNode>((role) => ({
    key: `r:${role.company}`,
    type: "role",
    label: role.shortName,
    color: FOCUS_COLOR[role.focus[0]],
    focus: role.focus,
    refId: role.company,
  })),
  ...skills.map<GNode>((skill) => ({
    key: `s:${skill.id}`,
    type: "skill",
    label: skill.label,
    color: FOCUS_COLOR[skill.focus],
    focus: [skill.focus],
    refId: skill.id,
  })),
];

const indexOf = new Map(nodes.map((n, i) => [n.key, i]));

const edges: { a: number; b: number; len: number }[] = [];
const addEdge = (ka: string, kb: string, len: number) => {
  const a = indexOf.get(ka);
  const b = indexOf.get(kb);
  if (a !== undefined && b !== undefined) edges.push({ a, b, len });
};
roles.forEach((role) =>
  role.focus.forEach((tag) => addEdge(`r:${role.company}`, `h:${tag}`, 2.6)),
);
skills.forEach((skill) => {
  if (skill.roles.length === 0) {
    addEdge(`s:${skill.id}`, `h:${skill.focus}`, 1.9);
  } else {
    skill.roles.forEach((shortName) => {
      const role = roleByShortName(shortName);
      if (role) addEdge(`s:${skill.id}`, `r:${role.company}`, 1.5);
    });
  }
});

const BASE_SIZE: Record<NodeType, number> = { hub: 0.34, role: 0.24, skill: 0.13 };

/* -------------------------------- scene --------------------------------- */

type DragState = {
  active: boolean;
  hover: boolean;
  dx: number;
  dy: number;
};

type SceneProps = {
  focus: FocusArea;
  highlight: Highlight | null;
  selectedRole: string;
  labelRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  drag: MutableRefObject<DragState>;
  reduced: boolean;
};

function hashUnit(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Scene({
  focus,
  highlight,
  selectedRole,
  labelRefs,
  drag,
  reduced,
}: SceneProps) {
  const { size, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const settled = useRef(false);

  const N = nodes.length;

  const sim = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = hashUnit(i + 1) * 2 - 1;
      const t = hashUnit(i + 91) * Math.PI * 2;
      const r = 2 + hashUnit(i + 37) * 3;
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(t) * s * r;
      pos[i * 3 + 1] = u * r;
      pos[i * 3 + 2] = Math.sin(t) * s * r;
    }
    return {
      pos,
      vel,
      dimV: new Float32Array(N),
      force: new Float32Array(N * 3),
      anchors: hubTags.map(() => new THREE.Vector3()),
      baseColors: nodes.map((n) => new THREE.Color(n.color)),
    };
  }, [N]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3),
    );
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3),
    );
    return g;
  }, []);

  const targets = useMemo(
    () =>
      nodes.map((n) => {
        let match = true;
        if (focus !== "All") match = n.focus.includes(focus);
        let boost = 0;
        if (highlight && n.type !== "hub") {
          const hit =
            n.type === "role"
              ? highlight.roles.has(n.refId)
              : highlight.skills.has(n.refId);
          match = match && hit;
          boost = hit ? 1 : 0;
        }
        return {
          dim: match ? 0 : 1,
          boost,
          selected: n.type === "role" && n.refId === selectedRole,
        };
      }),
    [focus, highlight, selectedRole],
  );

  useEffect(() => {
    settled.current = false;
  }, [focus, highlight, selectedRole, size.width, size.height]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const white = useMemo(() => new THREE.Color("#ffffff"), []);
  const v3 = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;
    const d = drag.current;
    if (reduced && settled.current && !d.active) return;

    const dt = Math.min(delta, 0.033) * 60; // normalise to ~60fps steps
    const { pos, vel, dimV, anchors, baseColors, force } = sim;
    force.fill(0);

    // hub anchors: triangle by default, active hub pulled to the centre,
    // the others pushed outward while a focus filter is on.
    hubTags.forEach((tag, i) => {
      const angle = Math.PI / 2 + (i * Math.PI * 2) / 3;
      let radius = 3.2;
      if (focus !== "All") radius = tag === focus ? 0 : 5.2;
      anchors[i].lerp(
        v3.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.75, 0),
        0.06 * dt,
      );
    });

    // forces
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const r2 = dx * dx + dy * dy + dz * dz + 0.35;
        const f = 0.75 / r2;
        const inv = 1 / Math.sqrt(r2);
        force[i * 3] += dx * inv * f;
        force[i * 3 + 1] += dy * inv * f;
        force[i * 3 + 2] += dz * inv * f;
        force[j * 3] -= dx * inv * f;
        force[j * 3 + 1] -= dy * inv * f;
        force[j * 3 + 2] -= dz * inv * f;
      }
    }
    for (const e of edges) {
      const dx = pos[e.b * 3] - pos[e.a * 3];
      const dy = pos[e.b * 3 + 1] - pos[e.a * 3 + 1];
      const dz = pos[e.b * 3 + 2] - pos[e.a * 3 + 2];
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-4;
      const f = 0.05 * (len - e.len);
      const fx = (dx / len) * f;
      const fy = (dy / len) * f;
      const fz = (dz / len) * f;
      force[e.a * 3] += fx;
      force[e.a * 3 + 1] += fy;
      force[e.a * 3 + 2] += fz;
      force[e.b * 3] -= fx;
      force[e.b * 3 + 1] -= fy;
      force[e.b * 3 + 2] -= fz;
    }

    let energy = 0;
    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      const x = pos[i * 3];
      const y = pos[i * 3 + 1];
      const z = pos[i * 3 + 2];
      if (n.type === "hub") {
        const a = anchors[hubTags.indexOf(n.refId as FocusTag)];
        force[i * 3] += (a.x - x) * 0.09;
        force[i * 3 + 1] += (a.y - y) * 0.09;
        force[i * 3 + 2] += (a.z - z) * 0.09;
      } else {
        const g = targets[i].dim ? 0.012 : focus !== "All" ? 0.14 : 0.1;
        force[i * 3] -= x * g;
        force[i * 3 + 1] -= y * g;
        force[i * 3 + 2] -= z * g;
        if (targets[i].dim) {
          const m = Math.sqrt(x * x + y * y + z * z) + 1e-4;
          force[i * 3] += (x / m) * 0.09;
          force[i * 3 + 1] += (y / m) * 0.09;
          force[i * 3 + 2] += (z / m) * 0.09;
        }
      }
      for (let k = 0; k < 3; k++) {
        vel[i * 3 + k] = (vel[i * 3 + k] + force[i * 3 + k] * dt) * 0.82;
        const cap = 0.4;
        vel[i * 3 + k] = Math.max(-cap, Math.min(cap, vel[i * 3 + k]));
        pos[i * 3 + k] += vel[i * 3 + k] * dt;
        energy += Math.abs(vel[i * 3 + k]);
      }
    }
    if (energy < 0.02) settled.current = true;

    // rotation: drag, else slow auto-rotate (paused on hover / reduced motion)
    if (d.active) {
      group.rotation.y += d.dx * 0.008;
      group.rotation.x = Math.max(
        -1.1,
        Math.min(1.1, group.rotation.x + d.dy * 0.008),
      );
      d.dx = 0;
      d.dy = 0;
    } else if (!reduced && !d.hover) {
      group.rotation.y += 0.0016 * dt;
    }
    group.updateMatrixWorld();

    // instances
    for (let i = 0; i < N; i++) {
      const t = targets[i];
      dimV[i] += (t.dim - dimV[i]) * 0.12 * dt;
      const scale =
        BASE_SIZE[nodes[i].type] *
        (1 + 0.35 * t.boost + (t.selected ? 0.55 : 0)) *
        (1 - 0.4 * dimV[i]);
      dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      tmpColor.copy(baseColors[i]).multiplyScalar(1 - 0.78 * dimV[i]);
      if (t.boost || t.selected) tmpColor.lerp(white, t.selected ? 0.5 : 0.3);
      mesh.setColorAt(i, tmpColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // edges
    const lp = lineGeom.attributes.position as THREE.BufferAttribute;
    const lc = lineGeom.attributes.color as THREE.BufferAttribute;
    edges.forEach((e, k) => {
      const dim = Math.max(dimV[e.a], dimV[e.b]);
      const lit = targets[e.a].boost && targets[e.b].boost ? 0.95 : 0.5;
      const b = lit * (1 - 0.88 * dim);
      lp.setXYZ(k * 2, pos[e.a * 3], pos[e.a * 3 + 1], pos[e.a * 3 + 2]);
      lp.setXYZ(k * 2 + 1, pos[e.b * 3], pos[e.b * 3 + 1], pos[e.b * 3 + 2]);
      const ca = baseColors[e.a];
      const cb = baseColors[e.b];
      lc.setXYZ(k * 2, ca.r * b, ca.g * b, ca.b * b);
      lc.setXYZ(k * 2 + 1, cb.r * b, cb.g * b, cb.b * b);
    });
    lp.needsUpdate = true;
    lc.needsUpdate = true;

    // DOM labels follow the projected node positions
    for (let i = 0; i < N; i++) {
      const el = labelRefs.current[i];
      if (!el) continue;
      v3.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      group.localToWorld(v3);
      v3.project(camera);
      const px = (v3.x * 0.5 + 0.5) * size.width;
      const py = (-v3.y * 0.5 + 0.5) * size.height;
      const depth = THREE.MathUtils.clamp((1 - v3.z) * 40, 0, 1); // nearer = 1
      const nodeType = nodes[i].type;
      const lift = nodeType === "hub" ? 18 : nodeType === "role" ? 14 : 10;
      el.style.transform = `translate(${px}px, ${py}px) translate(-50%, ${lift}px)`;
      const base = nodeType === "skill" ? 0.5 + 0.5 * depth : 1;
      el.style.opacity = String(base * (1 - 0.8 * dimV[i]));
      el.style.zIndex = String(Math.round(depth * 10));
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial vertexColors transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------- component ------------------------------ */

type SkillGraphProps = {
  focus: FocusArea;
  highlight: Highlight | null;
  selectedRole: string;
  onToggleFocus: (tag: FocusTag) => void;
  onSelectRole: (company: string) => void;
  onSelectSkill: (skill: Skill) => void;
};

export default function SkillGraph({
  focus,
  highlight,
  selectedRole,
  onToggleFocus,
  onSelectRole,
  onSelectSkill,
}: SkillGraphProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "200px" });
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<DragState>({ active: false, hover: false, dx: 0, dy: 0 });
  const last = useRef({ x: 0, y: 0 });

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const stop = () => {
      drag.current.active = false;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  const handleClick = (node: GNode) => {
    if (node.type === "hub") onToggleFocus(node.refId as FocusTag);
    else if (node.type === "role") onSelectRole(node.refId);
    else {
      const skill = skills.find((s) => s.id === node.refId);
      if (skill) onSelectSkill(skill);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-[440px] w-full cursor-grab select-none overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#050d18]/70 active:cursor-grabbing sm:h-[540px]"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        drag.current.active = true;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return;
        drag.current.dx += e.clientX - last.current.x;
        if (e.pointerType === "mouse") {
          drag.current.dy += e.clientY - last.current.y;
        }
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerEnter={() => {
        drag.current.hover = true;
      }}
      onPointerLeave={() => {
        drag.current.hover = false;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 13], fov: 45 }}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          focus={focus}
          highlight={highlight}
          selectedRole={selectedRole}
          labelRefs={labelRefs}
          drag={drag}
          reduced={reduced}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {nodes.map((node, i) => {
          const base =
            node.type === "hub"
              ? "rounded-full border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm"
              : node.type === "role"
                ? "rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-white backdrop-blur-sm"
                : "px-1 text-[0.62rem] text-slate-300 hover:text-white";
          const hubColor =
            node.type === "hub"
              ? { borderColor: node.color + "66", color: node.color, backgroundColor: node.color + "1a" }
              : undefined;
          return (
            <button
              key={node.key}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              type="button"
              onClick={() => handleClick(node)}
              aria-label={
                node.type === "hub"
                  ? `Toggle focus: ${node.label}`
                  : node.type === "role"
                    ? `Open role: ${node.label}`
                    : `Highlight skill: ${node.label}`
              }
              style={{ opacity: 0, ...hubColor }}
              className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 ${base}`}
            >
              {node.label}
            </button>
          );
        })}
      </div>

      <p className="pointer-events-none absolute bottom-3 left-4 text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
        Drag to rotate · click a node
      </p>
    </div>
  );
}
