+++
title = "Tracks of Work"
template = "tracks.html"
+++

I don't want to call this a roadmap yet as things are early days and we are still planning but... here are some high level tracks I think we want to focus on in the community edition of gpui.

Ideally, each of these tracks would have a community leader that oversees it and is responsible for the quality of code and overall direction of any PRs merging in to their track.

### Developer Experience

Taking a look at the overall developer experience of gpui, and where it can improve

- Investigate removing `.id()`
- Split up div into more composable pieces, making it easier to build custom elements
- Provide a http client out of the box

### Education

How do we bring more people into gpui and make it sticky? 
What are the problems people run into when trying to create an app for the first time?
What will it take to push `gpui-ce` to the first spot under UI on blessed.rs?

- improve documentation
- clean up & organize examples
- Have an "Intro to gpui" tutorial (ala svelte: https://svelte.dev/tutorial/svelte/welcome-to-svelte)
- have a `gpui-ce/gpui-examples` repo with MUCH more complex examples. Full apps like todo, stickies, etc to better show dataflow and overall design structure

### UI

Support more out of the box without compromising the value and power of being able to define an element to do anything in gpui. Less is more, ship a few, high quality improvements that make it easier to get up and running quicker.

- add native input element
- consider any other core, required element (button? rich text?)
- ship a first party ui toolkit outside of gpui similar to the relationship between svelte & sveltekit. 
  - an optional addition and alternative to other ui component kits out there like `gpui-component`, `adabraka-ui`, etc.

### Observability & Performance

- where are the hot paths?
- measurable performance diffs for changes
- benchmarks with overall performance for various goals (2d drawing, # of elements on screen, scroll perf, etc)

### Experimental

What if we get a bit crazy?

- vello
- parley
- palette
