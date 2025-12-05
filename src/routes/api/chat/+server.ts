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

/** Retorna as mensagens de um chat */
export const GET: RequestHandler = async ({ url }) => {
    const chatId = url.searchParams.get('chatId');

    if (!chatId) throw new Error("Sem ID");

    const chat = getChat(chatId);
    return json({ chat });
}

/** Faz uma pergunta ao chat e retorna uma stream de texto */
export const POST: RequestHandler = async ({ request }) => {
    const { prompt, chatId }: { prompt?: string, chatId?: string } = await request.json();
    if (!prompt || !chatId) throw new Error("Nenhuma pergunta foi feita");

    /** Carrega a base de dados */
    const system = loadDocs();
    /** Carrega mensagens passadas, se tiver alguma */
    const chat = getChat(chatId);

    const messages: ModelMessage[] = [...(chat?.messages ?? []), { role: "user", content: prompt }];

    const result = streamText({
        model: google('gemini-2.5-pro'),
        messages: [
            ...system,
            ...messages,
        ],
        onFinish(result) {
            /** Salva a pergunta do usuário e a resposta da LLM */
            saveChat(chatId, [...messages, { role: "assistant", content: result.text }]);
        }
    });

    return result.toTextStreamResponse();
};

/** Apaga um chat específico */
export const DELETE: RequestHandler = async ({ url }) => {
    const chatId = url.searchParams.get('chatId');

    if (!chatId) throw new Error("Sem ID");

    const chat = deleteChat(chatId);
    return json({ success: true });
}