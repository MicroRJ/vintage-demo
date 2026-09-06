<script>
	let menuOpen = false;

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="The Room Exchange home">
		<img class="wordmark-logo" src="/room-exchange-logo.jpg" alt="The Room Exchange" />
	</a>

	<button
		class="menu-button"
		type="button"
		aria-expanded={menuOpen}
		aria-controls="primary-navigation"
		onclick={() => (menuOpen = !menuOpen)}
	>
		{menuOpen ? 'Close' : 'Menu'}
	</button>

	<nav id="primary-navigation" class:open={menuOpen} aria-label="Primary navigation">
		<a href="/shop" onclick={closeMenu}>Inventory</a>
		<a href="/#visit" onclick={closeMenu}>Visit</a>
		<a href="/#consign" onclick={closeMenu}>Consign</a>
		<a href="/admin" onclick={closeMenu}>Staff demo</a>
	</nav>

	<a class="header-contact" href="tel:+18139092411">Carrollwood · (813) 909-2411</a>
</header>
