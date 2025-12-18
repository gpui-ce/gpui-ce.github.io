+++
title = "Animation"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example animation"
source_file = "crates/gpui/examples/animation.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::</span>time<span class="punctuation">::</span><span class="constructor">Duration</span><span class="punctuation">;</span>

<span class="keyword">use</span> anyhow<span class="punctuation">::</span><span class="constructor">Result</span><span class="punctuation">;</span>
<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">Animation</span><span class="punctuation">,</span> <span class="constructor">AnimationExt</span> <span class="keyword">as</span> _<span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">AssetSource</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span>
    <span class="constructor">Transformation</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> bounce<span class="punctuation">,</span> div<span class="punctuation">,</span> ease_in_out<span class="punctuation">,</span> percentage<span class="punctuation">,</span>
    prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size<span class="punctuation">,</span> svg<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Assets</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">AssetSource</span> <span class="keyword">for</span> <span class="type">Assets</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">load</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; <span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Option</span><span class="punctuation">&lt;</span>std<span class="punctuation">::</span>borrow<span class="punctuation">::</span><span class="type">Cow</span><span class="punctuation">&lt;</span><span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">,</span> <span class="punctuation">[</span><span class="type">u8</span><span class="punctuation">]&gt;&gt;&gt;</span> <span class="punctuation">{</span>
        std<span class="punctuation">::</span>fs<span class="punctuation">::</span><span class="function">read</span><span class="punctuation">(</span>path<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span><span class="constructor">Into</span><span class="punctuation">::</span>into<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map_err</span><span class="punctuation">(</span><span class="constructor">Into</span><span class="punctuation">::</span>into<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span><span class="constructor">Some</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">list</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; <span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">SharedString</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="constructor">Ok</span><span class="punctuation">(</span>std<span class="punctuation">::</span>fs<span class="punctuation">::</span><span class="function">read_dir</span><span class="punctuation">(</span>path<span class="punctuation">)</span>?
            <span class="punctuation">.</span><span class="property">filter_map</span><span class="punctuation">(</span>|entry| <span class="punctuation">{</span>
                <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span>
                    entry<span class="punctuation">.</span><span class="property">ok</span><span class="punctuation">()</span>?<span class="punctuation">.</span><span class="property">path</span><span class="punctuation">().</span><span class="property">to_string_lossy</span><span class="punctuation">().</span><span class="property">into_owned</span><span class="punctuation">(),</span>
                <span class="punctuation">))</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">collect</span><span class="punctuation">::&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">_</span><span class="punctuation">&gt;&gt;())</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">const</span> <span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span> = <span class="macro">concat!</span><span class="punctuation">(</span>
    <span class="macro">env!</span><span class="punctuation">(</span><span class="string">&quot;CARGO_MANIFEST_DIR&quot;</span><span class="punctuation">),</span>
    <span class="string">&quot;/examples/image/arrow_circle.svg&quot;</span>
<span class="punctuation">);</span>

<span class="keyword">struct</span> <span class="type">AnimationExample</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">AnimationExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">justify_around</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_around</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;content&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">150.</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">overflow_y_scroll</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Hello Animation&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">svg</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">size_20</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">with_animation</span><span class="punctuation">(</span>
                                        <span class="string">&quot;image_circle&quot;</span><span class="punctuation">,</span>
                                        <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">))</span>
                                            <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                                            <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span><span class="function">bounce</span><span class="punctuation">(</span>ease_in_out<span class="punctuation">)),</span>
                                        |svg<span class="punctuation">,</span> delta| <span class="punctuation">{</span>
                                            svg<span class="punctuation">.</span><span class="property">with_transformation</span><span class="punctuation">(</span><span class="constructor">Transformation</span><span class="punctuation">::</span><span class="function">rotate</span><span class="punctuation">(</span>
                                                <span class="function">percentage</span><span class="punctuation">(</span>delta<span class="punctuation">),</span>
                                            <span class="punctuation">))</span>
                                        <span class="punctuation">},</span>
                                    <span class="punctuation">),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">64.</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_t_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.1</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.05</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Other Panel&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">with_assets</span><span class="punctuation">(</span><span class="type">Assets</span> <span class="punctuation">{})</span>
        <span class="punctuation">.</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
            <span class="keyword">let</span> options = <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)),</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">))),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">};</span>
            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>options<span class="punctuation">,</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">false</span><span class="punctuation">);</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">AnimationExample</span> <span class="punctuation">{})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
