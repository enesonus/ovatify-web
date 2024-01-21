<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { sleep } from "$lib/utils/time";
	import { Button } from "$lib/components/ui/button";
	import { X } from "lucide-svelte";
	import { displayToast, makeToast } from "$lib/utils/toast";
	import { fade } from "svelte/transition";
	import { user } from "$lib/stores/user";
	import {
		cancelFriendRequest,
		getUserOutgoingFriendRequests
	} from "$lib/services/friendService";
	import type { Friend } from "$lib/types";

	export let dialogOpen: boolean;
	let loading = false;

	async function getOutgoingRequests() {
		const token = await $user?.getIdToken();
		const response = await getUserOutgoingFriendRequests(token!);
		console.log(response);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.requests as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends;
	}

	async function handleCancelFriendRequest(username: string) {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await cancelFriendRequest(token, username);
		console.log(response);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message: "Friend request cancelled successfully"
			});
		} else if (response.status === 400) {
			displayToast({
				type: "error",
				message: response.data.error
			});
		} else if (response.status === 404) {
			displayToast({
				type: "error",
				message: "Request not found"
			});
		} else {
			displayToast({
				type: "error",
				message: "Something went wrong"
			});
		}
		dialogOpen = false;
		loading = false;
	}
</script>

<div class="grid w-full h-full overflow-y-auto">
	{#await getOutgoingRequests()}
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
							<div class="break-all">
								<img
									src={friend.img_url || defaultImageUrl}
									alt={friend.name || "User"}
									class="w-12 h-12 rounded-full object-cover inline-block"
								/>
								<p class="px-2 inline-block">{friend.name}</p>
							</div>
							<div class="px-2">
								<Button
									variant="outline"
									on:click={() => handleCancelFriendRequest(friend.name)}
									class={`w-8 h-8 p-0 ${loading ? "bg-red-800 hover:bg-red-800" : ""}`}
								>
									<X class="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex flex-col items-center justify-center w-full h-full gap-2">
					<h2 class="text-xl text-center">No outgoing friend requests</h2>
				</div>
			{/if}
		</div>
	{/await}
</div>
