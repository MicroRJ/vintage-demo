<script>
	let { name } = $props();
</script>

<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
	{#if name === 'menu'}
		<path d="M4 7h16M4 12h16M4 17h16" />
	{:else if name === 'search'}
		<circle cx="11" cy="11" r="6.5" />
		<path d="m16 16 4 4" />
	{:else if name === 'sort'}
		<path d="M8 4v16m0-16L4.5 7.5M8 4l3.5 3.5M16 20V4m0 16-3.5-3.5M16 20l3.5-3.5" />
	{:else if name === 'grid'}
		<rect x="4" y="4" width="6" height="6" />
		<rect x="14" y="4" width="6" height="6" />
		<rect x="4" y="14" width="6" height="6" />
		<rect x="14" y="14" width="6" height="6" />
	{:else if name === 'gallery'}
		<rect x="3.5" y="5" width="17" height="14" />
		<path d="m5.5 17 4.5-4.5 3 3 2.5-2.5 3 3M15.5 9h.01" />
	{:else if name === 'phone'}
		<path d="M7.5 4.5 10 9 8.2 10.8a14 14 0 0 0 5 5L15 14l4.5 2.5-.8 3.2c-.2.8-1 1.3-1.8 1.2C9.8 20 4 14.2 3.1 7.1 3 6.3 3.5 5.5 4.3 5.3l3.2-.8Z" />
	{:else if name === 'pin'}
		<path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
		<circle cx="12" cy="10" r="2" />
	{:else if name === 'arrow-up-right'}
		<path d="M7 17 17 7M8 7h9v9" />
	{:else if name === 'arrow-right'}
		<path d="M5 12h14m-6-6 6 6-6 6" />
	{:else if name === 'arrow-left'}
		<path d="M19 12H5m6-6-6 6 6 6" />
	{:else if name === 'close'}
		<path d="m6 6 12 12M18 6 6 18" />
	{:else if name === 'check'}
		<path d="m5 12.5 4.2 4.2L19 7" />
	{:else if name === 'upload'}
		<path d="M12 20V5m-5 5 5-5 5 5" />
	{/if}
</svg>
