<script lang="ts">
	import { page } from "$app/stores";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Icons } from "$lib/icons";
	import { cn } from "$lib/utils";
</script>

<nav
	class="hidden z-20 sticky bg-zinc-950 self-start top-16 sm:flex flex-col w-20 min-w-[5rem] items-center border-blue-500"
>
	<a href="/" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname === "/"
				}
			)}
		>
			<Icons.navHome class="h-8 w-8" />
			Home
		</div>
	</a>
	<a href="/explore" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname === "/explore"
				}
			)}
		>
			<Icons.navExplore class="h-8 w-8" />
			Explore
		</div>
	</a>
	<a href="/library" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname === "/library"
				}
			)}
		>
			<Icons.navLibrary class="h-8 w-8" />
			Library
		</div>
	</a>
	<a href="/stats" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname === "/stats"
				}
			)}
		>
			<Icons.navStats class="h-8 w-8" />
			Stats
		</div>
	</a>
	<a href="/friend-groups" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname.includes("/friend-groups")
				}
			)}
		>
			<Icons.navGroups class="h-8 w-8" />
			Groups
		</div>
	</a>
	<a href="/profile" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold",
				{
					"bg-zinc-800 hover:bg-zinc-800": $page.url.pathname === "/profile"
				}
			)}
		>
			<Icons.navProfile class="h-8 w-8" />
			Profile
		</div>
	</a>
</nav>
