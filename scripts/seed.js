//
// Populate the database with the synthetic inventory used by the concept.
//

import { neon } from '@neondatabase/serverless';
import { seedItems } from '../src/lib/items.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL is missing. Pull the Vercel environment into .env.local first.');
}

const sql = neon(databaseUrl);

for (const item of seedItems) {
	await sql`
		INSERT INTO items (
			slug,
			title,
			category,
			era,
			price_cents,
			status,
			image_url,
			dimensions,
			condition,
			materials,
			description,
			story,
			featured,
			listed_at
		)
		VALUES (
			${item.id},
			${item.title},
			${item.category},
			${item.era},
			${item.price * 100},
			${item.status},
			${item.image},
			${item.dimensions},
			${item.condition},
			${item.materials},
			${item.description},
			${item.story},
			${item.featured},
			${item.dateAdded}
		)
		ON CONFLICT (slug) DO UPDATE SET
			title = EXCLUDED.title,
			category = EXCLUDED.category,
			era = EXCLUDED.era,
			price_cents = EXCLUDED.price_cents,
			status = EXCLUDED.status,
			image_url = EXCLUDED.image_url,
			dimensions = EXCLUDED.dimensions,
			condition = EXCLUDED.condition,
			materials = EXCLUDED.materials,
			description = EXCLUDED.description,
			story = EXCLUDED.story,
			featured = EXCLUDED.featured,
			listed_at = EXCLUDED.listed_at,
			updated_at = NOW()
	`;
}

const [{ count }] = await sql`SELECT COUNT(*)::INTEGER AS count FROM items WHERE archived_at IS NULL`;
console.log(`Seed complete. The database contains ${count} active items.`);
