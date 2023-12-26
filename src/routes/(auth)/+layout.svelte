<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";
	import { getUserProfile } from "$lib/services/userService";
	import { authFlowOngoing, resumingSession } from "$lib/stores/authState";
	import { firebaseSignOut } from "$lib/utils/firebase";
	import { displayToast, promiseToast } from "$lib/utils/toast";
	import { spotify } from "$lib/utils/spotify";
	import { isValidRoute } from "$lib/utils/validation";

	/* 
		Get user profile data if user is logged in to firebase
	 	authFlowOngoing is used to allow sign in and sign up page flows to get user data on their own
	*/
	$: if ($user && !$userData.id && !$authFlowOngoing) {
		console.log("User logged in to firebase");
		console.log("Attempting to get user profile from database...");
		$resumingSession = true;
		promiseToast(getUserData(), "Logging in", "Logged in", "Error logging in");
	}

	/* 
		Redirect away from auth pages if user is fully logged in
	 	authFlowOngoing is used to allow sign in and sign up page flows to decide on their own redirects
	*/
	$: if ($user && $userData.id && !$authFlowOngoing) {
		handleRedirect();
	}

	async function handleRedirect() {
		await handleSpotifyCallback();
		const redirectTo = $page.url.searchParams.get("redirect");
		if (redirectTo && isValidRoute(redirectTo)) {
			goto(redirectTo, { replaceState: true });
		} else {
			goto("/", { replaceState: true });
		}
	}

	async function handleSpotifyCallback() {
		const code = $page.url.searchParams.get("code");
		const error = $page.url.searchParams.get("error");
		if (code) {
			const { authenticated } = await spotify.authenticate();
			if (authenticated) {
				displayToast({
					message: "Logged in to Spotify",
					type: "success"
				});
			} else {
				displayToast({
					message: "Error logging in to Spotify",
					type: "error"
				});
			}
		} else if (error && error === "access_denied") {
			displayToast({
				message: "You need to allow access to your account to perform Spotify actions",
				type: "error"
			});
		}
	}

	async function getUserData() {
		const token = await $user!.getIdToken();
		const response = await getUserProfile(token);
		if (response.status !== 200) {
			console.error("Server error getting user profile.");
			await firebaseSignOut();
			$resumingSession = false;
			throw new Error("Error getting user profile");
		}
		console.log("User profile retrieved successfully.");
		userData.set(response.data);
		$resumingSession = false;
	}
</script>

<slot />
