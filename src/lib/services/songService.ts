import * as api from "$lib/utils/api";
import { getFromCache, saveToCache, songCache } from "$lib/utils/caches";

export async function uploadSongFile(token: string, form: FormData) {
	const response = await api.post("songs/upload-file/", token, null, form);
	return response;
}

export async function searchSpotifySong(token: string, query: string) {
	const response = await api.get(`songs/search-spotify/?search_string=${query}`, token);
	return response;
}

export async function searchDatabaseSong(token: string, query: string) {
	const response = await api.get(`songs/search-db/?search_string=${query}`, token);
	return response;
}

export async function updateSong(token: string, song: any) {
	const response = await api.put("songs/update-song/", token, song);
	return response;
}

export async function addSong(token: string, song: any) {
	const response = await api.post("songs/add-song/", token, song);
	return response;
}

export async function getSongById(token: string, id: string) {
	const cachedMinutes = 5;
	const cachedData = getFromCache(songCache, id);
	if (cachedData.data && !cachedData.stale) {
		console.log("Song cache hit");
		return cachedData.data;
	}
	console.log("Song cache miss");
	const response = await api.get(`songs/get-song-by-id/?song_id=${id}`, token);
	if (response.status !== 200) {
		console.log("Error fetching song");
		console.log(response);
		return null;
	}
	const data = response.data.song_info;
	console.log("data", data);
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
	const data = response.data.songs;
	return data;
}

export async function deleteSongRating(token: string, id: string) {
	const response = await api.del(`songs/delete-rating/?rating_id=${id}`, token);
	return response;
}
