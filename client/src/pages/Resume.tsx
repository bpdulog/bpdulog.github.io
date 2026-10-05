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
import CareerCommandCenter from "@/components/CareerCommandCenter";

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
                I run funds transfer pricing and financial systems at a bank.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                I have 15+ years in financial services: bank supervision at the
                OCC, risk consulting, equity research, and now treasury and
                funds transfer pricing. I also write Python, R, and SQL to
                automate reporting and build models.
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
                    ["$1T", "Largest bank I examined"],
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
                  risk, and analytics roles.
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

        <CareerCommandCenter />

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
                  Open to conversations about treasury, risk, and analytics roles.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  LinkedIn is the best way to reach me. My code is on GitHub.
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
                  See my code <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
