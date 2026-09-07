import { listItems } from '$lib/server/database.js';

export async function load({ locals }) {
	return {
		items: await listItems(),
		isAdmin: locals.isAdmin
	};
}
