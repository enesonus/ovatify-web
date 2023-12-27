<script lang="ts">
	import "../app.css";
	import { navigating } from "$app/stores";
	import { Toaster } from "svelte-french-toast";
	import LoadingIndicator from "./LoadingIndicator.svelte";
</script>

{#if $navigating}
	<LoadingIndicator />
{/if}

<Toaster />

<slot />
