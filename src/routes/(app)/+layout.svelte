<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";
	import { authFlowOngoing } from "$lib/stores/authState";
	import { user } from "$lib/stores/user";

	/* 
		Redirect to login page if user is not fully logged in
		If page is refreshed while a user is logged in, this function sends the user to the login page
		The user is then redirected back to the page they were on before the refresh
	*/
	$: if (!$userData.id) {
		const origin = $page.url.pathname;
		if (origin === "/") {
			goto("/login", { replaceState: true });
		} else {
			goto(`/login?redirect=${origin}`, { replaceState: true });
		}
	}

	/* 
		Clears auth flow ongoing state when the app portion is loaded
		This is to prevent auth flow ongoing state from persisting between app loads
	*/
	onMount(() => {
		$authFlowOngoing = false;
	});
</script>

{#if $user && $userData.id}
	<main>
		<TopNav />
		<div class="flex">
			<SideNav />
			<!-- Page Content -->
			<div class="p-4 w-full">
				<slot />
			</div>
		</div>
	</main>
{/if}
