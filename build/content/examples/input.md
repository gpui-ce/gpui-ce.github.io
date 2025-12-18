+++
title = "Input"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example input"
source_file = "crates/gpui/examples/input.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::</span>ops<span class="punctuation">::</span><span class="constructor">Range</span><span class="punctuation">;</span>

<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">ClipboardItem</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">CursorStyle</span><span class="punctuation">,</span> <span class="constructor">ElementId</span><span class="punctuation">,</span> <span class="constructor">ElementInputHandler</span><span class="punctuation">,</span>
    <span class="constructor">Entity</span><span class="punctuation">,</span> <span class="constructor">EntityInputHandler</span><span class="punctuation">,</span> <span class="constructor">FocusHandle</span><span class="punctuation">,</span> <span class="constructor">Focusable</span><span class="punctuation">,</span> <span class="constructor">GlobalElementId</span><span class="punctuation">,</span> <span class="constructor">KeyBinding</span><span class="punctuation">,</span> <span class="constructor">Keystroke</span><span class="punctuation">,</span>
    <span class="constructor">LayoutId</span><span class="punctuation">,</span> <span class="constructor">MouseButton</span><span class="punctuation">,</span> <span class="constructor">MouseDownEvent</span><span class="punctuation">,</span> <span class="constructor">MouseMoveEvent</span><span class="punctuation">,</span> <span class="constructor">MouseUpEvent</span><span class="punctuation">,</span> <span class="constructor">PaintQuad</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Point</span><span class="punctuation">,</span>
    <span class="constructor">ShapedLine</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Style</span><span class="punctuation">,</span> <span class="constructor">TextRun</span><span class="punctuation">,</span> <span class="constructor">UTF16Selection</span><span class="punctuation">,</span> <span class="constructor">UnderlineStyle</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span>
    <span class="constructor">WindowOptions</span><span class="punctuation">,</span> actions<span class="punctuation">,</span> black<span class="punctuation">,</span> div<span class="punctuation">,</span> fill<span class="punctuation">,</span> hsla<span class="punctuation">,</span> opaque_grey<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> relative<span class="punctuation">,</span>
    rgb<span class="punctuation">,</span> rgba<span class="punctuation">,</span> size<span class="punctuation">,</span> white<span class="punctuation">,</span> yellow<span class="punctuation">,</span>
<span class="punctuation">};</span>
<span class="keyword">use</span> unicode_segmentation<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">;</span>

<span class="macro">actions!</span><span class="punctuation">(</span>
    text_input<span class="punctuation">,</span>
    <span class="punctuation">[</span>
        <span class="constructor">Backspace</span><span class="punctuation">,</span>
        <span class="constructor">Delete</span><span class="punctuation">,</span>
        <span class="constructor">Left</span><span class="punctuation">,</span>
        <span class="constructor">Right</span><span class="punctuation">,</span>
        <span class="constructor">SelectLeft</span><span class="punctuation">,</span>
        <span class="constructor">SelectRight</span><span class="punctuation">,</span>
        <span class="constructor">SelectAll</span><span class="punctuation">,</span>
        <span class="constructor">Home</span><span class="punctuation">,</span>
        <span class="constructor">End</span><span class="punctuation">,</span>
        <span class="constructor">ShowCharacterPalette</span><span class="punctuation">,</span>
        <span class="constructor">Paste</span><span class="punctuation">,</span>
        <span class="constructor">Cut</span><span class="punctuation">,</span>
        <span class="constructor">Copy</span><span class="punctuation">,</span>
        <span class="constructor">Quit</span><span class="punctuation">,</span>
    <span class="punctuation">]</span>
<span class="punctuation">);</span>

<span class="keyword">struct</span> <span class="type">TextInput</span> <span class="punctuation">{</span>
    <span class="property">focus_handle</span><span class="punctuation">:</span> <span class="type">FocusHandle</span><span class="punctuation">,</span>
    <span class="property">content</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">placeholder</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">selected_range</span><span class="punctuation">:</span> <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;,</span>
    <span class="property">selection_reversed</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
    <span class="property">marked_range</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;,</span>
    <span class="property">last_layout</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">ShapedLine</span><span class="punctuation">&gt;,</span>
    <span class="property">last_bounds</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;&gt;,</span>
    <span class="property">is_selecting</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">TextInput</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">left</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Left</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">previous_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">()),</span> cx<span class="punctuation">);</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">start</span><span class="punctuation">,</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">right</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Right</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span><span class="punctuation">),</span> cx<span class="punctuation">);</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span><span class="punctuation">,</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">select_left</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">SelectLeft</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">previous_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">()),</span> cx<span class="punctuation">);</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">select_right</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">SelectRight</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">()),</span> cx<span class="punctuation">);</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">select_all</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">SelectAll</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="constant">0</span><span class="punctuation">,</span> cx<span class="punctuation">);</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span> cx<span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">home</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Home</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="constant">0</span><span class="punctuation">,</span> cx<span class="punctuation">);</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">end</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">End</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span> cx<span class="punctuation">);</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">backspace</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Backspace</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">previous_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">()),</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">replace_text_in_range</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="string">&quot;&quot;</span><span class="punctuation">,</span> window<span class="punctuation">,</span> cx<span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">delete</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Delete</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_boundary</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">()),</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">replace_text_in_range</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="string">&quot;&quot;</span><span class="punctuation">,</span> window<span class="punctuation">,</span> cx<span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">on_mouse_down</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseDownEvent</span><span class="punctuation">,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">is_selecting</span> = <span class="constant">true</span><span class="punctuation">;</span>

        <span class="keyword">if</span> event<span class="punctuation">.</span><span class="property">modifiers</span><span class="punctuation">.</span><span class="property">shift</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">index_for_mouse_position</span><span class="punctuation">(</span>event<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">),</span> cx<span class="punctuation">);</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">move_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">index_for_mouse_position</span><span class="punctuation">(</span>event<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">),</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">on_mouse_up</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseUpEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">is_selecting</span> = <span class="constant">false</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">on_mouse_move</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">event</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseMoveEvent</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">is_selecting</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">select_to</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">index_for_mouse_position</span><span class="punctuation">(</span>event<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">),</span> cx<span class="punctuation">);</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">show_character_palette</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ShowCharacterPalette</span><span class="punctuation">,</span>
        <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> <span class="punctuation">{</span>
        window<span class="punctuation">.</span><span class="property">show_character_palette</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">paste</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Paste</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>text<span class="punctuation">)</span> = cx<span class="punctuation">.</span><span class="property">read_from_clipboard</span><span class="punctuation">().</span><span class="property">and_then</span><span class="punctuation">(</span>|item| item<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">())</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">replace_text_in_range</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="operator">&amp;</span>text<span class="punctuation">.</span><span class="property">replace</span><span class="punctuation">(</span><span class="string">&quot;\n&quot;</span><span class="punctuation">,</span> <span class="string">&quot; &quot;</span><span class="punctuation">),</span> window<span class="punctuation">,</span> cx<span class="punctuation">);</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">copy</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Copy</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> !<span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">write_to_clipboard</span><span class="punctuation">(</span><span class="constructor">ClipboardItem</span><span class="punctuation">::</span><span class="function">new_string</span><span class="punctuation">(</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()].</span><span class="property">to_string</span><span class="punctuation">(),</span>
            <span class="punctuation">));</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
    <span class="keyword">fn</span> <span class="function">cut</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Cut</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> !<span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">write_to_clipboard</span><span class="punctuation">(</span><span class="constructor">ClipboardItem</span><span class="punctuation">::</span><span class="function">new_string</span><span class="punctuation">(</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()].</span><span class="property">to_string</span><span class="punctuation">(),</span>
            <span class="punctuation">));</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">replace_text_in_range</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="string">&quot;&quot;</span><span class="punctuation">,</span> window<span class="punctuation">,</span> cx<span class="punctuation">)</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">move_to</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span> = offset..offset<span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">cursor_offset</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">start</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">index_for_mouse_position</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">position</span><span class="punctuation">:</span> <span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">return</span> <span class="constant">0</span><span class="punctuation">;</span>
        <span class="punctuation">}</span>

        <span class="keyword">let</span> <span class="punctuation">(</span><span class="constructor">Some</span><span class="punctuation">(</span>bounds<span class="punctuation">),</span> <span class="constructor">Some</span><span class="punctuation">(</span>line<span class="punctuation">))</span> = <span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">last_bounds</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">(),</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_layout</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">())</span>
        <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="keyword">return</span> <span class="constant">0</span><span class="punctuation">;</span>
        <span class="punctuation">};</span>
        <span class="keyword">if</span> position<span class="punctuation">.</span><span class="property">y</span> &lt; bounds<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">return</span> <span class="constant">0</span><span class="punctuation">;</span>
        <span class="punctuation">}</span>
        <span class="keyword">if</span> position<span class="punctuation">.</span><span class="property">y</span> &gt; bounds<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">return</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>
        line<span class="punctuation">.</span><span class="property">closest_index_for_x</span><span class="punctuation">(</span>position<span class="punctuation">.</span><span class="property">x</span> - bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">())</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">select_to</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">start</span> = offset
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span> = offset
        <span class="punctuation">};</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span> &lt; <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">start</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span> = !<span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span><span class="punctuation">;</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span> = <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">end</span>..<span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">start</span><span class="punctuation">;</span>
        <span class="punctuation">}</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">offset_from_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> utf8_offset = <span class="constant">0</span><span class="punctuation">;</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> utf16_count = <span class="constant">0</span><span class="punctuation">;</span>

        <span class="keyword">for</span> ch <span class="keyword">in</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">chars</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">if</span> utf16_count &gt;= offset <span class="punctuation">{</span>
                <span class="keyword">break</span><span class="punctuation">;</span>
            <span class="punctuation">}</span>
            utf16_count += ch<span class="punctuation">.</span><span class="property">len_utf16</span><span class="punctuation">();</span>
            utf8_offset += ch<span class="punctuation">.</span><span class="property">len_utf8</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>

        utf8_offset
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">offset_to_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> utf16_offset = <span class="constant">0</span><span class="punctuation">;</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> utf8_count = <span class="constant">0</span><span class="punctuation">;</span>

        <span class="keyword">for</span> ch <span class="keyword">in</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">chars</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="keyword">if</span> utf8_count &gt;= offset <span class="punctuation">{</span>
                <span class="keyword">break</span><span class="punctuation">;</span>
            <span class="punctuation">}</span>
            utf8_count += ch<span class="punctuation">.</span><span class="property">len_utf8</span><span class="punctuation">();</span>
            utf16_offset += ch<span class="punctuation">.</span><span class="property">len_utf16</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>

        utf16_offset
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">range_to_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">range</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">offset_to_utf16</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">)</span>..<span class="variable">self</span><span class="punctuation">.</span><span class="property">offset_to_utf16</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">range_from_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">range_utf16</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">offset_from_utf16</span><span class="punctuation">(</span>range_utf16<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">)</span>..<span class="variable">self</span><span class="punctuation">.</span><span class="property">offset_from_utf16</span><span class="punctuation">(</span>range_utf16<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">previous_boundary</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span>
            <span class="punctuation">.</span><span class="property">grapheme_indices</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">rev</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">find_map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>idx<span class="punctuation">,</span> _<span class="punctuation">)</span>| <span class="punctuation">(</span>idx &lt; offset<span class="punctuation">).</span><span class="property">then_some</span><span class="punctuation">(</span>idx<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">unwrap_or</span><span class="punctuation">(</span><span class="constant">0</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">next_boundary</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">offset</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span>
            <span class="punctuation">.</span><span class="property">grapheme_indices</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">find_map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>idx<span class="punctuation">,</span> _<span class="punctuation">)</span>| <span class="punctuation">(</span>idx &gt; offset<span class="punctuation">).</span><span class="property">then_some</span><span class="punctuation">(</span>idx<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">unwrap_or</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">())</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">reset</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span> = <span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span> = <span class="constant">0</span>..<span class="constant">0</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span> = <span class="constant">false</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span> = <span class="constructor">None</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_layout</span> = <span class="constructor">None</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_bounds</span> = <span class="constructor">None</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">is_selecting</span> = <span class="constant">false</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">EntityInputHandler</span> <span class="keyword">for</span> <span class="type">TextInput</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">text_for_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">range_utf16</span><span class="punctuation">:</span> <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;,</span>
        <span class="variable">actual_range</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">String</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> range = <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_from_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span>range_utf16<span class="punctuation">);</span>
        actual_range<span class="punctuation">.</span><span class="property">replace</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">range_to_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span>range<span class="punctuation">));</span>
        <span class="constructor">Some</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span>range<span class="punctuation">].</span><span class="property">to_string</span><span class="punctuation">())</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">selected_text_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">_ignore_disabled_input</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">UTF16Selection</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="constructor">Some</span><span class="punctuation">(</span><span class="type">UTF16Selection</span> <span class="punctuation">{</span>
            <span class="property">range</span><span class="punctuation">:</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_to_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">),</span>
            <span class="property">reversed</span><span class="punctuation">:</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">selection_reversed</span><span class="punctuation">,</span>
        <span class="punctuation">})</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">marked_text_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span>
            <span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|range| <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_to_utf16</span><span class="punctuation">(</span>range<span class="punctuation">))</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">unmark_text</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span> = <span class="constructor">None</span><span class="punctuation">;</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">replace_text_in_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">range_utf16</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;,</span>
        <span class="variable">new_text</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span>
        _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> range = range_utf16
            <span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|range_utf16| <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_from_utf16</span><span class="punctuation">(</span>range_utf16<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">or</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">unwrap_or</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">());</span>

        <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span> =
            <span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span><span class="constant">0</span>..range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">].</span><span class="property">to_owned</span><span class="punctuation">()</span> + new_text + <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span>range<span class="punctuation">.</span><span class="property">end</span>..<span class="punctuation">])</span>
                <span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span> = range<span class="punctuation">.</span><span class="property">start</span> + new_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span>..range<span class="punctuation">.</span><span class="property">start</span> + new_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span><span class="punctuation">.</span><span class="property">take</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">replace_and_mark_text_in_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">range_utf16</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;,</span>
        <span class="variable">new_text</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span>
        <span class="variable">new_selected_range_utf16</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;&gt;,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> range = range_utf16
            <span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|range_utf16| <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_from_utf16</span><span class="punctuation">(</span>range_utf16<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">or</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">unwrap_or</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">());</span>

        <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span> =
            <span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span><span class="constant">0</span>..range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">].</span><span class="property">to_owned</span><span class="punctuation">()</span> + new_text + <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">[</span>range<span class="punctuation">.</span><span class="property">end</span>..<span class="punctuation">])</span>
                <span class="punctuation">.</span><span class="property">into</span><span class="punctuation">();</span>
        <span class="keyword">if</span> !new_text<span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span> = <span class="constructor">Some</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">start</span>..range<span class="punctuation">.</span><span class="property">start</span> + new_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">());</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">marked_range</span> = <span class="constructor">None</span><span class="punctuation">;</span>
        <span class="punctuation">}</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">selected_range</span> = new_selected_range_utf16
            <span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|range_utf16| <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_from_utf16</span><span class="punctuation">(</span>range_utf16<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|new_range| new_range<span class="punctuation">.</span><span class="property">start</span> + range<span class="punctuation">.</span><span class="property">start</span>..new_range<span class="punctuation">.</span><span class="property">end</span> + range<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap_or_else</span><span class="punctuation">(</span>|| range<span class="punctuation">.</span><span class="property">start</span> + new_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span>..range<span class="punctuation">.</span><span class="property">start</span> + new_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">());</span>

        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">bounds_for_range</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">range_utf16</span><span class="punctuation">:</span> <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;,</span>
        <span class="variable">bounds</span><span class="punctuation">:</span> <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> last_layout = <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_layout</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>?<span class="punctuation">;</span>
        <span class="keyword">let</span> range = <span class="variable">self</span><span class="punctuation">.</span><span class="property">range_from_utf16</span><span class="punctuation">(</span><span class="operator">&amp;</span>range_utf16<span class="punctuation">);</span>
        <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">from_corners</span><span class="punctuation">(</span>
            <span class="function">point</span><span class="punctuation">(</span>
                bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">()</span> + last_layout<span class="punctuation">.</span><span class="property">x_for_index</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">),</span>
                bounds<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
            <span class="function">point</span><span class="punctuation">(</span>
                bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">()</span> + last_layout<span class="punctuation">.</span><span class="property">x_for_index</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">),</span>
                bounds<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">(),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">))</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">character_index_for_point</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">point</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
        <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> line_point = <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_bounds</span>?<span class="punctuation">.</span><span class="property">localize</span><span class="punctuation">(</span><span class="operator">&amp;</span>point<span class="punctuation">)</span>?<span class="punctuation">;</span>
        <span class="keyword">let</span> last_layout = <span class="variable">self</span><span class="punctuation">.</span><span class="property">last_layout</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span>?<span class="punctuation">;</span>

        <span class="macro">assert_eq!</span><span class="punctuation">(</span>last_layout<span class="punctuation">.</span><span class="property">text</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">content</span><span class="punctuation">);</span>
        <span class="keyword">let</span> utf8_index = last_layout<span class="punctuation">.</span><span class="property">index_for_x</span><span class="punctuation">(</span>point<span class="punctuation">.</span><span class="property">x</span> - line_point<span class="punctuation">.</span><span class="property">x</span><span class="punctuation">)</span>?<span class="punctuation">;</span>
        <span class="constructor">Some</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">offset_to_utf16</span><span class="punctuation">(</span>utf8_index<span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">TextElement</span> <span class="punctuation">{</span>
    <span class="property">input</span><span class="punctuation">:</span> <span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">TextInput</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">PrepaintState</span> <span class="punctuation">{</span>
    <span class="property">line</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">ShapedLine</span><span class="punctuation">&gt;,</span>
    <span class="property">cursor</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">PaintQuad</span><span class="punctuation">&gt;,</span>
    <span class="property">selection</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">PaintQuad</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="keyword">for</span> <span class="type">TextElement</span> <span class="punctuation">{</span>
    <span class="keyword">type</span> <span class="type">Element</span> = <span class="type">Self</span><span class="punctuation">;</span>

    <span class="keyword">fn</span> <span class="function">into_element</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">Element</span> <span class="punctuation">{</span>
        <span class="variable">self</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Element</span> <span class="keyword">for</span> <span class="type">TextElement</span> <span class="punctuation">{</span>
    <span class="keyword">type</span> <span class="type">RequestLayoutState</span> = <span class="punctuation">();</span>
    <span class="keyword">type</span> <span class="type">PrepaintState</span> = <span class="type">PrepaintState</span><span class="punctuation">;</span>

    <span class="keyword">fn</span> <span class="function">id</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">ElementId</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="constructor">None</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">source_location</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;&#39;</span><span class="label">static</span> core<span class="punctuation">::</span>panic<span class="punctuation">::</span><span class="type">Location</span><span class="punctuation">&lt;</span><span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="constructor">None</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">request_layout</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span><span class="type">GlobalElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">_inspector_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span>gpui<span class="punctuation">::</span><span class="type">InspectorElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">,</span>
    <span class="punctuation">)</span> -&gt; <span class="punctuation">(</span><span class="type">LayoutId</span><span class="punctuation">,</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">RequestLayoutState</span><span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> style = <span class="constructor">Style</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">();</span>
        style<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">width</span> = <span class="function">relative</span><span class="punctuation">(</span><span class="constant">1.</span><span class="punctuation">).</span><span class="property">into</span><span class="punctuation">();</span>
        style<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span> = window<span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">();</span>
        <span class="punctuation">(</span>window<span class="punctuation">.</span><span class="property">request_layout</span><span class="punctuation">(</span>style<span class="punctuation">,</span> <span class="punctuation">[],</span> cx<span class="punctuation">),</span> <span class="punctuation">())</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">prepaint</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span><span class="type">GlobalElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">_inspector_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span>gpui<span class="punctuation">::</span><span class="type">InspectorElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">bounds</span><span class="punctuation">:</span> <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
        <span class="variable">_request_layout</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">RequestLayoutState</span><span class="punctuation">,</span>
        <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">,</span>
    <span class="punctuation">)</span> -&gt; <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">PrepaintState</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> input = <span class="variable">self</span><span class="punctuation">.</span><span class="property">input</span><span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">);</span>
        <span class="keyword">let</span> content = input<span class="punctuation">.</span><span class="property">content</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="keyword">let</span> selected_range = input<span class="punctuation">.</span><span class="property">selected_range</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        <span class="keyword">let</span> cursor = input<span class="punctuation">.</span><span class="property">cursor_offset</span><span class="punctuation">();</span>
        <span class="keyword">let</span> style = window<span class="punctuation">.</span><span class="property">text_style</span><span class="punctuation">();</span>

        <span class="keyword">let</span> <span class="punctuation">(</span>display_text<span class="punctuation">,</span> text_color<span class="punctuation">)</span> = <span class="keyword">if</span> content<span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="punctuation">(</span>input<span class="punctuation">.</span><span class="property">placeholder</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">(),</span> <span class="function">hsla</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">,</span> <span class="constant">0.</span><span class="punctuation">,</span> <span class="constant">0.</span><span class="punctuation">,</span> <span class="constant">0.2</span><span class="punctuation">))</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="punctuation">(</span>content<span class="punctuation">,</span> style<span class="punctuation">.</span><span class="property">color</span><span class="punctuation">)</span>
        <span class="punctuation">};</span>

        <span class="keyword">let</span> run = <span class="type">TextRun</span> <span class="punctuation">{</span>
            <span class="property">len</span><span class="punctuation">:</span> display_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span>
            <span class="property">font</span><span class="punctuation">:</span> style<span class="punctuation">.</span><span class="property">font</span><span class="punctuation">(),</span>
            <span class="property">color</span><span class="punctuation">:</span> text_color<span class="punctuation">,</span>
            <span class="property">background_color</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
            <span class="property">underline</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
            <span class="property">strikethrough</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="punctuation">};</span>
        <span class="keyword">let</span> runs = <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>marked_range<span class="punctuation">)</span> = input<span class="punctuation">.</span><span class="property">marked_range</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="macro">vec!</span><span class="punctuation">[</span>
                <span class="type">TextRun</span> <span class="punctuation">{</span>
                    <span class="property">len</span><span class="punctuation">:</span> marked_range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">,</span>
                    ..run<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                <span class="type">TextRun</span> <span class="punctuation">{</span>
                    <span class="property">len</span><span class="punctuation">:</span> marked_range<span class="punctuation">.</span><span class="property">end</span> - marked_range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">,</span>
                    <span class="property">underline</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="type">UnderlineStyle</span> <span class="punctuation">{</span>
                        <span class="property">color</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>run<span class="punctuation">.</span><span class="property">color</span><span class="punctuation">),</span>
                        <span class="property">thickness</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">),</span>
                        <span class="property">wavy</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                    <span class="punctuation">}),</span>
                    ..run<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                <span class="type">TextRun</span> <span class="punctuation">{</span>
                    <span class="property">len</span><span class="punctuation">:</span> display_text<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span> - marked_range<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">,</span>
                    ..run
                <span class="punctuation">},</span>
            <span class="punctuation">]</span>
            <span class="punctuation">.</span><span class="property">into_iter</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">filter</span><span class="punctuation">(</span>|run| run<span class="punctuation">.</span><span class="property">len</span> &gt; <span class="constant">0</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">collect</span><span class="punctuation">()</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="macro">vec!</span><span class="punctuation">[</span>run<span class="punctuation">]</span>
        <span class="punctuation">};</span>

        <span class="keyword">let</span> font_size = style<span class="punctuation">.</span><span class="property">font_size</span><span class="punctuation">.</span><span class="property">to_pixels</span><span class="punctuation">(</span>window<span class="punctuation">.</span><span class="property">rem_size</span><span class="punctuation">());</span>
        <span class="keyword">let</span> line = window
            <span class="punctuation">.</span><span class="property">text_system</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">shape_line</span><span class="punctuation">(</span>display_text<span class="punctuation">,</span> font_size<span class="punctuation">,</span> <span class="operator">&amp;</span>runs<span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">);</span>

        <span class="keyword">let</span> cursor_pos = line<span class="punctuation">.</span><span class="property">x_for_index</span><span class="punctuation">(</span>cursor<span class="punctuation">);</span>
        <span class="keyword">let</span> <span class="punctuation">(</span>selection<span class="punctuation">,</span> cursor<span class="punctuation">)</span> = <span class="keyword">if</span> selected_range<span class="punctuation">.</span><span class="property">is_empty</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            <span class="punctuation">(</span>
                <span class="constructor">None</span><span class="punctuation">,</span>
                <span class="constructor">Some</span><span class="punctuation">(</span><span class="function">fill</span><span class="punctuation">(</span>
                    <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>
                        <span class="function">point</span><span class="punctuation">(</span>bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">()</span> + cursor_pos<span class="punctuation">,</span> bounds<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">()),</span>
                        <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">2.</span><span class="punctuation">),</span> bounds<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">()</span> - bounds<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">()),</span>
                    <span class="punctuation">),</span>
                    gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">(),</span>
                <span class="punctuation">)),</span>
            <span class="punctuation">)</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            <span class="punctuation">(</span>
                <span class="constructor">Some</span><span class="punctuation">(</span><span class="function">fill</span><span class="punctuation">(</span>
                    <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">from_corners</span><span class="punctuation">(</span>
                        <span class="function">point</span><span class="punctuation">(</span>
                            bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">()</span> + line<span class="punctuation">.</span><span class="property">x_for_index</span><span class="punctuation">(</span>selected_range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">),</span>
                            bounds<span class="punctuation">.</span><span class="property">top</span><span class="punctuation">(),</span>
                        <span class="punctuation">),</span>
                        <span class="function">point</span><span class="punctuation">(</span>
                            bounds<span class="punctuation">.</span><span class="property">left</span><span class="punctuation">()</span> + line<span class="punctuation">.</span><span class="property">x_for_index</span><span class="punctuation">(</span>selected_range<span class="punctuation">.</span><span class="property">end</span><span class="punctuation">),</span>
                            bounds<span class="punctuation">.</span><span class="property">bottom</span><span class="punctuation">(),</span>
                        <span class="punctuation">),</span>
                    <span class="punctuation">),</span>
                    <span class="function">rgba</span><span class="punctuation">(</span><span class="constant">0x3311ff30</span><span class="punctuation">),</span>
                <span class="punctuation">)),</span>
                <span class="constructor">None</span><span class="punctuation">,</span>
            <span class="punctuation">)</span>
        <span class="punctuation">};</span>
        <span class="type">PrepaintState</span> <span class="punctuation">{</span>
            <span class="property">line</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span>line<span class="punctuation">),</span>
            cursor<span class="punctuation">,</span>
            selection<span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">paint</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span><span class="type">GlobalElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">_inspector_id</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="operator">&amp;</span>gpui<span class="punctuation">::</span><span class="type">InspectorElementId</span><span class="punctuation">&gt;,</span>
        <span class="variable">bounds</span><span class="punctuation">:</span> <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;,</span>
        <span class="variable">_request_layout</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">RequestLayoutState</span><span class="punctuation">,</span>
        <span class="variable">prepaint</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">PrepaintState</span><span class="punctuation">,</span>
        <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">,</span>
    <span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> focus_handle = <span class="variable">self</span><span class="punctuation">.</span><span class="property">input</span><span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">).</span><span class="property">focus_handle</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
        window<span class="punctuation">.</span><span class="property">handle_input</span><span class="punctuation">(</span>
            <span class="operator">&amp;</span>focus_handle<span class="punctuation">,</span>
            <span class="constructor">ElementInputHandler</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>bounds<span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">input</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()),</span>
            cx<span class="punctuation">,</span>
        <span class="punctuation">);</span>
        <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>selection<span class="punctuation">)</span> = prepaint<span class="punctuation">.</span><span class="property">selection</span><span class="punctuation">.</span><span class="property">take</span><span class="punctuation">()</span> <span class="punctuation">{</span>
            window<span class="punctuation">.</span><span class="property">paint_quad</span><span class="punctuation">(</span>selection<span class="punctuation">)</span>
        <span class="punctuation">}</span>
        <span class="keyword">let</span> line = prepaint<span class="punctuation">.</span><span class="property">line</span><span class="punctuation">.</span><span class="property">take</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
        line<span class="punctuation">.</span><span class="property">paint</span><span class="punctuation">(</span>bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">,</span> window<span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(),</span> window<span class="punctuation">,</span> cx<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        <span class="keyword">if</span> focus_handle<span class="punctuation">.</span><span class="property">is_focused</span><span class="punctuation">(</span>window<span class="punctuation">)</span>
            &amp;&amp; <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>cursor<span class="punctuation">)</span> = prepaint<span class="punctuation">.</span><span class="property">cursor</span><span class="punctuation">.</span><span class="property">take</span><span class="punctuation">()</span>
        <span class="punctuation">{</span>
            window<span class="punctuation">.</span><span class="property">paint_quad</span><span class="punctuation">(</span>cursor<span class="punctuation">);</span>
        <span class="punctuation">}</span>

        <span class="variable">self</span><span class="punctuation">.</span><span class="property">input</span><span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |input<span class="punctuation">,</span> _cx| <span class="punctuation">{</span>
            input<span class="punctuation">.</span><span class="property">last_layout</span> = <span class="constructor">Some</span><span class="punctuation">(</span>line<span class="punctuation">);</span>
            input<span class="punctuation">.</span><span class="property">last_bounds</span> = <span class="constructor">Some</span><span class="punctuation">(</span>bounds<span class="punctuation">);</span>
        <span class="punctuation">});</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">TextInput</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">key_context</span><span class="punctuation">(</span><span class="string">&quot;TextInput&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">track_focus</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(</span>cx<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">cursor</span><span class="punctuation">(</span><span class="constructor">CursorStyle</span><span class="punctuation">::</span><span class="constructor">IBeam</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>backspace<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>delete<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>left<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>right<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>select_left<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>select_right<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>select_all<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>home<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>end<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>show_character_palette<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>paste<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>cut<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>copy<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_mouse_down</span><span class="punctuation">(</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span> cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_mouse_down<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_mouse_up</span><span class="punctuation">(</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span> cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_mouse_up<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_mouse_up_out</span><span class="punctuation">(</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span> cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_mouse_up<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">on_mouse_move</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_mouse_move<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xeeeeee</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">text_size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">24.</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">30.</span> + <span class="constant">4.</span> <span class="operator">*</span> <span class="constant">2.</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">p</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">4.</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="type">TextElement</span> <span class="punctuation">{</span> <span class="property">input</span><span class="punctuation">:</span> cx<span class="punctuation">.</span><span class="property">entity</span><span class="punctuation">()</span> <span class="punctuation">}),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Focusable</span> <span class="keyword">for</span> <span class="type">TextInput</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">focus_handle</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="type">FocusHandle</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">InputExample</span> <span class="punctuation">{</span>
    <span class="property">text_input</span><span class="punctuation">:</span> <span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">TextInput</span><span class="punctuation">&gt;,</span>
    <span class="property">recent_keystrokes</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">Keystroke</span><span class="punctuation">&gt;,</span>
    <span class="property">focus_handle</span><span class="punctuation">:</span> <span class="type">FocusHandle</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Focusable</span> <span class="keyword">for</span> <span class="type">InputExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">focus_handle</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="type">FocusHandle</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">InputExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">on_reset_click</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseUpEvent</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">recent_keystrokes</span><span class="punctuation">.</span><span class="property">clear</span><span class="punctuation">();</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">text_input</span>
            <span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |text_input<span class="punctuation">,</span> _cx| text_input<span class="punctuation">.</span><span class="property">reset</span><span class="punctuation">());</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">InputExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xaaaaaa</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">track_focus</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(</span>cx<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">border_b_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_between</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;Keyboard {}&quot;</span><span class="punctuation">,</span> cx<span class="punctuation">.</span><span class="property">keyboard_layout</span><span class="punctuation">().</span><span class="property">name</span><span class="punctuation">()))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">black</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">px_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">yellow</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Reset&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|style| <span class="punctuation">{</span>
                                style
                                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">yellow</span><span class="punctuation">().</span><span class="property">blend</span><span class="punctuation">(</span><span class="function">opaque_grey</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">,</span> <span class="constant">0.5</span><span class="punctuation">)))</span>
                                    <span class="punctuation">.</span><span class="property">cursor_pointer</span><span class="punctuation">()</span>
                            <span class="punctuation">})</span>
                            <span class="punctuation">.</span><span class="property">on_mouse_up</span><span class="punctuation">(</span><span class="constructor">MouseButton</span><span class="punctuation">::</span><span class="constructor">Left</span><span class="punctuation">,</span> cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_reset_click<span class="punctuation">)),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">text_input</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">recent_keystrokes</span><span class="punctuation">.</span><span class="property">iter</span><span class="punctuation">().</span><span class="property">rev</span><span class="punctuation">().</span><span class="property">map</span><span class="punctuation">(</span>|ks| <span class="punctuation">{</span>
                <span class="macro">format!</span><span class="punctuation">(</span>
                    <span class="string">&quot;{:} {}&quot;</span><span class="punctuation">,</span>
                    ks<span class="punctuation">.</span><span class="property">unparse</span><span class="punctuation">(),</span>
                    <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>key_char<span class="punctuation">)</span> = ks<span class="punctuation">.</span><span class="property">key_char</span><span class="punctuation">.</span><span class="property">as_ref</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                        <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;-&gt; {:?}&quot;</span><span class="punctuation">,</span> key_char<span class="punctuation">)</span>
                    <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                        <span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">to_owned</span><span class="punctuation">()</span>
                    <span class="punctuation">}</span>
                <span class="punctuation">)</span>
            <span class="punctuation">}))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;backspace&quot;</span><span class="punctuation">,</span> <span class="constructor">Backspace</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;delete&quot;</span><span class="punctuation">,</span> <span class="constructor">Delete</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;left&quot;</span><span class="punctuation">,</span> <span class="constructor">Left</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;right&quot;</span><span class="punctuation">,</span> <span class="constructor">Right</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;shift-left&quot;</span><span class="punctuation">,</span> <span class="constructor">SelectLeft</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;shift-right&quot;</span><span class="punctuation">,</span> <span class="constructor">SelectRight</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-a&quot;</span><span class="punctuation">,</span> <span class="constructor">SelectAll</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-v&quot;</span><span class="punctuation">,</span> <span class="constructor">Paste</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-c&quot;</span><span class="punctuation">,</span> <span class="constructor">Copy</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-x&quot;</span><span class="punctuation">,</span> <span class="constructor">Cut</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;home&quot;</span><span class="punctuation">,</span> <span class="constructor">Home</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;end&quot;</span><span class="punctuation">,</span> <span class="constructor">End</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
            <span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;ctrl-cmd-space&quot;</span><span class="punctuation">,</span> <span class="constructor">ShowCharacterPalette</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">),</span>
        <span class="punctuation">]);</span>

        <span class="keyword">let</span> window = cx
            <span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                    <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                    <span class="keyword">let</span> text_input = cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="type">TextInput</span> <span class="punctuation">{</span>
                        <span class="property">focus_handle</span><span class="punctuation">:</span> cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(),</span>
                        <span class="property">content</span><span class="punctuation">:</span> <span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                        <span class="property">placeholder</span><span class="punctuation">:</span> <span class="string">&quot;Type here...&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                        <span class="property">selected_range</span><span class="punctuation">:</span> <span class="constant">0</span>..<span class="constant">0</span><span class="punctuation">,</span>
                        <span class="property">selection_reversed</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="property">marked_range</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                        <span class="property">last_layout</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                        <span class="property">last_bounds</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
                        <span class="property">is_selecting</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                    <span class="punctuation">});</span>
                    cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="type">InputExample</span> <span class="punctuation">{</span>
                        text_input<span class="punctuation">,</span>
                        <span class="property">recent_keystrokes</span><span class="punctuation">:</span> <span class="macro">vec!</span><span class="punctuation">[],</span>
                        <span class="property">focus_handle</span><span class="punctuation">:</span> cx<span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(),</span>
                    <span class="punctuation">})</span>
                <span class="punctuation">},</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="keyword">let</span> view = window<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">entity</span><span class="punctuation">()).</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">observe_keystrokes</span><span class="punctuation">(</span><span class="keyword">move</span> |ev<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
            view<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |view<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                view<span class="punctuation">.</span><span class="property">recent_keystrokes</span><span class="punctuation">.</span><span class="property">push</span><span class="punctuation">(</span>ev<span class="punctuation">.</span><span class="property">keystroke</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">());</span>
                cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
            <span class="punctuation">})</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">on_keyboard_layout_change</span><span class="punctuation">({</span>
            <span class="keyword">move</span> |cx| <span class="punctuation">{</span>
                window<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">()).</span><span class="property">ok</span><span class="punctuation">();</span>
            <span class="punctuation">}</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

        window
            <span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |view<span class="punctuation">,</span> window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                window<span class="punctuation">.</span><span class="property">focus</span><span class="punctuation">(</span><span class="operator">&amp;</span>view<span class="punctuation">.</span><span class="property">text_input</span><span class="punctuation">.</span><span class="property">focus_handle</span><span class="punctuation">(</span>cx<span class="punctuation">));</span>
                cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>|_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Quit</span><span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">());</span>
        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span><span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-q&quot;</span><span class="punctuation">,</span> <span class="constructor">Quit</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">)]);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
