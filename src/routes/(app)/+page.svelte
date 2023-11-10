<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { user } from "$lib/stores/user";
	import * as api from "$lib/utils/api";
	import { displayToast } from "$lib/utils/toast";
	import { onDestroy } from "svelte";

	let loading = false;

	async function testFunction() {
		if (loading) return;
		loading = true;
		try {
			const userToken = await $user?.getIdToken();
			const res = await api.get("users/return-post-body", userToken);
			displayToast({
				type: "success",
				message: `Status ${res?.status} | ${res?.data?.message ?? "No Token"} 
			| UID: ${res?.data?.uid ?? "No UID"}`
			});
		} catch {
			displayToast({ type: "error", message: "Error getting genres" });
		} finally {
			loading = false;
		}
	}

	const unsubscribe = user.subscribe((value) => {
		if (!value) {
			goto("/login");
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div>
	<h1>Welcome to Ovatify!</h1>
	<div class="flex flex-col gap-4">
		{#if $user}
			<p>Logged in as: {$user.email}</p>
		{/if}
		<Button variant={!loading ? "outline" : "destructive"} on:click={testFunction}
			>Send API call to backend</Button
		>
	</div>
</div>
