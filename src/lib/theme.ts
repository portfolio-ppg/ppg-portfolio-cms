import type { Appearance } from "./types";
import { getFontPair } from "./fonts";

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

function safeColor(value: string, fallback: string): string {
  return HEX_RE.test(value) ? value : fallback;
}

function safeAngle(value: number): number {
  if (!Number.isFinite(value)) return 135;
  return Math.max(0, Math.min(360, Math.round(value)));
}

/** Only allow background images that live in our own uploads folder or https. */
function safeImageUrl(value: string): string {
  if (value.startsWith("/uploads/") || value.startsWith("https://")) return value;
  return "";
}

/**
 * Builds a small block of CSS custom-property overrides from the admin's
 * appearance settings. All values are validated first so admin-controlled
 * data can never break out of the <style> tag it's injected into.
 *
 * IMPORTANT: every CSS variable the public site's components reference
 * (cream/cream-deep/ink/ink-soft/clay/clay-deep/sage/sage-deep/sea/stone/
 * stone-soft/white-warm) is set here. Missing one here means that piece of
 * UI silently keeps globals.css's default color no matter what template or
 * palette the user picks — that was the original bug with borders, footer
 * rules, and the header logo mark not following the selected theme.
 *
 * `.cms-hero-surface` is applied directly to the hero <section> (not a
 * decorative child element) so solid/gradient/image backgrounds actually
 * cover the whole hero. When an image background is used, an overlay
 * (`--hero-overlay-opacity`) is enabled so text stays readable on top of it.
 */
export function buildThemeCss(a: Appearance): string {
  const bg = safeColor(a.backgroundColor, "#fdf6f3");
  const bgDeep = safeColor(a.backgroundColorDeep, "#fdecec");
  const text = safeColor(a.textColor, "#8a5c54");
  const textSoft = safeColor(a.textColorSoft, "#a67f77");
  const border = safeColor(a.borderColor, "#f3d7da");
  const surface = safeColor(a.surfaceColor, "#ffffff");

  const fontPair = getFontPair(a.fontId);

  let accent = safeColor(a.solidColor, "#eda4a3");
  let accentDeep = accent;
  let heroBackground = "";
  let overlayOpacity = "0";

  if (a.paletteType === "solid") {
    accent = safeColor(a.solidColor, "#eda4a3");
    accentDeep = accent;
  } else if (a.paletteType === "gradient") {
    const from = safeColor(a.gradientFrom, "#eda4a3");
    const to = safeColor(a.gradientTo, "#f5c8c7");
    const angle = safeAngle(a.gradientAngle);
    accent = from;
    accentDeep = to;
    heroBackground = `.cms-hero-surface { background-image: linear-gradient(${angle}deg, ${from}, ${to}); }`;
  } else if (a.paletteType === "image") {
    const url = safeImageUrl(a.backgroundImageUrl);
    accent = "#eda4a3";
    accentDeep = "#d17f7e";
    if (url) {
      heroBackground = `.cms-hero-surface { background-image: url("${url}"); background-size: cover; background-position: center; }`;
      overlayOpacity = "1";
    }
  }

  return `:root {
  --color-cream: ${bg};
  --color-cream-deep: ${bgDeep};
  --color-white-warm: ${surface};
  --color-stone: ${border};
  --color-stone-soft: color-mix(in srgb, ${border} 55%, ${bg} 45%);
  --color-clay: ${accent};
  --color-clay-deep: ${accentDeep};
  --color-sage: ${accent};
  --color-sage-deep: color-mix(in srgb, ${accentDeep} 75%, black 15%);
  --color-sea: ${accentDeep};
  --color-ink: ${text};
  --color-ink-soft: ${textSoft};
  --hero-overlay-opacity: ${overlayOpacity};
}
${heroBackground}
/* Deliberately NOT overriding --font-display/--font-body here: those are
   declared at :root by Tailwind's "@theme inline", but the actual
   next/font variables (--font-fraunces, --font-playfair, ...) only exist
   on <body> and below. A :root-level declaration referencing a
   body-scoped variable is invalid at computed-value time, which makes
   --font-display invalid everywhere it inherits to — this silently broke
   ALL heading fonts (not just custom pairs) the same way. Reference the
   font pair's real variable directly instead, in rules scoped to
   <body>/its descendants where that variable is actually defined. Tailwind
   also auto-generates a ".font-display" utility hardcoded to the default
   font that collides with the ".font-display" class globals.css uses on
   headings, so this needs !important to win regardless of load order. */
.font-display, h1, h2, h3, h4 { font-family: var(${fontPair.displayVar}), serif !important; }
body, .font-body { font-family: var(${fontPair.bodyVar}), sans-serif !important; }`;
}
