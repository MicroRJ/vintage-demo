import { createHmac, timingSafeEqual } from 'node:crypto';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { verifyPassword } from './password.js';

export const sessionCookieName = 'room_exchange_admin';

const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function sessionSecret() {
	if (!env.SESSION_SECRET) {
		throw new Error('SESSION_SECRET is not configured');
	}

	return env.SESSION_SECRET;
}

function signature(expiresAt) {
	return createHmac('sha256', sessionSecret()).update(expiresAt).digest('base64url');
}

export async function adminPasswordIsValid(password) {
	if (!env.ADMIN_PASSWORD_HASH) {
		throw new Error('ADMIN_PASSWORD_HASH is not configured');
	}

	return verifyPassword(password, env.ADMIN_PASSWORD_HASH);
}

export function createSession() {
	const expiresAt = String(Math.floor(Date.now() / 1000) + sessionLifetimeSeconds);
	return `${expiresAt}.${signature(expiresAt)}`;
}

export function sessionIsValid(value) {
	if (!value) return false;

	const separator = value.indexOf('.');
	if (separator === -1) return false;

	const expiresAt = value.slice(0, separator);
	const suppliedSignature = Buffer.from(value.slice(separator + 1), 'base64url');
	const expectedSignature = Buffer.from(signature(expiresAt), 'base64url');

	if (suppliedSignature.length !== expectedSignature.length) return false;
	if (!timingSafeEqual(suppliedSignature, expectedSignature)) return false;

	const expiration = Number(expiresAt);
	return Number.isInteger(expiration) && expiration > Math.floor(Date.now() / 1000);
}

export function setSessionCookie(cookies) {
	cookies.set(sessionCookieName, createSession(), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: sessionLifetimeSeconds
	});
}

export function clearSessionCookie(cookies) {
	cookies.delete(sessionCookieName, { path: '/' });
}
