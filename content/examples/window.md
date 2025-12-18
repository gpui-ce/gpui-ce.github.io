+++
title = "Window"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example window"
source_file = "crates/gpui/examples/window.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">KeyBinding</span><span class="punctuation">,</span> <span class="constructor">PromptButton</span><span class="punctuation">,</span> <span class="constructor">PromptLevel</span><span class="punctuation">,</span> <span class="constructor">Timer</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span>
    <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowKind</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> actions<span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">SubWindow</span> <span class="punctuation">{</span>
    <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">button</span><span class="punctuation">(</span><span class="variable">text</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span> <span class="variable">on_click</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">Fn</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> + <span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
    <span class="function">div</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span>text<span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">flex_none</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">px_2</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xf7f7f7</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">active</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.85</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xe0e0e0</span><span class="punctuation">))</span>
        <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>text<span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">())</span>
        <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> window<span class="punctuation">,</span> cx| <span class="function">on_click</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">))</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">SubWindow</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">custom_titlebar</span><span class="punctuation">,</span> |cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">32.</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Custom Titlebar&quot;</span><span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                <span class="punctuation">)</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">p_8</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;SubWindow&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Close&quot;</span><span class="punctuation">,</span> |window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                        window<span class="punctuation">.</span><span class="property">remove_window</span><span class="punctuation">();</span>
                    <span class="punctuation">})),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">WindowDemo</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">WindowDemo</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> window_bounds =
            <span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">)),</span> cx<span class="punctuation">));</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">content_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Normal&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Popup&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        <span class="property">kind</span><span class="punctuation">:</span> <span class="constructor">WindowKind</span><span class="punctuation">::</span><span class="constructor">PopUp</span><span class="punctuation">,</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Custom Titlebar&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Invisible&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">show</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Unmovable&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">is_movable</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Unresizable&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">is_resizable</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Unminimizable&quot;</span><span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                    <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                        <span class="property">is_minimizable</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>window_bounds<span class="punctuation">),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">},</span>
                    |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SubWindow</span> <span class="punctuation">{</span>
                            <span class="property">custom_titlebar</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Hide Application&quot;</span><span class="punctuation">,</span> |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">hide</span><span class="punctuation">();</span>

                <span class="comment">// Restore the application after 3 seconds</span>
                window
                    <span class="punctuation">.</span><span class="property">spawn</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> <span class="keyword">async</span> <span class="keyword">move</span> |cx| <span class="punctuation">{</span>
                        <span class="constructor">Timer</span><span class="punctuation">::</span><span class="function">after</span><span class="punctuation">(</span>std<span class="punctuation">::</span>time<span class="punctuation">::</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">)).</span><span class="keyword">await</span><span class="punctuation">;</span>
                        cx<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>|_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                            cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">false</span><span class="punctuation">);</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Resize&quot;</span><span class="punctuation">,</span> |window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                <span class="keyword">let</span> content_size = window<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">;</span>
                window<span class="punctuation">.</span><span class="property">resize</span><span class="punctuation">(</span><span class="function">size</span><span class="punctuation">(</span>content_size<span class="punctuation">.</span><span class="property">height</span><span class="punctuation">,</span> content_size<span class="punctuation">.</span><span class="property">width</span><span class="punctuation">));</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Prompt&quot;</span><span class="punctuation">,</span> |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                <span class="keyword">let</span> answer = window<span class="punctuation">.</span><span class="property">prompt</span><span class="punctuation">(</span>
                    <span class="constructor">PromptLevel</span><span class="punctuation">::</span><span class="constructor">Info</span><span class="punctuation">,</span>
                    <span class="string">&quot;Are you sure?&quot;</span><span class="punctuation">,</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="operator">&amp;</span><span class="punctuation">[</span><span class="string">&quot;Ok&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Cancel&quot;</span><span class="punctuation">],</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">);</span>

                cx<span class="punctuation">.</span><span class="property">spawn</span><span class="punctuation">(</span><span class="keyword">async</span> <span class="keyword">move</span> |_| <span class="punctuation">{</span>
                    <span class="keyword">if</span> answer<span class="punctuation">.</span><span class="keyword">await</span><span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">()</span> == <span class="constant">0</span> <span class="punctuation">{</span>
                        <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;You have clicked Ok&quot;</span><span class="punctuation">);</span>
                    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                        <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;You have clicked Cancel&quot;</span><span class="punctuation">);</span>
                    <span class="punctuation">}</span>
                <span class="punctuation">})</span>
                <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;Prompt (non-English)&quot;</span><span class="punctuation">,</span> |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                <span class="keyword">let</span> answer = window<span class="punctuation">.</span><span class="property">prompt</span><span class="punctuation">(</span>
                    <span class="constructor">PromptLevel</span><span class="punctuation">::</span><span class="constructor">Info</span><span class="punctuation">,</span>
                    <span class="string">&quot;Are you sure?&quot;</span><span class="punctuation">,</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="operator">&amp;</span><span class="punctuation">[</span><span class="constructor">PromptButton</span><span class="punctuation">::</span><span class="function">ok</span><span class="punctuation">(</span><span class="string">&quot;确定&quot;</span><span class="punctuation">),</span> <span class="constructor">PromptButton</span><span class="punctuation">::</span><span class="function">cancel</span><span class="punctuation">(</span><span class="string">&quot;取消&quot;</span><span class="punctuation">)],</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">);</span>

                cx<span class="punctuation">.</span><span class="property">spawn</span><span class="punctuation">(</span><span class="keyword">async</span> <span class="keyword">move</span> |_| <span class="punctuation">{</span>
                    <span class="keyword">if</span> answer<span class="punctuation">.</span><span class="keyword">await</span><span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">()</span> == <span class="constant">0</span> <span class="punctuation">{</span>
                        <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;You have clicked Ok&quot;</span><span class="punctuation">);</span>
                    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                        <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;You have clicked Cancel&quot;</span><span class="punctuation">);</span>
                    <span class="punctuation">}</span>
                <span class="punctuation">})</span>
                <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
            <span class="punctuation">}))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="macro">actions!</span><span class="punctuation">(</span>window<span class="punctuation">,</span> <span class="punctuation">[</span><span class="constructor">Quit</span><span class="punctuation">]);</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">800.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>

        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
                    cx<span class="punctuation">.</span><span class="property">observe_window_bounds</span><span class="punctuation">(</span>window<span class="punctuation">,</span> <span class="keyword">move</span> |_<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                        <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;Window bounds changed: {:?}&quot;</span><span class="punctuation">,</span> window<span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">());</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

                    <span class="type">WindowDemo</span> <span class="punctuation">{}</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>|_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Quit</span><span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">());</span>
        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span><span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-q&quot;</span><span class="punctuation">,</span> <span class="constructor">Quit</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">)]);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
