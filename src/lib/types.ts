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
	main_artist: string;
	release_year: number;
	img_url: string;
};

export type SelectedSongBody = {
	spotify_id: string;
	rating: number;
};

export type SongQueryResponse = {
	spotify_id: string;
	album_name: string;
	artist: string;
	release_year: string;
	track_name: string;
	album_url?: string;
};

export type CacheEntry = {
	data: any;
	expiry: number;
};

export type Song = {
	id: string;
	name: string;
	albums: string[];
	artists: string[];
	release_year: number;
	img_url: string;
	tempo: string;
	genres: string[];
	mood: string;
	recorded_environment: string;
	average_rating: number;
	user_rating: number;
	duration: number;
	replay_count: number;
	version: string;
};

export type Friend = {
	id: string;
	name: string;
	img_url: string | null;
};
