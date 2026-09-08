import { fail, redirect } from '@sveltejs/kit';
import { adminPasswordIsValid, setSessionCookie } from '$lib/server/auth.js';

function safeDestination(value) {
	return value.startsWith('/') && !value.startsWith('//') ? value : '/shop';
}

export function load({ locals, url }) {
	if (locals.isAdmin) {
		redirect(303, safeDestination(url.searchParams.get('next') ?? '/shop'));
	}

	return {
		next: safeDestination(url.searchParams.get('next') ?? '/shop')
	};
}

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const password = String(formData.get('password') ?? '');
		const next = safeDestination(String(formData.get('next') ?? '/shop'));

		if (!password || !(await adminPasswordIsValid(password))) {
			return fail(400, { message: 'That password is not correct.', next });
		}

		setSessionCookie(cookies);
		redirect(303, next);
	}
};
