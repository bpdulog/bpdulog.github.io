import {
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  ChevronRight,
  Code2,
  GraduationCap,
  Linkedin,
  MapPin,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type FocusArea =
  | "All"
  | "Treasury & FTP"
  | "Risk & Regulation"
  | "Analytics & Systems";

type Role = {
  company: string;
  location: string;
  title: string;
  period: string;
  focus: Exclude<FocusArea, "All">[];
  summary: string;
  highlights: string[];
  signal: string;
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
    location: "White Plains, NY",
    title: "Director, Funds Transfer Pricing & Financial Systems",
    period: "Oct 2025 - Present",
    focus: ["Treasury & FTP", "Analytics & Systems"],
    summary:
      "Leading the financial systems and analytics that make balance-sheet profitability measurable and actionable.",
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
    location: "Rye, NY",
    title: "Financial Analyst",
    period: "Mar 2024 - Oct 2025",
    focus: ["Analytics & Systems", "Treasury & FTP"],
    summary:
      "Applied financial modeling and automation to pricing, reserves, and reporting operations.",
    highlights: [
      "Built sophisticated models to price individual and pooled loans for purchase and sale.",
      "Engineered a credit-loss-reserve model for home-improvement loans.",
      "Automated manual financial-reporting steps to improve speed and repeatability.",
    ],
    signal: "Modeling + automation",
  },
  {
    company: "PNC Bank",
    location: "New York, NY",
    title: "Funds Transfer Pricing Vice President",
    period: "Apr 2022 - Mar 2024",
    focus: ["Treasury & FTP", "Analytics & Systems"],
    summary:
      "Connected FTP methodology, team leadership, and automation to improve profitability insight and operating capacity.",
    highlights: [
      "Temporarily led a team of four analysts, increasing productivity by 10% during a four-month assignment.",
      "Automated manual work and introduced systems that saved 20 hours each month.",
      "Reviewed balance-sheet and profitability metrics to inform pricing and funding recommendations for net interest income, liquidity, and interest-rate risk.",
      "Prepared executive reporting and maintained relationships with auditors and regulators.",
    ],
    signal: "10% productivity gain",
  },
  {
    company: "Wolfe Research",
    location: "New York, NY",
    title: "Equity Research Associate",
    period: "Jun 2021 - Jan 2022",
    focus: ["Analytics & Systems"],
    summary:
      "Turned large financial datasets and fast-moving market events into timely, decision-ready investor research.",
    highlights: [
      "Helped launch coverage of 22 insurance companies in six weeks while managing competing priorities.",
      "Produced weekly and ad-hoc research on industry trends, earnings, M&A, ratings, and model updates.",
      "Cleaned and analyzed large-scale datasets, translating raw inputs into clear tables and charts for clients.",
    ],
    signal: "22 companies / 6 weeks",
  },
  {
    company:
      "U.S. Department of the Treasury - Office of the Comptroller of the Currency",
    location: "New York, NY",
    title: "Large Bank Examiner",
    period: "Jun 2014 - Jun 2021",
    focus: ["Risk & Regulation", "Treasury & FTP"],
    summary:
      "Assessed capital-markets, liquidity, interest-rate-risk, stress-testing, and capital-planning practices at systemically significant institutions.",
    highlights: [
      "Served as capital-markets lead examiner for a $100B bank, setting supervisory strategy and leading examinations.",
      "Assessed interest-rate-risk management and stress-testing practices for a $1T bank; presented conclusions to senior bank and OCC leaders.",
      "Evaluated capital levels, recovery planning, liquidity runoff assumptions, LCR/NSFR metrics, and internal liquidity stress testing.",
      "Reviewed statistical models for risk-weighted assets and operational risk; coordinated Basel III retail-credit feedback with other agencies.",
    ],
    signal: "$1T risk oversight",
  },
  {
    company: "KPMG",
    location: "New York, NY",
    title: "Risk Consultant",
    period: "Oct 2010 - May 2014",
    focus: ["Risk & Regulation", "Analytics & Systems"],
    summary:
      "Delivered risk, controls, fraud-review, and regulatory-reporting work for major financial institutions.",
    highlights: [
      "Managed an engagement to develop operational-risk and controls data for a $300B banking client.",
      "Provided strategic and regulatory guidance to clients including Goldman Sachs and Bank of America.",
      "Reconciled general-ledger data to regulatory-reporting line items to strengthen reporting accuracy and control.",
    ],
    signal: "$300B client engagement",
  },
  {
    company: "U.S. Department of the Treasury - Office of Thrift Supervision",
    location: "Jersey City, NJ",
    title: "Bank Examiner",
    period: "Jul 2008 - Oct 2010",
    focus: ["Risk & Regulation"],
    summary:
      "Built the supervisory foundation: examining financial institutions, leading teams, and communicating conclusions to boards.",
    highlights: [
      "Led a team of five examiners through a full bank examination for an institution with more than $100M in assets.",
      "Approved workstream ratings and recommendations, acted as lead liaison to management, and presented conclusions to senior management and the board.",
    ],
    signal: "Examination leadership",
  },
];

const capabilities = [
  {
    title: "Treasury & balance sheet",
    detail: "FTP methodology, profitability, liquidity, and interest-rate risk",
    icon: BarChart3,
  },
  {
    title: "Risk & governance",
    detail:
      "Capital planning, stress testing, regulatory examination, and controls",
    icon: ShieldCheck,
  },
  {
    title: "Financial systems",
    detail:
      "Executive reporting, workflow design, documentation, and process improvement",
    icon: Building2,
  },
  {
    title: "Data & automation",
    detail:
      "Python, R, SQL, Tableau, advanced Excel, and repeatable analytical workflows",
    icon: Code2,
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-cyan-100/90">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

export default function Resume() {
  const [activeFocus, setActiveFocus] = useState<FocusArea>("All");
  const [selectedRole, setSelectedRole] = useState(roles[0].company);

  const filteredRoles = useMemo(
    () =>
      roles.filter(
        (role) => activeFocus === "All" || role.focus.includes(activeFocus),
      ),
    [activeFocus],
  );
  const activeRole =
    roles.find((role) => role.company === selectedRole) ?? roles[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-100 selection:bg-cyan-300/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(110,231,255,0.18),transparent_24%),radial-gradient(circle_at_90%_20%,rgba(251,191,36,0.10),transparent_22%),linear-gradient(180deg,#08111d_0%,#091523_52%,#07111f_100%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" />
      <div className="grid-haze pointer-events-none absolute inset-0" />
      <div className="orbital orbital-one" />
      <div className="orbital orbital-two" />

      <header className="relative z-10 container pt-6 sm:pt-8 print:hidden">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <a
            href="/"
            className="group flex items-center gap-3"
            aria-label="Go to Bryan Dulog's homepage"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold tracking-[0.24em] text-cyan-50">
              BD
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-medium text-white">
                Bryan Dulog
              </span>
              <span className="block text-xs uppercase tracking-[0.22em] text-slate-400">
                Interactive resume
              </span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/bryandulog/"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white sm:inline-flex"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white transition hover:border-cyan-200/30 hover:bg-white/12"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="container pb-18 pt-12 sm:pb-24 sm:pt-18 lg:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
            >
              <Eyebrow>Career profile</Eyebrow>
              <p className="mt-7 text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
                CFA · FRM · Financial systems & treasury risk
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Making complex financial systems easier to see, steer, and
                improve.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Bryan is a financial-services leader with 15+ years across bank
                supervision, treasury, funds transfer pricing, financial
                systems, and data-driven analysis. He pairs regulatory depth
                with a builder&apos;s instinct for clearer reporting and smarter
                workflows.
              </p>
              <div className="mt-9 flex flex-wrap gap-3 print:hidden">
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                >
                  Explore experience <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/bryandulog/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="resume-panel relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/7 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,255,0.15),transparent_34%),linear-gradient(135deg,transparent_20%,rgba(251,191,36,0.07))]" />
              <div className="relative">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-400">
                  At a glance
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["15+", "Years in financial services"],
                    ["CFA", "Charterholder"],
                    ["FRM", "Financial Risk Manager"],
                    ["$1T", "Institutional risk scope"],
                  ].map(([value, label]) => (
                    <div
                      key={value}
                      className="rounded-2xl border border-white/10 bg-slate-950/38 p-4"
                    >
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
                        {value}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-200/15 bg-cyan-200/8 p-4 text-sm leading-6 text-cyan-50">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  New York metro area · Open to conversations about treasury,
                  risk, finance transformation, and analytics leadership.
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="container pb-20 sm:pb-28">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.article
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-[1.65rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/8"
                >
                  <Icon className="h-5 w-5 text-cyan-100" />
                  <h2 className="mt-6 text-lg font-semibold text-white">
                    {capability.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {capability.detail}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section
          id="experience"
          className="container scroll-mt-8 pb-24 sm:pb-32"
        >
          <div className="mb-8 max-w-3xl">
            <Eyebrow>Experience explorer</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              A career built where finance, risk, and systems meet.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Filter the timeline by the lens most relevant to your search, then
              select a role to see the full impact record.
            </p>
          </div>
          <div
            className="mb-7 flex flex-wrap gap-2 print:hidden"
            role="tablist"
            aria-label="Filter experience"
          >
            {focusAreas.map((focus) => (
              <button
                key={focus}
                type="button"
                onClick={() => setActiveFocus(focus)}
                role="tab"
                aria-selected={focus === activeFocus}
                className={`rounded-full border px-4 py-2 text-sm transition ${focus === activeFocus ? "border-cyan-200/30 bg-cyan-200/15 text-cyan-50" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
              >
                {focus}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
            <div className="space-y-3">
              {filteredRoles.map((role, index) => {
                const isSelected = selectedRole === role.company;
                return (
                  <motion.button
                    key={role.company}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.42, delay: index * 0.04 }}
                    onClick={() => setSelectedRole(role.company)}
                    className={`group w-full rounded-2xl border p-5 text-left transition ${isSelected ? "border-cyan-200/30 bg-cyan-200/10 shadow-[0_10px_50px_rgba(34,211,238,0.08)]" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
                          {role.period}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-white">
                          {role.company}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-slate-300">
                          {role.title}
                        </p>
                      </div>
                      <ChevronRight
                        className={`mt-1 h-4 w-4 shrink-0 transition ${isSelected ? "text-cyan-100" : "text-slate-500 group-hover:text-white"}`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <motion.article
              key={activeRole.company}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="resume-panel rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-2xl sm:p-8"
            >
              <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {activeRole.focus.map((focus) => (
                      <span
                        key={focus}
                        className="rounded-full border border-cyan-200/15 bg-cyan-200/8 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-cyan-50"
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
            </motion.article>
          </div>
        </section>

        <section className="container pb-24 sm:pb-32">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-white/10 bg-white/6 p-7 backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-cyan-100" />
                <Eyebrow>Education</Eyebrow>
              </div>
              <div className="mt-7 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Carnegie Mellon University - Tepper School of Business
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Master of Business Administration · Pittsburgh, PA · May
                    2022
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    President, Part-Time Graduate Business Association; Board
                    Member, Alpha Asset Management Club. First place, Cornell
                    Investment Portfolio Case Competition; third place, UCLA
                    Fink Credit Pitch Competition.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-xl font-semibold text-white">
                    Baruch College - Zicklin School of Business
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Bachelor of Business Administration · New York, NY · May
                    2008
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-[2rem] border border-white/10 bg-white/6 p-7 backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-amber-100" />
                <Eyebrow>Credentials & tools</Eyebrow>
              </div>
              <div className="mt-7">
                <p className="text-sm font-medium text-white">
                  Chartered Financial Analyst (CFA) · Financial Risk Manager
                  (FRM)
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Oracle Toad SQL",
                    "Oracle Financial Services Application",
                    "Hyperion / Essbase",
                    "Bloomberg",
                    "FactSet",
                    "S&P Capital IQ",
                    "Tableau",
                    "Advanced Excel",
                    "Python",
                    "R",
                    "SQL",
                    "HTML",
                    "JavaScript",
                  ].map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-xs text-slate-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="container pb-16 sm:pb-20 print:hidden">
          <div className="resume-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 px-7 py-9 backdrop-blur-2xl sm:px-9 sm:py-11">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(110,231,255,0.12),transparent_26%)]" />
            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow>Let&apos;s connect</Eyebrow>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Looking for a finance leader who can move from risk insight to
                  operating change?
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  Bryan brings the regulatory judgment, analytical rigor, and
                  technical fluency to build better financial decisions and the
                  systems behind them.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/bryandulog/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/bpdulog"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  View technical work <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
