import { LogIn, Plus, Trash2, UploadCloud } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../components/shared/ToastProvider";
import { categories } from "../lib/constants";
import { slugify } from "../lib/utils";
import { adminEmail, isSupabaseConfigured, supabase } from "../services/supabase";
import { deleteComponent, getComponents, publishComponent } from "../services/api";
import type { ComponentCategory, ShowcaseComponent } from "../types/component";
import type { ComponentCodeFile } from "../types/component";
import { getErrorMessage } from "../utils/errors";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ComponentCategory>("Cards");
  const [tags, setTags] = useState("React, Framer Motion, Tailwind");
  const [dependencies, setDependencies] = useState("framer-motion, lucide-react, clsx, tailwind-merge");
  const [installCommand, setInstallCommand] = useState("npm install framer-motion lucide-react clsx tailwind-merge");
  const [codeFiles, setCodeFiles] = useState<ComponentCodeFile[]>([
    { filename: "component.tsx", language: "tsx", code: "" },
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [components, setComponents] = useState<ShowcaseComponent[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const allowed = useMemo(() => Boolean(email && adminEmail && email === adminEmail), [email]);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const loadAdminComponents = async () => {
    setLoadingComponents(true);
    setDeleteError(null);
    try {
      setComponents(await getComponents());
    } catch (error) {
      setDeleteError(getErrorMessage(error, "Could not load components"));
    } finally {
      setLoadingComponents(false);
    }
  };

  useEffect(() => {
    if (allowed) void loadAdminComponents();
  }, [allowed]);

  const signIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
  };

  const updateCodeFile = (index: number, patch: Partial<ComponentCodeFile>) => {
    setCodeFiles((current) =>
      current.map((file, fileIndex) => (fileIndex === index ? { ...file, ...patch } : file)),
    );
  };

  const addCodeFile = () => {
    setCodeFiles((current) => [
      ...current,
      { filename: `file-${current.length + 1}.tsx`, language: "tsx", code: "" },
    ]);
  };

  const removeCodeFile = (index: number) => {
    setCodeFiles((current) => current.filter((_file, fileIndex) => fileIndex !== index));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPublishing(true);
    setPublishError(null);
    try {
      const cleanCodeFiles = codeFiles
        .map((file) => ({
          filename: file.filename.trim(),
          language: file.language.trim() || "tsx",
          code: file.code,
        }))
        .filter((file) => file.filename && file.code.trim());

      if (!cleanCodeFiles.length) {
        throw new Error("Add at least one code file before publishing.");
      }

      await publishComponent(
        {
          title,
          slug: slug || slugify(title),
          description,
          category,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          dependencies: dependencies.split(",").map((dependency) => dependency.trim()).filter(Boolean),
          install_command: installCommand,
          code: cleanCodeFiles[0].code,
          code_files: cleanCodeFiles,
        },
        image,
      );
      toast("Component published");
      setTitle("");
      setSlug("");
      setDescription("");
      setCodeFiles([{ filename: "component.tsx", language: "tsx", code: "" }]);
      setImage(null);
      await loadAdminComponents();
    } catch (error) {
      const message = getErrorMessage(error, "Could not publish component");
      setPublishError(message);
      toast(message);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (component: ShowcaseComponent) => {
    const confirmed = window.confirm(
      `Delete "${component.title}"? This removes it from the public component library.`,
    );
    if (!confirmed) return;

    setDeletingId(component.id);
    setDeleteError(null);
    try {
      await deleteComponent(component.id);
      setComponents((current) => current.filter((item) => item.id !== component.id));
      toast("Component deleted");
    } catch (error) {
      const message = getErrorMessage(error, "Could not delete component");
      setDeleteError(message);
      toast(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (checking) {
    return <div className="mx-auto min-h-screen max-w-5xl px-4 py-12 text-zinc-400">Checking admin access...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto min-h-screen max-w-4xl px-4 py-12">
        <div className="glass rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-white">Supabase setup required</h1>
          <p className="mt-3 text-zinc-400">
            Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_ADMIN_EMAIL to enable Google auth and publishing.
          </p>
        </div>
      </section>
    );
  }

  if (!email) {
    return (
      <section className="mx-auto min-h-screen max-w-xl px-4 py-20">
        <div className="glass rounded-3xl p-8 text-center">
          <LogIn className="mx-auto mb-5 h-10 w-10 text-violet-300" />
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="mt-3 text-zinc-400">Sign in with Google to publish components.</p>
          <Button onClick={signIn} className="mt-7">Continue with Google</Button>
        </div>
      </section>
    );
  }

  if (!allowed) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-violet-300">Admin Dashboard</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Publish Component</h1>
        <p className="mt-3 text-zinc-400">Upload code and preview assets directly to Supabase.</p>
      </div>

      <form onSubmit={submit} className="glass grid gap-5 rounded-3xl p-4 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-zinc-300">
            Component title
            <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label className="grid gap-2 text-sm text-zinc-300">
            Slug
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={title ? slugify(title) : "animated-modal"}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-zinc-300">
          Description
          <Input value={description} onChange={(event) => setDescription(event.target.value)} required />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="grid gap-2 text-sm text-zinc-300">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ComponentCategory)}
              className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-zinc-300">
            Tags
            <Input value={tags} onChange={(event) => setTags(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm text-zinc-300">
            Dependencies
            <Input value={dependencies} onChange={(event) => setDependencies(event.target.value)} />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-zinc-300">
          Install command
          <Input value={installCommand} onChange={(event) => setInstallCommand(event.target.value)} />
        </label>

        <div className="grid gap-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-zinc-300">Code files</p>
              <p className="mt-1 text-xs text-zinc-500">
                Add every file your component needs. The first file is used as the primary code preview.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={addCodeFile} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add file
            </Button>
          </div>

          <div className="grid gap-4">
            {codeFiles.map((file, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-[1fr_140px_auto]">
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Filename
                    <Input
                      value={file.filename}
                      onChange={(event) => updateCodeFile(index, { filename: event.target.value })}
                      placeholder="components/animated-modal.tsx"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Language
                    <Input
                      value={file.language}
                      onChange={(event) => updateCodeFile(index, { language: event.target.value })}
                      placeholder="tsx"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCodeFile(index)}
                    disabled={codeFiles.length === 1}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-3 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-200 disabled:pointer-events-none disabled:opacity-40 md:mt-7"
                    aria-label="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={file.code}
                  onChange={(event) => updateCodeFile(index, { code: event.target.value })}
                  required={index === 0}
                  className="min-h-60 w-full rounded-2xl border border-white/10 bg-[#0b0d13] p-3 font-mono text-sm text-zinc-200 outline-none focus:border-violet-400/60 sm:min-h-72 sm:p-4"
                  placeholder="Paste this file's code here..."
                />
              </div>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-8 text-center text-sm text-zinc-400 transition hover:bg-white/[0.055]">
          <UploadCloud className="mb-3 h-8 w-8 text-cyan-300" />
          {image ? image.name : "Upload preview image or gif"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
        </label>

        {publishError && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Publish failed</p>
            <p className="mt-1 text-red-100/80">{publishError}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={publishing} className="w-full sm:w-auto">
            {publishing ? "Publishing..." : "Publish Component"}
          </Button>
        </div>
      </form>

      <section className="glass mt-8 rounded-3xl p-4 sm:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Components</h2>
            <p className="mt-1 text-sm text-zinc-400">Delete published components from Supabase.</p>
          </div>
          <Button type="button" variant="secondary" onClick={loadAdminComponents} disabled={loadingComponents} className="w-full sm:w-auto">
            {loadingComponents ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {deleteError && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Delete failed</p>
            <p className="mt-1 text-red-100/80">{deleteError}</p>
          </div>
        )}

        {loadingComponents ? (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/[0.06]" />
            ))}
          </div>
        ) : components.length ? (
          <div className="grid gap-3">
            {components.map((component) => (
              <div
                key={component.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-white">{component.title}</h3>
                    <span className="rounded-full bg-white/[0.07] px-2 py-1 text-xs text-zinc-400">
                      {component.category}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-500">/{component.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(component)}
                  disabled={deletingId === component.id}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === component.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-500">
            No components found yet.
          </div>
        )}
      </section>
    </section>
  );
}
