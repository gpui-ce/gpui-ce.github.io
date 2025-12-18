+++
title = "Opacity"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example opacity"
source_file = "crates/gpui/examples/opacity.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::{</span>fs<span class="punctuation">,</span> path<span class="punctuation">::</span><span class="constructor">PathBuf</span><span class="punctuation">};</span>

<span class="keyword">use</span> anyhow<span class="punctuation">::</span><span class="constructor">Result</span><span class="punctuation">;</span>
<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">AssetSource</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">BoxShadow</span><span class="punctuation">,</span> <span class="constructor">ClickEvent</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Task</span><span class="punctuation">,</span>
    <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> div<span class="punctuation">,</span> hsla<span class="punctuation">,</span> img<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> svg<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Assets</span> <span class="punctuation">{</span>
    <span class="property">base</span><span class="punctuation">:</span> <span class="type">PathBuf</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">AssetSource</span> <span class="keyword">for</span> <span class="type">Assets</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">load</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; <span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Option</span><span class="punctuation">&lt;</span>std<span class="punctuation">::</span>borrow<span class="punctuation">::</span><span class="type">Cow</span><span class="punctuation">&lt;</span><span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">,</span> <span class="punctuation">[</span><span class="type">u8</span><span class="punctuation">]&gt;&gt;&gt;</span> <span class="punctuation">{</span>
        fs<span class="punctuation">::</span><span class="function">read</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">base</span><span class="punctuation">.</span><span class="property">join</span><span class="punctuation">(</span>path<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|data| <span class="constructor">Some</span><span class="punctuation">(</span>std<span class="punctuation">::</span>borrow<span class="punctuation">::</span><span class="constructor">Cow</span><span class="punctuation">::</span><span class="constructor">Owned</span><span class="punctuation">(</span>data<span class="punctuation">)))</span>
            <span class="punctuation">.</span><span class="property">map_err</span><span class="punctuation">(</span>|e| e<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">())</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">list</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; <span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">SharedString</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        fs<span class="punctuation">::</span><span class="function">read_dir</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">base</span><span class="punctuation">.</span><span class="property">join</span><span class="punctuation">(</span>path<span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|entries| <span class="punctuation">{</span>
                entries
                    <span class="punctuation">.</span><span class="property">filter_map</span><span class="punctuation">(</span>|entry| <span class="punctuation">{</span>
                        entry
                            <span class="punctuation">.</span><span class="property">ok</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">and_then</span><span class="punctuation">(</span>|entry| entry<span class="punctuation">.</span><span class="property">file_name</span><span class="punctuation">().</span><span class="property">into_string</span><span class="punctuation">().</span><span class="property">ok</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span><span class="constructor">SharedString</span><span class="punctuation">::</span>from<span class="punctuation">)</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">collect</span><span class="punctuation">()</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">map_err</span><span class="punctuation">(</span>|e| e<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">())</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="property">_task</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Task</span><span class="punctuation">&lt;()&gt;&gt;,</span>
    <span class="property">opacity</span><span class="punctuation">:</span> <span class="type">f32</span><span class="punctuation">,</span>
    <span class="property">animating</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">_task</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
            <span class="property">opacity</span><span class="punctuation">:</span> <span class="constant">0.5</span><span class="punctuation">,</span>
            <span class="property">animating</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">start_animation</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span> = <span class="constant">0.0</span><span class="punctuation">;</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">animating</span> = <span class="constant">true</span><span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">HelloWorld</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">animating</span> <span class="punctuation">{</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span> += <span class="constant">0.005</span><span class="punctuation">;</span>
            <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span> &gt;= <span class="constant">1.0</span> <span class="punctuation">{</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">animating</span> = <span class="constant">false</span><span class="punctuation">;</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span> = <span class="constant">1.0</span><span class="punctuation">;</span>
            <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                window<span class="punctuation">.</span><span class="property">request_animation_frame</span><span class="punctuation">();</span>
            <span class="punctuation">}</span>
        <span class="punctuation">}</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xe0e0e0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;This is background text.&quot;</span><span class="punctuation">)),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;panel&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>start_animation<span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">absolute</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">top_8</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">left_8</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">right_8</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">bottom_8</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">border_3</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">yellow</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">blue</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_3</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">shadow</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span><span class="type">BoxShadow</span> <span class="punctuation">{</span>
                                <span class="property">color</span><span class="punctuation">:</span> <span class="function">hsla</span><span class="punctuation">(</span><span class="constant">0.0</span><span class="punctuation">,</span> <span class="constant">0.0</span><span class="punctuation">,</span> <span class="constant">0.0</span><span class="punctuation">,</span> <span class="constant">0.5</span><span class="punctuation">),</span>
                                <span class="property">blur_radius</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">1.0</span><span class="punctuation">),</span>
                                <span class="property">spread_radius</span><span class="punctuation">:</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">5.0</span><span class="punctuation">),</span>
                                <span class="property">offset</span><span class="punctuation">:</span> <span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">10.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">10.0</span><span class="punctuation">)),</span>
                            <span class="punctuation">}])</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">img</span><span class="punctuation">(</span><span class="string">&quot;image/app-icon.png&quot;</span><span class="punctuation">).</span><span class="property">size_8</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Opacity Panel (Click to test)&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;deep-level-text&quot;</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">text_decoration_2</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_decoration_wavy</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">text_decoration_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;opacity: {:.1}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">)),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">svg</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">path</span><span class="punctuation">(</span><span class="string">&quot;image/arrow_circle.svg&quot;</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">text_2xl</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">size_8</span><span class="punctuation">(),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">([</span><span class="string">&quot;🎊&quot;</span><span class="punctuation">,</span> <span class="string">&quot;✈️&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎉&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎈&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎁&quot;</span><span class="punctuation">,</span> <span class="string">&quot;🎂&quot;</span><span class="punctuation">].</span><span class="property">map</span><span class="punctuation">(</span>|emoji| <span class="punctuation">{</span>
                                        <span class="function">div</span><span class="punctuation">()</span>
                                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>emoji<span class="punctuation">.</span><span class="property">to_string</span><span class="punctuation">())</span>
                                            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|style| style<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">))</span>
                                    <span class="punctuation">})),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">img</span><span class="punctuation">(</span><span class="string">&quot;image/black-cat-typing.gif&quot;</span><span class="punctuation">).</span><span class="property">size_12</span><span class="punctuation">()),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">with_assets</span><span class="punctuation">(</span><span class="type">Assets</span> <span class="punctuation">{</span>
            <span class="property">base</span><span class="punctuation">:</span> <span class="constructor">PathBuf</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="macro">env!</span><span class="punctuation">(</span><span class="string">&quot;CARGO_MANIFEST_DIR&quot;</span><span class="punctuation">)).</span><span class="property">join</span><span class="punctuation">(</span><span class="string">&quot;examples&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
            <span class="keyword">let</span> bounds = <span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span><span class="constructor">None</span><span class="punctuation">,</span> <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">500.0</span><span class="punctuation">)),</span> cx<span class="punctuation">);</span>
            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
                <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                    <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span>bounds<span class="punctuation">)),</span>
                    ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
                <span class="punctuation">},</span>
                |window<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">HelloWorld</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">)),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
            cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
        <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
