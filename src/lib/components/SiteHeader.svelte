<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';

	let menuOpen = $state(false);
	let isShopRoute = $derived(page.url.pathname === '/shop');
	let showMobileDock = $derived(
		!isShopRoute && !page.url.pathname.startsWith('/admin') && !page.url.pathname.startsWith('/login')
	);

	function closeMenu() {
		menuOpen = false;
	}

	function openMenu() {
		menuOpen = true;
	}

	onMount(() => {
		window.addEventListener('open-mobile-site-menu', openMenu);
		return () => window.removeEventListener('open-mobile-site-menu', openMenu);
	});
</script>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="The Room Exchange home">
		<img class="wordmark-logo" src="/room-exchange-logo.jpg" alt="The Room Exchange" />
	</a>

	<nav id="primary-navigation" aria-label="Primary navigation">
		<a href="/shop" onclick={closeMenu}>Inventory</a>
		<a href="/#visit" onclick={closeMenu}>Visit</a>
		<a href="/#consign" onclick={closeMenu}>Consign</a>
	</nav>

	<a class="header-contact" href="tel:+18139092411">Carrollwood · (813) 909-2411</a>
</header>

{#if menuOpen}
	<button class="mobile-site-menu-backdrop" type="button" aria-label="Close menu" onclick={closeMenu}></button>
{/if}

<aside class="mobile-site-menu" class:open={menuOpen} aria-label="Site menu" aria-hidden={!menuOpen}>
	<div class="mobile-filter-heading">
		<strong>Menu</strong>
		<button type="button" onclick={closeMenu} aria-label="Close menu"><Icon name="close" /></button>
	</div>
	<nav class="mobile-site-menu-links" aria-label="Mobile navigation">
		<a href="/" onclick={closeMenu}><span>Home</span><Icon name="arrow-up-right" /></a>
		<a href="/shop" onclick={closeMenu}><span>Inventory</span><Icon name="arrow-up-right" /></a>
		<a href="/#consign" onclick={closeMenu}><span>Consign</span><Icon name="arrow-up-right" /></a>
		<a href="/#visit" onclick={closeMenu}><span>Visit</span><Icon name="arrow-up-right" /></a>
	</nav>
</aside>

{#if showMobileDock}
	<nav class="mobile-site-dock" aria-label="Quick navigation">
		<button type="button" aria-expanded={menuOpen} onclick={openMenu}>
			<Icon name="menu" />
			<span>Menu</span>
		</button>
		<a href="/shop">
			<Icon name="grid" />
			<span>Inventory</span>
		</a>
		<a href="tel:+18139092411">
			<Icon name="phone" />
			<span>Call</span>
		</a>
		<a href="/#visit">
			<Icon name="pin" />
			<span>Visit</span>
		</a>
	</nav>
{/if}
