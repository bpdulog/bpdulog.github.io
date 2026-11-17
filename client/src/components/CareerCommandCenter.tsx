import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
} from "framer-motion";
import {
  ChevronRight,
  Clock3,
  Layers,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import CommandPalette from "@/components/CommandPalette";
import JobMatch from "@/components/JobMatch";
import {
  focusAreas,
  focusStyles,
  roles,
  type FocusArea,
  type FocusTag,
} from "@/lib/career";
import {
  highlightForSkill,
  skillsForRole,
  type Highlight,
  type Skill,
} from "@/lib/skills";

const SkillGraph = lazy(() => import("@/components/SkillGraph"));

const kpis = [
  {
    icon: Clock3,
    value: 15,
    viz: "years" as const,
    suffix: "+",
    label: "Years in financial services",
  },
  {
    icon: Layers,
    value: 7,
    viz: "roles" as const,
    label: "Roles across banking, consulting, and regulation",
  },
  {
    icon: ShieldCheck,
    value: 1,
    viz: "scope" as const,
    prefix: "$",
    suffix: "T",
    label: "Peak institutional risk scope",
  },
  {
    icon: TrendingUp,
    value: 10,
    viz: "ring" as const,
    suffix: "%",
    label: "Productivity gain led at PNC",
  },
];

const TIMELINE_START = 2008;
const TIMELINE_END = 2027;
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;
const yearTicks = [2008, 2011, 2014, 2017, 2020, 2023, 2026];

function toPercent(year: number) {
  return ((year - TIMELINE_START) / TIMELINE_SPAN) * 100;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
  }, [value]);

  useEffect(() => {
    const finish = () => setDisplay(value);
    window.addEventListener("beforeprint", finish);
    return () => window.removeEventListener("beforeprint", finish);
  }, [value]);

  useEffect(() => {
    if (!inView) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display)}
      {suffix}
    </span>
  );
}

type KpiViz = "years" | "roles" | "scope" | "ring";

const vizTransition = (i: number, total: number) => ({
  duration: 0.5,
  delay: 0.25 + (i / total) * 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
});

/** Small, truthful visual behind each KPI, drawn in when scrolled into view. */
function KpiGraphic({ kind }: { kind: KpiViz }) {
  const inView = { initial: "hidden", whileInView: "shown" } as const;
  const viewport = { once: true, amount: 0.6 } as const;

  if (kind === "years") {
    // one bar per year of experience
    return (
      <div className="flex h-8 items-end gap-[3px]" aria-hidden>
        {Array.from({ length: 15 }, (_, i) => (
          <motion.span
            key={i}
            {...inView}
            viewport={viewport}
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
            transition={vizTransition(i, 15)}
            style={{ height: `${28 + (i / 14) * 72}%`, originY: 1 }}
            className="w-[3px] rounded-full bg-cyan-200/70"
          />
        ))}
      </div>
    );
  }

  if (kind === "roles") {
    return (
      <div className="flex h-8 items-center gap-1.5" aria-hidden>
        {roles
          .slice()
          .reverse()
          .map((role, i) => (
            <motion.span
              key={role.company}
              {...inView}
              viewport={viewport}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                shown: { scale: 1, opacity: 1 },
              }}
              transition={vizTransition(i, roles.length)}
              className={`h-2 w-2 rounded-full ${focusStyles[role.focus[0]].dot}`}
            />
          ))}
      </div>
    );
  }

  if (kind === "scope") {
    // institution sizes examined or advised, log scale: $100M, $100B, $300B, $1T
    const bars = [0.18, 0.7, 0.86, 1];
    return (
      <div className="flex h-8 items-end gap-1.5" aria-hidden>
        {bars.map((h, i) => (
          <motion.span
            key={i}
            {...inView}
            viewport={viewport}
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
            transition={vizTransition(i, bars.length)}
            style={{ height: `${h * 100}%`, originY: 1 }}
            className="w-2 rounded-sm bg-amber-200/70"
          />
        ))}
      </div>
    );
  }

  return (
    <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        strokeWidth="4"
        className="stroke-white/10"
      />
      <motion.circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-emerald-300"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 0.1 }}
        viewport={viewport}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function KpiTile({
  icon: Icon,
  viz,
  value,
  prefix,
  suffix,
  label,
  index,
}: {
  icon: typeof Clock3;
  viz: KpiViz;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/8"
    >
      <div className="flex items-start justify-between gap-3">
        <Icon className="h-4 w-4 text-cyan-100" />
        <KpiGraphic kind={viz} />
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{label}</p>
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-cyan-100/90">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
      {children}
    </div>
  );
}

export default function CareerCommandCenter() {
  const [activeFocus, setActiveFocus] = useState<FocusArea>("All");
  const [selectedRole, setSelectedRole] = useState(roles[0].company);

  const activeRole =
    roles.find((role) => role.company === selectedRole) ?? roles[0];

  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const isDimmed = (role: (typeof roles)[number]) =>
    (activeFocus !== "All" && !role.focus.includes(activeFocus)) ||
    (highlight !== null && !highlight.roles.has(role.company));

  const filteredRoles = useMemo(
    () => roles.filter((role) => !isDimmed(role)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFocus, highlight],
  );

  // Matching roles rise to the top; the layout animation below slides rows
  // into their new positions. Chronological order is kept within each group.
  const orderedRoles = useMemo(
    () => [
      ...roles.filter((role) => !isDimmed(role)),
      ...roles.filter((role) => isDimmed(role)),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFocus, highlight],
  );

  const activeRoleSkills = useMemo(
    () => skillsForRole(activeRole),
    [activeRole],
  );

  const openRole = (company: string) => {
    setSelectedRole(company);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    requestAnimationFrame(() =>
      detailRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "nearest",
      }),
    );
  };

  const pickSkill = (skill: Skill) => setHighlight(highlightForSkill(skill));
  const toggleFocus = (tag: FocusTag) =>
    setActiveFocus((current) => (current === tag ? "All" : tag));

  return (
    <MotionConfig reducedMotion="user">
    <section id="experience" className="container scroll-mt-8 pb-24 sm:pb-32">
      <div className="mb-9 max-w-3xl">
        <Eyebrow>Career command center</Eyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          A career built where finance, risk, and systems meet.
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Filter by focus, scan the timeline, then pick a role to open the full
          impact record.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiTile
            key={kpi.label}
            icon={kpi.icon}
            viz={kpi.viz}
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            label={kpi.label}
            index={index}
          />
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
        <CommandPalette
          onPickRole={openRole}
          onPickSkill={pickSkill}
          onPickFocus={setActiveFocus}
        />
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
        {focusAreas.map((focus) => (
          <button
            key={focus}
            type="button"
            onClick={() => setActiveFocus(focus)}
            aria-pressed={focus === activeFocus}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              focus === activeFocus
                ? "border-cyan-200/30 bg-cyan-200/15 text-cyan-50"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {focus}
          </button>
        ))}
        {highlight ? (
          <button
            type="button"
            onClick={() => setHighlight(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-amber-200/10 px-3.5 py-2 text-sm text-amber-50 transition hover:bg-amber-200/20"
          >
            Highlighting: {highlight.label}
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Clear highlight</span>
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="resume-panel overflow-hidden rounded-[2rem] border border-white/12 bg-white/6 p-5 backdrop-blur-2xl sm:p-7 print:hidden">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
              Timeline · 2008 to now
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {(Object.keys(focusStyles) as FocusTag[]).map((focus) => (
                <span
                  key={focus}
                  className="inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-slate-400"
                >
                  <span
                    className={`h-1.5 w-5 rounded-full bg-gradient-to-r ${focusStyles[focus].bar}`}
                  />
                  {focus.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[104px_1fr] items-center gap-3 pb-2">
                <span aria-hidden />
                <div className="relative h-5">
                  {yearTicks.map((year) => (
                    <span
                      key={year}
                      style={{ left: `${toPercent(year)}%` }}
                      className="absolute -translate-x-1/2 text-[0.62rem] tracking-[0.12em] text-slate-500"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {orderedRoles.map((role, index) => {
                  const isSelected = role.company === selectedRole;
                  const dimmed = isDimmed(role);
                  const style = focusStyles[role.focus[0]];
                  return (
                    <motion.button
                      layout="position"
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                      key={role.company}
                      type="button"
                      onClick={() => setSelectedRole(role.company)}
                      aria-pressed={isSelected}
                      className={`grid w-full grid-cols-[104px_1fr] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-[opacity,background-color,border-color] duration-300 ${
                        isSelected
                          ? "border-cyan-200/30 bg-cyan-200/10"
                          : "border-transparent hover:border-white/15 hover:bg-white/5"
                      } ${dimmed ? "opacity-35" : "opacity-100"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">
                          {role.shortName}
                        </span>
                        <span className="block truncate text-[0.62rem] uppercase tracking-[0.16em] text-slate-400">
                          {role.focus[0].split(" ")[0]}
                        </span>
                      </span>

                      <span className="relative block h-8">
                        <span
                          className="absolute inset-y-0 w-px bg-white/8"
                          style={{ left: `${toPercent(2026)}%` }}
                        />
                        <motion.span
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileInView={{ scaleX: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            left: `${toPercent(role.startYear)}%`,
                            width: `${toPercent(role.endYear) - toPercent(role.startYear)}%`,
                            transformOrigin: "left",
                            top: "50%",
                            marginTop: "-0.375rem",
                          }}
                          className={`absolute block h-3 rounded-full bg-gradient-to-r ${style.bar} ${
                            isSelected
                              ? "ring-2 ring-cyan-200/40"
                              : "ring-1 ring-white/10"
                          }`}
                        />
                        {role.current ? (
                          <span
                            style={{ left: `${toPercent(role.endYear)}%` }}
                            className="absolute top-1/2 -translate-y-1/2 pl-2 text-[0.6rem] uppercase tracking-[0.16em] text-cyan-100"
                          >
                            now
                          </span>
                        ) : null}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-6 text-slate-500">
            Showing {filteredRoles.length} of {roles.length} roles for the
            current filter; matches move to the top. Bar length reflects time
            in each seat.
          </p>
        </div>

        <div className="relative scroll-mt-6" ref={detailRef}>
          <AnimatePresence mode="wait">
            <motion.article
              key={activeRole.company}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="resume-panel rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-2xl sm:p-8"
            >
              <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {activeRole.focus.map((focus) => (
                      <span
                        key={focus}
                        className={`rounded-full border px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.18em] ${focusStyles[focus].chip}`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    {activeRole.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {activeRole.company} · {activeRole.location} ·{" "}
                    {activeRole.period}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-xs font-medium text-amber-100">
                  {activeRole.signal}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100">
                {activeRole.summary}
              </p>

              {activeRole.metric ? (
                <div className="mt-6 inline-flex flex-col rounded-2xl border border-cyan-200/15 bg-cyan-200/8 px-5 py-4">
                  <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                    <AnimatedNumber
                      value={activeRole.metric.value}
                      prefix={activeRole.metric.prefix}
                      suffix={activeRole.metric.suffix}
                    />
                  </span>
                  <span className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-cyan-50/80">
                    {activeRole.metric.label}
                  </span>
                </div>
              ) : null}

              <div className="mt-7">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                  Selected contributions
                </p>
                <ul className="mt-4 space-y-4">
                  {activeRole.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-sm leading-7 text-slate-300 sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {activeRoleSkills.length > 0 ? (
                <div className="mt-7 print:hidden">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                    Skills in this role
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeRoleSkills.map((skill) => {
                      const hit = highlight?.skills.has(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => pickSkill(skill)}
                          className={`rounded-full border px-2.5 py-1 text-xs transition ${
                            hit
                              ? "border-amber-200/40 bg-amber-200/15 text-amber-50"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {skill.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 print:hidden">
                <ChevronRight className="h-3.5 w-3.5" />
                Select another role on the timeline
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <div className="resume-panel mt-8 rounded-[2rem] border border-white/12 bg-white/6 p-5 backdrop-blur-2xl sm:p-7 print:hidden">
        <div className="mb-5 max-w-2xl">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
            Skills &amp; roles graph
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Roles connect to the skills they evidenced. Pick a focus above and
            that cluster pulls to the center; click a skill to see every role
            behind it.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="h-[440px] rounded-[1.5rem] border border-white/10 bg-[#050d18]/70 sm:h-[540px]" />
          }
        >
          <SkillGraph
            focus={activeFocus}
            highlight={highlight}
            selectedRole={selectedRole}
            onToggleFocus={toggleFocus}
            onSelectRole={openRole}
            onSelectSkill={pickSkill}
          />
        </Suspense>
      </div>

      <div className="mt-8">
        <JobMatch
          active={highlight?.label === "Job posting match"}
          onApply={setHighlight}
          onClear={() => setHighlight(null)}
          onSelectRole={openRole}
        />
      </div>
    </section>
    </MotionConfig>
  );
}
