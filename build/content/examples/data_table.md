+++
title = "Data Table"
description = "Performance benchmark rendering a large data table with many rows and columns."
template = "page.html"

[extra]
run_command = "cargo run --example data_table"
source_file = "examples/bench/data_table.rs"
category = "bench"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> std<span class="punctuation">::{</span>ops<span class="punctuation">::</span><span class="constructor">Range</span><span class="punctuation">,</span> rc<span class="punctuation">::</span><span class="constructor">Rc</span><span class="punctuation">,</span> time<span class="punctuation">::</span><span class="constructor">Duration</span><span class="punctuation">};</span>

<span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Bounds</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">MouseDownEvent</span><span class="punctuation">,</span> <span class="constructor">MouseMoveEvent</span><span class="punctuation">,</span> <span class="constructor">MouseUpEvent</span><span class="punctuation">,</span> <span class="constructor">Pixels</span><span class="punctuation">,</span> <span class="constructor">Point</span><span class="punctuation">,</span>
    <span class="constructor">Render</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">UniformListScrollHandle</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span> <span class="constructor">WindowBounds</span><span class="punctuation">,</span> <span class="constructor">WindowOptions</span><span class="punctuation">,</span> canvas<span class="punctuation">,</span>
    div<span class="punctuation">,</span> point<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> px<span class="punctuation">,</span> rgb<span class="punctuation">,</span> size<span class="punctuation">,</span> uniform_list<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">const</span> <span class="constructor">TOTAL_ITEMS</span><span class="punctuation">:</span> <span class="type">usize</span> = <span class="constant">10000</span><span class="punctuation">;</span>
<span class="keyword">const</span> <span class="constructor">SCROLLBAR_THUMB_WIDTH</span><span class="punctuation">:</span> <span class="type">Pixels</span> = <span class="function">px</span><span class="punctuation">(</span><span class="constant">8.</span><span class="punctuation">);</span>
<span class="keyword">const</span> <span class="constructor">SCROLLBAR_THUMB_HEIGHT</span><span class="punctuation">:</span> <span class="type">Pixels</span> = <span class="function">px</span><span class="punctuation">(</span><span class="constant">100.</span><span class="punctuation">);</span>

<span class="keyword">pub</span> <span class="keyword">struct</span> <span class="type">Quote</span> <span class="punctuation">{</span>
    <span class="property">name</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">symbol</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">last_done</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">prev_close</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">open</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">high</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">low</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">timestamp</span><span class="punctuation">:</span> <span class="type">Duration</span><span class="punctuation">,</span>
    <span class="property">volume</span><span class="punctuation">:</span> <span class="type">i64</span><span class="punctuation">,</span>
    <span class="property">turnover</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">ttm</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">market_cap</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">float_cap</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">shares</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">pb</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">pe</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">eps</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">dividend</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">dividend_yield</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">dividend_per_share</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
    <span class="property">dividend_date</span><span class="punctuation">:</span> <span class="type">SharedString</span><span class="punctuation">,</span>
    <span class="property">dividend_payment</span><span class="punctuation">:</span> <span class="type">f64</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Quote</span> <span class="punctuation">{</span>
    <span class="keyword">pub</span> <span class="keyword">fn</span> <span class="function">random</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="keyword">use</span> rand<span class="punctuation">::</span><span class="constructor">Rng</span><span class="punctuation">;</span>
        <span class="keyword">let</span> <span class="keyword">mut</span> rng = rand<span class="punctuation">::</span><span class="function">rng</span><span class="punctuation">();</span>
        <span class="comment">// simulate a base price in a realistic range</span>
        <span class="keyword">let</span> prev_close = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">100.0</span>..<span class="constant">200.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> change = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span>-<span class="constant">5.0</span>..<span class="constant">5.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> last_done = prev_close + change<span class="punctuation">;</span>
        <span class="keyword">let</span> open = prev_close + rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span>-<span class="constant">3.0</span>..<span class="constant">3.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> high = <span class="punctuation">(</span>prev_close + rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">::&lt;</span><span class="type">f64</span><span class="punctuation">,</span> <span class="type">_</span><span class="punctuation">&gt;(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">)).</span><span class="property">max</span><span class="punctuation">(</span>open<span class="punctuation">);</span>
        <span class="keyword">let</span> low = <span class="punctuation">(</span>prev_close - rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">::&lt;</span><span class="type">f64</span><span class="punctuation">,</span> <span class="type">_</span><span class="punctuation">&gt;(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">)).</span><span class="property">min</span><span class="punctuation">(</span>open<span class="punctuation">);</span>
        <span class="keyword">let</span> timestamp = <span class="constructor">Duration</span><span class="punctuation">::</span><span class="function">from_secs</span><span class="punctuation">(</span>rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0</span>..<span class="constant">86400</span><span class="punctuation">));</span>
        <span class="keyword">let</span> volume = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1_000_000</span>..<span class="constant">100_000_000</span><span class="punctuation">);</span>
        <span class="keyword">let</span> turnover = last_done <span class="operator">*</span> volume <span class="keyword">as</span> <span class="type">f64</span><span class="punctuation">;</span>
        <span class="keyword">let</span> symbol = <span class="punctuation">{</span>
            <span class="keyword">let</span> <span class="keyword">mut</span> ticker = <span class="constructor">String</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">();</span>
            <span class="keyword">if</span> rng<span class="punctuation">.</span><span class="property">random_bool</span><span class="punctuation">(</span><span class="constant">0.5</span><span class="punctuation">)</span> <span class="punctuation">{</span>
                ticker<span class="punctuation">.</span><span class="property">push_str</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="macro">format!</span><span class="punctuation">(</span>
                    <span class="string">&quot;{:03}.{}&quot;</span><span class="punctuation">,</span>
                    rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">100</span>..<span class="constant">1000</span><span class="punctuation">),</span>
                    rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0</span>..<span class="constant">10</span><span class="punctuation">)</span>
                <span class="punctuation">));</span>
            <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                ticker<span class="punctuation">.</span><span class="property">push_str</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="macro">format!</span><span class="punctuation">(</span>
                    <span class="string">&quot;{}{}&quot;</span><span class="punctuation">,</span>
                    rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="string">&#39;A&#39;</span>..=<span class="string">&#39;Z&#39;</span><span class="punctuation">),</span>
                    rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="string">&#39;A&#39;</span>..=<span class="string">&#39;Z&#39;</span><span class="punctuation">)</span>
                <span class="punctuation">));</span>
            <span class="punctuation">}</span>
            ticker<span class="punctuation">.</span><span class="property">push_str</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;.{}&quot;</span><span class="punctuation">,</span> rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="string">&#39;A&#39;</span>..=<span class="string">&#39;Z&#39;</span><span class="punctuation">)));</span>
            ticker
        <span class="punctuation">};</span>
        <span class="keyword">let</span> name = <span class="macro">format!</span><span class="punctuation">(</span>
            <span class="string">&quot;{} {} - #{}&quot;</span><span class="punctuation">,</span>
            symbol<span class="punctuation">,</span>
            rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1</span>..<span class="constant">100</span><span class="punctuation">),</span>
            rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">10000</span>..<span class="constant">100000</span><span class="punctuation">)</span>
        <span class="punctuation">);</span>
        <span class="keyword">let</span> ttm = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> market_cap = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1_000_000.0</span>..<span class="constant">10_000_000.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> float_cap = market_cap + rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1_000.0</span>..<span class="constant">10_000.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> shares = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">100.0</span>..<span class="constant">1000.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> pb = market_cap / shares<span class="punctuation">;</span>
        <span class="keyword">let</span> pe = market_cap / shares<span class="punctuation">;</span>
        <span class="keyword">let</span> eps = market_cap / shares<span class="punctuation">;</span>
        <span class="keyword">let</span> dividend = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> dividend_yield = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> dividend_per_share = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">);</span>
        <span class="keyword">let</span> dividend_date = <span class="constructor">SharedString</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span>
            <span class="string">&quot;{}-{}-{}&quot;</span><span class="punctuation">,</span>
            rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">2000</span>..<span class="constant">2023</span><span class="punctuation">),</span>
            rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1</span>..<span class="constant">12</span><span class="punctuation">),</span>
            rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">1</span>..<span class="constant">28</span><span class="punctuation">)</span>
        <span class="punctuation">));</span>
        <span class="keyword">let</span> dividend_payment = rng<span class="punctuation">.</span><span class="property">random_range</span><span class="punctuation">(</span><span class="constant">0.0</span>..<span class="constant">10.0</span><span class="punctuation">);</span>

        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">name</span><span class="punctuation">:</span> name<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
            <span class="property">symbol</span><span class="punctuation">:</span> symbol<span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
            last_done<span class="punctuation">,</span>
            prev_close<span class="punctuation">,</span>
            open<span class="punctuation">,</span>
            high<span class="punctuation">,</span>
            low<span class="punctuation">,</span>
            timestamp<span class="punctuation">,</span>
            volume<span class="punctuation">,</span>
            turnover<span class="punctuation">,</span>
            pb<span class="punctuation">,</span>
            pe<span class="punctuation">,</span>
            eps<span class="punctuation">,</span>
            ttm<span class="punctuation">,</span>
            market_cap<span class="punctuation">,</span>
            float_cap<span class="punctuation">,</span>
            shares<span class="punctuation">,</span>
            dividend<span class="punctuation">,</span>
            dividend_yield<span class="punctuation">,</span>
            dividend_per_share<span class="punctuation">,</span>
            dividend_date<span class="punctuation">,</span>
            dividend_payment<span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">change</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">f64</span> <span class="punctuation">{</span>
        <span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">last_done</span> - <span class="variable">self</span><span class="punctuation">.</span><span class="property">prev_close</span><span class="punctuation">)</span> / <span class="variable">self</span><span class="punctuation">.</span><span class="property">prev_close</span> <span class="operator">*</span> <span class="constant">100.0</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">change_color</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; gpui<span class="punctuation">::</span><span class="type">Hsla</span> <span class="punctuation">{</span>
        <span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">change</span><span class="punctuation">()</span> &gt; <span class="constant">0.0</span> <span class="punctuation">{</span>
            gpui<span class="punctuation">::</span><span class="function">green</span><span class="punctuation">()</span>
        <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
            gpui<span class="punctuation">::</span><span class="function">red</span><span class="punctuation">()</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">turnover_ratio</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">f64</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">volume</span> <span class="keyword">as</span> <span class="type">f64</span> / <span class="variable">self</span><span class="punctuation">.</span><span class="property">turnover</span> <span class="operator">*</span> <span class="constant">100.0</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">IntoElement</span><span class="punctuation">)]</span>
<span class="keyword">struct</span> <span class="type">TableRow</span> <span class="punctuation">{</span>
    <span class="property">ix</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span>
    <span class="property">quote</span><span class="punctuation">:</span> <span class="type">Rc</span><span class="punctuation">&lt;</span><span class="type">Quote</span><span class="punctuation">&gt;,</span>
<span class="punctuation">}</span>
<span class="keyword">impl</span> <span class="type">TableRow</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">(</span><span class="variable">ix</span><span class="punctuation">:</span> <span class="type">usize</span><span class="punctuation">,</span> <span class="variable">quote</span><span class="punctuation">:</span> <span class="type">Rc</span><span class="punctuation">&lt;</span><span class="type">Quote</span><span class="punctuation">&gt;)</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span> ix<span class="punctuation">,</span> quote <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">render_cell</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">key</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span> <span class="variable">width</span><span class="punctuation">:</span> <span class="type">Pixels</span><span class="punctuation">,</span> <span class="variable">color</span><span class="punctuation">:</span> gpui<span class="punctuation">::</span><span class="type">Hsla</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">truncate</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span>width<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">px_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="keyword">match</span> key <span class="punctuation">{</span>
                <span class="string">&quot;id&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">ix</span><span class="punctuation">)),</span>
                <span class="string">&quot;symbol&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">symbol</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()),</span>
                <span class="string">&quot;name&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">name</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()),</span>
                <span class="string">&quot;last_done&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.3}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">last_done</span><span class="punctuation">)),</span>
                <span class="string">&quot;prev_close&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.3}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">prev_close</span><span class="punctuation">)),</span>
                <span class="string">&quot;change&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}%&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">change</span><span class="punctuation">())),</span>
                <span class="string">&quot;timestamp&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:?}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">timestamp</span><span class="punctuation">.</span><span class="property">as_secs</span><span class="punctuation">())),</span>
                <span class="string">&quot;open&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">open</span><span class="punctuation">)),</span>
                <span class="string">&quot;low&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">low</span><span class="punctuation">)),</span>
                <span class="string">&quot;high&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">high</span><span class="punctuation">)),</span>
                <span class="string">&quot;ttm&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">ttm</span><span class="punctuation">)),</span>
                <span class="string">&quot;eps&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span>color<span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">eps</span><span class="punctuation">)),</span>
                <span class="string">&quot;market_cap&quot;</span> =&gt; <span class="punctuation">{</span>
                    <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2} M&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">market_cap</span> / <span class="constant">1_000_000.0</span><span class="punctuation">))</span>
                <span class="punctuation">}</span>
                <span class="string">&quot;float_cap&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2} M&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">float_cap</span> / <span class="constant">1_000_000.0</span><span class="punctuation">)),</span>
                <span class="string">&quot;turnover&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2} M&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">turnover</span> / <span class="constant">1_000_000.0</span><span class="punctuation">)),</span>
                <span class="string">&quot;volume&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2} M&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">volume</span> <span class="keyword">as</span> <span class="type">f64</span> / <span class="constant">1_000_000.0</span><span class="punctuation">)),</span>
                <span class="string">&quot;turnover_ratio&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}%&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">turnover_ratio</span><span class="punctuation">())),</span>
                <span class="string">&quot;pe&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">pe</span><span class="punctuation">)),</span>
                <span class="string">&quot;pb&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">pb</span><span class="punctuation">)),</span>
                <span class="string">&quot;shares&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">shares</span><span class="punctuation">)),</span>
                <span class="string">&quot;dividend&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">dividend</span><span class="punctuation">)),</span>
                <span class="string">&quot;yield&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}%&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">dividend_yield</span><span class="punctuation">)),</span>
                <span class="string">&quot;dividend_per_share&quot;</span> =&gt; <span class="punctuation">{</span>
                    <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">dividend_per_share</span><span class="punctuation">))</span>
                <span class="punctuation">}</span>
                <span class="string">&quot;dividend_date&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">dividend_date</span><span class="punctuation">)),</span>
                <span class="string">&quot;dividend_payment&quot;</span> =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span><span class="string">&quot;{:.2}&quot;</span><span class="punctuation">,</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">dividend_payment</span><span class="punctuation">)),</span>
                _ =&gt; <span class="function">div</span><span class="punctuation">().</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;--&quot;</span><span class="punctuation">),</span>
            <span class="punctuation">})</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">const</span> <span class="constructor">FIELDS</span><span class="punctuation">:</span> <span class="punctuation">[(</span><span class="operator">&amp;</span><span class="type">str</span><span class="punctuation">,</span> <span class="type">f32</span><span class="punctuation">);</span> <span class="constant">24</span><span class="punctuation">]</span> = <span class="punctuation">[</span>
    <span class="punctuation">(</span><span class="string">&quot;id&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;symbol&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;name&quot;</span><span class="punctuation">,</span> <span class="constant">180.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;last_done&quot;</span><span class="punctuation">,</span> <span class="constant">80.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;prev_close&quot;</span><span class="punctuation">,</span> <span class="constant">80.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;open&quot;</span><span class="punctuation">,</span> <span class="constant">80.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;low&quot;</span><span class="punctuation">,</span> <span class="constant">80.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;high&quot;</span><span class="punctuation">,</span> <span class="constant">80.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;ttm&quot;</span><span class="punctuation">,</span> <span class="constant">50.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;market_cap&quot;</span><span class="punctuation">,</span> <span class="constant">96.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;float_cap&quot;</span><span class="punctuation">,</span> <span class="constant">96.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;turnover&quot;</span><span class="punctuation">,</span> <span class="constant">120.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;volume&quot;</span><span class="punctuation">,</span> <span class="constant">100.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;turnover_ratio&quot;</span><span class="punctuation">,</span> <span class="constant">96.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;pe&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;pb&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;eps&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;shares&quot;</span><span class="punctuation">,</span> <span class="constant">96.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;dividend&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;yield&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;dividend_per_share&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;dividend_date&quot;</span><span class="punctuation">,</span> <span class="constant">96.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;dividend_payment&quot;</span><span class="punctuation">,</span> <span class="constant">64.</span><span class="punctuation">),</span>
    <span class="punctuation">(</span><span class="string">&quot;timestamp&quot;</span><span class="punctuation">,</span> <span class="constant">120.</span><span class="punctuation">),</span>
<span class="punctuation">];</span>

<span class="keyword">impl</span> <span class="type">RenderOnce</span> <span class="keyword">for</span> <span class="type">TableRow</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> color = <span class="variable">self</span><span class="punctuation">.</span><span class="property">quote</span><span class="punctuation">.</span><span class="property">change_color</span><span class="punctuation">();</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_b_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xE0E0E0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="keyword">if</span> <span class="variable">self</span><span class="punctuation">.</span><span class="property">ix</span><span class="punctuation">.</span><span class="property">is_multiple_of</span><span class="punctuation">(</span><span class="constant">2</span><span class="punctuation">)</span> <span class="punctuation">{</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFFFFFF</span><span class="punctuation">)</span>
            <span class="punctuation">}</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                <span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xFAFAFA</span><span class="punctuation">)</span>
            <span class="punctuation">})</span>
            <span class="punctuation">.</span><span class="property">py_0p5</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">px_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span><span class="constructor">FIELDS</span><span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>key<span class="punctuation">,</span> width<span class="punctuation">)</span>| <span class="variable">self</span><span class="punctuation">.</span><span class="property">render_cell</span><span class="punctuation">(</span>key<span class="punctuation">,</span> <span class="function">px</span><span class="punctuation">(</span>width<span class="punctuation">),</span> color<span class="punctuation">)))</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">DataTable</span> <span class="punctuation">{</span>
    <span class="comment">/// Use `Rc` to share the same quote data across multiple items, avoid cloning.
</span>    <span class="property">quotes</span><span class="punctuation">:</span> <span class="type">Vec</span><span class="punctuation">&lt;</span><span class="type">Rc</span><span class="punctuation">&lt;</span><span class="type">Quote</span><span class="punctuation">&gt;&gt;,</span>
    <span class="property">visible_range</span><span class="punctuation">:</span> <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;,</span>
    <span class="property">scroll_handle</span><span class="punctuation">:</span> <span class="type">UniformListScrollHandle</span><span class="punctuation">,</span>
    <span class="comment">/// The position in thumb bounds when dragging start mouse down.
</span>    <span class="property">drag_position</span><span class="punctuation">:</span> <span class="type">Option</span><span class="punctuation">&lt;</span><span class="type">Point</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;&gt;,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">DataTable</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">quotes</span><span class="punctuation">:</span> <span class="constructor">Vec</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(),</span>
            <span class="property">visible_range</span><span class="punctuation">:</span> <span class="constant">0</span>..<span class="constant">0</span><span class="punctuation">,</span>
            <span class="property">scroll_handle</span><span class="punctuation">:</span> <span class="constructor">UniformListScrollHandle</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(),</span>
            <span class="property">drag_position</span><span class="punctuation">:</span> <span class="constructor">None</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">generate</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">quotes</span> = <span class="punctuation">(</span><span class="constant">0</span>..<span class="constructor">TOTAL_ITEMS</span><span class="punctuation">).</span><span class="property">map</span><span class="punctuation">(</span>|_| <span class="constructor">Rc</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span><span class="constructor">Quote</span><span class="punctuation">::</span><span class="function">random</span><span class="punctuation">())).</span><span class="property">collect</span><span class="punctuation">();</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">table_bounds</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Bounds</span><span class="punctuation">&lt;</span><span class="type">Pixels</span><span class="punctuation">&gt;</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_handle</span><span class="punctuation">.</span><span class="constant">0</span><span class="punctuation">.</span><span class="property">borrow</span><span class="punctuation">().</span><span class="property">base_handle</span><span class="punctuation">.</span><span class="property">bounds</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">scroll_top</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Pixels</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_handle</span><span class="punctuation">.</span><span class="constant">0</span><span class="punctuation">.</span><span class="property">borrow</span><span class="punctuation">().</span><span class="property">base_handle</span><span class="punctuation">.</span><span class="property">offset</span><span class="punctuation">().</span><span class="property">y</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">scroll_height</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">Pixels</span> <span class="punctuation">{</span>
        <span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_handle</span>
            <span class="punctuation">.</span><span class="constant">0</span>
            <span class="punctuation">.</span><span class="property">borrow</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">last_item_size</span>
            <span class="punctuation">.</span><span class="property">unwrap_or_default</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">contents</span>
            <span class="punctuation">.</span><span class="property">height</span>
    <span class="punctuation">}</span>

    <span class="keyword">fn</span> <span class="function">render_scrollbar</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> _<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="keyword">let</span> scroll_height = <span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_height</span><span class="punctuation">();</span>
        <span class="keyword">let</span> table_bounds = <span class="variable">self</span><span class="punctuation">.</span><span class="property">table_bounds</span><span class="punctuation">();</span>
        <span class="keyword">let</span> table_height = table_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span><span class="punctuation">;</span>
        <span class="keyword">if</span> table_height == <span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">)</span> <span class="punctuation">{</span>
            <span class="keyword">return</span> <span class="function">div</span><span class="punctuation">().</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;scrollbar&quot;</span><span class="punctuation">);</span>
        <span class="punctuation">}</span>

        <span class="keyword">let</span> percentage = -<span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_top</span><span class="punctuation">()</span> / scroll_height<span class="punctuation">;</span>
        <span class="keyword">let</span> offset_top = <span class="punctuation">(</span>table_height <span class="operator">*</span> percentage<span class="punctuation">).</span><span class="property">clamp</span><span class="punctuation">(</span>
            <span class="function">px</span><span class="punctuation">(</span><span class="constant">4.</span><span class="punctuation">),</span>
            <span class="punctuation">(</span>table_height - <span class="constructor">SCROLLBAR_THUMB_HEIGHT</span> - <span class="function">px</span><span class="punctuation">(</span><span class="constant">4.</span><span class="punctuation">)).</span><span class="property">max</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">4.</span><span class="punctuation">)),</span>
        <span class="punctuation">);</span>
        <span class="keyword">let</span> entity = cx<span class="punctuation">.</span><span class="property">entity</span><span class="punctuation">();</span>
        <span class="keyword">let</span> scroll_handle = <span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_handle</span><span class="punctuation">.</span><span class="constant">0</span><span class="punctuation">.</span><span class="property">borrow</span><span class="punctuation">().</span><span class="property">base_handle</span><span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>

        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">id</span><span class="punctuation">(</span><span class="string">&quot;scrollbar&quot;</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">absolute</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">top</span><span class="punctuation">(</span>offset_top<span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">right_1</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">h</span><span class="punctuation">(</span><span class="constructor">SCROLLBAR_THUMB_HEIGHT</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="constructor">SCROLLBAR_THUMB_WIDTH</span><span class="punctuation">)</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xC0C0C0</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">hover</span><span class="punctuation">(</span>|this| this<span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xA0A0A0</span><span class="punctuation">)))</span>
            <span class="punctuation">.</span><span class="property">rounded_lg</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">canvas</span><span class="punctuation">(</span>
                    |_<span class="punctuation">,</span> _<span class="punctuation">,</span> _| <span class="punctuation">(),</span>
                    <span class="keyword">move</span> |thumb_bounds<span class="punctuation">,</span> _<span class="punctuation">,</span> window<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                        window<span class="punctuation">.</span><span class="property">on_mouse_event</span><span class="punctuation">({</span>
                            <span class="keyword">let</span> entity = entity<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
                            <span class="keyword">move</span> |<span class="variable">ev</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseDownEvent</span><span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                <span class="keyword">if</span> !thumb_bounds<span class="punctuation">.</span><span class="property">contains</span><span class="punctuation">(</span><span class="operator">&amp;</span>ev<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">)</span> <span class="punctuation">{</span>
                                    <span class="keyword">return</span><span class="punctuation">;</span>
                                <span class="punctuation">}</span>

                                entity<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |this<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                    this<span class="punctuation">.</span><span class="property">drag_position</span> = <span class="constructor">Some</span><span class="punctuation">(</span>
                                        ev<span class="punctuation">.</span><span class="property">position</span> - thumb_bounds<span class="punctuation">.</span><span class="property">origin</span> - table_bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">,</span>
                                    <span class="punctuation">);</span>
                                <span class="punctuation">})</span>
                            <span class="punctuation">}</span>
                        <span class="punctuation">});</span>
                        window<span class="punctuation">.</span><span class="property">on_mouse_event</span><span class="punctuation">({</span>
                            <span class="keyword">let</span> entity = entity<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
                            <span class="keyword">move</span> |_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseUpEvent</span><span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                                entity<span class="punctuation">.</span><span class="property">update</span><span class="punctuation">(</span>cx<span class="punctuation">,</span> |this<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                    this<span class="punctuation">.</span><span class="property">drag_position</span> = <span class="constructor">None</span><span class="punctuation">;</span>
                                <span class="punctuation">})</span>
                            <span class="punctuation">}</span>
                        <span class="punctuation">});</span>

                        window<span class="punctuation">.</span><span class="property">on_mouse_event</span><span class="punctuation">(</span><span class="keyword">move</span> |<span class="variable">ev</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">MouseMoveEvent</span><span class="punctuation">,</span> _<span class="punctuation">,</span> _<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                            <span class="keyword">if</span> !ev<span class="punctuation">.</span><span class="property">dragging</span><span class="punctuation">()</span> <span class="punctuation">{</span>
                                <span class="keyword">return</span><span class="punctuation">;</span>
                            <span class="punctuation">}</span>

                            <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>drag_pos<span class="punctuation">)</span> = entity<span class="punctuation">.</span><span class="property">read</span><span class="punctuation">(</span>cx<span class="punctuation">).</span><span class="property">drag_position</span> <span class="keyword">else</span> <span class="punctuation">{</span>
                                <span class="keyword">return</span><span class="punctuation">;</span>
                            <span class="punctuation">};</span>

                            <span class="keyword">let</span> inside_offset = drag_pos<span class="punctuation">.</span><span class="property">y</span><span class="punctuation">;</span>
                            <span class="keyword">let</span> percentage = <span class="punctuation">((</span>ev<span class="punctuation">.</span><span class="property">position</span><span class="punctuation">.</span><span class="property">y</span> - table_bounds<span class="punctuation">.</span><span class="property">origin</span><span class="punctuation">.</span><span class="property">y</span>
                                + inside_offset<span class="punctuation">)</span>
                                / <span class="punctuation">(</span>table_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span><span class="punctuation">))</span>
                                <span class="punctuation">.</span><span class="property">clamp</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">,</span> <span class="constant">1.</span><span class="punctuation">);</span>

                            <span class="keyword">let</span> offset_y = <span class="punctuation">((</span>scroll_height - table_bounds<span class="punctuation">.</span><span class="property">size</span><span class="punctuation">.</span><span class="property">height</span><span class="punctuation">)</span>
                                <span class="operator">*</span> percentage<span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">clamp</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> scroll_height - <span class="constructor">SCROLLBAR_THUMB_HEIGHT</span><span class="punctuation">);</span>
                            scroll_handle<span class="punctuation">.</span><span class="property">set_offset</span><span class="punctuation">(</span><span class="function">point</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">0.</span><span class="punctuation">),</span> -offset_y<span class="punctuation">));</span>
                            cx<span class="punctuation">.</span><span class="property">notify</span><span class="punctuation">(</span>entity<span class="punctuation">.</span><span class="property">entity_id</span><span class="punctuation">());</span>
                        <span class="punctuation">})</span>
                    <span class="punctuation">},</span>
                <span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">(),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">DataTable</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span>gpui<span class="punctuation">::</span><span class="function">white</span><span class="punctuation">())</span>
            <span class="punctuation">.</span><span class="property">text_sm</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">p_4</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">gap_2</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="macro">format!</span><span class="punctuation">(</span>
                <span class="string">&quot;Total {} items, visible range: {:?}&quot;</span><span class="punctuation">,</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">quotes</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span>
                <span class="variable">self</span><span class="punctuation">.</span><span class="property">visible_range</span>
            <span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                <span class="function">div</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_col</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">flex_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_1</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xE0E0E0</span><span class="punctuation">))</span>
                    <span class="punctuation">.</span><span class="property">rounded_sm</span><span class="punctuation">()</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">flex_row</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">w_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">overflow_hidden</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_b_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">border_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xE0E0E0</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x555555</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xF0F0F0</span><span class="punctuation">))</span>
                            <span class="punctuation">.</span><span class="property">py_1</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">px_2</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">text_xs</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">children</span><span class="punctuation">(</span><span class="constructor">FIELDS</span><span class="punctuation">.</span><span class="property">map</span><span class="punctuation">(</span>|<span class="punctuation">(</span>key<span class="punctuation">,</span> width<span class="punctuation">)</span>| <span class="punctuation">{</span>
                                <span class="function">div</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">whitespace_nowrap</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">flex_shrink_0</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">truncate</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">px_1</span><span class="punctuation">()</span>
                                    <span class="punctuation">.</span><span class="property">w</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span>width<span class="punctuation">))</span>
                                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>key<span class="punctuation">.</span><span class="property">replace</span><span class="punctuation">(</span><span class="string">&quot;_&quot;</span><span class="punctuation">,</span> <span class="string">&quot; &quot;</span><span class="punctuation">).</span><span class="property">to_uppercase</span><span class="punctuation">())</span>
                            <span class="punctuation">})),</span>
                    <span class="punctuation">)</span>
                    <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                        <span class="function">div</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">relative</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span>
                                <span class="function">uniform_list</span><span class="punctuation">(</span>
                                    <span class="string">&quot;items&quot;</span><span class="punctuation">,</span>
                                    <span class="variable">self</span><span class="punctuation">.</span><span class="property">quotes</span><span class="punctuation">.</span><span class="property">len</span><span class="punctuation">(),</span>
                                    cx<span class="punctuation">.</span><span class="property">processor</span><span class="punctuation">(</span><span class="keyword">move</span> |this<span class="punctuation">,</span> <span class="variable">range</span><span class="punctuation">:</span> <span class="type">Range</span><span class="punctuation">&lt;</span><span class="type">usize</span><span class="punctuation">&gt;,</span> _<span class="punctuation">,</span> _| <span class="punctuation">{</span>
                                        this<span class="punctuation">.</span><span class="property">visible_range</span> = range<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">();</span>
                                        <span class="keyword">let</span> <span class="keyword">mut</span> items = <span class="constructor">Vec</span><span class="punctuation">::</span><span class="function">with_capacity</span><span class="punctuation">(</span>range<span class="punctuation">.</span><span class="property">end</span> - range<span class="punctuation">.</span><span class="property">start</span><span class="punctuation">);</span>
                                        <span class="keyword">for</span> i <span class="keyword">in</span> range <span class="punctuation">{</span>
                                            <span class="keyword">if</span> <span class="keyword">let</span> <span class="constructor">Some</span><span class="punctuation">(</span>quote<span class="punctuation">)</span> = this<span class="punctuation">.</span><span class="property">quotes</span><span class="punctuation">.</span><span class="property">get</span><span class="punctuation">(</span>i<span class="punctuation">)</span> <span class="punctuation">{</span>
                                                items<span class="punctuation">.</span><span class="property">push</span><span class="punctuation">(</span><span class="constructor">TableRow</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">(</span>i<span class="punctuation">,</span> quote<span class="punctuation">.</span><span class="property">clone</span><span class="punctuation">()));</span>
                                            <span class="punctuation">}</span>
                                        <span class="punctuation">}</span>
                                        items
                                    <span class="punctuation">}),</span>
                                <span class="punctuation">)</span>
                                <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
                                <span class="punctuation">.</span><span class="property">track_scroll</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">scroll_handle</span><span class="punctuation">),</span>
                            <span class="punctuation">)</span>
                            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">.</span><span class="property">render_scrollbar</span><span class="punctuation">(</span>window<span class="punctuation">,</span> cx<span class="punctuation">)),</span>
                    <span class="punctuation">),</span>
            <span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span>
            <span class="type">WindowOptions</span> <span class="punctuation">{</span>
                <span class="property">focus</span><span class="punctuation">:</span> <span class="constant">true</span><span class="punctuation">,</span>
                <span class="property">window_bounds</span><span class="punctuation">:</span> <span class="constructor">Some</span><span class="punctuation">(</span><span class="constructor">WindowBounds</span><span class="punctuation">::</span><span class="constructor">Windowed</span><span class="punctuation">(</span><span class="constructor">Bounds</span><span class="punctuation">::</span><span class="function">centered</span><span class="punctuation">(</span>
                    <span class="constructor">None</span><span class="punctuation">,</span>
                    <span class="function">size</span><span class="punctuation">(</span><span class="function">px</span><span class="punctuation">(</span><span class="constant">1280.0</span><span class="punctuation">),</span> <span class="function">px</span><span class="punctuation">(</span><span class="constant">1000.0</span><span class="punctuation">)),</span>
                    cx<span class="punctuation">,</span>
                <span class="punctuation">))),</span>
                ..<span class="constructor">Default</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">()</span>
            <span class="punctuation">},</span>
            |_<span class="punctuation">,</span> cx| <span class="punctuation">{</span>
                cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="punctuation">{</span>
                    <span class="keyword">let</span> <span class="keyword">mut</span> table = <span class="constructor">DataTable</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">();</span>
                    table<span class="punctuation">.</span><span class="property">generate</span><span class="punctuation">();</span>
                    table
                <span class="punctuation">})</span>
            <span class="punctuation">},</span>
        <span class="punctuation">)</span>
        <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>

        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span></code></pre>
