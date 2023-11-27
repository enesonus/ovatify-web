<script lang="ts">
	import { displayToast } from "$lib/utils/toast";
	import { placeholderImageUrl } from "$lib/constants";
	import ManageFriendsModal from "./ManageFriendsModal.svelte";
	import { user } from "$lib/stores/user";
	import { sleep } from "$lib/utils/time";
	import { getUserIncomingFriendRequestCount } from "$lib/services/friendService";
	import { Badge } from "$lib/components/ui/badge";
	import EditProfileModal from "./EditProfileModal.svelte";
	import { getUserProfile } from "$lib/services/userService";
	import { userData } from "$lib/stores/userData";

	let consentToDataShare: boolean = false;
	let username = $user?.displayName ?? "";

	async function getPendingFriendRequestCount() {
		const token = await $user!.getIdToken();
		const response = await getUserIncomingFriendRequestCount(token);
		if (response.status === 200) {
			console.log(response.data.count);
			return response.data.count as number;
		}
		displayToast({ type: "error", message: "Error getting friend requests" });
		return -1;
	}

	async function getProfileDetails() {
		const token = await $user!.getIdToken();
		const response = await getUserProfile(token);
		if (response.status === 200) {
			consentToDataShare = response.data.consent_to_data_share;
		} else {
			displayToast({ type: "error", message: "Error getting profile details" });
		}
	}
</script>

<div>
	<div class="flex min-h-[16vh] w-4/5 bg-zinc-900 rounded-[15px] mx-auto mt-12">
		<div class="flex my-auto w-full">
			<div class="ml-8">
				<img
					src={$userData.img_url ?? placeholderImageUrl}
					alt={$userData.name ?? "User"}
					class="rounded-full h-32 w-32"
				/>
			</div>
			<div class="my-auto">
				<p class="pl-4 text-4xl">{$userData.name ?? "User"}</p>
				<p class="pl-4 text-[#6f6767]">25 Friends - 376 Rated Songs</p>
			</div>
			<div class="ml-auto pr-4">
				<div class="flex gap-2">
					<ManageFriendsModal />
					<EditProfileModal />
				</div>
			</div>
		</div>
	</div>
	<div class="mx-auto w-4/5 mt-6">
		<p class="text-left text-3xl ml-4">Content 1</p>
	</div>
	<div
		class="flex items-center flex-col min-h-[25vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-1 md-12"
	>
		<p>Content</p>
	</div>
	<div class="mx-auto w-4/5 mt-6">
		<p class="text-left text-3xl ml-4">Content 2</p>
	</div>
	<div
		class="flex items-center flex-col min-h-[25vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-1 md-12"
	>
		<p>Content</p>
	</div>
</div>
