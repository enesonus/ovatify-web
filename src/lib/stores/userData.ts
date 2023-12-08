import type { UserData } from "$lib/types";
import { writable } from "svelte/store";

const initialUserDataState = {
	id: null,
	name: "",
	img_url: "",
	preferences: {
		data_processing: false,
		data_sharing: false
	}
} as UserData;

export const userData = writable(initialUserDataState);

export function resetUserData() {
	userData.set(initialUserDataState);
}
