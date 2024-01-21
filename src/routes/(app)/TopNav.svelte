<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import { Search, Menu } from "lucide-svelte";
	import { Icons } from "$lib/icons";
	import { cn } from "$lib/utils";
	import UserDropdown from "./UserDropdown.svelte";
	import * as Sheet from "$lib/components/ui/sheet";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";
	import SearchModal from "$lib/components/SearchModal.svelte";
	import { onMount } from "svelte";

	let sideMenuOpen = false;
	let searchDialogOpen = false;

	// Open search dialog on ctrl/cmd + k
	function down(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchDialogOpen = !searchDialogOpen;
		}
	}

	onMount(() => {
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	});
</script>

<nav
	class="sticky z-20 bg-zinc-950 top-0 flex h-16 items-center gap-0 bg-background/60 shadow-sm backdrop-blur justify-between"
>
	<div class="flex">
		<!-- Menu Side Nav -->
		<div class="flex sm:hidden items-center justify-center px-2 xsm:w-20 xsm:px-0">
			<Sheet.Root bind:open={sideMenuOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="text-base px-2 xsm:px-4">
						<Menu class="h-6 w-6" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left">
					<a
						href="/"
						on:click={() => (sideMenuOpen = false)}
						class="mr-6 flex items-center space-x-2"
					>
						<span class="font-bold inline-block">Ovatify</span></a
					>
					<div class="overflow-auto pt-4">
						<a href="/" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700": $page.url.pathname === "/"
									}
								)}
							>
								<Icons.navHome class="h-8 w-8" />
								Home
							</div>
						</a>
						<a href="/explore" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700": $page.url.pathname === "/explore"
									}
								)}
							>
								<Icons.navExplore class="h-8 w-8" />
								Explore
							</div>
						</a>
						<a href="/library" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700": $page.url.pathname === "/library"
									}
								)}
							>
								<Icons.navLibrary class="h-8 w-8" />
								Library
							</div>
						</a>
						<a href="/stats" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700": $page.url.pathname === "/stats"
									}
								)}
							>
								<Icons.navStats class="h-8 w-8" />
								Stats
							</div>
						</a>
						<a href="/friend-groups" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700":
											$page.url.pathname.includes("/friend-groups")
									}
								)}
							>
								<Icons.navGroups class="h-8 w-8" />
								Groups
							</div>
						</a>
						<a href="/profile" on:click={() => (sideMenuOpen = false)}>
							<div
								class={cn(
									buttonVariants({ variant: "ghost" }),
									"flex gap-2 pl-2 py-6 justify-start items-center font-semibold",
									{
										"bg-zinc-800 hover:bg-zinc-700": $page.url.pathname === "/profile"
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
		<a href="/" class="h-full sm:ml-2">
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
			<Button
				variant="secondary"
				on:click={() => (searchDialogOpen = true)}
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
				on:click={() => (searchDialogOpen = true)}
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
<SearchModal bind:dialogOpen={searchDialogOpen} />
