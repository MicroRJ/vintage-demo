<script>
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { inventory } from '$lib/inventory-store.js';

	let query = $state('');
	let featured = $derived($inventory.filter((item) => item.featured).slice(0, 3));
</script>

<svelte:head>
	<title>Found Again — Objects Worth Another Life</title>
</svelte:head>

<section class="hero">
	<div class="hero-image">
		<img src="/hero.jpg" alt="A richly stocked shop filled with furniture, lighting, and collected objects" />
	</div>
	<div class="hero-copy">
		<p class="eyebrow">Vintage furniture & found objects · Tampa, Florida</p>
		<h1>Objects worth<br />another life.</h1>
		<p class="hero-intro">The pieces change every week. The good ones rarely stay long.</p>
		<form class="hero-search" action="/shop">
			<label for="hero-query">Search what is in the shop now</label>
			<div>
				<input id="hero-query" name="q" bind:value={query} placeholder="Leather sofa, walnut, lighting…" />
				<button type="submit" aria-label="Search inventory">Browse <span>↗</span></button>
			</div>
		</form>
	</div>
	<a class="hero-note" href="/shop">
		<span>Just in</span>
		<strong>New pieces added September 4</strong>
		<span aria-hidden="true">→</span>
	</a>
</section>

<section class="section-shell arrivals">
	<div class="section-heading">
		<div>
			<p class="eyebrow">The latest edit</p>
			<h2>New arrivals</h2>
		</div>
		<a class="text-link" href="/shop">View everything <span>↗</span></a>
	</div>

	<div class="featured-grid">
		{#each featured as item, index (item.id)}
			<ItemCard {item} {index} />
		{/each}
	</div>
</section>

<section class="split-section" id="visit">
	<div class="split-image">
		<img src="/sideboard.jpg" alt="An interior filled with collected furniture" loading="lazy" />
	</div>
	<div class="split-copy">
		<p class="eyebrow">Come see it in person</p>
		<h2>A changing room of things worth keeping.</h2>
		<p>Inventory moves quickly and photographs only tell half the story. Visit the shop, sit down, open the drawers, and take your time.</p>
		<dl class="shop-details">
			<div><dt>Address</dt><dd>1724 N Franklin St.<br />Tampa, FL 33602</dd></div>
			<div><dt>Hours</dt><dd>Thu–Sat, 10–6<br />Sun, 11–4</dd></div>
		</dl>
		<a class="button-link" href="https://maps.google.com">Get directions <span>↗</span></a>
	</div>
</section>

<section class="consign-section" id="consign">
	<p class="eyebrow">Have something good?</p>
	<div>
		<h2>Make room without throwing the story away.</h2>
		<div class="consign-copy">
			<p>Send a few photographs, dimensions, and anything you know about the piece. We will tell you if it is a fit and explain the consignment process clearly.</p>
			<a class="text-link light" href="mailto:hello@foundagain.example?subject=Consignment inquiry">Start a consignment inquiry <span>↗</span></a>
		</div>
	</div>
</section>
