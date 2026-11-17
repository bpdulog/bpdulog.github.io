import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const GRID = 56;
const SIZE = 9;

// Height model: a volatility-surface-like shape (smile across strike,
// term-structure slope across maturity) plus slow drifting waves.
function height(x: number, z: number, t: number) {
  const smile = 0.07 * x * x;
  const term = 0.35 * Math.exp(-(z + 4.5) * 0.35);
  const waves =
    0.22 * Math.sin(x * 0.9 + t * 0.6) * Math.cos(z * 0.7 - t * 0.45) +
    0.1 * Math.sin(x * 2.1 - t * 0.9 + z);
  return smile + term + waves;
}

function Surface({ animate }: { animate: boolean }) {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const colors = useMemo(
    () => new Float32Array((GRID + 1) * (GRID + 1) * 3),
    [],
  );
  const low = useMemo(() => new THREE.Color("#2dd4ff"), []);
  const high = useMemo(() => new THREE.Color("#ffc27a"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const update = (t: number) => {
    const geom = geomRef.current;
    if (!geom) return;
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // plane is rotated, local Y maps to depth
      const h = height(x, z, t);
      pos.setZ(i, h);
      tmp.copy(low).lerp(high, THREE.MathUtils.clamp((h - 0.1) / 1.2, 0, 1));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    pos.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
  };

  useEffect(() => {
    if (!animate) update(2);
  }, [animate]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!animate || !g) return;
    update(clock.elapsedTime);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, pointer.current.x * 0.35, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      -1.15 + pointer.current.y * 0.12,
      0.04,
    );
  });

  const scale = size.width < 700 ? 0.7 : 1;

  return (
    <group ref={groupRef} rotation={[-1.15, 0, 0.2]} scale={scale}>
      <mesh>
        <planeGeometry ref={geomRef} args={[SIZE, SIZE, GRID, GRID]}>
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </planeGeometry>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function RiskSurface() {
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[110vh] opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 7.5], fov: 45 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <Surface animate={!reduced} />
      </Canvas>
    </div>
  );
}
