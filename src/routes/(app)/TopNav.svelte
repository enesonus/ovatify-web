<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Search } from "lucide-svelte";
	import { Icons } from "$lib/icons";
	import { cn } from "$lib/utils";
	import UserDropdown from "./UserDropdown.svelte";
</script>

<nav class="flex h-16 items-center gap-16">
	<div class="flex">
		<!-- Invisible div to align with sidenav -->
		<div class="w-20 invisible" />
		<!-- Logo and name -->
		<a href="/" class="h-full">
			<div
				class={cn(
					buttonVariants({ variant: "ghost" }),
					"flex items-center justify-center gap-2 h-full"
				)}
			>
				<Icons.logo class="h-10 w-10" />
				<p class="text-lg font-bold">Ovatify</p>
			</div>
		</a>
	</div>
	<!-- Search Bar -->
	<div class="flex justify-center items-center w-96">
		<div class="relative flex-grow mx-4 min-w-full">
			<Search class="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4" />
			<Input
				class="bg-[#292929] border-[#949494] pl-8 w-full placeholder-slate-950"
				placeholder="Search songs, albums, artists"
			/>
		</div>
	</div>
	<!-- User -->
	<div class="ml-auto w-16 h-16 flex justify-center items-center">
		<UserDropdown />
	</div>
</nav>
