<script lang="ts">
	import '../app.css';
	import { Trash2Icon } from '@lucide/svelte';
	import { getChatId, setChatId } from '$lib';

	let { children, data } = $props();

	async function handleSwitchChat(chatId: string) {
		const id = getChatId();
		if (id === chatId) return;

		setChatId(chatId);
		window.location.reload();
	}

	async function handleDeleteChat(chatId: string) {
		if (!confirm('Certeza que quer apagar essa conversa?')) return;
		await fetch(`/api/chat?chatId=${chatId}`, {
			method: 'DELETE'
		});

		window.location.reload();
	}
</script>

<svelte:head></svelte:head>

<section>
	{#if data.chats.length}
		<nav>
			{#each data.chats as chat, index}
				<div class="chat-button">
					<button type="button" onclick={() => handleSwitchChat(chat.chat_id)}
						>Chat {index}<br />({chat.updated_at})</button
					>
					<button type="button" onclick={() => handleDeleteChat(chat.chat_id)}
						><Trash2Icon /></button
					>
				</div>
			{/each}
		</nav>
	{/if}
	{@render children()}
</section>

<style>
	section {
		display: flex;
		height: 100%;
		width: 100%;
	}

	nav {
		padding: 2rem;
		flex: 0 0 300px;
		gap: 1rem;
		display: flex;
		flex-direction: column;
	}

	.chat-button {
		gap: 1rem;
		display: flex;
		align-items: center;
	}

	.chat-button button {
		color: #cad3f5;
		height: fit-content;
	}
</style>
