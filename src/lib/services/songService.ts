import * as api from "$lib/utils/api";
import { getFromCache, saveToCache, songCache } from "$lib/utils/caches";
import { sleep } from "$lib/utils/time";
import { displayToast } from "$lib/utils/toast";

const cacheMinutes = 5;

export async function uploadSongFile(token: string, form: FormData) {
	const response = await api.post("songs/upload-file/", token, null, form);
	return response;
}

export async function searchSong(token: string, query: string) {
	const response = await api.get(`songs/api/search/?search_string=${query}`, token);
	return response;
}

export async function updateSong(token: string, song: any) {
	const response = await api.put("songs/update-song/", token, song);
	return response;
}

export async function addSong(token: string, song: any) {
	const response = await api.post("songs/api/add/", token, song);
	return response;
}

export async function getSongById(token: string, id: string) {
	const d = getFromCache(songCache, id);
	if (d.data) {
		if (d.stale) {
			displayToast({ message: "Song cache expired, fetching new data", type: "success" });
		} else {
			displayToast({ message: "Song cache hit", type: "success" });
			return { data: d.data };
		}
	} else {
		displayToast({ message: "Song cache miss, fetching new data", type: "error" });
	}
	// const response = await api.get(`songs/api/${id}`, token);
	await sleep(1.5); // Simulate network delay
	const response = {
		id: id,
		title: "test",
		artist: "test",
		album: "test",
		genre: "test",
		release_year: Math.floor(Math.random() * 10000),
		image_url: "test"
	};
	saveToCache(songCache, id, response, cacheMinutes);
	return { data: response };
}
