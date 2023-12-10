import * as api from "$lib/utils/api";

export async function recommendYouMightLike(token: string, count: number) {
	const response = await api.get(`users/recommend-you-might-like/?count=${count}`, token);
	return response;
}

export async function recommendSinceYouLike(token: string, count: number) {
	const response = await api.get(`users/recommend-since-you-like/?count=${count}`, token);
	return response;
}

// Spotify song recommendation for friends
export async function recommendFriendMix(token: string, count: number) {
	const response = await api.get(`users/recommend-friend-mix/?count=${count}`, token);
	return response;
}

// Database song recommendation for friends
export async function recommendFriendsListen(token: string, count: number) {
	const response = await api.get(`users/recommend-friend-listen/?count=${count}`, token);
	return response;
}
