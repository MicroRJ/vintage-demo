import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { hashPassword } from '../src/lib/server/password.js';

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const password = await terminal.question('Choose a staff password: ');
if (password.length < 12) {
	terminal.close();
	throw new Error('Use at least 12 characters.');
}

const confirmation = await terminal.question('Enter it again: ');
terminal.close();

if (password !== confirmation) {
	throw new Error('The passwords did not match.');
}

console.log('\nAdd these values to .env.local and Vercel:');
console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
