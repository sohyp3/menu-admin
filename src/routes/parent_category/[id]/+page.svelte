<script>
	import { createUploader } from '$lib/helpers/uploadthing.js';
	import { UploadButton, UploadDropzone } from '@uploadthing/svelte';

	let is_uploading = $state(false);
	let editingCat = $state(null);

	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			is_uploading = false;
			console.log(res[0].url);
			document.getElementById('img_field').value = res[0].url;
		},
		onUploadError: (error) => {
			alert(`ERROR! ${error.message}`);
			is_uploading = false;
		},
		onUploadBegin: () => {
			is_uploading = true;
		},
		onUploadAborted: () => {
			is_uploading = false;
		}
	});

	let { data } = $props();
</script>

<div class="bg-slate-100">
	<div class="p-6 mx-auto max-w-3xl">
		<h1 class="mb-6 text-2xl font-bold text-center">
			Categories for {data.parent_category[0].name['en']}
		</h1>

		<div class="flex flex-col gap-6 p-6 bg-teal-100 rounded-lg shadow-md">
			<div class="grid grid-cols-7 gap-4 font-semibold text-gray-700">
				<h1 class="col-span-1 text-left">Id</h1>
				<h1 class="col-span-2 text-left">Turkish Name</h1>
				<h1 class="col-span-2 text-left">English Name</h1>

				<h1 class="col-span-1 text-left">Active</h1>
				<h1 class="col-span-1 text-left">Actions</h1>
			</div>
			{#each data.categories as category}
				{#if editingCat === category.id}
					<form
						action="?/update"
						method="POST"
						class="grid grid-cols-7 items-center p-3 rounded-md border-b border-gray-300 divide-x-2 divide-black transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<input type="hidden" name="id" value={category.id} />
						<h1 class="col-span-1 px-2 text-center text-gray-800">
							{category.id}
						</h1>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-tr"
								bind:value={category.name['tr']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-en"
								bind:value={category.name['en']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>

						<div class="flex col-span-1 justify-center items-center">
							<input
								type="checkbox"
								name="active"
								bind:checked={category.active}
								class="w-4 h-4 rounded-md"
							/>
						</div>

						<div class="flex col-span-1 gap-3 px-2 text-center">
							<button class="p-1 rounded-md hover:bg-teal-100" type="submit">Save</button>
							<button
								class="p-1 rounded-md hover:bg-red-100"
								onclick={() => {
									editingCat = null;
								}}>Cancel</button
							>
						</div>
					</form>
				{:else}
					<a
						href="/category/{category.id}"
						class="grid grid-cols-7 p-3 rounded-md border-b border-gray-300 transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<span class="col-span-1 text-left text-gray-800">{category.id}</span>
						<span class="col-span-2 text-left text-gray-800">{category.name['tr']}</span>
						<span class="col-span-2 text-left text-gray-800">{category.name['en']}</span>
						<span class="text-center">{category.active ? 'active' : 'inactive'}</span>
						<button
							class="p-1 rounded-md hover:bg-teal-100"
							onclick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								editingCat = category.id;
							}}>Edit</button
						>
					</a>
				{/if}
			{/each}
		</div>
	</div>

	<div class="p-6 mx-auto mt-8 max-w-3xl rounded-lg shadow-md bg-slate-200">
		<h2 class="mb-4 text-xl font-bold text-center">Add New Category</h2>
		<form method="POST" class="flex flex-col gap-6 items-center" action="?/new">
			<div class="flex flex-col gap-2 w-full">
				<label for="name-tr" class="font-medium text-gray-700">Turkish Name</label>
				<input
					type="text"
					name="name-tr"
					id="name-tr"
					required
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>
			<div class="flex flex-col gap-2 w-full">
				<label for="name-en" class="font-medium text-gray-700">English Name</label>
				<input
					type="text"
					name="name-en"
					id="name-en"
					required
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>
			<input type="hidden" id="img_field" name="image" />

			<div><UploadButton {uploader} /></div>

			{#if is_uploading}
				<div class="text-center text-gray-700 animate-pulse">Uploading...</div>
			{:else}
				<button
					type="submit"
					class="p-3 mt-4 text-white bg-teal-500 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-teal-600"
				>
					Create
				</button>
			{/if}
		</form>
	</div>
</div>
