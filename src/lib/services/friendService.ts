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
