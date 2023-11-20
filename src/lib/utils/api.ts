import type { SendOptions } from "$lib/types";
import { env } from "$env/dynamic/public";

const local = false;
const base = !local
	? env.PUBLIC_BASE_URL ?? ""
	: "http://127.0.0.1:8000";

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
		try {
			const data = JSON.parse(text);
			return { data: data, error: null, status: response.status };
		} catch (e) {
			return {
				data: null,
				error: { message: "Error parsing response text as JSON", obj: text },
				status: response.status
			};
		}
	} catch (e: any) {
		console.error(e);
		return { data: null, error: { message: e?.message, obj: e }, status: 500 };
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
