import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatPageClient } from "./chat-page-client";

export const metadata: Metadata = {
  title: "Ask Volvox",
  description:
    "Chat with the Volvox Assistant. Ask about our team, products, and community — the assistant adapts to your question.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageClient />
    </Suspense>
  );
}
