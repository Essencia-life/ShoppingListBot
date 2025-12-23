<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import { dialogOpen } from '$lib/actions/dialogOpen';
	import CategoryDialog from '$lib/components/CategoryDialog.svelte';
	import { createCategory, updateCategory } from './category.remote';
	import { getList } from '../list.remote';
	import type { CategoryCommand } from '$lib/server/list.service';
	import { getContext } from 'svelte';

	let categoryDialog: CategoryDialog;

	const loader = getContext<{ show: () => void; hide: () => void }>('loader');

	async function saveNewCategory(category: CategoryCommand) {
		loader.show();
		await createCategory(category); // TODO: handle error response for already exists
		await getList().refresh();
		categoryDialog.close();
		loader.hide();
	}

	async function saveUpdatedCategory(category: CategoryCommand) {
		loader.show();
		await updateCategory(category);
		await getList().refresh();
		categoryDialog.close();
		loader.hide();
	}
</script>

<dialog use:dialogOpen class="settings" onclose={() => history.back()}>
	<section>
		<header>Categories</header>
		<ul>
			{#each await getList() as category}
				<li>
					<button class="link" onclick={() => categoryDialog.open()}>
						<div class="emoji">{category.emoji}</div>
						{category.label}
					</button>
				</li>
			{/each}
			<li>
				<button class="link" onclick={() => categoryDialog.open()}>
					<Plus />
					Add Category
				</button>
			</li>
		</ul>
	</section>
</dialog>

<CategoryDialog
	bind:this={categoryDialog}
	oncreate={saveNewCategory}
	onupdate={saveUpdatedCategory}
/>

<style>
	button.link {
		appearance: none;
		display: flex;
		height: 40px;
		width: 100%;
		align-items: center;
		gap: 8px;
		border: 0;
		padding: 0;
		font: inherit;
		text-align: left;
	}

	button .emoji {
		font-size: 24px;
	}
</style>
