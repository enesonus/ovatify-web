<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";
	import { fade } from "svelte/transition";
	import { getUserFriends, removeFriend } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { Friend, GroupMember } from "$lib/types";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { Plus } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { sleep } from "$lib/utils/time";
	import { addFriendToGroup } from "$lib/services/groupService";
	import { page } from "$app/stores";
	import { createEventDispatcher } from "svelte";

	export let dialogOpen: boolean;
	export let members: GroupMember[];
	let loading = false;

	const dispatch = createEventDispatcher();

	async function getAllFriends() {
		const token = await $user!.getIdToken();
		const response = await getUserFriends(token!);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.friends as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends.filter(
			(friend) => !members.find((member) => member.username === friend.name)
		);
	}

	async function handleAddFriendToGroup(username: string) {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await addFriendToGroup(token, {
			group_id: Number($page.params.group_id),
			friend_name: username
		});
		console.log(response);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message: `Added ${username} to the friend group successfully`
			});
			dispatch("refresh");
		} else {
			displayToast({
				type: "error",
				message: `Error adding ${username} to friend group`
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
	{:then eligibleFriends}
		<div in:fade>
			{#if eligibleFriends.length > 0}
				{#each eligibleFriends as friend}
					<div class="p-2">
						<div
							class="w-full flex items-center justify-start bg-zinc-700 p-2 rounded-lg"
						>
							<img
								src={friend.img_url || defaultImageUrl}
								alt={friend.name || "User"}
								class="w-12 h-12 rounded-full object-cover"
							/>
							<p class="pl-2 pr-4">{friend.name}</p>
							<div class="ml-auto pr-4">
								<Button
									variant="outline"
									on:click={() => handleAddFriendToGroup(friend.name)}
									class={cn("w-8 h-8 p-0", {
										"opacity-50 hover:bg-zinc-950 cursor-not-allowed": loading
									})}
								>
									<Plus class="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex flex-col items-center justify-center w-full h-full gap-2">
					<h2 class="text-xl">No eligible friends found</h2>
				</div>
			{/if}
		</div>
	{/await}
</div>
