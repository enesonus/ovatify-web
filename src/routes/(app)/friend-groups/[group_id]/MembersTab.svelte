<script lang="ts">
	import { defaultImageUrl } from "$lib/constants";
	import { fade } from "svelte/transition";
	import { getUserFriends, removeFriend } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import type { GroupMember } from "$lib/types";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { UserX } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { sleep } from "$lib/utils/time";
	import { createEventDispatcher } from "svelte";
	import { removeFriendFromGroup } from "$lib/services/groupService";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userData";

	export let dialogOpen: boolean;
	export let members: GroupMember[];
	let loading = false;

	const dispatch = createEventDispatcher();

	async function handleRemoveMember(username: string) {
		if (loading) return;
		if (username === $userData.name) {
			displayToast({
				type: "error",
				message: "You cannot remove yourself from the friend group"
			});
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await removeFriendFromGroup(token, {
			group_id: Number($page.params.group_id),
			friend_name: username
		});
		console.log(response);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message: `Removed ${username} from the friend group successfully`
			});
			dispatch("refresh");
		} else {
			displayToast({
				type: "error",
				message: `Error removing ${username} from the friend group`
			});
		}
		dialogOpen = false;
		await sleep(1);
		loading = false;
	}
</script>

<div class="grid w-full h-full overflow-y-auto">
	<div in:fade>
		{#if members.length > 0}
			{#each members as friend}
				<div class="p-2">
					<div class="w-full flex items-center justify-start bg-zinc-700 p-2 rounded-lg">
						<img
							src={friend.img_url || defaultImageUrl}
							alt={friend.username}
							class="w-12 h-12 rounded-full object-cover"
						/>
						<p class="pl-2 pr-4">{friend.username}</p>
						<div class="ml-auto pr-4">
							<Button
								variant="outline"
								on:click={() => handleRemoveMember(friend.username)}
								class={cn("w-8 h-8 p-0", {
									"opacity-50 hover:bg-zinc-950 cursor-not-allowed": loading
								})}
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
</div>
