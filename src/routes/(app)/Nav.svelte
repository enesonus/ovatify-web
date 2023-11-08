<script lang="ts">
	import { user } from "$lib/stores/user";
	import { auth } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { signOut } from "firebase/auth";

	let loading = false;

	async function signout() {
		loading = true;
		try {
			await signOut(auth);
			displayToast({ type: "success", message: "Signed out successfully" });
		} catch (error) {
			displayToast({ type: "error", message: "Error signing out" });
			console.log("Error signing out", error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-blue-600">
	<div class="flex py-4">
		<a href="/" class="bg-red-800 p-2 text-center align-middle">Ovatify</a>
		{#if $user}
			<button
				class="bg-cyan-800 rounded-lg p-2 ml-auto mr-4"
				disabled={loading}
				on:click={signout}>Sign Out</button
			>
		{:else}
			<div class="ml-auto mr-4">
				<a href="/login" class="bg-cyan-800 rounded-lg p-2">Log In</a>
				<a href="/signup" class="bg-cyan-800 rounded-lg p-2">Sign Up</a>
			</div>
		{/if}
	</div>
</div>
