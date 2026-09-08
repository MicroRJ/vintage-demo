<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import { formatPrice } from '$lib/items.js';

	let { data } = $props();
	const maxImageDimension = 2000;
	const maxImageBytes = 3 * 1024 * 1024;

	function getInitialItem() {
		return data.item;
	}

	function getInitialCreating() {
		return data.createNew;
	}

	const initialItem = getInitialItem();

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

	function itemFingerprint(item) {
		return JSON.stringify([
			item.title,
			item.category,
			item.era,
			Number(item.price),
			item.status,
			item.image,
			item.dimensions,
			item.condition,
			item.materials,
			item.description,
			item.story,
			Boolean(item.featured)
		]);
	}

	let selectedId = $state(initialItem?.id ?? '');
	let draft = $state(initialItem ? structuredClone(initialItem) : blankItem());
	let savedFingerprint = $state(initialItem ? itemFingerprint(initialItem) : '');
	let notice = $state('');
	let saveState = $state('idle');
	let creating = $state(getInitialCreating());
	let localPreviewUrl = $state('');
	let imageInput = $state();
	let processingImage = $state(false);
	let imageError = $state('');
	let previewImage = $derived(localPreviewUrl || draft.image);
	let isDirty = $derived(creating || itemFingerprint(draft) !== savedFingerprint);

	function setStatus(nextStatus) {
		draft.status = nextStatus;
	}

	function updateTitle(event) {
		draft.title = event.currentTarget.value.replace(/[\r\n]+/g, ' ');
	}

	function clearPendingImage() {
		if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
		if (imageInput) imageInput.value = '';
		localPreviewUrl = '';
		processingImage = false;
		imageError = '';
	}

	function decodeImage(file) {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const image = new Image();
			image.onload = () => {
				URL.revokeObjectURL(url);
				resolve(image);
			};
			image.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error('Unable to read this image.'));
			};
			image.src = url;
		});
	}

	function encodeJpeg(canvas, quality) {
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('Unable to resize this image.'))),
				'image/jpeg',
				quality
			);
		});
	}

	async function chooseImage(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			imageError = 'Choose a JPEG, PNG, WebP, or phone photo.';
			input.value = '';
			return;
		}

		processingImage = true;
		imageError = '';
		notice = '';

		try {
			const image = await decodeImage(file);
			const scale = Math.min(1, maxImageDimension / Math.max(image.naturalWidth, image.naturalHeight));
			const canvas = document.createElement('canvas');
			canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
			canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
			const context = canvas.getContext('2d');
			if (!context) throw new Error('Unable to prepare this image.');

			context.fillStyle = '#e8e2d7';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.drawImage(image, 0, 0, canvas.width, canvas.height);

			let blob = await encodeJpeg(canvas, 0.86);
			if (blob.size > maxImageBytes) blob = await encodeJpeg(canvas, 0.72);
			if (blob.size > maxImageBytes) blob = await encodeJpeg(canvas, 0.58);
			if (blob.size > maxImageBytes) {
				throw new Error('That photo is still too large after resizing. Try a smaller image.');
			}

			const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-') || 'inventory-photo';
			const processedFile = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
			if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
			localPreviewUrl = URL.createObjectURL(processedFile);

			const uploadData = new FormData();
			uploadData.set('imageFile', processedFile, processedFile.name);
			const response = await fetch('/admin/photo', { method: 'POST', body: uploadData });
			const result = await response.json();
			if (!response.ok || !result.url) {
				throw new Error(result.message || 'The photo could not be uploaded.');
			}

			draft.image = result.url;
			URL.revokeObjectURL(localPreviewUrl);
			localPreviewUrl = '';
			input.value = '';
			notice = 'Photo uploaded. Save the listing to publish it.';
		} catch (error) {
			imageError = error instanceof Error ? error.message : 'That image could not be processed.';
			if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
			localPreviewUrl = '';
			input.value = '';
		} finally {
			processingImage = false;
		}
	}

	function confirmRemoval(event) {
		if (!confirm(`Remove ${draft.title} from the public catalog?`)) {
			event.preventDefault();
		}
	}

	function enhanceEditor({ cancel }) {
		if (processingImage) {
			cancel();
			imageError = 'Wait for the photo to finish processing before saving.';
			return;
		}

		notice = '';
		saveState = 'saving';

		return async ({ result, update }) => {
			await update({ reset: false });

			if (result.type !== 'success') {
				notice = result.data?.message ?? 'The change could not be saved.';
				saveState = 'error';
				return;
			}

			if (result.data.operation === 'remove') {
				clearPendingImage();
				await goto('/shop');
				return;
			}

			const wasCreating = creating;
			selectedId = result.data.item.id;
			clearPendingImage();
			draft = structuredClone(result.data.item);
			savedFingerprint = itemFingerprint(result.data.item);
			creating = false;
			saveState = 'saved';

			if (wasCreating) {
				await goto(`/admin?item=${encodeURIComponent(selectedId)}`, { replaceState: true });
			}
		};
	}

	function facebookPostText() {
		const statusLead = {
			Available: 'Now available',
			Held: 'Currently held',
			Sold: 'Sold'
		}[draft.status] ?? 'Inventory update';
		const itemUrl = `${window.location.origin}/item/${encodeURIComponent(selectedId)}`;
		const details = [draft.category, draft.era, draft.condition].filter(Boolean).join(' · ');

		return [
			`${statusLead}: ${draft.title}`,
			draft.description.trim(),
			[formatPrice(Number(draft.price) || 0), details].filter(Boolean).join(' · '),
			`View current availability and details: ${itemUrl}`,
			'The Room Exchange\n14340 N Dale Mabry Hwy, Tampa, FL\n(813) 909-2411'
		]
			.filter(Boolean)
			.join('\n\n');
	}

	async function copyFacebookPost() {
		const post = facebookPostText();

		try {
			await navigator.clipboard.writeText(post);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = post;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.append(textarea);
			textarea.select();
			document.execCommand('copy');
			textarea.remove();
		}

		notice = 'Facebook post copied. Paste it into the Page composer when you are ready.';
	}
</script>

<svelte:head>
	<title>Inventory Desk — The Room Exchange Concept</title>
</svelte:head>

<div class="admin-shell editor-only editor-open">
	<section class="admin-editor-pane">
		<header class="editor-heading" class:has-unsaved-changes={isDirty}>
			<a class="editor-back" href="/shop"><Icon name="arrow-left" /> Inventory</a>
			<div class="editor-heading-copy">
				<p class="eyebrow">Inventory editor</p>
				<h2>{creating ? 'New listing' : 'Edit listing'}</h2>
				<p
					class="editor-save-state"
					class:unsaved={isDirty}
					class:error={saveState === 'error'}
					aria-live="polite"
				>
					{saveState === 'saving'
						? 'Saving…'
						: saveState === 'error'
							? 'Save failed · changes remain'
							: isDirty
								? 'Unsaved changes'
								: 'All changes saved'}
				</p>
			</div>
			<div class="editor-heading-actions">
				<button
					class="save-button editor-header-save"
					class:active={isDirty}
					type="submit"
					form="item-editor"
					disabled={!isDirty || saveState === 'saving'}
				>
					<span class="desktop-save-label">{saveState === 'saving' ? 'Saving…' : creating ? 'Add piece' : 'Save changes'}</span>
					<span class="mobile-save-label">{saveState === 'saving' ? 'Saving…' : creating ? 'Add' : 'Save'}</span>
					<Icon name={isDirty ? 'upload' : 'check'} />
				</button>
				<form class="editor-logout" method="POST" action="/logout">
					<button class="logout-button" type="submit">Log out</button>
				</form>
			</div>
		</header>

		<form id="item-editor" class="editor-form editor-detail-shell" method="POST" action="?/save" use:enhance={enhanceEditor}>
			<input type="hidden" name="slug" value={selectedId} />
			<input type="hidden" name="status" value={draft.status} />
			<input type="hidden" name="existingImage" value={draft.image} />

			<div class="editor-photo editor-detail-image">
				<img class="detail-image-backdrop" src={previewImage} alt="" aria-hidden="true" />
				<img class="detail-image-photo" src={previewImage} alt="Current item preview" />
				<span class:item-sold={draft.status === 'Sold'} class="detail-status">{draft.status}</span>
				<div class="editor-photo-controls">
					<label class="photo-button">
						<span>{processingImage ? 'Preparing and uploading…' : 'Replace photo'}</span>
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp"
							capture="environment"
							disabled={processingImage}
							bind:this={imageInput}
							onchange={chooseImage}
						/>
					</label>
					<p class="photo-guidance">Photos resize automatically. Keep the piece centered for the catalog crop.</p>
					{#if imageError}<p class="photo-error" role="alert">{imageError}</p>{/if}
				</div>
			</div>

			<div class="editor-detail-copy">
				<div class="editor-classification">
					<label><span>Category</span><input name="category" required bind:value={draft.category} /></label>
					<label><span>Era</span><input name="era" bind:value={draft.era} placeholder="Mid-century, 1920s…" /></label>
				</div>

				<label class="editor-title-field">
					<span>Title</span>
					<textarea name="title" required rows="2" value={draft.title} oninput={updateTitle}></textarea>
				</label>

				<div class="editor-price-status">
					<label class="editor-price-field">
						<span>Price</span>
						<div class="money-input"><span>$</span><input name="price" type="number" min="0" step="1" bind:value={draft.price} /></div>
					</label>
					<div class="quick-status">
						<span>Listing status</span>
						<div>
							{#each ['Available', 'Held', 'Sold'] as option}
								<button class:active={draft.status === option} type="button" onclick={() => setStatus(option)}>{option}</button>
							{/each}
						</div>
					</div>
				</div>

				<label class="editor-description-field">
					<span>Short description</span>
					<textarea name="description" rows="3" bind:value={draft.description}></textarea>
				</label>

				<div class="editor-specs">
					<label><span>Dimensions</span><input name="dimensions" bind:value={draft.dimensions} placeholder="48 W × 24 D × 30 H in." /></label>
					<label><span>Condition</span><select name="condition" bind:value={draft.condition}><option>Excellent</option><option>Very good</option><option>Good</option><option>Fair</option><option>As found</option></select></label>
					<label><span>Materials</span><input name="materials" bind:value={draft.materials} /></label>
				</div>

				<label class="editor-story-field">
					<span>Story / provenance</span>
					<textarea name="story" rows="4" bind:value={draft.story}></textarea>
				</label>

				<label class="feature-toggle"><input name="featured" value="true" type="checkbox" bind:checked={draft.featured} /><span>Feature this piece on the home page</span></label>

				{#if notice}
					<p class="admin-notice">{notice}</p>
				{/if}

				{#if !creating}
				<div class="editor-actions">
					<button class="share-button" type="button" onclick={copyFacebookPost}>Copy Facebook post</button>
					<button class="delete-button" type="submit" formaction="?/remove" formnovalidate onclick={confirmRemoval}>Remove piece</button>
				</div>
				{/if}
			</div>
		</form>
		<form class="editor-mobile-logout" method="POST" action="/logout">
			<button class="logout-button" type="submit">Log out of staff mode</button>
		</form>
	</section>
</div>
