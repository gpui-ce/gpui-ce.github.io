+++
title = "Image Loading"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example image_loading"
source_file = "crates/gpui/examples/image_loading.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::{</span>path<span class="punctuation">::</span><span class="constructor">Path</span><span class="punctuation">,</span> sync<span class="punctuation">::</span><span class="constructor">Arc</span><span class="punctuation">,</span> time<span class="punctuation">::</span><span class="constructor">Duration</span><span class="punctuation">};</span>

<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">Animation</span><span class="punctuation">,</span> <span class="constructor">AnimationExt</span><span class="punctuation">,</span> <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Asset</span><span class="punctuation">,</span> <span class="constructor">AssetLogger</span><span class="punctuation">,</span> <span class="constructor">AssetSource</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span>
    <span class="constructor">Hsla</span><span class="punctuation">,</span> <span class="constructor">ImageAssetLoader</span><span class="punctuation">,</span> <span class="constructor">ImageCacheError</span><span class="punctuation">,</span> <span class="constructor">ImgResourceLoader</span><span class="punctuation">,</span> <span class="constructor">LOADING_DELAY</span><span class="punctuation">,</span> <span class="constructor">Length</span><span class="punctuation">,</span> <span class="constructor">RenderImage</span><span class="punctuation">,</span>
    <span class="constructor">Resource</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> black<span class="punctuation">,</span> div<span class="punctuation">,</span> img<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span>
    pulsating_between<span class="punctuation">,</span> px<span class="punctuation">,</span> red<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">Assets</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">AssetSource</span> <span class="keyword">for</span> <span class="type">Assets</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">load</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; anyhow<span class="punctuation">::</span><span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Option</span><span class="punctuation">&lt;</span>std<span class="punctuation">::</span>borrow<span class="punctuation">::</span><span class="type">Cow</span><span class="punctuation">&lt;</span><span class="operator">&#39;</span><span class="label">static</span><span class="punctuation">,</span> <span class="punctuation">[</span><span class="type">u8</span><span class="punctuation">]&gt;&gt;&gt;</span> <span class="punctuation">{</span>
        std<span class="punctuation">::</span>fs<span class="punctuation">::</span><span class="function">read</span><span class="punctuation">(</span>path<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span><span class="constructor">Into</span><span class="punctuation">::</span>into<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map_err</span><span class="punctuation">(</span><span class="constructor">Into</span><span class="punctuation">::</span>into<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span><span class="constructor">Some</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">list</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">path</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">)</span> -&gt; anyhow<span class="punctuation">::</span><span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">SharedString</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="constructor">Ok</span><span class="punctuation">(</span>std<span class="punctuation">::</span>fs<span class="punctuation">::</span><span class="function">read_dir</span><span class="punctuation">(</span>path<span class="punctuation">)</span>?
            <span class="punctuation">.</span><span class="property">filter_map</span><span class="punctuation">(</span>|entry| <span class="punctuation">{</span>
                <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span>
                    entry<span class="punctuation">.</span><span class="property">ok</span><span class="punctuation">()</span>?<span class="punctuation">.</span><span class="property">path</span><span class="punctuation">().</span><span class="property">to_string_lossy</span><span class="punctuation">().</span><span class="property">into_owned</span><span class="punctuation">(),</span>
                <span class="punctuation">))</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">collect</span><span class="punctuation">::&lt;</span><span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">_</span><span class="punctuation">&gt;&gt;())</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">const</span> <span class="constructor">IMAGE</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span> = <span class="macro">concat!</span><span class="punctuation">(</span><span class="macro">env!</span><span class="punctuation">(</span><span class="string">&quot;CARGO_MANIFEST_DIR&quot;</span><span class="punctuation">),</span> <span class="string">&quot;/examples/image/app-icon.png&quot;</span><span class="punctuation">);</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">Copy</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Clone</span><span class="punctuation">,</span><span class="attribute"> </span><span class="constructor">Hash</span><span class="punctuation">)]</span>
<span class="keyword">struct</span> <span class="type">LoadImageParameters</span> <span class="punctuation">{</span>
    <span class="property">timeout</span><span class="punctuation">:</span> <span class="type">Duration</span><span class="punctuation">,</span>
    <span class="property">fail</span><span class="punctuation">:</span> <span class="type">bool</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">LoadImageWithParameters</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">Asset</span> <span class="keyword">for</span> <span class="type">LoadImageWithParameters</span> <span class="punctuation">{</span>
    <span class="keyword">type</span> <span class="type">Source</span> = <span class="type">LoadImageParameters</span><span class="punctuation">;</span>

    <span class="keyword">type</span> <span class="type">Output</span> = <span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Arc</span><span class="punctuation">&lt;</span><span class="type">RenderImage</span><span class="punctuation">&gt;,</span> <span class="type">ImageCacheError</span><span class="punctuation">&gt;;</span>

    <span class="keyword">fn</span> <span class="function">load</span><span class="punctuation">(</span>
        <span class="variable">parameters</span><span class="punctuation">:</span> <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">Source</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">,</span>
    <span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> std<span class="punctuation">::</span>future<span class="punctuation">::</span><span class="type">Future</span><span class="punctuation">&lt;</span><span class="type">Output</span> = <span class="constructor">Self</span><span class="punctuation">::</span><span class="type">Output</span><span class="punctuation">&gt;</span> + <span class="type">Send</span> + <span class="operator">&#39;</span><span class="label">static</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> timer = cx<span class="punctuation">.</span><span class="property">background_executor</span><span class="punctuation">().</span><span class="property">timer</span><span class="punctuation">(</span>parameters<span class="punctuation">.</span><span class="property">timeout</span><span class="punctuation">);</span>
        <span class="keyword">let</span> data = <span class="type">AssetLogger</span><span class="punctuation">::&lt;</span><span class="type">ImageAssetLoader</span><span class="punctuation">&gt;::</span><span class="function">load</span><span class="punctuation">(</span>
            <span class="constructor">Resource</span><span class="punctuation">::</span><span class="constructor">Path</span><span class="punctuation">(</span><span class="constructor">Path</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">IMAGE</span><span class="punctuation">).</span><span class="property">to_path_buf</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">()),</span>
            cx<span class="punctuation">,</span>
        <span class="punctuation">);</span>
        <span class="keyword">async</span> <span class="keyword">move</span> <span class="punctuation">{</span>
            timer<span class="punctuation">.</span><span class="keyword">await</span><span class="punctuation">;</span>
            <span class="keyword">if</span> parameters<span class="punctuation">.</span><span class="property">fail</span> <span class="punctuation">{</span>
                log<span class="punctuation">::</span>error!<span class="punctuation">(</span><span class="string">&quot;Intentionally failed to load image&quot;</span><span class="punctuation">);</span>
                <span class="constructor">Err</span><span class="punctuation">(</span>anyhow<span class="punctuation">::</span>anyhow!<span class="punctuation">(</span><span class="string">&quot;Failed to load image&quot;</span><span class="punctuation">).</span><span class="property">into</span><span class="punctuation">())</span>
            <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                data<span class="punctuation">.</span><span class="keyword">await</span>
            <span class="punctuation">}</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">ImageLoadingExample</span> <span class="punctuation">{}</span>

<span class="keyword">impl</span> <span class="type">ImageLoadingExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">loading_element</span><span class="punctuation">()</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">flex_none</span><span class="punctuation">().</span><span class="property">p_0p5</span><span class="punctuation">().</span><span class="property">rounded_xs</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">with_animation</span><span class="punctuation">(</span>
                <span class="string">&quot;loading-bg&quot;</span><span class="punctuation">,</span>
                <span class="constructor">Animation</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">3</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">repeat</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">with_easing</span><span class="punctuation">(</span><span class="function">pulsating_between</span><span class="punctuation">(</span><span class="constant">0.04</span><span class="punctuation">,</span> <span class="constant">0.24</span><span class="punctuation">)),</span>
                <span class="keyword">move</span> |this<span class="punctuation">,</span> delta| this<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">black</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span>delta<span class="punctuation">)),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">fallback_element</span><span class="punctuation">()</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> fallback_color<span class="punctuation">:</span> <span class="type">Hsla</span> = <span class="function">black</span><span class="punctuation">().</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">);</span>

        <span class="function">div</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">flex_none</span><span class="punctuation">().</span><span class="property">p_0p5</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">rounded_xs</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>fallback_color<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span>fallback_color<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;?&quot;</span><span class="punctuation">),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">ImageLoadingExample</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">flex_col</span><span class="punctuation">().</span><span class="property">size_full</span><span class="punctuation">().</span><span class="property">justify_around</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
            <span class="function">div</span><span class="punctuation">().</span><span class="property">flex</span><span class="punctuation">().</span><span class="property">flex_row</span><span class="punctuation">().</span><span class="property">w_full</span><span class="punctuation">().</span><span class="property">justify_around</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">size</span><span class="punctuation">(</span><span class="constructor">Length</span><span class="punctuation">::</span><span class="constructor">Definite</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.0</span><span class="punctuation">).</span><span class="property">into</span><span class="punctuation">()))</span>
                    <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">({</span>
                        <span class="keyword">let</span> image_source = <span class="type">LoadImageParameters</span> <span class="punctuation">{</span>
                            <span class="property">timeout</span><span class="punctuation">:</span> <span class="constructor">LOADING_DELAY</span><span class="punctuation">.</span><span class="property">saturating_sub</span><span class="punctuation">(</span><span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_millis</span><span class="punctuation">(</span><span class="constant">25</span><span class="punctuation">)),</span>
                            <span class="property">fail</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">};</span>

                        <span class="comment">// Load within the &#39;loading delay&#39;, should not show loading fallback</span>
                        <span class="function">img</span><span class="punctuation">(</span><span class="keyword">move</span> |<span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
                            window<span class="punctuation">.</span><span class="property">use_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">,</span> cx<span class="punctuation">)</span>
                        <span class="punctuation">})</span>
                        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-1&quot;</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">size_12</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">with_fallback</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">fallback_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">red</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">with_loading</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">loading_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                            cx<span class="punctuation">.</span><span class="property">remove_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">);</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">({</span>
                        <span class="comment">// Load after a long delay</span>
                        <span class="keyword">let</span> image_source = <span class="type">LoadImageParameters</span> <span class="punctuation">{</span>
                            <span class="property">timeout</span><span class="punctuation">:</span> <span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">5</span><span class="punctuation">),</span>
                            <span class="property">fail</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                        <span class="punctuation">};</span>

                        <span class="function">img</span><span class="punctuation">(</span><span class="keyword">move</span> |<span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
                            window<span class="punctuation">.</span><span class="property">use_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">,</span> cx<span class="punctuation">)</span>
                        <span class="punctuation">})</span>
                        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-2&quot;</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">with_fallback</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">fallback_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">with_loading</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">loading_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">size_12</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">red</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                            cx<span class="punctuation">.</span><span class="property">remove_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">);</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">({</span>
                        <span class="comment">// Fail to load image after a long delay</span>
                        <span class="keyword">let</span> image_source = <span class="type">LoadImageParameters</span> <span class="punctuation">{</span>
                            <span class="property">timeout</span><span class="punctuation">:</span> <span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span><span class="constant">5</span><span class="punctuation">),</span>
                            <span class="property">fail</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                        <span class="punctuation">};</span>

                        <span class="comment">// Fail to load after a long delay</span>
                        <span class="function">img</span><span class="punctuation">(</span><span class="keyword">move</span> |<span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
                            window<span class="punctuation">.</span><span class="property">use_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">,</span> cx<span class="punctuation">)</span>
                        <span class="punctuation">})</span>
                        <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-3&quot;</span><span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">with_fallback</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">fallback_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">with_loading</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">loading_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">size_12</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                        <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">red</span><span class="punctuation">())</span>
                        <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                            cx<span class="punctuation">.</span><span class="property">remove_asset</span><span class="punctuation">::&lt;</span><span class="type">LoadImageWithParameters</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">);</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">})</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">({</span>
                        <span class="comment">// Ensure that the normal image loader doesn&#39;t spam logs</span>
                        <span class="keyword">let</span> image_source = <span class="constructor">Path</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>
                            <span class="string">&quot;this/file/really/shouldn&#39;t/exist/or/won&#39;t/be/an/image/I/hope&quot;</span><span class="punctuation">,</span>
                        <span class="punctuation">)</span>
                        <span class="punctuation">.</span><span class="property">to_path_buf</span><span class="punctuation">();</span>
                        <span class="function">img</span><span class="punctuation">(</span>image_source<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-4&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_12</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">with_fallback</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">fallback_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">red</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">with_loading</span><span class="punctuation">(</span>|| <span class="constructor">Self</span><span class="punctuation">::</span><span class="function">loading_element</span><span class="punctuation">().</span><span class="property">into_any_element</span><span class="punctuation">())</span>
                            <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                cx<span class="punctuation">.</span><span class="property">remove_asset</span><span class="punctuation">::&lt;</span><span class="type">ImgResourceLoader</span><span class="punctuation">&gt;(</span><span class="operator">&amp;</span>image_source<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">().</span><span class="property">into</span><span class="punctuation">());</span>
                            <span class="punctuation">})</span>
                    <span class="punctuation">}),</span>
            <span class="punctuation">),</span>
        <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    env_logger<span class="punctuation">::</span><span class="function">init</span><span class="punctuation">();</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">()</span>
        <span class="punctuation">.</span><span class="property">with_assets</span><span class="punctuation">(</span><span class="type">Assets</span> <span class="punctuation">{})</span>
        <span class="punctuation">.</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
            <span class="keyword">let</span> options = <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">300.</span><span class="punctuation">)),</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">))),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">};</span>
            cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>options<span class="punctuation">,</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">false</span><span class="punctuation">);</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">ImageLoadingExample</span> <span class="punctuation">{})</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
        <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
