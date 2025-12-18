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

<pre><code class="language-rust"><span class="comment">// Create an entity with cx.new()</span>
<span class="keyword">let</span> counter<span class="punctuation">:</span> <span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">Counter</span><span class="punctuation">&gt;</span> = cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">Counter</span> <span class="punctuation">{</span> <span class="property">count</span><span class="punctuation">:</span> <span class="constant">0</span> <span class="punctuation">});</span></code></pre>

### Views

A **view** is an entity that knows how to render itself. Any struct that implements the `Render` trait can be a view. Views hold state and describe their UI in the `render()` method.

<pre><code class="language-rust"><span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Count: {}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">count</span><span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span></code></pre>

### Elements

Elements are the building blocks of UI. The `div()` function creates a container that you style with method chains. GPUI uses flexbox layout with methods that mirror Tailwind CSS naming.

<pre><code class="language-rust"><span class="function">div</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1e1e2e</span><span class="punctuation">))</span>
    <span class="punctuation">.</span><span class="property">rounded_lg</span><span class="punctuation">()</span>
    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Hello, GPUI!&quot;</span><span class="punctuation">)</span></code></pre>

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
