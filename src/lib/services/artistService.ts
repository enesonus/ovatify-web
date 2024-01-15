import * as api from "$lib/utils/api";

export async function getUserArtistNames(token: string) {
	const response = await api.get("users/get-library-artist-names/", token);
	return response;
}

export async function searchArtist(token: string, query: string) {
	const response = await api.get(`songs/search-artists/?search_text=${query}`, token);
	return response;
}
