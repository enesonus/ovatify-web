<script lang="ts">
	import { firebaseSendPasswordResetEmail } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Icons } from "$lib/icons";
	import { fade } from "svelte/transition";
	import { Label } from "$lib/components/ui/label";
	import { sleep } from "$lib/utils/time";
	import { cn } from "$lib/utils";

	let loading = false;

	async function handleSendPasswordReset(e: SubmitEvent) {
		if (loading) return;
		const formData = new FormData(e.target as HTMLFormElement);
		let email = formData.get("email") ? String(formData.get("email")) : "";
		email = email.trim();
		if (email.length === 0 || !email.includes("@")) {
			displayToast({
				type: "error",
				message: "Please provide an email"
			});
			return;
		}
		loading = true;
		await sleep(1);
		const success = await firebaseSendPasswordResetEmail(email);
		if (success) {
			displayToast({
				type: "success",
				message: "Password reset email sent successfully"
			});
		} else {
			displayToast({
				type: "error",
				message: "Error sending password reset email"
			});
		}
		loading = false;
	}
</script>

<div class="flex flex-col justify-center items-center min-h-[85vh] sm:min-h-screen">
	<div in:fade|global class="flex flex-col justify-center items-center">
		<div class="py-4">
			<Icons.logoWithText />
		</div>
		<div
			class="flex border-2 bg-[#1D1F26] text-[#B3BBD8] rounded-2xl justify-center items-center
					 w-[20rem] xsm:w-[24rem] sm:w-[26rem] max-w-[90vw] pb-4 mt-4 mb-8"
		>
			<form
				class="flex flex-col p-4 gap-4 xsm:w-[24rem]"
				on:submit|preventDefault={handleSendPasswordReset}
			>
				<h1 class="pt-4 text-center text-2xl font-bold">Reset Password</h1>
				<div class="text-[#B3BBD8] placeholder-slate-800">
					<Label for="email">Email</Label>
					<Input
						class="bg-black mt-1"
						type="email"
						id="email"
						name="email"
						placeholder="Enter your email"
					/>
				</div>
				<Button
					variant="outline"
					type="submit"
					class={cn("font-semibold", {
						"opacity-50 cursor-not-allowed hover:bg-zinc-950": loading
					})}>{!loading ? "Reset Password" : "Sending reset email..."}</Button
				>
				<div class="flex items-center justify-center w-full">
					{#if !loading}
						<a
							href="/login"
							class="font-semibold underline hover:text-zinc-300 transition">Log in</a
						>
						<span class="mx-2">or</span>
						<a
							href="/signup"
							class="font-semibold underline hover:text-zinc-300 transition">Sign up</a
						>
					{:else}
						<p class="font-semibold">Log in</p>
						<span class="mx-2">or</span>
						<p class="font-semibold">Sign up</p>
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
