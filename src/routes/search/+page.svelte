<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'
	import type { ActionResult } from '@sveltejs/kit'
	import MainNav from '$lib/components/MainNav.svelte'
	//import { testData } from './test-data';

	type ImageResult = {
		id: string
		thumbnailUrl: string
		title: string,
		distance: number // Ensure distance is included
	}

	const props = $props<{ data: PageData; form: ActionData }>()

	// Track search state
	let searchPerformed = $state(false)
	let searchQuery = $state('')
	let results = $state<ImageResult[]>([])

	function processSubmit() {
		return async ({ result }: { result: ActionResult }) => {
			console.log('Form submission result:', result)
			if (result.type === 'success' && result.data) {
				searchPerformed = true
				searchQuery = result.data.searchQuery || ''

				// Ensure we have an array of properly typed objects
				if (Array.isArray(result.data.images)) {
					results = result.data.images.map((img: any) => ({
						id: img.id || '',
						title: img.title || 'Untitled',
						thumbnailUrl: img.thumbnailUrl || '',
						 // Include any other properties,
						distance: img.distance || 0, // Ensure distance is included,
						...img
					}))
					console.log('Results:', results)
				} else {
					results = []
				}

				console.log(`Got ${results.length} results for "${searchQuery}"`)
			}
		}
	}
</script>

<main class="mx-auto min-h-screen w-full bg-gray-900 text-gray-100">
	<!-- Navbar -->
	 <MainNav />

	<div class="mx-auto max-w-4xl p-4">
		<div class="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold text-blue-300">Search Images</h2>
			<form
				method="POST"
				action="?/imageSearch"
				use:enhance={processSubmit}
				class="flex items-center space-x-2"
			>
				<div class="flex-grow">
					<input
						type="text"
						name="query"
						placeholder="Search for images"
						class="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-gray-100"
					/>
				</div>
				<button type="submit" class="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">
					Search
				</button>
			</form>
		</div>

		<!-- Debug information -->
		<div class="mb-4 rounded border border-gray-700 bg-gray-800 p-3 text-sm">
			<p>Search performed: {searchPerformed ? 'Yes' : 'No'}</p>
			<p>Query: {searchQuery || 'None'}</p>
			<p>Results count: {results.length}</p>
		</div>

		<div>
			{#each results as result, i}
				<li
					class="mb-4 flex items-center space-x-4 rounded-lg border border-gray-700 bg-gray-800 p-3 relative"
				>
					<span
						class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 font-bold text-blue-200"
					>
						{i + 1}
					</span>
					<div>
						<p class="text-gray-200 mr-4">Title: {result.title}</p>
						<p>Cosine Distance: {result.distance.toFixed(2)}</p>
						{#if i === 0}
							<img src="/medal1.svg" alt="1st Place" class="h-12 w-12 absolute top-2 right-2" />
						{:else if i === 1}
							<img src="/medal2.svg" alt="2nd Place" class="h-12 w-12 absolute top-2 right-2" />
						{:else if i === 2}
							<img src="/medal3.svg" alt="3rd Place" class="h-12 w-12 absolute top-2 right-2" />
						{/if}
						<img
							src={result.thumbnailUrl || '/placeholder.svg'}
							alt={result.title}
							class="mt-2 h-32 w-32 rounded-md border border-gray-700"
						/>
					</div>
				</li>
			{/each}
		</div>

		<div class="mt-8 text-center">
			<a href="/images" class="text-blue-400 hover:text-blue-300 hover:underline"
				>Back to Image Collection</a
			>
		</div>
	</div>
</main>
