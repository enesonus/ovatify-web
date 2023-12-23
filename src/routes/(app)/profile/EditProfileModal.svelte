<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Input } from "$lib/components/ui/input";
	import { user } from "$lib/stores/user";
	import { displayToast } from "$lib/utils/toast";
	import { deleteUserFromDatabase, editUserProfile } from "$lib/services/userService";
	import ChooseImageModal from "./ChooseImageModal.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Switch } from "$lib/components/ui/switch";
	import { resetUserData, userData } from "$lib/stores/userData";
	import { firebaseDeleteUser } from "$lib/utils/firebase";

	export let dialogOpen: boolean;
	let imageUrl = $userData.img_url;
	let username = $userData.name;
	let dataShareConsent: boolean = $userData.preferences.data_sharing;
	let dataProcessingConsent: boolean = $userData.preferences.data_processing;
	let loading = false;

	$: if (!dialogOpen) {
		reset();
	}

	$: changesMade =
		imageUrl !== $userData.img_url ||
		username !== $userData.name ||
		dataShareConsent !== $userData.preferences.data_sharing ||
		dataProcessingConsent !== $userData.preferences.data_processing;

	function reset() {
		imageUrl = $userData.img_url;
		username = $userData.name;
		dataShareConsent = $userData.preferences.data_sharing;
		dataProcessingConsent = $userData.preferences.data_processing;
	}

	function validateUsername() {
		if (!username) return false;
		username.trim();
		return username.length >= 6 && username.length <= 16;
	}

	async function editProfile() {
		if (loading || !changesMade) return;
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
			img_url: imageUrl,
			data_sharing_consent: dataShareConsent,
			data_processing_consent: dataProcessingConsent
		};
		const token = await $user!.getIdToken();
		const response = await editUserProfile(token, body);
		console.log(response);
		if (response.status === 204) {
			$userData.name = username;
			$userData.img_url = imageUrl;
			$userData.preferences.data_sharing = dataShareConsent;
			$userData.preferences.data_processing = dataProcessingConsent;
			displayToast({ type: "success", message: "Profile updated" });
		} else if (response.status === 400) {
			displayToast({ type: "error", message: response.data.error });
		} else {
			displayToast({ type: "error", message: "Error updating profile" });
		}
		dialogOpen = false;
		loading = false;
	}

	// TODO: Implement this
	async function deleteUserAccount() {
		if (loading) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await deleteUserFromDatabase(token);
		if (response.status === 204) {
			firebaseDeleteUser();
			resetUserData();
			displayToast({
				type: "success",
				message: "Account deleted successfully."
			});
		} else {
			displayToast({ type: "error", message: "Error deleting profile" });
		}
		loading = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg px-2 xsm:px-6 w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] min-h-[32rem]"
	>
		<form
			on:submit|preventDefault
			class="w-full xsm:w-3/4 flex flex-col items-center justify-center py-4"
		>
			<div class="relative">
				<Avatar.Root class="w-32 h-32 text-3xl">
					<Avatar.Image src={imageUrl} alt={username} />
					<Avatar.Fallback>{username.slice(0, 2)}</Avatar.Fallback>
				</Avatar.Root>
				<ChooseImageModal
					on:selectImage={(e) => {
						imageUrl = e.detail;
					}}
				/>
			</div>
			<div class="py-4">
				<Input
					type="text"
					placeholder="Username"
					class="text-center"
					bind:value={username}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-center gap-2">
					<p class="flex-1 text-center">Use my data for processing</p>
					<Switch bind:checked={dataProcessingConsent} />
				</div>
				<div class="flex justify-between items-center gap-2">
					<p class="flex-1 text-center">Use my data for sharing</p>
					<Switch bind:checked={dataShareConsent} />
				</div>
			</div>
			<Button
				variant="outline"
				type="submit"
				on:click={editProfile}
				class={loading || !changesMade
					? "w-1/2 mt-2 bg-red-800 hover:bg-red-800"
					: "w-1/2 mt-2 bg-emerald-800 hover:bg-emerald-700"}
				>{loading ? "Saving..." : "Save Changes"}</Button
			>
			<Button
				variant="outline"
				type="submit"
				on:click={() => displayToast({ type: "error", message: "Not implemented" })}
				class={loading
					? "w-1/2 mt-2 bg-red-800 hover:bg-red-800"
					: "w-1/2 mt-2 bg-red-800 hover:bg-red-700"}>Delete Account</Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
