import type { SendOptions } from "$lib/types";

const base = "http://localhost:8000";

async function send(
	method: string,
	path: string,
	token?: string | null,
	data?: object | null,
	form?: FormData | null
) {
	const options: SendOptions = { method, headers: {} };

	if (data) {
		options.headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(data);
	}

	if (form) {
		options.body = form;
	}

	if (token) {
		options.headers["Authorization"] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(`${base}/${path}`, options);
		const text = await response.text();

		return { data: text ? JSON.parse(text) : null, status: response.status };
	} catch (e) {
		console.error(e);
		return { data: null, status: 500 };
	}
}

export function get(path: string, token?: string | null) {
	return send("GET", path, token);
}

export function del(path: string, token?: string | null) {
	return send("DELETE", path, token);
}

export function post(
	path: string,
	token?: string | null,
	data?: object | null,
	form?: FormData | null
) {
	return send("POST", path, token, data, form);
}

export function put(
	path: string,
	token?: string | null,
	data?: object | null,
	form?: FormData | null
) {
	return send("PUT", path, token, data, form);
}
