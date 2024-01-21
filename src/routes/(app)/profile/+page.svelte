<script lang="ts">
	import { displayToast, promiseToast } from "$lib/utils/toast";
	import ManageFriendsModal from "./ManageFriendsModal.svelte";
	import * as Avatar from "$lib/components/ui/avatar";
	import { user } from "$lib/stores/user";
	import {
		getUserFriends,
		getUserIncomingFriendRequestCount
	} from "$lib/services/friendService";
	import EditProfileModal from "./EditProfileModal.svelte";
	import { getUserProfileStats } from "$lib/services/userService";
	import { userData } from "$lib/stores/userData";
	import { fade } from "svelte/transition";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Pencil, UserPlus, Bell } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { Icons } from "$lib/icons";
	import { sleep } from "$lib/utils/time";
	import SpotifyProfileModal from "./SpotifyProfileModal.svelte";
	import NotificationsModal from "./NotificationsModal.svelte";
	import type { Friend } from "$lib/types";
	import Spinner from "$lib/components/Spinner.svelte";
	import { defaultImageUrl } from "$lib/constants";

	let refreshFriends = false;
	let refreshFriendCount = false;
	let editProfileDialogOpen = false;
	let manageFriendsDialogOpen = false;
	let spotifyProfileDialogOpen = false;
	let notificationsDialogOpen = false;

	async function getPendingFriendRequestCount() {
		const token = await $user!.getIdToken();
		const response = await getUserIncomingFriendRequestCount(token);
		if (response.status === 200) {
			return response.data.count as number;
		}
		displayToast({ type: "error", message: "Error getting friend requests" });
		return -1;
	}

	async function getUserStats() {
		const token = await $user!.getIdToken();
		const response = await getUserProfileStats(token);
		if (response.status === 200) {
			return response.data;
		} else {
			displayToast({ type: "error", message: "Error getting profile details" });
			return {};
		}
	}

	async function getAllFriends() {
		const token = await $user!.getIdToken();
		const response = await getUserFriends(token);
		if (response.status !== 200) {
			return [];
		}
		const friends = response.data.friends as Friend[];
		if (!friends || friends.length === 0) {
			return [];
		}
		return friends.slice(0, 5);
	}
</script>

<section class="container">
	<div
		class="flex flex-col sm:flex-row bg-zinc-900 rounded-lg p-2 items-center justify-center"
	>
		<Avatar.Root class="w-32 h-32 border-zinc-500 border-2 text-3xl">
			<Avatar.Image src={$userData.img_url} alt={$userData.name} />
			<Avatar.Fallback>{$userData.name.slice(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
		<div class="text-center sm:text-start pt-2">
			<p class="px-4 text-4xl">{$userData.name}</p>
			{#key refreshFriends}
				{#await getUserStats()}
					<div in:fade|global class="px-4">
						<Skeleton class="w-32 h-4 mt-2" />
						<Skeleton class="w-32 h-4 mt-2" />
						<Skeleton class="w-32 h-4 mt-2" />
					</div>
				{:then data}
					<div in:fade|global class="px-4 text-gray-500">
						<p>
							Friends: {data.friend_count}
						</p>
						<p>Rated Songs: {data.rated_count}</p>
						<p>Rating Average: {data.rating_average}</p>
					</div>
				{/await}
			{/key}
		</div>
		<div class="pt-2 sm:ml-auto sm:pr-2">
			<div class="flex gap-2">
				<Button
					variant="outline"
					class="p-0 w-10 h-10"
					on:click={() => (spotifyProfileDialogOpen = true)}
					><Icons.spotify class="h-6 w-6 sm:h-8 sm:w-8" /><span class="sr-only"
						>Import to Spotify</span
					></Button
				>
				<Button
					variant="outline"
					class="p-0 w-10 h-10"
					on:click={() => (notificationsDialogOpen = true)}
					><Bell class="h-6 w-6 sm:h-8 sm:w-8" /><span class="sr-only">Notifications</span
					></Button
				>
				<Button
					variant="outline"
					class="relative p-0 w-10 h-10"
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
					class="p-0 w-10 h-10"
					on:click={() => (editProfileDialogOpen = true)}
				>
					<Pencil class="w-6 h-6 sm:h-8 sm:w-8" /><span class="sr-only">Edit Profile</span
					>
				</Button>
			</div>
		</div>
	</div>
	{#key refreshFriends}
		<div class="mt-4">
			<p class="text-2xl pb-2">Friends</p>
		</div>
		<div class="flex justify-center items-center bg-zinc-900 rounded-lg min-h-[14rem]">
			{#await getAllFriends()}
				<div class="flex items-center justify-center">
					<Spinner class="w-16 h-16 animate-spin" />
				</div>
			{:then friends}
				<div in:fade|global class="friend-display">
					{#if friends.length > 0}
						{#each friends.slice(0, 5) as friend}
							<div class="grid justify-center items-center w-full max-w-[16rem]">
								<img
									src={friend.img_url || defaultImageUrl}
									alt={friend.name}
									class="w-32 mx-auto object-cover rounded-full"
								/>
								<p class="pt-2 text-center text-lg truncate">
									{friend.name}
								</p>
							</div>
						{/each}
					{:else}
						<div class="flex flex-col items-center justify-center w-full h-full gap-2">
							<h2 class="text-xl">No friends found</h2>
						</div>
					{/if}
				</div>
			{/await}
		</div>
	{/key}
</section>

<ManageFriendsModal
	bind:dialogOpen={manageFriendsDialogOpen}
	bind:refresh={refreshFriends}
	bind:refreshFriendCount
/>
<EditProfileModal bind:dialogOpen={editProfileDialogOpen} />
<SpotifyProfileModal bind:dialogOpen={spotifyProfileDialogOpen} />
<NotificationsModal bind:dialogOpen={notificationsDialogOpen} />

<style lang="postcss">
	.friend-display {
		display: grid;
		gap: 1rem;
		width: 100%;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
	}
</style>
