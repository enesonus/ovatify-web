export type SendOptions = {
	method: string;
	headers: Record<string, string>;
	body?: string | FormData;
};

export type Toast = {
	message: string;
	type: "success" | "error" | "warning" | "info";
};

export type CarouselSong = {
	id: string;
	name: string;
	album?: string;
	artists: string[];
	genre: string;
	release_year: number;
};

export type DetailedSong = {
	id: string;
	name: string;
	artists: string[];
	release_year: number;
	tempo: string;
	genre: string;
	mood: string;
	recorded_enviroment: string;
	duration: number;
	replay_count: number;
	version: string;
};
