//
// Apply each SQL migration once, in filename order.
//

import { neon } from '@neondatabase/serverless';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL is missing. Pull the Vercel environment into .env.local first.');
}

const sql = neon(databaseUrl);
const migrationsDirectory = fileURLToPath(new URL('../db/migrations/', import.meta.url));

await sql`
	CREATE TABLE IF NOT EXISTS schema_migrations (
		name TEXT PRIMARY KEY,
		applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)
`;

const migrationNames = (await readdir(migrationsDirectory))
	.filter((name) => name.endsWith('.sql'))
	.toSorted();

for (const name of migrationNames) {
	const applied = await sql`
		SELECT 1
		FROM schema_migrations
		WHERE name = ${name}
	`;

	if (applied.length > 0) {
		console.log(`Already applied: ${name}`);
		continue;
	}

	const source = await readFile(new URL(`../db/migrations/${name}`, import.meta.url), 'utf8');
	await sql.query(source);
	await sql`
		INSERT INTO schema_migrations (name)
		VALUES (${name})
	`;

	console.log(`Applied: ${name}`);
}

console.log('Database migrations are current.');
