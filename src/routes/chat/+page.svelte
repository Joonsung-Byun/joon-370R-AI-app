<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte'
	import TypingIndicator from '$lib/utils/typingIndicator.svelte'
	import { readableStreamStore } from '$lib/readableStreamStore.svelte'
	import { Marked } from 'marked'
	import { markedHighlight } from 'marked-highlight'
	import DOMPurify from 'dompurify'
	import ChatAppBar from '$lib/components/ChatAppBar.svelte'
	import { CircleX } from 'lucide-svelte'
	import HistoryAside from '$lib/components/HistoryAside.svelte'
	import hljs from 'highlight.js'
	import javascript from 'highlight.js/lib/languages/javascript'
	import typescript from 'highlight.js/lib/languages/typescript'
	import css from 'highlight.js/lib/languages/css'
	import TextareaForm from '$lib/components/TextareaForm.svelte'

	hljs.registerLanguage('javascript', javascript)
	hljs.registerLanguage('typescript', typescript)
	hljs.registerLanguage('css', css)

	interface PageData {
		fileNames: string[]
	}

	let { data } = $props<{ data: PageData }>()
	const marked = new Marked(
		markedHighlight({
			langPrefix: 'hljs language-',
			highlight: (code, lang) => {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext'
				return hljs.highlight(code, { language }).value
			}
		})
	)

	let systemPrompt = $state<string>(
		['Helpful Assistant', 'Sensitive Assistant', 'Dad Assistant'][0]
	)
	let examplePrompt = $state<string>('')
	let fileNames = $state<string[]>([])

	let chatHistory = $state(
		typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('chatHistory') || '[]') : []
	)

	function addFileName(fileName: string): void {
		fileNames = [...fileNames, fileName]
	}

	$effect(() => {
		if (data?.fileNames) {
			fileNames = [...data.fileNames]
		}
	})

	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
		}
	})

	const response = readableStreamStore()

	let responseText = $state('')

	$effect(() => {
		if (response.text !== '') {
			;(async () => {
				// Strip <think> tags from the response text
				//const cleanedText = stripThinkTags(response.text);
				const parsedText = await marked.parse(response.text)
				responseText = DOMPurify.sanitize(parsedText)
					.replace(/<script>/g, '&lt;script&gt;')
					.replace(/<\/script>/g, '&lt;/script&gt;')
			})()
		}
	})

	function deleteAllChats(): void {
		chatHistory = []
	}

			function deleteFileName(fileName: string) {
				fileNames = fileNames.filter((name) => name !== fileName)
				fetch('/api/chat', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fileName: fileName
					})
				})
				.then((res) => res.json())
				.then((data) => {
					console.log(data)
				})
			}

	async function handleSubmit(this: HTMLFormElement, event: Event) {
		event?.preventDefault()
		if (response.loading) return // prevent request while waiting for response

		console.log(this)
		const formData: FormData = new FormData(this)
		const message = formData.get('message')

		if (!message) {
			return
		}

		chatHistory = [...chatHistory, { role: 'user', content: message as string }]

		try {
			const answer = response.request(
				new Request('/api/chat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						chats: chatHistory,
						systemPrompt,
						fileNames
					})
				})
			)

			this.reset()

			const answerText = (await answer) as string

			const parsedAnswer = await marked.parse(answerText)
			//const cleanedAnswer = stripThinkTags(parsedAnswer);
			const purifiedText = DOMPurify.sanitize(parsedAnswer)
				.replace(/<script>/g, '&lt;script&gt;')
				.replace(/<\/script>/g, '&lt;/script&gt;')

			function removeNewlines(str:string) {
				return str.replace(/\\n/g, '')
			}

			let finalText = removeNewlines(purifiedText)

			chatHistory = [...chatHistory, { role: 'assistant', content: finalText }]
		} catch (error) {
			console.error(error)
		}
	}
</script>

<main class="flex min-h-screen w-full flex-col items-center bg-surface-950">
	<!-- The app bar for this page -->
	<ChatAppBar bind:selectedSystemPrompt={systemPrompt} />

	<div class="grid w-full xl:grid-cols-[18%_82%]">
		<HistoryAside />
		<form onsubmit={handleSubmit} class="m-4 mt-20 flex flex-col rounded-md p-2">
			<div class="">
				<div class="mb-4 flex items-start space-x-2">
					<Avatar src="/img-tutor-girl.jpg" name="Tutor girl image" />
					<div class="assistant-chat mt-2">Hello! How can I help you?</div>
				</div>
				<!-- Need to display each chat item here -->
				{#each chatHistory as chat, i}
					{#if chat.role === 'user'}
						<div class="mb-8 ml-auto flex max-w-[70vw] items-start justify-end gap-3">
							<div class="user-chat mt-2">
								{chat.content}
							</div>
							<div>
								<Avatar src="/student.png" name="User image" />
							</div>
						</div>
						<!-- this else handles the assistant role chat display -->
					{:else}
						<div class="mb-8 mr-auto flex max-w-[70vw] items-start gap-3">
							<div>
								<Avatar src="/img-tutor-girl.jpg" name="Tutor girl image" />
							</div>
							<div class="assistant-chat mt-2">
								{@html chat.content}
							</div>
						</div>
					{/if}
				{/each}

				{#if response.loading}
					{#await new Promise((res) => setTimeout(res, 400)) then _}
						<div class="flex">
							<div class="flex space-x-2">
								<Avatar name="tutor girl image" src={'/img-tutor-girl.jpg'} />
								<div class="assistant-chat max-w-[70vw]">
									{#if response.text === ''}
										<TypingIndicator />
									{:else}
										{@html (responseText)}
									{/if}
								</div>
							</div>
						</div>
					{/await}
				{/if}
				<div class="space-y-4">
					<hr class="mt-6" />
					<TextareaForm
						bind:typedExamplePrompt={examplePrompt}
						propsChatHistory={chatHistory}
						propsDeleteAllChat={deleteAllChats}
						{fileNames}
						propsAddFileName={addFileName}
					/>
				</div>
			</div>
			<div class="flex w-full flex-col items-center">
				<p class="mb-6 text-center text-sm text-surface-500">
					You can also upload a file for additional context to chat with me. I will do my best to
					help you.
				</p>
				{#if fileNames.length > 0}
					<div class="flex justify-start flex-wrap items-center gap-7">
						{#each fileNames as fileName}
							<div class="flex items-center gap-4">
								<button type="button" class="btn text-white preset-filled-primary-500 relative">
									<span>{fileName}</span>
									<CircleX onclick={() => deleteFileName(fileName)} />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</form>
	</div>
</main>

<style lang="postcss">
	.assistant-chat {
		@apply rounded-lg border border-slate-50 bg-slate-700 p-3 text-white;
	}

	.user-chat {
		@apply rounded-lg border border-surface-50 bg-surface-700 p-3 text-white;
	}

	.assistant-chat :global {
		ol {
			@apply ml-4 list-inside list-decimal;
		}
		ul {
			@apply ml-4 list-inside list-disc;
		}
		/* Code blocks */
		/* 	pre {
			@apply my-4 overflow-x-auto rounded-lg bg-surface-700 p-4;
		}
		code {
			@apply rounded bg-surface-100 px-1 py-0.5 font-mono;
		}
 */
		/* Headers */
		h1 {
			@apply mb-4 text-2xl font-bold;
		}
		h2 {
			@apply mb-3 text-xl font-bold;
		}
		h3 {
			@apply mb-2 text-lg font-bold;
		}

		/* Links */
		a {
			@apply text-primary-500 hover:underline;
		}

		/* Blockquotes */
		blockquote {
			@apply border-l-4 border-surface-500 pl-4 italic;
		}
	}
</style>
