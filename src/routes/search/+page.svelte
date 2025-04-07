<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'
    import type { ActionResult } from '@sveltejs/kit'
    
	//import { testData } from './test-data';

	type ImageResult = {
		id: string
		thumbnailUrl: string
		title: string
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
						...img // Include any other properties
					}))
				} else {
					results = []
				}

				console.log(`Got ${results.length} results for "${searchQuery}"`)
			}
        }
    }
</script>

<main class="mx-auto w-full  bg-gray-900 text-gray-100 min-h-screen">
	<div class="w-full bg-gray-800 p-4">
		<div class="flex items-center justify-between max-w-4xl mx-auto">
			<div class="w-24">
				<!-- Empty div for balance -->
			</div>
			
			<h1 class="text-white text-center text-3xl font-bold">
					AI Image Collection
			</h1>
			
			<div class="w-26 text-right">
				<a
					href="/images"
					class="bg-gray-700  hover:bg-gray-600 inline-block rounded-md px-4 py-2 transition">
					Image Upload
				</a>
			</div>
		</div>
	</div>
	
	
	<div class="max-w-4xl mx-auto p-4">




	<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg border border-gray-700">
		<h2 class="mb-4 text-xl font-semibold text-blue-300">Search Images</h2>
		<form method="POST" action="?/imageSearch" use:enhance={processSubmit} class="flex items-center space-x-2">
			<div class="flex-grow">
				<input
					type="text"
					name="query"
					placeholder="Search for images"
					class="w-full rounded-lg border border-gray-700 p-2 bg-gray-900 text-gray-100" />
			</div>
			<button type="submit" class="bg-blue-600 hover:bg-blue-700 rounded-lg p-2 text-white"> Search </button>
		</form>
	</div>

    <!-- Debug information -->
	<div class="mb-4 rounded bg-gray-800 p-3 text-sm border border-gray-700">
		<p>Search performed: {searchPerformed ? 'Yes' : 'No'}</p>
		<p>Query: {searchQuery || 'None'}</p>
		<p>Results count: {results.length}</p>
	</div>

	<div>
		{#each results as result, i}
			<li class="flex items-center space-x-4 mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
				<span
					class="bg-blue-900 text-blue-200 flex h-8 w-8 items-center justify-center rounded-full font-bold">
					{i + 1}
				</span>
				<div>
					<p class="text-gray-200">Title: {result.title}</p>
					<img src={result.thumbnailUrl || "/placeholder.svg"} alt={result.title} class="h-32 w-32 rounded-md mt-2 border border-gray-700" />
				</div>
			</li>
		{/each}
	</div>

	<div class="mt-8 text-center">
		<a href="/images" class="text-blue-400 hover:text-blue-300 hover:underline">Back to Image Collection</a>
	</div>

</div>
</main>