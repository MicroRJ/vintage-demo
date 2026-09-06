import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const keyLength = 64;
const cost = 32768;
const blockSize = 8;
const parallelization = 1;
const maxMemory = 64 * 1024 * 1024;

async function deriveKey(password, salt, options) {
	return scrypt(password, salt, keyLength, {
		N: options.cost,
		r: options.blockSize,
		p: options.parallelization,
		maxmem: maxMemory
	});
}

export async function hashPassword(password) {
	const salt = randomBytes(16);
	const derivedKey = await deriveKey(password, salt, { cost, blockSize, parallelization });

	return [
		'scrypt',
		cost,
		blockSize,
		parallelization,
		salt.toString('base64url'),
		derivedKey.toString('base64url')
	].join('$');
}

export async function verifyPassword(password, storedHash) {
	const [algorithm, costText, blockSizeText, parallelizationText, saltText, hashText] = storedHash.split('$');
	if (algorithm !== 'scrypt' || !saltText || !hashText) return false;

	const options = {
		cost: Number(costText),
		blockSize: Number(blockSizeText),
		parallelization: Number(parallelizationText)
	};

	if (!Number.isInteger(options.cost) || !Number.isInteger(options.blockSize) || !Number.isInteger(options.parallelization)) {
		return false;
	}

	try {
		const expected = Buffer.from(hashText, 'base64url');
		const actual = await deriveKey(password, Buffer.from(saltText, 'base64url'), options);
		return expected.length === actual.length && timingSafeEqual(expected, actual);
	} catch {
		return false;
	}
}
