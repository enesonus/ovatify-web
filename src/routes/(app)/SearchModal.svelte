<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Tabs from "$lib/components/ui/tabs";
	import SpotifySearchTab from "$lib/components/SpotifySearchTab.svelte";
	import DatabaseSearchTab from "$lib/components/DatabaseSearchTab.svelte";

	export let dialogIsOpen: boolean;
</script>

<Dialog.Root bind:open={dialogIsOpen}>
	<Dialog.Content
		class="flex justify-center rounded-lg w-11/12 md:max-w-[80vw] lg:max-w-[51.2rem] h-[34rem]"
	>
		<Tabs.Root value="search-spotify" class="w-full py-4 sm:w-4/5">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="search-spotify">Spotify</Tabs.Trigger>
				<Tabs.Trigger value="search-db">Database</Tabs.Trigger>
			</Tabs.List>
			<!-- Spotify Search -->
			<Tabs.Content value="search-spotify">
				<SpotifySearchTab bind:dialogIsOpen />
			</Tabs.Content>
			<!-- Database Search -->
			<Tabs.Content value="search-db">
				<DatabaseSearchTab bind:dialogIsOpen />
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
