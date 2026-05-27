import { motion } from "framer-motion";
import { ArrowRight, Github, Layers, MousePointer2, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ComponentCard } from "../components/shared/ComponentCard";
import { categories } from "../lib/constants";
import { useComponents } from "../hooks/useComponents";

const featureCards = [
  { icon: Layers, title: "Composable", text: "Converted Framer builds become reusable React modules." },
  { icon: Zap, title: "Animated", text: "Framer Motion-first previews, details, and page transitions." },
  { icon: MousePointer2, title: "Deployable", text: "Admin uploads publish instantly through Supabase." },
];

export default function Home() {
  const { components } = useComponents();
  const featured = components.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-floor opacity-80" />
        <div className="absolute left-1/2 top-[48%] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="perspective-grid absolute inset-x-0 bottom-[-34%] h-[48%] grid-floor opacity-70" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-xs text-zinc-300 sm:mb-7 sm:px-4 sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-violet-300" />
              Premium motion components for React
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-gradient text-4xl font-black uppercase leading-[0.95] tracking-normal min-[380px]:text-5xl sm:text-7xl lg:text-8xl"
            >
              Build Faster,
              <br />
              Look Sharper.
              <br />
              AnimateUI.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-7 sm:text-lg sm:leading-7"
            >
              A production-ready showcase for React, Tailwind, and Framer Motion components with
              live browsing, code tabs, install commands, and admin publishing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <Link to="/components" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  Browse Components <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="glass absolute left-[8%] top-[28%] hidden h-20 w-20 rounded-2xl p-4 lg:block"
          >
            <div className="h-full rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="glass absolute right-[9%] top-[24%] hidden h-24 w-28 rounded-2xl p-4 lg:block"
          >
            <div className="mb-2 h-3 rounded-full bg-violet-400" />
            <div className="h-3 w-2/3 rounded-full bg-cyan-300" />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold uppercase text-white sm:text-3xl">Featured Components</h2>
            <p className="mt-3 text-zinc-400">Fast previews, tags, and direct detail pages.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Browse By Category</h2>
              <p className="mt-3 max-w-md text-zinc-400">
                Keep the library tidy as it grows from a handful of converted components into a full design system.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  to="/components"
                  className="glass rounded-2xl p-5 transition hover:border-violet-300/40 hover:bg-white/[0.08]"
                >
                  <p className="font-semibold text-white">{category}</p>
                  <p className="mt-2 text-sm text-zinc-500">Explore animated {category.toLowerCase()}.</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="glass mx-auto max-w-7xl rounded-3xl p-6 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Publish once. Showcase instantly.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Supabase powers upload, storage, authentication, and dynamic frontend fetching so new components appear without redeploys.
          </p>
          <Link to="/admin" className="mt-7 inline-flex w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Open Admin Panel</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
