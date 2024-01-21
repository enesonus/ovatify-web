import type { Playlist } from "$lib/types";
import * as api from "$lib/utils/api";
import { getFromCache, playlistCache, saveToCache } from "$lib/utils/caches";

export async function getPlaylistById(token: string, playlistId: string) {
	const cachedMinutes = 2;
	const cachedData = getFromCache(playlistCache, playlistId);
	if (cachedData.data && !cachedData.stale) {
		console.log("Playlist cache hit");
		return cachedData.data as Playlist;
	}
	console.log("Playlist cache miss");
	const response = await api.get(
		`users/get-playlist-by-id/?playlist_id=${playlistId}`,
		token
	);
	if (response.status !== 200) {
		console.log("Error fetching playlist");
		console.log(response);
		return null;
	}
	const data = response.data.playlist as Playlist;
	saveToCache(playlistCache, playlistId, data, cachedMinutes);
	return data;
}

export async function getUserPlaylists(token: string) {
	const response = await api.get(`users/get-playlists/?number_of_playlists=999`, token);
	return response;
}

export async function createEmptyPlaylist(token: string) {
	const response = await api.post(`users/create-empty-playlist/`, token, {
		name: null,
		description: ""
	});
	return response;
}

export async function addSongToPlaylist(
	token: string,
	body: { playlist_id: string; song_id: string }
) {
	const response = await api.post(`users/add-song-to-playlist/`, token, body);
	return response;
}

export async function removeSongFromPlaylist(
	token: string,
	playlistId: string,
	songId: string
) {
	const response = await api.del(
		`users/remove-song-from-playlist/?playlist_id=${playlistId}&song_id=${songId}`,
		token
	);
	return response;
}

export async function editPlaylist(
	token: string,
	body: { playlist_id: string; name?: string; description?: string }
) {
	const response = await api.put(`users/edit-playlist/`, token, body);
	return response;
}

export async function deletePlaylist(token: string, playlistId: string) {
	const response = await api.del(
		`users/delete-playlist/?playlist_id=${playlistId}`,
		token
	);
	return response;
}

export async function saveAsPlaylist(
	token: string,
	body: { name: string; description: string; songs: string[] }
) {
	const response = await api.post(`users/save-playlist/`, token, body);
	return response;
}
