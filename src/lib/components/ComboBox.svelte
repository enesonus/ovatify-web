<script lang="ts">
	import { Check, ChevronsUpDown } from "lucide-svelte";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { tick } from "svelte";

	export let items: Record<"value" | "label", string>[];
	export let placeholder: string;
	export let selectedValue: string;

	let open = false;
	let value = "";

	$: selectedValue = items.find((f) => f.value === value)?.label ?? placeholder;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0 overflow-y-auto">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.Empty>No item found</Command.Empty>
			<Command.Group>
				<Command.List class="max-h-[16rem]">
					{#each items as item}
						<Command.Item
							value={item.value}
							onSelect={(currentValue) => {
								value = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							<Check
								class={cn("mr-2 h-4 w-4", value !== item.value && "text-transparent")}
							/>
							{item.label}
						</Command.Item>
					{/each}
				</Command.List>
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
