<script>
	import { inventory, resetInventory } from '$lib/inventory-store.js';

	const blankItem = () => ({
		id: '',
		title: '',
		category: 'Furniture',
		era: '',
		price: 0,
		status: 'Available',
		image: '/sofa.jpg',
		dimensions: '',
		condition: 'Good',
		materials: '',
		description: '',
		story: '',
		dateAdded: new Date().toISOString().slice(0, 10),
		featured: false
	});

	let query = $state('');
	let selectedId = $state('');
	let draft = $state(blankItem());
	let notice = $state('');
	let editorOpen = $state(false);
	let creating = $state(false);

	let visibleItems = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return $inventory
			.filter((item) => !needle || [item.title, item.category, item.status].some((field) => field.toLowerCase().includes(needle)))
			.toSorted((a, b) => b.dateAdded.localeCompare(a.dateAdded));
	});

	function selectItem(item) {
		selectedId = item.id;
		draft = structuredClone(item);
		creating = false;
		editorOpen = true;
		notice = '';
	}

	function createItem() {
		selectedId = '';
		draft = blankItem();
		creating = true;
		editorOpen = true;
		notice = '';
	}

	function slugify(value) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function saveItem(event) {
		event.preventDefault();
		if (!draft.title.trim()) return;

		const next = structuredClone(draft);
		next.price = Number(next.price) || 0;
		next.id = selectedId || `${slugify(next.title) || 'piece'}-${Date.now().toString(36)}`;

		inventory.update((items) => {
			const index = items.findIndex((item) => item.id === selectedId);
			if (index === -1) return [next, ...items];
			return items.map((item, itemIndex) => (itemIndex === index ? next : item));
		});

		selectedId = next.id;
		draft = structuredClone(next);
		creating = false;
		notice = 'Saved. The public catalog is updated.';
	}

	function setStatus(nextStatus) {
		draft.status = nextStatus;
	}

	function removeItem() {
		if (!selectedId || !confirm(`Remove ${draft.title} from this demo?`)) return;
		inventory.update((items) => items.filter((item) => item.id !== selectedId));
		selectedId = '';
		draft = blankItem();
		editorOpen = false;
		notice = 'Piece removed.';
	}

	function restoreDemo() {
		if (!confirm('Restore the original demonstration inventory?')) return;
		resetInventory();
		selectedId = '';
		draft = blankItem();
		editorOpen = false;
		notice = 'Demo inventory restored.';
	}

	function loadImage(event) {
		const file = event.currentTarget.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			draft.image = String(reader.result);
		};
		reader.readAsDataURL(file);
	}
</script>

<svelte:head>
	<title>Inventory Desk — The Room Exchange Concept</title>
</svelte:head>

<div class="admin-shell" class:editor-open={editorOpen}>
	<section class="admin-list-pane">
		<header class="admin-heading">
			<div>
				<p class="eyebrow">Private demonstration</p>
				<h1>Inventory desk</h1>
			</div>
			<button class="new-piece-button" type="button" onclick={createItem}>+ New piece</button>
		</header>

		<div class="admin-search-row">
			<label>
				<span>Search inventory</span>
				<input bind:value={query} placeholder="Name, category, or status" />
			</label>
			<p>{$inventory.length} total</p>
		</div>

		{#if notice && !editorOpen}
			<p class="admin-notice">{notice}</p>
		{/if}

		<div class="admin-items">
			{#each visibleItems as item (item.id)}
				<button
					class:active={selectedId === item.id}
					type="button"
					onclick={() => selectItem(item)}
				>
					<img src={item.image} alt="" />
					<span class="admin-item-copy">
						<strong>{item.title}</strong>
						<small>{item.category} · ${item.price.toLocaleString('en-US')}</small>
					</span>
					<span class:available={item.status === 'Available'} class="admin-item-status">{item.status}</span>
					<span class="admin-item-arrow" aria-hidden="true">→</span>
				</button>
			{/each}
		</div>

		<footer class="admin-list-footer">
			<p>Changes are saved in this browser for the demo.</p>
			<button type="button" onclick={restoreDemo}>Restore demo inventory</button>
		</footer>
	</section>

	<section class="admin-editor-pane">
		{#if editorOpen}
			<header class="editor-heading">
				<button class="editor-back" type="button" onclick={() => (editorOpen = false)}>← Inventory</button>
				<div>
					<p class="eyebrow">{creating ? 'Add to catalog' : 'Edit catalog record'}</p>
					<h2>{creating ? 'New piece' : draft.title}</h2>
				</div>
			</header>

			<form class="editor-form" onsubmit={saveItem}>
				<div class="editor-photo">
					<img src={draft.image} alt="Current item preview" />
					<label class="photo-button">
						<span>Take or choose a photo</span>
						<input type="file" accept="image/*" capture="environment" onchange={loadImage} />
					</label>
				</div>

				<div class="quick-status">
					<span>Listing status</span>
					<div>
						{#each ['Available', 'Held', 'Sold'] as option}
							<button class:active={draft.status === option} type="button" onclick={() => setStatus(option)}>{option}</button>
						{/each}
					</div>
				</div>

				<div class="form-grid">
					<label class="span-two"><span>Title</span><input required bind:value={draft.title} /></label>
					<label><span>Category</span><input required bind:value={draft.category} /></label>
					<label><span>Era</span><input bind:value={draft.era} placeholder="Mid-century, 1920s…" /></label>
					<label><span>Price</span><div class="money-input"><span>$</span><input type="number" min="0" step="1" bind:value={draft.price} /></div></label>
					<label><span>Condition</span><select bind:value={draft.condition}><option>Excellent</option><option>Very good</option><option>Good</option><option>Fair</option><option>As found</option></select></label>
					<label class="span-two"><span>Dimensions</span><input bind:value={draft.dimensions} placeholder="48 W × 24 D × 30 H in." /></label>
					<label class="span-two"><span>Materials</span><input bind:value={draft.materials} /></label>
					<label class="span-two"><span>Short description</span><textarea rows="3" bind:value={draft.description}></textarea></label>
					<label class="span-two"><span>Story / provenance</span><textarea rows="3" bind:value={draft.story}></textarea></label>
					<label class="feature-toggle span-two"><input type="checkbox" bind:checked={draft.featured} /><span>Feature this piece on the home page</span></label>
				</div>

				{#if notice}
					<p class="admin-notice">{notice}</p>
				{/if}

				<div class="editor-actions">
					<button class="save-button" type="submit">Save to catalog</button>
					{#if !creating}<button class="delete-button" type="button" onclick={removeItem}>Remove piece</button>{/if}
				</div>
			</form>
		{:else}
			<div class="editor-empty">
				<p class="eyebrow">Catalog controls</p>
				<h2>Select a piece to edit it.</h2>
				<p>Update availability, correct details, or add a new arrival right from a phone.</p>
				<button class="button-link" type="button" onclick={createItem}>Add a new piece <span>↗</span></button>
			</div>
		{/if}
	</section>
</div>
