import type { ShowcaseComponent } from "../types/component";

const baseCode = (name: string) => `import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ${name.replace(/\s+/g, "")}() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white">${name}</h3>
      <p className="mt-2 text-sm text-zinc-400">
        A polished animated component for premium interfaces.
      </p>
    </motion.div>
  );
}`;

export const mockComponents: ShowcaseComponent[] = [
  {
    id: "1",
    title: "Bento Grid",
    slug: "bento-grid",
    description: "Animated bento cards with gradient tiles and responsive focus states.",
    category: "Cards",
    tags: ["React", "Framer Motion", "Bento"],
    code: baseCode("Bento Grid"),
    code_files: [
      { filename: "bento-grid.tsx", language: "tsx", code: baseCode("Bento Grid") },
      {
        filename: "utils.ts",
        language: "ts",
        code: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    install_command: "npm install framer-motion lucide-react clsx tailwind-merge",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Animated Tabs",
    slug: "animated-tabs",
    description: "Fluid tab navigation with layout animations and glowing active states.",
    category: "Navbars",
    tags: ["Tabs", "Motion", "Navigation"],
    code: baseCode("Animated Tabs"),
    code_files: [{ filename: "animated-tabs.tsx", language: "tsx", code: baseCode("Animated Tabs") }],
    dependencies: ["framer-motion", "lucide-react"],
    install_command: "npm install framer-motion lucide-react",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Animated Modal",
    slug: "animated-modal",
    description: "A smooth modal with backdrop motion, keyboard-ready layout, and CTA states.",
    category: "Modals",
    tags: ["Modal", "React", "Framer Motion"],
    code: baseCode("Animated Modal"),
    code_files: [{ filename: "animated-modal.tsx", language: "tsx", code: baseCode("Animated Modal") }],
    dependencies: ["framer-motion", "lucide-react", "clsx"],
    install_command: "npm install framer-motion lucide-react clsx",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Gradient Button",
    slug: "gradient-button",
    description: "Magnetic gradient button with icon affordances and pressed states.",
    category: "Buttons",
    tags: ["Button", "CTA", "Hover"],
    code: baseCode("Gradient Button"),
    code_files: [{ filename: "gradient-button.tsx", language: "tsx", code: baseCode("Gradient Button") }],
    dependencies: ["framer-motion", "lucide-react"],
    install_command: "npm install framer-motion lucide-react",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Auth Form",
    slug: "auth-form",
    description: "Dark glass sign-in form with animated labels and validation-ready fields.",
    category: "Forms",
    tags: ["Form", "Auth", "Tailwind"],
    code: baseCode("Auth Form"),
    code_files: [{ filename: "auth-form.tsx", language: "tsx", code: baseCode("Auth Form") }],
    dependencies: ["framer-motion", "lucide-react"],
    install_command: "npm install framer-motion lucide-react",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Pulse Loader",
    slug: "pulse-loader",
    description: "Compact loader cluster designed for dashboards and inline loading states.",
    category: "Loaders",
    tags: ["Loader", "Motion", "Micro"],
    code: baseCode("Pulse Loader"),
    code_files: [{ filename: "pulse-loader.tsx", language: "tsx", code: baseCode("Pulse Loader") }],
    dependencies: ["framer-motion"],
    install_command: "npm install framer-motion",
    preview_image: null,
    created_at: new Date().toISOString(),
  },
];
