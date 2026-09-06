CREATE TABLE IF NOT EXISTS items (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	category TEXT NOT NULL,
	era TEXT NOT NULL DEFAULT '',
	price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
	status TEXT NOT NULL DEFAULT 'Available'
		CHECK (status IN ('Available', 'Held', 'Sold')),
	image_url TEXT NOT NULL DEFAULT '',
	dimensions TEXT NOT NULL DEFAULT '',
	condition TEXT NOT NULL DEFAULT '',
	materials TEXT NOT NULL DEFAULT '',
	description TEXT NOT NULL DEFAULT '',
	story TEXT NOT NULL DEFAULT '',
	featured BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	archived_at TIMESTAMPTZ
);
