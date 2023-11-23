import type { UserData } from "$lib/types";
import { auth } from "$lib/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

export const userData = writable<UserData | null>(null);

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
