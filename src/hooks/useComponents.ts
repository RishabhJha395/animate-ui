import { useEffect, useMemo, useState } from "react";
import { getComponents } from "../services/api";
import type { ComponentCategory, ShowcaseComponent } from "../types/component";

export function useComponents() {
  const [components, setComponents] = useState<ShowcaseComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getComponents()
      .then((data) => {
        if (mounted) setComponents(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { components, loading };
}

export function useFilteredComponents(
  components: ShowcaseComponent[],
  query: string,
  category: ComponentCategory | "All",
  selectedTags: string[],
) {
  return useMemo(() => {
    return components.filter((component) => {
      const q = query.toLowerCase();
      const matchesQuery =
        component.title.toLowerCase().includes(q) ||
        component.description.toLowerCase().includes(q) ||
        component.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory = category === "All" || component.category === category;
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => component.tags.includes(tag));

      return matchesQuery && matchesCategory && matchesTags;
    });
  }, [category, components, query, selectedTags]);
}
