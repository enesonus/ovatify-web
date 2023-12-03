<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { placeholderImageUrl } from "$lib/constants";
	import { sleep } from "$lib/utils/time";
	import { Button } from "$lib/components/ui/button";
	import { UserX } from "lucide-svelte";
	import { makeToast } from "$lib/utils/toast";
	import { fade } from "svelte/transition";
	import { getUserFriends } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";

	// export let dialogIsOpen: boolean;

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
		return friends;
	}

	// async function handleRemoveFriend(username: string) {
	// 	makeToast(`Removed friend ${username}`);
	// 	dialogIsOpen = false;
	// }
</script>

<div class="grid w-full h-full overflow-y-auto">
	{#await getAllFriends()}
		<div class="flex items-center justify-center">
			<Spinner class="w-10 h-10 animate-spin" />
		</div>
	{:then friends}
		<div in:fade>
			{#if friends.length > 0}
				{#each friends as friend}
					<div class="p-2">
						<div
							class="w-full flex items-center justify-start bg-zinc-700 p-2 rounded-lg"
						>
							<img
								src={friend.img_url ?? placeholderImageUrl}
								alt={friend.name ?? "User"}
								class="w-12 h-12 rounded-full object-cover"
							/>
							<p class="pl-2 pr-4">{friend.name}</p>
							<!-- <div class="ml-auto pr-4">
							<Button
								variant="outline"
								on:click={() => handleRemoveFriend(friend.name)}
								class="w-8 h-8 p-0"
							>
								<UserX class="w-5 h-5" />
							</Button>
						</div> -->
						</div>
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
