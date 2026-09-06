import { randomBytes } from 'node:crypto';
import { hashPassword } from '../src/lib/server/password.js';

function hiddenPrompt(message) {
	if (!process.stdin.isTTY || !process.stdin.setRawMode) {
		throw new Error('Run this command in an interactive terminal.');
	}

	return new Promise((resolve, reject) => {
		let value = '';
		process.stdout.write(message);
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		function finish() {
			process.stdin.setRawMode(false);
			process.stdin.pause();
			process.stdin.off('data', onData);
			process.stdout.write('\n');
		}

		function onData(chunk) {
			for (const character of chunk) {
				if (character === '\u0003') {
					finish();
					reject(new Error('Cancelled.'));
					return;
				}

				if (character === '\r' || character === '\n') {
					finish();
					resolve(value);
					return;
				}

				if (character === '\b' || character === '\u007f') {
					value = value.slice(0, -1);
					continue;
				}

				value += character;
			}
		}

		process.stdin.on('data', onData);
	});
}

const password = await hiddenPrompt('Choose a staff password (input hidden): ');
if (password.length < 12) {
	throw new Error('Use at least 12 characters.');
}

const confirmation = await hiddenPrompt('Enter it again: ');
if (password !== confirmation) {
	throw new Error('The passwords did not match.');
}

console.log('\nAdd these values to .env.local and Vercel:');
console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
