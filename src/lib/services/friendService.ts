import * as api from "$lib/utils/api";

export async function sendFriendRequest(token: string, friendUsername: string) {
	const body = {
		username: friendUsername
	};
	const response = await api.post(`users/send-friend-request/`, token, body);
	return response;
}

export async function cancelFriendRequest(token: string, friendUsername: string) {
	const body = {
		username: friendUsername
	};
	const response = await api.post(`users/cancel-friend-request/`, token, body);
	return response;
}

export async function acceptFriendRequest(token: string, friendUsername: string) {
	const body = {
		username: friendUsername
	};
	const response = await api.post(`users/accept-friend-request/`, token, body);
	return response;
}

export async function rejectFriendRequest(token: string, friendUsername: string) {
	const body = {
		username: friendUsername
	};
	const response = await api.post("users/reject-friend-request/", token, body);
	return response;
}

export async function getUserIncomingFriendRequestCount(token: string) {
	const response = await api.get(`users/get-incoming-request-count/`, token);
	return response;
}
export async function getUserIncomingFriendRequests(token: string) {
	const response = await api.get(`users/get-all-incoming-requests/`, token);
	return response;
}

export async function getUserOutgoingFriendRequests(token: string) {
	const response = await api.get(`users/get-all-outgoing-requests/`, token);
	return response;
}

export async function getUserFriends(token: string) {
	const response = await api.get(`users/get-all-friends/`, token);
	return response;
}

export async function suggestSong(
	token: string,
	body: { receiver_user: string; song_id: string }
) {
	const response = await api.post(`users/suggest-song/`, token, body);
	return response;
}

export async function getFriendSuggestionCount(token: string) {
	const response = await api.get(`users/get-suggestion-count/`, token);
	return response;
}

export async function setFriendSuggestionsAsSeen(token: string) {
	const response = await api.put(`users/set-suggestion-seen/`, token, null);
	return response;
}

export async function getFriendSuggestions(token: string) {
	const response = await api.get(`users/get-suggestions/`, token);
	return response;
}

export async function deleteFriendSuggestion(token: string, suggestionId: string) {
	const response = await api.del(
		`users/delete-suggestion/?suggestion_id=${suggestionId}`,
		token
	);
	return response;
}

export async function removeFriend(token: string, friendUsername: string) {
	const response = await api.del(
		`users/remove-friend/?friend_username=${friendUsername}`,
		token
	);
	return response;
}

export async function getConsentFriends(token: string) {
	const response = await api.get(`users/get-all-data-sharing-friends/`, token);
	return response;
}
