+++
title = "Window Shadow"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example window_shadow"
source_file = "crates/gpui/examples/window_shadow.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">CursorStyle</span><span class="punctuation">,</span> <span class="constructor">Decorations</span><span class="punctuation">,</span> <span class="constructor">HitboxBehavior</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">MouseButton</span><span class="punctuation">,</span>
    <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Point</span><span class="punctuation">,</span> <span class="constructor">ResizeEdge</span><span class="punctuation">,</span> <span class="constructor">Size</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span>
    <span class="constructor">WindowDecorations</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> black<span class="punctuation">,</span> canvas<span class="punctuation">,</span> div<span class="punctuation">,</span> green<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
    transparent_black<span class="punctuation">,</span> white<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">WindowShadow</span> <span class="punctuation">{}</span>

<span class="comment">// Things to do:</span>
<span class="comment">// 1. We need a way of calculating which edge or corner the mouse is on,</span>
<span class="comment">//    and then dispatch on that</span>
<span class="comment">// 2. We need to improve the shadow rendering significantly</span>
<span class="comment">// 3. We need to implement the techniques in here in Zed</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">WindowShadow</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> decorations = window<span class="punctuation">.</span><span class="property">window_decorations</span><span class="punctuation">();</span>
        <span class="keyword">let</span> rounding = <span class="function">px</span><span class="punctuation">(</span><span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> shadow_size = <span class="function">px</span><span class="punctuation">(</span><span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> border_size = <span class="function">px</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> grey = <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x808080</span><span class="punctuation">);</span>
        window<span class="punctuation">.</span><span class="property">set_client_inset</span><span class="punctuation">(</span>shadow_size<span class="punctuation">);</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;window-backdrop&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">transparent_black</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|div| <span class="keyword">match</span> decorations <span class="punctuation">{</span>
                <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="constructor">Server</span> =&gt; div<span class="punctuation">,</span>
                <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="type">Client</span> <span class="punctuation">{</span> tiling<span class="punctuation">,</span> .. <span class="punctuation">}</span> =&gt; div
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">transparent_black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">canvas</span><span class="punctuation">(</span>
                            |_bounds<span class="punctuation">,</span> window<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                                window<span class="punctuation">.</span><span class="property">insert_hitbox</span><span class="punctuation">(</span>
                                    <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>
                                        <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">)),</span>
                                        window<span class="punctuation">.</span><span class="property">window_bounds</span><span class="punctuation">().</span><span class="property">get_bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">,</span>
                                    <span class="punctuation">),</span>
                                    <span class="constructor">HitboxBehavior</span><span class="punctuation">::</span><span class="constructor">Normal</span><span class="punctuation">,</span>
                                <span class="punctuation">)</span>
                            <span class="punctuation">},</span>
                            <span class="keyword">move</span> |_bounds<span class="punctuation">,</span> hitbox<span class="punctuation">,</span> window<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                                <span class="keyword">let</span> mouse = window<span class="punctuation">.</span><span class="property">mouse_position</span><span class="punctuation">();</span>
                                <span class="keyword">let</span> size = window<span class="punctuation">.</span><span class="property">window_bounds</span><span class="punctuation">().</span><span class="property">get_bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">;</span>
                                <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>edge<span class="punctuation">)</span> = <span class="function">resize_edge</span><span class="punctuation">(</span>mouse<span class="punctuation">,</span> shadow_size<span class="punctuation">,</span> size<span class="punctuation">)</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                                    <span class="keyword">return</span><span class="punctuation">;</span>
                                <span class="punctuation">};</span>
                                window<span class="punctuation">.</span><span class="property">set_cursor_style</span><span class="punctuation">(</span>
                                    <span class="keyword">match</span> edge <span class="punctuation">{</span>
                                        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Top</span> | <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Bottom</span> =&gt; <span class="punctuation">{</span>
                                            <span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">ResizeUpDown</span>
                                        <span class="punctuation">}</span>
                                        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Left</span> | <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Right</span> =&gt; <span class="punctuation">{</span>
                                            <span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">ResizeLeftRight</span>
                                        <span class="punctuation">}</span>
                                        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">TopLeft</span> | <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">BottomRight</span> =&gt; <span class="punctuation">{</span>
                                            <span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">ResizeUpLeftDownRight</span>
                                        <span class="punctuation">}</span>
                                        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">TopRight</span> | <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">BottomLeft</span> =&gt; <span class="punctuation">{</span>
                                            <span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">ResizeUpRightDownLeft</span>
                                        <span class="punctuation">}</span>
                                    <span class="punctuation">},</span>
                                    <span class="operator">&amp;</span>hitbox<span class="punctuation">,</span>
                                <span class="punctuation">);</span>
                            <span class="punctuation">},</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">absolute</span><span class="punctuation">(),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!<span class="punctuation">(</span>tiling<span class="punctuation">.</span><span class="property">top</span> || tiling<span class="punctuation">.</span><span class="property">right</span><span class="punctuation">),</span> |div| <span class="punctuation">{</span>
                        div<span class="punctuation">.</span><span class="property">rounded_tr</span><span class="punctuation">(</span>rounding<span class="punctuation">)</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!<span class="punctuation">(</span>tiling<span class="punctuation">.</span><span class="property">top</span> || tiling<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">),</span> |div| div<span class="punctuation">.</span><span class="property">rounded_tl</span><span class="punctuation">(</span>rounding<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">pt</span><span class="punctuation">(</span>shadow_size<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">pb</span><span class="punctuation">(</span>shadow_size<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">pl</span><span class="punctuation">(</span>shadow_size<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">right</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">pr</span><span class="punctuation">(</span>shadow_size<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_move</span><span class="punctuation">(</span>|_e<span class="punctuation">,</span> window<span class="punctuation">,</span> _cx| window<span class="punctuation">.</span><span class="property">refresh</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_down</span><span class="punctuation">(</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span> <span class="keyword">move</span> |e<span class="punctuation">,</span> window<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
                        <span class="keyword">let</span> size = window<span class="punctuation">.</span><span class="property">window_bounds</span><span class="punctuation">().</span><span class="property">get_bounds</span><span class="punctuation">().</span><span class="property">size</span><span class="punctuation">;</span>
                        <span class="keyword">let</span> pos = e<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">;</span>

                        <span class="keyword">match</span> <span class="function">resize_edge</span><span class="punctuation">(</span>pos<span class="punctuation">,</span> shadow_size<span class="punctuation">,</span> size<span class="punctuation">)</span> <span class="punctuation">{</span>
                            <span class="constructor">Some</span><span class="punctuation">(</span>edge<span class="punctuation">)</span> =&gt; window<span class="punctuation">.</span><span class="property">start_window_resize</span><span class="punctuation">(</span>edge<span class="punctuation">),</span>
                            <span class="constructor">None</span> =&gt; window<span class="punctuation">.</span><span class="property">start_window_move</span><span class="punctuation">(),</span>
                        <span class="punctuation">};</span>
                    <span class="punctuation">}),</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">cursor</span><span class="punctuation">(</span><span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">Arrow</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|div| <span class="keyword">match</span> decorations <span class="punctuation">{</span>
                        <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="constructor">Server</span> =&gt; div<span class="punctuation">,</span>
                        <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="type">Client</span> <span class="punctuation">{</span> tiling <span class="punctuation">}</span> =&gt; div
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>grey<span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!<span class="punctuation">(</span>tiling<span class="punctuation">.</span><span class="property">top</span> || tiling<span class="punctuation">.</span><span class="property">right</span><span class="punctuation">),</span> |div| <span class="punctuation">{</span>
                                div<span class="punctuation">.</span><span class="property">rounded_tr</span><span class="punctuation">(</span>rounding<span class="punctuation">)</span>
                            <span class="punctuation">})</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!<span class="punctuation">(</span>tiling<span class="punctuation">.</span><span class="property">top</span> || tiling<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">),</span> |div| div<span class="punctuation">.</span><span class="property">rounded_tl</span><span class="punctuation">(</span>rounding<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">border_t</span><span class="punctuation">(</span>border_size<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">border_b</span><span class="punctuation">(</span>border_size<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">border_l</span><span class="punctuation">(</span>border_size<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">right</span><span class="punctuation">,</span> |div| div<span class="punctuation">.</span><span class="property">border_r</span><span class="punctuation">(</span>border_size<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>!tiling<span class="punctuation">.</span><span class="property">is_tiled</span><span class="punctuation">(),</span> |div| <span class="punctuation">{</span>
                                div<span class="punctuation">.</span><span class="property">shadow</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span>gpui<span class="punctuation">::</span><span class="type">BoxShadow</span> <span class="punctuation">{</span>
                                    <span class="property">color</span><span class="punctuation">:</span> <span class="type">Hsla</span> <span class="punctuation">{</span>
                                        <span class="property">h</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                        <span class="property">s</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                        <span class="property">l</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                        <span class="property">a</span><span class="punctuation">:</span> <span class="constant">0.4</span><span class="punctuation">,</span>
                                    <span class="punctuation">},</span>
                                    <span class="property">blur_radius</span><span class="punctuation">:</span> shadow_size / <span class="constant">2.</span><span class="punctuation">,</span>
                                    <span class="property">spread_radius</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span>
                                    <span class="property">offset</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">)),</span>
                                <span class="punctuation">}])</span>
                            <span class="punctuation">}),</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">on_mouse_move</span><span class="punctuation">(</span>|_e<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">stop_propagation</span><span class="punctuation">();</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xCCCCFF</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_around</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">().</span><span class="property">w_full</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">flex_row</span><span class="punctuation">().</span><span class="property">justify_around</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                            <span class="function">div</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">white</span><span class="punctuation">())</span>
                                <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">shadow_lg</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x0000ff</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                    <span class="function">div</span><span class="punctuation">()</span>
                                        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;hello&quot;</span><span class="punctuation">)</span>
                                        <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">200.0</span><span class="punctuation">))</span>
                                        <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">100.0</span><span class="punctuation">))</span>
                                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">green</span><span class="punctuation">())</span>
                                        <span class="punctuation">.</span><span class="property">shadow</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span>gpui<span class="punctuation">::</span><span class="type">BoxShadow</span> <span class="punctuation">{</span>
                                            <span class="property">color</span><span class="punctuation">:</span> <span class="type">Hsla</span> <span class="punctuation">{</span>
                                                <span class="property">h</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                                <span class="property">s</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                                <span class="property">l</span><span class="punctuation">:</span> <span class="constant">0.</span><span class="punctuation">,</span>
                                                <span class="property">a</span><span class="punctuation">:</span> <span class="constant">1.0</span><span class="punctuation">,</span>
                                            <span class="punctuation">},</span>
                                            <span class="property">blur_radius</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">20.0</span><span class="punctuation">),</span>
                                            <span class="property">spread_radius</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span>
                                            <span class="property">offset</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">)),</span>
                                        <span class="punctuation">}])</span>
                                        <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|div| <span class="keyword">match</span> decorations <span class="punctuation">{</span>
                                            <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="constructor">Server</span> =&gt; div<span class="punctuation">,</span>
                                            <span class="constructor">Decorations</span><span class="punctuation">::</span><span class="type">Client</span> <span class="punctuation">{</span> .. <span class="punctuation">}</span> =&gt; div
                                                <span class="punctuation">.</span><span class="property">on_mouse_down</span><span class="punctuation">(</span>
                                                    <span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span>
                                                    |_e<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                                        window<span class="punctuation">.</span><span class="property">start_window_move</span><span class="punctuation">();</span>
                                                    <span class="punctuation">},</span>
                                                <span class="punctuation">)</span>
                                                <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>|e<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                                    <span class="keyword">if</span> e<span class="punctuation">.</span><span class="property">is_right_click</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                                        window<span class="punctuation">.</span><span class="property">show_window_menu</span><span class="punctuation">(</span>e<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">());</span>
                                                    <span class="punctuation">}</span>
                                                <span class="punctuation">})</span>
                                                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">black</span><span class="punctuation">())</span>
                                                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;this is the custom titlebar&quot;</span><span class="punctuation">),</span>
                                        <span class="punctuation">}),</span>
                                <span class="punctuation">),</span>
                        <span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">resize_edge</span><span class="punctuation">(</span><span class="variable">pos</span><span class="punctuation">:</span> <span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span> <span class="variable">shadow_size</span><span class="punctuation">:</span> <span class="type">Pixels</span><span class="punctuation">,</span> <span class="variable">size</span><span class="punctuation">:</span> <span class="type">Size</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">ResizeEdge</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> edge = <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &lt; shadow_size &amp;&amp; pos<span class="punctuation">.</span><span class="property">x</span> &lt; shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">TopLeft</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &lt; shadow_size &amp;&amp; pos<span class="punctuation">.</span><span class="property">x</span> &gt; size<span class="punctuation">.</span><span class="property">width</span> - shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">TopRight</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &lt; shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Top</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &gt; size<span class="punctuation">.</span><span class="property">height</span> - shadow_size &amp;&amp; pos<span class="punctuation">.</span><span class="property">x</span> &lt; shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">BottomLeft</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &gt; size<span class="punctuation">.</span><span class="property">height</span> - shadow_size &amp;&amp; pos<span class="punctuation">.</span><span class="property">x</span> &gt; size<span class="punctuation">.</span><span class="property">width</span> - shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">BottomRight</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">y</span> &gt; size<span class="punctuation">.</span><span class="property">height</span> - shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Bottom</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">x</span> &lt; shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Left</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="keyword">if</span> pos<span class="punctuation">.</span><span class="property">x</span> &gt; size<span class="punctuation">.</span><span class="property">width</span> - shadow_size <span class="punctuation">{</span>
        <span class="constructor">ResizeEdge</span><span class="punctuation">::</span><span class="constructor">Right</span>
    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
        <span class="keyword">return</span> <span class="constructor">None</span><span class="punctuation">;</span>
    <span class="punctuation">};</span>
    <span class="constructor">Some</span><span class="punctuation">(</span>edge<span class="punctuation">)</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">600.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                <span class="property">window_background</span><span class="punctuation">:</span> <span class="constructor">WindowBackgroundAppearance</span><span class="punctuation">::</span><span class="constructor">Opaque</span><span class="punctuation">,</span>
                <span class="property">window_decorations</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowDecorations</span><span class="punctuation">::</span><span class="constructor">Client</span><span class="punctuation">),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="punctuation">{</span>
                    cx<span class="punctuation">.</span><span class="property">observe_window_appearance</span><span class="punctuation">(</span>window<span class="punctuation">,</span> |_<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                        window<span class="punctuation">.</span><span class="property">refresh</span><span class="punctuation">();</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
                    <span class="type">WindowShadow</span> <span class="punctuation">{}</span>
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
