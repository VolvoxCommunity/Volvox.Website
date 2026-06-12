"use client";

import {
  GraduationCap,
  HandWaving,
  MagnifyingGlass,
  Tag,
  UsersThree,
} from "@phosphor-icons/react";
import type { VisitorIntent } from "@/lib/ai/types";

const STARTER_SUGGESTIONS = [
  {
    icon: Tag,
    text: "What products does Volvox build?",
  },
  {
    icon: UsersThree,
    text: "Who's on the Volvox team?",
  },
  {
    icon: HandWaving,
    text: "How do I join the community?",
  },
  {
    icon: MagnifyingGlass,
    text: "What is Volvox?",
  },
];

const PERSONA_CHIPS: Array<{
  intent: VisitorIntent;
  icon: typeof GraduationCap;
  label: string;
  description: string;
  prompt: string;
}> = [
  {
    intent: "beginner",
    icon: GraduationCap,
    label: "I'm new to coding",
    description: "Show me the on-ramp for beginners.",
    prompt: "I'm new to coding. Where should I start?",
  },
  {
    intent: "professional",
    icon: Tag,
    label: "I'm a developer",
    description: "I want to collaborate or contribute.",
    prompt: "I'm a developer. What can I work on or learn from at Volvox?",
  },
  {
    intent: "hirer",
    icon: UsersThree,
    label: "I'm looking to hire",
    description: "Show me the team and hireable members.",
    prompt:
      "I'm looking to hire. Who on the Volvox team is available, and what have they built?",
  },
];

interface ChatWelcomeProps {
  onPick: (text: string) => void;
  onPickPersona: (intent: VisitorIntent, text: string) => void;
}

export function ChatWelcome({ onPick, onPickPersona }: ChatWelcomeProps) {
  return (
    <div className="flex min-h-full flex-col gap-6 px-1 py-2 sm:px-2 sm:py-3">
      <div className="relative overflow-hidden rounded-[24px] bg-background/50 border border-border/40 p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-80 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(from var(--primary) l c h / 0.18), transparent 70%)",
          }}
        />
        <div className="relative space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-primary/20 bg-primary/10 text-primary">
            <HandWaving className="h-5 w-5" weight="fill" />
          </div>
          <div className="space-y-2">
            <h3 className="max-w-[14ch] font-[family-name:var(--font-jetbrains-mono)] text-2xl font-extrabold leading-tight tracking-tight text-foreground">
              Start with your angle.
            </h3>
            <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              Pick a role or ask directly. Answers can include products, team
              profiles, blog posts, and community next steps.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Who are you?
        </p>
        <div className="grid grid-cols-1 gap-2">
          {PERSONA_CHIPS.map((chip) => (
            <button
              key={chip.intent}
              type="button"
              onClick={() => onPickPersona(chip.intent, chip.prompt)}
              className="group flex items-center gap-3 rounded-[20px] border border-border/50 bg-background/50 p-3 text-left transition-[border-color,background-color,transform] hover:border-primary/40 hover:bg-background/80 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-border/40 bg-background text-primary transition-colors group-hover:bg-primary/10">
                <chip.icon className="h-4 w-4" weight="duotone" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {chip.label}
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {chip.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Quick prompts
        </p>
        <div className="flex flex-col gap-1.5">
          {STARTER_SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => onPick(s.text)}
              className="group flex items-center gap-2.5 rounded-full border border-border/40 bg-background/50 px-3.5 py-2 text-left text-sm text-foreground/80 transition-[border-color,background-color] hover:border-primary/30 hover:bg-background/80"
            >
              <s.icon
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                weight="duotone"
              />
              <span className="truncate">{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
