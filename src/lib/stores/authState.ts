import { writable } from "svelte/store";

// Used to prevent sign-in and sign-up flows triggering layout reactivity,
// which is used to login users automatically on full page refresh
export const authFlowOngoing = writable(false);
export const resumingSession = writable(false);
