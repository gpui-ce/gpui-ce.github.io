+++
title = "Layer Shell"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example layer_shell"
source_file = "crates/gpui/examples/layer_shell.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">cfg</span><span class="punctuation">(</span><span class="attribute">all</span><span class="punctuation">(</span><span class="attribute">target_os = </span><span class="string">&quot;linux&quot;</span><span class="punctuation">,</span><span class="attribute"> feature = </span><span class="string">&quot;wayland&quot;</span><span class="punctuation">))]</span>
    example<span class="punctuation">::</span><span class="function">main</span><span class="punctuation">();</span>

    <span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">cfg</span><span class="punctuation">(</span><span class="attribute">not</span><span class="punctuation">(</span><span class="attribute">all</span><span class="punctuation">(</span><span class="attribute">target_os = </span><span class="string">&quot;linux&quot;</span><span class="punctuation">,</span><span class="attribute"> feature = </span><span class="string">&quot;wayland&quot;</span><span class="punctuation">)))]</span>
    <span class="macro">panic!</span><span class="punctuation">(</span><span class="string">&quot;This example requires the `wayland` feature and a linux system.&quot;</span><span class="punctuation">);</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">cfg</span><span class="punctuation">(</span><span class="attribute">all</span><span class="punctuation">(</span><span class="attribute">target_os = </span><span class="string">&quot;linux&quot;</span><span class="punctuation">,</span><span class="attribute"> feature = </span><span class="string">&quot;wayland&quot;</span><span class="punctuation">))]</span>
<span class="keyword">mod</span> example <span class="punctuation">{</span>
    <span class="keyword">use</span> std<span class="punctuation">::</span>time<span class="punctuation">::{</span><span class="constructor">Duration</span><span class="punctuation">,</span> <span class="constructor">SystemTime</span><span class="punctuation">,</span> <span class="constructor">UNIX_EPOCH</span><span class="punctuation">};</span>

    <span class="keyword">use</span> gpui<span class="punctuation">::{</span>
        <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">,</span> <span class="constructor">Size</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">,</span>
        <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowKind</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> layer_shell<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rems<span class="punctuation">,</span>
        rgba<span class="punctuation">,</span> white<span class="punctuation">,</span>
    <span class="punctuation">};</span>

    <span class="keyword">struct</span> <span class="type">LayerShellExample</span><span class="punctuation">;</span>

    <span class="keyword">impl</span> <span class="type">LayerShellExample</span> <span class="punctuation">{</span>
        <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">spawn</span><span class="punctuation">(</span><span class="keyword">async</span> <span class="keyword">move</span> |this<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                <span class="keyword">loop</span> <span class="punctuation">{</span>
                    <span class="keyword">let</span> _ = this<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">());</span>
                    cx<span class="punctuation">.</span><span class="property">background_executor</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">timer</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_millis</span><span class="punctuation">(</span><span class="constant">500</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="keyword">await</span><span class="punctuation">;</span>
                <span class="punctuation">}</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

            <span class="constructor">LayerShellExample</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">LayerShellExample</span> <span class="punctuation">{</span>
        <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
            <span class="keyword">let</span> now = <span class="constructor">SystemTime</span><span class="punctuation">::</span><span class="function">now</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">duration_since</span><span class="punctuation">(</span><span class="constructor">UNIX_EPOCH</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">as_secs</span><span class="punctuation">();</span>

            <span class="keyword">let</span> hours = <span class="punctuation">(</span>now / <span class="constant">3600</span><span class="punctuation">)</span> % <span class="constant">24</span><span class="punctuation">;</span>
            <span class="keyword">let</span> minutes = <span class="punctuation">(</span>now / <span class="constant">60</span><span class="punctuation">)</span> % <span class="constant">60</span><span class="punctuation">;</span>
            <span class="keyword">let</span> seconds = now % <span class="constant">60</span><span class="punctuation">;</span>

            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_size</span><span class="punctuation">(</span><span class="function">rems</span><span class="punctuation">(</span><span class="constant">4.5</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">EXTRA_BOLD</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">white</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgba</span><span class="punctuation">(</span><span class="constant">0x0000044</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">rounded_xl</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:02}:{:02}:{:02}&quot;</span><span class="punctuation">,</span> hours<span class="punctuation">,</span> minutes<span class="punctuation">,</span> seconds<span class="punctuation">))</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
        <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                    <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="type">Bounds</span> <span class="punctuation">{</span>
                        <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">)),</span>
                        <span class="property">size</span><span class="punctuation">:</span> <span class="constructor">Size</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)),</span>
                    <span class="punctuation">})),</span>
                    <span class="property">app_id</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="string">&quot;gpui-layer-shell-example&quot;</span><span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">()),</span>
                    <span class="property">window_background</span><span class="punctuation">:</span> <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">::</span><span class="constructor">Transparent</span><span class="punctuation">,</span>
                    <span class="property">kind</span><span class="punctuation">:</span> <span class="constructor">WindowKind</span><span class="punctuation">::</span><span class="constructor">LayerShell</span><span class="punctuation">(</span><span class="type">LayerShellOptions</span> <span class="punctuation">{</span>
                        <span class="property">namespace</span><span class="punctuation">:</span> <span class="string">&quot;gpui&quot;</span><span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">(),</span>
                        <span class="property">anchor</span><span class="punctuation">:</span> <span class="constructor">Anchor</span><span class="punctuation">::</span><span class="constructor">LEFT</span> | <span class="constructor">Anchor</span><span class="punctuation">::</span><span class="constructor">RIGHT</span> | <span class="constructor">Anchor</span><span class="punctuation">::</span><span class="constructor">BOTTOM</span><span class="punctuation">,</span>
                        <span class="property">margin</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">((</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">))),</span>
                        <span class="property">keyboard_interactivity</span><span class="punctuation">:</span> <span class="constructor">KeyboardInteractivity</span><span class="punctuation">::</span><span class="constructor">None</span><span class="punctuation">,</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">}),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span><span class="constructor">LayerShellExample</span><span class="punctuation">::</span>new<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="punctuation">});</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span></code></pre>
