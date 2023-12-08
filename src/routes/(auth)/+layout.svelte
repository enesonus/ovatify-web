<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";
	import { getUserProfile } from "$lib/services/userService";
	import toast from "svelte-french-toast";
	import { authFlowOngoing, resumingSession } from "$lib/stores/authState";
	import { signOut } from "firebase/auth";
	import { auth } from "$lib/utils/firebase";

	// Get user profile data if user is logged in to firebase
	// authFlowOngoing is used to allow sign in and sign up page flows to get user data on their own
	$: if ($user && !$userData.id && !$authFlowOngoing) {
		console.log("Line 15 in auth layout");
		console.log("User logged in to firebase");
		console.log("Attempting to get user profile from database...");
		$resumingSession = true;
		toast.promise(
			getUserData(),
			{
				loading: "Logging in",
				success: "Logged in",
				error: "Error logging in"
			},
			{
				style: "background-color: #333; color: #fff;width: 12rem"
			}
		);
	}

	// Redirect away from auth pages if user is fully logged in
	// authFlowOngoing is used to allow sign in and sign up page flows to decide on their own redirects
	$: if ($user && $userData.id && !$authFlowOngoing) {
		console.log("Line 36 in auth layout");
		const redirectTo = $page.url.searchParams.get("redirect");
		if (redirectTo) {
			goto(redirectTo, { replaceState: true });
		} else {
			goto("/", { replaceState: true });
		}
	}

	async function getUserData() {
		const token = await $user!.getIdToken();
		const response = await getUserProfile(token);
		if (response.status !== 200) {
			console.error("Server error getting user profile.");
			try {
				await signOut(auth);
			} catch {
				console.error("Error signing user out from firebase");
			}
			$resumingSession = false;
			throw new Error("Error getting user profile");
		}
		console.log("User profile retrieved successfully.");
		userData.set(response.data);
		$resumingSession = false;
	}
</script>

<slot />
