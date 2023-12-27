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
	import { cn } from "$lib/utils";
	import { clearSpotifyState } from "$lib/utils/spotify";
	import { sleep } from "$lib/utils/time";
	import { goto } from "$app/navigation";
	import { authFlowOngoing } from "$lib/stores/authState";

	export let dialogOpen: boolean;
	let imageUrl = $userData.img_url;
	let username = $userData.name;
	let dataShareConsent: boolean = $userData.preferences.data_sharing;
	let dataProcessingConsent: boolean = $userData.preferences.data_processing;
	let updating = false;
	let deleting = false;
	let deleteConfirmDialogOpen = false;

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
		if (updating || deleting) return;
		if (!changesMade) {
			dialogOpen = false;
			return;
		}
		if (!validateUsername()) {
			displayToast({
				type: "error",
				message: "Please make sure the username is between 6 and 16 characters long"
			});
			return;
		}
		updating = true;
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
		updating = false;
	}

	async function handleDeleteUser(e: SubmitEvent) {
		if (deleting || updating) return;
		const formData = new FormData(e.target as HTMLFormElement);
		const confirmation = (formData.get("confirmation") as string) || "";
		if (confirmation !== "CONFIRM") {
			displayToast({
				type: "error",
				message: "Type CONFIRM to confirm deletion"
			});
			return;
		}
		deleting = true;
		const token = await $user!.getIdToken();
		const response = await deleteUserFromDatabase(token);
		if (response.status === 204) {
			firebaseDeleteUser();
			resetUserData();
			clearSpotifyState();
			displayToast({
				type: "success",
				message: "Account deleted successfully"
			});
			$authFlowOngoing = true;
		} else {
			displayToast({ type: "error", message: "Error deleting profile" });
		}
		deleting = false;
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
				class={cn("w-1/2 mt-2", {
					"bg-cyan-800 hover:bg-cyan-700": changesMade,
					"opacity-50 cursor-not-allowed": updating || deleting
				})}>{updating ? "Saving..." : "Save Changes"}</Button
			>
			<Button
				variant="outline"
				type="submit"
				on:click={() => {
					if (!updating && !deleting) deleteConfirmDialogOpen = true;
				}}
				class={cn("w-1/2 mt-2 bg-red-800 hover:bg-red-700", {
					"hover:bg-red-800 opacity-50 cursor-not-allowed": updating || deleting
				})}>Delete Account</Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete confirm modal -->
<Dialog.Root bind:open={deleteConfirmDialogOpen}>
	<Dialog.Content class="rounded-lg max-w-[16rem] sm:max-w-xs md:max-w-md px-4 sm:px-6">
		<Dialog.Header class="pt-4">
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description
				>This action will delete your account and is irreversible!</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<form on:submit|preventDefault={handleDeleteUser} class="w-full">
				<Input
					type="text"
					name="confirmation"
					placeholder={`Type "CONFIRM" to confirm`}
					class="w-full mb-4"
					disabled={deleting || updating}
				/>
				<Button
					variant="destructive"
					class={cn("w-full", {
						"opacity-50 cursor-not-allowed": deleting || updating
					})}
					type="submit">{deleting ? "Deleting..." : "Permanently Delete Account"}</Button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
