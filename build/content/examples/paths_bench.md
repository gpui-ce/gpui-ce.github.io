+++
title = "Paths Bench"
description = ""
template = "page.html"

[extra]
run_command = "cargo run --example paths_bench"
source_file = "examples/bench/paths_bench.rs"
category = "bench"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Background</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">ColorSpace</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Path</span><span class="punctuation">,</span> <span class="constructor">PathBuilder</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Render</span><span class="punctuation">,</span>
    <span class="constructor">TitlebarOptions</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> canvas<span class="punctuation">,</span> div<span class="punctuation">,</span> linear_color_stop<span class="punctuation">,</span>
    linear_gradient<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">const</span> <span class="constructor">DEFAULT_WINDOW_WIDTH</span><span class="punctuation">:</span> <span class="type">Pixels</span> = <span class="function">px</span><span class="punctuation">(</span><span class="constant">1024.0</span><span class="punctuation">);</span>
<span class="keyword">const</span> <span class="constructor">DEFAULT_WINDOW_HEIGHT</span><span class="punctuation">:</span> <span class="type">Pixels</span> = <span class="function">px</span><span class="punctuation">(</span><span class="constant">768.0</span><span class="punctuation">);</span>

<span class="keyword">struct</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="property">default_lines</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;(</span><span class="type">Path</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span> <span class="type">Background</span><span class="punctuation">)&gt;,</span>
    <span class="property">_painting</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> lines = <span class="macro">vec!</span><span class="punctuation">[];</span>

        <span class="comment">// draw a lightening bolt ⚡</span>
        <span class="keyword">for</span> _ <span class="keyword">in</span> <span class="constant">0</span>..<span class="constant">2000</span> <span class="punctuation">{</span>
            <span class="comment">// draw a ⭐</span>
            <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
            builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">100.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">370.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">160.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">430.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">160.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">380.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">400.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">220.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">320.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">270.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">160.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">330.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">160.</span><span class="punctuation">)));</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">100.</span><span class="punctuation">)));</span>
            <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
            lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>
                path<span class="punctuation">,</span>
                <span class="function">linear_gradient</span><span class="punctuation">(</span>
                    <span class="constant">180.</span><span class="punctuation">,</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFACC15</span><span class="punctuation">),</span> <span class="constant">0.7</span><span class="punctuation">),</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xD56D0C</span><span class="punctuation">),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span><span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="constructor">Oklab</span><span class="punctuation">),</span>
            <span class="punctuation">));</span>
        <span class="punctuation">}</span>

        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">default_lines</span><span class="punctuation">:</span> lines<span class="punctuation">,</span>
            <span class="property">_painting</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        window<span class="punctuation">.</span><span class="property">request_animation_frame</span><span class="punctuation">();</span>
        <span class="keyword">let</span> lines = <span class="variable">self</span><span class="punctuation">.</span><span class="property">default_lines</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">canvas</span><span class="punctuation">(</span>
                <span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{},</span>
                <span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                    <span class="keyword">for</span> <span class="punctuation">(</span>path<span class="punctuation">,</span> color<span class="punctuation">)</span> <span class="keyword">in</span> lines <span class="punctuation">{</span>
                        window<span class="punctuation">.</span><span class="property">paint_path</span><span class="punctuation">(</span>path<span class="punctuation">,</span> color<span class="punctuation">);</span>
                    <span class="punctuation">}</span>
                <span class="punctuation">},</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">(),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="type">TitlebarOptions</span> <span class="punctuation">{</span>
                    <span class="property">title</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="string">&quot;Vulkan&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">}),</span>
                <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="function">size</span><span class="punctuation">(</span><span class="constructor">DEFAULT_WINDOW_WIDTH</span><span class="punctuation">,</span> <span class="constructor">DEFAULT_WINDOW_HEIGHT</span><span class="punctuation">),</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">))),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">PaintingViewer</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">)),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
