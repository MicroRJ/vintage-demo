import { error } from '@sveltejs/kit';
import { getItemBySlug } from '$lib/server/database.js';

export async function load({ params, locals }) {
	const item = await getItemBySlug(params.id);

	if (!item) {
		error(404, 'Item not found');
	}

	return { item, isAdmin: locals.isAdmin };
}
