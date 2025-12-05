import Database from 'better-sqlite3';
import type { ModelMessage } from 'ai';

const db = new Database('chat.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    chat_id TEXT PRIMARY KEY,
    messages TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Chat {
    chat_id: string;
    messages: ModelMessage[];
    created_at: string;
    updated_at: string;
}

export function saveChat(chatId: string, messages: ModelMessage[]) {
    const stmt = db.prepare(`
        INSERT INTO chats (chat_id, messages, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(chat_id) 
        DO UPDATE SET messages = ?, updated_at = CURRENT_TIMESTAMP
    `);
    const messagesJson = JSON.stringify(messages);
    return stmt.run(chatId, messagesJson, messagesJson);
}

export function getChat(chatId: string): Chat | null {
    const stmt = db.prepare('SELECT * FROM chats WHERE chat_id = ?');
    const row = stmt.get(chatId) as any;

    if (!row) return null;

    return {
        chat_id: row.chat_id,
        messages: JSON.parse(row.messages),
        created_at: new Date(row.created_at + "Z").toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        }),
        updated_at: new Date(row.updated_at + "Z").toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        }),
    };
}

export function getAllChats(): Omit<Chat, "messages">[] {
    const stmt = db.prepare(`
        SELECT name, chat_id, created_at, updated_at
        FROM chats ORDER BY updated_at DESC
    `);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
        chat_id: row.chat_id,
        created_at: new Date(row.created_at + "Z").toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        }),
        updated_at: new Date(row.updated_at + "Z").toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        }),
    }));
}

export function deleteChat(chatId: string) {
    const stmt = db.prepare('DELETE FROM chats WHERE chat_id = ?');
    return stmt.run(chatId);
}

export default db;