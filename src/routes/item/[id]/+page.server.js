import { error } from '@sveltejs/kit';
import { getItemBySlug } from '$lib/server/database.js';

export async function load({ params }) {
	const item = await getItemBySlug(params.id);

	if (!item) {
		error(404, 'Item not found');
	}

	return { item };
}
