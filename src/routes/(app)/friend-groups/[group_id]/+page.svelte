<script lang="ts">
	import { page } from "$app/stores";
	import { getFriendGroupById } from "$lib/services/groupService";
	import { user } from "$lib/stores/user";
	import type { FriendGroup } from "$lib/types";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import GroupPlaylistCarousel from "./GroupPlaylistCarousel.svelte";
	import { userData } from "$lib/stores/userData";
	import ManageMemberModal from "./ManageMemberModal.svelte";
	import ViewMemberModal from "./ViewMemberModal.svelte";
	import EditGroupModal from "./EditGroupModal.svelte";
	import Spinner from "$lib/components/Spinner.svelte";
	import { sleep } from "$lib/utils/time";
	import { Pencil, Trash2, Users } from "lucide-svelte";
	import DeleteGroupModal from "./DeleteGroupModal.svelte";

	let refresh = false;

	let manageMemberDialogOpen = false;
	let viewMemberDialogOpen = false;
	let editGroupDialogOpen = false;
	let deleteGroupDialogOpen = false;

	async function getFriendGroup() {
		const token = await $user!.getIdToken();
		const groupId = Number($page.params.group_id);
		if (isNaN(groupId)) {
			throw new Error("Invalid group id");
		}
		const response = await getFriendGroupById(token, groupId);
		if (response.status !== 200) {
			throw new Error("Group not found");
		}
		const friendGroup = response.data.friend_group as FriendGroup;
		return friendGroup;
	}
</script>

<section class="container">
	{#key refresh}
		{#await getFriendGroup()}
			<div in:fade|global class="min-h-[8rem] flex items-center justify-center">
				<Spinner class="w-10 h-10 animate-spin" />
			</div>
		{:then friendGroup}
			<div in:fade|global>
				<div class="lg:grid grid-cols-[1fr,auto] items-center gap-2">
					<div class="break-all">
						<div class="py-2">
							<p class="my-2 text-5xl font-bold">{friendGroup.name}</p>
							<p class="my-2">{friendGroup.description}</p>
						</div>
					</div>
					{#if $userData.name === friendGroup.admin}
						<div class="lg:grid grid-cols-3 gap-2 items-center justify-center">
							<Button
								variant="outline"
								class="w-12 h-12 p-0"
								on:click={() => {
									manageMemberDialogOpen = true;
								}}><Users class="w-8 h-8" /><span class="sr-only">Members</span></Button
							>
							<Button
								variant="outline"
								class="w-12 h-12 p-0"
								on:click={() => {
									editGroupDialogOpen = true;
								}}
								><Pencil class="w-8 h-8" /><span class="sr-only">Edit Group</span></Button
							>
							<Button
								variant="outline"
								class="w-12 h-12 p-0"
								on:click={() => {
									deleteGroupDialogOpen = true;
								}}
								><Trash2 class="w-8 h-8" /><span class="sr-only">Delete Group</span
								></Button
							>
							<DeleteGroupModal bind:dialogOpen={deleteGroupDialogOpen} />
							<EditGroupModal
								on:refresh={() => {
									refresh = !refresh;
								}}
								bind:dialogOpen={editGroupDialogOpen}
								{friendGroup}
							/>
							<ManageMemberModal
								on:refresh={() => {
									refresh = !refresh;
								}}
								bind:dialogOpen={manageMemberDialogOpen}
								members={friendGroup.members}
							/>
						</div>
					{:else}
						<Button
							variant="outline"
							class="w-12 h-12 p-0"
							on:click={() => {
								viewMemberDialogOpen = true;
							}}><Users class="w-8 h-8" /><span class="sr-only">Members</span></Button
						>
						<ViewMemberModal
							bind:dialogOpen={viewMemberDialogOpen}
							members={friendGroup.members}
						/>
					{/if}
				</div>
			</div>
			<div class="py-4">
				<GroupPlaylistCarousel />
			</div>
		{:catch error}
			<div class="min-h-[8rem] flex items-center justify-center">
				<p class="text-2xl text-center">{error.message}</p>
			</div>
		{/await}
	{/key}
</section>
