<script>
	let username = '';
	let password = '';
	let mode = 'login'; // Switch between login/signup
	let errorMessage = '';

	async function authenticate() {
		const endpoint = mode === 'login' ? 'login' : 'signup';
		const res = await fetch(`/api/auth/${endpoint}`, {
			method: 'POST',
			body: JSON.stringify({ username, password }),
			headers: { 'Content-Type': 'application/json' }
		});

		const data = await res.json();

		if (res.ok) {
			document.cookie = `session=${data.token}; path=/; HttpOnly`;
			window.location.href = '/';
		} else {
			errorMessage = data.error || 'Something went wrong';
		}
	}
</script>

<div class="flex flex-col gap-4 justify-center items-center h-screen bg-slate-300">
	<h2 class="p-3 text-3xl rounded-md">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>

	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}

	<div class="flex flex-col gap-3 items-center max-w-xl">
		<input
			type="text"
			class="p-3 w-full rounded-md"
			bind:value={username}
			placeholder="Username"
			required
		/>
		<div class="relative">
			<input
    id="password"
				type="password"
				class="p-3 w-full rounded-md"
				bind:value={password}
				placeholder="Password"
				required
			/>

			<span
				on:click={() => {
					const input = document.getElementById('password');
					input.type = input.type === 'password' ? 'text' : 'password';
				}}
				class="absolute right-3 top-1/2 transform -translate-y-1/2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
					<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
					<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
				</svg>
			</span>
		</div>

		<button
			class="p-3 mt-4 font-bold text-white bg-emerald-500 rounded-md duration-300 ease-in-out hover:bg-emerald-300 hover:text-black"
			on:click={authenticate}>{mode === 'login' ? 'Log In' : 'Sign Up'}</button
		>
	</div>

	<p class="hidden">
		{mode === 'login' ? 'New user?' : 'Already have an account?'}
		<a href="#" on:click={() => (mode = mode === 'login' ? 'signup' : 'login')}>
			{mode === 'login' ? 'Sign Up' : 'Log In'}
		</a>
	</p>
</div>
