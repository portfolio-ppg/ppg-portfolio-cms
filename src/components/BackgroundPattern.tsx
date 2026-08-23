/** Faint decorative pattern used behind the login page and admin/CMS screens. */
export default function BackgroundPattern({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-repeat"
      style={{
        backgroundImage: "url('/images/e-portfolio-pattern.png')",
        backgroundSize: "420px",
        opacity,
      }}
    />
  );
}
