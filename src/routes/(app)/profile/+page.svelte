<script lang="ts">
	import { auth } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { signOut } from "firebase/auth";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";

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

<div>
	<div>
		<p>Profile Page</p>
		<Button variant="outline" on:click={signout}>Sign Out</Button>
	</div>
</div>
