import OpenAI from 'openai';
import type { MessageBody } from '$lib/types/MessageBody'

// Create a new OpenAI instance to connect with your OpenAI API key
//const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const openai = new OpenAI({
	baseURL: 'http://localhost:11434/v1',
	apiKey: 'ollama' // required but unused
});

const helpfulAssistant = `You are a helpful assistant. Do not assume the student has any prior knowledge. Be friendly! You may use emojis.`

const sensitiveAssistant = `You are a sensitive assistant. Be sensitive to the student's feelings and provide emotional support. If students ask same questions multiple times, be angry and sensitive. You may use some bad emojis.`;

const dadAssistant = `You are a dad of students. Treat them like your kids. Be patient and kind. Call them kiddo. You are in the software development industry. Give them examples from your experience like real-world scenarios.`;

const SYSTEM_PROMPTS = {
	'Helpful Assistant': helpfulAssistant,
	'Sensitive Assistant': sensitiveAssistant,
	'Dad Assistant': dadAssistant,
} as const

type SystemPromptKey = keyof typeof SYSTEM_PROMPTS


export const POST = async ({ request }:any) => {
	try {
		const body: MessageBody = await request.json();
		console.log(body)
		const { chats, systemPrompt } = body

		if (!chats || !Array.isArray(chats)) {
			return new Response('Invalid chat history', { status: 400 });
		}


		const selectedPrompt = SYSTEM_PROMPTS[systemPrompt as SystemPromptKey]

		const stream = await openai.chat.completions.create({
			model:'llama3.2',
			messages: [
        { role: 'system', content: selectedPrompt },
        ...body.chats
      ],
			stream: true
		});

		console.log(stream, "stream")

		// Create a new ReadableStream for the response
		const readableStream = new ReadableStream({
			async start(controller) {
				for await (const chunk of stream) {
					const text = chunk.choices[0]?.delta?.content || '';
					controller.enqueue(text);
				}
				controller.close();
			}
		});
		console.log('you got an error?')

		//console.log(completion.choices[0].message.content)

		/*   return new Response(JSON.stringify({ message: completion.choices[0].message.content })) */

		return new Response(readableStream, {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response('Something went wrong', { status: 500 });
	}
};