<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { onDestroy, onMount } from "svelte";
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";
	import { page } from "$app/stores";
	import { getUserProfile } from "$lib/services/userService";
	import { userData } from "$lib/stores/userData";
	import { sleep } from "$lib/utils/time";
	import { displayToast } from "$lib/utils/toast";

	const unsubscribe = user.subscribe((value) => {
		if (!value) {
			const pageUrl = $page.route.id;
			const origin = pageUrl?.split("/")[2];
			if (!origin) {
				goto("/login");
			} else {
				goto(`/login?redirect=${origin}`);
			}
		}
	});

	let first = true;

	$: if (!first && $user) {
		getUserData();
	}

	onMount(() => {
		if ($user) {
			getUserData();
			first = true;
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function resetUserData() {
		$userData.id = null;
		$userData.name = null;
		$userData.img_url = null;
		$userData.preferences.dataProcessing = null;
		$userData.preferences.dataSharing = null;
	}

	async function getUserData() {
		resetUserData();
		const token = await $user!.getIdToken();
		const response = await getUserProfile(token);
		console.log(response);
		if (response.status === 200) {
			$userData.id = response.data.id;
			$userData.name = response.data.name;
			$userData.img_url = response.data.img_url;
			$userData.preferences.dataProcessing = response.data.preferences.dataProcessing;
			$userData.preferences.dataSharing = response.data.preferences.dataSharing;
		} else {
			displayToast({ type: "error", message: "Error getting user data" });
		}
	}
</script>

{#if $user}
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
