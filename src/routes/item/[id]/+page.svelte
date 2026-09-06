<script>
	import { formatPrice } from '$lib/items.js';

	let { data } = $props();
	let item = $derived(data.item);
</script>

<svelte:head>
	<title>{item.title} — The Room Exchange</title>
	<meta name="description" content={item.description} />
</svelte:head>


<article class="detail-shell">
	<div class="detail-image">
		<img src={item.image} alt={item.title} />
		<span class:item-sold={item.status === 'Sold'} class="detail-status">{item.status}</span>
	</div>

	<div class="detail-copy">
		<a class="back-link" href="/shop">← Back to inventory</a>
		<p class="eyebrow">{item.category} · {item.era}</p>
		<h1 class="detail-title">{item.title}</h1>
		<p class="detail-price">{formatPrice(item.price)}</p>
		<p class="detail-description">{item.description}</p>

		<dl class="item-specs">
			<div><dt>Dimensions</dt><dd>{item.dimensions}</dd></div>
			<div><dt>Condition</dt><dd>{item.condition}</dd></div>
			<div><dt>Materials</dt><dd>{item.materials}</dd></div>
		</dl>

		<div class="item-story">
			<p class="eyebrow">What we know</p>
			<p>{item.story}</p>
		</div>

		{#if item.status === 'Sold'}
			<div class="sold-note">
				<strong>This piece has been sold.</strong>
				<p>Browse the current collection for similar pieces.</p>
				<a class="button-link" href="/shop">See what is available <span>↗</span></a>
			</div>
		{:else}
			<a
				class="inquiry-button"
				href="tel:+18139092411"
			>
				<span>{item.status === 'Held' ? 'Ask about availability' : 'Call about this piece'}</span>
				<span aria-hidden="true">↗</span>
			</a>
		{/if}
	</div>
</article>
