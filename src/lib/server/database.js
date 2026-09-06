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

export async function listFeaturedItems() {
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
			AND featured = TRUE
		ORDER BY listed_at DESC, title ASC
		LIMIT 3
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

export async function createItem(item) {
	const database = getDatabase();
	const rows = await database`
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
			listed_at,
			featured
		)
		VALUES (
			${item.id},
			${item.title},
			${item.category},
			${item.era},
			${Math.round(item.price * 100)},
			${item.status},
			${item.image},
			${item.dimensions},
			${item.condition},
			${item.materials},
			${item.description},
			${item.story},
			${item.dateAdded},
			${item.featured}
		)
		RETURNING
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
	`;

	return mapItem(rows[0]);
}

export async function updateItem(slug, item) {
	const database = getDatabase();
	const rows = await database`
		UPDATE items
		SET title = ${item.title},
			category = ${item.category},
			era = ${item.era},
			price_cents = ${Math.round(item.price * 100)},
			status = ${item.status},
			image_url = ${item.image},
			dimensions = ${item.dimensions},
			condition = ${item.condition},
			materials = ${item.materials},
			description = ${item.description},
			story = ${item.story},
			featured = ${item.featured},
			updated_at = NOW()
		WHERE slug = ${slug}
			AND archived_at IS NULL
		RETURNING
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
	`;

	return rows[0] ? mapItem(rows[0]) : null;
}

export async function archiveItem(slug) {
	const database = getDatabase();
	const rows = await database`
		UPDATE items
		SET archived_at = NOW(),
			updated_at = NOW()
		WHERE slug = ${slug}
			AND archived_at IS NULL
		RETURNING slug
	`;

	return rows.length > 0;
}
