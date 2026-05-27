import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2 text-zinc-300">
          <Sparkles className="h-4 w-4 text-violet-300" />
          AnimateUI
        </div>
      </div>
    </footer>
  );
}
