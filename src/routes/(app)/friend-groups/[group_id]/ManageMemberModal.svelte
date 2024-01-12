<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Tabs from "$lib/components/ui/tabs";
	import type { GroupMember } from "$lib/types";
	import AddMemberTab from "./AddMemberTab.svelte";
	import MembersTab from "./MembersTab.svelte";

	export let dialogOpen: boolean;
	export let members: GroupMember[];
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[32rem]"
	>
		<Tabs.Root value="1" class="w-11/12">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="1">Members</Tabs.Trigger>
				<Tabs.Trigger value="2">Add Member</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="1">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<MembersTab bind:dialogOpen {members} on:refresh />
				</div>
			</Tabs.Content>
			<Tabs.Content value="2">
				<div
					class="flex flex-col items-center justify-center mt-4 h-96 bg-zinc-800 rounded-lg"
				>
					<AddMemberTab bind:dialogOpen {members} on:refresh />
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
