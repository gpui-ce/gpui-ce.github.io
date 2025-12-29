+++
title = "Pattern"
description = ""
template = "page.html"

[extra]
run_command = "cargo run --example pattern"
source_file = "examples/bench/pattern.rs"
category = "bench"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">AppContext</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span>
    linear_color_stop<span class="punctuation">,</span> linear_gradient<span class="punctuation">,</span> pattern_slash<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">PatternExample</span><span class="punctuation">;</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">PatternExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">shadow_lg</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x000000</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Pattern Example&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">54.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">18.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">54.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">18.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">54.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">18.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">54.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">18.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                        <span class="constant">18.0</span> / <span class="constant">4.0</span><span class="punctuation">,</span>
                        <span class="constant">18.0</span> / <span class="constant">2.0</span><span class="punctuation">,</span>
                    <span class="punctuation">))),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.16</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Elements the same height should align&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">256.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">56.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">256.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">56.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">256.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">56.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                    <span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">256.0</span><span class="punctuation">)).</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">26.0</span><span class="punctuation">)).</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">pattern_slash</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">(),</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                        <span class="constant">56.0</span> / <span class="constant">6.0</span><span class="punctuation">,</span>
                    <span class="punctuation">))),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">240.0</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.0</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">()),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">240.0</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.0</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                        <span class="constant">45.</span><span class="punctuation">,</span>
                        <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                        <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                    <span class="punctuation">)),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="constructor">PatternExample</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
