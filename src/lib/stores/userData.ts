import { writable } from "svelte/store";

type UserData = {
	id: string | null;
	name: string | null;
	img_url: string | null;
	preferences: {
		dataProcessing: boolean | null;
		dataSharing: boolean | null;
	};
};

export const userData = writable({
	id: null,
	name: null,
	img_url: null,
	preferences: {
		dataProcessing: null,
		dataSharing: null
	}
} as UserData);
