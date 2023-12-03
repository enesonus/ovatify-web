<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import FriendsTab from "./FriendsTab.svelte";
	import AddFriendTab from "./AddFriendTab.svelte";
	import IncomingTab from "./IncomingTab.svelte";
	import OutgoingTab from "./OutgoingTab.svelte";
	import { UserPlus } from "lucide-svelte";
	import { cn } from "$lib/utils";

	let dialogIsOpen = false;
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "p-0 w-8 h-8")}
		><UserPlus class="h-6 w-6" /><span class="sr-only">Manage Friends</span
		></Dialog.Trigger
	>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem]"
	>
		<Tabs.Root value="1" class="w-11/12">
			<Tabs.List class="grid w-full grid-cols-4">
				<Tabs.Trigger value="1">Friends</Tabs.Trigger>
				<Tabs.Trigger value="2">Add Friend</Tabs.Trigger>
				<Tabs.Trigger value="3">Incoming Requests</Tabs.Trigger>
				<Tabs.Trigger value="4">Outgoing Requests</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="1">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<FriendsTab />
				</div>
			</Tabs.Content>
			<Tabs.Content value="2">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<AddFriendTab bind:dialogIsOpen />
				</div>
			</Tabs.Content>
			<Tabs.Content value="3">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<IncomingTab bind:dialogIsOpen />
				</div>
			</Tabs.Content>
			<Tabs.Content value="4">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<OutgoingTab bind:dialogIsOpen />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
