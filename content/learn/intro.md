+++
title = "Introduction"
description = "Start your journey with GPUI, a fast GPU-accelerated UI framework for Rust"
template = "learn-page.html"
weight = 0
+++

# Welcome to GPUI

GPUI is a high-performance, GPU-accelerated UI framework for Rust. Originally built for [Zed](https://zed.dev), a next-generation code editor, GPUI is now available as a standalone framework for building fast, native desktop applications.

## Why GPUI?

- **Fast** — GPU-accelerated rendering with minimal CPU overhead
- **Native** — True native apps for macOS, Linux, and Windows
- **Rust** — Full type safety and memory safety with zero runtime overhead
- **Familiar** — Flexbox layout with Tailwind-inspired styling
- **Batteries Included** — Built-in async runtime, state management, and platform integration

## Core Concepts

GPUI has a few key concepts that power every application:

### Entities

An `Entity<T>` is a handle to state managed by GPUI. When you create an entity, GPUI tracks it and can re-render views when the state changes. Entities are the foundation of GPUI's reactive model.

```rust
// Create an entity with cx.new()
let counter: Entity<Counter> = cx.new(|_cx| Counter { count: 0 });
```

### Views

A **view** is an entity that knows how to render itself. Any struct that implements the `Render` trait can be a view. Views hold state and describe their UI in the `render()` method.

```rust
impl Render for Counter {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        div().child(format!("Count: {}", self.count))
    }
}
```

### Elements

Elements are the building blocks of UI. The `div()` function creates a container that you style with method chains. GPUI uses flexbox layout with methods that mirror Tailwind CSS naming.

```rust
div()
    .flex()
    .gap_4()
    .p_4()
    .bg(rgb(0x1e1e2e))
    .rounded_lg()
    .child("Hello, GPUI!")
```

### Context

Context types (`App`, `Context<T>`, `Window`) are how you interact with GPUI. They're passed to your functions and provide access to:

- Creating and updating entities
- Opening windows
- Spawning async tasks
- Managing focus
- Subscribing to events

## Ready to Start?

Head to **Getting Started** to build your first GPUI applications—a Hello World and a Counter that will teach you the fundamentals.

## Community

GPUI is open source and community-driven:

- [GitHub](https://github.com/gpui-ce/gpui-ce) — Source code and issues
- [Discord](https://discord.gg/zed-community) — Chat with the community
- [Zed](https://zed.dev) — The editor that powers GPUI development
