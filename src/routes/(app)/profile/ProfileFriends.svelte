<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import { getUserFriends } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";
	import { fade } from "svelte/transition";

	async function getAllFriends() {
		const token = await $user?.getIdToken();
		const response = await getUserFriends(token!);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.friends as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends.slice(0, 5);
	}
</script>

<div class="mx-auto w-4/5 mt-6">
	<p class="text-left text-2xl ml-4">Friends</p>
</div>
<div
	class="flex justify-center items-center min-h-[25vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-1 md-12"
>
	{#await getAllFriends()}
		<div class="flex items-center justify-center">
			<Spinner class="w-16 h-16 animate-spin" />
		</div>
	{:then friends}
		<div in:fade|global class="flex gap-4 px-2 w-full justify-center items-center">
			{#if friends.length > 0}
				{#each friends as friend}
					<div class="w-1/5 flex flex-col justify-center items-center">
						<img
							src={friend.img_url ?? placeholderImageUrl}
							alt={friend.name ?? "User"}
							class="w-full max-w-[10rem] mx-auto aspect-square object-cover rounded-full"
						/>
						<p class="truncate max-w-[10rem] pt-2 text-center text-lg">
							{friend.name ?? "User"}
						</p>
					</div>
				{/each}
			{:else}
				<div class="flex flex-col items-center justify-center w-full h-full gap-2">
					<h2 class="text-xl">No friends found</h2>
				</div>
			{/if}
		</div>
	{/await}
</div>
