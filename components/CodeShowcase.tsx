import { Fragment } from "react";

const CODE = `// a small view over app state
struct Counter {
    count: i32,
}

impl Render for Counter {
    fn render(&mut self, cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .gap_3()
            .p_4()
            .bg(rgb(0x131315))
            .child(format!("count: {}", self.count))
            .child(
                button("increment").on_click(cx.listener(
                    |view, _, cx| {
                        view.count += 1;
                        cx.notify();
                    }
                ))
            )
    }
}`;

const KEYWORDS = [
  "struct", "impl", "for", "fn", "mut", "self", "Self", "let", "pub",
];

const TYPES = ["Counter", "Render", "Context", "IntoElement", "i32"];

function tokenize(line: string) {
  const pattern = new RegExp(
    `(//.*$)|("(?:[^"\\\\]|\\\\.)*")|\\b(${KEYWORDS.join("|")})\\b|\\b(${TYPES.join("|")})\\b`,
    "g"
  );

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const [full, comment, string, keyword, type] = match;

    if (comment) {
      nodes.push(
        <span key={key++} className="text-muted">
          {comment}
        </span>
      );
    } else if (string) {
      nodes.push(
        <span key={key++} className="text-[#c9e39a]">
          {string}
        </span>
      );
    } else if (keyword) {
      nodes.push(
        <span key={key++} className="text-yellow">
          {keyword}
        </span>
      );
    } else if (type) {
      nodes.push(
        <span key={key++} className="text-[#8fd0ff]">
          {type}
        </span>
      );
    } else {
      nodes.push(full);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

export function CodeShowcase() {
  const lines = CODE.split("\n");

  return (
    <section id="example" className="border-b border-line-soft bg-ink py-24">
      <div className="container-page">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-widest2 text-muted">
              01 — At a glance
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tightest text-paper sm:text-4xl">
              Views compose like functions.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A minimal counter view: state lives on the struct, layout reads
            like a stylesheet, and every frame is rebuilt cheaply and
            diffed onto the GPU.
          </p>
        </div>

        <div className="border-2 border-black shadow-hard">
          <div className="flex items-center gap-2 border-b-2 border-black bg-surface px-4 py-3">
            <span className="h-3 w-3 border border-black bg-yellow" />
            <span className="h-3 w-3 border border-line" />
            <span className="h-3 w-3 border border-line" />
            <span className="ml-3 font-mono text-[12px] text-muted">
              src/counter.rs
            </span>
          </div>

          <pre className="overflow-x-auto bg-[#0d0d0f] p-6 text-[13px] leading-relaxed sm:p-8 sm:text-sm">
            <code className="font-mono text-paper">
              {lines.map((line, i) => (
                <Fragment key={i}>
                  {tokenize(line)}
                  {i < lines.length - 1 ? "\n" : null}
                </Fragment>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
