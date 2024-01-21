<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Tabs from "$lib/components/ui/tabs";
	import FriendsTab from "./FriendsTab.svelte";
	import AddFriendTab from "./AddFriendTab.svelte";
	import IncomingTab from "./IncomingTab.svelte";
	import OutgoingTab from "./OutgoingTab.svelte";

	export let refresh: boolean;
	export let refreshFriendCount: boolean;
	export let dialogOpen: boolean;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg px-0 md:px-6 w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] sm:h-[32rem]"
	>
		<Tabs.Root value="1" class="w-full px-4 pt-3 md:w-11/12">
			<Tabs.List class="hidden sm:grid w-full grid-cols-4">
				<Tabs.Trigger value="1">Friends</Tabs.Trigger>
				<Tabs.Trigger value="2">Add Friend</Tabs.Trigger>
				<Tabs.Trigger value="3">Incoming</Tabs.Trigger>
				<Tabs.Trigger value="4">Outgoing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.List class="grid sm:hidden w-full grid-cols-2 min-h-[5rem]">
				<Tabs.Trigger value="1">Friends</Tabs.Trigger>
				<Tabs.Trigger value="2">Add Friend</Tabs.Trigger>
				<Tabs.Trigger value="3">Incoming</Tabs.Trigger>
				<Tabs.Trigger value="4">Outgoing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="1">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<FriendsTab bind:dialogOpen bind:refresh />
				</div>
			</Tabs.Content>
			<Tabs.Content value="2">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<AddFriendTab bind:dialogOpen />
				</div>
			</Tabs.Content>
			<Tabs.Content value="3">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<IncomingTab bind:dialogOpen bind:refresh bind:refreshFriendCount />
				</div>
			</Tabs.Content>
			<Tabs.Content value="4">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<OutgoingTab bind:dialogOpen />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
