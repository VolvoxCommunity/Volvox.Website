"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface ProductChangelogProps {
  content: string | null;
}

/**
 * Changelog section rendering markdown content.
 */
export function ProductChangelog({ content }: ProductChangelogProps) {
  if (!content) {
    return null;
  }

  return (
    <section id="changelog" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-bold prose-h1:mb-8
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-medium
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-muted-foreground
            prose-p:text-muted-foreground
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </motion.div>
      </div>
    </section>
  );
}
