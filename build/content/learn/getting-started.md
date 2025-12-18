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

<pre><code class="language-bash"><span class="function">cargo</span> new my-gpui-app
<span class="function">cd</span> my-gpui-app</code></pre>

Add GPUI to your `Cargo.toml`:

<pre><code class="language-toml"><span class="punctuation">[</span><span class="property">package</span><span class="punctuation">]</span>
<span class="property">name</span> <span class="operator">=</span> <span class="string">&quot;my-gpui-app&quot;</span>
<span class="property">version</span> <span class="operator">=</span> <span class="string">&quot;0.1.0&quot;</span>
<span class="property">edition</span> <span class="operator">=</span> <span class="string">&quot;2024&quot;</span>

<span class="punctuation">[</span><span class="property">dependencies</span><span class="punctuation">]</span>
<span class="property">gpui</span> <span class="operator">=</span> <span class="punctuation">{</span> <span class="property">git</span> <span class="operator">=</span> <span class="string">&quot;https://github.com/zed-industries/zed&quot;</span> <span class="punctuation">}</span></code></pre>

> **Note:** GPUI is part of the Zed repository. Check the [GPUI Community Edition](https://github.com/nicholasoxford/gpui-ce) for a standalone version.

---

## Part 1: Hello World

Let's start with the simplest possible GPUI application—a window that displays "Hello, World!".

### The Complete Code

Replace the contents of `src/main.rs` with:

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> 
    <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="property">text</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xcdd6f4</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Hello, {}!&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">text</span><span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">400.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">HelloWorld</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="string">&quot;World&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>

Run it with `cargo run`. You should see a window with "Hello, World!" centered on a dark background.

### Understanding the Code

Let's break this down piece by piece.

#### 1. The Application Entry Point

<pre><code class="language-rust"><span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="comment">// ...</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>

Every GPUI app starts with `Application::new().run(...)`. The closure receives an `App` context (`cx`), which is your gateway to the GPUI runtime. Through `cx`, you can:

- Open windows
- Create entities (state containers)
- Access global state
- Spawn async tasks

#### 2. Opening a Window

<pre><code class="language-rust"><span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">400.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>

cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
    <span class="punctuation">},</span>
    |_window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
        <span class="comment">// Create the root view here</span>
    <span class="punctuation">},</span>
<span class="punctuation">)</span></code></pre>

`cx.open_window` creates a new window. The second argument is a closure that returns the **root view**—the main content of the window.

#### 3. The View Struct

<pre><code class="language-rust"><span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="property">text</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
<span class="punctuation">}</span></code></pre>

In GPUI, a **view** is a struct that holds state and implements the `Render` trait. Views are the building blocks of your UI.

`SharedString` is GPUI's efficient string type—it's either a `&'static str` or an `Arc<str>`, avoiding unnecessary allocations.

#### 4. Creating an Entity

<pre><code class="language-rust">cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="property">text</span><span class="punctuation">:</span> <span class="string">&quot;World&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
<span class="punctuation">})</span></code></pre>

`cx.new(...)` creates an **Entity**—a handle to state managed by GPUI. Think of it as a smart pointer that GPUI knows about. When you call `cx.new`, you're:

1. Allocating state on the GPUI heap
2. Getting back an `Entity<HelloWorld>` handle
3. Allowing GPUI to track and re-render this view when its state changes

#### 5. The Render Trait

<pre><code class="language-rust"><span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">))</span>
            <span class="comment">// ... more styling</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Hello, {}!&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">text</span><span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span></code></pre>

The `Render` trait is how views describe their UI. Every time GPUI needs to draw your view, it calls `render()`.

Key points:
- **`&mut self`** — You have mutable access to your state
- **`_window`** — Access to window-specific features (focus, clipboard, etc.)
- **`_cx: &mut Context<Self>`** — A context scoped to this entity
- **Returns `impl IntoElement`** — Return anything that can become a UI element

#### 6. Building UI with Elements

<pre><code class="language-rust"><span class="function">div</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>           <span class="comment">// Fill the parent container</span>
    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">))</span>     <span class="comment">// Background color</span>
    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>                 <span class="comment">// Use flexbox layout</span>
    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>       <span class="comment">// Center children horizontally</span>
    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>         <span class="comment">// Center children vertically</span>
    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>              <span class="comment">// Large text size</span>
    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xcdd6f4</span><span class="punctuation">))</span>  <span class="comment">// Text color</span>
    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Hello, {}!&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">text</span><span class="punctuation">))</span>  <span class="comment">// Add a child element</span></code></pre>

GPUI uses a **fluent builder pattern** for constructing UI. Each method returns `self`, allowing you to chain calls. The styling methods mirror [Tailwind CSS](https://tailwindcss.com/) naming conventions.

The `div()` function creates a container element—similar to HTML's `<div>`. You style it with method chains and add content with `.child()`.

---

## Part 2: Building a Counter

Now let's make something interactive. We'll build a counter that you can increment and decrement by clicking buttons.

### The Complete Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> 
    <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="property">count</span><span class="punctuation">:</span> <span class="type">i32</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">increment</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> += <span class="constant">1</span><span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">decrement</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> -= <span class="constant">1</span><span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="comment">// Colors</span>
        <span class="keyword">let</span> bg_color = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">);</span>
        <span class="keyword">let</span> text_color = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xcdd6f4</span><span class="punctuation">);</span>
        <span class="keyword">let</span> button_bg = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x45475a</span><span class="punctuation">);</span>
        <span class="keyword">let</span> button_hover = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x585b70</span><span class="punctuation">);</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>bg_color<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_color<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="comment">// The count display</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_3xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span><span class="punctuation">))</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="comment">// Button row</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;decrement&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">py_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_bg<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|style| style<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_hover<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;−&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>decrement<span class="punctuation">))</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;increment&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">py_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_bg<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|style| style<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_hover<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;+&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>increment<span class="punctuation">))</span>
                    <span class="punctuation">)</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">Counter</span> <span class="punctuation">{</span> <span class="property">count</span><span class="punctuation">:</span> <span class="constant">0</span> <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>

Run it with `cargo run`. Click the buttons to increment and decrement the counter!

### What's New?

#### 1. Event Handlers

<pre><code class="language-rust"><span class="keyword">fn</span> <span class="function">increment</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
    <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> += <span class="constant">1</span><span class="punctuation">;</span>
    cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
<span class="punctuation">}</span></code></pre>

Event handlers are methods on your view. They receive:
- **`&mut self`** — Mutable access to your view's state
- **`&ClickEvent`** — Information about the event (position, modifiers, etc.)
- **`&mut Window`** — Window context for focus, actions, etc.
- **`&mut Context<Self>`** — Entity context for GPUI operations

#### 2. Triggering Re-renders with `cx.notify()`

<pre><code class="language-rust"><span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> += <span class="constant">1</span><span class="punctuation">;</span>
cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>  <span class="comment">// Tell GPUI this view needs to re-render</span></code></pre>

GPUI doesn't automatically know when your state changes. After modifying state, call `cx.notify()` to tell GPUI to re-render this view.

#### 3. Element IDs

<pre><code class="language-rust"><span class="function">div</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;increment&quot;</span><span class="punctuation">)</span>
    <span class="comment">// ...</span></code></pre>

Interactive elements need an **ID**. This helps GPUI track which element received an event. Without an ID, event handlers won't work.

IDs only need to be unique among siblings—you can reuse the same ID in different parts of your tree.

#### 4. Registering Event Listeners

<pre><code class="language-rust"><span class="punctuation">.</span><span class="function">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>increment<span class="punctuation">))</span></code></pre>

`cx.listener(...)` is the bridge between UI events and your view's methods. It:

1. Takes a method reference (`Self::increment`)
2. Returns a callback that GPUI can call when the event occurs
3. Automatically provides `&mut self`, `window`, and `cx` to your handler

This pattern is central to GPUI—it's how interactive UI communicates back to your state.

#### 5. Hover States

<pre><code class="language-rust"><span class="punctuation">.</span><span class="function">bg</span><span class="punctuation">(</span>button_bg<span class="punctuation">)</span>
<span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|style| style<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_hover<span class="punctuation">))</span></code></pre>

The `.hover()` method lets you define styles that apply when the element is hovered. The closure receives a style builder and returns the modified styles.

#### 6. Layout with Flexbox

<pre><code class="language-rust"><span class="function">div</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>          <span class="comment">// Enable flexbox</span>
    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>      <span class="comment">// Stack children vertically</span>
    <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>         <span class="comment">// Add spacing between children</span>
    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span> <span class="comment">// Center on main axis</span>
    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>   <span class="comment">// Center on cross axis</span></code></pre>

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

<pre><code class="language-rust"><span class="comment">// ❌ Won&#39;t work</span>
<span class="function">div</span><span class="punctuation">().</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>handle_click<span class="punctuation">))</span>

<span class="comment">// ✅ Works</span>
div<span class="punctuation">().</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;my-button&quot;</span><span class="punctuation">).</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>handle_click<span class="punctuation">))</span></code></pre>

### "My UI isn't updating"

Don't forget to call `cx.notify()` after changing state:

<pre><code class="language-rust"><span class="keyword">fn</span> <span class="function">increment</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
    <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> += <span class="constant">1</span><span class="punctuation">;</span>
    cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>  <span class="comment">// ← Don&#39;t forget this!</span>
<span class="punctuation">}</span></code></pre>

### "Type mismatch with event handlers"

Event handlers have a specific signature. Make sure yours matches:

<pre><code class="language-rust"><span class="keyword">fn</span> <span class="function">handler</span><span class="punctuation">(</span>
    <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
    <span class="variable">event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span>      <span class="comment">// The event type must match</span>
    <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
    <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
<span class="punctuation">)</span></code></pre>

---

## Full Counter Example with Comments

Here's the complete counter with detailed comments:

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span>
    <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="comment">// Our view&#39;s state. This struct holds all the data our UI needs.</span>
<span class="keyword">struct</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="property">count</span><span class="punctuation">:</span> <span class="type">i32</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="comment">// Event handler for the increment button.</span>
    <span class="comment">// The signature follows GPUI&#39;s listener pattern.</span>
    <span class="keyword">fn</span> <span class="function">increment</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> += <span class="constant">1</span><span class="punctuation">;</span>  <span class="comment">// Modify state</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>       <span class="comment">// Tell GPUI to re-render</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">decrement</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span> -= <span class="constant">1</span><span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="comment">// The Render trait is how GPUI knows how to draw our view.</span>
<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="comment">// Define colors as variables for readability</span>
        <span class="keyword">let</span> bg_color = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">);</span>
        <span class="keyword">let</span> text_color = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xcdd6f4</span><span class="punctuation">);</span>
        <span class="keyword">let</span> button_bg = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x45475a</span><span class="punctuation">);</span>
        <span class="keyword">let</span> button_hover = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x585b70</span><span class="punctuation">);</span>

        <span class="comment">// Build our UI tree</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="comment">// Root container styling</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>bg_color<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_color<span class="punctuation">)</span>
            
            <span class="comment">// Count display</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_3xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span><span class="punctuation">))</span>
            <span class="punctuation">)</span>
            
            <span class="comment">// Button container</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    
                    <span class="comment">// Decrement button</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;decrement&quot;</span><span class="punctuation">)</span>  <span class="comment">// ID required for click events</span>
                            <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">py_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_bg<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|s| s<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_hover<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;−&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>decrement<span class="punctuation">))</span>
                    <span class="punctuation">)</span>
                    
                    <span class="comment">// Increment button</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;increment&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">py_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_bg<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|s| s<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>button_hover<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;+&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>increment<span class="punctuation">))</span>
                    <span class="punctuation">)</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="comment">// Create and run the application</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="comment">// Define window size and position</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>

        <span class="comment">// Open a window with our Counter view</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                <span class="comment">// Create the root entity</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">Counter</span> <span class="punctuation">{</span> <span class="property">count</span><span class="punctuation">:</span> <span class="constant">0</span> <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        <span class="comment">// Bring the app to the foreground</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
