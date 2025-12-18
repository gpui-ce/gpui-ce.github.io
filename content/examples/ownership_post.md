+++
title = "Ownership Post"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example ownership_post"
source_file = "crates/gpui/examples/ownership_post.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span><span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Entity</span><span class="punctuation">,</span> <span class="constructor">EventEmitter</span><span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Counter</span> <span class="punctuation">{</span>
    <span class="property">count</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">Change</span> <span class="punctuation">{</span>
    <span class="property">increment</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">EventEmitter</span><span class="punctuation">&lt;</span><span class="type">Change</span><span class="punctuation">&gt;</span> <span class="keyword">for</span> <span class="type">Counter</span> <span class="punctuation">{}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> counter<span class="punctuation">:</span> <span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">Counter</span><span class="punctuation">&gt;</span> = cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">Counter</span> <span class="punctuation">{</span> <span class="property">count</span><span class="punctuation">:</span> <span class="constant">0</span> <span class="punctuation">});</span>
        <span class="keyword">let</span> subscriber = cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Counter</span><span class="punctuation">&gt;</span>| <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">subscribe</span><span class="punctuation">(</span><span class="operator">&amp;</span>counter<span class="punctuation">,</span> |subscriber<span class="punctuation">,</span> _emitter<span class="punctuation">,</span> event<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                subscriber<span class="punctuation">.</span><span class="property">count</span> += event<span class="punctuation">.</span><span class="property">increment</span> <span class="operator">*</span> <span class="constant">2</span><span class="punctuation">;</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

            <span class="type">Counter</span> <span class="punctuation">{</span>
                <span class="property">count</span><span class="punctuation">:</span> counter<span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">).</span><span class="property">count</span> <span class="operator">*</span> <span class="constant">2</span><span class="punctuation">,</span>
            <span class="punctuation">}</span>
        <span class="punctuation">});</span>

        counter<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |counter<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
            counter<span class="punctuation">.</span><span class="property">count</span> += <span class="constant">2</span><span class="punctuation">;</span>
            cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
            cx<span class="punctuation">.</span><span class="property">emit</span><span class="punctuation">(</span><span class="type">Change</span> <span class="punctuation">{</span> <span class="property">increment</span><span class="punctuation">:</span> <span class="constant">2</span> <span class="punctuation">});</span>
        <span class="punctuation">});</span>

        <span class="macro">assert_eq!</span><span class="punctuation">(</span>subscriber<span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">).</span><span class="property">count</span><span class="punctuation">,</span> <span class="constant">4</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
