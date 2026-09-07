import { listFeaturedItems } from '$lib/server/database.js';

export async function load({ locals }) {
	return {
		featured: await listFeaturedItems(),
		isAdmin: locals.isAdmin
	};
}
