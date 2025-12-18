+++
title = "Painting"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example painting"
source_file = "crates/gpui/examples/painting.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Background</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">ColorSpace</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">MouseDownEvent</span><span class="punctuation">,</span> <span class="constructor">Path</span><span class="punctuation">,</span> <span class="constructor">PathBuilder</span><span class="punctuation">,</span>
    <span class="constructor">PathStyle</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Point</span><span class="punctuation">,</span> <span class="constructor">Render</span><span class="punctuation">,</span> <span class="constructor">StrokeOptions</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> canvas<span class="punctuation">,</span> div<span class="punctuation">,</span>
    linear_color_stop<span class="punctuation">,</span> linear_gradient<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> quad<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="property">default_lines</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;(</span><span class="type">Path</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span> <span class="type">Background</span><span class="punctuation">)&gt;,</span>
    <span class="property">background_quads</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;(</span><span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span> <span class="type">Background</span><span class="punctuation">)&gt;,</span>
    <span class="property">lines</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;&gt;&gt;,</span>
    <span class="property">start</span><span class="punctuation">:</span> <span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
    <span class="property">dashed</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
    <span class="property">_painting</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> lines = <span class="macro">vec!</span><span class="punctuation">[];</span>

        <span class="comment">// Black squares beneath transparent paths.</span>
        <span class="keyword">let</span> background_quads = <span class="macro">vec!</span><span class="punctuation">[</span>
            <span class="punctuation">(</span>
                <span class="type">Bounds</span> <span class="punctuation">{</span>
                    <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">70.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">70.</span><span class="punctuation">)),</span>
                    <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">)),</span>
                <span class="punctuation">},</span>
                gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="type">Bounds</span> <span class="punctuation">{</span>
                    <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">170.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">70.</span><span class="punctuation">)),</span>
                    <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">)),</span>
                <span class="punctuation">},</span>
                gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="type">Bounds</span> <span class="punctuation">{</span>
                    <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">270.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">70.</span><span class="punctuation">)),</span>
                    <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">)),</span>
                <span class="punctuation">},</span>
                gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="type">Bounds</span> <span class="punctuation">{</span>
                    <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">370.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">70.</span><span class="punctuation">)),</span>
                    <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">)),</span>
                <span class="punctuation">},</span>
                gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="type">Bounds</span> <span class="punctuation">{</span>
                    <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">450.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)),</span>
                    <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">80.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">80.</span><span class="punctuation">)),</span>
                <span class="punctuation">},</span>
                gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">];</span>

        <span class="comment">// 50% opaque red path that extends across black quad.</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> red = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFF0000</span><span class="punctuation">);</span>
        red<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> red<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// 50% opaque blue path that extends across black quad.</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">150.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">230.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">230.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">150.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> blue = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x0000FF</span><span class="punctuation">);</span>
        blue<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> blue<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// 50% opaque green path that extends across black quad.</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">250.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">330.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">330.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">250.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> green = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x00FF00</span><span class="punctuation">);</span>
        green<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> green<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// 50% opaque black path that extends across black quad.</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">430.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">50.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">430.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">130.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> black = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x000000</span><span class="punctuation">);</span>
        black<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> black<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// Two 50% opaque red circles overlapping - center should be darker red</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        <span class="keyword">let</span> center = <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">530.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">85.</span><span class="punctuation">));</span>
        <span class="keyword">let</span> radius = <span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span><span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> + radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">));</span>
        builder<span class="punctuation">.</span><span class="property">arc_to</span><span class="punctuation">(</span>
            <span class="function">point</span><span class="punctuation">(</span>radius<span class="punctuation">,</span> radius<span class="punctuation">),</span>
            <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> - radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">arc_to</span><span class="punctuation">(</span>
            <span class="function">point</span><span class="punctuation">(</span>radius<span class="punctuation">,</span> radius<span class="punctuation">),</span>
            <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> + radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> red1 = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFF0000</span><span class="punctuation">);</span>
        red1<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> red1<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        <span class="keyword">let</span> center = <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">570.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">85.</span><span class="punctuation">));</span>
        <span class="keyword">let</span> radius = <span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span><span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> + radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">));</span>
        builder<span class="punctuation">.</span><span class="property">arc_to</span><span class="punctuation">(</span>
            <span class="function">point</span><span class="punctuation">(</span>radius<span class="punctuation">,</span> radius<span class="punctuation">),</span>
            <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> - radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">arc_to</span><span class="punctuation">(</span>
            <span class="function">point</span><span class="punctuation">(</span>radius<span class="punctuation">,</span> radius<span class="punctuation">),</span>
            <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="constant">false</span><span class="punctuation">,</span>
            <span class="function">point</span><span class="punctuation">(</span>center<span class="punctuation">.</span><span class="property">x</span> + radius<span class="punctuation">,</span> center<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> red2 = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFF0000</span><span class="punctuation">);</span>
        red2<span class="punctuation">.</span><span class="property">a</span> = <span class="constant">0.5</span><span class="punctuation">;</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> red2<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// draw a Rust logo</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = lyon<span class="punctuation">::</span>path<span class="punctuation">::</span><span class="constructor">Path</span><span class="punctuation">::</span><span class="function">svg_builder</span><span class="punctuation">();</span>
        lyon<span class="punctuation">::</span>extra<span class="punctuation">::</span>rust_logo<span class="punctuation">::</span><span class="function">build_logo_path</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> builder<span class="punctuation">);</span>
        <span class="comment">// move down the Path</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder<span class="punctuation">:</span> <span class="type">PathBuilder</span> = builder<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">translate</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">10.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">scale</span><span class="punctuation">(</span><span class="constant">0.9</span><span class="punctuation">);</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// draw a lightening bolt ⚡</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">add_polygon</span><span class="punctuation">(</span>
            <span class="operator">&amp;</span><span class="punctuation">[</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">150.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">225.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">275.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">250.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)),</span>
            <span class="punctuation">],</span>
            <span class="constant">false</span><span class="punctuation">,</span>
        <span class="punctuation">);</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1d4ed8</span><span class="punctuation">).</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="comment">// draw a ⭐</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">370.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">430.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">380.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">400.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">360.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">320.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">360.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">320.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">270.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">330.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">260.</span><span class="punctuation">)));</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">350.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)));</span>
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

        <span class="comment">// draw linear gradient</span>
        <span class="keyword">let</span> square_bounds = <span class="type">Bounds</span> <span class="punctuation">{</span>
            <span class="property">origin</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">450.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">)),</span>
            <span class="property">size</span><span class="punctuation">:</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">200.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">80.</span><span class="punctuation">)),</span>
        <span class="punctuation">};</span>
        <span class="keyword">let</span> height = square_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span><span class="punctuation">;</span>
        <span class="keyword">let</span> horizontal_offset = height<span class="punctuation">;</span>
        <span class="keyword">let</span> vertical_offset = <span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span><span class="punctuation">);</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">bottom_left</span><span class="punctuation">());</span>
        builder<span class="punctuation">.</span><span class="property">curve_to</span><span class="punctuation">(</span>
            square_bounds<span class="punctuation">.</span><span class="property">origin</span> + <span class="function">point</span><span class="punctuation">(</span>horizontal_offset<span class="punctuation">,</span> vertical_offset<span class="punctuation">),</span>
            square_bounds<span class="punctuation">.</span><span class="property">origin</span> + <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> vertical_offset<span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">top_right</span><span class="punctuation">()</span> + <span class="function">point</span><span class="punctuation">(</span>-horizontal_offset<span class="punctuation">,</span> vertical_offset<span class="punctuation">));</span>
        builder<span class="punctuation">.</span><span class="property">curve_to</span><span class="punctuation">(</span>
            square_bounds<span class="punctuation">.</span><span class="property">bottom_right</span><span class="punctuation">(),</span>
            square_bounds<span class="punctuation">.</span><span class="property">top_right</span><span class="punctuation">()</span> + <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> vertical_offset<span class="punctuation">),</span>
        <span class="punctuation">);</span>
        builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>square_bounds<span class="punctuation">.</span><span class="property">bottom_left</span><span class="punctuation">());</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>
            path<span class="punctuation">,</span>
            <span class="function">linear_gradient</span><span class="punctuation">(</span>
                <span class="constant">180.</span><span class="punctuation">,</span>
                <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span> <span class="constant">0.4</span><span class="punctuation">),</span>
                <span class="function">linear_color_stop</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">(),</span> <span class="constant">1.</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">));</span>

        <span class="comment">// draw a pie chart</span>
        <span class="keyword">let</span> center = <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">96.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">96.</span><span class="punctuation">));</span>
        <span class="keyword">let</span> pie_center = <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">775.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">255.</span><span class="punctuation">));</span>
        <span class="keyword">let</span> segments = <span class="punctuation">[</span>
            <span class="punctuation">(</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">871.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">255.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">747.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">163.</span><span class="punctuation">)),</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x1374e9</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">747.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">163.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">679.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">263.</span><span class="punctuation">)),</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xe13527</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">679.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">263.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">754.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">349.</span><span class="punctuation">)),</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x0751ce</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">754.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">349.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">854.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">310.</span><span class="punctuation">)),</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x209742</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
            <span class="punctuation">(</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">854.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">310.</span><span class="punctuation">)),</span>
                <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">871.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">255.</span><span class="punctuation">)),</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xfbc10a</span><span class="punctuation">),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">];</span>

        <span class="keyword">for</span> <span class="punctuation">(</span>start<span class="punctuation">,</span> end<span class="punctuation">,</span> color<span class="punctuation">)</span> <span class="keyword">in</span> segments <span class="punctuation">{</span>
            <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">fill</span><span class="punctuation">();</span>
            builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span>start<span class="punctuation">);</span>
            builder<span class="punctuation">.</span><span class="property">arc_to</span><span class="punctuation">(</span>center<span class="punctuation">,</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> <span class="constant">false</span><span class="punctuation">,</span> <span class="constant">false</span><span class="punctuation">,</span> end<span class="punctuation">);</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>pie_center<span class="punctuation">);</span>
            builder<span class="punctuation">.</span><span class="property">close</span><span class="punctuation">();</span>
            <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
            lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> color<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()));</span>
        <span class="punctuation">}</span>

        <span class="comment">// draw a wave</span>
        <span class="keyword">let</span> options = <span class="constructor">StrokeOptions</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">with_line_width</span><span class="punctuation">(</span><span class="constant">1.</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">with_line_join</span><span class="punctuation">(</span>lyon<span class="punctuation">::</span>path<span class="punctuation">::</span><span class="constructor">LineJoin</span><span class="punctuation">::</span><span class="constructor">Bevel</span><span class="punctuation">);</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">stroke</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">1.</span><span class="punctuation">)).</span><span class="property">with_style</span><span class="punctuation">(</span><span class="constructor">PathStyle</span><span class="punctuation">::</span><span class="constructor">Stroke</span><span class="punctuation">(</span>options<span class="punctuation">));</span>
        builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">40.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">420.</span><span class="punctuation">)));</span>
        <span class="keyword">for</span> i <span class="keyword">in</span> <span class="constant">1</span>..<span class="constant">50</span> <span class="punctuation">{</span>
            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span>
                <span class="function">px</span><span class="punctuation">(</span><span class="constant">40.0</span> + i <span class="keyword">as</span> <span class="type">f32</span> <span class="operator">*</span> <span class="constant">10.0</span><span class="punctuation">),</span>
                <span class="function">px</span><span class="punctuation">(</span><span class="constant">420.0</span> + <span class="punctuation">(</span>i <span class="keyword">as</span> <span class="type">f32</span> <span class="operator">*</span> <span class="constant">10.0</span><span class="punctuation">).</span><span class="property">sin</span><span class="punctuation">()</span> <span class="operator">*</span> <span class="constant">40.0</span><span class="punctuation">),</span>
            <span class="punctuation">));</span>
        <span class="punctuation">}</span>
        <span class="keyword">let</span> path = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        lines<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">((</span>path<span class="punctuation">,</span> gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">()));</span>

        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">default_lines</span><span class="punctuation">:</span> lines<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">(),</span>
            background_quads<span class="punctuation">,</span>
            <span class="property">lines</span><span class="punctuation">:</span> <span class="macro">vec!</span><span class="punctuation">[],</span>
            <span class="property">start</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">)),</span>
            <span class="property">dashed</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
            <span class="property">_painting</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">clear</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">lines</span><span class="punctuation">.</span><span class="property">clear</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">button</span><span class="punctuation">(</span>
    <span class="variable">text</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span>
    <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">PaintingViewer</span><span class="punctuation">&gt;,</span>
    <span class="variable">on_click</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">Fn</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">PaintingViewer</span><span class="punctuation">,</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">PaintingViewer</span><span class="punctuation">&gt;)</span> + <span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">,</span>
<span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span>text<span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>text<span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">active</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.8</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">px_3</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">py_1</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="keyword">move</span> |this<span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="function">on_click</span><span class="punctuation">(</span>this<span class="punctuation">,</span> cx<span class="punctuation">)))</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">PaintingViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> default_lines = <span class="variable">self</span><span class="punctuation">.</span><span class="property">default_lines</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="keyword">let</span> background_quads = <span class="variable">self</span><span class="punctuation">.</span><span class="property">background_quads</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="keyword">let</span> lines = <span class="variable">self</span><span class="punctuation">.</span><span class="property">lines</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="keyword">let</span> dashed = <span class="variable">self</span><span class="punctuation">.</span><span class="property">dashed</span><span class="punctuation">;</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_between</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Mouse down any point and drag to draw lines (Hold on shift key to draw straight lines)&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_x_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span>
                                <span class="keyword">if</span> dashed <span class="punctuation">{</span> <span class="string">&quot;Solid&quot;</span> <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span> <span class="string">&quot;Dashed&quot;</span> <span class="punctuation">},</span>
                                cx<span class="punctuation">,</span>
                                <span class="keyword">move</span> |this<span class="punctuation">,</span> _| this<span class="punctuation">.</span><span class="property">dashed</span> = !dashed<span class="punctuation">,</span>
                            <span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Clear&quot;</span><span class="punctuation">,</span> cx<span class="punctuation">,</span> |this<span class="punctuation">,</span> cx| this<span class="punctuation">.</span><span class="property">clear</span><span class="punctuation">(</span>cx<span class="punctuation">))),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">canvas</span><span class="punctuation">(</span>
                            <span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{},</span>
                            <span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                <span class="comment">// First draw background quads</span>
                                <span class="keyword">for</span> <span class="punctuation">(</span>bounds<span class="punctuation">,</span> color<span class="punctuation">)</span> <span class="keyword">in</span> background_quads<span class="punctuation">.</span><span class="property">iter</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                    window<span class="punctuation">.</span><span class="property">paint_quad</span><span class="punctuation">(</span><span class="function">quad</span><span class="punctuation">(</span>
                                        <span class="operator">*</span>bounds<span class="punctuation">,</span>
                                        <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
                                        <span class="operator">*</span>color<span class="punctuation">,</span>
                                        <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
                                        gpui<span class="punctuation">::</span><span class="function">transparent_black</span><span class="punctuation">(),</span>
                                        <span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">(),</span>
                                    <span class="punctuation">));</span>
                                <span class="punctuation">}</span>

                                <span class="comment">// Then draw the default paths on top</span>
                                <span class="keyword">for</span> <span class="punctuation">(</span>path<span class="punctuation">,</span> color<span class="punctuation">)</span> <span class="keyword">in</span> default_lines <span class="punctuation">{</span>
                                    window<span class="punctuation">.</span><span class="property">paint_path</span><span class="punctuation">(</span>path<span class="punctuation">,</span> color<span class="punctuation">);</span>
                                <span class="punctuation">}</span>

                                <span class="keyword">for</span> points <span class="keyword">in</span> lines <span class="punctuation">{</span>
                                    <span class="keyword">if</span> points<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span> &lt; <span class="constant">2</span> <span class="punctuation">{</span>
                                        <span class="keyword">continue</span><span class="punctuation">;</span>
                                    <span class="punctuation">}</span>

                                    <span class="keyword">let</span> <span class="keyword">mut</span> builder = <span class="constructor">PathBuilder</span><span class="punctuation">::</span><span class="function">stroke</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">1.</span><span class="punctuation">));</span>
                                    <span class="keyword">if</span> dashed <span class="punctuation">{</span>
                                        builder = builder<span class="punctuation">.</span><span class="property">dash_array</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="punctuation">[</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">4.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">2.</span><span class="punctuation">)]);</span>
                                    <span class="punctuation">}</span>
                                    <span class="keyword">for</span> <span class="punctuation">(</span>i<span class="punctuation">,</span> p<span class="punctuation">)</span> <span class="keyword">in</span> points<span class="punctuation">.</span><span class="property">into_iter</span><span class="punctuation">().</span><span class="property">enumerate</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                        <span class="keyword">if</span> i == <span class="constant">0</span> <span class="punctuation">{</span>
                                            builder<span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span>p<span class="punctuation">);</span>
                                        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                                            builder<span class="punctuation">.</span><span class="property">line_to</span><span class="punctuation">(</span>p<span class="punctuation">);</span>
                                        <span class="punctuation">}</span>
                                    <span class="punctuation">}</span>

                                    <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Ok</span><span class="punctuation">(</span>path<span class="punctuation">)</span> = builder<span class="punctuation">.</span><span class="property">build</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                        window<span class="punctuation">.</span><span class="property">paint_path</span><span class="punctuation">(</span>path<span class="punctuation">,</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">());</span>
                                    <span class="punctuation">}</span>
                                <span class="punctuation">}</span>
                            <span class="punctuation">},</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">(),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_down</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span>
                        cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> <span class="variable">ev</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseDownEvent</span><span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                            this<span class="punctuation">.</span><span class="property">_painting</span> = <span class="constant">true</span><span class="punctuation">;</span>
                            this<span class="punctuation">.</span><span class="property">start</span> = ev<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">;</span>
                            <span class="keyword">let</span> path = <span class="macro">vec!</span><span class="punctuation">[</span>ev<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">];</span>
                            this<span class="punctuation">.</span><span class="property">lines</span><span class="punctuation">.</span><span class="property">push</span><span class="punctuation">(</span>path<span class="punctuation">);</span>
                        <span class="punctuation">}),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_move</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> <span class="variable">ev</span><span class="punctuation">:</span> <span class="operator">&amp;</span>gpui<span class="punctuation">::</span><span class="type">MouseMoveEvent</span><span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        <span class="keyword">if</span> !this<span class="punctuation">.</span><span class="property">_painting</span> <span class="punctuation">{</span>
                            <span class="keyword">return</span><span class="punctuation">;</span>
                        <span class="punctuation">}</span>

                        <span class="keyword">let</span> is_shifted = ev<span class="punctuation">.</span><span class="property">modifiers</span><span class="punctuation">.</span><span class="property">shift</span><span class="punctuation">;</span>
                        <span class="keyword">let</span> <span class="keyword">mut</span> pos = ev<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">;</span>
                        <span class="comment">// When holding shift, draw a straight line</span>
                        <span class="keyword">if</span> is_shifted <span class="punctuation">{</span>
                            <span class="keyword">let</span> dx = pos<span class="punctuation">.</span><span class="property">x</span> - this<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">.</span><span class="property">x</span><span class="punctuation">;</span>
                            <span class="keyword">let</span> dy = pos<span class="punctuation">.</span><span class="property">y</span> - this<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">.</span><span class="property">y</span><span class="punctuation">;</span>
                            <span class="keyword">if</span> dx<span class="punctuation">.</span><span class="property">abs</span><span class="punctuation">()</span> &gt; dy<span class="punctuation">.</span><span class="property">abs</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                pos<span class="punctuation">.</span><span class="property">y</span> = this<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">.</span><span class="property">y</span><span class="punctuation">;</span>
                            <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                                pos<span class="punctuation">.</span><span class="property">x</span> = this<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">.</span><span class="property">x</span><span class="punctuation">;</span>
                            <span class="punctuation">}</span>
                        <span class="punctuation">}</span>

                        <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>path<span class="punctuation">)</span> = this<span class="punctuation">.</span><span class="property">lines</span><span class="punctuation">.</span><span class="property">last_mut</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                            path<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">(</span>pos<span class="punctuation">);</span>
                        <span class="punctuation">}</span>

                        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
                    <span class="punctuation">}))</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_up</span><span class="punctuation">(</span>
                        gpui<span class="punctuation">::</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span>
                        cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                            this<span class="punctuation">.</span><span class="property">_painting</span> = <span class="constant">false</span><span class="punctuation">;</span>
                        <span class="punctuation">}),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">PaintingViewer</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">)),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">on_window_closed</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">();</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
