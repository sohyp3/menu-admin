<script>
	import { createUploader } from '$lib/helpers/uploadthing.js';
	import { UploadButton, UploadDropzone } from '@uploadthing/svelte';
	import { enhance } from '$app/forms';

	let is_uploading = $state(false);
	let editingItem = $state(null);
	let uploadedImageUrl = $state('');

	const uploader = createUploader('imageUploader', {
		onClientUploadComplete: (res) => {
			is_uploading = false;
			const uploadedUrl = res?.[0]?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.serverData?.url;
			if (uploadedUrl) {
				console.log(uploadedUrl);
				uploadedImageUrl = uploadedUrl;
			}
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
	<div class="mx-auto max-w-5xl p-6">
		<h1 class="mb-6 text-center text-2xl font-bold">
			Categories for {data.category[0].name['en']}
		</h1>
		<a href="/parent_category/{data.category[0].parent_id}" class="text-teal-600"
			>Go Back to Parent Category</a
		>

		<div class="flex flex-col gap-6 rounded-lg bg-teal-100 p-6 shadow-md">
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
						class="grid grid-cols-10 items-center divide-x-2 divide-black rounded-md border-b border-gray-300 p-3 transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<input type="hidden" name="id" value={item.id} />
						<h1 class="col-span-1 px-2 text-center text-gray-800">
							{item.id}
						</h1>
						<div class="col-span-2 flex flex-col gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-tr"
								bind:value={item.name['tr']}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
							<input
								type="text"
								name="desc-tr"
								bind:value={item.description['tr']}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>
						<div class="col-span-2 flex flex-col gap-3 px-2 text-center text-gray-800">
							<input
								type="text"
								name="name-en"
								bind:value={item.name['en']}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
							<input
								type="text"
								name="desc-en"
								bind:value={item.description['en']}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>

						<input
							type="text"
							name="price"
							bind:value={item.price}
							class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
						/>
						<!-- <h1 class="col-span-1 px-2 text-center">{item.price}</h1> -->
						<div class="col-span-2 w-full px-2">
							<input
								type="text"
								name="image"
								bind:value={item.image}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
							/>
						</div>

						<div class="col-span-1 flex items-center justify-center">
							<input
								type="checkbox"
								name="active"
								bind:checked={item.active}
								class="h-4 w-4 rounded-md"
							/>
						</div>

						<div class="col-span-1 flex gap-3 px-2 text-center">
							<button class="rounded-md p-1 hover:bg-teal-100" type="submit">Save</button>
							<button
								class="rounded-md p-1 hover:bg-red-100"
								onclick={() => {
									editingItem = null;
								}}>Cancel</button
							>
						</div>
					</form>
				{:else}
					<div
						class="grid grid-cols-10 items-center divide-x-2 divide-black rounded-md border-b border-gray-300 p-3 transition-colors hover:cursor-pointer hover:bg-teal-200"
					>
						<h1 class="col-span-1 px-2 text-center text-gray-800">
							{item.id}
						</h1>
						<div class="col-span-2 flex flex-col gap-3 px-2 text-center text-gray-800">
							<span>{item.name['tr']}</span>
							<span>{item.description['tr']}</span>
						</div>
						<div class="col-span-2 flex flex-col gap-3 px-2 text-center text-gray-800">
							<span>{item.name['en']}</span>
							<span>{item.description['en']}</span>
						</div>
						<h1 class="col-span-1 px-2 text-center">{item.price}</h1>
						<div class="col-span-2 w-full px-2">
							<img src={item.image} class="mx-auto w-24" alt="" />
						</div>
						<div class="col-span-1 flex items-center justify-center">
							{#if item.active}
								<p>active</p>
							{:else}
								<p>inactive</p>
							{/if}
						</div>
						<div class="col-span-1 flex gap-3 px-2 text-center">
							<button
								class="rounded-md p-1 hover:bg-teal-100"
								onclick={() => (editingItem = item.id)}>Edit</button
							>

							<form action="?/delete" method="POST">
								<input type="hidden" bind:value={item.id} name="id" />
								<button class="rounded-md p-1 hover:bg-red-100">Delete</button>
							</form>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="mx-auto mt-8 max-w-3xl rounded-lg bg-slate-200 p-6 shadow-md">
		<h2 class="mb-4 text-center text-xl font-bold">Add New Category</h2>
		<form method="POST" action="?/create" class="flex flex-col items-center gap-6">
			<div class="flex w-full flex-col gap-2">
				<label for="name-en" class="font-medium text-gray-700">English Name</label>
				<input
					type="text"
					name="name-en"
					id="name-en"
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>

			<div class="flex w-full flex-col gap-2">
				<label for="name-tr" class="font-medium text-gray-700">Turkish Name</label>
				<input
					type="text"
					name="name-tr"
					id="name-tr"
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>

			<div class="flex w-full flex-col gap-2">
				<label for="name-en" class="font-medium text-gray-700">English Description</label>
				<input
					type="text"
					name="desc-en"
					class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>

			<div class="flex w-full flex-col gap-2">
				<label for="name-en" class="font-medium text-gray-700">Turkish Description</label>
				<input
					type="text"
					name="desc-tr"
					class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>
			<div class="flex w-full flex-col gap-2">
				<label for="name-en" class="font-medium text-gray-700">Price</label>
				<input
					type="text"
					name="price"
					required
					value="200"
					class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
				/>
			</div>

			<input type="hidden" id="img_field" name="image" bind:value={uploadedImageUrl} />

			<div><UploadButton {uploader} /></div>

			{#if uploadedImageUrl}
				<div class="flex w-full justify-center">
					<div class="h-24 w-24 rounded-md border border-gray-300 bg-white p-2 shadow-sm">
						<img src={uploadedImageUrl} alt="Uploaded" class="h-full w-full rounded object-cover" />
					</div>
				</div>
			{/if}

			{#if is_uploading}
				<div class="animate-pulse text-center text-gray-700">Uploading...</div>
			{:else}
				<button
					type="submit"
					class="mt-4 transform rounded-lg bg-teal-500 p-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-teal-600"
				>
					Create
				</button>
			{/if}
		</form>
	</div>
</div>
