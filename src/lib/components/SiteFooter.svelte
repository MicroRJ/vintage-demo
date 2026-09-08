<script>
	import { page } from '$app/state';

	let isAdmin = $derived(Boolean(page.data.isAdmin));
</script>

<footer class="site-footer">
	<div>
		<a class="footer-mark" href="/">The Room Exchange</a>
		<p>Consignment furniture, home décor, model-home pieces, and retail close-outs.</p>
	</div>
	<div class="footer-links">
		<a href="/shop">Browse inventory</a>
		<a href="/#visit">Visit the shop</a>
		<a href="mailto:theroomexchange@gmail.com">Email the store</a>
		<a href="https://www.facebook.com/theroomexchange" target="_blank" rel="noreferrer">Facebook</a>
		{#if isAdmin}
			<form method="POST" action="/logout">
				<button class="footer-logout" type="submit">Log out</button>
			</form>
		{:else}
			<a href="/login?next=/shop">Admin login</a>
		{/if}
	</div>
	<div class="footer-small">
		<p>Independent concept using sample inventory. Not affiliated with The Room Exchange.</p>
		<p>Concept by <a href="https://dayanrodriguez.com">Dayan Rodriguez</a>.</p>
	</div>
</footer>
