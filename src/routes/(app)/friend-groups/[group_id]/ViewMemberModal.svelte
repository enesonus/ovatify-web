<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { fade } from "svelte/transition";
	import { defaultImageUrl } from "$lib/constants";
	import type { GroupMember } from "$lib/types";

	export let dialogOpen: boolean;
	export let members: GroupMember[];

	$: console.log(members);
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem]"
	>
		<div
			class="flex flex-col items-center justify-center mt-4 h-[28rem] bg-zinc-800 rounded-lg w-full"
		>
			<div class="grid w-full h-full overflow-y-auto">
				<div in:fade>
					{#if members.length > 0}
						{#each members as friend}
							<div class="p-2">
								<div
									class="w-full flex items-center justify-start bg-zinc-700 p-2 rounded-lg"
								>
									<img
										src={friend.img_url || defaultImageUrl}
										alt={friend.username}
										class="w-12 h-12 rounded-full object-cover"
									/>
									<p class="pl-2 pr-4">{friend.username}</p>
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
		</div>
	</Dialog.Content>
</Dialog.Root>
