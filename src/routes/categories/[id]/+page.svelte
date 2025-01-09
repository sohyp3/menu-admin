<script>
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	let category_id = $state(null);
	let all_items= $state([]);
	let isLoading = $state(true);
	let editingCategory = $state(null);

	async function fetchCategoryData() {
		try {
			const subCategories = await fetch(`/api/categories/${category_id}`);
			if (!subCategories.ok) throw new Error('Failed to fetch parent categories');
			all_sub_categories = await subCategories.json();
		} catch (error) {
			console.error(error);
		}
		isLoading = false;
	}

	async function saveCategory(category) {
		try {
			const response = await fetch(`/api/parent_categories/${category._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(category),
			});
			if (!response.ok) throw new Error('Failed to save category');
			editingCategory = null;
			await fetchCategoryData();
		} catch (error) {
			console.error(error);
		}
	}

	let unsubscribe;
	onMount(() => {
		unsubscribe = page.subscribe((p) => {
			category_id = p.params.id;
			fetchCategoryData();
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<div class="p-6 min-h-screen bg-gray-50">
	<h1 class="py-6 text-2xl font-bold text-center text-gray-800 border-b border-gray-300">
		Parent Categories
	</h1>

	{#if isLoading}
		<p class="mt-6 text-center text-gray-600">Loading...</p>
	{:else}
		<div class="grid gap-6 mt-6">
			{#each all_sub_categories as category (category._id)}
				<div class="block p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
					{#if editingCategory === category._id}
						<div>
							<label class="block text-sm font-medium text-gray-600">English Name</label>
							<input
								type="text"
								class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
								bind:value={category.name['en']}
							/>

							<label class="block mt-2 text-sm font-medium text-gray-600">Turkish Name</label>
							<input
								type="text"
								class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
								bind:value={category.name['tr']}
							/>

							<div class="flex gap-3 mt-4">
								<button
									on:click={() => saveCategory(category)}
									class="px-4 py-2 font-medium text-white bg-green-600 rounded-lg transition hover:bg-green-700"
								>
									Save
								</button>
								<button
									on:click={() => (editingCategory = null)}
									class="px-4 py-2 font-medium text-white bg-gray-400 rounded-lg transition hover:bg-gray-500"
								>
									Cancel
								</button>
							</div>
						</div>
					{:else}
						<div class="text-lg font-medium text-gray-700">
							<h1 class="mb-2">Name:</h1>
							<p class="text-gray-900">En: {category.name['en']}</p>
							<p class="text-gray-900">Tr: {category.name['tr']}</p>
							<button
								on:click={() => (editingCategory = category._id)}
								class="px-4 py-2 mt-4 font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
							>
								Edit
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<form
		class="p-6 mt-10 space-y-4 bg-white rounded-lg border border-gray-200 shadow-sm"
		on:submit|preventDefault={async (event) => {
			const formData = new FormData(event.target);
			const jsonData = Object.fromEntries(formData.entries());
			const response = await fetch(`/api/parent_categories/${parent_category_id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(jsonData),
			});
			if (!response.ok) {
				console.error('Failed to create new parent category');
			} else {
				const newCategory = await response.json();
				all_sub_categories = [...all_sub_categories, newCategory];
			}
		}}
	>
		<h2 class="text-xl font-semibold text-gray-800">Create New Parent Category</h2>

		<div>
			<label for="name-en" class="block text-sm font-medium text-gray-600">
				English Name
			</label>
			<input
				type="text"
				id="name-en"
				name="en"
				class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
				required
			/>
		</div>

		<div>
			<label for="name-tr" class="block text-sm font-medium text-gray-600">
				Turkish Name
			</label>
			<input
				type="text"
				id="name-tr"
				name="tr"
				class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
				required
			/>
		</div>

		<div>
			<label for="parent-category-id" class="block text-sm font-medium text-gray-600">
				Parent Category ID
			</label>
			<input
				type="text"
				id="parent-category-id"
				name="parent_category_id"
				class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
			/>
		</div>

		<div>
			<label for="image" class="block text-sm font-medium text-gray-600">
				Image URL
			</label>
			<input
				type="text"
				id="image"
				name="image"
				class="p-2 w-full rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
			/>
		</div>

		<button
			type="submit"
			class="px-4 py-2 w-full font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
		>
			Create New Parent Category
		</button>
	</form>
</div>
