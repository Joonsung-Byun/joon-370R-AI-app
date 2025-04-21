<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'
	import { invalidateAll } from '$app/navigation'
	import Paperclip from 'lucide-svelte/icons/paperclip'
	import Image from 'lucide-svelte/icons/image'
	import MessageSquare from 'lucide-svelte/icons/message-square'
	import Search from 'lucide-svelte/icons/search'
	import DynamicIcon from '$lib/components/DynamicIcon.svelte'
	import MainNav from '$lib/components/MainNav.svelte'
	// Navigation state
	let mobileMenuOpen = $state(false);
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
	
	const routes = [
		{ name: "AI RAG Chatbot", href: "/chat", icon: MessageSquare },
		{ name: "Image Vector Embedding", href: "/images", icon: Image },
		{ name: "Image Vector Search", href: "/search", icon: Search },
		{ name: "AI Image Generation", href: "/imageGen", icon: Paperclip }
	];

	// Converting props to $props rune
	const { data, form } = $props<{ data: PageData; form: ActionData }>()

	let selectedFile: File | null = null
	let previewUrl = $state<string | null>(null)
	let loading = $state(false)

	let messageShown = $state<boolean>(false)

	// Get existing images from server data
	let images = $state(data.images || [])

	const maxSizeInBytes = 10 * 1024 * 1024 // 10MB

	// Handle file selection
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement
		if (!input.files?.length) {
			selectedFile = null
			previewUrl = null
			return
		}
		// Check if the file is too large
		selectedFile = input.files[0]
		if (selectedFile.size > maxSizeInBytes) {
			alert('File is too large. Maximum size is 5MB.')
			input.value = '' // Clear the input
			return
		}

		// Create a preview URL for the selected image
		if (selectedFile && selectedFile.type.startsWith('image/')) {
			const reader = new FileReader()
			reader.onload = (e) => {
				previewUrl = (e.target?.result as string) || null
			}
			reader.readAsDataURL(selectedFile)
		}
	}

	// Reset the form
	function resetForm() {
		selectedFile = null
		previewUrl = null
		const fileInput = document.getElementById('image-upload') as HTMLInputElement
		if (fileInput) fileInput.value = ''
		messageShown = true
		setTimeout(() => {
			messageShown = false
		}, 3000) // Hide the message after 3 seconds
	}

	// Converting reactive statement to $effect rune
	$effect(() => {
		if (images.length > 0) {
			console.log('First few images:', images.slice(0, 3))
		}
	})
</script>

<svelte:head>
	<title>Image Upload | AI Image Collection</title>
</svelte:head>

<main class="w-full bg-gray-900 text-gray-100 min-h-screen">
	<MainNav />
	
	<!-- Content Area with Page Title -->
	<div class="max-w-4xl mx-auto p-4 pt-8">
		<!-- Page header -->
		<div class="mb-8">
			<div class="flex items-center mb-2">
				<div class="w-10 h-10 bg-violet-800 rounded-lg flex items-center justify-center mr-3">
					<Image class="w-5 h-5 text-white" />
				</div>
				<h1 class="text-3xl font-bold text-white">AI Image Vector Embedding</h1>
			</div>
			<p class="text-gray-400 ml-[3.25rem]">Upload and manage your AI-processed images</p>
		</div>

		<div class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg border border-gray-700">
			<h2 class="mb-4 text-xl font-semibold text-gray-200">Upload a New Image</h2>

			<form
				method="POST"
				action="?/imageToBase64"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true
					return async ({ result,update }) => {
						console.log('Form result:', result)
						if(result.status === 200 && result.type === 'success' && result.data?.newImageObj) {
							images = [...images, result.data.newImageObj]
							resetForm()
						}
						await update()
						if (form?.success) {
							console.log(form)
							await invalidateAll() 
						}
						loading = false
					}
				}}
				class="space-y-4">
				<div>
					<label for="image-upload" class="mb-1 block text-sm font-medium text-gray-300">
						Select Image
					</label>
					<input
						type="file"
						id="image-upload"
						name="image"
						accept="image/*"
						required
						onchange={handleFileSelect}
						class="file:bg-gray-700 file:text-purple-300 hover:file:bg-gray-600 block
						   w-full text-sm text-gray-300
						   file:mr-4 file:rounded-md
						   file:border-0 file:px-4
						   file:py-2 file:text-sm
						   file:font-semibold bg-gray-900 rounded-md border border-gray-700" />
				</div>

				<div>
					<label for="title" class="mb-1 block text-sm font-medium text-gray-300">
						Image Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Enter a descriptive title"
						required
						class="focus:ring-purple-500 w-full rounded-md border border-gray-700 px-4 py-2 focus:ring-2 bg-gray-900 text-gray-100 focus:outline-none" />
				</div>

				{#if previewUrl}
					<div class="mt-4">
						<p class="mb-1 text-sm font-medium text-gray-300">Preview</p>
						<div class="rounded-md border border-gray-700 p-2 bg-gray-900">
							<img
								src={previewUrl || "/placeholder.svg"}
								alt="Preview"
								class="mx-auto max-h-60 max-w-full border-2 object-contain" />
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="bg-blue-700 hover:bg-blue-900 w-full rounded-md px-4 py-2 font-bold text-white transition duration-200 disabled:bg-gray-600">
					{loading ? 'Uploading...' : 'Upload Image'}
				</button>

				{#if form && messageShown}
					<div
						class={`mt-4 rounded-md p-3 ${form.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
						{form.message}
					</div>
				{/if}
			</form>
		</div>

		<!-- Image gallery section -->
		{#if images.length > 0}
			<h2 class="text-2xl font-bold text-white mb-4">Your Images</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each images as image}
					<div class="rounded-md border border-gray-700 p-2 transition-shadow hover:shadow-md bg-gray-800">
						{#if image.thumbnailUrl}
							{@const debugUrl = image.thumbnailUrl}
							{@const showDebug = () => console.log('Thumbnail URL:', debugUrl)}
							<img
								src={image.thumbnailUrl || "/placeholder.svg"}
								alt={image.title}
								class="h-40 w-full rounded object-cover"
								loading="lazy"
								onerror={() => console.error(`Failed to load thumbnail: ${image.thumbnailUrl}`)}
								onload={showDebug} />
						{:else}
							<div class="flex h-40 items-center justify-center rounded bg-gray-700">
								<div class="text-gray-300">[No thumbnail available]</div>
							</div>
						{/if}
						<p class="mt-2 truncate text-center font-medium text-gray-200">{image.title}</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-10 bg-gray-800/30 rounded-lg border border-gray-700/50">
				<Image class="w-12 h-12 mx-auto text-gray-600 mb-3" />
				<p class="text-gray-400">No images uploaded yet. Add your first image above!</p>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Additional styles for the navigation */
	:global(.current-page) {
		@apply text-violet-400;
	}
</style>