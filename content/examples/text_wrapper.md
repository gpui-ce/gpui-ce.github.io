+++
title = "Text Wrapper"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example text_wrapper"
source_file = "crates/gpui/examples/text_wrapper.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">TextOverflow</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span>
    prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> text = <span class="string">&quot;The longest word 你好世界这段是中文，こんにちはこの段落は日本語です in any of the major \
            English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that \
            refers to a lung disease contracted from the inhalation of very fine silica particles, \
            a url https://github.com/zed-industries/zed/pull/35724?query=foo&amp;bar=2, \
            specifically from a volcano; medically, it is the same as silicosis.&quot;</span><span class="punctuation">;</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;page&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;longer text in flex 1&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;short flex&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;A short text in normal div&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">truncate</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;ELLIPSIS: &quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span> + text<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_ellipsis</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">line_clamp</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;ELLIPSIS 2 lines: &quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span> + text<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_overflow</span><span class="punctuation">(</span><span class="constructor">TextOverflow</span><span class="punctuation">::</span><span class="constructor">Truncate</span><span class="punctuation">(</span><span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()))</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;TRUNCATE: &quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span> + text<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_overflow</span><span class="punctuation">(</span><span class="constructor">TextOverflow</span><span class="punctuation">::</span><span class="constructor">Truncate</span><span class="punctuation">(</span><span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()))</span>
                    <span class="punctuation">.</span><span class="property">line_clamp</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;TRUNCATE 3 lines: &quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span> + text<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;NOWRAP: &quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span> + text<span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_xl</span><span class="punctuation">().</span><span class="property">w_full</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>text<span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">800.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">HelloWorld</span> <span class="punctuation">{}),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
