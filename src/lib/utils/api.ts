import { env } from "$env/dynamic/public";

const local = false;
const base = !local ? env.PUBLIC_BASE_URL ?? "" : "http://127.0.0.1:8000";

type SendParams = {
	method: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	token?: string | null;
	data?: object | null;
	form?: FormData | null;
	signal?: AbortSignal | null;
};

export type SendOptions = {
	method: string;
	headers: Record<string, string>;
	body?: string | FormData;
	signal?: AbortSignal | null;
};

async function send(
	params: SendParams
): Promise<{ data: any; status: number; error: { message: string; value: any } | null }> {
	const options: SendOptions = { method: params.method, headers: {} };
	if (params.data) {
		options.headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(params.data);
	}
	if (params.form) {
		options.body = params.form;
	}
	if (params.token) {
		options.headers["Authorization"] = `Bearer ${params.token}`;
	}
	if (params.signal) {
		options.signal = params.signal;
	}
	try {
		const response = await fetch(`${base}/${params.path}`, { ...options });
		const text = await response.text();
		try {
			const data = JSON.parse(text);
			return { data: data, error: null, status: response.status };
		} catch (e) {
			return {
				data: null,
				error: { message: "Error parsing response text as JSON", value: text },
				status: response.status
			};
		}
	} catch (e: any) {
		if (e.name === "AbortError") return { data: null, error: null, status: 0 };
		console.error(e);
		return { data: null, error: { message: e?.message, value: e }, status: 500 };
	}
}

export function get(path: string, token?: string | null) {
	return send({ method: "GET", path, token });
}

export function del(path: string, token?: string | null) {
	return send({ method: "DELETE", path, token });
}

export function post(
	path: string,
	token?: string | null,
	data?: object | null,
	form?: FormData | null
) {
	return send({ method: "POST", path, token, data, form });
}

export function put(
	path: string,
	token?: string | null,
	data?: object | null,
	form?: FormData | null
) {
	return send({ method: "PUT", path, token, data, form });
}
