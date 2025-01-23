<script>
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { json } from '@sveltejs/kit';

	let category_id = $state(null);
	let all_items= $state([]);
	let isLoading = $state(true);
	let editingItem= $state(null);

	async function fetchCategoryData() {
		try {
			const items = await fetch(`/api/categories/${category_id}`);
			if (!items.ok) throw new Error('Failed to fetch items');
			all_items= await items.json();
		} catch (error) {
			console.error(error);
		}
		isLoading = false;
	}

	async function saveItem(item) {
		try {
			const response = await fetch(`/api/categories/${item._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(item)
			});
			if (!response.ok) throw new Error('Failed to save category');
			editingItem= null;
			await fetchCategoryData();
		} catch (error) {
			console.error(error);
		}
	}

	async function deleteItem(itemId) {
		try {
			const response = await fetch(`/api/categories/${itemId}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Failed to delete category');
			all_items= all_items.filter((item) => item._id !== itemId);
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

<div class="flex justify-center bg-gray-50">
	<div class="  w-[960px]">
		<h1 class="py-6 text-2xl font-bold text-center text-gray-800 border-b border-gray-300">
			Categories
		</h1>

		{#if isLoading}
			<p class="mt-6 text-center text-gray-600">Loading...</p>
		{:else}
			<div class="grid gap-6 mt-6">
				{#each all_items as item (item._id)}
					<div class="block p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
						{#if editingItem=== item._id}
							<div>
								<label class="block text-sm font-medium text-gray-600">English Name</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.name['en']}
								/>

								<label class="block mt-2 text-sm font-medium text-gray-600">Turkish Name</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.name['tr']}
								/>


								<label class="block mt-2 text-sm font-medium text-gray-600">Turkish desc</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.desc['tr']}
								/>

								<label class="block mt-2 text-sm font-medium text-gray-600">English Description</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.desc['en']}
								/>


								<label class="block mt-2 text-sm font-medium text-gray-600">Price</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.price}
								/>
								<label class="block mt-2 text-sm font-medium text-gray-600">Image URL</label>
								<input
									type="text"
									class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
									bind:value={item.image}
								/>

								<div class="flex gap-3 mt-4">
									<button
										onclick={() => saveItem(item)}
										class="px-4 py-2 font-medium text-white bg-green-600 rounded-lg transition hover:bg-green-700"
									>
										Save
									</button>
									<button
										onclick={() => (editingItem= null)}
										class="px-4 py-2 font-medium text-white bg-gray-400 rounded-lg transition hover:bg-gray-500"
									>
										Cancel
									</button>
								</div>
							</div>
						{:else}
							<div class="text-lg font-medium text-gray-700">
								<h1 class="mb-2">Name:</h1>
								<p class="text-gray-900">En: {item.name['en']}</p>
								<p class="text-gray-900">Tr: {item.name['tr']}</p>
								<h1 class="mb-2">Desc:</h1>
								<p class="text-gray-900">En: {item.desc['en']}</p>
								<p class="text-gray-900">Tr: {item.desc['tr']}</p>
								
								<p class="text-gray-900">Price: {item.price}</p>
								<p class="text-gray-900">

									Image: <a
										href={item.image}
										target="_blank"
										class="text-blue-500 hover:underline">View Image</a
									>
								</p>
								<div>
									<img src="{item.image}" alt="">
								</div>
								<div class="flex gap-3 mt-4">
									<button
										onclick={() => (editingItem= item._id)}
										class="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
									>
										Edit
									</button>
									<button
										onclick={() => deleteItem(item._id)}
										class="px-4 py-2 font-medium text-white bg-red-600 rounded-lg transition hover:bg-red-700"
									>
										Delete
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<form
			class="p-6 mt-10 space-y-4 bg-white rounded-lg border border-gray-200 shadow-sm"
			onsubmit={async (event) => {
				event.preventDefault()
				const formData = new FormData(event.target);
				const jsonData = Object.fromEntries(formData.entries());
				console.log(jsonData)
				const response = await fetch(`/api/categories/${category_id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(jsonData)
				});
				if (!response.ok) {
					console.error('Failed to create new parent category');
				} else {
					const newItem= await response.json();
					all_items= [...all_items, newItem];
				}
			}}
		>
			<h2 class="text-xl font-semibold text-gray-800">Create New Parent Category</h2>

			<div>
				<label for="name-en" class="block text-sm font-medium text-gray-600"> English Name </label>
				<input
					type="text"
					id="name-en"
					name="en"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
					required
				/>
			</div>

			<div>
				<label for="name-tr" class="block text-sm font-medium text-gray-600"> Turkish Name </label>
				<input
					type="text"
					id="name-tr"
					name="tr"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
					required
				/>
			</div>

			<div>
				<label for="desc-en" class="block text-sm font-medium text-gray-600"> English Description</label>
				<input
					type="text"
					id="desc-en"
					name="desc_en"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div>

			<div>
				<label for="desc-tr" class="block text-sm font-medium text-gray-600"> Turkish Description</label>
				<input
					type="text"
					id="desc-tr"
					name="desc_tr"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div>

			<!-- <div>
				<label for="parent-category-id" class="block text-sm font-medium text-gray-600">
					Parent Category ID
				</label>
				<input
					type="text"
					id="parent-category-id"
					name="parent_category_id"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div> -->


			<div>
				<label for="price" class="block text-sm font-medium text-gray-600"> Price</label>
				<input
					type="text"
					id="price"
					name="price"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div>
			<div>
				<label for="image" class="block text-sm font-medium text-gray-600"> Image URL </label>
				<input
					type="text"
					id="image"
					name="image"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
				/>
			</div>

			<button
				type="submit"
				class="px-4 py-2 w-full font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
			>
				Create New Item
			</button>
		</form>
	</div>
</div>
