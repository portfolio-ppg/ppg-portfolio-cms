import type { Appearance, TemplateId } from "./types";

export interface TemplateDef {
  id: TemplateId;
  name: string;
  description: string;
  preview: string; // CSS gradient used for the little swatch in the picker
  defaults: Pick<
    Appearance,
    | "backgroundColor"
    | "backgroundColorDeep"
    | "textColor"
    | "textColorSoft"
    | "solidColor"
    | "gradientFrom"
    | "gradientTo"
    | "borderColor"
    | "surfaceColor"
  >;
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "nature",
    name: "Nature",
    description: "Hangat & organik — nude/soft pink, cocok untuk tema alam & kampung halaman.",
    preview: "linear-gradient(135deg, #eda4a3, #f5c8c7)",
    defaults: {
      backgroundColor: "#fdf6f3",
      backgroundColorDeep: "#fdecec",
      textColor: "#8a5c54",
      textColorSoft: "#a67f77",
      solidColor: "#eda4a3",
      gradientFrom: "#eda4a3",
      gradientTo: "#f5c8c7",
      borderColor: "#f3d7da",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Bersih & netral — fokus ke tipografi dan konten.",
    preview: "linear-gradient(135deg, #d9d4e8, #e8e4f2)",
    defaults: {
      backgroundColor: "#faf9fc",
      backgroundColorDeep: "#f1eef7",
      textColor: "#4d4759",
      textColorSoft: "#7c7690",
      solidColor: "#b7a8d9",
      gradientFrom: "#d9d4e8",
      gradientTo: "#e8e4f2",
      borderColor: "#e2ddef",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Gelap & elegan — kontras tinggi, kesan profesional.",
    preview: "linear-gradient(135deg, #2c2438, #453a5c)",
    defaults: {
      backgroundColor: "#1f1a29",
      backgroundColorDeep: "#15111d",
      textColor: "#ece7f5",
      textColorSoft: "#a89cc4",
      solidColor: "#8a6fc9",
      gradientFrom: "#2c2438",
      gradientTo: "#453a5c",
      borderColor: "#3a3049",
      surfaceColor: "#2c2438",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Segar & tenang — biru toska, cocok untuk tema pantai/laut.",
    preview: "linear-gradient(135deg, #4fa8c4, #8fd4e8)",
    defaults: {
      backgroundColor: "#f0f9fb",
      backgroundColorDeep: "#e0f1f5",
      textColor: "#1f4e5f",
      textColorSoft: "#4d7d8c",
      solidColor: "#4fa8c4",
      gradientFrom: "#4fa8c4",
      gradientTo: "#8fd4e8",
      borderColor: "#cbe8f0",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Hangat & cerah — jingga keemasan, penuh energi.",
    preview: "linear-gradient(135deg, #f0925a, #f7c56a)",
    defaults: {
      backgroundColor: "#fff5ec",
      backgroundColorDeep: "#ffe8d6",
      textColor: "#7a4326",
      textColorSoft: "#a8703f",
      solidColor: "#f0925a",
      gradientFrom: "#f0925a",
      gradientTo: "#f7c56a",
      borderColor: "#f5d9bd",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Alami & menenangkan — hijau daun, cocok untuk tema bukit/pegunungan.",
    preview: "linear-gradient(135deg, #6f9b52, #a3c47a)",
    defaults: {
      backgroundColor: "#f3f7f0",
      backgroundColorDeep: "#e6efdf",
      textColor: "#3a4a2f",
      textColorSoft: "#647a52",
      solidColor: "#6f9b52",
      gradientFrom: "#6f9b52",
      gradientTo: "#a3c47a",
      borderColor: "#d7e6cb",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Lembut & feminin — ungu pastel yang tenang.",
    preview: "linear-gradient(135deg, #b8a0e0, #e0c9f0)",
    defaults: {
      backgroundColor: "#f7f4fc",
      backgroundColorDeep: "#ede4f7",
      textColor: "#4a3a63",
      textColorSoft: "#7c6899",
      solidColor: "#a58cd0",
      gradientFrom: "#b8a0e0",
      gradientTo: "#e0c9f0",
      borderColor: "#e3d5f5",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "charcoal",
    name: "Charcoal",
    description: "Netral & tegas — abu-abu gelap monokrom, sangat minimalis.",
    preview: "linear-gradient(135deg, #3f3f46, #71717a)",
    defaults: {
      backgroundColor: "#f4f4f5",
      backgroundColorDeep: "#e4e4e7",
      textColor: "#27272a",
      textColorSoft: "#52525b",
      solidColor: "#52525b",
      gradientFrom: "#3f3f46",
      gradientTo: "#71717a",
      borderColor: "#d4d4d8",
      surfaceColor: "#ffffff",
    },
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Krem hangat & cokelat kopi — lembut, elegan, dan nyaman dibaca.",
    preview: "linear-gradient(135deg, #5c4033, #c9b3a3)",
    defaults: {
      backgroundColor: "#f6f2ee",
      backgroundColorDeep: "#ede6df",
      textColor: "#3b2a22",
      textColorSoft: "#6e5d54",
      solidColor: "#8b6b5c",
      gradientFrom: "#5c4033",
      gradientTo: "#8b6b5c",
      borderColor: "#e4d9cf",
      surfaceColor: "#fbf9f7",
    },
  },
];

export const TEMPLATE_DEFAULTS: Record<TemplateId, TemplateDef["defaults"]> =
  Object.fromEntries(TEMPLATES.map((t) => [t.id, t.defaults])) as Record<
    TemplateId,
    TemplateDef["defaults"]
  >;

export function getTemplate(id: TemplateId): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
