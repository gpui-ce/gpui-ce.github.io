import {
  IconBolt,
  IconLayers,
  IconChip,
  IconGlobe,
  IconUsers,
  IconPackage,
} from "./icons";

const features = [
  {
    icon: IconChip,
    title: "GPU-accelerated rendering",
    body: "Every frame is composited on the GPU through a native Metal, Vulkan, or Direct3D backend, keeping interfaces fluid under heavy layout churn.",
  },
  {
    icon: IconLayers,
    title: "Hybrid render model",
    body: "Compose views with the ergonomics of immediate-mode UI while GPUI-CE retains and diffs the element tree for you between frames.",
  },
  {
    icon: IconBolt,
    title: "Native performance",
    body: "No DOM and no browser runtime. GPUI-CE talks directly to the platform's windowing, input, and graphics layers.",
  },
  {
    icon: IconGlobe,
    title: "Cross-platform",
    body: "One codebase targets macOS, Windows, and Linux, with consistent input handling, text shaping, and accessibility behavior.",
  },
  {
    icon: IconUsers,
    title: "Community governance",
    body: "Releases, RFCs, and roadmap decisions happen in the open, decided by maintainers and contributors instead of a single vendor.",
  },
  {
    icon: IconPackage,
    title: "Batteries included",
    body: "Flexbox-style layout, text shaping, animation primitives, and an accessibility tree ship in the core crate.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-line-soft py-24">
      <div className="container-page">
        <p className="font-mono text-[12px] uppercase tracking-widest2 text-muted">
          02 — What you get
        </p>
        <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-medium tracking-tightest text-paper sm:text-4xl">
          Everything a native UI needs, nothing it doesn&apos;t.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-ink p-8">
              <Icon className="h-6 w-6 text-yellow" />
              <h3 className="mt-5 font-display text-lg font-medium text-paper">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
