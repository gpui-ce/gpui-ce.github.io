+++
title = "On Window Close Quit"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example on_window_close_quit"
source_file = "crates/gpui/examples/on_window_close_quit.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">FocusHandle</span><span class="punctuation">,</span> <span class="constructor">KeyBinding</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span>
    <span class="constructor">WindowOptions</span><span class="punctuation">,</span> actions<span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="macro">actions!</span><span class="punctuation">(</span>example<span class="punctuation">,</span> <span class="punctuation">[</span><span class="constructor">CloseWindow</span><span class="punctuation">]);</span>

<span class="keyword">struct</span> <span class="type">ExampleWindow</span> <span class="punctuation">{</span>
    <span class="property">focus_handle</span><span class="punctuation">:</span> <span class="type">FocusHandle</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">ExampleWindow</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>|_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">CloseWindow</span><span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                window<span class="punctuation">.</span><span class="property">remove_window</span><span class="punctuation">();</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">track_focus</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x505050</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">shadow_lg</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x0000ff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="string">&quot;Closing this window with cmd-w or the traffic lights should quit the application!&quot;</span><span class="punctuation">,</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>

        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span><span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-w&quot;</span><span class="punctuation">,</span> <span class="constructor">CloseWindow</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">)]);</span>
        cx<span class="punctuation">.</span><span class="property">on_window_closed</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
            <span class="keyword">if</span> cx<span class="punctuation">.</span><span class="property">windows</span><span class="punctuation">().</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">();</span>
            <span class="punctuation">}</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">false</span><span class="punctuation">);</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
                    <span class="keyword">let</span> focus_handle = cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">();</span>
                    focus_handle<span class="punctuation">.</span><span class="property">focus</span><span class="punctuation">(</span>window<span class="punctuation">);</span>
                    <span class="type">ExampleWindow</span> <span class="punctuation">{</span> focus_handle <span class="punctuation">}</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">x</span> += bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span><span class="punctuation">;</span>

        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
                    <span class="keyword">let</span> focus_handle = cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">();</span>
                    focus_handle<span class="punctuation">.</span><span class="property">focus</span><span class="punctuation">(</span>window<span class="punctuation">);</span>
                    <span class="type">ExampleWindow</span> <span class="punctuation">{</span> focus_handle <span class="punctuation">}</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
