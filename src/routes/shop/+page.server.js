import { listItems } from '$lib/server/database.js';

export async function load() {
	return {
		items: await listItems()
	};
}
