<script lang="ts">
	import { preloadCode } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		preloadCode('/settings');
	});
</script>
