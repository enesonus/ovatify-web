<script lang="ts">
	// @ts-nocheck
	import { X } from "svelte-share-buttons-component";

	export let text: string;
	export let url: string;
	export let hashtags: string = "ovatify,music";
</script>

<X
	{url}
	text={text + "\n\n"}
	{hashtags}
	class="w-10 h-10 flex items-center justify-center hover:border-white border-2 border-zinc-800 rounded-lg transition duration-300 delay-75 ease-in-out"
/>
