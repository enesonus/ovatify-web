<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { displayToast } from "$lib/utils/toast";
	import { user } from "$lib/stores/user";
	import { cn } from "$lib/utils";
	import { uploadSongFile } from "$lib/services/userService";

	export let dialogOpen: boolean;

	let file: File | null = null;
	let loading = false;

	function setFile(event: Event) {
		const target = event.target as HTMLInputElement;
		file = target?.files?.[0] ?? null;
	}

	function validateFile() {
		if (!file) {
			displayToast({ type: "error", message: "No file selected" });
			return false;
		}
		const fileSplit = file.name.split(".");
		const fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
		if (fileExtension !== "json") {
			displayToast({ type: "error", message: "The file must be a JSON file" });
			return false;
		}
		return true;
	}

	async function uploadFile() {
		if (loading) return;
		if (!validateFile()) return;
		loading = true;
		const token = await $user!.getIdToken();
		const response = await uploadSongFile(token, file!);
		console.log(response);
		if (response.status === 201) {
			const data = response.data.items;
			data?.forEach((element: { message?: string; error?: string }) => {
				if (element.error) {
					displayToast({ type: "error", message: element.error });
				} else if (element.message) {
					displayToast({ type: "success", message: element.message });
				}
			});
		} else if (response.status === 400) {
			displayToast({
				type: "error",
				message: "Please make sure file data structure is correct"
			});
		} else {
			displayToast({ type: "error", message: "Error uploading file" });
		}
		dialogOpen = false;
		loading = false;
		file = null;
	}
</script>

<div class="flex flex-col gap-4 min-h-[24rem] justify-center items-center">
	<label
		for="file-upload"
		class={cn(buttonVariants({ variant: "outline" }), "w-4/5 py-8 cursor-pointer")}
		>Choose File</label
	>
	<input id="file-upload" type="file" class="hidden" accept=".json" on:change={setFile} />
	{#if file}
		<p>Chosen file "{file.name}"</p>
	{:else}
		<p>No file chosen</p>
	{/if}
	<Button
		on:click={uploadFile}
		variant="outline"
		class={cn("w-4/5", {
			"text-black bg-indigo-300 hover:bg-indigo-200 hover:text-black": !loading,
			"bg-secondary hover:bg-secondary opacity-50 cursor-not-allowed": loading
		})}>Upload File</Button
	>
</div>
