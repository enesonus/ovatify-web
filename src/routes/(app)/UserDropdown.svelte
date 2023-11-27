<script lang="ts">
	import { LogOut, Settings } from "lucide-svelte";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { displayToast } from "$lib/utils/toast";
	import { auth } from "$lib/utils/firebase";
	import { signOut } from "firebase/auth";
	import { goto } from "$app/navigation";
	import { user } from "$lib/stores/user";
	import { userData } from "$lib/stores/userData";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	let loading = false;

	async function signout() {
		if (loading) return;
		loading = true;
		try {
			await signOut(auth);
			displayToast({ type: "success", message: "Signed out successfully" });
			goto("/login");
		} catch (error) {
			displayToast({ type: "error", message: "Error signing out" });
			console.log("Error signing out", error);
		} finally {
			loading = false;
		}
	}
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger>
		<Avatar.Root class="w-8 h-8 text-xs xsm:text-base xsm:w-12 xsm:h-12 ">
			{#if $userData.img_url}
				<Avatar.Image src={$userData.img_url} alt={$userData.name} />
				<Avatar.Fallback>{$userData.name.slice(0, 2)}</Avatar.Fallback>
			{:else}
				<Skeleton class="w-8 h-8 text-xs xsm:text-base xsm:w-12 xsm:h-12" />
			{/if}
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-max xsm:w-56">
		<DropdownMenu.Label>Account</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/test" class="cursor-pointer">
				<Settings class="mr-2 h-4 w-4 inline-flex" /><span>Test</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={signout} class="cursor-pointer">
				<LogOut class="mr-2 h-4 w-4 inline-flex" />
				<span>Sign Out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
