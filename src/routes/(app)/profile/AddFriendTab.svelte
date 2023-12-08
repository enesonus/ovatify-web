<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { displayToast, makeToast } from "$lib/utils/toast";
	import { sendFriendRequest } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";

	export let dialogIsOpen: boolean;
	let username = "";
	let loading = false;

	async function handleFriendRequest() {
		if (loading) return;
		if (username.length === 0 || username.length > 32) {
			displayToast({
				type: "error",
				message: "Please make sure the username is between 1 and 32 characters long"
			});
			return;
		}
		loading = true;
		const token = await $user!.getIdToken();
		const response = await sendFriendRequest(token, username);
		if (response.status === 200) {
			displayToast({
				type: "success",
				message: "Friend request sent"
			});
			username = "";
		} else if (response.status === 404) {
			displayToast({
				type: "error",
				message: "This user does not exist"
			});
		} else if (response.status === 400) {
			console.log(response);
			displayToast({
				type: "error",
				message: response.data.error
			});
		} else if (response.status === 409) {
			displayToast({
				type: "error",
				message: "You already have a pending friend request from this user"
			});
		} else {
			displayToast({
				type: "error",
				message: "Something went wrong"
			});
		}
		console.log(response);
		dialogIsOpen = false;
		loading = false;
	}
</script>

<form
	on:submit|preventDefault
	class="flex flex-col items-center justify-center w-full h-full gap-2"
>
	<h2 class="text-xl">Username</h2>
	<Input type="text" bind:value={username} class="min-w-[16rem] bg-black max-w-xs" />
	<Button
		type="submit"
		variant="outline"
		class={loading
			? "min-w-[12rem] bg-red-800 hover:bg-red-800"
			: "min-w-[12rem] hover:bg-zinc-700"}
		on:click={handleFriendRequest}>{loading ? "Adding... " : "Add Friend"}</Button
	>
</form>
