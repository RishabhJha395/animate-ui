import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PreviewStage } from "./PreviewStage";
import type { ShowcaseComponent } from "../../types/component";

export function ComponentCard({ component }: { component: ShowcaseComponent }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="glass group overflow-hidden rounded-2xl p-3"
    >
      <PreviewStage component={component} />
      <div className="p-2 pt-4">
        <h3 className="text-lg font-semibold text-white">{component.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-400">
          {component.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {component.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/components/${component.slug}`}
          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white/[0.07] text-sm font-semibold text-white transition group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-violet-500"
        >
          View Component
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
