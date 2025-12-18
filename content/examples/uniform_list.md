+++
title = "Uniform List"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example uniform_list"
source_file = "crates/gpui/examples/uniform_list.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span>
    rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> uniform_list<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">UniformListExample</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">UniformListExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">)).</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">uniform_list</span><span class="punctuation">(</span>
                <span class="string">&quot;entries&quot;</span><span class="punctuation">,</span>
                <span class="constant">50</span><span class="punctuation">,</span>
                cx<span class="punctuation">.</span><span class="property">processor</span><span class="punctuation">(</span>|_this<span class="punctuation">,</span> range<span class="punctuation">,</span> _window<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                    <span class="keyword">let</span> <span class="keyword">mut</span> items = <span class="constructor">Vec</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">();</span>
                    <span class="keyword">for</span> ix <span class="keyword">in</span> range <span class="punctuation">{</span>
                        <span class="keyword">let</span> item = ix + <span class="constant">1</span><span class="punctuation">;</span>

                        items<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span>ix<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">px_2</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_event<span class="punctuation">,</span> _window<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                                    <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;clicked Item {item:?}&quot;</span><span class="punctuation">);</span>
                                <span class="punctuation">})</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Item {item}&quot;</span><span class="punctuation">)),</span>
                        <span class="punctuation">);</span>
                    <span class="punctuation">}</span>
                    items
                <span class="punctuation">}),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">h_full</span><span class="punctuation">(),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">UniformListExample</span> <span class="punctuation">{}),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
