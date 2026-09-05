<script>
	let menuOpen = false;

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="Found Again home">
		<span>FOUND</span>
		<span>AGAIN</span>
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
		<a href="/shop" onclick={closeMenu}>Shop</a>
		<a href="/#visit" onclick={closeMenu}>Visit</a>
		<a href="/#consign" onclick={closeMenu}>Consign</a>
		<a href="/admin" onclick={closeMenu}>Inventory desk</a>
	</nav>

	<a class="header-contact" href="tel:+18135550194">Tampa · (813) 555-0194</a>
</header>

