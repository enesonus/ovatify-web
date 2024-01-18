<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import Spinner from "$lib/components/Spinner.svelte";
	import { user } from "$lib/stores/user";
	import { getConsentFriends } from "$lib/services/friendService";
	import { Button } from "$lib/components/ui/button";
	import type { Friend } from "$lib/types";
	import { fade } from "svelte/transition";
	import { defaultImageUrl } from "$lib/constants";
	import DialogContent from "$lib/components/ui/dialog/dialog-content.svelte";
	import { createEventDispatcher } from "svelte";

	let dialogOpen = false;

	async function getConsentFriendList() {
		const token = await $user?.getIdToken();
		const response = await getConsentFriends(token!);
		console.log(response);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.friends as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends;
	}

	const dispatch = createEventDispatcher();

	function compareFriend(friendId: string, friendName: string) {
		dispatch("compare", { friendId, friendName });
		dialogOpen = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
		>Select a friend to compare</Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[34rem]"
	>
		<div class="grid w-full h-full overflow-y-auto">
			{#await getConsentFriendList()}
				<div class="flex items-center justify-center">
					<Spinner class="w-10 h-10 animate-spin" />
				</div>
			{:then friends}
				<div in:fade>
					{#if friends.length > 0}
						{#each friends as friend}
							<div class="p-2">
								<div
									class="w-full flex items-center justify-between bg-zinc-700 p-2 rounded-lg"
								>
									<div class="flex items-center">
										<img
											src={friend.img_url ?? defaultImageUrl}
											alt={friend.name ?? "User"}
											class="w-12 h-12 rounded-full object-cover"
										/>
										<p class="pl-2 pr-4">{friend.name}</p>
									</div>
									<Button
										on:click={() => compareFriend(friend.id, friend.name)}
										class="bg-zinc-900 text-white">Compare</Button
									>
								</div>
							</div>
						{/each}
					{:else}
						<div class="flex flex-col items-center justify-center w-full h-full gap-2">
							<h2 class="text-xl">You don't have any friends to compare</h2>
						</div>
					{/if}
				</div>
			{/await}
		</div>
	</Dialog.Content>
</Dialog.Root>
