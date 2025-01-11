<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let fetchedParentCategories = $state([]);
	let fetchedChildCategories = $state([]);
	let mappedCategoriesWithChildren = $state([]);
	let isLoading = $state(true);

	async function fetchCategoryData() {
		try {
			// Fetch parent categories
			const parentCategoriesResponse = await fetch(`/api/parent_categories`);
			if (!parentCategoriesResponse.ok) throw new Error('Failed to fetch parent categories');
			fetchedParentCategories = await parentCategoriesResponse.json();
			console.log(fetchedParentCategories);

			// Fetch child categories

			isLoading = false;
		} catch (error) {
			console.error(error);
		}
	}

	

	onMount(fetchCategoryData);

async function sigma() {
	try {
		const response = await fetch('/api/dummy');
		if (!response.ok) throw new Error('Failed to add dummy data');
		const result = await response.json();
		console.log(result.message);
	} catch (error) {
		console.error(error);
	}
}

</script>

<div class="p-3">
	<h1 class="py-3 text-xl text-center border-b border-black">Parent Categories:</h1>
<button on:click={sigma}>Add Dummy Data</button>



	{#if isLoading}
		<p class="text-center">Loading...</p>
	{:else}
		<div class="flex flex-col gap-10">
			{#each fetchedParentCategories as parentCategory}
				<a href="/parent_categories/{parentCategory._id}" class="py-3 border-b border-black" id="{parentCategory._id}">
					<div class="text-xl">
					<span>En: {parentCategory.name['en']}</span>
					<span>Tr: {parentCategory.name['tr']}</span>
					</div>

					
				</a>
			{/each}
		</div>
	{/if}

	
</div>
