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
	import Paperclip from 'lucide-svelte/icons/paperclip'
	import Image from 'lucide-svelte/icons/image'
	import MessageSquare from 'lucide-svelte/icons/message-square'
	import Search from 'lucide-svelte/icons/search'
	import DynamicIcon from '$lib/components/DynamicIcon.svelte'
	import Brain from 'lucide-svelte/icons/brain'
	import MainNav from '$lib/components/MainNav.svelte'

	hljs.registerLanguage('javascript', javascript)
	hljs.registerLanguage('typescript', typescript)
	hljs.registerLanguage('css', css)

	let mobileMenuOpen = $state(false)
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen
	}
	
	const routes = [
		{ name: "AI RAG Chatbot", href: "/chat", icon: MessageSquare },
		{ name: "Image Vector Embedding", href: "/images", icon: Image },
		{ name: "Image Vector Search", href: "/search", icon: Search },
		{ name: "AI Image Generation", href: "/imageGen", icon: Paperclip }
	]

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
				fileName: fileName,
				role: 'deleteOne'
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
			const purifiedText = DOMPurify.sanitize(parsedAnswer)
				.replace(/<script>/g, '&lt;script&gt;')
				.replace(/<\/script>/g, '&lt;/script&gt;')

			function removeNewlines(str: string) {
				return str.replace(/\\n/g, '')
			}

			let finalText = removeNewlines(purifiedText)

			chatHistory = [...chatHistory, { role: 'assistant', content: finalText }]
		} catch (error) {
			console.error(error)
		}
	}
</script>

<main class="min-h-screen w-full flex flex-col items-center transition-all duration-500 bg-surface-950">
	<!-- Navigation Bar -->
	 <MainNav />

    <!-- Redesigned Chat Controls -->
    <div class="w-full max-w-4xl mx-auto px-4 mb-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-5 bg-gray-800/50 rounded-lg border border-gray-700">
            <div class="flex items-center gap-3">
                <Brain class="w-5 h-5 text-violet-400" />
                <h2 class="text-lg font-medium text-white">AI Assistant Personality</h2>
            </div>
            <div class="w-full sm:w-auto">
                <select 
                    bind:value={systemPrompt}
                    class="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                >
                    <option value="Helpful Assistant">Helpful Assistant</option>
                    <option value="Sensitive Assistant">Sensitive Assistant</option>
                    <option value="Dad Assistant">Dad Assistant</option>
                </select>
            </div>
        </div>
    </div>

    <div class="w-full">
        <form onsubmit={handleSubmit} class="m-4 mt-4 flex flex-col rounded-md p-2 px-[50px]">
            <div class="">
                <div class="mb-4 flex items-start space-x-2">
                    <Avatar src="/img-tutor-girl.jpg" name="Tutor girl image" />
                    <div class="assistant-chat mt-2">
                        Hello! How can I help you?
                    </div>
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
                                        {@html responseText}
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/await}
                {/if}
                <div class="space-y-4">
                    <hr class="mt-6 border-gray-700" />
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
                    <div class="flex flex-wrap items-center justify-start gap-7">
                        {#each fileNames as fileName}
                            <div class="flex items-center gap-4">
                                <button type="button" class="btn relative preset-filled-primary-500 text-white">
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
		@apply rounded-lg border border-slate-50 bg-slate-700 p-3 text-white transition-all duration-300;
	}

	.user-chat {
		@apply rounded-lg border border-surface-50 bg-surface-700 p-3 text-white transition-all duration-300;
	}

	.assistant-chat :global {
		ol {
			@apply ml-4 list-inside list-decimal;
		}
		ul {
			@apply ml-4 list-inside list-disc;
		}

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
