import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import { json } from '@sveltejs/kit';

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxImageBytes = 3 * 1024 * 1024;

export async function POST({ locals, request }) {
	if (!locals.isAdmin) {
		return json({ message: 'Your staff session has expired. Log in again.' }, { status: 401 });
	}

	const formData = await request.formData();
	const image = formData.get('imageFile');

	if (!image || typeof image !== 'object' || !('size' in image) || image.size === 0) {
		return json({ message: 'Choose a photo to upload.' }, { status: 400 });
	}

	if (!imageTypes.has(image.type)) {
		return json({ message: 'Choose a JPEG, PNG, or WebP image.' }, { status: 400 });
	}

	if (image.size > maxImageBytes) {
		return json({ message: 'That photo is too large. Choose a photo smaller than 3 MB.' }, { status: 400 });
	}

	try {
		const blob = await put(`inventory/${randomUUID()}.jpg`, image, {
			access: 'public',
			addRandomSuffix: true,
			contentType: image.type,
			maximumSizeInBytes: maxImageBytes
		});

		return json({ url: blob.url });
	} catch (error) {
		console.error('Inventory image upload failed.', error);
		return json({ message: 'The photo could not be uploaded. Try again.' }, { status: 500 });
	}
}
