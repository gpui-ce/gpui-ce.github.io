+++
title = "Getting Started"
description = "Learn GPUI by building your first apps: Hello World and a Counter"
template = "learn-page.html"
weight = 1
+++

# Getting Started with GPUI

In this tutorial, you'll learn the fundamentals of GPUI by building two small applications:

1. **Hello World** — Display text in a window
2. **Counter** — Add interactivity with state and events

By the end, you'll understand the core concepts that power every GPUI application.

---

## Prerequisites

Before starting, make sure you have:

- [Rust](https://rustup.rs/) installed (1.75 or later)
- A code editor
- Basic familiarity with Rust syntax

## Setting Up Your Project

Create a new Rust project:

```bash
cargo new my-gpui-app
cd my-gpui-app
```

Add GPUI to your `Cargo.toml`:

```toml
[package]
name = "my-gpui-app"
version = "0.1.0"
edition = "2024"

[dependencies]
gpui = { git = "https://github.com/zed-industries/zed" }
```

> **Note:** GPUI is part of the Zed repository. Check the [GPUI Community Edition](https://github.com/nicholasoxford/gpui-ce) for a standalone version.

---

## Part 1: Hello World

Let's start with the simplest possible GPUI application—a window that displays "Hello, World!".

### The Complete Code

Replace the contents of `src/main.rs` with:

```rust
use gpui::{
    div, prelude::*, px, rgb, size, App, Application, Bounds, Context, 
    SharedString, Window, WindowBounds, WindowOptions,
};

struct HelloWorld {
    text: SharedString,
}

impl Render for HelloWorld {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .size_full()
            .bg(rgb(0x1e1e2e))
            .flex()
            .justify_center()
            .items_center()
            .text_xl()
            .text_color(rgb(0xcdd6f4))
            .child(format!("Hello, {}!", self.text))
    }
}

fn main() {
    Application::new().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(400.), px(300.)), cx);
        
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                cx.new(|_cx| HelloWorld {
                    text: "World".into(),
                })
            },
        )
        .unwrap();
        
        cx.activate(true);
    });
}
```

Run it with `cargo run`. You should see a window with "Hello, World!" centered on a dark background.

### Understanding the Code

Let's break this down piece by piece.

#### 1. The Application Entry Point

```rust
fn main() {
    Application::new().run(|cx: &mut App| {
        // ...
    });
}
```

Every GPUI app starts with `Application::new().run(...)`. The closure receives an `App` context (`cx`), which is your gateway to the GPUI runtime. Through `cx`, you can:

- Open windows
- Create entities (state containers)
- Access global state
- Spawn async tasks

#### 2. Opening a Window

```rust
let bounds = Bounds::centered(None, size(px(400.), px(300.)), cx);

cx.open_window(
    WindowOptions {
        window_bounds: Some(WindowBounds::Windowed(bounds)),
        ..Default::default()
    },
    |_window, cx| {
        // Create the root view here
    },
)
```

`cx.open_window` creates a new window. The second argument is a closure that returns the **root view**—the main content of the window.

#### 3. The View Struct

```rust
struct HelloWorld {
    text: SharedString,
}
```

In GPUI, a **view** is a struct that holds state and implements the `Render` trait. Views are the building blocks of your UI.

`SharedString` is GPUI's efficient string type—it's either a `&'static str` or an `Arc<str>`, avoiding unnecessary allocations.

#### 4. Creating an Entity

```rust
cx.new(|_cx| HelloWorld {
    text: "World".into(),
})
```

`cx.new(...)` creates an **Entity**—a handle to state managed by GPUI. Think of it as a smart pointer that GPUI knows about. When you call `cx.new`, you're:

1. Allocating state on the GPUI heap
2. Getting back an `Entity<HelloWorld>` handle
3. Allowing GPUI to track and re-render this view when its state changes

#### 5. The Render Trait

```rust
impl Render for HelloWorld {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .size_full()
            .bg(rgb(0x1e1e2e))
            // ... more styling
            .child(format!("Hello, {}!", self.text))
    }
}
```

The `Render` trait is how views describe their UI. Every time GPUI needs to draw your view, it calls `render()`.

Key points:
- **`&mut self`** — You have mutable access to your state
- **`_window`** — Access to window-specific features (focus, clipboard, etc.)
- **`_cx: &mut Context<Self>`** — A context scoped to this entity
- **Returns `impl IntoElement`** — Return anything that can become a UI element

#### 6. Building UI with Elements

```rust
div()
    .size_full()           // Fill the parent container
    .bg(rgb(0x1e1e2e))     // Background color
    .flex()                 // Use flexbox layout
    .justify_center()       // Center children horizontally
    .items_center()         // Center children vertically
    .text_xl()              // Large text size
    .text_color(rgb(0xcdd6f4))  // Text color
    .child(format!("Hello, {}!", self.text))  // Add a child element
```

GPUI uses a **fluent builder pattern** for constructing UI. Each method returns `self`, allowing you to chain calls. The styling methods mirror [Tailwind CSS](https://tailwindcss.com/) naming conventions.

The `div()` function creates a container element—similar to HTML's `<div>`. You style it with method chains and add content with `.child()`.

---

## Part 2: Building a Counter

Now let's make something interactive. We'll build a counter that you can increment and decrement by clicking buttons.

### The Complete Code

```rust
use gpui::{
    div, prelude::*, px, rgb, size, App, Application, Bounds, Context, 
    Window, WindowBounds, WindowOptions,
};

struct Counter {
    count: i32,
}

impl Counter {
    fn increment(&mut self, _event: &ClickEvent, _window: &mut Window, cx: &mut Context<Self>) {
        self.count += 1;
        cx.notify();
    }

    fn decrement(&mut self, _event: &ClickEvent, _window: &mut Window, cx: &mut Context<Self>) {
        self.count -= 1;
        cx.notify();
    }
}

impl Render for Counter {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        // Colors
        let bg_color = rgb(0x1e1e2e);
        let text_color = rgb(0xcdd6f4);
        let button_bg = rgb(0x45475a);
        let button_hover = rgb(0x585b70);

        div()
            .size_full()
            .bg(bg_color)
            .flex()
            .flex_col()
            .gap_4()
            .justify_center()
            .items_center()
            .text_color(text_color)
            .child(
                // The count display
                div()
                    .text_3xl()
                    .child(format!("{}", self.count))
            )
            .child(
                // Button row
                div()
                    .flex()
                    .gap_2()
                    .child(
                        div()
                            .id("decrement")
                            .px_4()
                            .py_2()
                            .bg(button_bg)
                            .hover(|style| style.bg(button_hover))
                            .rounded_md()
                            .cursor_pointer()
                            .child("−")
                            .on_click(cx.listener(Self::decrement))
                    )
                    .child(
                        div()
                            .id("increment")
                            .px_4()
                            .py_2()
                            .bg(button_bg)
                            .hover(|style| style.bg(button_hover))
                            .rounded_md()
                            .cursor_pointer()
                            .child("+")
                            .on_click(cx.listener(Self::increment))
                    )
            )
    }
}

fn main() {
    Application::new().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(300.), px(200.)), cx);
        
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                cx.new(|_cx| Counter { count: 0 })
            },
        )
        .unwrap();
        
        cx.activate(true);
    });
}
```

Run it with `cargo run`. Click the buttons to increment and decrement the counter!

### What's New?

#### 1. Event Handlers

```rust
fn increment(&mut self, _event: &ClickEvent, _window: &mut Window, cx: &mut Context<Self>) {
    self.count += 1;
    cx.notify();
}
```

Event handlers are methods on your view. They receive:
- **`&mut self`** — Mutable access to your view's state
- **`&ClickEvent`** — Information about the event (position, modifiers, etc.)
- **`&mut Window`** — Window context for focus, actions, etc.
- **`&mut Context<Self>`** — Entity context for GPUI operations

#### 2. Triggering Re-renders with `cx.notify()`

```rust
self.count += 1;
cx.notify();  // Tell GPUI this view needs to re-render
```

GPUI doesn't automatically know when your state changes. After modifying state, call `cx.notify()` to tell GPUI to re-render this view.

#### 3. Element IDs

```rust
div()
    .id("increment")
    // ...
```

Interactive elements need an **ID**. This helps GPUI track which element received an event. Without an ID, event handlers won't work.

IDs only need to be unique among siblings—you can reuse the same ID in different parts of your tree.

#### 4. Registering Event Listeners

```rust
.on_click(cx.listener(Self::increment))
```

`cx.listener(...)` is the bridge between UI events and your view's methods. It:

1. Takes a method reference (`Self::increment`)
2. Returns a callback that GPUI can call when the event occurs
3. Automatically provides `&mut self`, `window`, and `cx` to your handler

This pattern is central to GPUI—it's how interactive UI communicates back to your state.

#### 5. Hover States

```rust
.bg(button_bg)
.hover(|style| style.bg(button_hover))
```

The `.hover()` method lets you define styles that apply when the element is hovered. The closure receives a style builder and returns the modified styles.

#### 6. Layout with Flexbox

```rust
div()
    .flex()          // Enable flexbox
    .flex_col()      // Stack children vertically
    .gap_4()         // Add spacing between children
    .justify_center() // Center on main axis
    .items_center()   // Center on cross axis
```

GPUI uses flexbox for layout, with methods that mirror Tailwind CSS:

| Method | CSS Equivalent |
|--------|---------------|
| `.flex()` | `display: flex` |
| `.flex_col()` | `flex-direction: column` |
| `.gap_4()` | `gap: 1rem` (16px) |
| `.justify_center()` | `justify-content: center` |
| `.items_center()` | `align-items: center` |

---

## Key Concepts Recap

### The GPUI Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│  Application                                                     │
│  └── Window                                                      │
│      └── Entity<Counter>  ←── Your view's state lives here      │
│          └── render() → Elements ←── UI is rebuilt each frame   │
└─────────────────────────────────────────────────────────────────┘
```

1. **Application** — The runtime that manages everything
2. **Window** — A native OS window
3. **Entity** — A handle to state managed by GPUI
4. **Elements** — The UI tree produced by `render()`

### The Update Cycle

```
User clicks button
       ↓
on_click handler fires
       ↓
Handler modifies self.count
       ↓
Handler calls cx.notify()
       ↓
GPUI calls render() again
       ↓
New UI tree reflects new state
```

### Context Types

You'll encounter several context types in GPUI:

| Type | When You Get It | What It's For |
|------|-----------------|---------------|
| `App` | In `Application::run` | App-level operations |
| `Context<T>` | In `render()` and listeners | Entity-specific operations |
| `Window` | In `render()` and listeners | Window-specific operations |

---

## What's Next?

Now that you understand the basics, you can:

1. **Add more features to the counter** — Try adding a reset button, or displaying whether the count is even or odd

2. **Explore styling** — Check out the [Styling Guide](/learn/styling) for all available style methods

3. **Learn about components** — See how to create reusable UI pieces with `RenderOnce`

4. **Build a Todo app** — Apply these concepts to a more complex application

---

## Common Gotchas

### "My click handler isn't firing"

Make sure the element has an `.id()`:

```rust
// ❌ Won't work
div().on_click(cx.listener(Self::handle_click))

// ✅ Works
div().id("my-button").on_click(cx.listener(Self::handle_click))
```

### "My UI isn't updating"

Don't forget to call `cx.notify()` after changing state:

```rust
fn increment(&mut self, _: &ClickEvent, _: &mut Window, cx: &mut Context<Self>) {
    self.count += 1;
    cx.notify();  // ← Don't forget this!
}
```

### "Type mismatch with event handlers"

Event handlers have a specific signature. Make sure yours matches:

```rust
fn handler(
    &mut self,
    event: &ClickEvent,      // The event type must match
    window: &mut Window,
    cx: &mut Context<Self>,
)
```

---

## Full Counter Example with Comments

Here's the complete counter with detailed comments:

```rust
use gpui::{
    div, prelude::*, px, rgb, size, App, Application, Bounds, Context,
    Window, WindowBounds, WindowOptions,
};

// Our view's state. This struct holds all the data our UI needs.
struct Counter {
    count: i32,
}

impl Counter {
    // Event handler for the increment button.
    // The signature follows GPUI's listener pattern.
    fn increment(&mut self, _event: &ClickEvent, _window: &mut Window, cx: &mut Context<Self>) {
        self.count += 1;  // Modify state
        cx.notify();       // Tell GPUI to re-render
    }

    fn decrement(&mut self, _event: &ClickEvent, _window: &mut Window, cx: &mut Context<Self>) {
        self.count -= 1;
        cx.notify();
    }
}

// The Render trait is how GPUI knows how to draw our view.
impl Render for Counter {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        // Define colors as variables for readability
        let bg_color = rgb(0x1e1e2e);
        let text_color = rgb(0xcdd6f4);
        let button_bg = rgb(0x45475a);
        let button_hover = rgb(0x585b70);

        // Build our UI tree
        div()
            // Root container styling
            .size_full()
            .bg(bg_color)
            .flex()
            .flex_col()
            .gap_4()
            .justify_center()
            .items_center()
            .text_color(text_color)
            
            // Count display
            .child(
                div()
                    .text_3xl()
                    .child(format!("{}", self.count))
            )
            
            // Button container
            .child(
                div()
                    .flex()
                    .gap_2()
                    
                    // Decrement button
                    .child(
                        div()
                            .id("decrement")  // ID required for click events
                            .px_4()
                            .py_2()
                            .bg(button_bg)
                            .hover(|s| s.bg(button_hover))
                            .rounded_md()
                            .cursor_pointer()
                            .child("−")
                            .on_click(cx.listener(Self::decrement))
                    )
                    
                    // Increment button
                    .child(
                        div()
                            .id("increment")
                            .px_4()
                            .py_2()
                            .bg(button_bg)
                            .hover(|s| s.bg(button_hover))
                            .rounded_md()
                            .cursor_pointer()
                            .child("+")
                            .on_click(cx.listener(Self::increment))
                    )
            )
    }
}

fn main() {
    // Create and run the application
    Application::new().run(|cx: &mut App| {
        // Define window size and position
        let bounds = Bounds::centered(None, size(px(300.), px(200.)), cx);

        // Open a window with our Counter view
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                // Create the root entity
                cx.new(|_cx| Counter { count: 0 })
            },
        )
        .unwrap();

        // Bring the app to the foreground
        cx.activate(true);
    });
}
```
