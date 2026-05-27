import { motion } from "framer-motion";
import { Maximize2, Sparkles } from "lucide-react";
import type { ShowcaseComponent } from "../../types/component";

export function PreviewStage({ component, large = false }: { component: ShowcaseComponent; large?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-400/28 via-cyan-300/22 to-white/8 ${
        large ? "min-h-[260px] sm:min-h-[360px] lg:min-h-[420px]" : "h-52 sm:h-56"
      }`}
    >
      <div className="absolute inset-0 grid-floor opacity-35" />
      {component.preview_image ? (
        <img
          src={component.preview_image}
          alt={`${component.title} preview`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-4 text-zinc-950 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                {component.category}
              </span>
            </div>
            <h3 className="text-lg font-bold sm:text-xl">{component.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{component.description}</p>
            <button className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
              Preview
            </button>
          </motion.div>
        </div>
      )}
      {large && (
        <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/70 backdrop-blur">
          <Maximize2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
