import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ComponentCard } from "../components/shared/ComponentCard";
import { Input } from "../components/ui/Input";
import { categories } from "../lib/constants";
import { useComponents, useFilteredComponents } from "../hooks/useComponents";
import type { ComponentCategory } from "../types/component";

export default function Components() {
  const { components, loading } = useComponents();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ComponentCategory | "All">("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const allTags = useMemo(() => Array.from(new Set(components.flatMap((item) => item.tags))).slice(0, 12), [components]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const filtered = useFilteredComponents(components, query, category, selectedTags);

  const filters = (
    <div className="space-y-7">
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-normal text-zinc-500">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components..."
            className="pl-9"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-zinc-500">Categories</p>
        <div className="grid gap-2">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                category === item ? "bg-violet-500/18 text-white" : "text-zinc-400 hover:bg-white/[0.06]"
              }`}
            >
              {item}
              <span className="text-xs text-zinc-600">
                {item === "All" ? components.length : components.filter((component) => component.category === item).length}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-zinc-500">Tags</p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSelectedTags((current) =>
                  current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
                )
              }
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                selectedTags.includes(tag)
                  ? "bg-cyan-400/18 text-cyan-100"
                  : "bg-white/[0.07] text-zinc-400 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold text-violet-300">Component Library</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Browse Components</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Filter by category, search by tag, and open a detail page for preview, code, installation, and usage.
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white sm:w-auto lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass sticky top-24 hidden h-[calc(100vh-7rem)] rounded-2xl p-4 lg:block">
          {filters}
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
            <span>{filtered.length} components</span>
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {category}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[390px] animate-pulse rounded-2xl bg-white/[0.06]" />
              ))}
            </div>
          ) : filtered.length ? (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <h2 className="text-xl font-semibold text-white">No components found</h2>
              <p className="mt-2 text-zinc-400">Try another category, tag, or search phrase.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 p-3 backdrop-blur sm:p-4 lg:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="h-full w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-white">Filters</p>
                <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 hover:bg-white/[0.08]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filters}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
