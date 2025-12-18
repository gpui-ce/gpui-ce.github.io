+++
title = "Text"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example text"
source_file = "crates/gpui/examples/text.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::{</span>
    ops<span class="punctuation">::{</span><span class="constructor">Deref</span><span class="punctuation">,</span> <span class="constructor">DerefMut</span><span class="punctuation">},</span>
    sync<span class="punctuation">::</span><span class="constructor">Arc</span><span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">AbsoluteLength</span><span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">DefiniteLength</span><span class="punctuation">,</span> <span class="constructor">ElementId</span><span class="punctuation">,</span> <span class="constructor">Global</span><span class="punctuation">,</span> <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">Menu</span><span class="punctuation">,</span>
    <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">TextStyle</span><span class="punctuation">,</span> <span class="constructor">TitlebarOptions</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> bounds<span class="punctuation">,</span>
    colors<span class="punctuation">::</span><span class="constructor">DefaultColors</span><span class="punctuation">,</span> div<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> relative<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>
<span class="keyword">use</span> std<span class="punctuation">::</span>iter<span class="punctuation">;</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Debug</span><span class="punctuation">)]</span>
<span class="keyword">pub</span> <span class="keyword">struct</span> <span class="type">TextContext</span> <span class="punctuation">{</span>
    <span class="property">font_size</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
    <span class="property">line_height</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
    <span class="property">type_scale</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Default</span> <span class="keyword">for</span> <span class="type">TextContext</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">default</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">TextContext</span> <span class="punctuation">{</span>
            <span class="property">font_size</span><span class="punctuation">:</span> <span class="constant">16.0</span><span class="punctuation">,</span>
            <span class="property">line_height</span><span class="punctuation">:</span> <span class="constant">1.3</span><span class="punctuation">,</span>
            <span class="property">type_scale</span><span class="punctuation">:</span> <span class="constant">1.33</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">TextContext</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">get_global</span><span class="punctuation">(</span><span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="operator">&amp;</span><span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">TextContext</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="operator">&amp;</span>cx<span class="punctuation">.</span><span class="property">global</span><span class="punctuation">::&lt;</span><span class="type">GlobalTextContext</span><span class="punctuation">&gt;().</span><span class="constant">0</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Debug</span><span class="punctuation">)]</span>
<span class="keyword">pub</span> <span class="keyword">struct</span> <span class="type">GlobalTextContext</span><span class="punctuation">(</span><span class="keyword">pub</span> <span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">TextContext</span><span class="punctuation">&gt;);</span>

<span class="keyword">impl</span> <span class="type">Deref</span> <span class="keyword">for</span> <span class="type">GlobalTextContext</span> <span class="punctuation">{</span>
    <span class="keyword">type</span> <span class="type">Target</span> = <span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">TextContext</span><span class="punctuation">&gt;;</span>

    <span class="keyword">fn</span> <span class="function">deref</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="operator">&amp;</span><span class="constructor">Self</span><span class="punctuation">::</span><span class="type">Target</span> <span class="punctuation">{</span>
        <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="constant">0</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">DerefMut</span> <span class="keyword">for</span> <span class="type">GlobalTextContext</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">deref_mut</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">Target</span> <span class="punctuation">{</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">.</span><span class="constant">0</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Global</span> <span class="keyword">for</span> <span class="type">GlobalTextContext</span> <span class="punctuation">{}</span>

<span class="keyword">pub</span> <span class="keyword">trait</span> <span class="type">ActiveTextContext</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">text_context</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="operator">&amp;</span><span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">TextContext</span><span class="punctuation">&gt;;</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">ActiveTextContext</span> <span class="keyword">for</span> <span class="type">App</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">text_context</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="operator">&amp;</span><span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">TextContext</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">global</span><span class="punctuation">::&lt;</span><span class="type">GlobalTextContext</span><span class="punctuation">&gt;().</span><span class="constant">0</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">PartialEq</span><span class="punctuation">)]</span>
<span class="keyword">pub</span> <span class="keyword">struct</span> <span class="type">SpecimenTheme</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="property">bg</span><span class="punctuation">:</span> <span class="type">Hsla</span><span class="punctuation">,</span>
    <span class="keyword">pub</span> <span class="property">fg</span><span class="punctuation">:</span> <span class="type">Hsla</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Default</span> <span class="keyword">for</span> <span class="type">SpecimenTheme</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">default</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">bg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">(),</span>
            <span class="property">fg</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">(),</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">SpecimenTheme</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">invert</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">bg</span><span class="punctuation">:</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">fg</span><span class="punctuation">,</span>
            <span class="property">fg</span><span class="punctuation">:</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Debug</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">PartialEq</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">IntoElement</span><span class="punctuation">)]</span>
<span class="keyword">struct</span> <span class="type">Specimen</span> <span class="punctuation">{</span>
    <span class="property">id</span><span class="punctuation">:</span> <span class="type">ElementId</span><span class="punctuation">,</span>
    <span class="property">scale</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
    <span class="property">text_style</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">TextStyle</span><span class="punctuation">&gt;,</span>
    <span class="property">string</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">invert</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Specimen</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">id</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> string = <span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">new_static</span><span class="punctuation">(</span><span class="string">&quot;The quick brown fox jumps over the lazy dog&quot;</span><span class="punctuation">);</span>
        <span class="keyword">let</span> id_string = <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;specimen-{}&quot;</span><span class="punctuation">,</span> id<span class="punctuation">);</span>
        <span class="keyword">let</span> id = <span class="constructor">ElementId</span><span class="punctuation">::</span><span class="constructor">Name</span><span class="punctuation">(</span>id_string<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">());</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            id<span class="punctuation">,</span>
            <span class="property">scale</span><span class="punctuation">:</span> <span class="constant">1.0</span><span class="punctuation">,</span>
            <span class="property">text_style</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
            string<span class="punctuation">,</span>
            <span class="property">invert</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">invert</span><span class="punctuation">(</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">invert</span> = !<span class="variable">self</span><span class="punctuation">.</span><span class="property">invert</span><span class="punctuation">;</span>
        <span class="variable">self</span>
    <span class="punctuation">}</span>

    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">scale</span><span class="punctuation">(</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">scale</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">scale</span> = scale<span class="punctuation">;</span>
        <span class="variable">self</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">RenderOnce</span> <span class="keyword">for</span> <span class="type">Specimen</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> rem_size = window<span class="punctuation">.</span><span class="property">rem_size</span><span class="punctuation">();</span>
        <span class="keyword">let</span> scale = <span class="variable">self</span><span class="punctuation">.</span><span class="property">scale</span><span class="punctuation">;</span>
        <span class="keyword">let</span> global_style = cx<span class="punctuation">.</span><span class="property">text_context</span><span class="punctuation">();</span>

        <span class="keyword">let</span> style_override = <span class="variable">self</span><span class="punctuation">.</span><span class="property">text_style</span><span class="punctuation">;</span>

        <span class="keyword">let</span> <span class="keyword">mut</span> font_size = global_style<span class="punctuation">.</span><span class="property">font_size</span><span class="punctuation">;</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> line_height = global_style<span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">;</span>

        <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>style_override<span class="punctuation">)</span> = style_override <span class="punctuation">{</span>
            font_size = style_override<span class="punctuation">.</span><span class="property">font_size</span><span class="punctuation">.</span><span class="property">to_pixels</span><span class="punctuation">(</span>rem_size<span class="punctuation">).</span><span class="property">into</span><span class="punctuation">();</span>
            line_height = <span class="keyword">match</span> style_override<span class="punctuation">.</span><span class="property">line_height</span> <span class="punctuation">{</span>
                <span class="constructor">DefiniteLength</span><span class="punctuation">::</span><span class="constructor">Absolute</span><span class="punctuation">(</span>absolute_len<span class="punctuation">)</span> =&gt; <span class="keyword">match</span> absolute_len <span class="punctuation">{</span>
                    <span class="constructor">AbsoluteLength</span><span class="punctuation">::</span><span class="constructor">Rems</span><span class="punctuation">(</span>absolute_len<span class="punctuation">)</span> =&gt; absolute_len<span class="punctuation">.</span><span class="property">to_pixels</span><span class="punctuation">(</span>rem_size<span class="punctuation">).</span><span class="property">into</span><span class="punctuation">(),</span>
                    <span class="constructor">AbsoluteLength</span><span class="punctuation">::</span><span class="constructor">Pixels</span><span class="punctuation">(</span>absolute_len<span class="punctuation">)</span> =&gt; absolute_len<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                <span class="punctuation">},</span>
                <span class="constructor">DefiniteLength</span><span class="punctuation">::</span><span class="constructor">Fraction</span><span class="punctuation">(</span>value<span class="punctuation">)</span> =&gt; value<span class="punctuation">,</span>
            <span class="punctuation">};</span>
        <span class="punctuation">}</span>

        <span class="keyword">let</span> <span class="keyword">mut</span> theme = <span class="constructor">SpecimenTheme</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">();</span>

        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">invert</span> <span class="punctuation">{</span>
            theme = theme<span class="punctuation">.</span><span class="property">invert</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">id</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>theme<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>theme<span class="punctuation">.</span><span class="property">fg</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">text_size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span>font_size <span class="operator">*</span> scale<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span>line_height<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">p</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">10.0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">string</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Debug</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">PartialEq</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">IntoElement</span><span class="punctuation">)]</span>
<span class="keyword">struct</span> <span class="type">CharacterGrid</span> <span class="punctuation">{</span>
    <span class="property">scale</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
    <span class="property">invert</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
    <span class="property">text_style</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">TextStyle</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">CharacterGrid</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">scale</span><span class="punctuation">:</span> <span class="constant">1.0</span><span class="punctuation">,</span>
            <span class="property">invert</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
            <span class="property">text_style</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">scale</span><span class="punctuation">(</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">scale</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">scale</span> = scale<span class="punctuation">;</span>
        <span class="variable">self</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">RenderOnce</span> <span class="keyword">for</span> <span class="type">CharacterGrid</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> theme = <span class="constructor">SpecimenTheme</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">();</span>

        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">invert</span> <span class="punctuation">{</span>
            theme = theme<span class="punctuation">.</span><span class="property">invert</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>

        <span class="keyword">let</span> characters = <span class="macro">vec!</span><span class="punctuation">[</span>
            <span class="string">&quot;1&quot;</span><span class="punctuation">,</span> <span class="string">&quot;2&quot;</span><span class="punctuation">,</span> <span class="string">&quot;3&quot;</span><span class="punctuation">,</span> <span class="string">&quot;4&quot;</span><span class="punctuation">,</span> <span class="string">&quot;5&quot;</span><span class="punctuation">,</span> <span class="string">&quot;6&quot;</span><span class="punctuation">,</span> <span class="string">&quot;7&quot;</span><span class="punctuation">,</span> <span class="string">&quot;8&quot;</span><span class="punctuation">,</span> <span class="string">&quot;9&quot;</span><span class="punctuation">,</span> <span class="string">&quot;0&quot;</span><span class="punctuation">,</span> <span class="string">&quot;A&quot;</span><span class="punctuation">,</span> <span class="string">&quot;B&quot;</span><span class="punctuation">,</span> <span class="string">&quot;C&quot;</span><span class="punctuation">,</span> <span class="string">&quot;D&quot;</span><span class="punctuation">,</span> <span class="string">&quot;E&quot;</span><span class="punctuation">,</span> <span class="string">&quot;F&quot;</span><span class="punctuation">,</span> <span class="string">&quot;G&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;H&quot;</span><span class="punctuation">,</span> <span class="string">&quot;I&quot;</span><span class="punctuation">,</span> <span class="string">&quot;J&quot;</span><span class="punctuation">,</span> <span class="string">&quot;K&quot;</span><span class="punctuation">,</span> <span class="string">&quot;L&quot;</span><span class="punctuation">,</span> <span class="string">&quot;M&quot;</span><span class="punctuation">,</span> <span class="string">&quot;N&quot;</span><span class="punctuation">,</span> <span class="string">&quot;P&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Q&quot;</span><span class="punctuation">,</span> <span class="string">&quot;R&quot;</span><span class="punctuation">,</span> <span class="string">&quot;S&quot;</span><span class="punctuation">,</span> <span class="string">&quot;T&quot;</span><span class="punctuation">,</span> <span class="string">&quot;U&quot;</span><span class="punctuation">,</span> <span class="string">&quot;V&quot;</span><span class="punctuation">,</span> <span class="string">&quot;W&quot;</span><span class="punctuation">,</span> <span class="string">&quot;X&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Y&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;Z&quot;</span><span class="punctuation">,</span> <span class="string">&quot;a&quot;</span><span class="punctuation">,</span> <span class="string">&quot;b&quot;</span><span class="punctuation">,</span> <span class="string">&quot;c&quot;</span><span class="punctuation">,</span> <span class="string">&quot;d&quot;</span><span class="punctuation">,</span> <span class="string">&quot;e&quot;</span><span class="punctuation">,</span> <span class="string">&quot;f&quot;</span><span class="punctuation">,</span> <span class="string">&quot;g&quot;</span><span class="punctuation">,</span> <span class="string">&quot;h&quot;</span><span class="punctuation">,</span> <span class="string">&quot;i&quot;</span><span class="punctuation">,</span> <span class="string">&quot;j&quot;</span><span class="punctuation">,</span> <span class="string">&quot;k&quot;</span><span class="punctuation">,</span> <span class="string">&quot;l&quot;</span><span class="punctuation">,</span> <span class="string">&quot;m&quot;</span><span class="punctuation">,</span> <span class="string">&quot;n&quot;</span><span class="punctuation">,</span> <span class="string">&quot;p&quot;</span><span class="punctuation">,</span> <span class="string">&quot;q&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;r&quot;</span><span class="punctuation">,</span> <span class="string">&quot;s&quot;</span><span class="punctuation">,</span> <span class="string">&quot;t&quot;</span><span class="punctuation">,</span> <span class="string">&quot;u&quot;</span><span class="punctuation">,</span> <span class="string">&quot;v&quot;</span><span class="punctuation">,</span> <span class="string">&quot;w&quot;</span><span class="punctuation">,</span> <span class="string">&quot;x&quot;</span><span class="punctuation">,</span> <span class="string">&quot;y&quot;</span><span class="punctuation">,</span> <span class="string">&quot;z&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ẞ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ſ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ß&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ð&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Þ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;þ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;α&quot;</span><span class="punctuation">,</span> <span class="string">&quot;β&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;Γ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;γ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Δ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;δ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;η&quot;</span><span class="punctuation">,</span> <span class="string">&quot;θ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ι&quot;</span><span class="punctuation">,</span> <span class="string">&quot;κ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Λ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;λ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;μ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ν&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ξ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;π&quot;</span><span class="punctuation">,</span> <span class="string">&quot;τ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;υ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;φ&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;χ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ψ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;∂&quot;</span><span class="punctuation">,</span> <span class="string">&quot;а&quot;</span><span class="punctuation">,</span> <span class="string">&quot;в&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Ж&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ж&quot;</span><span class="punctuation">,</span> <span class="string">&quot;З&quot;</span><span class="punctuation">,</span> <span class="string">&quot;з&quot;</span><span class="punctuation">,</span> <span class="string">&quot;К&quot;</span><span class="punctuation">,</span> <span class="string">&quot;к&quot;</span><span class="punctuation">,</span> <span class="string">&quot;л&quot;</span><span class="punctuation">,</span> <span class="string">&quot;м&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Н&quot;</span><span class="punctuation">,</span> <span class="string">&quot;н&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Р&quot;</span><span class="punctuation">,</span> <span class="string">&quot;р&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;У&quot;</span><span class="punctuation">,</span> <span class="string">&quot;у&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ф&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ч&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ь&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ы&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Э&quot;</span><span class="punctuation">,</span> <span class="string">&quot;э&quot;</span><span class="punctuation">,</span> <span class="string">&quot;Я&quot;</span><span class="punctuation">,</span> <span class="string">&quot;я&quot;</span><span class="punctuation">,</span> <span class="string">&quot;ij&quot;</span><span class="punctuation">,</span> <span class="string">&quot;öẋ&quot;</span><span class="punctuation">,</span> <span class="string">&quot;.,&quot;</span><span class="punctuation">,</span> <span class="string">&quot;⣝⣑&quot;</span><span class="punctuation">,</span> <span class="string">&quot;~&quot;</span><span class="punctuation">,</span> <span class="string">&quot;*&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;_&quot;</span><span class="punctuation">,</span> <span class="string">&quot;^&quot;</span><span class="punctuation">,</span> <span class="string">&quot;`&quot;</span><span class="punctuation">,</span> <span class="string">&quot;&#39;&quot;</span><span class="punctuation">,</span> <span class="string">&quot;(&quot;</span><span class="punctuation">,</span> <span class="string">&quot;{&quot;</span><span class="punctuation">,</span> <span class="string">&quot;«&quot;</span><span class="punctuation">,</span> <span class="string">&quot;#&quot;</span><span class="punctuation">,</span> <span class="string">&quot;&amp;&quot;</span><span class="punctuation">,</span> <span class="string">&quot;@&quot;</span><span class="punctuation">,</span> <span class="string">&quot;$&quot;</span><span class="punctuation">,</span> <span class="string">&quot;¢&quot;</span><span class="punctuation">,</span> <span class="string">&quot;%&quot;</span><span class="punctuation">,</span> <span class="string">&quot;|&quot;</span><span class="punctuation">,</span> <span class="string">&quot;?&quot;</span><span class="punctuation">,</span> <span class="string">&quot;¶&quot;</span><span class="punctuation">,</span> <span class="string">&quot;µ&quot;</span><span class="punctuation">,</span>
            <span class="string">&quot;❮&quot;</span><span class="punctuation">,</span> <span class="string">&quot;&lt;=&quot;</span><span class="punctuation">,</span> <span class="string">&quot;!=&quot;</span><span class="punctuation">,</span> <span class="string">&quot;==&quot;</span><span class="punctuation">,</span> <span class="string">&quot;--&quot;</span><span class="punctuation">,</span> <span class="string">&quot;++&quot;</span><span class="punctuation">,</span> <span class="string">&quot;=&gt;&quot;</span><span class="punctuation">,</span> <span class="string">&quot;-&gt;&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🏀&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎊&quot;</span><span class="punctuation">,</span> <span class="string">&quot;😍&quot;</span><span class="punctuation">,</span> <span class="string">&quot;❤️&quot;</span><span class="punctuation">,</span> <span class="string">&quot;👍&quot;</span><span class="punctuation">,</span> <span class="string">&quot;👎&quot;</span><span class="punctuation">,</span>
        <span class="punctuation">];</span>

        <span class="keyword">let</span> columns = <span class="constant">11</span><span class="punctuation">;</span>
        <span class="keyword">let</span> rows = characters<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">().</span><span class="property">div_ceil</span><span class="punctuation">(</span>columns<span class="punctuation">);</span>

        <span class="keyword">let</span> grid_rows = <span class="punctuation">(</span><span class="constant">0</span>..rows<span class="punctuation">).</span><span class="property">map</span><span class="punctuation">(</span>|row_idx| <span class="punctuation">{</span>
            <span class="keyword">let</span> start_idx = row_idx <span class="operator">*</span> columns<span class="punctuation">;</span>
            <span class="keyword">let</span> end_idx = <span class="punctuation">(</span>start_idx + columns<span class="punctuation">).</span><span class="property">min</span><span class="punctuation">(</span>characters<span class="punctuation">.</span><span class="property">len</span><span class="punctuation">());</span>

            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">((</span>start_idx..end_idx<span class="punctuation">).</span><span class="property">map</span><span class="punctuation">(</span>|i| <span class="punctuation">{</span>
                    <span class="function">div</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">62.</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>theme<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>theme<span class="punctuation">.</span><span class="property">fg</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">text_size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">24.0</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">line_height</span><span class="punctuation">(</span><span class="function">relative</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">))</span>
                        <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>characters<span class="punctuation">[</span>i<span class="punctuation">])</span>
                <span class="punctuation">}))</span>
                <span class="punctuation">.</span><span class="property">when</span><span class="punctuation">(</span>end_idx - start_idx &lt; columns<span class="punctuation">,</span> |d| <span class="punctuation">{</span>
                    d<span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>
                        iter<span class="punctuation">::</span><span class="function">repeat_with</span><span class="punctuation">(</span>|| <span class="function">div</span><span class="punctuation">().</span><span class="property">flex_1</span><span class="punctuation">()).</span><span class="property">take</span><span class="punctuation">(</span>columns - <span class="punctuation">(</span>end_idx - start_idx<span class="punctuation">)),</span>
                    <span class="punctuation">)</span>
                <span class="punctuation">})</span>
        <span class="punctuation">});</span>

        <span class="function">div</span><span class="punctuation">().</span><span class="property">p_4</span><span class="punctuation">().</span><span class="property">gap_2</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">flex_col</span><span class="punctuation">().</span><span class="property">children</span><span class="punctuation">(</span>grid_rows<span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">TextExample</span> <span class="punctuation">{</span>
    <span class="property">next_id</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">TextExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">next_id</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">usize</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span> += <span class="constant">1</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">TextExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> tcx = cx<span class="punctuation">.</span><span class="property">text_context</span><span class="punctuation">();</span>
        <span class="keyword">let</span> colors = cx<span class="punctuation">.</span><span class="property">default_colors</span><span class="punctuation">().</span><span class="property">clone</span><span class="punctuation">();</span>

        <span class="keyword">let</span> type_scale = tcx<span class="punctuation">.</span><span class="property">type_scale</span><span class="punctuation">;</span>

        <span class="keyword">let</span> step_down_2 = <span class="constant">1.0</span> / <span class="punctuation">(</span>type_scale <span class="operator">*</span> type_scale<span class="punctuation">);</span>
        <span class="keyword">let</span> step_down_1 = <span class="constant">1.0</span> / type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> base = <span class="constant">1.0</span><span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_1 = base <span class="operator">*</span> type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_2 = step_up_1 <span class="operator">*</span> type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_3 = step_up_2 <span class="operator">*</span> type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_4 = step_up_3 <span class="operator">*</span> type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_5 = step_up_4 <span class="operator">*</span> type_scale<span class="punctuation">;</span>
        <span class="keyword">let</span> step_up_6 = step_up_5 <span class="operator">*</span> type_scale<span class="punctuation">;</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;text-example&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">overflow_y_scroll</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_x_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">CharacterGrid</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">scale</span><span class="punctuation">(</span>base<span class="punctuation">)))</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_down_2<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_down_2<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_down_1<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_down_1<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>base<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>base<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_1<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_1<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_2<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_2<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_3<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_3<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_4<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_4<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_5<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_5<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_6<span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="constructor">Specimen</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">next_id</span><span class="punctuation">()).</span><span class="property">scale</span><span class="punctuation">(</span>step_up_6<span class="punctuation">).</span><span class="property">invert</span><span class="punctuation">()),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">240.</span><span class="punctuation">)).</span><span class="property">h_full</span><span class="punctuation">().</span><span class="property">bg</span><span class="punctuation">(</span>colors<span class="punctuation">.</span><span class="property">container</span><span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">set_menus</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span><span class="type">Menu</span> <span class="punctuation">{</span>
            <span class="property">name</span><span class="punctuation">:</span> <span class="string">&quot;GPUI Typography&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="property">items</span><span class="punctuation">:</span> <span class="macro">vec!</span><span class="punctuation">[],</span>
        <span class="punctuation">}]);</span>

        cx<span class="punctuation">.</span><span class="property">init_colors</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">set_global</span><span class="punctuation">(</span><span class="constructor">GlobalTextContext</span><span class="punctuation">(</span><span class="constructor">Arc</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">TextContext</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">())));</span>

        <span class="keyword">let</span> window = cx
            <span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                    <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="type">TitlebarOptions</span> <span class="punctuation">{</span>
                        <span class="property">title</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="string">&quot;GPUI Typography&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()),</span>
                        ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                    <span class="punctuation">}),</span>
                    <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="function">bounds</span><span class="punctuation">(</span>
                        <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">)),</span>
                        <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">920.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">720.</span><span class="punctuation">)),</span>
                    <span class="punctuation">))),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                |_window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_cx| <span class="type">TextExample</span> <span class="punctuation">{</span> <span class="property">next_id</span><span class="punctuation">:</span> <span class="constant">0</span> <span class="punctuation">}),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        window
            <span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |_view<span class="punctuation">,</span> _window<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
