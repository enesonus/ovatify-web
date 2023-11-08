<script lang="ts">
	import { onDestroy } from "svelte";
	import { signInWithEmailAndPassword } from "firebase/auth";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { user } from "$lib/stores/user";
	import { goto } from "$app/navigation";
	import { auth, FIREBASE_ERRORS } from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import * as api from "$lib/utils/api";
	import { Icons } from "$lib/icons";

	let email = "";
	let password = "";
	let loading = false;

	function validateEmail() {
		email = email.trim();
		let error = "";
		if (email.length === 0 || !email.includes("@"))
			error = "Please provide a valid email";
		return error;
	}

	function validatePassword() {
		password = password.trim();
		let error = "";
		if (password.length < 8 || password.length > 16)
			error = "Password must be between 8 and 16 characters long";
		return error;
	}

	async function login() {
		if (loading) return;
		const emailError = validateEmail();
		if (emailError !== "") {
			displayToast({ type: "error", message: emailError });
			return;
		}
		const passwordError = validatePassword();
		if (passwordError !== "") {
			displayToast({ type: "error", message: passwordError });
			return;
		}
		loading = true;
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			displayToast({ type: "success", message: "Firebase login successful" });
			const userToken = await userCredential.user.getIdToken();
			const serverRes = await api.post("users/login/", userToken);
			if (serverRes.status !== 200) {
				console.error("Server error updating last login ");
			}
		} catch (error: any) {
			console.log("Error message: ", error.message);
			if (error.message === FIREBASE_ERRORS.invalidCredentials) {
				displayToast({ type: "error", message: "Invalid credentials" });
			} else {
				console.log("Error logging in", error);
				displayToast({ type: "error", message: "Error logging in" });
			}
		} finally {
			loading = false;
		}
	}

	const unsubscribe = user.subscribe((value) => {
		if (value) {
			goto("/");
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="flex flex-col justify-center items-center min-h-screen">
	<div class="flex flex-col justify-center items-center">
		<div class="py-4">
			<Icons.logoWithText />
		</div>
		<div
			class="flex border-[2px] bg-[#1D1F26] text-[#B3BBD8] rounded-2xl
					 w-[20rem] xsm:w-[24rem] sm:w-[32rem] justify-center items-center pb-8 mt-4 mb-8"
		>
			<form class="flex flex-col p-4 gap-4 xsm:w-[24rem]" on:submit|preventDefault>
				<h1 class="pt-4 text-center text-2xl font-bold">Log In</h1>
				<div class="text-[#B3BBD8] placeholder-slate-800">
					<Label>Enter your email</Label>
					<Input
						class="bg-black mt-1"
						type="email"
						placeholder="Enter your email"
						bind:value={email}
					/>
				</div>
				<div>
					<Label>Enter your password</Label>
					<Input
						class="bg-black mt-1"
						type="password"
						placeholder="Enter your password"
						bind:value={password}
					/>
				</div>
				<Button
					variant={!loading ? "outline" : "destructive"}
					type="submit"
					on:click={login}
					class="font-semibold">{!loading ? "Log In" : "Logging in..."}</Button
				>
				<div>
					<p class="pl-4">
						Don't have an account? <a href="/signup" class="font-semibold underline"
							>Sign up</a
						>
					</p>
				</div>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="px-2 text-muted-foreground"> Or continue with </span>
					</div>
				</div>
				<div class="flex flex-col gap-4 justify-center items-center pb-4">
					<Button
						variant="outline"
						on:click={() => {
							displayToast({ type: "error", message: "Not implemented yet" });
						}}
						class="border-[#B3BBD8] xsm:w-3/4 font-semibold"
						><Icons.google class="h-6 w-6" /><span class="px-2">Google</span></Button
					>
					<Button
						variant="outline"
						on:click={() => {
							displayToast({ type: "error", message: "Not implemented yet" });
						}}
						class="border-[#B3BBD8] xsm:w-3/4 font-semibold text-start"
						><Icons.github class="h-6 w-6" /><span class="px-2">Github</span></Button
					>
				</div>
			</form>
		</div>
	</div>
</div>
