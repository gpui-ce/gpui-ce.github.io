+++
title = "Gif Viewer"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example gif_viewer"
source_file = "crates/gpui/examples/gif_viewer.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span><span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Render</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> img<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">};</span>
<span class="keyword">use</span> std<span class="punctuation">::</span>path<span class="punctuation">::</span><span class="constructor">PathBuf</span><span class="punctuation">;</span>

<span class="keyword">struct</span> <span class="type">GifViewer</span> <span class="punctuation">{</span>
    <span class="property">gif_path</span><span class="punctuation">:</span> <span class="type">PathBuf</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">GifViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">gif_path</span><span class="punctuation">:</span> <span class="type">PathBuf</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span> gif_path <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">GifViewer</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">img</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">gif_path</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">object_fit</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="constructor">ObjectFit</span><span class="punctuation">::</span><span class="constructor">Contain</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;gif&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    env_logger<span class="punctuation">::</span><span class="function">init</span><span class="punctuation">();</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> gif_path =
            <span class="constructor">PathBuf</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="macro">env!</span><span class="punctuation">(</span><span class="string">&quot;CARGO_MANIFEST_DIR&quot;</span><span class="punctuation">)).</span><span class="property">join</span><span class="punctuation">(</span><span class="string">&quot;examples/image/black-cat-typing.gif&quot;</span><span class="punctuation">);</span>

        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="constructor">GifViewer</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>gif_path<span class="punctuation">)),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
