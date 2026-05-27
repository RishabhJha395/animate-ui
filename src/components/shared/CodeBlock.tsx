import { Check, Copy } from "lucide-react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light-async";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import { useToast } from "./ToastProvider";

type CodeBlockProps = {
  code: string;
  filename: string;
  language?: string;
};

export function CodeBlock({ code, filename, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast("Copied to clipboard");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d13] shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="max-w-[220px] truncate rounded-full bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-200 sm:max-w-md">
            {filename}
          </span>
          <span className="rounded-full bg-violet-400/10 px-2 py-1 text-xs font-medium text-violet-200">
            {language}
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem",
            fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular",
            fontSize: "0.8rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
