<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { fade } from "svelte/transition";
	import { getUserFriends, removeFriend } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend } from "$lib/types";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { UserX } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { sleep } from "$lib/utils/time";
	import { disabledBtn } from "$lib/utils/colors";

	export let dialogOpen: boolean;
	export let refresh: boolean;
	let loading = false;

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

	async function handleRemoveFriend(username: string) {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await removeFriend(token, username);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message: `Removed ${username} from friends list successfully`
			});
			refresh = !refresh;
		} else {
			displayToast({
				type: "error",
				message: "Error removing friend"
			});
		}
		dialogOpen = false;
		await sleep(1);
		loading = false;
	}
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
							class="w-full flex items-center justify-between bg-zinc-700 p-2 rounded-lg"
						>
							<div class="break-all align-middle">
								<img
									src={friend.img_url || defaultImageUrl}
									alt={friend.name || "User"}
									class="w-12 h-12 inline-block rounded-full object-cover"
								/>
								<p class="mx-2 inline-block">
									{friend.name}
								</p>
							</div>
							<div class="px-2">
								<Button
									variant="outline"
									on:click={() => handleRemoveFriend(friend.name)}
									class={cn("w-8 h-8 p-0", disabledBtn(loading))}
								>
									<UserX class="w-5 h-5" />
								</Button>
							</div>
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
