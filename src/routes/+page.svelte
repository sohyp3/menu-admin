<script>
	import { createUploader } from '$lib/helpers/uploadthing.js';
	import { UploadButton, UploadDropzone } from '@uploadthing/svelte';

	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			console.log(`onClientUploadComplete`, res);
			alert('Upload Completed');
		},
		onUploadError: (error) => {
			alert(`ERROR! ${error.message}`);
		}
	});

	let { data } = $props();
</script>

<div class="bg-slate-100">
	<div class="p-6 mx-auto max-w-3xl">
		<h1 class="mb-6 text-2xl font-bold text-center">All Parent Categories</h1>

		<div class="flex flex-col gap-6 p-6 bg-teal-100 rounded-lg shadow-md">
			<div class="grid grid-cols-5 gap-4 font-semibold text-gray-700">
				<h1 class="col-span-1 text-left">Id</h1>
				<h1 class="col-span-2 text-left">Turkish Name</h1>
				<h1 class="col-span-2 text-left">English Name</h1>
			</div>
			{#each data.categories as category}
				<div
					class="grid grid-cols-5 p-3 rounded-md border-b border-gray-300 transition-colors hover:cursor-pointer hover:bg-teal-200"
				>
					<a href="/parent_category/{category.id}" class="col-span-1 text-left text-gray-800">{category.id}</a>
					<a href="/parent_category/{category.id}" class="col-span-2 text-left text-gray-800">{category.name['tr']}</a>
					<a href="/parent_category/{category.id}" class="col-span-2 text-left text-gray-800">{category.name['en']}</a>
				</div>
			{/each}
		</div>
	</div>

	<div class="p-6 mx-auto mt-8 max-w-3xl rounded-lg shadow-md bg-slate-200">
		<h2 class="mb-4 text-xl font-bold text-center">Add New Category</h2>
		<form method="POST" class="flex flex-col gap-6 items-center">
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

			<button
				type="submit"
				class="p-3 mt-4 text-white bg-teal-500 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-teal-600"
			>
				Create
			</button>
		</form>

		<!-- <div><UploadButton {uploader} /></div> -->
	</div>
</div>
