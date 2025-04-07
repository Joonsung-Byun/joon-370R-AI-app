import OpenAI from 'openai'
import type { MessageBody } from '$lib/types/MessageBody'
import weaviate, { type WeaviateClient } from 'weaviate-client'
import type { ChunkObject } from '$lib/types/ChunkObject'


const openai = new OpenAI({
	baseURL: 'http://localhost:11434/v1',
	apiKey: 'ollama' // required but unused
})

const helpfulAssistant = `You are a helpful assistant. Do not assume the student has any prior knowledge. Be friendly! You may use emojis.`

const sensitiveAssistant = `You are a sensitive assistant. Be sensitive to the student's feelings and provide emotional support. If students ask same questions multiple times, be angry and sensitive. You may use some bad emojis.`

const dadAssistant = `You are a dad of students. Treat them like your kids. Be patient and kind. Call them kiddo. You are in the software development industry. Give them examples from your experience like real-world scenarios.`

const SYSTEM_PROMPTS = {
	'Helpful Assistant': helpfulAssistant,
	'Sensitive Assistant': sensitiveAssistant,
	'Dad Assistant': dadAssistant
} as const

type SystemPromptKey = keyof typeof SYSTEM_PROMPTS

let client: WeaviateClient
client = await weaviate.connectToLocal()

export const POST = async ({ request }: any) => {
	try {
		const body: MessageBody = await request.json()

		const { chats, systemPrompt, fileNames } = body

		if (!chats || !Array.isArray(chats)) {
			return new Response('Invalid chat history', { status: 400 })
		}

		// conditionally check for fileNames exising or not
		if (fileNames && Array.isArray(fileNames) && fileNames.length > 0) {
			console.log('RAG starts')
			const chunksCollection = client.collections.get<ChunkObject>('Chunks')
			const generatePrompt = `You are a knowledgeable assistant analyzing document content.
			instructions: 
			-Use the provided text to answer questions accurately
			-If specific data points are mentioned, ensure they match exactly
			-Quote relevant passages when appropriate
			-If information isn't in the documents, say so
			-Maintain conversation context
			-When you give an answer, do not put quotation marks in the beginning and end of the answer
			Current question: "${chats[chats.length - 1].content}"
			Previous context: "${chats
					.slice(-2, -1)
					.map((chat) => chat.content)
					.join(' ')}"
			`
			// get the most recent user message as the primary query
			const currentQuery = chats[chats.length - 1].content
			console.log(currentQuery, "currentQuery")
			try {
				const result = await chunksCollection.generate.nearText(
					currentQuery,
					{ groupedTask: generatePrompt },
					{ limit: 2 },
				)

				for (let object of result.objects) {
					console.log(JSON.stringify(object.properties, null, 2));
					console.log(object.generated); // print singlePrompt result
				  }

				if (!result.generated) {
					return new Response('I could not find specific information matching your query. Could you rephrase or be more specific? ', { status: 200 })
				}

				return new Response(JSON.stringify(result.generated), { status: 200 })



			} catch (error) {
				console.log(error)
				return new Response('Something went wrong', { status: 500 })
			}
		} else {
			console.log('text 2 text starts')
			const selectedPrompt = SYSTEM_PROMPTS[systemPrompt as SystemPromptKey]

			const stream = await openai.chat.completions.create({
				model: 'llama3.2',
				messages: [{ role: 'system', content: selectedPrompt }, ...body.chats],
				stream: true
			})

			// Create a new ReadableStream for the response
			const readableStream = new ReadableStream({
				async start(controller) {
					for await (const chunk of stream) {
						const text = chunk.choices[0]?.delta?.content || ''
						controller.enqueue(text)
					}
					controller.close()
				}
			})

			//console.log(completion.choices[0].message.content)

			/*   return new Response(JSON.stringify({ message: completion.choices[0].message.content })) */

			return new Response(readableStream, {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		}
	} catch (error) {
		return new Response('Something went wrong', { status: 500 })
	}
}

export const DELETE = async ({ request }: any) => {

	try {
		const body = await request.json()
		console.log(body.role)

		if (body.role === 'deleteOne') {
			const myCollection = client.collections.get('Chunks')

			const response = await myCollection.data.deleteMany(
				myCollection.filter.byProperty('file_name').like(body.fileName)
			)

			console.log(JSON.stringify(response))
		} else if(body.role === 'deleteAll') {
			const myCollection = client.collections.get('Chunks')

			for (const fileName of body.fileNames) {
				const response = await myCollection.data.deleteMany(
					myCollection.filter.byProperty('file_name').like(fileName)
				)
				console.log(JSON.stringify(response))
			}
			console.log("All chunks deleted")
		}

		return new Response(JSON.stringify({ message: 'Successfully deleted' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
	} catch (error) {
		return new Response('Something went wrong', { status: 500 })
	}
}
