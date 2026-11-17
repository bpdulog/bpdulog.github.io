import { useMemo, useState } from "react";
import { ClipboardPaste, Wand2, X } from "lucide-react";
import { matchPosting, skills, type Highlight } from "@/lib/skills";

const SAMPLE = `Director, Funds Transfer Pricing & Balance Sheet Analytics
Lead our FTP methodology, liquidity cost allocation, and net interest income reporting. Partner with Treasury and technology on system enhancements and automate recurring reporting using Python and SQL. Present to senior management and the board. Familiarity with interest rate risk, stress testing, and Basel III capital requirements preferred.`;

type JobMatchProps = {
  active: boolean;
  onApply: (highlight: Highlight) => void;
  onClear: () => void;
  onSelectRole: (company: string) => void;
};

export default function JobMatch({
  active,
  onApply,
  onClear,
  onSelectRole,
}: JobMatchProps) {
  const [text, setText] = useState("");
  const result = useMemo(() => matchPosting(text), [text]);

  return (
    <div className="resume-panel rounded-[2rem] border border-white/12 bg-white/6 p-5 backdrop-blur-2xl sm:p-7 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
            Skill match
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
            Paste a job description to see where I fit.
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Matching runs in your browser. Nothing you paste is sent anywhere.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setText(SAMPLE)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          Try a sample posting
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Paste the responsibilities and requirements here…"
        aria-label="Job description"
        className="mt-5 w-full resize-y rounded-2xl border border-white/10 bg-[#050d18]/70 p-4 text-sm leading-6 text-slate-200 placeholder:text-slate-500 focus:border-cyan-200/40 focus:outline-none"
      />

      {text.trim().length >= 20 && result ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
              {result.matchedSkills.length} of {skills.length} skills mentioned
            </p>
            {result.matchedSkills.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                No overlap detected. The posting may use different wording.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.matchedSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-cyan-200/25 bg-cyan-200/10 px-2.5 py-1 text-xs text-cyan-50"
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
              Most relevant roles
            </p>
            <ul className="mt-3 space-y-2">
              {result.rankedRoles.slice(0, 4).map(({ role, skills: hits }) => (
                <li key={role.company}>
                  <button
                    type="button"
                    onClick={() => onSelectRole(role.company)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-left text-sm transition hover:border-cyan-200/30 hover:bg-white/10"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-white">
                        {role.shortName}
                        <span className="ml-2 font-normal text-slate-400">
                          {role.title}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {hits.map((h) => h.label).join(" · ")}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-cyan-100">
                      {hits.length} match{hits.length === 1 ? "" : "es"}
                    </span>
                  </button>
                </li>
              ))}
              {result.rankedRoles.length === 0 ? (
                <li className="text-sm text-slate-400">
                  No role-specific overlap found.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
            <button
              type="button"
              onClick={() => onApply(result.highlight)}
              disabled={result.matchedSkills.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/15 px-4 py-2 text-sm text-cyan-50 transition hover:bg-cyan-200/25 disabled:opacity-40"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Highlight on timeline &amp; graph
            </button>
            {active ? (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                Clear highlight
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
