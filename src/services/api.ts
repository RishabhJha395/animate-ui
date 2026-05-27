import { mockComponents } from "../data/mockComponents";
import { isSupabaseConfigured, supabase } from "./supabase";
import type { ComponentCodeFile, ShowcaseComponent } from "../types/component";
import { getErrorMessage } from "../utils/errors";

const table = "components";
const bucket = "component-previews";

export async function getComponents(): Promise<ShowcaseComponent[]> {
  if (!isSupabaseConfigured || !supabase) return mockComponents;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return mockComponents;
  }

  return data as ShowcaseComponent[];
}

export async function getComponentBySlug(slug: string): Promise<ShowcaseComponent | null> {
  const fallback = mockComponents.find((component) => component.slug === slug) ?? null;
  if (!isSupabaseConfigured || !supabase) return fallback;

  const { data, error } = await supabase.from(table).select("*").eq("slug", slug).single();
  if (error) return fallback;
  return data as ShowcaseComponent;
}

export async function publishComponent(
  payload: Omit<ShowcaseComponent, "id" | "created_at" | "preview_image"> & {
    code_files?: ComponentCodeFile[];
  },
  image?: File | null,
) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  let previewImage: string | null = null;

  if (image) {
    const filePath = `${payload.slug}/${Date.now()}-${image.name}`;
    const upload = await supabase.storage.from(bucket).upload(filePath, image, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upload.error) {
      console.error("Preview image upload failed:", upload.error);
      throw new Error(`Image upload failed: ${getErrorMessage(upload.error)}`);
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    previewImage = data.publicUrl;
  }

  const { data, error } = await supabase
    .from(table)
    .insert({ ...payload, preview_image: previewImage })
    .select()
    .single();

  if (error) {
    console.error("Component insert failed:", error);
    throw new Error(getErrorMessage(error, "Could not publish component"));
  }
  return data as ShowcaseComponent;
}

export async function deleteComponent(id: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    console.error("Component delete failed:", error);
    throw new Error(getErrorMessage(error, "Could not delete component"));
  }
}
