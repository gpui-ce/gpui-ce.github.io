+++
title = "Tree"
description = "Renders a div with deep children hierarchy. This example is useful to exemplify that Zed can"
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example tree"
source_file = "crates/gpui/examples/tree.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="comment">//! Renders a div with deep children hierarchy. This example is useful to exemplify that Zed can
//! handle deep hierarchies (even though it cannot just yet!).
</span><span class="keyword">use</span> std<span class="punctuation">::</span>sync<span class="punctuation">::</span><span class="constructor">LazyLock</span><span class="punctuation">;</span>

<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span>
    size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Tree</span> <span class="punctuation">{}</span>

<span class="keyword">static</span> <span class="constructor">DEPTH</span><span class="punctuation">:</span> <span class="type">LazyLock</span><span class="punctuation">&lt;</span><span class="type">u64</span><span class="punctuation">&gt;</span> = <span class="constructor">LazyLock</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>|| <span class="punctuation">{</span>
    std<span class="punctuation">::</span>env<span class="punctuation">::</span><span class="function">var</span><span class="punctuation">(</span><span class="string">&quot;GPUI_TREE_DEPTH&quot;</span><span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">ok</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">and_then</span><span class="punctuation">(</span>|depth| depth<span class="punctuation">.</span><span class="property">parse</span><span class="punctuation">().</span><span class="property">ok</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">unwrap_or_else</span><span class="punctuation">(</span>|| <span class="constant">50</span><span class="punctuation">)</span>
<span class="punctuation">});</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">Tree</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> depth = <span class="operator">*</span><span class="constructor">DEPTH</span><span class="punctuation">;</span>
        <span class="keyword">static</span> <span class="constructor">COLORS</span><span class="punctuation">:</span> <span class="punctuation">[</span>gpui<span class="punctuation">::</span><span class="type">Hsla</span><span class="punctuation">;</span> <span class="constant">4</span><span class="punctuation">]</span> = <span class="punctuation">[</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">()];</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> colors = <span class="constructor">COLORS</span><span class="punctuation">.</span><span class="property">iter</span><span class="punctuation">().</span><span class="property">cycle</span><span class="punctuation">().</span><span class="property">copied</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> next_div = || <span class="function">div</span><span class="punctuation">().</span><span class="property">p_0p5</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">next</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">());</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> innermost_node = <span class="function">next_div</span><span class="punctuation">();</span>
        <span class="keyword">while</span> depth &gt; <span class="constant">0</span> <span class="punctuation">{</span>
            innermost_node = <span class="function">next_div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>innermost_node<span class="punctuation">);</span>
            depth -= <span class="constant">1</span><span class="punctuation">;</span>
        <span class="punctuation">}</span>
        innermost_node
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">Tree</span> <span class="punctuation">{}),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
