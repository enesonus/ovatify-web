<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { onDestroy } from "svelte";
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";

	const unsubscribe = user.subscribe((value) => {
		if (!value) {
			goto("/login");
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
