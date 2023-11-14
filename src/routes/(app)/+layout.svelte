<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { onDestroy } from "svelte";
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";
	import { page } from "$app/stores";

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

	onDestroy(() => {
		unsubscribe();
	});
</script>

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
