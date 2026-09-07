<script>
	import ItemCard from '$lib/components/ItemCard.svelte';

	let { data } = $props();

	let query = $state('');
</script>

<svelte:head>
	<title>The Room Exchange — See What Is in the Showroom</title>
</svelte:head>

<section class="hero">
	<div class="hero-image">
		<img src="/hero.jpg" alt="A richly stocked shop filled with furniture, lighting, and collected objects" />
	</div>
	<div class="hero-copy">
		<p class="eyebrow">Consignment furniture & home décor · Carrollwood, Tampa</p>
		<h1>Make room for<br />something different.</h1>
		<p class="hero-intro">Browse furniture, décor, and one-of-a-kind finds available now at The Room Exchange.</p>
		<form class="hero-search" action="/shop">
			<label for="hero-query">Search the showroom</label>
			<div>
				<input id="hero-query" name="q" bind:value={query} placeholder="Sectional, dining table, décor…" />
				<button type="submit" aria-label="Search inventory">Browse <span>↗</span></button>
			</div>
		</form>
	</div>
	<a class="hero-note" href="/shop">
		<span>New arrivals</span>
		<strong>Fresh pieces arrive throughout the week</strong>
		<span aria-hidden="true">→</span>
	</a>
</section>

<section class="section-shell arrivals">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Sample inventory</p>
			<h2>Recently added</h2>
		</div>
		<a class="text-link" href="/shop">View everything <span>↗</span></a>
	</div>

		<div class="featured-grid">
			{#each data.featured as item, index (item.id)}
				<ItemCard {item} {index} isAdmin={data.isAdmin} />
			{/each}
		</div>
</section>

<section class="split-section" id="visit">
	<div class="split-image">
		<img src="/sideboard.jpg" alt="An interior filled with collected furniture" loading="lazy" />
	</div>
	<div class="split-copy">
		<p class="eyebrow">Come see the showroom</p>
		<h2>Furniture is better in person.</h2>
		<p>Browse first, then visit the showroom to see the condition, scale, and details for yourself. Items move quickly, so call before making the drive.</p>
		<dl class="shop-details">
			<div><dt>Address</dt><dd>14340 N Dale Mabry Hwy<br />Tampa, FL 33618</dd></div>
			<div><dt>Hours</dt><dd>Tue–Sat, 10–6<br />Sun, 12–5 · Mon closed</dd></div>
		</dl>
		<a class="button-link" href="https://www.google.com/maps/search/?api=1&query=The+Room+Exchange+14340+N+Dale+Mabry+Hwy+Tampa+FL+33618" target="_blank" rel="noreferrer">Get directions <span>↗</span></a>
	</div>
</section>

<section class="consign-section" id="consign">
	<p class="eyebrow">Ready to make some room?</p>
	<div>
		<h2>Show us what you would like to consign.</h2>
		<div class="consign-copy">
			<p>Send clear photographs, dimensions, and any condition notes. The store can review the piece and help arrange an appointment if it may be a fit.</p>
			<a class="text-link light" href="mailto:theroomexchange@gmail.com?subject=Consignment%20inquiry">Email consignment photos <span>↗</span></a>
		</div>
	</div>
</section>
