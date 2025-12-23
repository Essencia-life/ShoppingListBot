<script lang="ts">
	import EmojiRegex from 'emoji-regex-xs';
	import { dialogOpen } from '$lib/actions/dialogOpen';
	import type { CategoryCommand } from '$lib/server/list.service';
	import type { Categroy } from '$lib/schema';

	interface Props {
		category?: Categroy;
		oncreate: (category: CategoryCommand) => void;
		onupdate: (category: CategoryCommand) => void;
	}

	const emojiRegex = EmojiRegex();
	const { category, oncreate, onupdate }: Props = $props();

	let categoryDialog: HTMLDialogElement;

	let disabled = $state(false);

	let listEmoji = $state('');
	let listLabel = $state('');
	let listName = $derived(
		listLabel
			.trim()
			.normalize('NFD')
			.toLowerCase()
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/ß/g, 'ss')
			.replace(/[^a-z]+/g, '-')
	);

	export function open() {
		disabled = false;
		listEmoji = category?.emoji ?? '';
		listLabel = category?.label ?? '';
		listName = category?.id ?? '';

		dialogOpen(categoryDialog);
	}

	export function close() {
		categoryDialog.close();
	}

	function saveCategory(event: MouseEvent) {
		event.preventDefault();

		disabled = true;

		const inputCategory = {
			id: listName,
			label: listLabel,
			emoji: listEmoji
		};

		if (category) {
			onupdate(inputCategory);
		} else {
			oncreate(inputCategory);
		}
	}
</script>

<dialog bind:this={categoryDialog}>
	<form>
		<!-- <button type="button" name="emoji" popovertarget="emoji-popover" id="emoji-button"></button> -->
		<label>
			<small>Emoji</small>
			<input
				name="emoji"
				placeholder="⬜️"
				maxlength="2"
				pattern={emojiRegex.source}
				style="width: calc(2em + 16px); text-align: center"
				bind:value={listEmoji}
			/>
		</label>
		<label>
			<small>Label</small>
			<input name="label" placeholder="Name" bind:value={listLabel} />
		</label>
		<input name="name" type="hidden" bind:value={listName} />
	</form>

	<button type="button" class="button" onclick={saveCategory} {disabled}>Save Category</button>
</dialog>

<!-- <div popover anchor="emoji-button" id="emoji-popover">Select emoji</div> -->

<style>
	label {
		display: inline-flex;
		flex-direction: column;
		gap: 4px;
	}

	input {
		font: inherit;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid rgba(0 0 0 / 50%);
	}

	/* 
	#emoji-popover:popover-open {
		inset: auto;
		bottom: calc(anchor(top) + 8px);
		left: anchor(left);
		display: flex;
		flex-direction: column;
		max-width: calc(100vw - anchor(left) - 16px);
		margin: 0;
		background: var(--app-secondary-bg-color);
		border: 1px solid rgba(0 0 0 / 15%);
		border-radius: 8px;
		box-shadow: 0 0 16px rgba(0 0 0 / 50%);
	}

	#emoji-popover::backdrop {
		background-color: rgba(0 0 0 / 20%);
	} */
</style>
