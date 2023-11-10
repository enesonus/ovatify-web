<script lang="ts">
	import SideNav from "./SideNav.svelte";
	import TopNav from "./TopNav.svelte";
</script>

<main>
	<TopNav />
	<div class="flex">
		<SideNav />
		<!-- Page Content -->
		<div class="p-4">
			<slot />
		</div>
	</div>
</main>
