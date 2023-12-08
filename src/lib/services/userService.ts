import * as api from "$lib/utils/api";

export async function getRecentlyAddedSongs(token: string, numberOfSongs: number | null) {
	console.log(numberOfSongs);
	const response = await api.get(
		`users/get-recently-added-songs/${
			numberOfSongs ? `?number_of_songs=${numberOfSongs}` : ""
		}`,
		token
	);
	console.log(response);
	return response;
}

export async function getUserFavorites(token: string, numberOfSongs: number | null) {
	const response = await api.get(
		`users/get-favorite-songs/${
			numberOfSongs ? `?number_of_songs=${numberOfSongs}` : ""
		}`,
		token
	);
	return response;
}

export async function getEntityCount(
	token: string,
	entity: "artists" | "genres" | "moods" | "tempos",
	numberOfSongs: number = 10
) {
	const response = await api.get(
		`users/get-favorite-${entity}/?number_of_songs=${numberOfSongs}`,
		token
	);
	if (response.status !== 200) return null;
	const data = response.data;
	console.log(data);
	return response;
}

export async function editUserSongRating(token: string, songId: string, rating: number) {
	const body = {
		song_id: songId,
		rating: rating
	};
	const response = await api.put(`users/edit-song-rating/`, token, body);
	return response;
}

export async function deleteUserSongRating(token: string, songId: string) {
	const response = await api.del(`users/delete-song-rating/?song_id=${songId}`, token);
	return response;
}

export async function editUserProfile(
	token: string,
	body: {
		username?: string;
		img_url?: string;
		data_processing_consent?: boolean;
		data_sharing_consent?: boolean;
	}
) {
	const response = await api.put(`users/edit-user-preferences/`, token, body);
	return response;
}

export async function getUserProfileStats(token: string) {
	const response = await api.get("users/get-profile-stats/", token);
	return response;
}

export async function getUserProfile(token: string) {
	const response = await api.get(`users/get-user-profile/`, token);
	return response;
}

export async function exportSongsByGenre(token: string, genre: string) {
	const response = await api.get(`users/export-by-genre/?genre=${genre}`, token);
	return response;
}

export async function exportSongsByArtist(token: string, artist: string) {
	const response = await api.get(`users/export-by-artist/?artist=${artist}`, token);
	return response;
}

export async function getRecentAddition(token: string) {
	const response = await api.get(`users/get-recent-addition-counts`, token);
	if (response.status !== 200) return null;
	const data = response.data;
	console.log(data);
	return response;
}
