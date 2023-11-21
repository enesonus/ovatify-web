import * as api from "$lib/utils/api";

export async function getRecentlyAddedSongs(token: string, numberOfSongs: number = 10) {
	const response = await api.get(
		`users/get-recently-added-songs/?number_of_songs=${numberOfSongs}`,
		token
	);
	return response;
}

export async function getUserFavorites(token: string, numberOfSongs: number = 10) {
	const response = await api.get(
		`users/get-favorite-songs/?number_of_songs=${numberOfSongs}`,
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

export async function addFriend(token: string, friendUsername: string) {
	const body = {
		friend_username: friendUsername
	};
	console.log(body);
}

export async function formFriendship(token: string, friendUsername: string) {
	const body = {
		friend_username: friendUsername
	};
	const response = await api.post(`users/form-friendship/`, token, body);
	return response;
}
