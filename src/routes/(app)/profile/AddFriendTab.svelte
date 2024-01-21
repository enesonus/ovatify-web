<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { sendFriendRequest } from "$lib/services/friendService";
	import { user } from "$lib/stores/user";
	import { cn } from "$lib/utils";
	import { sleep } from "$lib/utils/time";

	export let dialogOpen: boolean;
	let loading = false;

	async function handleFriendRequest(e: SubmitEvent) {
		if (loading) return;
		const formData = new FormData(e.target as HTMLFormElement);
		let username = (formData.get("username") as string) || "";
		username = username.trim();
		if (username.length < 6 || username.length > 16) {
			displayToast({
				type: "error",
				message: "Please make sure the username is between 6 and 16 characters long"
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
		dialogOpen = false;
		await sleep(0.5);
		loading = false;
	}
</script>

<form
	on:submit|preventDefault={handleFriendRequest}
	class="flex flex-col items-center justify-center w-full h-full gap-2 px-2"
>
	<h2 class="text-xl">Username</h2>
	<Input
		type="text"
		name="username"
		class="min-w-[10rem] xsm:min-w-[16rem] bg-zinc-950 max-w-xs"
	/>
	<Button
		type="submit"
		variant="outline"
		class={cn("min-w-[10rem] xsm:min-w-[16rem] transition", {
			"bg-zinc-950 hover:bg-zinc-950 opacity-50 cursor-not-allowed": loading,
			"bg-emerald-800 hover:bg-emerald-700": !loading
		})}>{loading ? "Adding... " : "Add Friend"}</Button
	>
</form>
