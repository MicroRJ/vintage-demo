import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';

function getDatabase() {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not configured');
	}

	return neon(env.DATABASE_URL);
}

function mapItem(row) {
	return {
		id: row.slug,
		title: row.title,
		category: row.category,
		era: row.era,
		price: row.price_cents / 100,
		status: row.status,
		image: row.image_url,
		dimensions: row.dimensions,
		condition: row.condition,
		materials: row.materials,
		description: row.description,
		story: row.story,
		dateAdded: row.listed_at,
		featured: row.featured
	};
}

export async function listItems() {
	const database = getDatabase();
	const rows = await database`
		SELECT
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
			listed_at::text AS listed_at,
			featured
		FROM items
		WHERE archived_at IS NULL
		ORDER BY listed_at DESC, title ASC
	`;

	return rows.map(mapItem);
}

export async function getItemBySlug(slug) {
	const database = getDatabase();
	const rows = await database`
		SELECT
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
			listed_at::text AS listed_at,
			featured
		FROM items
		WHERE slug = ${slug}
			AND archived_at IS NULL
		LIMIT 1
	`;

	return rows[0] ? mapItem(rows[0]) : null;
}
