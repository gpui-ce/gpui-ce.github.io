+++
title = "Animation"
description = "Demonstrates animation capabilities including easing functions, transformations (rotate, scale), and repeating animations."
template = "page.html"

[extra]
run_command = "cargo run --example animation"
source_file = "examples/learn/animation.rs"
category = "learn"
+++

## Source Code

<pre><code class="language-rust"><span class="comment">//! Animation Example
//!
//! This example demonstrates animation capabilities in GPUI:
//!
//! 1. Basic animations with `with_animation`
//! 2. Easing functions - ease_in_out, bounce, linear
//! 3. Transformations - rotate, scale, translate
//! 4. Repeating and duration controls
</span>
<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">path = </span><span class="string">&quot;../prelude.rs&quot;</span><span class="punctuation">]</span>
<span class="keyword">mod</span> example_prelude<span class="punctuation">;</span>

<span class="keyword">use</span> std<span class="punctuation">::</span>time<span class="punctuation">::</span><span class="constructor">Duration</span><span class="punctuation">;</span>

<span class="keyword">use</span> anyhow<span class="punctuation">::</span><span class="constructor">Result</span><span class="punctuation">;</span>
<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">Animation</span><span class="punctuation">,</span> <span class="constructor">AnimationExt</span> <span class="keyword">as</span> _<span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">AssetSource</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Colors</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span>
    <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Transformation</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> bounce<span class="punctuation">,</span> div<span class="punctuation">,</span> ease_in_out<span class="punctuation">,</span>
    linear<span class="punctuation">,</span> percentage<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size <span class="keyword">as</span> gpui_size<span class="punctuation">,</span> svg<span class="punctuation">,</span>
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
    <span class="string">&quot;/examples/legacy/image/arrow_circle.svg&quot;</span>
<span class="punctuation">);</span>

<span class="keyword">struct</span> <span class="type">AnimationExample</span><span class="punctuation">;</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">AnimationExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> colors = <span class="constructor">Colors</span><span class="punctuation">::</span><span class="function">for_appearance</span><span class="punctuation">(</span>window<span class="punctuation">);</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;main&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_6</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">background</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">overflow_scroll</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_6</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">max_w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">600.</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">BOLD</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Animation Patterns&quot;</span><span class="punctuation">),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Animations, easing, and transformations in GPUI&quot;</span><span class="punctuation">),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Rotation Animation&quot;</span><span class="punctuation">,</span>
                        <span class="function">rotation_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">,</span> <span class="string">&quot;Bounce Easing&quot;</span><span class="punctuation">,</span> <span class="function">bounce_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">,</span> <span class="string">&quot;Scale Animation&quot;</span><span class="punctuation">,</span> <span class="function">scale_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Combined Animations&quot;</span><span class="punctuation">,</span>
                        <span class="function">combined_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">)),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">rotation_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> accent = colors<span class="punctuation">.</span><span class="property">accent</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Continuous rotation with ease_in_out easing&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">items_center</span><span class="punctuation">().</span><span class="property">justify_center</span><span class="punctuation">().</span><span class="property">h_24</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">svg</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_16</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>accent<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">with_animation</span><span class="punctuation">(</span>
                        <span class="string">&quot;rotation&quot;</span><span class="punctuation">,</span>
                        <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span>ease_in_out<span class="punctuation">),</span>
                        |svg<span class="punctuation">,</span> delta| <span class="punctuation">{</span>
                            svg<span class="punctuation">.</span><span class="property">with_transformation</span><span class="punctuation">(</span><span class="constructor">Transformation</span><span class="punctuation">::</span><span class="function">rotate</span><span class="punctuation">(</span><span class="function">percentage</span><span class="punctuation">(</span>delta<span class="punctuation">)))</span>
                        <span class="punctuation">},</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">bounce_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> success = colors<span class="punctuation">.</span><span class="property">success</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Bouncing rotation with bounce(ease_in_out)&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">items_center</span><span class="punctuation">().</span><span class="property">justify_center</span><span class="punctuation">().</span><span class="property">h_24</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">svg</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_16</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>success<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">with_animation</span><span class="punctuation">(</span>
                        <span class="string">&quot;bounce_rotation&quot;</span><span class="punctuation">,</span>
                        <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span><span class="function">bounce</span><span class="punctuation">(</span>ease_in_out<span class="punctuation">)),</span>
                        |svg<span class="punctuation">,</span> delta| <span class="punctuation">{</span>
                            svg<span class="punctuation">.</span><span class="property">with_transformation</span><span class="punctuation">(</span><span class="constructor">Transformation</span><span class="punctuation">::</span><span class="function">rotate</span><span class="punctuation">(</span><span class="function">percentage</span><span class="punctuation">(</span>delta<span class="punctuation">)))</span>
                        <span class="punctuation">},</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">scale_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> warning = colors<span class="punctuation">.</span><span class="property">warning</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Scale pulsing with linear easing&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">items_center</span><span class="punctuation">().</span><span class="property">justify_center</span><span class="punctuation">().</span><span class="property">h_24</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">svg</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_16</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>warning<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">with_animation</span><span class="punctuation">(</span>
                        <span class="string">&quot;scale&quot;</span><span class="punctuation">,</span>
                        <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_millis</span><span class="punctuation">(</span><span class="constant">1500</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span><span class="function">bounce</span><span class="punctuation">(</span>linear<span class="punctuation">)),</span>
                        |svg<span class="punctuation">,</span> delta| <span class="punctuation">{</span>
                            <span class="keyword">let</span> scale = <span class="constant">0.8</span> + <span class="punctuation">(</span>delta <span class="operator">*</span> <span class="constant">0.4</span><span class="punctuation">);</span>
                            svg<span class="punctuation">.</span><span class="property">with_transformation</span><span class="punctuation">(</span><span class="constructor">Transformation</span><span class="punctuation">::</span><span class="function">scale</span><span class="punctuation">(</span><span class="function">gpui_size</span><span class="punctuation">(</span>scale<span class="punctuation">,</span> scale<span class="punctuation">)))</span>
                        <span class="punctuation">},</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">combined_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> error = colors<span class="punctuation">.</span><span class="property">error</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Rotation + scale combined&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">items_center</span><span class="punctuation">().</span><span class="property">justify_center</span><span class="punctuation">().</span><span class="property">h_24</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">svg</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_16</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="constructor">ARROW_CIRCLE_SVG</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>error<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">with_animation</span><span class="punctuation">(</span>
                        <span class="string">&quot;combined&quot;</span><span class="punctuation">,</span>
                        <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span>ease_in_out<span class="punctuation">),</span>
                        |svg<span class="punctuation">,</span> delta| <span class="punctuation">{</span>
                            <span class="keyword">let</span> scale = <span class="constant">0.7</span> + <span class="punctuation">(</span>delta <span class="operator">*</span> <span class="constant">0.6</span><span class="punctuation">);</span>
                            svg<span class="punctuation">.</span><span class="property">with_transformation</span><span class="punctuation">(</span>
                                <span class="constructor">Transformation</span><span class="punctuation">::</span><span class="function">rotate</span><span class="punctuation">(</span><span class="function">percentage</span><span class="punctuation">(</span>delta<span class="punctuation">))</span>
                                    <span class="punctuation">.</span><span class="property">with_scaling</span><span class="punctuation">(</span><span class="function">gpui_size</span><span class="punctuation">(</span>scale<span class="punctuation">,</span> scale<span class="punctuation">)),</span>
                            <span class="punctuation">)</span>
                        <span class="punctuation">},</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">section</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">,</span> <span class="variable">title</span><span class="punctuation">:</span> <span class="operator">&amp;&#39;</span><span class="label">static</span> <span class="type">str</span><span class="punctuation">,</span> <span class="variable">content</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">IntoElement</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> surface<span class="punctuation">:</span> <span class="type">Hsla</span> = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">rounded_lg</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">SEMIBOLD</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>title<span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>content<span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">with_assets</span><span class="punctuation">(</span><span class="type">Assets</span> <span class="punctuation">{})</span>
        <span class="punctuation">.</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
            <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">gpui_size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">650.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                    <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="constructor">AnimationExample</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">expect</span><span class="punctuation">(</span><span class="string">&quot;Failed to open window&quot;</span><span class="punctuation">);</span>

            example_prelude<span class="punctuation">::</span><span class="function">init_example</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> <span class="string">&quot;Animation&quot;</span><span class="punctuation">);</span>
        <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
