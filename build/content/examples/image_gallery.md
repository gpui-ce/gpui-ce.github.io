+++
title = "Image Gallery"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example image_gallery"
source_file = "crates/gpui/examples/image_gallery.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> futures<span class="punctuation">::</span><span class="constructor">FutureExt</span><span class="punctuation">;</span>
<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">AppContext</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Asset</span> <span class="keyword">as</span> _<span class="punctuation">,</span> <span class="constructor">AssetLogger</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">ClickEvent</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">ElementId</span><span class="punctuation">,</span>
    <span class="constructor">Entity</span><span class="punctuation">,</span> <span class="constructor">ImageAssetLoader</span><span class="punctuation">,</span> <span class="constructor">ImageCache</span><span class="punctuation">,</span> <span class="constructor">ImageCacheProvider</span><span class="punctuation">,</span> <span class="constructor">KeyBinding</span><span class="punctuation">,</span> <span class="constructor">Menu</span><span class="punctuation">,</span> <span class="constructor">MenuItem</span><span class="punctuation">,</span>
    <span class="constructor">RetainAllImageCache</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">TitlebarOptions</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span>
    actions<span class="punctuation">,</span> div<span class="punctuation">,</span> hash<span class="punctuation">,</span> image_cache<span class="punctuation">,</span> img<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span>
<span class="punctuation">};</span>
<span class="keyword">use</span> reqwest_client<span class="punctuation">::</span><span class="constructor">ReqwestClient</span><span class="punctuation">;</span>
<span class="keyword">use</span> std<span class="punctuation">::{</span>collections<span class="punctuation">::</span><span class="constructor">HashMap</span><span class="punctuation">,</span> sync<span class="punctuation">::</span><span class="constructor">Arc</span><span class="punctuation">};</span>

<span class="keyword">const</span> <span class="constructor">IMAGES_IN_GALLERY</span><span class="punctuation">:</span> <span class="type">usize</span> = <span class="constant">30</span><span class="punctuation">;</span>

<span class="keyword">struct</span> <span class="type">ImageGallery</span> <span class="punctuation">{</span>
    <span class="property">image_key</span><span class="punctuation">:</span> <span class="type">String</span><span class="punctuation">,</span>
    <span class="property">items_count</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
    <span class="property">total_count</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
    <span class="property">image_cache</span><span class="punctuation">:</span> <span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">RetainAllImageCache</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">ImageGallery</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">on_next_image</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ClickEvent</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">image_cache</span>
            <span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |image_cache<span class="punctuation">,</span> cx| image_cache<span class="punctuation">.</span><span class="property">clear</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">));</span>

        <span class="keyword">let</span> t = std<span class="punctuation">::</span>time<span class="punctuation">::</span><span class="constructor">SystemTime</span><span class="punctuation">::</span><span class="function">now</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">duration_since</span><span class="punctuation">(</span>std<span class="punctuation">::</span>time<span class="punctuation">::</span><span class="constructor">UNIX_EPOCH</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">as_millis</span><span class="punctuation">();</span>

        <span class="variable">self</span><span class="punctuation">.</span><span class="property">image_key</span> = <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> t<span class="punctuation">);</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">total_count</span> += <span class="variable">self</span><span class="punctuation">.</span><span class="property">items_count</span><span class="punctuation">;</span>
        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">ImageGallery</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> image_url<span class="punctuation">:</span> <span class="type">SharedString</span> =
            <span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;https://picsum.photos/400/200?t={}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">image_key</span><span class="punctuation">).</span><span class="property">into</span><span class="punctuation">();</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Manually managed image cache:&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">image_cache</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">image_cache</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;main&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xE9E9E9</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">overflow_y_scroll</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_between</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span>
                                <span class="string">&quot;Example to show images and test memory usage (Rendered: {} images).&quot;</span><span class="punctuation">,</span>
                                <span class="variable">self</span><span class="punctuation">.</span><span class="property">total_count</span>
                            <span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;btn&quot;</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">py_1</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">px_4</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">opacity</span><span class="punctuation">(</span><span class="constant">0.8</span><span class="punctuation">))</span>
                                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
                                    <span class="punctuation">.</span><span class="property">text_center</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">w_40</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Next Photos&quot;</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">on_click</span><span class="punctuation">(</span>cx<span class="punctuation">.</span><span class="property">listener</span><span class="punctuation">(</span><span class="constructor">Self</span><span class="punctuation">::</span>on_next_image<span class="punctuation">)),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-gallery&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_x_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_y_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_around</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>
                                <span class="punctuation">(</span><span class="constant">0</span>..<span class="variable">self</span><span class="punctuation">.</span><span class="property">items_count</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|ix| <span class="function">img</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}-{}&quot;</span><span class="punctuation">,</span> image_url<span class="punctuation">,</span> ix<span class="punctuation">)).</span><span class="property">size_20</span><span class="punctuation">()),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="string">&quot;Automatically managed image cache:&quot;</span>
            <span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="function">image_cache</span><span class="punctuation">(</span><span class="function">simple_lru_cache</span><span class="punctuation">(</span><span class="string">&quot;lru-cache&quot;</span><span class="punctuation">,</span> <span class="constructor">IMAGES_IN_GALLERY</span><span class="punctuation">)).</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;main&quot;</span><span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xE9E9E9</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">black</span><span class="punctuation">())</span>
                    <span class="punctuation">.</span><span class="property">overflow_y_scroll</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;image-gallery&quot;</span><span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_wrap</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_x_4</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">gap_y_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">justify_around</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span>
                                <span class="punctuation">(</span><span class="constant">0</span>..<span class="variable">self</span><span class="punctuation">.</span><span class="property">items_count</span><span class="punctuation">)</span>
                                    <span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|ix| <span class="function">img</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}-{}&quot;</span><span class="punctuation">,</span> image_url<span class="punctuation">,</span> ix<span class="punctuation">)).</span><span class="property">size_20</span><span class="punctuation">()),</span>
                            <span class="punctuation">),</span>
                    <span class="punctuation">)</span>
            <span class="punctuation">))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">simple_lru_cache</span><span class="punctuation">(</span><span class="variable">id</span><span class="punctuation">:</span> <span class="keyword">impl</span> <span class="type">Into</span><span class="punctuation">&lt;</span><span class="type">ElementId</span><span class="punctuation">&gt;,</span> <span class="variable">max_items</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">)</span> -&gt; <span class="type">SimpleLruCacheProvider</span> <span class="punctuation">{</span>
    <span class="type">SimpleLruCacheProvider</span> <span class="punctuation">{</span>
        <span class="property">id</span><span class="punctuation">:</span> id<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
        max_items<span class="punctuation">,</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">SimpleLruCacheProvider</span> <span class="punctuation">{</span>
    <span class="property">id</span><span class="punctuation">:</span> <span class="type">ElementId</span><span class="punctuation">,</span>
    <span class="property">max_items</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">ImageCacheProvider</span> <span class="keyword">for</span> <span class="type">SimpleLruCacheProvider</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">provide</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> -&gt; gpui<span class="punctuation">::</span><span class="type">AnyImageCache</span> <span class="punctuation">{</span>
        window
            <span class="punctuation">.</span><span class="property">with_global_id</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">id</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">(),</span> |global_id<span class="punctuation">,</span> window| <span class="punctuation">{</span>
                window<span class="punctuation">.</span><span class="property">with_element_state</span><span class="punctuation">::&lt;</span><span class="type">Entity</span><span class="punctuation">&lt;</span><span class="type">SimpleLruCache</span><span class="punctuation">&gt;,</span> <span class="type">_</span><span class="punctuation">&gt;(</span>
                    global_id<span class="punctuation">,</span>
                    |lru_cache<span class="punctuation">,</span> _window| <span class="punctuation">{</span>
                        <span class="keyword">let</span> <span class="keyword">mut</span> lru_cache = lru_cache<span class="punctuation">.</span><span class="property">unwrap_or_else</span><span class="punctuation">(</span>|| <span class="punctuation">{</span>
                            cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">SimpleLruCache</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">max_items</span><span class="punctuation">,</span> cx<span class="punctuation">))</span>
                        <span class="punctuation">});</span>
                        <span class="keyword">if</span> lru_cache<span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">).</span><span class="property">max_items</span> != <span class="variable">self</span><span class="punctuation">.</span><span class="property">max_items</span> <span class="punctuation">{</span>
                            lru_cache = cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|cx| <span class="constructor">SimpleLruCache</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">max_items</span><span class="punctuation">,</span> cx<span class="punctuation">));</span>
                        <span class="punctuation">}</span>
                        <span class="punctuation">(</span>lru_cache<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">(),</span> lru_cache<span class="punctuation">)</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">SimpleLruCache</span> <span class="punctuation">{</span>
    <span class="property">max_items</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
    <span class="property">usages</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">u64</span><span class="punctuation">&gt;,</span>
    <span class="property">cache</span><span class="punctuation">:</span> <span class="type">HashMap</span><span class="punctuation">&lt;</span><span class="type">u64</span><span class="punctuation">,</span> gpui<span class="punctuation">::</span><span class="type">ImageCacheItem</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">SimpleLruCache</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">max_items</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">on_release</span><span class="punctuation">(</span>|simple_cache<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
            <span class="keyword">for</span> <span class="punctuation">(</span>_<span class="punctuation">,</span> <span class="keyword">mut</span> item<span class="punctuation">)</span> <span class="keyword">in</span> std<span class="punctuation">::</span>mem<span class="punctuation">::</span><span class="function">take</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> simple_cache<span class="punctuation">.</span><span class="property">cache</span><span class="punctuation">)</span> <span class="punctuation">{</span>
                <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">Ok</span><span class="punctuation">(</span>image<span class="punctuation">))</span> = item<span class="punctuation">.</span><span class="property">get</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                    cx<span class="punctuation">.</span><span class="property">drop_image</span><span class="punctuation">(</span>image<span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">);</span>
                <span class="punctuation">}</span>
            <span class="punctuation">}</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

        <span class="type">Self</span> <span class="punctuation">{</span>
            max_items<span class="punctuation">,</span>
            <span class="property">usages</span><span class="punctuation">:</span> <span class="constructor">Vec</span><span class="punctuation">::</span><span class="function">with_capacity</span><span class="punctuation">(</span>max_items<span class="punctuation">),</span>
            <span class="property">cache</span><span class="punctuation">:</span> <span class="constructor">HashMap</span><span class="punctuation">::</span><span class="function">with_capacity</span><span class="punctuation">(</span>max_items<span class="punctuation">),</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">ImageCache</span> <span class="keyword">for</span> <span class="type">SimpleLruCache</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">load</span><span class="punctuation">(</span>
        <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span>
        <span class="variable">resource</span><span class="punctuation">:</span> <span class="operator">&amp;</span>gpui<span class="punctuation">::</span><span class="type">Resource</span><span class="punctuation">,</span>
        <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span>
        <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">,</span>
    <span class="punctuation">)</span> -&gt; <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Result</span><span class="punctuation">&lt;</span><span class="type">Arc</span><span class="punctuation">&lt;</span>gpui<span class="punctuation">::</span><span class="type">RenderImage</span><span class="punctuation">&gt;,</span> gpui<span class="punctuation">::</span><span class="type">ImageCacheError</span><span class="punctuation">&gt;&gt;</span> <span class="punctuation">{</span>
        <span class="macro">assert_eq!</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">cache</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">());</span>
        <span class="macro">assert!</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">cache</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span> &lt;= <span class="variable">self</span><span class="punctuation">.</span><span class="property">max_items</span><span class="punctuation">);</span>

        <span class="keyword">let</span> hash = <span class="function">hash</span><span class="punctuation">(</span>resource<span class="punctuation">);</span>

        <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>item<span class="punctuation">)</span> = <span class="variable">self</span><span class="punctuation">.</span><span class="property">cache</span><span class="punctuation">.</span><span class="property">get_mut</span><span class="punctuation">(</span><span class="operator">&amp;</span>hash<span class="punctuation">)</span> <span class="punctuation">{</span>
            <span class="keyword">let</span> current_ix = <span class="variable">self</span>
                <span class="punctuation">.</span><span class="property">usages</span>
                <span class="punctuation">.</span><span class="property">iter</span><span class="punctuation">()</span>
                <span class="punctuation">.</span><span class="property">position</span><span class="punctuation">(</span>|item| <span class="operator">*</span>item == hash<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">expect</span><span class="punctuation">(</span><span class="string">&quot;cache and usages must stay in sync&quot;</span><span class="punctuation">);</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">remove</span><span class="punctuation">(</span>current_ix<span class="punctuation">);</span>
            <span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">insert</span><span class="punctuation">(</span><span class="constant">0</span><span class="punctuation">,</span> hash<span class="punctuation">);</span>

            <span class="keyword">return</span> item<span class="punctuation">.</span><span class="property">get</span><span class="punctuation">();</span>
        <span class="punctuation">}</span>

        <span class="keyword">let</span> fut = <span class="type">AssetLogger</span><span class="punctuation">::&lt;</span><span class="type">ImageAssetLoader</span><span class="punctuation">&gt;::</span><span class="function">load</span><span class="punctuation">(</span>resource<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">(),</span> cx<span class="punctuation">);</span>
        <span class="keyword">let</span> task = cx<span class="punctuation">.</span><span class="property">background_executor</span><span class="punctuation">().</span><span class="property">spawn</span><span class="punctuation">(</span>fut<span class="punctuation">).</span><span class="property">shared</span><span class="punctuation">();</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">()</span> == <span class="variable">self</span><span class="punctuation">.</span><span class="property">max_items</span> <span class="punctuation">{</span>
            <span class="keyword">let</span> oldest = <span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">pop</span><span class="punctuation">().</span><span class="property">unwrap</span><span class="punctuation">();</span>
            <span class="keyword">let</span> <span class="keyword">mut</span> image = <span class="variable">self</span>
                <span class="punctuation">.</span><span class="property">cache</span>
                <span class="punctuation">.</span><span class="property">remove</span><span class="punctuation">(</span><span class="operator">&amp;</span>oldest<span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">expect</span><span class="punctuation">(</span><span class="string">&quot;cache and usages must be in sync&quot;</span><span class="punctuation">);</span>
            <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">Ok</span><span class="punctuation">(</span>image<span class="punctuation">))</span> = image<span class="punctuation">.</span><span class="property">get</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">drop_image</span><span class="punctuation">(</span>image<span class="punctuation">,</span> <span class="constructor">Some</span><span class="punctuation">(</span>window<span class="punctuation">));</span>
            <span class="punctuation">}</span>
        <span class="punctuation">}</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">cache</span>
            <span class="punctuation">.</span><span class="property">insert</span><span class="punctuation">(</span>hash<span class="punctuation">,</span> gpui<span class="punctuation">::</span><span class="constructor">ImageCacheItem</span><span class="punctuation">::</span><span class="constructor">Loading</span><span class="punctuation">(</span>task<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()));</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">usages</span><span class="punctuation">.</span><span class="property">insert</span><span class="punctuation">(</span><span class="constant">0</span><span class="punctuation">,</span> hash<span class="punctuation">);</span>

        <span class="keyword">let</span> entity = window<span class="punctuation">.</span><span class="property">current_view</span><span class="punctuation">();</span>
        window
            <span class="punctuation">.</span><span class="property">spawn</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> <span class="punctuation">{</span>
                <span class="keyword">async</span> <span class="keyword">move</span> |cx| <span class="punctuation">{</span>
                    _ = task<span class="punctuation">.</span><span class="keyword">await</span><span class="punctuation">;</span>
                    cx<span class="punctuation">.</span><span class="property">on_next_frame</span><span class="punctuation">(</span><span class="keyword">move</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                        cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">(</span>entity<span class="punctuation">);</span>
                    <span class="punctuation">});</span>
                <span class="punctuation">}</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">detach</span><span class="punctuation">();</span>

        <span class="constructor">None</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="macro">actions!</span><span class="punctuation">(</span>image<span class="punctuation">,</span> <span class="punctuation">[</span><span class="constructor">Quit</span><span class="punctuation">]);</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    env_logger<span class="punctuation">::</span><span class="function">init</span><span class="punctuation">();</span>

    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span><span class="keyword">move</span> |<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        <span class="keyword">let</span> http_client = <span class="constructor">ReqwestClient</span><span class="punctuation">::</span><span class="function">user_agent</span><span class="punctuation">(</span><span class="string">&quot;gpui example&quot;</span><span class="punctuation">).</span><span class="property">unwrap</span><span class="punctuation">();</span>
        cx<span class="punctuation">.</span><span class="property">set_http_client</span><span class="punctuation">(</span><span class="constructor">Arc</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>http_client<span class="punctuation">));</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>|_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Quit</span><span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">());</span>
        cx<span class="punctuation">.</span><span class="property">bind_keys</span><span class="punctuation">([</span><span class="constructor">KeyBinding</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="string">&quot;cmd-q&quot;</span><span class="punctuation">,</span> <span class="constructor">Quit</span><span class="punctuation">,</span> <span class="constructor">None</span><span class="punctuation">)]);</span>
        cx<span class="punctuation">.</span><span class="property">set_menus</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span><span class="type">Menu</span> <span class="punctuation">{</span>
            <span class="property">name</span><span class="punctuation">:</span> <span class="string">&quot;Image Gallery&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="property">items</span><span class="punctuation">:</span> <span class="macro">vec!</span><span class="punctuation">[</span><span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">action</span><span class="punctuation">(</span><span class="string">&quot;Quit&quot;</span><span class="punctuation">,</span> <span class="constructor">Quit</span><span class="punctuation">)],</span>
        <span class="punctuation">}]);</span>

        <span class="keyword">let</span> window_options = <span class="type">WindowOptions</span> <span class="punctuation">{</span>
            <span class="property">titlebar</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="type">TitlebarOptions</span> <span class="punctuation">{</span>
                <span class="property">title</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">from</span><span class="punctuation">(</span><span class="string">&quot;Image Gallery&quot;</span><span class="punctuation">)),</span>
                <span class="property">appears_transparent</span><span class="punctuation">:</span> <span class="constant">false</span><span class="punctuation">,</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">}),</span>

            <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span>
                <span class="constructor">None</span><span class="punctuation">,</span>
                <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">1100.</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">860.</span><span class="punctuation">)),</span>
                cx<span class="punctuation">,</span>
            <span class="punctuation">))),</span>

            ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
        <span class="punctuation">};</span>

        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>window_options<span class="punctuation">,</span> |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
            cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|ctx| <span class="type">ImageGallery</span> <span class="punctuation">{</span>
                <span class="property">image_key</span><span class="punctuation">:</span> <span class="string">&quot;&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
                <span class="property">items_count</span><span class="punctuation">:</span> <span class="constructor">IMAGES_IN_GALLERY</span><span class="punctuation">,</span>
                <span class="property">total_count</span><span class="punctuation">:</span> <span class="constant">0</span><span class="punctuation">,</span>
                <span class="property">image_cache</span><span class="punctuation">:</span> <span class="constructor">RetainAllImageCache</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>ctx<span class="punctuation">),</span>
            <span class="punctuation">})</span>
        <span class="punctuation">})</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
