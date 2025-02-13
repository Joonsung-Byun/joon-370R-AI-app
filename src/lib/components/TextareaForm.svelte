<script lang="ts">
	let examplePrompt = ['Helpful Assistant', 'Sensitive Assistant', 'Dad Assistant'];
	let { typedExamplePrompt = $bindable(examplePrompt), propsChatHistory, propsDeleteAllChat } = $props<{ typedExamplePrompt?: string, propsChatHistory?:string[], propsDeleteAllChat?:any }>();


	// function deleteAllChats() {
	// 	chatHistory = [];
	// }
</script>

<div class="mx-auto max-w-[1000px] p-4">
	<div class="relative">
		<textarea
            bind:value={typedExamplePrompt}
			class="min-h-[60px] w-full resize-none rounded-xl border-gray-300 bg-transparent p-3 pr-32 text-white focus:border-gray-400 focus:ring-gray-400"
			rows="2"
            name="message"
		></textarea>
		<div class="absolute bottom-2 right-2 flex items-center gap-2 p-1">
			<!-- File Upload Button -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-full  p-2 hover:bg-gray-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
				<span class="sr-only">Upload file</span>
			</button>

			<!-- Send Button -->
			<button type="submit" class="flex h-8 w-8 items-center justify-center text-white hover:rounded-full hover:bg-gray-700 hover:text-white">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="22" y1="2" x2="11" y2="13" />
					<polygon points="22 2 15 22 11 13 2 9 22 2" />
				</svg>
				<span class="sr-only">Send message</span>
			</button>
		</div>
	</div>

	<div class="mt-2 flex items-center justify-end text-sm">
		<!-- Clear Chat Button -->
		<button
			class="flex items-center rounded border-error-800 px-3 py-1 border-[1px] text-white hover:bg-error-800 hover:text-white"
            onclick={propsDeleteAllChat}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-1"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
			Clear Chat
		</button>
	</div>
</div>
