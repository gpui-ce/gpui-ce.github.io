+++
title = "Window Positioning"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example window_positioning"
source_file = "crates/gpui/examples/window_positioning.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">DisplayId</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Size</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span>
    <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowKind</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span>
    px<span class="punctuation">,</span> rgb<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">WindowContent</span> <span class="punctuation">{</span>
    <span class="property">text</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">bounds</span><span class="punctuation">:</span> <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
    <span class="property">bg</span><span class="punctuation">:</span> <span class="type">Hsla</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">WindowContent</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> window_bounds = window<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">();</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">text</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span>
                        <span class="string">&quot;origin: {}, {} size: {}, {}&quot;</span><span class="punctuation">,</span>
                        <span class="variable">self</span><span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">x</span><span class="punctuation">,</span>
                        <span class="variable">self</span><span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">y</span><span class="punctuation">,</span>
                        <span class="variable">self</span><span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span><span class="punctuation">,</span>
                        <span class="variable">self</span><span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span>
                    <span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span>
                        <span class="string">&quot;cx.bounds() origin: {}, {} size {}, {}&quot;</span><span class="punctuation">,</span>
                        window_bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">x</span><span class="punctuation">,</span>
                        window_bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">y</span><span class="punctuation">,</span>
                        window_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span><span class="punctuation">,</span>
                        window_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span>
                    <span class="punctuation">)),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">build_window_options</span><span class="punctuation">(</span><span class="variable">display_id</span><span class="punctuation">:</span> <span class="type">DisplayId</span><span class="punctuation">,</span> <span class="variable">bounds</span><span class="punctuation">:</span> <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">WindowOptions</span> <span class="punctuation">{</span>
    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
        <span class="comment">// Set the bounds of the window in screen coordinates</span>
        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
        <span class="comment">// Specify the display_id to ensure the window is created on the correct screen</span>
        <span class="property">display_id</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>display_id<span class="punctuation">),</span>
        <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="property">window_background</span><span class="punctuation">:</span> <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">::</span><span class="constructor">Transparent</span><span class="punctuation">,</span>
        <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="property">show</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
        <span class="property">kind</span><span class="punctuation">:</span> <span class="constructor">WindowKind</span><span class="punctuation">::</span><span class="constructor">PopUp</span><span class="punctuation">,</span>
        <span class="property">is_movable</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="property">app_id</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="property">window_min_size</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="property">window_decorations</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="property">tabbing_identifier</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="comment">// Create several new windows, positioned in the top right corner of each screen</span>
        <span class="keyword">let</span> size = <span class="type">Size</span> <span class="punctuation">{</span>
            <span class="property">width</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span>
            <span class="property">height</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">75.</span><span class="punctuation">),</span>
        <span class="punctuation">};</span>
        <span class="keyword">let</span> margin_offset = <span class="function">px</span><span class="punctuation">(</span><span class="constant">150.</span><span class="punctuation">);</span>

        <span class="keyword">for</span> screen <span class="keyword">in</span> cx<span class="punctuation">.</span><span class="property">displays</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>margin_offset<span class="punctuation">,</span> margin_offset<span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Top Left {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">top_right</span><span class="punctuation">()</span>
                    - <span class="function">point</span><span class="punctuation">(</span>size<span class="punctuation">.</span><span class="property">width</span> + margin_offset<span class="punctuation">,</span> -margin_offset<span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Top Right {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">bottom_left</span><span class="punctuation">()</span>
                    - <span class="function">point</span><span class="punctuation">(</span>-margin_offset<span class="punctuation">,</span> size<span class="punctuation">.</span><span class="property">height</span> + margin_offset<span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Bottom Left {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">bottom_right</span><span class="punctuation">()</span>
                    - <span class="function">point</span><span class="punctuation">(</span>size<span class="punctuation">.</span><span class="property">width</span> + margin_offset<span class="punctuation">,</span> size<span class="punctuation">.</span><span class="property">height</span> + margin_offset<span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Bottom Right {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span><span class="punctuation">,</span> margin_offset<span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Top Center {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>margin_offset<span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span><span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Left Center {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span><span class="punctuation">,</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span><span class="punctuation">,</span>
                <span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Center {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span> - size<span class="punctuation">.</span><span class="property">width</span> - margin_offset<span class="punctuation">,</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">y</span><span class="punctuation">,</span>
                <span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Right Center {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

            <span class="keyword">let</span> bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
                <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span> - size<span class="punctuation">.</span><span class="property">center</span><span class="punctuation">().</span><span class="property">x</span><span class="punctuation">,</span>
                    screen<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span> - size<span class="punctuation">.</span><span class="property">height</span> - margin_offset<span class="punctuation">,</span>
                <span class="punctuation">),</span>
                size<span class="punctuation">,</span>
            <span class="punctuation">};</span>

            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="function">build_window_options</span><span class="punctuation">(</span>screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(),</span> bounds<span class="punctuation">),</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">WindowContent</span> <span class="punctuation">{</span>
                    <span class="property">text</span><span class="punctuation">:</span> <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Bottom Center {:?}&quot;</span><span class="punctuation">,</span> screen<span class="punctuation">.</span><span class="property">id</span><span class="punctuation">()).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
                    bounds<span class="punctuation">,</span>
                <span class="punctuation">})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
