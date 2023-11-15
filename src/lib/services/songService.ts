import * as api from "$lib/utils/api";

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
	const response = await api.post("songs/api/add", token, song);
	return response;
}
