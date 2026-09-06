import { redirect } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/auth.js';

export function POST({ cookies }) {
	clearSessionCookie(cookies);
	redirect(303, '/login');
}
