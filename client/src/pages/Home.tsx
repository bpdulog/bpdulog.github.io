/*
Design philosophy for this page: Neo-financial futurism.
Use asymmetrical composition, low-key surfaces, precise typography, restrained luminous accents,
and atmospheric motion that reinforces analytical credibility rather than generic startup energy.
*/

import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Workflow,
  ChartNoAxesCombined,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type GitHubProfile = {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  html_url: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  homepage: string | null;
  fork: boolean;
  updated_at: string;
};

const featuredRepoNames = [
  "Python_Projects",
  "Resume",
  "Tepper",
  "ml-coursera-python-assignments",
  "ML-with-Python-Tepper-CY21-AW4",
];

const principles = [
  {
    title: "Forecasting mindset",
    description:
      "A finance and risk background informs a practical approach to modeling, trend interpretation, and structured decision-making.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Automation focus",
    description:
      "Python, R, and SQL are used to reduce repetition, improve reporting flow, and turn manual processes into repeatable systems.",
    icon: Workflow,
  },
  {
    title: "Analytical tooling",
    description:
      "Projects emphasize clear logic, durable workflows, and useful outputs rather than novelty for its own sake.",
    icon: Database,
  },
];

const spotlightLinks = [
  {
    label: "GitHub",
    href: "https://github.com/bpdulog",
    description: "Code, notebooks, and learning in public",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bryandulog/",
    description: "Professional background and experience",
  },
];

const floatingShapes = [
  {
    className:
      "left-[-6%] top-28 h-40 w-40 border border-cyan-200/25 bg-cyan-300/8 shadow-[0_0_80px_rgba(103,232,249,0.18)] sm:h-56 sm:w-56 lg:top-36 lg:h-72 lg:w-72",
    duration: 13,
    x: [0, 26, -12, 0],
    y: [0, -18, 20, 0],
    rotate: [0, 10, -8, 0],
  },
  {
    className:
      "right-[8%] top-[12rem] h-24 w-24 border border-amber-200/20 bg-amber-100/8 shadow-[0_0_65px_rgba(251,191,36,0.18)] sm:h-32 sm:w-32 lg:h-40 lg:w-40",
    duration: 11,
    x: [0, -16, 18, 0],
    y: [0, 18, -14, 0],
    rotate: [0, -14, 8, 0],
  },
  {
    className:
      "right-[-10%] top-[30rem] h-56 w-56 border border-white/12 bg-white/6 shadow-[0_0_110px_rgba(165,243,252,0.12)] sm:h-72 sm:w-72 lg:h-[24rem] lg:w-[24rem]",
    duration: 17,
    x: [0, -34, 10, 0],
    y: [0, -24, 26, 0],
    rotate: [0, 6, -10, 0],
  },
  {
    className:
      "left-[18%] top-[42rem] h-20 w-20 border border-cyan-100/20 bg-white/8 shadow-[0_0_55px_rgba(103,232,249,0.2)] sm:h-24 sm:w-24 lg:h-28 lg:w-28",
    duration: 9,
    x: [0, 14, -8, 0],
    y: [0, -16, 10, 0],
    rotate: [0, 18, -16, 0],
  },
];

const heroShapes = [
  {
    className:
      "left-[-8%] top-[12%] h-28 w-28 border border-cyan-200/20 bg-cyan-200/10 sm:h-36 sm:w-36",
    duration: 8,
    x: [0, 12, -8, 0],
    y: [0, -10, 8, 0],
    rotate: [0, 12, -8, 0],
  },
  {
    className:
      "right-[8%] top-[8%] h-16 w-16 border border-white/16 bg-white/8 sm:h-20 sm:w-20",
    duration: 7,
    x: [0, -10, 8, 0],
    y: [0, 10, -8, 0],
    rotate: [0, -16, 10, 0],
  },
  {
    className:
      "right-[14%] bottom-[14%] h-24 w-24 border border-amber-200/20 bg-amber-100/8 sm:h-28 sm:w-28",
    duration: 10,
    x: [0, -12, 10, 0],
    y: [0, 12, -10, 0],
    rotate: [0, 10, -14, 0],
  },
];

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="group rounded-full border border-white/12 bg-white/6 px-4 py-2 backdrop-blur-xl transition duration-300 hover:border-cyan-300/30 hover:bg-white/10">
      <div className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">{label}</div>
      <div className="mt-1 text-base font-medium text-white">{value}</div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-cyan-100/80">
      <Sparkles className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadGitHubData() {
      try {
        const [profileResponse, repoResponse] = await Promise.all([
          fetch("https://api.github.com/users/bpdulog"),
          fetch("https://api.github.com/users/bpdulog/repos?sort=updated&per_page=100"),
        ]);

        if (!profileResponse.ok || !repoResponse.ok) {
          return;
        }

        const profileData = (await profileResponse.json()) as GitHubProfile;
        const repoData = (await repoResponse.json()) as GitHubRepo[];

        if (!cancelled) {
          setProfile(profileData);
          setRepos(repoData);
        }
      } catch {
        // Silent fallback to static content.
      }
    }

    loadGitHubData();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredRepos = useMemo(() => {
    if (!repos.length) {
      return [
        {
          id: 1,
          name: "Python_Projects",
          html_url: "https://github.com/bpdulog/Python_Projects",
          description: "A collection of Python exercises and applied learning projects.",
          stargazers_count: 0,
          language: "Jupyter Notebook",
          homepage: null,
          fork: false,
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Resume",
          html_url: "https://github.com/bpdulog/Resume",
          description: "Resume materials and career-facing documents.",
          stargazers_count: 0,
          language: "Markdown",
          homepage: null,
          fork: false,
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Tepper",
          html_url: "https://github.com/bpdulog/Tepper",
          description: "Academic and technical work connected to Tepper coursework.",
          stargazers_count: 0,
          language: "Jupyter Notebook",
          homepage: null,
          fork: false,
          updated_at: new Date().toISOString(),
        },
      ];
    }

    const curated = featuredRepoNames
      .map((name) => repos.find((repo) => repo.name === name))
      .filter(Boolean) as GitHubRepo[];

    const unique = Array.from(
      new Map([...curated, ...repos.filter((repo) => !repo.fork)].map((repo) => [repo.id, repo])).values(),
    );

    return unique.slice(0, 6);
  }, [repos]);

  const displayName = profile?.name ?? "Bryan Dulog";
  const avatar =
    profile?.avatar_url ??
    "https://avatars.githubusercontent.com/u/251464424?v=4";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-100 selection:bg-cyan-300/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,231,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,194,122,0.10),transparent_26%),linear-gradient(180deg,#08111d_0%,#091523_48%,#07111f_100%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" />

      <div className="orbital orbital-one" />
      <div className="orbital orbital-two" />
      <div className="orbital orbital-three" />
      <div className="grid-haze pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full backdrop-blur-2xl ${shape.className}`}
            animate={{ x: shape.x, y: shape.y, rotate: shape.rotate }}
            transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <header className="relative z-10 container pt-6 sm:pt-8">
        <nav className="flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold tracking-[0.28em] text-cyan-50">
              BD
            </div>
            <div>
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Finance × Code × Systems</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {spotlightLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="container pb-20 pt-10 sm:pb-28 sm:pt-16 lg:pt-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <SectionEyebrow>Personal homepage</SectionEyebrow>
              <div className="space-y-7">
                <p className="max-w-xl text-sm uppercase tracking-[0.32em] text-slate-400">
                  Building practical systems for forecasting, automation, and analytical work.
                </p>
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Finance-trained,
                  <br />
                  code-driven,
                  <br />
                  focused on useful systems.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  I&apos;m <span className="text-white">{displayName}</span>, a New York-based builder with a background in
                  finance and financial risk management. I use <span className="text-cyan-100">Python</span>,
                  <span className="text-cyan-100"> R</span>, and <span className="text-cyan-100">SQL</span> to explore
                  forecasting, automate repeatable work, and turn analysis into practical outputs.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button asChild className="h-12 rounded-full bg-cyan-200 px-6 text-sm font-medium text-slate-950 hover:bg-cyan-100">
                  <a href="https://github.com/bpdulog" target="_blank" rel="noreferrer">
                    View GitHub
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:bg-white/10">
                  <a href="https://www.linkedin.com/in/bryandulog/" target="_blank" rel="noreferrer">
                    Connect on LinkedIn
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <StatPill value={String(profile?.public_repos ?? 14)} label="Public repos" />
                <StatPill value={String(profile?.followers ?? 2)} label="Followers" />
                <StatPill value={profile?.location ?? "New York, NY"} label="Based in" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto w-full max-w-2xl"
            >
              <div className="hero-frame relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/7 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(132,235,255,0.14),transparent_38%,transparent_58%,rgba(255,201,130,0.08))]" />
                <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#09111c]">
                  <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663031955229/59HmZn2tE9b6m7mERtJd98/bpdulog-hero-ambient-01-Lc9HxJRpJYmeoPFCGqUyYk.webp')] bg-cover bg-center opacity-70 mix-blend-screen" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(103,232,249,0.14),transparent_18%),radial-gradient(circle_at_78%_74%,rgba(251,191,36,0.12),transparent_16%)]" />
                  {heroShapes.map((shape, index) => (
                    <motion.div
                      key={index}
                      className={`absolute rounded-full backdrop-blur-xl ${shape.className}`}
                      animate={{ x: shape.x, y: shape.y, rotate: shape.rotate }}
                      transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                  <div className="relative grid min-h-[520px] grid-rows-[auto_1fr_auto] gap-6 p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl">
                        Analytical operator
                      </div>
                      <div className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-cyan-50 backdrop-blur-xl">
                        Forecasting & automation
                      </div>
                    </div>

                    <div className="flex flex-col justify-end gap-6">
                      <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-slate-950/55 px-4 py-3 backdrop-blur-xl">
                        <img src={avatar} alt={displayName} className="h-14 w-14 rounded-full object-cover ring-1 ring-white/10" />
                        <div>
                          <p className="text-base font-medium text-white">{displayName}</p>
                          <p className="mt-1 text-sm text-slate-300">{profile?.bio ?? "Finance, risk, and technical problem solving."}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/48 p-5 backdrop-blur-xl">
                          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-400">Primary tools</p>
                          <p className="mt-4 text-2xl font-medium text-white">Python, R, SQL</p>
                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            A practical stack for analysis, process improvement, and repeatable reporting.
                          </p>
                        </div>
                        <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/48 p-5 backdrop-blur-xl">
                          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-400">Current direction</p>
                          <p className="mt-4 text-2xl font-medium text-white">From models to systems</p>
                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            Learning in public through repositories that connect theory, code, and useful outputs.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 backdrop-blur-xl">
                        <MapPin className="h-4 w-4 text-cyan-100" />
                        {profile?.location ?? "New York, NY"}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 backdrop-blur-xl">
                        <Github className="h-4 w-4 text-cyan-100" />
                        github.com/bpdulog
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container pb-20 sm:pb-28">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75 }}
              className="rounded-[2rem] border border-white/10 bg-white/6 p-7 backdrop-blur-2xl sm:p-8"
            >
              <SectionEyebrow>Approach</SectionEyebrow>
              <h2 className="max-w-md text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                A career arc grounded in risk, translated into technical craft.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                The work here sits at the intersection of structured thinking and hands-on implementation. The goal is not
                just to analyze outcomes, but to build workflows that make those outcomes easier to produce again.
              </p>
              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-400">Positioning</p>
                <p className="mt-3 text-lg leading-8 text-slate-200">
                  Finance background. Technical toolkit. Practical interest in forecasting, automation, and better analytical systems.
                </p>
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-3">
              {principles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ duration: 0.7, delay: index * 0.08 }}
                    className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-cyan-200/20 hover:bg-white/8"
                  >
                    <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663031955229/59HmZn2tE9b6m7mERtJd98/bpdulog-mesh-detail-03-S3EJC53UxpenwGMidRpEHx.webp')] bg-cover bg-center opacity-0 transition duration-500 group-hover:opacity-20" />
                    <div className="relative">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/18 bg-cyan-200/10 text-cyan-50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 text-xl font-medium text-white">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container pb-24 sm:pb-32">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionEyebrow>Selected work</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Repositories that map the learning journey.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              A mix of notebooks, portfolio material, and technical exercises that reflect experimentation, structured learning, and practical implementation.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredRepos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.72, delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl transition duration-500 hover:-translate-y-1.5 hover:border-cyan-200/25 hover:bg-white/8 sm:p-7"
              >
                <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663031955229/59HmZn2tE9b6m7mERtJd98/bpdulog-section-orbits-02-NPbkSRBmkLTkopUsCVUYCS.webp')] bg-cover bg-right opacity-0 transition duration-500 group-hover:opacity-20" />
                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-400">Repository</p>
                        <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-white">{repo.name}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-slate-300">
                        {repo.language ?? "Code"}
                      </span>
                    </div>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                      {repo.description ?? "Open repository on GitHub to view the full project details and source materials."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-slate-300">
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                        Stars: {repo.stargazers_count}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                        Updated {new Date(repo.updated_at).getFullYear()}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-cyan-100">
                      Open
                      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="container pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72 }}
            className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/6 px-6 py-8 backdrop-blur-2xl sm:px-8 sm:py-10"
          >
            <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663031955229/59HmZn2tE9b6m7mERtJd98/bpdulog-mesh-detail-03-S3EJC53UxpenwGMidRpEHx.webp')] bg-cover bg-center opacity-15" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionEyebrow>Connect</SectionEyebrow>
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  If you want to follow the transition from analysis to implementation, start here.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  This homepage is designed as a concise entry point into Bryan Dulog&apos;s work: finance-rooted reasoning, technical curiosity, and a growing body of practical repositories.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild className="h-12 rounded-full bg-white px-6 text-sm text-slate-950 hover:bg-slate-100">
                  <a href="https://github.com/bpdulog" target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Visit GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full border-white/15 bg-white/6 px-6 text-sm text-white hover:bg-white/10">
                  <a href="https://www.linkedin.com/in/bryandulog/" target="_blank" rel="noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Visit LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
