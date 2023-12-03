<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Search, Menu } from "lucide-svelte";
	import { Icons } from "$lib/icons";
	import { cn } from "$lib/utils";
	import UserDropdown from "./UserDropdown.svelte";
	import * as Sheet from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";
	import SearchModal from "./SearchModal.svelte";

	let open = false;
	let searchDialogIsOpen = false;
</script>

<nav
	class="sticky bg-zinc-950 top-0 flex h-16 items-center gap-0 bg-background/60 shadow-sm backdrop-blur justify-between"
>
	<div class="flex">
		<!-- Menu Side Nav -->
		<div class="flex items-center justify-center px-2 xsm:w-20 xsm:px-0">
			<Sheet.Root bind:open>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="text-base px-2 xsm:px-4">
						<Menu class="h-6 w-6" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="">
					<a
						href="/"
						on:click={() => (open = false)}
						class="mr-6 flex items-center space-x-2"
					>
						<span class="font-bold inline-block">Ovatify</span></a
					>
					<div class="overflow-auto pt-4">
						<a href="/" on:click={() => (open = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-slate-800 hover:bg-slate-700": $page.url.pathname === "/"
									}
								)}
							>
								<Icons.navHome class="h-8 w-8" />
								Home
							</div>
						</a>
						<a href="/explore" on:click={() => (open = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-slate-800 hover:bg-slate-700": $page.url.pathname === "/explore"
									}
								)}
							>
								<Icons.navExplore class="h-8 w-8" />
								Explore
							</div>
						</a>
						<a href="/library" on:click={() => (open = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-slate-800 hover:bg-slate-700": $page.url.pathname === "/library"
									}
								)}
							>
								<Icons.navLibrary class="h-8 w-8" />
								Library
							</div>
						</a>
						<a href="/dashboard" on:click={() => (open = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-slate-800 hover:bg-slate-700": $page.url.pathname === "/dashboard"
									}
								)}
							>
								<Icons.navDashboard class="h-8 w-8" />
								Dashboard
							</div>
						</a>
						<a href="/profile" on:click={() => (open = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-slate-800 hover:bg-slate-700": $page.url.pathname === "/profile"
									}
								)}
							>
								<Icons.navProfile class="h-8 w-8" />
								Profile
							</div>
						</a>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		<!-- Logo and name -->
		<a href="/" class="h-full">
			<div
				class={cn(
					buttonVariants({ variant: "ghost" }),
					"flex items-center justify-center gap-2 h-full"
				)}
			>
				<Icons.logo class="h-8 w-8 xsm:h-10 xsm:w-10" />
				<p class="xsm:text-lg xsm:font-bold">Ovatify</p>
			</div>
		</a>
	</div>
	<!-- Search Bar -->
	<div class="hidden md:flex justify-center items-center w-96 mx-4">
		<div class="relative flex-grow mx-4 min-w-full">
			<Search class="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4" />
			<!-- <Input
				class="bg-[#292929] border-[#949494] pl-8 w-full placeholder-slate-950"
				placeholder="Search songs, albums, artists"
			/> -->
			<Button
				variant="secondary"
				on:click={() => (searchDialogIsOpen = true)}
				class="bg-[#292929] border-[#949494] border-[1px] pl-8 w-full text-[#949494] justify-start"
				>Search songs, albums, artists</Button
			>
		</div>
	</div>
	<!-- User -->
	<div class="flex justify-center items-center h-full">
		<div class="md:hidden flex justify-center items-center pr-2 xsm:pr-4">
			<Button
				variant="ghost"
				on:click={() => (searchDialogIsOpen = true)}
				class="p-0 h-8 w-8 xsm:h-12 xsm:w-12 rounded-full"
			>
				<Search class="h-6 w-6" />
			</Button>
		</div>
		<div class="w-16 flex justify-center items-center pr-4">
			<UserDropdown />
		</div>
	</div>
</nav>
<SearchModal bind:dialogIsOpen={searchDialogIsOpen} />
