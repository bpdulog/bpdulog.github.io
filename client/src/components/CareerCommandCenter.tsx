import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ChevronRight,
  Clock3,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type FocusArea =
  | "All"
  | "Treasury & FTP"
  | "Risk & Regulation"
  | "Analytics & Systems";

type FocusTag = Exclude<FocusArea, "All">;

type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

type Role = {
  company: string;
  shortName: string;
  location: string;
  title: string;
  period: string;
  startYear: number;
  endYear: number;
  current?: boolean;
  focus: FocusTag[];
  summary: string;
  highlights: string[];
  signal: string;
  metric?: Metric;
};

const focusAreas: FocusArea[] = [
  "All",
  "Treasury & FTP",
  "Risk & Regulation",
  "Analytics & Systems",
];

const roles: Role[] = [
  {
    company: "Webster Bank",
    shortName: "Webster",
    location: "White Plains, NY",
    title: "Director, Funds Transfer Pricing & Financial Systems",
    period: "Oct 2025 - Present",
    startYear: 2025.75,
    endYear: 2026.7,
    current: true,
    focus: ["Treasury & FTP", "Analytics & Systems"],
    summary:
      "Own FTP methodology, reporting, and the systems behind them.",
    highlights: [
      "Produce recurring FTP performance analytics and executive reporting for senior management and business leaders.",
      "Design and maintain transfer-pricing methodologies that allocate funding costs and revenues across business units.",
      "Partner with finance and technology teams on system enhancements, workflow improvements, and analytical features.",
      "Monitor rate curves and pricing mechanisms for alignment with markets, regulatory expectations, and risk standards.",
    ],
    signal: "Current role",
  },
  {
    company: "USAlliance Financial",
    shortName: "USAlliance",
    location: "Rye, NY",
    title: "Financial Analyst",
    period: "Mar 2024 - Oct 2025",
    startYear: 2024.2,
    endYear: 2025.75,
    focus: ["Analytics & Systems", "Treasury & FTP"],
    summary:
      "Loan pricing and reserve models, plus automating reporting.",
    highlights: [
      "Built sophisticated models to price individual and pooled loans for purchase and sale.",
      "Engineered a credit-loss-reserve model for home-improvement loans.",
      "Automated manual financial-reporting steps to improve speed and repeatability.",
    ],
    signal: "Modeling + automation",
  },
  {
    company: "PNC Bank",
    shortName: "PNC",
    location: "New York, NY",
    title: "Funds Transfer Pricing Vice President",
    period: "Apr 2022 - Mar 2024",
    startYear: 2022.25,
    endYear: 2024.2,
    focus: ["Treasury & FTP", "Analytics & Systems"],
    summary:
      "FTP analysis, a small team, and automation of manual work.",
    highlights: [
      "Temporarily led a team of four analysts, increasing productivity by 10% during a four-month assignment.",
      "Automated manual work and introduced systems that saved 20 hours each month.",
      "Reviewed balance-sheet and profitability metrics to inform pricing and funding recommendations for net interest income, liquidity, and interest-rate risk.",
      "Prepared executive reporting and maintained relationships with auditors and regulators.",
    ],
    signal: "10% productivity gain",
    metric: { value: 10, suffix: "%", label: "Productivity gain led" },
  },
  {
    company: "Wolfe Research",
    shortName: "Wolfe",
    location: "New York, NY",
    title: "Equity Research Associate",
    period: "Jun 2021 - Jan 2022",
    startYear: 2021.4,
    endYear: 2022,
    focus: ["Analytics & Systems"],
    summary:
      "Insurance sector research for institutional investors.",
    highlights: [
      "Helped launch coverage of 22 insurance companies in six weeks while managing competing priorities.",
      "Produced weekly and ad-hoc research on industry trends, earnings, M&A, ratings, and model updates.",
      "Cleaned and analyzed large-scale datasets, translating raw inputs into clear tables and charts for clients.",
    ],
    signal: "22 companies / 6 weeks",
    metric: { value: 22, label: "Companies covered in six weeks" },
  },
  {
    company:
      "U.S. Department of the Treasury - Office of the Comptroller of the Currency",
    shortName: "OCC",
    location: "New York, NY",
    title: "Large Bank Examiner",
    period: "Jun 2014 - Jun 2021",
    startYear: 2014.4,
    endYear: 2021.5,
    focus: ["Risk & Regulation", "Treasury & FTP"],
    summary:
      "Examined capital markets, liquidity, interest-rate risk, and stress testing at very large banks.",
    highlights: [
      "Served as capital-markets lead examiner for a $100B bank, setting supervisory strategy and leading examinations.",
      "Assessed interest-rate-risk management and stress-testing practices for a $1T bank; presented conclusions to senior bank and OCC leaders.",
      "Evaluated capital levels, recovery planning, liquidity runoff assumptions, LCR/NSFR metrics, and internal liquidity stress testing.",
      "Reviewed statistical models for risk-weighted assets and operational risk; coordinated Basel III retail-credit feedback with other agencies.",
    ],
    signal: "$1T risk oversight",
    metric: {
      value: 1,
      prefix: "$",
      suffix: "T",
      label: "Institutional risk scope",
    },
  },
  {
    company: "KPMG",
    shortName: "KPMG",
    location: "New York, NY",
    title: "Risk Consultant",
    period: "Oct 2010 - May 2014",
    startYear: 2010.75,
    endYear: 2014.4,
    focus: ["Risk & Regulation", "Analytics & Systems"],
    summary:
      "Risk, controls, and regulatory-reporting work for large banks.",
    highlights: [
      "Managed an engagement to develop operational-risk and controls data for a $300B banking client.",
      "Provided strategic and regulatory guidance to clients including Goldman Sachs and Bank of America.",
      "Reconciled general-ledger data to regulatory-reporting line items to strengthen reporting accuracy and control.",
    ],
    signal: "$300B client engagement",
    metric: {
      value: 300,
      prefix: "$",
      suffix: "B",
      label: "Client engagement led",
    },
  },
  {
    company: "U.S. Department of the Treasury - Office of Thrift Supervision",
    shortName: "OTS",
    location: "Jersey City, NJ",
    title: "Bank Examiner",
    period: "Jul 2008 - Oct 2010",
    startYear: 2008.5,
    endYear: 2010.75,
    focus: ["Risk & Regulation"],
    summary:
      "Started in bank supervision, examining institutions and presenting findings to boards.",
    highlights: [
      "Led a team of five examiners through a full bank examination for an institution with more than $100M in assets.",
      "Approved workstream ratings and recommendations, acted as lead liaison to management, and presented conclusions to senior management and the board.",
    ],
    signal: "Examination leadership",
    metric: { value: 5, label: "Examiners led on one exam" },
  },
];

const focusStyles: Record<
  FocusTag,
  { bar: string; dot: string; chip: string }
> = {
  "Treasury & FTP": {
    bar: "from-cyan-300 to-cyan-200/50",
    dot: "bg-cyan-200",
    chip: "border-cyan-200/25 bg-cyan-200/10 text-cyan-50",
  },
  "Risk & Regulation": {
    bar: "from-amber-300 to-amber-200/50",
    dot: "bg-amber-200",
    chip: "border-amber-200/25 bg-amber-200/10 text-amber-50",
  },
  "Analytics & Systems": {
    bar: "from-emerald-300 to-emerald-200/50",
    dot: "bg-emerald-200",
    chip: "border-emerald-200/25 bg-emerald-200/10 text-emerald-50",
  },
};

const kpis = [
  {
    icon: Clock3,
    value: 15,
    suffix: "+",
    label: "Years in financial services",
  },
  {
    icon: Layers,
    value: 7,
    label: "Roles across banking, consulting, and regulation",
  },
  {
    icon: ShieldCheck,
    value: 1,
    prefix: "$",
    suffix: "T",
    label: "Peak institutional risk scope",
  },
  {
    icon: TrendingUp,
    value: 10,
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

function KpiTile({
  icon: Icon,
  value,
  prefix,
  suffix,
  label,
  index,
}: {
  icon: typeof Clock3;
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
      <Icon className="h-4 w-4 text-cyan-100" />
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

  const filteredRoles = useMemo(
    () =>
      roles.filter(
        (role) => activeFocus === "All" || role.focus.includes(activeFocus),
      ),
    [activeFocus],
  );

  return (
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
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            label={kpi.label}
            index={index}
          />
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
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
                {roles.map((role, index) => {
                  const isSelected = role.company === selectedRole;
                  const isDimmed =
                    activeFocus !== "All" && !role.focus.includes(activeFocus);
                  const style = focusStyles[role.focus[0]];
                  return (
                    <button
                      key={role.company}
                      type="button"
                      onClick={() => setSelectedRole(role.company)}
                      aria-pressed={isSelected}
                      className={`grid w-full grid-cols-[104px_1fr] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition duration-300 ${
                        isSelected
                          ? "border-cyan-200/30 bg-cyan-200/10"
                          : "border-transparent hover:border-white/15 hover:bg-white/5"
                      } ${isDimmed ? "opacity-35" : "opacity-100"}`}
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
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-6 text-slate-500">
            Showing {filteredRoles.length} of {roles.length} roles for the
            selected focus. Bar length reflects time in each seat.
          </p>
        </div>

        <div className="relative">
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

              <div className="mt-7 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 print:hidden">
                <ChevronRight className="h-3.5 w-3.5" />
                Select another role on the timeline
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
