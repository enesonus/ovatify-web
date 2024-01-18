import * as api from "$lib/utils/api";

export async function getRecentlyAddedSongs(token: string, numberOfSongs: number | null) {
	const response = await api.get(
		`users/get-recently-added-songs/${
			numberOfSongs ? `?number_of_songs=${numberOfSongs}` : ""
		}`,
		token
	);
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
	return response;
}

export async function getFriendEntityCount(
	token: string,
	friend_id: string,
	entity: "artists" | "genres" | "moods" | "tempos"
) {
	const response = await api.get(
		`users/get-friends-favorite-${entity}/?friend_id=${friend_id}`,
		token
	);
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

export async function getRecentAdditionCounts(token: string) {
	const response = await api.get(`users/get-recent-addition-counts`, token);
	return response;
}

export async function getFriendRecentAdditionCounts(token: string, friend_id: string) {
	const response = await api.get(
		`users/get-friends-recent-addition-counts?friend_id=${friend_id}`,
		token
	);
	return response;
}

export async function uploadSongFile(token: string, file: File) {
	const form = new FormData();
	form.append("file", file);
	const response = await api.post("users/upload-file/", token, null, form);
	return response;
}

export async function deleteUserFromDatabase(token: string) {
	const response = await api.del("users/delete-user/", token);
	return response;
}
