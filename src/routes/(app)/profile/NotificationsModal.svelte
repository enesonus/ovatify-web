<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { fade } from "svelte/transition";
	import {
		deleteFriendSuggestion,
		getFriendSuggestions
	} from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";
	import * as Dialog from "$lib/components/ui/dialog";
	import { cn } from "$lib/utils";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { sleep } from "$lib/utils/time";
	import { Trash2 } from "lucide-svelte";
	import DisplaySongModal from "$lib/components/DisplaySongModal.svelte";
	import { disabledBtn } from "$lib/utils/colors";

	export let dialogOpen: boolean;
	let loading = false;
	let displaySongDialogOpen = false;
	let selectedSongId = "";

	$: if (!displaySongDialogOpen) {
		selectedSongId = "";
	}

	type Notification = {
		id: string;
		suggester_name: string;
		suggester_img_url: string;
		song_id: string;
		song_img_url: string;
		song_name: string;
	};

	async function getAllNotifications() {
		const token = await $user!.getIdToken();
		const response = await getFriendSuggestions(token);
		if (response.status !== 200) {
			console.log("Error getting friend suggestions");
			return [];
		}
		const notifications = response.data.items as Notification[];
		if (!notifications || notifications.length === 0) {
			return [];
		}
		return notifications;
	}

	async function handleDeleteSuggestion(messageId: string) {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteFriendSuggestion(token, messageId);
		if (response.status === 200) {
			displayToast({ message: "Friend suggestion deleted", type: "success" });
		} else {
			displayToast({ message: "Error deleting friend suggestion", type: "error" });
		}
		dialogOpen = false;
		await sleep(1);
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex flex-col rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem] gap-0 px-2 sm:px-6"
	>
		<h2 class="text-xl font-semibold p-2">Notifications</h2>
		{#await getAllNotifications()}
			<div class="flex items-center justify-center h-[25rem]">
				<Spinner class="w-10 h-10 animate-spin" />
			</div>
		{:then suggestions}
			<div in:fade class="h-[25rem] overflow-y-auto">
				{#if suggestions.length > 0}
					{#each suggestions as suggestion}
						<div class="p-2">
							<button
								on:click={() => {
									if (!loading) {
										selectedSongId = suggestion.song_id;
										displaySongDialogOpen = true;
									}
								}}
								class={cn(
									"w-full transition bg-zinc-700 hover:bg-zinc-800 px-2 py-1 rounded-lg",
									disabledBtn(loading)
								)}
							>
								<div class="grid grid-cols-[1fr,auto] items-center">
									<div>
										<div class="flex items-center gap-1">
											<Avatar.Root class="w-6 h-6">
												<Avatar.Image
													src={suggestion.suggester_img_url}
													alt="{suggestion.suggester_name}'s Profile Image"
												/>
												<Avatar.Fallback
													>{suggestion.suggester_name.slice(0, 2)}</Avatar.Fallback
												>
											</Avatar.Root>
											<p class="text-xs">{suggestion.suggester_name}</p>
										</div>
										<div class="text-start pt-1">
											<img
												src={suggestion.song_img_url}
												alt="{suggestion.song_name} Cover Art"
												class="w-12 h-12 object-cover rounded-lg inline-block"
											/>
											<p class="pr-2 inline-block">
												{suggestion.song_name}
											</p>
										</div>
									</div>
									<Button
										variant="outline"
										class={cn("p-0 w-8 h-8 hover:bg-red-800", disabledBtn(loading))}
										on:click={(e) => {
											e.stopPropagation();
											handleDeleteSuggestion(suggestion.id);
										}}><Trash2 /><span class="sr-only">Delete Notification</span></Button
									>
								</div>
							</button>
						</div>
					{/each}
				{:else}
					<div class="flex flex-col items-center justify-center h-full w-full">
						<h2 class="text-xl text-center">You do not have any notifications</h2>
					</div>
				{/if}
			</div>
		{/await}
	</Dialog.Content>
</Dialog.Root>

<DisplaySongModal bind:dialogOpen={displaySongDialogOpen} bind:selectedSongId />
