import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { seedItems } from './items.js';

const STORAGE_KEY = 'found-again-inventory-v1';

function initialItems() {
	if (!browser) return seedItems;

	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : seedItems;
	} catch {
		return seedItems;
	}
}

export const inventory = writable(initialItems());

if (browser) {
	inventory.subscribe((items) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	});
}

export function resetInventory() {
	inventory.set(structuredClone(seedItems));
}

