<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { sleep } from "$lib/utils/time";
	import { Button } from "$lib/components/ui/button";
	import { Check, X } from "lucide-svelte";
	import { displayToast, makeToast } from "$lib/utils/toast";
	import { fade } from "svelte/transition";
	import {
		acceptFriendRequest,
		getUserIncomingFriendRequests,
		rejectFriendRequest
	} from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";
	import { cn } from "$lib/utils";
	import { disabledBtn } from "$lib/utils/colors";

	export let refresh: boolean;
	export let refreshFriendCount: boolean;
	export let dialogOpen: boolean;
	let loading = false;

	async function getIncomingRequests() {
		const token = await $user?.getIdToken();
		const response = await getUserIncomingFriendRequests(token!);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.requests as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends;
	}

	async function handleFriendRequest(action: "accept" | "reject", username: string) {
		if (loading) return;
		loading = true;
		const token = await $user?.getIdToken();
		const response =
			action === "accept"
				? await acceptFriendRequest(token!, username)
				: await rejectFriendRequest(token!, username);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message:
					action === "accept" ? "Friend request accepted" : "Friend request rejected"
			});
			if (action === "accept") {
				refresh = !refresh;
			}
			refreshFriendCount = !refreshFriendCount;
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
		await sleep(1);
		loading = false;
	}
</script>

<div class="grid w-full h-full overflow-y-auto">
	{#await getIncomingRequests()}
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
									alt={friend.name}
									class="w-12 h-12 rounded-full object-cover inline-block"
								/>
								<p class="px-2 inline-block">{friend.name}</p>
							</div>
							<div class="px-2 flex gap-2">
								<Button
									variant="outline"
									on:click={() => handleFriendRequest("accept", friend.name)}
									class={cn("w-8 h-8 p-0", disabledBtn(loading))}
								>
									<Check class="w-5 h-5" />
								</Button>
								<Button
									variant="outline"
									on:click={() => handleFriendRequest("reject", friend.name)}
									class={cn("w-8 h-8 p-0", disabledBtn(loading))}
								>
									<X class="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex flex-col items-center justify-center w-full h-full gap-2">
					<h2 class="text-xl text-center">No incoming friend requests</h2>
				</div>
			{/if}
		</div>
	{/await}
</div>
