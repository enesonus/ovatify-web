<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";
	import { getUserProfile } from "$lib/services/userService";
	import { displayToast } from "$lib/utils/toast";
	import toast from "svelte-french-toast";
	import { authFlowOngoing } from "$lib/stores/authState";

	// Get user profile data if user is logged in to firebase
	$: if ($user && !$userData.id && !$authFlowOngoing) {
		console.log("Line 13 in auth layout");
		toast.promise(
			getUserData(),
			{
				loading: "Logging In",
				success: "Logged In",
				error: "Error logging in"
			},
			{
				style: "background-color: #333; color: #fff;"
			}
		);
	}

	// Redirect away from auth pages if user is fully logged in
	$: if ($user && $userData.id && !$authFlowOngoing) {
		console.log("Line 29 in auth layout");
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
		console.log(response);
		if (response.status !== 200) {
			throw new Error("Error getting user data");
		}
		userData.set(response.data);
	}
</script>

<slot />
