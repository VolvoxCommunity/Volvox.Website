"use client";

import { useEffect } from "react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

declare global {
  interface Window {
    Cal?: any;
  }
}

export function BookAMeetingClient() {
  useEffect(() => {
    // Cal.com Official Embed Loader snippet
    ((C: any, A: string, L: string) => {
      const p = (a: any, ar: any) => {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = d.createElement("script");
            script.src = A;
            d.head.appendChild(script);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    if (window.Cal) {
      window.Cal("init", "book-a-meeting", { origin: "https://app.cal.com" });

      window.Cal.ns["book-a-meeting"]("inline", {
        elementOrSelector: "#my-cal-inline-book-a-meeting",
        config: {
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "auto",
        },
        calLink: "bill-chirico/book-a-meeting",
      });

      window.Cal.ns["book-a-meeting"]("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#0068d9" },
          dark: { "cal-brand": "#40a3ff" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navigation linkMode />

      <main className="flex-1 container mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-editorial font-medium italic tracking-tight mb-4 text-foreground">
            Book a Meeting
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Schedule a conversation with Bill Chirico to discuss your project,
            explore a potential partnership, or chat about software engineering.
          </p>
        </div>

        <div
          id="my-cal-inline-book-a-meeting"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          className="w-full min-h-[700px]"
        />
      </main>

      <Footer />
    </div>
  );
}
