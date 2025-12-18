+++
title = "Gradient"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example gradient"
source_file = "crates/gpui/examples/gradient.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">ColorSpace</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Half</span><span class="punctuation">,</span> <span class="constructor">Render</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> canvas<span class="punctuation">,</span>
    div<span class="punctuation">,</span> linear_color_stop<span class="punctuation">,</span> linear_gradient<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">GradientViewer</span> <span class="punctuation">{</span>
    <span class="property">color_space</span><span class="punctuation">:</span> <span class="type">ColorSpace</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">GradientViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">color_space</span><span class="punctuation">:</span> <span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">(),</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">GradientViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> color_space = <span class="variable">self</span><span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">;</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_between</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Gradient Examples&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">gap_2</span><span class="punctuation">().</span><span class="property">items_center</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;method&quot;</span><span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">px_3</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">py_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> color_space<span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">active</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.8</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="keyword">move</span> |this<span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                    this<span class="punctuation">.</span><span class="property">color_space</span> = <span class="keyword">match</span> this<span class="punctuation">.</span><span class="property">color_space</span> <span class="punctuation">{</span>
                                        <span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="constructor">Oklab</span> =&gt; <span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="constructor">Srgb</span><span class="punctuation">,</span>
                                        <span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="constructor">Srgb</span> =&gt; <span class="constructor">ColorSpace</span><span class="punctuation">::</span><span class="constructor">Oklab</span><span class="punctuation">,</span>
                                    <span class="punctuation">};</span>
                                    cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
                                <span class="punctuation">})),</span>
                        <span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_xl</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Solid Color&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">rounded_xl</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Solid Color&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">h_24</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">45.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">135.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">225.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">315.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">h_24</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">0.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">90.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">180.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">360.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                    <span class="constant">0.</span><span class="punctuation">,</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">0.05</span><span class="punctuation">),</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">(),</span> <span class="constant">0.95</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                    <span class="constant">90.</span><span class="punctuation">,</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">0.05</span><span class="punctuation">),</span>
                    <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.95</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">gap_3</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                                <span class="constant">90.</span><span class="punctuation">,</span>
                                <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">0.5</span><span class="punctuation">),</span>
                                <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.5</span><span class="punctuation">),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                        <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">().</span><span class="property">rounded_xl</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">180.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">0.5</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">)),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">h_24</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="function">canvas</span><span class="punctuation">(</span>
                <span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{},</span>
                <span class="keyword">move</span> |bounds<span class="punctuation">,</span> _<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                    <span class="keyword">let</span> size = <span class="function">size</span><span class="punctuation">(</span>bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span> <span class="operator">*</span> <span class="constant">0.8</span><span class="punctuation">,</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">80.</span><span class="punctuation">));</span>
                    <span class="keyword">let</span> square_bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                        <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>
                            bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span><span class="punctuation">.</span><span class="property">half</span><span class="punctuation">()</span> - size<span class="punctuation">.</span><span class="property">width</span><span class="punctuation">.</span><span class="property">half</span><span class="punctuation">(),</span>
                            bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">y</span><span class="punctuation">,</span>
                        <span class="punctuation">),</span>
                        size<span class="punctuation">,</span>
                    <span class="punctuation">};</span>
                    <span class="keyword">let</span> height = square_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span><span class="punctuation">;</span>
                    <span class="keyword">let</span> horizontal_offset = height<span class="punctuation">;</span>
                    <span class="keyword">let</span> vertical_offset = <span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span><span class="punctuation">);</span>
                    <span class="keyword">let</span> <span class="keyword">mut</span> builder = gpui<span class="punctuation">::</span><span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
                    builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">bottom_left</span><span class="punctuation">());</span>
                    builder
                        <span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">origin</span> + <span class="function">point</span><span class="punctuation">(</span>horizontal_offset<span class="punctuation">,</span> vertical_offset<span class="punctuation">));</span>
                    builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>
                        square_bounds<span class="punctuation">.</span><span class="property">top_right</span><span class="punctuation">()</span> + <span class="function">point</span><span class="punctuation">(</span>-horizontal_offset<span class="punctuation">,</span> vertical_offset<span class="punctuation">),</span>
                    <span class="punctuation">);</span>

                    builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">bottom_right</span><span class="punctuation">());</span>
                    builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">bottom_left</span><span class="punctuation">());</span>
                    <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
                    window<span class="punctuation">.</span><span class="property">paint_path</span><span class="punctuation">(</span>
                        path<span class="punctuation">,</span>
                        <span class="function">linear_gradient</span><span class="punctuation">(</span>
                            <span class="constant">180.</span><span class="punctuation">,</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">0.</span><span class="punctuation">),</span>
                            <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">color_space</span><span class="punctuation">(</span>color_space<span class="punctuation">),</span>
                    <span class="punctuation">);</span>
                <span class="punctuation">},</span>
            <span class="punctuation">)))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="constructor">GradientViewer</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
