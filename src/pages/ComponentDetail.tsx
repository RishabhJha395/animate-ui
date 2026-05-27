import { ArrowLeft, Boxes, Code2, Package, Play, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/shared/CodeBlock";
import { ComponentCard } from "../components/shared/ComponentCard";
import { PreviewStage } from "../components/shared/PreviewStage";
import { TerminalBox } from "../components/shared/TerminalBox";
import { Button } from "../components/ui/Button";
import { useComponents } from "../hooks/useComponents";
import { getComponentBySlug } from "../services/api";
import type { ShowcaseComponent } from "../types/component";

const tabs = [
  { id: "preview", label: "Preview", icon: Play },
  { id: "code", label: "Code", icon: Code2 },
  { id: "installation", label: "Installation", icon: Package },
  { id: "usage", label: "Usage", icon: Boxes },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function ComponentDetail() {
  const { slug } = useParams();
  const { components } = useComponents();
  const [component, setComponent] = useState<ShowcaseComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("preview");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getComponentBySlug(slug)
      .then(setComponent)
      .finally(() => setLoading(false));
  }, [slug]);

  const related = useMemo(
    () =>
      components
        .filter((item) => item.slug !== component?.slug && item.category === component?.category)
        .slice(0, 3),
    [component, components],
  );

  const usageCode = component
    ? `import { ${component.title.replace(/\s+/g, "")} } from "@/components/previews/${component.slug}";

export default function Page() {
  return (
    <main className="min-h-screen bg-black p-8">
      <${component.title.replace(/\s+/g, "")} />
    </main>
  );
}`
    : "";
  const codeFiles =
    component?.code_files?.length
      ? component.code_files
      : component
        ? [{ filename: `${component.slug}.tsx`, language: "tsx", code: component.code }]
        : [];
  const [activeCodeFile, setActiveCodeFile] = useState(0);

  useEffect(() => {
    setActiveCodeFile(0);
  }, [component?.slug]);

  if (loading) {
    return <div className="mx-auto min-h-screen max-w-7xl px-4 py-12 text-zinc-400">Loading component...</div>;
  }

  if (!component) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white">Component not found</h1>
        <Link to="/components" className="mt-5 inline-flex">
          <Button>Back to Components</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link to="/components" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to components
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-violet-200">
            <Sparkles className="h-4 w-4" />
            {component.category}
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{component.title}</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">{component.description}</p>
        </div>
        <Button className="w-full sm:w-auto">Live Component</Button>
      </div>

      <PreviewStage component={component} large />

      <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="hide-scrollbar mb-5 flex overflow-x-auto border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex min-w-fit items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-300 to-violet-500" />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "preview" && <PreviewStage component={component} large />}
          {activeTab === "code" && (
            <div className="space-y-3">
              {codeFiles.length > 1 && (
                <div className="hide-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                  {codeFiles.map((file, index) => (
                    <button
                      key={`${file.filename}-${index}`}
                      onClick={() => setActiveCodeFile(index)}
                      className={`max-w-[240px] min-w-fit truncate rounded-xl px-3 py-2 text-sm transition ${
                        activeCodeFile === index
                          ? "bg-white/10 text-white"
                          : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
                      }`}
                    >
                      {file.filename}
                    </button>
                  ))}
                </div>
              )}
              <CodeBlock
                code={codeFiles[activeCodeFile]?.code ?? component.code}
                filename={codeFiles[activeCodeFile]?.filename ?? `${component.slug}.tsx`}
                language={codeFiles[activeCodeFile]?.language ?? "tsx"}
              />
            </div>
          )}
          {activeTab === "installation" && (
            <TerminalBox command={component.install_command} dependencies={component.dependencies} />
          )}
          {activeTab === "usage" && <CodeBlock code={usageCode} filename="usage.tsx" />}
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-zinc-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-xs text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-zinc-500">Dependencies</p>
            <div className="flex flex-wrap gap-2">
              {component.dependencies.map((dependency) => (
                <span key={dependency} className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                  {dependency}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-bold text-white">Related Components</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ComponentCard key={item.id} component={item} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
