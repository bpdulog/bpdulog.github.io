export type FocusArea =
  | "All"
  | "Treasury & FTP"
  | "Risk & Regulation"
  | "Analytics & Systems";

export type FocusTag = Exclude<FocusArea, "All">;

export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Role = {
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

export const focusAreas: FocusArea[] = [
  "All",
  "Treasury & FTP",
  "Risk & Regulation",
  "Analytics & Systems",
];

export const roles: Role[] = [
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

export const focusStyles: Record<
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
