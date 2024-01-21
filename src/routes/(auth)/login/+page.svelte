<script lang="ts">
	import {
		GoogleAuthProvider,
		getAdditionalUserInfo,
		sendEmailVerification,
		signInWithEmailAndPassword,
		signInWithPopup
	} from "firebase/auth";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import {
		auth,
		FIREBASE_ERRORS,
		firebaseDeleteUser,
		firebaseSendVerificationEmail,
		firebaseSignOut,
		requireEmailVerification
	} from "$lib/utils/firebase";
	import { displayToast } from "$lib/utils/toast";
	import { Icons } from "$lib/icons";
	import { createUser, updateLastLogin } from "$lib/services/authService";
	import { authFlowOngoing, resumingSession } from "$lib/stores/authState";
	import { getUserProfile } from "$lib/services/userService";
	import { userData } from "$lib/stores/userData";
	import { goto } from "$app/navigation";
	import { sleep } from "$lib/utils/time";
	import { fade } from "svelte/transition";
	import { page } from "$app/stores";
	import { clearSpotifyState } from "$lib/utils/spotify";

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
		if (loading || $resumingSession) return;
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
			$authFlowOngoing = true;
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			if (requireEmailVerification && !userCredential.user.emailVerified) {
				const verificationEmailSent = sessionStorage.getItem("verificationEmailSent");
				if (!verificationEmailSent) {
					firebaseSendVerificationEmail(userCredential.user);
					sessionStorage.setItem("verificationEmailSent", "true");
				}
				displayToast({
					type: "error",
					message: "Please verify your email"
				});
				await firebaseSignOut();
				loading = false;
				return;
			}
			console.log("User logged in to firebase");
			const userToken = await userCredential.user.getIdToken();
			console.log("Attempting to get user profile from database...");
			const getUserProfileResponse = await getUserProfile(userToken);
			if (getUserProfileResponse.status !== 200) {
				// If user profile doesn't exist, delete user from firebase
				if (getUserProfileResponse.status === 404) {
					await firebaseDeleteUser();
					displayToast({ type: "error", message: "Invalid Credentials" });
					return;
				}
				console.error("Server error getting user profile.");
				displayToast({
					type: "error",
					message: "Error logging in, please try again later"
				});
				await firebaseSignOut();
				loading = false;
				return;
			}
			console.log("User profile retrieved successfully.");
			userData.set(getUserProfileResponse.data);
			const updateLastLoginResponse = await updateLastLogin(userToken);
			if (updateLastLoginResponse.status !== 200) {
				console.info("Server error updating last login.");
			} else {
				console.info("Last login updated successfully.");
			}
			// Clear spotify state if user is logging in
			clearSpotifyState();
			const redirectTo = $page.url.searchParams.get("redirect");
			if (redirectTo) {
				goto(redirectTo, { replaceState: true });
			} else {
				goto("/", { replaceState: true });
			}
		} catch (error: any) {
			if (error.message === FIREBASE_ERRORS.invalidCredentials) {
				displayToast({ type: "error", message: "Invalid credentials" });
			} else {
				console.log("Error logging in", error);
				displayToast({ type: "error", message: "Error logging in" });
			}
			loading = false;
		}
	}

	async function loginWithGoogle() {
		if (loading || $resumingSession) return;
		try {
			loading = true;
			$authFlowOngoing = true;
			const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
			console.log("User logged in to firebase");
			const userToken = await userCredential.user.getIdToken();
			const userInfo = getAdditionalUserInfo(userCredential);
			console.log("User info:", userInfo);
			// Signup Flow
			if (userInfo?.isNewUser) {
				console.log("User is new, signup flow started");
				const newEmail = userCredential.user.email;
				if (!newEmail) {
					console.error("User email not found");
					displayToast({ type: "error", message: "Error signing up" });
					await firebaseSignOut();
					loading = false;
					return;
				}
				let serverRes = await createUser(userToken, newEmail);
				let retries = 0;
				// Retry with exponential backoff strategy in the case of server errors
				while (serverRes.status !== 201) {
					if (retries > 2) {
						await firebaseDeleteUser();
						loading = false;
						displayToast({
							type: "error",
							message: "There was an error signing up, please try again later."
						});
						return;
					}
					const retrySeconds = Math.pow(2, retries + 1);
					console.log(`Error creating user. Retrying in ${retrySeconds} seconds`);
					displayToast({
						type: "error",
						message: `Error creating user. Retrying in ${retrySeconds} seconds`
					});
					await sleep(retrySeconds);
					serverRes = await createUser(userToken, email);
					retries++;
				}
				console.log("Signup flow completed successfully");
			}
			// Login Flow
			console.log("Logging in...");
			console.log("Attempting to get user profile from database...");
			const getUserProfileResponse = await getUserProfile(userToken);
			if (getUserProfileResponse.status !== 200) {
				console.error("Server error getting user profile.");
				displayToast({ type: "error", message: "Error logging in" });
				await firebaseSignOut();
				loading = false;
				return;
			}
			console.log("User profile retrieved successfully.");
			userData.set(getUserProfileResponse.data);
			const updateLastLoginResponse = await updateLastLogin(userToken);
			if (updateLastLoginResponse.status !== 200) {
				console.info("Server error updating last login.");
			} else {
				console.info("Last login updated successfully.");
			}
			// Clear spotify state if user is logging in
			clearSpotifyState();
			const redirectTo = $page.url.searchParams.get("redirect");
			if (redirectTo) {
				goto(redirectTo, { replaceState: true });
			} else {
				goto("/", { replaceState: true });
			}
		} catch (e: any) {
			if (e.message === FIREBASE_ERRORS.popupClosed) {
				console.log("User closed popup");
				displayToast({ type: "error", message: "Login cancelled" });
			} else {
				console.error("Error logging in with provider", e);
			}
			loading = false;
		}
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
				on:submit|preventDefault={login}
			>
				<h1 class="pt-4 text-center text-2xl font-bold">Log In</h1>
				<div class="text-[#B3BBD8] placeholder-slate-800">
					<Label for="email">Email</Label>
					<Input
						class="bg-black mt-1"
						type="email"
						id="email"
						name="email"
						tabindex={1}
						placeholder="Enter your email"
						disabled={$resumingSession}
						bind:value={email}
					/>
				</div>
				<div>
					<div class="flex justify-between items-center font-medium text-sm">
						<Label for="password">Password</Label>
						{#if loading}
							<p class="select-none">Forgot password?</p>
						{:else}
							<a href="/reset-password" class="transition hover:opacity-75" tabindex={4}
								>Forgot password?</a
							>
						{/if}
					</div>
					<Input
						class="bg-black mt-1"
						type="password"
						id="password"
						name="password"
						tabindex={2}
						placeholder="Enter your password"
						disabled={$resumingSession}
						bind:value={password}
					/>
				</div>
				<Button
					variant={$resumingSession || !loading ? "outline" : "secondary"}
					type="submit"
					disabled={$resumingSession}
					tabindex={3}
					class="font-semibold">{!loading ? "Log In" : "Logging in..."}</Button
				>
				<div>
					{#if $resumingSession || loading}
						<p class="px-2 text-center sm:px-4 sm:text-start">
							Don't have an account? <span class="font-semibold underline">Sign up</span>
						</p>
					{:else}
						<p class="px-2 text-center sm:px-4 sm:text-start">
							Don't have an account? <a
								href="/signup"
								class="transition font-semibold underline hover:text-zinc-300">Sign up</a
							>
						</p>
					{/if}
				</div>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="px-2 text-muted-foreground"> Or continue with </span>
					</div>
				</div>
				<div class="flex flex-col gap-4 justify-center items-center">
					<Button
						variant="outline"
						on:click={() => loginWithGoogle()}
						disabled={loading || $resumingSession}
						class="border-[#B3BBD8] w-full xsm:w-3/4 font-semibold"
						><Icons.google class="h-6 w-6" /><span class="px-2">Google</span></Button
					>
				</div>
			</form>
		</div>
	</div>
</div>
