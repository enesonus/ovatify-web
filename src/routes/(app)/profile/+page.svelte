<script lang="ts">
	import { displayToast } from "$lib/utils/toast";
	import ManageFriendsModal from "./ManageFriendsModal.svelte";
	import * as Avatar from "$lib/components/ui/avatar";
	import { user } from "$lib/stores/user";
	import { getUserIncomingFriendRequestCount } from "$lib/services/friendService";
	import EditProfileModal from "./EditProfileModal.svelte";
	import { getUserProfileStats } from "$lib/services/userService";
	import { userData } from "$lib/stores/userData";
	import { fade } from "svelte/transition";
	import ProfileFriends from "./ProfileFriends.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Pencil, UserPlus } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";

	let refreshFriends = false;
	let refreshFriendCount = false;
	let editProfileDialogOpen = false;
	let manageFriendsDialogOpen = false;

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

	async function getUserStats() {
		const token = await $user!.getIdToken();
		const response = await getUserProfileStats(token);
		console.log(response);
		if (response.status === 200) {
			return response.data;
		} else {
			displayToast({ type: "error", message: "Error getting profile details" });
			return {};
		}
	}
</script>

<div>
	<div class="flex min-h-[16vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-12">
		<div class="flex my-auto w-full">
			<div class="ml-8">
				<Avatar.Root class="w-32 h-32 text-3xl">
					<Avatar.Image src={$userData.img_url} alt={$userData.name} />
					<Avatar.Fallback>{$userData.name.slice(0, 2)}</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="my-auto">
				<p class="pl-4 text-4xl">{$userData.name}</p>
				{#await getUserStats()}
					<div in:fade|global class="pl-4">
						<Skeleton class="w-32 h-4 mt-2" />
						<Skeleton class="w-32 h-4 mt-2" />
						<Skeleton class="w-32 h-4 mt-2" />
					</div>
				{:then data}
					<div in:fade|global class="pl-4 text-gray-500">
						<p>
							Friends: {data.friend_count}
						</p>
						<p>Rated Songs: {data.rated_count}</p>
						<p>Rating Average: {data.rating_average}</p>
					</div>
				{/await}
			</div>
			<div class="ml-auto pr-4">
				<div class="flex gap-2">
					<Button
						variant="outline"
						class="relative p-0 w-8 h-8 sm:w-10 sm:h-10"
						on:click={() => (manageFriendsDialogOpen = true)}
					>
						{#key refreshFriendCount}
							<div
								class="absolute -top-2 -right-2 flex items-center justify-center rounded-full px-1 tabular-nums text-center text-xs min-w-[1rem] bg-red-800"
							>
								{#await getPendingFriendRequestCount()}
									<p>0</p>
								{:then data}
									<p in:fade|global>{data <= 99 ? data : "99+"}</p>
								{/await}
							</div>
						{/key}
						<UserPlus class="w-6 h-6 sm:h-8 sm:w-8" /><span class="sr-only"
							>Manage Friends</span
						>
					</Button>
					<Button
						variant="outline"
						class="p-0 w-8 h-8 sm:w-10 sm:h-10"
						on:click={() => (editProfileDialogOpen = true)}
					>
						<Pencil class="w-6 h-6 sm:h-8 sm:w-8" /><span class="sr-only"
							>Edit Profile</span
						>
					</Button>
				</div>
			</div>
		</div>
	</div>
	{#key refreshFriends}
		<ProfileFriends />
	{/key}
</div>
<ManageFriendsModal
	bind:dialogOpen={manageFriendsDialogOpen}
	bind:refresh={refreshFriends}
	bind:refreshFriendCount
/>
<EditProfileModal bind:dialogOpen={editProfileDialogOpen} />
