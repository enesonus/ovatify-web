import * as api from "$lib/utils/api";

export async function createUser(token: string, email: string) {
	const response = await api.post("users/create-user/", token, { email });
	return response;
}

export async function updateLastLogin(token: string) {
	const response = await api.put("users/login/", token);
	return response;
}
