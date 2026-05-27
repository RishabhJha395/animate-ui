import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ToastProvider";

export function TerminalBox({ command, dependencies }: { command: string; dependencies: string[] }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    toast("Install command copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="font-mono text-xs text-zinc-300">Terminal</span>
        <button onClick={copy} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy
        </button>
      </div>
      <div className="p-5">
        <p className="mb-3 text-sm text-zinc-400">Install your component dependencies:</p>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 px-4 py-4 font-mono text-sm text-yellow-200">
          <span className="overflow-x-auto whitespace-nowrap">{command}</span>
          <Copy className="h-4 w-4 shrink-0 text-zinc-500" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          Dependency:
          {dependencies.map((dependency) => (
            <span key={dependency} className="rounded-full bg-white/[0.08] px-2 py-1 text-zinc-300">
              {dependency}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
