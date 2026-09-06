<script>
	import '../app.css';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>The Room Exchange — Consignment Furniture in Tampa</title>
	<meta
		name="description"
		content="A searchable, mobile-friendly inventory concept for The Room Exchange in Carrollwood, Tampa."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="concept-banner">Independent website concept · Sample inventory · Not the official website</div>
<SiteHeader />
<main>{@render children()}</main>
<SiteFooter />
