<script lang="ts">
	import { auth } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { signOut } from "firebase/auth";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import * as api from "$lib/utils/api";
	import { user } from "$lib/stores/user";

	let loading = false;

	async function testFunction() {
		if (loading) return;
		loading = true;
		try {
			const userToken = await $user?.getIdToken();
			const res = await api.get("users/return-post-body", userToken);
			displayToast({
				type: "success",
				message: `Status ${res?.status} | ${res?.data?.message ?? "No Token"} 
			| UID: ${res?.data?.uid ?? "No UID"}`
			});
		} catch {
			displayToast({ type: "error", message: "Error getting genres" });
		} finally {
			loading = false;
		}
	}

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
		<Button variant={!loading ? "outline" : "destructive"} on:click={testFunction}
			>Send API call to backend</Button
		>
	</div>
</div>
