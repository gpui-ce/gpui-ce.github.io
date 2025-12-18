+++
title = "Tab Stop"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example tab_stop"
source_file = "crates/gpui/examples/tab_stop.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Div</span><span class="punctuation">,</span> <span class="constructor">ElementId</span><span class="punctuation">,</span> <span class="constructor">FocusHandle</span><span class="punctuation">,</span> <span class="constructor">KeyBinding</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span>
    <span class="constructor">Stateful</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> actions<span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="macro">actions!</span><span class="punctuation">(</span>example<span class="punctuation">,</span> <span class="punctuation">[</span><span class="constructor">Tab</span><span class="punctuation">,</span> <span class="constructor">TabPrev</span><span class="punctuation">]);</span>

<span class="keyword">struct</span> <span class="type">Example</span> <span class="punctuation">{</span>
    <span class="property">focus_handle</span><span class="punctuation">:</span> <span class="type">FocusHandle</span><span class="punctuation">,</span>
    <span class="property">items</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">FocusHandle</span><span class="punctuation">&gt;,</span>
    <span class="property">message</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Example</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> items = <span class="macro">vec!</span><span class="punctuation">[</span>
            cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">().</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">1</span><span class="punctuation">).</span><span class="property">tab_stop</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">),</span>
            cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">().</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">).</span><span class="property">tab_stop</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">),</span>
            cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">().</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">).</span><span class="property">tab_stop</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">),</span>
            cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(),</span>
            cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">().</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">).</span><span class="property">tab_stop</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">),</span>
        <span class="punctuation">];</span>

        <span class="keyword">let</span> focus_handle = cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">();</span>
        window<span class="punctuation">.</span><span class="property">focus</span><span class="punctuation">(</span><span class="operator">&amp;</span>focus_handle<span class="punctuation">);</span>

        <span class="type">Self</span> <span class="punctuation">{</span>
            focus_handle<span class="punctuation">,</span>
            items<span class="punctuation">,</span>
            <span class="property">message</span><span class="punctuation">:</span> <span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="string">&quot;Press `Tab`, `Shift-Tab` to switch focus.&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">on_tab</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Tab</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        window<span class="punctuation">.</span><span class="property">focus_next</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">message</span> = <span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="string">&quot;You have pressed `Tab`.&quot;</span><span class="punctuation">);</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">on_tab_prev</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">TabPrev</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        window<span class="punctuation">.</span><span class="property">focus_prev</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">message</span> = <span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="string">&quot;You have pressed `Shift-Tab`.&quot;</span><span class="punctuation">);</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">Example</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">fn</span> <span class="function">tab_stop_style</span><span class="punctuation">&lt;</span><span class="type">T</span><span class="punctuation">:</span> <span class="type">Styled</span><span class="punctuation">&gt;(</span><span class="variable">this</span><span class="punctuation">:</span> <span class="type">T</span><span class="punctuation">)</span> -&gt; <span class="type">T</span> <span class="punctuation">{</span>
            this<span class="punctuation">.</span><span class="property">border_3</span><span class="punctuation">().</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
        <span class="punctuation">}</span>

        <span class="keyword">fn</span> <span class="function">button</span><span class="punctuation">(</span><span class="variable">id</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">Into</span><span class="punctuation">&lt;</span><span class="type">ElementId</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Stateful</span><span class="punctuation">&lt;</span><span class="type">Div</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span>id<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">h_10</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                <span class="punctuation">.</span><span class="property">focus</span><span class="punctuation">(</span>tab_stop_style<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">shadow_sm</span><span class="punctuation">()</span>
        <span class="punctuation">}</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;app&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">track_focus</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_tab<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_tab_prev<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">message</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">items</span>
                    <span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">into_iter</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">enumerate</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>ix<span class="punctuation">,</span> item_handle<span class="punctuation">)</span>| <span class="punctuation">{</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">((</span><span class="string">&quot;item&quot;</span><span class="punctuation">,</span> ix<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">track_focus</span><span class="punctuation">(</span><span class="operator">&amp;</span>item_handle<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">h_10</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>
                                item_handle<span class="punctuation">.</span><span class="property">tab_stop</span> &amp;&amp; item_handle<span class="punctuation">.</span><span class="property">is_focused</span><span class="punctuation">(</span>window<span class="punctuation">),</span>
                                tab_stop_style<span class="punctuation">,</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|this| <span class="keyword">match</span> item_handle<span class="punctuation">.</span><span class="property">tab_stop</span> <span class="punctuation">{</span>
                                <span class="constant">true</span> =&gt; this
                                    <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.1</span><span class="punctuation">)))</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;tab_index: {}&quot;</span><span class="punctuation">,</span> item_handle<span class="punctuation">.</span><span class="property">tab_index</span><span class="punctuation">)),</span>
                                <span class="constant">false</span> =&gt; this<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.4</span><span class="punctuation">).</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;tab_stop: false&quot;</span><span class="punctuation">),</span>
                            <span class="punctuation">})</span>
                    <span class="punctuation">}),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;el1&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">4</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Button 1&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                this<span class="punctuation">.</span><span class="property">message</span> = <span class="string">&quot;You have clicked Button 1.&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
                                cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
                            <span class="punctuation">})),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">button</span><span class="punctuation">(</span><span class="string">&quot;el2&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">tab_index</span><span class="punctuation">(</span><span class="constant">5</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Button 2&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span>|this<span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                this<span class="punctuation">.</span><span class="property">message</span> = <span class="string">&quot;You have clicked Button 2.&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
                                cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
                            <span class="punctuation">})),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;tab&quot;</span><span class="punctuation">,</span> <span class="constructor">Tab</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;shift-tab&quot;</span><span class="punctuation">,</span> <span class="constructor">TabPrev</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
        <span class="punctuation">]);</span>

        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">800.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">Example</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">)),</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
