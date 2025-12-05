export function getChatId() {
    let chatId = localStorage.getItem('chatId');
    if (!chatId) {
        chatId = crypto.randomUUID();
        localStorage.setItem('chatId', chatId);
    }
    return chatId;
}

export function newChatId() {
    const chatId = crypto.randomUUID();
    localStorage.setItem('chatId', chatId);
    return chatId;
}

export function setChatId(chatId: string) {
    localStorage.setItem('chatId', chatId);
}