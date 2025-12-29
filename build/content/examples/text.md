+++
title = "Text"
description = "This example demonstrates text capabilities in GPUI: text styling, text alignment, text decoration, text overflow, styled text, and more."
template = "page.html"

[extra]
run_command = "cargo run --example text"
source_file = "examples/learn/text.rs"
category = "learn"
+++

## Source Code

<pre><code class="language-rust"><span class="comment">//! Text Example
//!
//! This example demonstrates text capabilities in GPUI:
//!
//! 1. Text Styling - Font sizes, weights, and colors
//! 2. Text Alignment - Left, center, right alignment
//! 3. Text Decoration - Underline, strikethrough
//! 4. Text Overflow - Ellipsis, truncation, line clamping
//! 5. Styled Text - Inline style variations with highlights
//! 6. Character Grid - Unicode and emoji support
</span>
<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">path = </span><span class="string">&quot;../prelude.rs&quot;</span><span class="punctuation">]</span>
<span class="keyword">mod</span> example_prelude<span class="punctuation">;</span>

<span class="keyword">use</span> example_prelude<span class="punctuation">::</span>init_example<span class="punctuation">;</span>
<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Colors</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">FontStyle</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">Render</span><span class="punctuation">,</span> <span class="constructor">StyledText</span><span class="punctuation">,</span>
    <span class="constructor">TextOverflow</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> relative<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="comment">// Text Styling Examples</span>

<span class="keyword">fn</span> <span class="function">text_sizes_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Font sizes: text_xs, text_sm, text_base, text_lg, text_xl&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">items_baseline</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_xs</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Extra Small&quot;</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_sm</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Small&quot;</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_base</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Base&quot;</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_lg</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Large&quot;</span><span class="punctuation">))</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_xl</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Extra Large&quot;</span><span class="punctuation">)),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">text_weights_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Font weights: THIN through BLACK&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">THIN</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Thin&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">LIGHT</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Light&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">NORMAL</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Normal&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">MEDIUM</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Medium&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">SEMIBOLD</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Semibold&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">BOLD</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Bold&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">BLACK</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Black&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Text Alignment Examples</span>

<span class="keyword">fn</span> <span class="function">text_alignment_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> surface = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Alignment: default (left), text_center, text_right&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Left aligned (default)&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Center aligned&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_right</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Right aligned&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Text Decoration Examples</span>

<span class="keyword">fn</span> <span class="function">text_decoration_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> accent = colors<span class="punctuation">.</span><span class="property">accent</span><span class="punctuation">;</span>
    <span class="keyword">let</span> error = colors<span class="punctuation">.</span><span class="property">error</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Decorations: underline, strikethrough, italic&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_decoration_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_decoration_color</span><span class="punctuation">(</span>accent<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Underlined text&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">line_through</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_decoration_color</span><span class="punctuation">(</span>error<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Strikethrough text&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">italic</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Italic text&quot;</span><span class="punctuation">)),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Text Overflow Examples</span>

<span class="keyword">fn</span> <span class="function">text_overflow_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> surface = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">;</span>
    <span class="keyword">let</span> border = colors<span class="punctuation">.</span><span class="property">border</span><span class="punctuation">;</span>

    <span class="keyword">let</span> long_text = <span class="string">&quot;The quick brown fox jumps over the lazy dog. This is a long sentence that will overflow its container.&quot;</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Overflow handling: ellipsis, truncate, line_clamp&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;text_ellipsis (single line):&quot;</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>border<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>long_text<span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;line_clamp(2):&quot;</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>border<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">line_clamp</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>long_text<span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;truncate (hard cut):&quot;</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>border<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_overflow</span><span class="punctuation">(</span><span class="constructor">TextOverflow</span><span class="punctuation">::</span><span class="constructor">Truncate</span><span class="punctuation">(</span><span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()))</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>long_text<span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;whitespace_nowrap:&quot;</span><span class="punctuation">),</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>border<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>long_text<span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Styled Text Examples</span>

<span class="keyword">fn</span> <span class="function">styled_text_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;StyledText with inline highlights&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_lg</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="constructor">StyledText</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;Bold Italic Normal Semibold&quot;</span><span class="punctuation">).</span><span class="property">with_highlights</span><span class="punctuation">([</span>
                <span class="punctuation">(</span><span class="constant">0</span>..<span class="constant">4</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">BOLD</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                <span class="punctuation">(</span><span class="constant">5</span>..<span class="constant">11</span><span class="punctuation">,</span> <span class="constructor">FontStyle</span><span class="punctuation">::</span><span class="constructor">Italic</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                <span class="punctuation">(</span><span class="constant">19</span>..<span class="constant">27</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">SEMIBOLD</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
            <span class="punctuation">]),</span>
        <span class="punctuation">))</span>
<span class="punctuation">}</span>

<span class="comment">// Character Grid Example</span>

<span class="keyword">fn</span> <span class="function">character_grid_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> surface = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">;</span>
    <span class="keyword">let</span> border = colors<span class="punctuation">.</span><span class="property">border</span><span class="punctuation">;</span>

    <span class="keyword">let</span> characters = <span class="punctuation">[</span>
        <span class="comment">// Latin</span>
        <span class="string">&quot;A&quot;</span><span class="punctuation">,</span> <span class="string">&quot;B&quot;</span><span class="punctuation">,</span> <span class="string">&quot;C&quot;</span><span class="punctuation">,</span> <span class="string">&quot;D&quot;</span><span class="punctuation">,</span> <span class="string">&quot;E&quot;</span><span class="punctuation">,</span> <span class="string">&quot;a&quot;</span><span class="punctuation">,</span> <span class="string">&quot;b&quot;</span><span class="punctuation">,</span> <span class="string">&quot;c&quot;</span><span class="punctuation">,</span> <span class="string">&quot;d&quot;</span><span class="punctuation">,</span> <span class="string">&quot;e&quot;</span><span class="punctuation">,</span> <span class="comment">// Numbers</span>
        <span class="string">&quot;0&quot;</span><span class="punctuation">,</span> <span class="string">&quot;1&quot;</span><span class="punctuation">,</span> <span class="string">&quot;2&quot;</span><span class="punctuation">,</span> <span class="string">&quot;3&quot;</span><span class="punctuation">,</span> <span class="string">&quot;4&quot;</span><span class="punctuation">,</span> <span class="string">&quot;5&quot;</span><span class="punctuation">,</span> <span class="string">&quot;6&quot;</span><span class="punctuation">,</span> <span class="string">&quot;7&quot;</span><span class="punctuation">,</span> <span class="string">&quot;8&quot;</span><span class="punctuation">,</span> <span class="string">&quot;9&quot;</span><span class="punctuation">,</span> <span class="comment">// Greek</span>
        <span class="string">&quot;α&quot;</span><span class="punctuation">,</span> <span class="string">&quot;β&quot;</span><span class="punctuation">,</span> <span class="string">&quot;γ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;δ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ε&quot;</span><span class="punctuation">,</span> <span class="string">&quot;θ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;λ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;π&quot;</span><span class="punctuation">,</span> <span class="string">&quot;σ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ω&quot;</span><span class="punctuation">,</span> <span class="comment">// Cyrillic</span>
        <span class="string">&quot;Д&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ж&quot;</span><span class="punctuation">,</span> <span class="string">&quot;И&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Л&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ф&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ц&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ш&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Щ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ы&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Я&quot;</span><span class="punctuation">,</span> <span class="comment">// CJK</span>
        <span class="string">&quot;你&quot;</span><span class="punctuation">,</span> <span class="string">&quot;好&quot;</span><span class="punctuation">,</span> <span class="string">&quot;世&quot;</span><span class="punctuation">,</span> <span class="string">&quot;界&quot;</span><span class="punctuation">,</span> <span class="string">&quot;日&quot;</span><span class="punctuation">,</span> <span class="string">&quot;本&quot;</span><span class="punctuation">,</span> <span class="string">&quot;語&quot;</span><span class="punctuation">,</span> <span class="string">&quot;中&quot;</span><span class="punctuation">,</span> <span class="string">&quot;文&quot;</span><span class="punctuation">,</span> <span class="string">&quot;字&quot;</span><span class="punctuation">,</span> <span class="comment">// Symbols</span>
        <span class="string">&quot;→&quot;</span><span class="punctuation">,</span> <span class="string">&quot;←&quot;</span><span class="punctuation">,</span> <span class="string">&quot;↑&quot;</span><span class="punctuation">,</span> <span class="string">&quot;↓&quot;</span><span class="punctuation">,</span> <span class="string">&quot;•&quot;</span><span class="punctuation">,</span> <span class="string">&quot;★&quot;</span><span class="punctuation">,</span> <span class="string">&quot;♠&quot;</span><span class="punctuation">,</span> <span class="string">&quot;♥&quot;</span><span class="punctuation">,</span> <span class="string">&quot;♦&quot;</span><span class="punctuation">,</span> <span class="string">&quot;♣&quot;</span><span class="punctuation">,</span> <span class="comment">// Emoji</span>
        <span class="string">&quot;😀&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎉&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🚀&quot;</span><span class="punctuation">,</span> <span class="string">&quot;💡&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🔥&quot;</span><span class="punctuation">,</span> <span class="string">&quot;✨&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎨&quot;</span><span class="punctuation">,</span> <span class="string">&quot;📚&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎵&quot;</span><span class="punctuation">,</span> <span class="string">&quot;❤️&quot;</span><span class="punctuation">,</span>
    <span class="punctuation">];</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Unicode and emoji support&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>border<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">rounded_md</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">grid</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">grid_cols</span><span class="punctuation">(</span><span class="constant">10</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>characters<span class="punctuation">.</span><span class="property">iter</span><span class="punctuation">().</span><span class="property">map</span><span class="punctuation">(</span>|c| <span class="punctuation">{</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_lg</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="operator">*</span>c<span class="punctuation">)</span>
                        <span class="punctuation">})),</span>
                <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Line Height Example</span>

<span class="keyword">fn</span> <span class="function">line_height_example</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> text = colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">;</span>
    <span class="keyword">let</span> text_muted = colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">;</span>
    <span class="keyword">let</span> surface = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">;</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text_muted<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Line height: relative(1.0), relative(1.5), relative(2.0)&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Tight\nline\nheight&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span><span class="constant">1.5</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Normal\nline\nheight&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>text<span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span><span class="constant">2.0</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Loose\nline\nheight&quot;</span><span class="punctuation">),</span>
                <span class="punctuation">),</span>
        <span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="comment">// Main Application View</span>

<span class="keyword">struct</span> <span class="type">TextExample</span><span class="punctuation">;</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">TextExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> colors = <span class="constructor">Colors</span><span class="punctuation">::</span><span class="function">for_appearance</span><span class="punctuation">(</span>window<span class="punctuation">);</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;main&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">background</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">overflow_scroll</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">max_w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">600.</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">BOLD</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text &amp; Typography&quot;</span><span class="punctuation">),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">().</span><span class="property">text_sm</span><span class="punctuation">().</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text_muted</span><span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span>
                                    <span class="string">&quot;Font styling, alignment, overflow, and unicode support&quot;</span><span class="punctuation">,</span>
                                <span class="punctuation">),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">,</span> <span class="string">&quot;Font Sizes&quot;</span><span class="punctuation">,</span> <span class="function">text_sizes_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Font Weights&quot;</span><span class="punctuation">,</span>
                        <span class="function">text_weights_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Text Alignment&quot;</span><span class="punctuation">,</span>
                        <span class="function">text_alignment_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Text Decoration&quot;</span><span class="punctuation">,</span>
                        <span class="function">text_decoration_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Line Height&quot;</span><span class="punctuation">,</span>
                        <span class="function">line_height_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Styled Text&quot;</span><span class="punctuation">,</span>
                        <span class="function">styled_text_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Text Overflow&quot;</span><span class="punctuation">,</span>
                        <span class="function">text_overflow_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">section</span><span class="punctuation">(</span>
                        <span class="operator">&amp;</span>colors<span class="punctuation">,</span>
                        <span class="string">&quot;Character Grid&quot;</span><span class="punctuation">,</span>
                        <span class="function">character_grid_example</span><span class="punctuation">(</span><span class="operator">&amp;</span>colors<span class="punctuation">),</span>
                    <span class="punctuation">)),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">section</span><span class="punctuation">(</span><span class="variable">colors</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Colors</span><span class="punctuation">,</span> <span class="variable">title</span><span class="punctuation">:</span> <span class="operator">&amp;&#39;</span><span class="label">static</span> <span class="type">str</span><span class="punctuation">,</span> <span class="variable">content</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">IntoElement</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> surface<span class="punctuation">:</span> <span class="type">Hsla</span> = colors<span class="punctuation">.</span><span class="property">surface</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>

    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">p_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>surface<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">rounded_lg</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">font_weight</span><span class="punctuation">(</span><span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">SEMIBOLD</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>title<span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>content<span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">650.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">900.</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="constructor">TextExample</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">expect</span><span class="punctuation">(</span><span class="string">&quot;Failed to open window&quot;</span><span class="punctuation">);</span>

        <span class="function">init_example</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> <span class="string">&quot;Text&quot;</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
