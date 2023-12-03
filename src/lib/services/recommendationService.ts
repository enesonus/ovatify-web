import * as api from "$lib/utils/api";

export async function getRecommendations(
	token: string,
	request_type: "genre" | "artist" | "track"
) {
	const response = await api.get(`recommend-songs/?request_type=${request_type}`, token);
	console.log(response);
	return response;
}

export async function getSinceYouLike(
	token: string,
	body: { request_type: "genre" | "artist"; parameters: string }
) {
	// parameters: "" // genre name, artist name

	console.log(body);

	const response = await api.post("recommend-since-you-like/", token);
	return response;
}

export async function getFriendMix(token: string) {
	const response = await api.post("recommend-friend-mix/", token);
	return response;
}
