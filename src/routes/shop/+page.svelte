<script>
	import { page } from '$app/state';
	import ItemCard from '$lib/components/ItemCard.svelte';

	let { data } = $props();

	let query = $state(page.url.searchParams.get('q') ?? '');
	let category = $state('All');
	let status = $state('Available');
	let sort = $state('newest');
	let viewMode = $state('gallery');
	let minPrice = $state();
	let maxPrice = $state();
	let filtersOpen = $state(false);
	let sortOpen = $state(false);

	let categoryOptions = $derived(['All', ...new Set(data.items.map((item) => item.category))]);
	let statusOptions = ['Available', 'Held', 'Sold', 'All'];
	let sortOptions = [
		{ value: 'newest', label: 'Newest first' },
		{ value: 'price-low', label: 'Price: low to high' },
		{ value: 'price-high', label: 'Price: high to low' },
		{ value: 'title', label: 'Name' }
	];
	let hasFilters = $derived(
		Boolean(query) || category !== 'All' || status !== 'Available' || minPrice != null || maxPrice != null
	);
	let activeFilterCount = $derived(
		Number(Boolean(query)) +
		Number(category !== 'All') +
		Number(status !== 'Available') +
		Number(minPrice != null || maxPrice != null)
	);
	let results = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		const minimum = minPrice == null ? null : Number(minPrice);
		const maximum = maxPrice == null ? null : Number(maxPrice);
		const filtered = data.items.filter((item) => {
			const matchesQuery = !needle || [
				item.title,
				item.category,
				item.era,
				item.materials,
				item.description
			].some((field) => field.toLowerCase().includes(needle));
			const matchesCategory = category === 'All' || item.category === category;
			const matchesStatus = status === 'All' || item.status === status;
			const matchesMinimum = minimum == null || item.price >= minimum;
			const matchesMaximum = maximum == null || item.price <= maximum;
			return matchesQuery && matchesCategory && matchesStatus && matchesMinimum && matchesMaximum;
		});

		return filtered.toSorted((a, b) => {
			if (sort === 'price-low') return a.price - b.price;
			if (sort === 'price-high') return b.price - a.price;
			if (sort === 'title') return a.title.localeCompare(b.title);
			return b.dateAdded.localeCompare(a.dateAdded);
		});
	});

	function categoryCount(option) {
		return option === 'All' ? data.items.length : data.items.filter((item) => item.category === option).length;
	}

	function clearFilters() {
		query = '';
		category = 'All';
		status = 'Available';
		minPrice = undefined;
		maxPrice = undefined;
	}

	function openFilters() {
		sortOpen = false;
		filtersOpen = true;
	}

	function toggleSort() {
		filtersOpen = false;
		sortOpen = !sortOpen;
	}

	function closeMobileControls() {
		filtersOpen = false;
		sortOpen = false;
	}

	function chooseSort(value) {
		sort = value;
		sortOpen = false;
	}

	function toggleViewMode() {
		viewMode = viewMode === 'gallery' ? 'grid' : 'gallery';
	}

	function openSiteMenu() {
		closeMobileControls();
		window.dispatchEvent(new CustomEvent('open-mobile-site-menu'));
	}
</script>

<svelte:head>
	<title>Current Inventory — The Room Exchange</title>
</svelte:head>

<section class="marketplace-shell">
	<header class="marketplace-heading">
		<div>
			<p class="eyebrow">Current inventory</p>
			<h1>Browse the showroom.</h1>
		</div>
		<p>Furniture and decor currently listed by The Room Exchange.</p>
	</header>

	<div class="marketplace-layout">
		<aside id="mobile-inventory-filters" class="marketplace-filters" class:open={filtersOpen} aria-label="Inventory filters">
			<div class="mobile-filter-heading">
				<strong>Search & filters</strong>
				<button type="button" onclick={() => (filtersOpen = false)} aria-label="Close filters">×</button>
			</div>

			<label class="marketplace-search">
				<span>Search inventory</span>
				<div><span aria-hidden="true">⌕</span><input bind:value={query} placeholder="Sofa, dining, wood…" /></div>
			</label>

			<div class="marketplace-filter-section">
				<p>Category</p>
				<div class="marketplace-options">
					{#each categoryOptions as option}
						<button class:active={category === option} type="button" onclick={() => (category = option)}>
							<span>{option === 'All' ? 'All inventory' : option}</span>
							<small>{categoryCount(option)}</small>
						</button>
					{/each}
				</div>
			</div>

			<div class="marketplace-filter-section">
				<p>Availability</p>
				<div class="marketplace-options compact">
					{#each statusOptions as option}
						<button class:active={status === option} type="button" onclick={() => (status = option)}>
							<span>{option === 'All' ? 'Any status' : option}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="marketplace-filter-section">
				<p>Price</p>
				<div class="price-range">
					<label><span>Minimum</span><input type="number" min="0" bind:value={minPrice} placeholder="$0" /></label>
					<span aria-hidden="true">—</span>
					<label><span>Maximum</span><input type="number" min="0" bind:value={maxPrice} placeholder="Any" /></label>
				</div>
			</div>

			<label class="marketplace-select">
				<span>Sort by</span>
				<select bind:value={sort}>
					<option value="newest">Newest first</option>
					<option value="price-low">Price: low to high</option>
					<option value="price-high">Price: high to low</option>
					<option value="title">Name</option>
				</select>
			</label>

			{#if hasFilters}
				<button class="marketplace-clear" type="button" onclick={clearFilters}>Clear all filters</button>
			{/if}

			<button class="mobile-show-results" type="button" onclick={() => (filtersOpen = false)}>
				Show {results.length} {results.length === 1 ? 'listing' : 'listings'}
			</button>
		</aside>

		<div class="marketplace-results">
			<header class="catalog-summary">
				<div>
					<h2>{category === 'All' ? 'All inventory' : category}</h2>
					<p>{results.length} {results.length === 1 ? 'listing' : 'listings'}</p>
				</div>
				<div class="catalog-summary-actions">
					<div class="catalog-view-switch" aria-label="Inventory view">
						<button class:active={viewMode === 'gallery'} aria-pressed={viewMode === 'gallery'} type="button" onclick={() => (viewMode = 'gallery')}>Gallery</button>
						<button class:active={viewMode === 'grid'} aria-pressed={viewMode === 'grid'} type="button" onclick={() => (viewMode = 'grid')}>Grid</button>
					</div>
				</div>
			</header>

			{#if results.length}
				<div class="catalog-grid" class:grid-view={viewMode === 'grid'}>
					{#each results as item, index (item.id)}
						<ItemCard {item} {index} isAdmin={data.isAdmin} />
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p class="eyebrow">No matches</p>
					<h2>Try a broader search.</h2>
					<p>The inventory changes often. If you are hunting for something specific, call the store.</p>
					<button class="button-link" type="button" onclick={clearFilters}>Clear filters <span>↗</span></button>
				</div>
			{/if}
		</div>
	</div>
</section>

{#if filtersOpen || sortOpen}
	<button class="mobile-control-backdrop" type="button" aria-label="Close inventory controls" onclick={closeMobileControls}></button>
{/if}

	<div class="mobile-sort-menu" class:open={sortOpen} aria-label="Sort inventory" aria-hidden={!sortOpen}>
		<div class="mobile-filter-heading">
			<strong>Sort inventory</strong>
			<button type="button" onclick={() => (sortOpen = false)} aria-label="Close sorting">×</button>
		</div>
		<div class="mobile-sort-options">
			{#each sortOptions as option}
				<button class:active={sort === option.value} type="button" onclick={() => chooseSort(option.value)}>
					<span>{option.label}</span>
					<span aria-hidden="true">{sort === option.value ? '✓' : ''}</span>
				</button>
			{/each}
		</div>
	</div>

<nav class="mobile-marketplace-bar" aria-label="Inventory controls">
	<button type="button" onclick={openSiteMenu}>
		<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
		<span>Menu</span>
	</button>
	<button type="button" aria-expanded={filtersOpen} aria-controls="mobile-inventory-filters" onclick={openFilters}>
		<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
		<span>Search{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
	</button>
	<button type="button" aria-expanded={sortOpen} onclick={toggleSort}>
		<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v16m0-16L4.5 7.5M8 4l3.5 3.5M16 20V4m0 16-3.5-3.5M16 20l3.5-3.5" /></svg>
		<span>Sort</span>
	</button>
	<button type="button" onclick={toggleViewMode}>
		{#if viewMode === 'gallery'}
			<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>
		{:else}
			<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" /><path d="m5.5 17 4.5-4.5 3 3 2.5-2.5 3 3M15.5 9h.01" /></svg>
		{/if}
		<span>{viewMode === 'gallery' ? 'Grid' : 'Gallery'}</span>
	</button>
</nav>
