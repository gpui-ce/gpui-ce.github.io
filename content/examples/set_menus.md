+++
title = "Set Menus"
description = ""
template = "page.html"

[extra]
run_command = "cargo run -p gpui --example set_menus"
source_file = "crates/gpui/examples/set_menus.rs"
+++

## Source Code

<pre><code class="language-rust"><span class="keyword">use</span> gpui<span class="punctuation">::{</span>
    <span class="constructor">App</span><span class="punctuation">,</span> <span class="constructor">Application</span><span class="punctuation">,</span> <span class="constructor">Context</span><span class="punctuation">,</span> <span class="constructor">Global</span><span class="punctuation">,</span> <span class="constructor">Menu</span><span class="punctuation">,</span> <span class="constructor">MenuItem</span><span class="punctuation">,</span> <span class="constructor">SharedString</span><span class="punctuation">,</span> <span class="constructor">SystemMenuType</span><span class="punctuation">,</span> <span class="constructor">Window</span><span class="punctuation">,</span>
    <span class="constructor">WindowOptions</span><span class="punctuation">,</span> actions<span class="punctuation">,</span> div<span class="punctuation">,</span> prelude<span class="punctuation">::</span><span class="operator">*</span><span class="punctuation">,</span> rgb<span class="punctuation">,</span>
<span class="punctuation">};</span>

<span class="keyword">struct</span> <span class="type">SetMenus</span><span class="punctuation">;</span>

<span class="keyword">impl</span> <span class="type">Render</span> <span class="keyword">for</span> <span class="type">SetMenus</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">render</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">,</span> <span class="variable">_window</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Window</span><span class="punctuation">,</span> <span class="variable">_cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">Context</span><span class="punctuation">&lt;</span><span class="type">Self</span><span class="punctuation">&gt;)</span> -&gt; <span class="keyword">impl</span> <span class="type">IntoElement</span> <span class="punctuation">{</span>
        <span class="function">div</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">flex</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">bg</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0x2e7d32</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">size_full</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">justify_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">items_center</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_xl</span><span class="punctuation">()</span>
            <span class="punctuation">.</span><span class="property">text_color</span><span class="punctuation">(</span><span class="function">rgb</span><span class="punctuation">(</span><span class="constant">0xffffff</span><span class="punctuation">))</span>
            <span class="punctuation">.</span><span class="property">child</span><span class="punctuation">(</span><span class="string">&quot;Set Menus Example&quot;</span><span class="punctuation">)</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">main</span><span class="punctuation">()</span> <span class="punctuation">{</span>
    <span class="constructor">Application</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">().</span><span class="property">run</span><span class="punctuation">(</span>|<span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span>| <span class="punctuation">{</span>
        cx<span class="punctuation">.</span><span class="property">set_global</span><span class="punctuation">(</span><span class="constructor">AppState</span><span class="punctuation">::</span><span class="function">new</span><span class="punctuation">());</span>

        <span class="comment">// Bring the menu bar to the foreground (so you can see the menu bar)</span>
        cx<span class="punctuation">.</span><span class="property">activate</span><span class="punctuation">(</span><span class="constant">true</span><span class="punctuation">);</span>
        <span class="comment">// Register the `quit` function so it can be referenced by the `MenuItem::action` in the menu bar</span>
        cx<span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>quit<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">on_action</span><span class="punctuation">(</span>toggle_check<span class="punctuation">);</span>
        <span class="comment">// Add menu items</span>
        <span class="function">set_app_menus</span><span class="punctuation">(</span>cx<span class="punctuation">);</span>
        cx<span class="punctuation">.</span><span class="property">open_window</span><span class="punctuation">(</span><span class="constructor">WindowOptions</span><span class="punctuation">::</span><span class="function">default</span><span class="punctuation">(),</span> |_<span class="punctuation">,</span> cx| cx<span class="punctuation">.</span><span class="property">new</span><span class="punctuation">(</span>|_| <span class="type">SetMenus</span> <span class="punctuation">{}))</span>
            <span class="punctuation">.</span><span class="property">unwrap</span><span class="punctuation">();</span>
    <span class="punctuation">});</span>
<span class="punctuation">}</span>

<span class="attribute">#</span><span class="punctuation">[</span><span class="attribute">derive</span><span class="punctuation">(</span><span class="constructor">PartialEq</span><span class="punctuation">)]</span>
<span class="keyword">enum</span> <span class="type">ViewMode</span> <span class="punctuation">{</span>
    <span class="constructor">List</span><span class="punctuation">,</span>
    <span class="constructor">Grid</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">ViewMode</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">toggle</span><span class="punctuation">(</span><span class="operator">&amp;</span><span class="keyword">mut</span> <span class="variable">self</span><span class="punctuation">)</span> <span class="punctuation">{</span>
        <span class="operator">*</span><span class="variable">self</span> = <span class="keyword">match</span> <span class="variable">self</span> <span class="punctuation">{</span>
            <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span> =&gt; <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">Grid</span><span class="punctuation">,</span>
            <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">Grid</span> =&gt; <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Into</span><span class="punctuation">&lt;</span><span class="type">SharedString</span><span class="punctuation">&gt;</span> <span class="keyword">for</span> <span class="type">ViewMode</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">into</span><span class="punctuation">(</span><span class="variable">self</span><span class="punctuation">)</span> -&gt; <span class="type">SharedString</span> <span class="punctuation">{</span>
        <span class="keyword">match</span> <span class="variable">self</span> <span class="punctuation">{</span>
            <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span> =&gt; <span class="string">&quot;List&quot;</span><span class="punctuation">,</span>
            <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">Grid</span> =&gt; <span class="string">&quot;Grid&quot;</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
        <span class="punctuation">.</span><span class="property">into</span><span class="punctuation">()</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">struct</span> <span class="type">AppState</span> <span class="punctuation">{</span>
    <span class="property">view_mode</span><span class="punctuation">:</span> <span class="type">ViewMode</span><span class="punctuation">,</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">AppState</span> <span class="punctuation">{</span>
    <span class="keyword">fn</span> <span class="function">new</span><span class="punctuation">()</span> -&gt; <span class="type">Self</span> <span class="punctuation">{</span>
        <span class="type">Self</span> <span class="punctuation">{</span>
            <span class="property">view_mode</span><span class="punctuation">:</span> <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span><span class="punctuation">,</span>
        <span class="punctuation">}</span>
    <span class="punctuation">}</span>
<span class="punctuation">}</span>

<span class="keyword">impl</span> <span class="type">Global</span> <span class="keyword">for</span> <span class="type">AppState</span> <span class="punctuation">{}</span>

<span class="keyword">fn</span> <span class="function">set_app_menus</span><span class="punctuation">(</span><span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> app_state = cx<span class="punctuation">.</span><span class="property">global</span><span class="punctuation">::&lt;</span><span class="type">AppState</span><span class="punctuation">&gt;();</span>
    cx<span class="punctuation">.</span><span class="property">set_menus</span><span class="punctuation">(</span><span class="macro">vec!</span><span class="punctuation">[</span><span class="type">Menu</span> <span class="punctuation">{</span>
        <span class="property">name</span><span class="punctuation">:</span> <span class="string">&quot;set_menus&quot;</span><span class="punctuation">.</span><span class="property">into</span><span class="punctuation">(),</span>
        <span class="property">items</span><span class="punctuation">:</span> <span class="macro">vec!</span><span class="punctuation">[</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">os_submenu</span><span class="punctuation">(</span><span class="string">&quot;Services&quot;</span><span class="punctuation">,</span> <span class="constructor">SystemMenuType</span><span class="punctuation">::</span><span class="constructor">Services</span><span class="punctuation">),</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">separator</span><span class="punctuation">(),</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">action</span><span class="punctuation">(</span><span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span><span class="punctuation">,</span> <span class="constructor">ToggleCheck</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">checked</span><span class="punctuation">(</span>app_state<span class="punctuation">.</span><span class="property">view_mode</span> == <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">List</span><span class="punctuation">),</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">action</span><span class="punctuation">(</span><span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">Grid</span><span class="punctuation">,</span> <span class="constructor">ToggleCheck</span><span class="punctuation">)</span>
                <span class="punctuation">.</span><span class="property">checked</span><span class="punctuation">(</span>app_state<span class="punctuation">.</span><span class="property">view_mode</span> == <span class="constructor">ViewMode</span><span class="punctuation">::</span><span class="constructor">Grid</span><span class="punctuation">),</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">separator</span><span class="punctuation">(),</span>
            <span class="constructor">MenuItem</span><span class="punctuation">::</span><span class="function">action</span><span class="punctuation">(</span><span class="string">&quot;Quit&quot;</span><span class="punctuation">,</span> <span class="constructor">Quit</span><span class="punctuation">),</span>
        <span class="punctuation">],</span>
    <span class="punctuation">}]);</span>
<span class="punctuation">}</span>

<span class="comment">// Associate actions using the `actions!` macro (or `Action` derive macro)</span>
<span class="macro">actions!</span><span class="punctuation">(</span>set_menus<span class="punctuation">,</span> <span class="punctuation">[</span><span class="constructor">Quit</span><span class="punctuation">,</span> <span class="constructor">ToggleCheck</span><span class="punctuation">]);</span>

<span class="comment">// Define the quit function that is registered with the App</span>
<span class="keyword">fn</span> <span class="function">quit</span><span class="punctuation">(</span>_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">Quit</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> <span class="punctuation">{</span>
    <span class="macro">println!</span><span class="punctuation">(</span><span class="string">&quot;Gracefully quitting the application . . .&quot;</span><span class="punctuation">);</span>
    cx<span class="punctuation">.</span><span class="property">quit</span><span class="punctuation">();</span>
<span class="punctuation">}</span>

<span class="keyword">fn</span> <span class="function">toggle_check</span><span class="punctuation">(</span>_<span class="punctuation">:</span> <span class="operator">&amp;</span><span class="type">ToggleCheck</span><span class="punctuation">,</span> <span class="variable">cx</span><span class="punctuation">:</span> <span class="operator">&amp;</span><span class="keyword">mut</span> <span class="type">App</span><span class="punctuation">)</span> <span class="punctuation">{</span>
    <span class="keyword">let</span> app_state = cx<span class="punctuation">.</span><span class="property">global_mut</span><span class="punctuation">::&lt;</span><span class="type">AppState</span><span class="punctuation">&gt;();</span>
    app_state<span class="punctuation">.</span><span class="property">view_mode</span><span class="punctuation">.</span><span class="property">toggle</span><span class="punctuation">();</span>
    <span class="function">set_app_menus</span><span class="punctuation">(</span>cx<span class="punctuation">);</span>
<span class="punctuation">}</span></code></pre>
