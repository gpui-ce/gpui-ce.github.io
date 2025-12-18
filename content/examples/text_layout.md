+++
title = "Text Layout"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example text_layout"
source_file = "crates/gpui/examples/text_layout.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">FontStyle</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">,</span> <span class="constructor">StyledText</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span>
    <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text left&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_center</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text center&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_right</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text right&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_decoration_1</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text left (underline)&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_decoration_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text center (underline)&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_right</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_decoration_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text right (underline)&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">line_through</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text left (line_through)&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">line_through</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text center (line_through)&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_right</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">line_through</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Text right (line_through)&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_between</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">400.</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">p_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;A long non-wrapping text align center&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_32</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">p_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">text_right</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;100%&quot;</span><span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">gap_2</span><span class="punctuation">().</span><span class="property">justify_between</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="constructor">StyledText</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;ABCD&quot;</span><span class="punctuation">).</span><span class="property">with_highlights</span><span class="punctuation">([</span>
                    <span class="punctuation">(</span><span class="constant">0</span>..<span class="constant">1</span><span class="punctuation">,</span> <span class="constructor">FontWeight</span><span class="punctuation">::</span><span class="constructor">EXTRA_BOLD</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                    <span class="punctuation">(</span><span class="constant">2</span>..<span class="constant">3</span><span class="punctuation">,</span> <span class="constructor">FontStyle</span><span class="punctuation">::</span><span class="constructor">Italic</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                <span class="punctuation">]),</span>
            <span class="punctuation">))</span>
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
