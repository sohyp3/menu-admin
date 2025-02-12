<script>
	import { createUploader } from '$lib/helpers/uploadthing.js';
	import { UploadButton, UploadDropzone } from '@uploadthing/svelte';
	import { enhance } from '$app/forms';

	let is_uploading = $state(false);
	let editingItem = $state(null);

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
	console.log(data.category[0]);
</script>

<div class="bg-slate-100">
	<div class="p-6 mx-auto max-w-5xl">
		<h1 class="mb-6 text-2xl font-bold text-center">
			Categories for {data.category[0].name['en']}

		</h1>
		<a href="/parent_category/{data.category[0].parent_id}" class="text-teal-600">Go Back to Parent Category</a>

		<div class="flex flex-col gap-6 p-6 bg-teal-100 rounded-lg shadow-md">
			<div class="grid grid-cols-10 gap-4 font-semibold text-gray-700">
				<h1 class="col-span-1 pl-2 text-center">Id</h1>
				<h1 class="col-span-2 text-center">Turkish</h1>
				<h1 class="col-span-2 text-center">English</h1>
				<h1 class="col-span-1 text-center">Price</h1>
				<h1 class="col-span-2 text-center">image</h1>
				<h1 class="col-span-1 text-center">active</h1>
				<h1 class="col-span-1 pr-2 text-center">Action</h1>
			</div>
			{#each data.items as item}
				{#if editingItem === item.id}
					<form 
						action="?/update"
						method="POST"
						class="grid grid-cols-10 items-center p-3 rounded-md border-b border-gray-300 divide-x-2 divide-black transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<input type="hidden" name="id" value={item.id} />
						<h1 class="col-span-1 px-2 text-center text-gray-800">
							{item.id}
						</h1>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-tr"
								bind:value={item.name['tr']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
							<input
								type="text"
								name="desc-tr"
								bind:value={item.description['tr']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-en"
								bind:value={item.name['en']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
							<input
								type="text"
								name="desc-en"
								bind:value={item.description['en']}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>

						<input
							type="text"
							name="price"
							bind:value={item.price}
							class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
						/>
						<!-- <h1 class="col-span-1 px-2 text-center">{item.price}</h1> -->
						<div class="col-span-2 px-2 w-full">
							<input
								type="text"
								name="image"
								bind:value={item.image}
								class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>

						<div class="flex col-span-1 justify-center items-center">
							<input
								type="checkbox"
								name="active"
								bind:checked={item.active}
								class="w-4 h-4 rounded-md"
							/>
							
						</div>

						<div class="flex col-span-1 gap-3 px-2 text-center">
							<button class="p-1 rounded-md hover:bg-teal-100" type="submit">Save</button>
							<button
								class="p-1 rounded-md hover:bg-red-100"
								onclick={() => {
									editingItem = null;
								}}>Cancel</button
							>
						</div>
					</form>
				{:else}
					<div
						class="grid grid-cols-10 items-center p-3 rounded-md border-b border-gray-300 divide-x-2 divide-black transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<h1 class="col-span-1 px-2 text-center text-gray-800">
							{item.id}
						</h1>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<span>{item.name['tr']}</span>
							<span>{item.description['tr']}</span>
						</div>
						<div class="flex flex-col col-span-2 gap-3 px-2 text-center text-gray-800">
							<span>{item.name['en']}</span>
							<span>{item.description['en']}</span>
						</div>
						<h1 class="col-span-1 px-2 text-center">{item.price}</h1>
						<div class="col-span-2 px-2 w-full">
							<img src={item.image} class="mx-auto w-24" alt="" />
						</div>
						<div class="flex col-span-1 justify-center items-center">
							{#if item.active}
							<p>active</p>
							{:else}
							<p>inactive</p>
							{/if}
						</div>
						<div class="flex col-span-1 gap-3 px-2 text-center">
							<button
								class="p-1 rounded-md hover:bg-teal-100"
								onclick={() => (editingItem = item.id)}>Edit</button
							>

							<form action="?/delete" method="POST">
								<input type="hidden" bind:value={item.id} name="id">
								<button class="p-1 rounded-md hover:bg-red-100">Delete</button>
							</form>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="p-6 mx-auto mt-8 max-w-3xl rounded-lg shadow-md bg-slate-200">
		<h2 class="mb-4 text-xl font-bold text-center">Add New Category</h2>
		<form method="POST" action="?/create" class="flex flex-col gap-6 items-center">
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
				<label for="name-en" class="font-medium text-gray-700">English Description</label>
				<input
					type="text"
					name="desc-en"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>


			<div class="flex flex-col gap-2 w-full">
				<label for="name-en" class="font-medium text-gray-700">Turkish Description</label>
				<input
					type="text"
					name="desc-tr"
					class="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>
			<div class="flex flex-col gap-2 w-full">
				<label for="name-en" class="font-medium text-gray-700">Price</label>
				<input
					type="text"
					name="price"
					required
					value="200"
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
