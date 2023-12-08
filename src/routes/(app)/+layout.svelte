<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";
	import { sleep } from "$lib/utils/time";
	import { authFlowOngoing } from "$lib/stores/authState";

	$: if (!$userData.id) {
		console.log("Line 12 in app layout");
		const origin = $page.url.pathname;
		if (origin === "/") {
			goto("/login", { replaceState: true });
		} else {
			goto(`/login?redirect=${origin}`, { replaceState: true });
		}
	}

	onMount(() => {
		$authFlowOngoing = false;
	});
</script>

<!-- $userData depends on $user, so checking userData.id is enough -->
{#if $userData.id}
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
