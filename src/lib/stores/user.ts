import { auth } from "$lib/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

export const userData = writable<UserData | null>(null);

export interface UserData {
	email?: string;
	uid?: string;
	displayName?: string;
	photoURL?: string;
	joined?: number;
	expires?: number;
}

function userStore() {
	let unsubscribe: () => void;

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return { subscribe };
}

export const user = userStore();
