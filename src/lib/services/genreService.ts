import * as api from "$lib/utils/api";

export async function getSongGenres(token: string, number: number) {
	const response = await api.get(`songs/get-genres/?number_of_genres=${number}`, token);
	if (response.status !== 200) {
		console.log("Error fetching genres");
		console.log(response);
		return null;
	}
	const data = response.data.genres;
	return data;
}

export async function getRandomSongGenres(token: string, number: number) {
	const response = await api.get(
		`songs/get-random-genres/?number_of_genres=${number}`,
		token
	);
	if (response.status !== 200) {
		console.log("Error fetching genres");
		console.log(response);
		return null;
	}
	return response.data?.genres;
}

export async function getSongsByGenreName(
	token: string,
	number: number,
	genreName: string
) {
	const response = await api.get(
		`songs/get-songs-by-genre/?number_of_songs=${number}&genre_name=${genreName}`,
		token
	);
	if (response.status !== 200) {
		console.log("Error fetching songs by genre");
		console.log(response);
		return null;
	}
	return response.data?.songs;
}

export async function getUserGenreNames(token: string) {
	const response = await api.get("users/get-library-genre-names/", token);
	return response;
}
