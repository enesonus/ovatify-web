<script lang="ts">
	import { LogOut, Settings, UserCircle } from "lucide-svelte";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { displayToast } from "$lib/utils/toast";
	import { firebaseSignOut } from "$lib/utils/firebase";
	import { resetUserData, userData } from "$lib/stores/userData";
	import { dev } from "$app/environment";
	import { clearSpotifyState } from "$lib/utils/spotify";

	let loading = false;

	async function signout() {
		if (loading) return;
		loading = true;
		try {
			await firebaseSignOut();
			clearSpotifyState();
			resetUserData();
			displayToast({ type: "success", message: "Signed out successfully" });
		} catch (error) {
			displayToast({ type: "error", message: "Error signing out" });
			console.log("Error signing out", error);
		} finally {
			loading = false;
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root class="w-8 h-8 text-xs xsm:text-base xsm:w-12 xsm:h-12">
			<Avatar.Image src={$userData.img_url} alt={$userData.name} />
			<Avatar.Fallback>{$userData.name.slice(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-max xsm:w-56">
		<DropdownMenu.Label>@{$userData.name}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/profile" class="cursor-pointer py-2">
				<UserCircle class="mr-2 h-4 w-4 inline-flex" /><span>Profile</span>
			</DropdownMenu.Item>
			{#if dev}
				<DropdownMenu.Item href="/test" class="cursor-pointer py-2">
					<Settings class="mr-2 h-4 w-4 inline-flex" /><span>Test</span>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item
				on:click={signout}
				class="cursor-pointer py-2"
				data-testid="logout-btn"
			>
				<LogOut class="mr-2 h-4 w-4 inline-flex" />
				<span>Sign Out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
