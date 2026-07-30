"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

const mentorshipContainerVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const mentorshipCardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

// Row sizes form an upside-down pyramid: 3 -> 2 -> 1 (== 6 members).
const ROW_LAYOUT = [3, 2, 1];

// Critically-damped spring (no overshoot) for the shared-element morph.
const MORPH_SPRING = { type: "spring", stiffness: 320, damping: 34 } as const;

interface MentorshipProps {
  teamMembers: TeamMember[];
}

export function Mentorship({ teamMembers }: MentorshipProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = teamMembers.find((m) => m.id === activeId) ?? null;
  const sectionRef = useRef<HTMLElement>(null);

  // Escape to close.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeId]);

  // Slice the flat list into centered pyramid rows.
  let cursor = 0;
  const rows = ROW_LAYOUT.map((count) => {
    const slice = teamMembers.slice(cursor, cursor + count);
    cursor += count;
    return slice;
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="mentorship"
        aria-label="Team of Experts"
        data-testid="mentorship-section"
        className="relative w-full bg-background py-24 md:py-32 antialiased md:min-h-screen"
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Centered headline */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mentorship-headline flex items-center justify-center text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-editorial italic font-medium tracking-tight text-foreground text-balance leading-tight">
              Team
            </h2>
          </motion.div>

          {/* Upside-down pyramid: 3 / 2 / 1, each row centered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={mentorshipContainerVariants}
            className="mentorship-pyramid flex flex-col items-center gap-6 md:gap-8"
          >
            {rows.map((row, ri) => (
              <motion.div
                key={ri}
                variants={{}} // row wrapper so stagger propagates to children
                className="flex flex-wrap items-start justify-center gap-4 sm:gap-5 md:gap-7"
              >
                {row.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={mentorshipCardVariants}
                    className="mentorship-card"
                  >
                    <ProfileCard
                      member={member}
                      onOpen={() => setActiveId(member.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Shared-element morph dialog */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setActiveId(null)}
                aria-hidden="true"
              />
              {/* Double-bezel shell morphs from the card */}
              <motion.div
                layoutId={`card-${active.id}`}
                transition={MORPH_SPRING}
                role="dialog"
                aria-modal="true"
                aria-label={active.name}
                className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-border/30 bg-card-deep/20 p-1.5 shadow-2xl"
              >
                <div className="flex flex-col gap-5 rounded-[calc(2.5rem-0.375rem)] border border-border/10 bg-card p-6 md:p-8 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                  {/* Row 1: PFP + Name + Title */}
                  <div className="flex items-center gap-4 z-10 w-full">
                    <motion.span
                      layoutId={`img-${active.id}`}
                      transition={MORPH_SPRING}
                      className="block h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-card-deep shadow-md relative"
                    >
                      <Image
                        src={active.avatar}
                        alt={active.name}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        draggable={false}
                        className="object-cover"
                      />
                    </motion.span>

                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-balance text-2xl sm:text-3xl font-editorial italic font-medium tracking-tight text-foreground leading-tight">
                        {active.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
                        {"role" in active ? active.role : ""}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Description left-aligned */}
                  <div className="z-10 w-full">
                    <p className="text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-4">
                      {("bio" in active ? active.bio : "") ?? active.tagline}
                    </p>
                  </div>

                  {/* Row 3: Button right-aligned */}
                  <div className="z-10 w-full flex justify-end pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="group/btn gap-2 rounded-full px-5 py-2 text-xs font-bold bg-secondary hover:bg-foreground hover:text-background transition-colors border-none"
                      onClick={() => router.push(`/team/${active.slug}`)}
                    >
                      View profile
                      <ArrowRight
                        weight="bold"
                        className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}

interface ProfileCardProps {
  member: TeamMember;
  onOpen: () => void;
}

function ProfileCard({ member, onOpen }: ProfileCardProps) {
  return (
    <motion.button
      layoutId={`card-${member.id}`}
      transition={MORPH_SPRING}
      onClick={onOpen}
      aria-label={`${member.name}, ${"role" in member ? member.role : ""}`}
      className={cn(
        "group flex w-32 sm:w-40 flex-col items-center gap-3 rounded-3xl p-3 sm:gap-3.5 cursor-pointer",
        "transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <motion.span
        layoutId={`img-${member.id}`}
        transition={MORPH_SPRING}
        className="block h-20 w-20 overflow-hidden rounded-xl bg-card-deep shadow-[0_4px_16px_-6px_rgba(0,0,0,0.25)] transition-shadow duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] sm:h-24 sm:w-24 relative"
      >
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 80px, 96px"
          draggable={false}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
      </motion.span>
      {/* Title only (role); one line, full value reachable in the dialog. */}
      <span className="w-full truncate text-center text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground font-mono">
        {"role" in member ? member.role : ""}
      </span>
    </motion.button>
  );
}
