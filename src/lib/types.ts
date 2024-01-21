export type Toast = {
	message: string;
	type: "success" | "error";
};

export type CarouselSong = {
	id: string;
	name: string;
	main_artist: string;
	release_year: number;
	img_url: string;
};

export type CarouselGenre = {
	id: string;
	name: string;
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

export type GroupMember = {
	id: string;
	username: string;
	img_url: string | null;
};

export type FriendGroup = {
	id: string;
	name: string;
	description: string;
	img_url: string | null;
	admin: string;
	members: GroupMember[];
};

export type UserData = {
	id: string | null;
	name: string;
	img_url: string;
	preferences: {
		data_processing: boolean;
		data_sharing: boolean;
	};
};

export type CarouselPlaylist = {
	id: string;
	name: string;
	img_url: string;
	song_imgs: string[];
	user_id: string;
	friend_group_id: string;
};

export type CarouselGroupPlaylist = {
	id: string;
	name: string;
	img_url: string;
	song_imgs: string[];
	user_id: string;
	friend_group_id: string;
};

export type Playlist = {
	id: string;
	name: string;
	description: string;
	songs: CarouselSong[];
};
