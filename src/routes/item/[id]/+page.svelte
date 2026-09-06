<script>
	import { formatPrice } from '$lib/items.js';
	import { inventory } from '$lib/inventory-store.js';

	let { data } = $props();
	let item = $derived($inventory.find((entry) => entry.id === data.id));
</script>

<svelte:head>
	<title>{item ? `${item.title} — The Room Exchange` : 'Item Not Found — The Room Exchange'}</title>
	<meta name="description" content={item?.description ?? 'Browse sample inventory for The Room Exchange.'} />
</svelte:head>

{#if item}
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
{:else}
	<section class="missing-item">
		<p class="eyebrow">Item not found</p>
		<h1 class="page-title">This piece may have moved on.</h1>
		<a class="button-link" href="/shop">Browse the current collection <span>↗</span></a>
	</section>
{/if}
