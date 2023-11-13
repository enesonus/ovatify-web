<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { onDestroy } from "svelte";
	import { page } from "$app/stores";

	const unsubscribe = user.subscribe((value) => {
		if (value) {
			const redirectTo = $page.url.searchParams.get("redirect");
			if (redirectTo) {
				goto(`/${redirectTo}`);
			} else {
				goto("/");
			}
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<slot />
