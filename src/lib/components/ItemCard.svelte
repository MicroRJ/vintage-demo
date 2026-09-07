<script>
	import { formatPrice } from '$lib/items.js';
	let { item, index = 0, isAdmin = false } = $props();
</script>

<article class="item-card">
	<div class="item-card-media">
		<a class="item-image" href={`/item/${item.id}`} aria-label={`View ${item.title}`}>
			<img src={item.image} alt={item.title} loading={index > 2 ? 'lazy' : 'eager'} />
			{#if item.status !== 'Available'}
				<span class:item-sold={item.status === 'Sold'} class="item-status">{item.status}</span>
			{/if}
		</a>
		{#if isAdmin}
			<a class="item-card-edit" href={`/admin?item=${encodeURIComponent(item.id)}`}>
				Edit listing <span aria-hidden="true">→</span>
			</a>
		{/if}
	</div>
	<div class="item-card-copy">
		<div>
			<p class="item-meta">{item.category} · {item.era}</p>
			<h3><a href={`/item/${item.id}`}>{item.title}</a></h3>
		</div>
		<p class="item-price">{formatPrice(item.price)}</p>
	</div>
</article>
