import { roles, type FocusTag, type Role } from "./career";

/* Each skill is tied to the roles whose highlights evidence it.
   Tools have no role edges: they link to their focus hub only. */

export type Skill = {
  id: string;
  label: string;
  focus: FocusTag;
  /** shortName of each role that evidences the skill */
  roles: string[];
  /** extra phrases that count as a mention of this skill in a job posting */
  keywords: string[];
  kind: "skill" | "tool";
};

export const skills: Skill[] = [
  // Treasury & FTP
  { id: "ftp", label: "Funds transfer pricing", focus: "Treasury & FTP", roles: ["Webster", "PNC"], kind: "skill", keywords: ["ftp", "transfer pricing", "funding cost", "matched maturity"] },
  { id: "rate-curves", label: "Rate curves", focus: "Treasury & FTP", roles: ["Webster"], kind: "skill", keywords: ["yield curve", "rate curve", "curve construction"] },
  { id: "nii", label: "NII & balance sheet", focus: "Treasury & FTP", roles: ["PNC"], kind: "skill", keywords: ["net interest income", "nii", "balance sheet", "profitability", "alm", "asset liability", "asset-liability"] },
  { id: "loan-pricing", label: "Loan pricing", focus: "Treasury & FTP", roles: ["USAlliance"], kind: "skill", keywords: ["pricing model", "loan sale", "loan purchase", "pooled loans"] },
  { id: "irr", label: "Interest-rate risk", focus: "Treasury & FTP", roles: ["PNC", "OCC"], kind: "skill", keywords: ["irrbb", "interest rate risk", "market risk"] },
  { id: "liquidity", label: "Liquidity risk", focus: "Treasury & FTP", roles: ["PNC", "OCC"], kind: "skill", keywords: ["liquidity", "lcr", "nsfr", "contingency funding", "treasury"] },
  { id: "exec-reporting", label: "Executive reporting", focus: "Treasury & FTP", roles: ["Webster", "PNC", "OCC", "OTS"], kind: "skill", keywords: ["senior management", "board", "stakeholder", "presentation"] },

  // Risk & Regulation
  { id: "supervision", label: "Bank supervision", focus: "Risk & Regulation", roles: ["OCC", "OTS"], kind: "skill", keywords: ["examiner", "examination", "supervision", "supervisory", "regulatory", "regulator", "occ", "fdic"] },
  { id: "basel", label: "Basel III & capital", focus: "Risk & Regulation", roles: ["OCC"], kind: "skill", keywords: ["basel", "capital planning", "capital adequacy", "ccar", "recovery planning", "risk-weighted"] },
  { id: "stress", label: "Stress testing", focus: "Risk & Regulation", roles: ["OCC"], kind: "skill", keywords: ["stress test", "dfast", "scenario analysis", "scenario"] },
  { id: "model-review", label: "Model review", focus: "Risk & Regulation", roles: ["OCC"], kind: "skill", keywords: ["model validation", "model risk", "sr 11-7", "model governance", "statistical model"] },
  { id: "op-risk", label: "Operational risk & controls", focus: "Risk & Regulation", roles: ["KPMG", "OCC"], kind: "skill", keywords: ["operational risk", "internal controls", "controls", "sox", "risk management"] },
  { id: "reg-reporting", label: "Regulatory reporting", focus: "Risk & Regulation", roles: ["KPMG"], kind: "skill", keywords: ["fr y-9c", "y-14", "call report", "reconciliation", "general ledger"] },
  { id: "capital-markets", label: "Capital markets", focus: "Risk & Regulation", roles: ["OCC"], kind: "skill", keywords: ["trading", "derivatives", "securities", "fixed income"] },
  { id: "advisory", label: "Client advisory", focus: "Risk & Regulation", roles: ["KPMG"], kind: "skill", keywords: ["consulting", "advisory", "client engagement", "client-facing"] },

  // Analytics & Systems
  { id: "automation", label: "Process automation", focus: "Analytics & Systems", roles: ["PNC", "USAlliance"], kind: "skill", keywords: ["automation", "automate", "automating", "workflow", "process improvement", "streamline"] },
  { id: "modeling", label: "Financial modeling", focus: "Analytics & Systems", roles: ["USAlliance", "Wolfe"], kind: "skill", keywords: ["financial model", "modeling", "forecasting", "valuation", "quantitative"] },
  { id: "credit-reserve", label: "Credit-loss reserves", focus: "Analytics & Systems", roles: ["USAlliance"], kind: "skill", keywords: ["cecl", "allowance", "credit loss", "reserve", "alll"] },
  { id: "fin-systems", label: "Financial systems", focus: "Analytics & Systems", roles: ["Webster", "PNC"], kind: "skill", keywords: ["systems", "oracle", "ofsaa", "hyperion", "essbase", "erp", "implementation", "enhancement"] },
  { id: "research", label: "Equity research", focus: "Analytics & Systems", roles: ["Wolfe"], kind: "skill", keywords: ["sell-side", "buy-side", "coverage", "earnings", "insurance"] },
  { id: "data-analysis", label: "Data analysis", focus: "Analytics & Systems", roles: ["Wolfe", "KPMG"], kind: "skill", keywords: ["analytics", "analytical", "dataset", "data quality"] },
  { id: "leadership", label: "Team leadership", focus: "Analytics & Systems", roles: ["PNC", "OTS"], kind: "skill", keywords: ["leadership", "lead a team", "manage a team", "mentor", "people management"] },

  // Tools (hub-only)
  { id: "python", label: "Python", focus: "Analytics & Systems", roles: [], kind: "tool", keywords: ["pandas", "numpy"] },
  { id: "r-lang", label: "R", focus: "Analytics & Systems", roles: [], kind: "tool", keywords: ["r programming", "rstudio", "tidyverse", "ggplot"] },
  { id: "sql", label: "SQL", focus: "Analytics & Systems", roles: [], kind: "tool", keywords: ["oracle sql", "toad", "postgres", "mysql"] },
  { id: "excel", label: "Advanced Excel", focus: "Analytics & Systems", roles: [], kind: "tool", keywords: ["excel", "vba", "spreadsheet", "pivot"] },
  { id: "tableau", label: "Tableau", focus: "Analytics & Systems", roles: [], kind: "tool", keywords: ["power bi", "dashboard", "visualization"] },
];

export const roleByShortName = (shortName: string) =>
  roles.find((role) => role.shortName === shortName);

export const skillsForRole = (role: Role) =>
  skills.filter((skill) => skill.roles.includes(role.shortName));

/* ---------------- Highlighting + job-posting match ---------------- */

export type Highlight = {
  label: string;
  roles: Set<string>; // role.company
  skills: Set<string>; // skill.id
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function mentions(text: string, phrase: string) {
  const re = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`,
    "i",
  );
  return re.test(text);
}

export type MatchResult = {
  highlight: Highlight;
  matchedSkills: Skill[];
  rankedRoles: { role: Role; skills: Skill[] }[];
};

/** Keyword match of a pasted job posting against skills and roles. Runs locally. */
export function matchPosting(posting: string): MatchResult | null {
  const text = posting.toLowerCase();
  if (text.trim().length < 20) return null;

  const matchedSkills = skills.filter(
    (skill) =>
      mentions(text, skill.label.toLowerCase()) ||
      skill.keywords.some((keyword) => mentions(text, keyword)),
  );

  const matchedIds = new Set(matchedSkills.map((skill) => skill.id));
  const rankedRoles = roles
    .map((role) => ({
      role,
      skills: skillsForRole(role).filter((skill) => matchedIds.has(skill.id)),
    }))
    .filter((entry) => entry.skills.length > 0)
    .sort((a, b) => b.skills.length - a.skills.length);

  return {
    matchedSkills,
    rankedRoles,
    highlight: {
      label: "Job posting match",
      skills: matchedIds,
      roles: new Set(rankedRoles.map((entry) => entry.role.company)),
    },
  };
}

export function highlightForSkill(skill: Skill): Highlight {
  return {
    label: skill.label,
    skills: new Set([skill.id]),
    roles: new Set(
      skill.roles
        .map((name) => roleByShortName(name)?.company)
        .filter((c): c is string => Boolean(c)),
    ),
  };
}
