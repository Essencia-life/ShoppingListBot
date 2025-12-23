import type { Action } from 'svelte/action';

// TODO: convert to attachment
export const dialogOpen: Action<HTMLDialogElement> = (dialog) => {
	dialog.showModal();

	dialog.addEventListener('click', (event) => {
		const rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			dialog.close();
		}
	});
};
