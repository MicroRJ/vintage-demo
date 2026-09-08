<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

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
		<a href="/admin" onclick={closeMenu}>Staff demo</a>
	</nav>

	<a class="header-contact" href="tel:+18139092411">Carrollwood · (813) 909-2411</a>
</header>

{#if menuOpen}
	<button class="mobile-site-menu-backdrop" type="button" aria-label="Close menu" onclick={closeMenu}></button>
{/if}

<aside class="mobile-site-menu" class:open={menuOpen} aria-label="Site menu" aria-hidden={!menuOpen}>
	<div class="mobile-filter-heading">
		<strong>Menu</strong>
		<button type="button" onclick={closeMenu} aria-label="Close menu">×</button>
	</div>
	<nav class="mobile-site-menu-links" aria-label="Mobile navigation">
		<a href="/" onclick={closeMenu}><span>Home</span><span aria-hidden="true">↗</span></a>
		<a href="/shop" onclick={closeMenu}><span>Inventory</span><span aria-hidden="true">↗</span></a>
		<a href="/#consign" onclick={closeMenu}><span>Consign</span><span aria-hidden="true">↗</span></a>
		<a href="/#visit" onclick={closeMenu}><span>Visit</span><span aria-hidden="true">↗</span></a>
		<a href="/admin" onclick={closeMenu}><span>Staff demo</span><span aria-hidden="true">↗</span></a>
	</nav>
</aside>

{#if showMobileDock}
	<nav class="mobile-site-dock" aria-label="Quick navigation">
		<button type="button" aria-expanded={menuOpen} onclick={openMenu}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
			<span>Menu</span>
		</button>
		<a href="/shop">
			<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>
			<span>Inventory</span>
		</a>
		<a href="tel:+18139092411">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 4.5 10 9 8.2 10.8a14 14 0 0 0 5 5L15 14l4.5 2.5-.8 3.2c-.2.8-1 1.3-1.8 1.2C9.8 20 4 14.2 3.1 7.1 3 6.3 3.5 5.5 4.3 5.3l3.2-.8Z" /></svg>
			<span>Call</span>
		</a>
		<a href="/#visit">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
			<span>Visit</span>
		</a>
	</nav>
{/if}
