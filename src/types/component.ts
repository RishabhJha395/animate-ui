export type ComponentCategory =
  | "Buttons"
  | "Cards"
  | "Modals"
  | "Navbars"
  | "Forms"
  | "Hero Sections"
  | "Loaders";

export type ComponentCodeFile = {
  filename: string;
  language: string;
  code: string;
};

export type ShowcaseComponent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  code: string;
  code_files?: ComponentCodeFile[] | null;
  dependencies: string[];
  install_command: string;
  preview_image: string | null;
  created_at: string;
};
