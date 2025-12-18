+++
title = "Hello World"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example hello_world"
source_file = "crates/gpui/examples/hello_world.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span>
    prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="property">text</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x505050</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">shadow_lg</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x0000ff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Hello, {}!&quot;</span><span class="punctuation">,</span> <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">text</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">()),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_dashed</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">()),</span>
                    <span class="punctuation">),</span>
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
            |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">HelloWorld</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="string">&quot;World&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
