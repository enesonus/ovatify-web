<script lang="ts">
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { onDestroy } from "svelte";

	const unsubscribe = user.subscribe((value) => {
		if (value) {
			goto("/");
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<slot />
