<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import { Icons } from "$lib/icons";
	import { cn } from "$lib/utils";
</script>

<nav
	class="hidden sticky bg-zinc-950 self-start top-16 sm:flex flex-col w-20 min-w-[5rem] items-center border-blue-500"
>
	<a href="/" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold"
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
				"flex flex-col justify-center items-center h-full text-xs font-semibold"
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
				"flex flex-col justify-center items-center h-full text-xs font-semibold"
			)}
		>
			<Icons.navLibrary class="h-8 w-8" />
			Library
		</div>
	</a>
	<a href="/dashboard" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold"
			)}
		>
			<Icons.navDashboard class="h-8 w-8" />
			Dashboard
		</div>
	</a>
	<a href="/profile" class="w-16 h-16">
		<div
			class={cn(
				buttonVariants({ variant: "ghost" }),
				"flex flex-col justify-center items-center h-full text-xs font-semibold"
			)}
		>
			<Icons.navProfile class="h-8 w-8" />
			Profile
		</div>
	</a>
</nav>
