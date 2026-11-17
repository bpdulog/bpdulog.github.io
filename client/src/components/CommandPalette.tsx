import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { focusAreas, roles, type FocusArea } from "@/lib/career";
import { skills, type Skill } from "@/lib/skills";

type CommandPaletteProps = {
  onPickRole: (company: string) => void;
  onPickSkill: (skill: Skill) => void;
  onPickFocus: (focus: FocusArea) => void;
};

// Every typed word must appear in the item text. Stricter than cmdk's default
// fuzzy matching, which lets "basel" match unrelated long strings.
const wordFilter = (value: string, search: string) => {
  const haystack = value.toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
    ? 1
    : 0;
};

export default function CommandPalette({
  onPickRole,
  onPickSkill,
  onPickFocus,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white print:hidden"
      >
        <Search className="h-3.5 w-3.5" />
        Search roles &amp; skills
        <kbd className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[0.62rem] tracking-wider text-slate-400 sm:inline">
          Ctrl K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        filter={wordFilter}
        title="Search the resume"
        description="Jump to a role, highlight a skill, or filter by focus area."
      >
        <CommandInput placeholder="Try “FTP”, “Basel”, “automation”, “PNC”…" />
        <CommandList>
          <CommandEmpty>No match. Try a skill, employer, or topic.</CommandEmpty>

          <CommandGroup heading="Roles">
            {roles.map((role) => (
              <CommandItem
                key={role.company}
                value={`${role.company} ${role.shortName} ${role.title} ${role.focus.join(" ")}`}
                onSelect={() => run(() => onPickRole(role.company))}
              >
                <span className="font-medium">{role.shortName}</span>
                <span className="ml-2 truncate text-muted-foreground">
                  {role.title}
                </span>
                <CommandShortcut>{role.period.split(" - ")[0]}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Skills (highlights matching roles)">
            {skills.map((skill) => (
              <CommandItem
                key={skill.id}
                value={`${skill.label} ${skill.keywords.join(" ")}`}
                onSelect={() => run(() => onPickSkill(skill))}
              >
                {skill.label}
                <CommandShortcut>
                  {skill.kind === "tool" ? "tool" : skill.focus.split(" ")[0]}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Focus areas">
            {focusAreas.map((focus) => (
              <CommandItem
                key={focus}
                value={`focus ${focus}`}
                onSelect={() => run(() => onPickFocus(focus))}
              >
                {focus}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
