<script>
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Staff Login — The Room Exchange Concept</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="login-shell">
	<div class="login-panel">
		<p class="eyebrow">Staff access</p>
		<h1>Inventory desk</h1>
		<p>Enter the shared staff password to manage the public catalog.</p>

		<form method="POST">
			<input type="hidden" name="next" value={form?.next ?? data.next} />
			<label>
				<span>Password</span>
				<input name="password" type="password" autocomplete="current-password" required />
			</label>

			{#if form?.message}
				<p class="admin-notice">{form.message}</p>
			{/if}

			<button class="save-button" type="submit">Open inventory desk</button>
		</form>
	</div>
</section>
