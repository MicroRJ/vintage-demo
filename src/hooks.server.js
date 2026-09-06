import { sessionCookieName, sessionIsValid } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	event.locals.isAdmin = sessionIsValid(event.cookies.get(sessionCookieName));
	return resolve(event);
}
