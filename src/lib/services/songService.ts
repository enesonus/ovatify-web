import * as api from "$lib/utils/api";
import { getFromCache, saveToCache, songCache } from "$lib/utils/caches";

export async function searchSpotifySong(token: string, query: string) {
	const response = await api.get(`songs/search-spotify/?search_string=${query}`, token);
	return response;
}

export async function searchDatabaseSong(token: string, query: string) {
	const response = await api.get(`songs/search-db/?search_string=${query}`, token);
	return response;
}

export async function addSong(token: string, id: string, rating: number) {
	const body = {
		spotify_id: id,
		rating: rating
	};
	const response = await api.post("songs/add-song/", token, body);
	return response;
}

export async function getSongById(token: string, id: string) {
	const cachedMinutes = 2;
	const cachedData = getFromCache(songCache, id);
	if (cachedData.data && !cachedData.stale) {
		// console.log("Song cache hit");
		return cachedData.data;
	}
	// console.log("Song cache miss");
	const response = await api.get(`songs/get-song-by-id/?song_id=${id}`, token);
	if (response.status !== 200) {
		console.log("Error fetching song");
		console.log(response);
		return null;
	}
	const data = response.data.song_info;
	saveToCache(songCache, id, data, cachedMinutes);
	return data;
}

export async function getAllRecentSongs(token: string) {
	const response = await api.get("users/get-all-recent/", token);
	if (response.status !== 200) {
		console.log("Error fetching recent songs");
		console.log(response);
		return null;
	}
	return response.data?.songs;
}
