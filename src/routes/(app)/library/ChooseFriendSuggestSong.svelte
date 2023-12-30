<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { fade } from "svelte/transition";
	import { getUserFriends, suggestSong } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";
	import * as Dialog from "$lib/components/ui/dialog";
	import { cn } from "$lib/utils";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { sleep } from "$lib/utils/time";

	export let dialogOpen: boolean;
	export let songId: string;

	let chosenFriendUsername = "";
	let loading = false;

	$: if (!dialogOpen) {
		chosenFriendUsername = "";
	}

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

	async function handleSuggestSong() {
		if (loading) return;
		if (chosenFriendUsername === "") {
			displayToast({ message: "Please choose a friend", type: "error" });
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await suggestSong(token, {
			receiver_user: chosenFriendUsername,
			song_id: songId
		});
		console.log(response);
		if (response.status === 200) {
			displayToast({ message: "Song suggested", type: "success" });
		} else {
			displayToast({ message: "Error suggesting song", type: "error" });
		}
		dialogOpen = false;
		await sleep(1.5);
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[36rem] flex flex-col items-center justify-center gap-2 px-2 sm:px-6"
	>
		<Dialog.Title class="text-center">Choose a friend</Dialog.Title>
		<div class="grid w-full h-full overflow-y-auto">
			{#await getAllFriends()}
				<div class="flex items-center justify-center">
					<Spinner class="w-10 h-10 animate-spin" />
				</div>
			{:then friends}
				<div in:fade>
					{#if friends.length > 0}
						{#each friends as friend}
							<div class="pb-2">
								<button
									on:click={() => {
										if (loading) return;
										if (chosenFriendUsername === friend.name) {
											chosenFriendUsername = "";
										} else {
											chosenFriendUsername = friend.name;
										}
									}}
									class={cn(
										"w-full transition flex items-center justify-start bg-zinc-700 p-2 rounded-lg",
										{
											"hover:bg-zinc-800": chosenFriendUsername !== friend.name,
											"bg-emerald-800 hover:bg-emerald-700":
												chosenFriendUsername === friend.name,
											"opacity-50 cursor-not-allowed": loading
										}
									)}
								>
									<Avatar.Root class="w-12 h-12">
										<Avatar.Image
											src={friend.img_url}
											alt="{friend.name}'s Profile Image"
										/>
										<Avatar.Fallback>{friend.name.slice(0, 2)}</Avatar.Fallback>
									</Avatar.Root>
									<p class="px-2">{friend.name}</p>
								</button>
							</div>
						{/each}
						<div class="w-full flex items-center justify-center">
							<Button
								variant="outline"
								class={cn(
									"w-full max-w-xs text-black bg-indigo-300 hover:bg-indigo-200 hover:text-black",
									{
										"hover:bg-indigo-300 opacity-50 cursor-not-allowed": loading
									}
								)}
								on:click={handleSuggestSong}
								>{loading ? "Suggesting..." : "Suggest"}</Button
							>
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center w-full h-full gap-2">
							<h2 class="text-xl">No friends found</h2>
						</div>
					{/if}
				</div>
			{/await}
		</div>
	</Dialog.Content>
</Dialog.Root>
