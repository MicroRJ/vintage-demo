<script>
	import { page } from '$app/state';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { inventory } from '$lib/inventory-store.js';

	let query = $state(page.url.searchParams.get('q') ?? '');
	let category = $state('All');
	let status = $state('Available');
	let sort = $state('newest');

	let categoryOptions = $derived(['All', ...new Set($inventory.map((item) => item.category))]);
	let results = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		const filtered = $inventory.filter((item) => {
			const matchesQuery = !needle || [
				item.title,
				item.category,
				item.era,
				item.materials,
				item.description
			].some((field) => field.toLowerCase().includes(needle));
			const matchesCategory = category === 'All' || item.category === category;
			const matchesStatus = status === 'All' || item.status === status;
			return matchesQuery && matchesCategory && matchesStatus;
		});

		return filtered.toSorted((a, b) => {
			if (sort === 'price-low') return a.price - b.price;
			if (sort === 'price-high') return b.price - a.price;
			if (sort === 'title') return a.title.localeCompare(b.title);
			return b.dateAdded.localeCompare(a.dateAdded);
		});
	});
</script>

<svelte:head>
	<title>Shop the Collection — Found Again</title>
</svelte:head>

<header class="page-hero shop-hero">
	<p class="eyebrow">Current inventory</p>
	<h1 class="page-title">Find what<br />you came for.</h1>
	<p>Every piece is one of one. Available inventory is updated as pieces arrive, sell, or go on hold.</p>
</header>

<section class="catalog-shell">
	<div class="catalog-toolbar">
		<label class="catalog-search">
			<span>Search</span>
			<input bind:value={query} placeholder="Try leather, table, teak…" />
		</label>

		<div class="filter-group" aria-label="Filter by category">
			<span>Category</span>
			<div class="filter-options">
				{#each categoryOptions as option}
					<button class:active={category === option} type="button" onclick={() => (category = option)}>{option}</button>
				{/each}
			</div>
		</div>

		<label class="select-filter">
			<span>Status</span>
			<select bind:value={status}>
				<option>Available</option>
				<option>Reserved</option>
				<option>Sold</option>
				<option>All</option>
			</select>
		</label>

		<label class="select-filter">
			<span>Sort by</span>
			<select bind:value={sort}>
				<option value="newest">Newest</option>
				<option value="price-low">Price: low to high</option>
				<option value="price-high">Price: high to low</option>
				<option value="title">Name</option>
			</select>
		</label>
	</div>

	<div class="catalog-summary">
		<p>{results.length} {results.length === 1 ? 'piece' : 'pieces'}</p>
		{#if query || category !== 'All' || status !== 'Available'}
			<button type="button" onclick={() => { query = ''; category = 'All'; status = 'Available'; }}>Clear filters</button>
		{/if}
	</div>

	{#if results.length}
		<div class="catalog-grid">
			{#each results as item, index (item.id)}
				<ItemCard {item} {index} />
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p class="eyebrow">Nothing here yet</p>
			<h2>Try a broader search.</h2>
			<p>The inventory changes often. If you are hunting for something specific, send us a note.</p>
			<a class="button-link" href="mailto:hello@foundagain.example">Tell us what you need <span>↗</span></a>
		</div>
	{/if}
</section>

