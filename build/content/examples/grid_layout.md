+++
title = "Grid Layout"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example grid_layout"
source_file = "crates/gpui/examples/grid_layout.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span>
    px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="comment">// https://en.wikipedia.org/wiki/Holy_grail_(web_design)</span>
<span class="keyword">struct</span> <span class="type">HolyGrailExample</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HolyGrailExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> block = |<span class="variable">color</span><span class="punctuation">:</span> <span class="type">Hsla</span>| <span class="punctuation">{</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
        <span class="punctuation">};</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">grid</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x505050</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">shadow_lg</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">grid_cols</span><span class="punctuation">(</span><span class="constant">5</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">grid_rows</span><span class="punctuation">(</span><span class="constant">5</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">block</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">row_span</span><span class="punctuation">(</span><span class="constant">1</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">col_span_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Header&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">block</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">col_span</span><span class="punctuation">(</span><span class="constant">1</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">h_56</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Table of contents&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">block</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">col_span</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">row_span</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Content&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">block</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">col_span</span><span class="punctuation">(</span><span class="constant">1</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">row_span</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;AD :(&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">block</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">row_span</span><span class="punctuation">(</span><span class="constant">1</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">col_span_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Footer&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">HolyGrailExample</span> <span class="punctuation">{}),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
