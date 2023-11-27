<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Pencil } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { Input } from "$lib/components/ui/input";
	import { user } from "$lib/stores/user";
	import { displayToast } from "$lib/utils/toast";
	import { updateProfile } from "firebase/auth";
	import { editUserProfile } from "$lib/services/userService";
	import ChooseImageModal from "./ChooseImageModal.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { fade } from "svelte/transition";
	import { Switch } from "$lib/components/ui/switch";
	import { userData } from "$lib/stores/userData";
	import { placeholderImageUrl } from "$lib/constants";

	let dialogIsOpen = false;
	let imageUrl = $userData.img_url ?? "";
	let username = $userData.name ?? "";
	let consentToDataShare: boolean = false;
	let loading = false;

	$: if (!dialogIsOpen) {
		reset();
	}

	$: changesMade =
		imageUrl !== $userData.img_url ||
		username !== $userData.name ||
		consentToDataShare !== $userData.preferences.dataSharing;

	function reset() {
		imageUrl = $userData.img_url ?? "";
		username = $userData.name ?? "";
		consentToDataShare = $userData.preferences.dataSharing ?? false;
	}

	function validateUsername() {
		if (!username) return false;
		username.trim();
		return username.length >= 6 && username.length <= 16;
	}

	async function editProfile() {
		if (loading) return;
		if (!validateUsername()) {
			displayToast({
				type: "error",
				message: "Please make sure the username is between 6 and 16 characters long"
			});
			return;
		}
		loading = true;
		const body = {
			username: username,
			img_url: imageUrl
		};
		const token = await $user!.getIdToken();
		const response = await editUserProfile(token, body);
		console.log(response);
		if (response.status === 200) {
			$userData.name = username;
			$userData.img_url = imageUrl;
			displayToast({ type: "success", message: "Profile updated" });
		} else {
			displayToast({ type: "error", message: "Error updating profile" });
		}
		dialogIsOpen = false;
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "p-0 w-8 h-8")}
		><Pencil class="h-6 w-6" /><span class="sr-only">Edit Profile</span></Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg px-2 xsm:px-6 w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] min-h-[24rem] pt-10"
	>
		<div class="w-full flex flex-col items-center pt-4">
			<div class="relative">
				<img
					src={imageUrl !== "" ? imageUrl : placeholderImageUrl}
					alt={username !== "" ? username : "User"}
					class="rounded-full h-32 w-32 border-2 border-white"
				/>
				<ChooseImageModal
					on:selectImage={(e) => {
						imageUrl = e.detail;
					}}
				/>
			</div>
			<div class="py-2">
				<Input type="text" placeholder="Username" bind:value={username} />
			</div>
			<div class="flex gap-2">
				<p>I consent to sharing my data</p>
				<Switch bind:checked={consentToDataShare} />
			</div>
			{#if changesMade}
				<div transition:fade class="py-2">
					<Button
						variant="outline"
						on:click={editProfile}
						class={loading ? "bg-red-800 hover:bg-red-800" : ""}>Save Changes</Button
					>
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
