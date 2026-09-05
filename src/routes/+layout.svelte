<script>
	import '../app.css';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Found Again — Vintage Furniture & Objects</title>
	<meta
		name="description"
		content="A browsable, mobile-friendly inventory demo for vintage, antique, and consignment shops."
	/>
</svelte:head>

<SiteHeader />
<main>{@render children()}</main>
<SiteFooter />

