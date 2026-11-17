import { useRef, type ReactNode } from "react";

// Pointer-tracked 3D tilt with a soft glare. Pure CSS transforms, no WebGL.
export default function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canTilt = () =>
    window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)")
      .matches;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max * 2}deg) rotateY(${(px - 0.5) * max * 2}deg)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--glare", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--glare", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative rounded-[2rem] transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--glare, 0)",
          background:
            "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.10), transparent 45%)",
        }}
      />
    </div>
  );
}
