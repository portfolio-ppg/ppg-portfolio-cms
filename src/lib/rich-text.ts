import sanitizeHtml from "sanitize-html";

// Allowlist for the CMS rich-text editor (RichTextEditor). Rich-text bodies
// are rendered with dangerouslySetInnerHTML on the public page, and any user
// can edit their own portfolio — so everything is sanitized server-side
// before it's stored. Anything not listed here (scripts, styles, event
// handlers, iframes, pasted Word/Docs markup) is stripped.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "h3", "h4", "ul", "ol", "li", "blockquote", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    div: "p",
  },
};

export function sanitizeRichText(html: string): string {
  const clean = sanitizeHtml(html, OPTIONS).trim();
  // An "empty" editor still submits things like "<p><br></p>" — treat that
  // as empty so the section stays hidden on the public page.
  return clean.replace(/<[^>]*>|&nbsp;|\s/g, "") ? clean : "";
}
