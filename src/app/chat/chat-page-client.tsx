"use client";

import { ArrowLeft, ChatsCircle, Sparkle } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChatPanel } from "@/components/ai/chat-panel";
import { ChatProvider, useChatContext } from "@/components/ai/chat-provider";
import type { VisitorIntent } from "@/lib/ai/types";

const INTENT_VALUES = new Set<VisitorIntent>([
  "beginner",
  "professional",
  "hirer",
]);

function PageInner() {
  const params = useSearchParams();
  const { sendMessage, setExplicitSeed, messages, storageLoaded } =
    useChatContext();
  const intentParam = params.get("intent");
  const promptParam = params.get("q");
  const sentRef = useRef(false);

  useEffect(() => {
    if (intentParam && INTENT_VALUES.has(intentParam as VisitorIntent)) {
      setExplicitSeed(intentParam as VisitorIntent);
    }
  }, [intentParam, setExplicitSeed]);

  useEffect(() => {
    if (!promptParam || sentRef.current || !storageLoaded) return;
    const alreadySent = messages.some(
      (m) =>
        m.role === "user" &&
        m.parts?.some(
          (p) =>
            typeof p === "object" &&
            p !== null &&
            "type" in p &&
            p.type === "text" &&
            "text" in p &&
            (p as { text: string }).text === promptParam,
        ),
    );
    if (alreadySent) return;
    sentRef.current = true;
    const timer = setTimeout(() => {
      sendMessage({ text: promptParam });
    }, 300);
    return () => clearTimeout(timer);
  }, [promptParam, sendMessage, messages, storageLoaded]);

  return null;
}

export function ChatPageClient() {
  return (
    <ChatProvider>
      <PageInner />
      <main className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute -top-[28vw] left-1/2 h-[72vw] w-[72vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(from var(--primary) l c h / 0.18) 0%, transparent 68%)",
          }}
        />

        <header className="relative z-10 flex shrink-0 justify-center px-3 pt-3 sm:px-6 sm:pt-6">
          <nav className="flex w-full max-w-6xl items-center justify-between rounded-full border border-foreground/[0.08] bg-background/55 px-3 py-2 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-5">
            <Link
              href="/"
              className="flex items-center gap-3 no-underline"
              aria-label="Back to Volvox home"
            >
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-contain"
                priority
              />
              <span className="hidden font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-foreground sm:inline">
                Volvox
              </span>
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/75">
              <ChatsCircle className="h-4 w-4 text-primary" weight="fill" />
              Ask Volvox
            </div>
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label="Back to site"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden text-xs font-semibold sm:inline">
                Back
              </span>
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 min-h-0 grid-cols-1 gap-4 px-3 py-4 sm:px-6 sm:py-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="hidden min-h-0 flex-col justify-between rounded-[32px] bg-card p-2 lg:flex">
            <div className="relative min-h-[340px] overflow-hidden rounded-[24px] bg-background">
              <div
                className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-80 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(from var(--primary) l c h / 0.22), transparent 70%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-44 overflow-hidden rounded-[24px]">
                <div className="absolute inset-0 backdrop-blur-[9px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]" />
                <div className="absolute inset-0 backdrop-blur-[18px] [mask-image:linear-gradient(to_top,black_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
              <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-between p-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Sparkle className="h-3.5 w-3.5" weight="fill" />
                  Community intelligence
                </div>
                <div className="space-y-5">
                  <h1 className="font-[family-name:var(--font-jetbrains-mono)] text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                    Ask about the people, products, and path in.
                  </h1>
                  <p className="max-w-[36ch] text-sm leading-relaxed text-foreground/70">
                    The assistant answers from Volvox content and points you to
                    the right project, post, profile, or community next step.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 pt-4">
              {["Products", "Team", "Mentorship"].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-border/40 bg-background/60 px-3 py-2 text-center text-[11px] font-semibold text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <section className="min-h-0">
            <ChatPanel variant="fullscreen" />
          </section>
        </div>
      </main>
    </ChatProvider>
  );
}
