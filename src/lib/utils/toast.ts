import { toast as svelteToast } from "svelte-french-toast";
import type { Toast } from "$lib/types";

export function displayToast(toast: Toast) {
	switch (toast.type) {
		case "success":
			svelteToast.success(toast.message);
			break;
		case "error":
			svelteToast.error(toast.message);
			break;
	}
}

export function prepareToast(toast: Toast) {
	localStorage.setItem("toast", JSON.stringify(toast));
}

export function clearToast() {
	localStorage.removeItem("toast");
}

export function handleStoredToast() {
	try {
		const toast = localStorage.getItem("toast");
		if (!toast) return false;
		localStorage.removeItem("toast");

		const toastData = JSON.parse(toast);
		switch (toastData.type) {
			case "success":
				svelteToast.success(toastData.message);
				break;
			case "error":
				svelteToast.error(toastData.message);
				break;
		}
		return true;
	} catch (e) {
		return false;
	}
}
