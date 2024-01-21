<script lang="ts">
	import { createFriendGroup, getFriendGroups } from "$lib/services/groupService";
	import { user } from "$lib/stores/user";
	import type { FriendGroup } from "$lib/types";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { fade } from "svelte/transition";
	import Spinner from "$lib/components/Spinner.svelte";
	import { cn } from "$lib/utils";
	import { disabledBtn } from "$lib/utils/colors";

	let refresh = false;
	let loading = false;

	async function getAllFriendGroups() {
		const token = await $user!.getIdToken();
		const response = await getFriendGroups(token);
		if (response.status !== 200) {
			return [];
		}
		const friendGroups = response.data.friend_groups as FriendGroup[];
		if (!friendGroups || friendGroups.length === 0) {
			return [];
		}
		return friendGroups;
	}

	async function createNewFriendGroup() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await createFriendGroup(token, "New Friend Group");
		console.log(response);
		if (response.status === 201) {
			displayToast({ message: "Friend group created successfully", type: "success" });
			refresh = !refresh;
		} else {
			displayToast({ message: "Error creating friend group", type: "error" });
		}
		loading = false;
	}
</script>

<section class="sm:container">
	<div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
		<h2 class="text-2xl font-bold">Friend Groups</h2>
		<Button
			variant="outline"
			class={cn("py-0 px-0 h-8 min-w-[6rem]", disabledBtn(loading))}
			on:click={createNewFriendGroup}>{loading ? "Creating..." : "New"}</Button
		>
	</div>
	{#key refresh}
		{#await getAllFriendGroups()}
			<div in:fade|global class="flex items-center justify-center min-h-[8rem]">
				<Spinner class="w-10 h-10 animate-spin" />
			</div>
		{:then friendGroups}
			<div in:fade|global class="group-display">
				{#if friendGroups.length === 0}
					<p>No Friend Groups</p>
				{:else}
					{#each friendGroups as friendGroup}
						<a href="/friend-groups/{friendGroup.id}">
							<div
								class="py-4 flex border-2 items-center px-4 gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition"
							>
								<div class="break-all">
									<p class="font-bold text-xl">{friendGroup.name}</p>
									<p class="font-semibold">Owner</p>
									<p>{friendGroup.admin}</p>
								</div>
							</div>
						</a>
					{/each}
				{/if}
			</div>
		{/await}
	{/key}
</section>

<style lang="postcss">
	.group-display {
		display: grid;
		gap: 0.5rem;
		width: 100%;
		@media (min-width: 640px) {
			grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		}
	}
</style>
