import { listFeaturedItems } from '$lib/server/database.js';

export async function load() {
	return {
		featured: await listFeaturedItems()
	};
}
