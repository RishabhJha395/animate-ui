import { Github, Menu, Search, Shield, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";

const links = [
  { label: "Components", href: "/components" },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/30 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 ring-1 ring-violet-300/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="truncate">AnimateUI</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 shadow-panel md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://github.com"
            className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
          >
            GitHub
          </a>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/components"
            className="flex h-10 w-36 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-sm text-zinc-500 lg:w-48"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Button className="h-10 px-3" variant="secondary">
            <Github className="h-4 w-4" />
          </Button>
          <Link
            to="/admin"
            aria-label="Admin login"
            title="Admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/10 text-violet-200 transition hover:bg-violet-500/20"
          >
            <Shield className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin"
            aria-label="Admin login"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/10 text-violet-200"
          >
            <Shield className="h-4 w-4" />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055]"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-zinc-950/95 p-4 md:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com"
              className="rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/[0.06]"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
