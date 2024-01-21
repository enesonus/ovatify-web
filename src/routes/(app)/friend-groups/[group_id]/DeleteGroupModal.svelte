<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Dialog from "$lib/components/ui/dialog";
	import { deleteFriendGroup } from "$lib/services/groupService";
	import { user } from "$lib/stores/user";
	import { sleep } from "$lib/utils/time";
	import { displayToast } from "$lib/utils/toast";
	export let dialogOpen: boolean;
	import { Button } from "$lib/components/ui/button";

	let loading = false;

	async function handleDeleteGroup() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteFriendGroup(token, $page.params.group_id);
		console.log(response);
		if (response.status === 204) {
			displayToast({
				type: "success",
				message: "Friend group deleted successfully"
			});
			goto("/friend-groups", { replaceState: true });
			return;
		}
		displayToast({
			type: "error",
			message: "Error deleting group"
		});
		dialogOpen = false;
		await sleep(1);
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description>This action will delete this friend group!</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<form on:submit|preventDefault={handleDeleteGroup} class="w-full">
				<Button variant="destructive" type="submit" class="w-full"
					>{loading ? "Deleting..." : "Delete"}</Button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
