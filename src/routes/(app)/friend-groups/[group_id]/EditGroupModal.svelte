<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import type { FriendGroup } from "$lib/types";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { editFriendGroup } from "$lib/services/groupService";
	import { createEventDispatcher } from "svelte";

	export let dialogOpen = false;
	export let friendGroup: FriendGroup;

	let loading = false;

	const dispatch = createEventDispatcher();

	async function handleEditGroup(e: Event) {
		if (loading) return;
		const formData = new FormData(e.target as HTMLFormElement);
		let newGroupName = (formData.get("group-name") as string) || "";
		let newGroupDescription = (formData.get("group-description") as string) || "";
		newGroupName = newGroupName.trim();
		newGroupDescription = newGroupDescription.trim();
		if (
			newGroupName === friendGroup.name &&
			newGroupDescription === friendGroup.description
		) {
			dialogOpen = false;
			return;
		}
		if (!newGroupName) {
			displayToast({ message: "Group name cannot be empty", type: "error" });
			return;
		}
		if (newGroupName.length > 25) {
			displayToast({
				message: "Group name cannot be longer than 25 characters",
				type: "error"
			});
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await editFriendGroup(token, {
			group_id: Number(friendGroup.id),
			name: newGroupName,
			description: newGroupDescription
		});
		if (response.status === 200) {
			displayToast({ message: "Friend group updated", type: "success" });
			dialogOpen = false;
			dispatch("refresh");
		} else {
			displayToast({ message: "Error updating friend group", type: "error" });
		}
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="w-11/12 rounded-lg max-w-[90%] md:max-w-xl lg:max-w-2xl max-h-[48rem] px-2 sm:px-4"
	>
		<div class="flex flex-col gap-4 items-center justify-center my-4">
			<form on:submit|preventDefault={handleEditGroup} class="flex flex-col gap-4 w-4/5">
				<Label for="group-name">Name</Label>
				<Input
					id="group-name"
					name="group-name"
					type="text"
					placeholder="Title"
					minlength={1}
					maxlength={25}
					value={friendGroup.name}
				/>
				<Label for="group-description">Description</Label>
				<Textarea
					id="group-description"
					name="group-description"
					placeholder="Description"
					class="resize-none h-36"
					maxlength={100}
					value={friendGroup.description}
				/>
				<Button variant="outline" type="submit" class="bg-cyan-800 hover:bg-cyan-700"
					>{loading ? "Saving..." : "Save"}</Button
				>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>
