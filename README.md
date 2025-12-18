# GPUI Community Edition Site

The official website for [GPUI Community Edition](https://github.com/gpui-ce/gpui-ce) — a fast, productive UI framework for Rust.

**Live site:** [gpui-ce.github.io](https://gpui-ce.github.io)

Built with [Zola](https://www.getzola.org/), a fast static site generator written in Rust.

## Local Development

### Prerequisites

1. Install Zola:
   ```bash
   # macOS
   brew install zola

   # Or with cargo
   cargo install zola
   ```

2. Clone both repos as siblings:
   ```bash
   cd ~/code  # or your preferred directory
   git clone https://github.com/gpui-ce/gpui-ce.git
   git clone https://github.com/gpui-ce/gpui-ce.github.io.git
   ```

### Generate Examples

The example pages are generated from the source files in gpui-ce. Run:

```bash
./generate_examples.sh
```

This reads `../gpui-ce/crates/gpui/examples/*.rs` and creates corresponding markdown pages.

### Build

```bash
zola build
```

Output goes to `public/`.

### Preview

```bash
zola serve
```

Opens a local server at `http://127.0.0.1:1111` with live reload.

## Structure

```
gpui-ce.github.io/
├── config.toml          # Zola configuration
├── content/
│   ├── _index.md        # Homepage
│   └── examples/
│       ├── _index.md    # Examples listing page
│       └── *.md         # Generated example pages
├── templates/
│   ├── base.html        # Base layout (nav, footer)
│   ├── index.html       # Homepage template
│   ├── section.html     # Examples grid
│   └── page.html        # Individual example page
├── sass/
│   └── style.scss       # Styles
├── static/              # Static assets
└── generate_examples.sh # Example generator script
```

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to `main`.

To trigger a rebuild when gpui-ce examples change, dispatch the `rebuild-site` event:

```bash
gh api repos/gpui-ce/gpui-ce.github.io/dispatches \
  -f event_type=rebuild-site
```

## Contributing

- **Content**: Edit markdown files in `content/`
- **Styling**: Modify `sass/style.scss`
- **Templates**: Update Tera templates in `templates/`
- **Examples**: Examples are auto-generated from gpui-ce — contribute there!

## License

Apache 2.0
