import * as api from "$lib/utils/api";

export async function createFriendGroup(token: string, groupName: string) {
	const body = {
		name: groupName,
		description: ""
	};
	const response = await api.post(`users/create-friend-group/`, token, body);
	return response;
}

export async function getFriendGroupById(token: string, groupId: number) {
	const response = await api.get(
		`users/get-friend-group-by-id/?group_id=${groupId}&extended=true`,
		token
	);
	return response;
}

export async function getFriendGroups(token: string) {
	const response = await api.get(`users/get-all-friend-groups-of-user/`, token);
	return response;
}

export async function addFriendToGroup(
	token: string,
	body: {
		group_id: number;
		friend_name: string;
	}
) {
	const response = await api.put(`users/add-friend-to-group/`, token, body);
	return response;
}

export async function removeFriendFromGroup(
	token: string,
	body: {
		group_id: number;
		friend_name: string;
	}
) {
	const response = await api.put(`users/remove-friend-from-group/`, token, body);
	return response;
}

export async function deleteFriendGroup(token: string, groupId: string) {
	const response = await api.del(`users/delete-friend-group/?group_id=${groupId}`, token);
	return response;
}

export async function getPlaylistsOfGroup(token: string, groupId: string) {
	const response = await api.get(
		`users/get-playlists-of-group/?group_id=${groupId}`,
		token
	);
	return response;
}

export async function createNewGroupPlaylist(token: string, groupId: number) {
	const response = await api.post(`users/create-empty-playlist-in-group/`, token, {
		playlist_name: "New Playlist",
		group_id: groupId
	});
	return response;
}

export async function editFriendGroup(
	token: string,
	body: {
		group_id: number;
		name: string;
		description: string;
	}
) {
	const response = await api.put(`users/edit-friend-group/`, token, body);
	return response;
}
