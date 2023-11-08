export type SendOptions = {
	method: string;
	headers: Record<string, string>;
	body?: string | FormData;
};

export type Toast = {
	message: string;
	type: "success" | "error" | "warning" | "info";
};
