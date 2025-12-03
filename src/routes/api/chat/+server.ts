import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, type ModelMessage } from 'ai';
import { GOOGLE_GENERATIVE_AI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { loadDocs } from '$lib/server/docs';
import { deleteChat, getChat, saveChat } from '$lib/server/db';
import { json } from '@sveltejs/kit';

const google = createGoogleGenerativeAI({
    apiKey: GOOGLE_GENERATIVE_AI_API_KEY
});

export const GET: RequestHandler = async ({ url }) => {
    const chatId = url.searchParams.get('chatId');

    if (!chatId) throw new Error("No ID received");

    const chat = getChat(chatId);
    return json({ chat });
}

export const POST: RequestHandler = async ({ request }) => {
    const { prompt, chatId }: { prompt?: string, chatId?: string } = await request.json();
    if (!prompt || !chatId) throw new Error("No prompt received");

    const system = loadDocs();
    const chat = getChat(chatId);

    const messages: ModelMessage[] = [...(chat?.messages ?? []), { role: "user", content: prompt }];

    console.log({ chatId, messages })

    const result = streamText({
        model: google('gemini-2.5-pro'),
        messages: [
            ...system,
            ...messages,
        ],
        onFinish(result) {
            saveChat(chatId, [...messages, { role: "assistant", content: result.text }]);
        }
    });

    return result.toTextStreamResponse();
};

export const DELETE: RequestHandler = async ({ url }) => {
    const chatId = url.searchParams.get('chatId');

    if (!chatId) throw new Error("No ID received");

    const chat = deleteChat(chatId);
    return json({ success: true });
}