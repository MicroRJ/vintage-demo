import { randomUUID } from 'node:crypto';
import { fail, redirect } from '@sveltejs/kit';
import { archiveItem, createItem, listItems, updateItem } from '$lib/server/database.js';

const statuses = new Set(['Available', 'Held', 'Sold']);

function requireAdmin(locals) {
	if (!locals.isAdmin) {
		redirect(303, '/login?next=/admin');
	}
}

function textValue(formData, name) {
	return String(formData.get(name) ?? '').trim();
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function readItem(formData) {
	const title = textValue(formData, 'title');
	const category = textValue(formData, 'category');
	const price = Number(textValue(formData, 'price'));
	const status = textValue(formData, 'status');

	if (!title) return { message: 'Enter a title.' };
	if (!category) return { message: 'Enter a category.' };
	if (!Number.isFinite(price) || price < 0) return { message: 'Enter a valid non-negative price.' };
	if (!statuses.has(status)) return { message: 'Choose a valid listing status.' };

	return {
		item: {
			title,
			category,
			era: textValue(formData, 'era'),
			price,
			status,
			image: textValue(formData, 'image') || '/sofa.jpg',
			dimensions: textValue(formData, 'dimensions'),
			condition: textValue(formData, 'condition'),
			materials: textValue(formData, 'materials'),
			description: textValue(formData, 'description'),
			story: textValue(formData, 'story'),
			dateAdded: new Date().toISOString().slice(0, 10),
			featured: formData.get('featured') === 'true'
		}
	};
}

export async function load({ locals }) {
	requireAdmin(locals);

	return {
		items: await listItems()
	};
}

export const actions = {
	save: async ({ locals, request }) => {
		requireAdmin(locals);

		const formData = await request.formData();
		const parsed = readItem(formData);
		if (!parsed.item) return fail(400, { operation: 'save', message: parsed.message });

		const existingSlug = textValue(formData, 'slug');
		let item;

		if (existingSlug) {
			item = await updateItem(existingSlug, parsed.item);
			if (!item) return fail(404, { operation: 'save', message: 'That item no longer exists.' });
		} else {
			const baseSlug = slugify(parsed.item.title) || 'piece';
			item = await createItem({
				...parsed.item,
				id: `${baseSlug}-${randomUUID().slice(0, 8)}`
			});
		}

		return { operation: 'save', message: 'Saved. The public catalog is updated.', item };
	},

	remove: async ({ locals, request }) => {
		requireAdmin(locals);

		const formData = await request.formData();
		const slug = textValue(formData, 'slug');

		if (!slug) return fail(400, { operation: 'remove', message: 'Choose an item to remove.' });
		if (!(await archiveItem(slug))) {
			return fail(404, { operation: 'remove', message: 'That item no longer exists.' });
		}

		return { operation: 'remove', message: 'Piece removed from the public catalog.' };
	}
};
