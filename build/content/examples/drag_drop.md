+++
title = "Drag Drop"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example drag_drop"
source_file = "crates/gpui/examples/drag_drop.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Half</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Point</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span>
    <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Copy</span><span class="punctuation">)]</span>
<span class="keyword">struct</span> <span class="type">DragInfo</span> <span class="punctuation">{</span>
    <span class="property">ix</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
    <span class="property">color</span><span class="punctuation">:</span> <span class="type">Hsla</span><span class="punctuation">,</span>
    <span class="property">position</span><span class="punctuation">:</span> <span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">DragInfo</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">ix</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span> <span class="variable">color</span><span class="punctuation">:</span> <span class="type">Hsla</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            ix<span class="punctuation">,</span>
            color<span class="punctuation">,</span>
            <span class="property">position</span><span class="punctuation">:</span> <span class="constructor">Point</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">(),</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">position</span><span class="punctuation">(</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">pos</span><span class="punctuation">:</span> <span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">position</span> = pos<span class="punctuation">;</span>
        <span class="variable">self</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">DragInfo</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="operator">&#39;</span><span class="label">_</span><span class="punctuation">,</span> <span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> size = gpui<span class="punctuation">::</span><span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">120.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">));</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">pl</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">position</span><span class="punctuation">.</span><span class="property">x</span> - size<span class="punctuation">.</span><span class="property">width</span><span class="punctuation">.</span><span class="property">half</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">pt</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">position</span><span class="punctuation">.</span><span class="property">y</span> - size<span class="punctuation">.</span><span class="property">height</span><span class="punctuation">.</span><span class="property">half</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span>size<span class="punctuation">.</span><span class="property">width</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span>size<span class="punctuation">.</span><span class="property">height</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">color</span><span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">shadow_md</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Item {}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">ix</span><span class="punctuation">)),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">DragDrop</span> <span class="punctuation">{</span>
    <span class="property">drop_on</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">DragInfo</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">DragDrop</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span> <span class="property">drop_on</span><span class="punctuation">:</span> <span class="constructor">None</span> <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">DragDrop</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> items = <span class="punctuation">[</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">()];</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_5</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x333333</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">text_xl</span><span class="punctuation">().</span><span class="property">text_center</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Drop &amp; Drop&quot;</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">mb_10</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_4</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>items<span class="punctuation">.</span><span class="property">into_iter</span><span class="punctuation">().</span><span class="property">enumerate</span><span class="punctuation">().</span><span class="property">map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>ix<span class="punctuation">,</span> color<span class="punctuation">)</span>| <span class="punctuation">{</span>
                        <span class="keyword">let</span> drag_info = <span class="constructor">DragInfo</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>ix<span class="punctuation">,</span> color<span class="punctuation">);</span>

                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">((</span><span class="string">&quot;item&quot;</span><span class="punctuation">,</span> ix<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">size_32</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">cursor_move</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>color<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.2</span><span class="punctuation">)))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Item ({})&quot;</span><span class="punctuation">,</span> ix<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">on_drag</span><span class="punctuation">(</span>drag_info<span class="punctuation">,</span> |<span class="variable">info</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">DragInfo</span><span class="punctuation">,</span> position<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| info<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">(</span>position<span class="punctuation">))</span>
                            <span class="punctuation">})</span>
                    <span class="punctuation">})),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;drop-target&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">w_128</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">h_32</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">drop_on</span><span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|info| info<span class="punctuation">.</span><span class="property">color</span><span class="punctuation">).</span><span class="property">unwrap_or</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">()))</span>
                    <span class="punctuation">.</span><span class="property">when_some</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">drop_on</span><span class="punctuation">,</span> |this<span class="punctuation">,</span> info| this<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>info<span class="punctuation">.</span><span class="property">color</span><span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">on_drop</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> <span class="variable">info</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">DragInfo</span><span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                        this<span class="punctuation">.</span><span class="property">drop_on</span> = <span class="constructor">Some</span><span class="punctuation">(</span><span class="operator">*</span>info<span class="punctuation">);</span>
                    <span class="punctuation">}))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Drop items here&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">800.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="constructor">DragDrop</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
