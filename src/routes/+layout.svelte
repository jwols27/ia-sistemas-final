<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { PlusIcon, Trash2Icon } from '@lucide/svelte';
	import { getChatId, setChatId, newChatId } from '$lib';

	let { children, data } = $props();

	let currentChatId = $state('');

	/** Cria um novo chat */
	function handleNewChat() {
		newChatId();
		window.location.reload();
	}

	/** Troca de chat */
	async function handleSwitchChat(chatId: string) {
		const id = getChatId();
		if (id === chatId) return;

		setChatId(chatId);
		window.location.reload();
	}

	/** Apaga o chat especificado */
	async function handleDeleteChat(chatId: string) {
		if (!confirm('Certeza que quer apagar essa conversa?')) return;
		await fetch(`/api/chat?chatId=${chatId}`, {
			method: 'DELETE'
		});

		window.location.reload();
	}

	onMount(() => {
		currentChatId = getChatId();
	});
</script>

<svelte:head></svelte:head>

<section>
	{#if data.chats.length}
		<nav>
			<button class="new-chat-button" type="button" onclick={handleNewChat}
				><PlusIcon /> Novo chat</button
			>
			<hr />
			{#each data.chats as chat}
				<div class="chat-button" class:active={chat.chat_id === currentChatId}>
					<button type="button" onclick={() => handleSwitchChat(chat.chat_id)}
						>Chat {chat.chat_id.substring(0, 5)}<br />({chat.updated_at})</button
					>
					<button class="delete-button" type="button" onclick={() => handleDeleteChat(chat.chat_id)}
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
		padding: 1rem;
		flex: 0 1 1;
		gap: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #24273a;
		max-width: 30%;
	}

	hr {
		height: 1px;
		width: 100%;
		background-color: #6e738d;
		margin-bottom: 0.5em;
	}

	.new-chat-button {
		width: 100%;
		transition: all 200ms ease;

		&:hover {
			color: #24273a;
			background-color: #c6a0f6;
		}
	}

	.chat-button {
		border: 1px solid currentColor;
	}

	.new-chat-button,
	.chat-button {
		gap: 1rem;
		color: #cad3f5;
		display: flex;
		align-items: center;
		padding: 0.5em;
		border-radius: 14px;
	}

	.chat-button.active {
		color: #363a4f;
		background-color: #c6a0f6;
	}

	.chat-button button {
		color: inherit;
		height: fit-content;
		gap: 0.5em;
		display: flex;
		align-items: center;
	}

	.delete-button {
		border-radius: 14px;
		padding: 0.5em;

		&:hover {
			color: #cad3f5;
			background-color: #b9383b;
		}
	}
</style>
