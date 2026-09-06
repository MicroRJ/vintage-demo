<script>
	let { data, form } = $props();
	let showPassword = $state(false);
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
				<div class="login-password">
					<input name="password" type={showPassword ? 'text' : 'password'} autocomplete="current-password" required />
					<button
						class="password-toggle"
						type="button"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						aria-pressed={showPassword}
						onclick={() => (showPassword = !showPassword)}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
							<circle cx="12" cy="12" r="2.75" />
							{#if showPassword}<path d="m4 4 16 16" />{/if}
						</svg>
					</button>
				</div>
			</label>

			{#if form?.message}
				<p class="admin-notice">{form.message}</p>
			{/if}

			<button class="save-button" type="submit">Open inventory desk</button>
		</form>
	</div>
</section>
