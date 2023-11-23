import type { CacheEntry } from "$lib/types";

export function saveToCache(
	cache: Map<string, any>,
	key: string,
	value: any,
	expiryMinutes: number
) {
	cache.set(key, { data: value, expiry: expiryMinutes * 60 * 1000 });
}

export function getFromCache(cache: Map<string, any>, key: string) {
	const cacheEntry: CacheEntry = cache.get(key);
	if (!cacheEntry) {
		return { stale: false, data: null };
	}
	if (cacheEntry.expiry >= Date.now()) {
		return { stale: true, data: cacheEntry.data };
	}
	return { stale: false, data: cacheEntry.data };
}

export const songCache = new Map<string, any>();

export const genreCache = new Map<string, any>();
