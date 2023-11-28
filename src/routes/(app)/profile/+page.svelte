<script lang="ts">
	import { auth } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { signOut } from "firebase/auth";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { UserPlus, Pencil } from "lucide-svelte";
	import { placeholderImageUrl } from "$lib/constants";

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

<div class="flex min-h-[16vh] w-4/5 bg-zinc-900 rounded-[15px] mx-auto mt-12">
	<div class="flex my-auto w-full">
		<div class=" ml-8">
			<img src={placeholderImageUrl} alt="" class=" rounded-full h-32 w-32" />
		</div>
		<div class=" my-auto">
			<p class=" pl-4 text-4xl">Erkam Demirci</p>
			<p class=" pl-4 text-[#6f6767]">25 Friends - 376 Rated Songs</p>
		</div>
		<div class=" ml-auto pr-4">
			<div class="flex gap-4">
				<UserPlus class="h-8 w-8" />
				<Pencil class="h-8 w-8" />
			</div>
		</div>
	</div>
</div>

<div class=" mx-auto w-4/5 mt-6">
	<p class=" text-left text-3xl ml-4">Content 1</p>
</div>
<div
	class="flex items-center flex-col min-h-[25vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-1 md-12"
/>

<div class=" mx-auto w-4/5 mt-6">
	<p class=" text-left text-3xl ml-4">Content 2</p>
</div>
<div
	class="flex items-center flex-col min-h-[25vh] w-4/5 bg-zinc-900 rounded-lg mx-auto mt-1 md-12"
/>

<style lang="postcss">
</style>
